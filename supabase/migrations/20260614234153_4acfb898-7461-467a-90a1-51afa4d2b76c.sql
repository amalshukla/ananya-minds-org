CREATE TYPE public.app_role AS ENUM ('admin', 'psychologist', 'patient');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  display_name TEXT NOT NULL DEFAULT '' CHECK (char_length(display_name) <= 120),
  phone TEXT CHECK (phone IS NULL OR char_length(phone) <= 30),
  avatar_url TEXT CHECK (avatar_url IS NULL OR char_length(avatar_url) <= 1000),
  bio TEXT CHECK (bio IS NULL OR char_length(bio) <= 1000),
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL DEFAULT 'patient',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  psychologist_id UUID,
  service_name TEXT NOT NULL CHECK (char_length(service_name) BETWEEN 1 AND 120),
  starts_at TIMESTAMPTZ NOT NULL,
  session_format TEXT NOT NULL CHECK (session_format IN ('online', 'in_person')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  private_note TEXT CHECK (private_note IS NULL OR char_length(private_note) <= 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can view own appointments" ON public.appointments FOR SELECT TO authenticated USING (auth.uid() = patient_id OR auth.uid() = psychologist_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Patients can create own appointments" ON public.appointments FOR INSERT TO authenticated WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Participants can update appointments" ON public.appointments FOR UPDATE TO authenticated USING (auth.uid() = patient_id OR auth.uid() = psychologist_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = patient_id OR auth.uid() = psychologist_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Patients can delete own pending appointments" ON public.appointments FOR DELETE TO authenticated USING (auth.uid() = patient_id AND status = 'pending');

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'patient');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();