import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Landmark,
  Laptop,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User as UserIcon,
} from "lucide-react";
import { PublicLayout } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Spinner, SkeletonGrid } from "@/components/states/loading";
import { EmptyState } from "@/components/states/empty";
import { ErrorState } from "@/components/states/error";
import { AppointmentService } from "@/services";
import {
  availabilityQuery,
  psychologistsQuery,
  servicesQuery,
} from "@/queries";
import type {
  ConsultationMode,
  Psychologist,
  Service,
} from "@/types";
import { formatMoney, initials } from "@/lib/format";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book an Appointment | Mindwell" },
      {
        name: "description",
        content:
          "Complete a private, guided nine-step booking to schedule your psychology appointment.",
      },
      { property: "og:title", content: "Book an Appointment | Mindwell" },
      {
        property: "og:description",
        content: "A simple, secure way to take the next step.",
      },
      { property: "og:url", content: "/book" },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(servicesQuery({ pageSize: 50 })),
      context.queryClient.ensureQueryData(psychologistsQuery({ pageSize: 50 })),
    ]),
  component: BookPage,
});

const STEPS = [
  "Service",
  "Format",
  "Therapist",
  "Date",
  "Time",
  "Your details",
  "Concerns",
  "Payment",
  "Review",
] as const;

type PaymentMethod = "card" | "insurance" | "bank_transfer";

interface BookingDraft {
  serviceId: string | null;
  mode: ConsultationMode | null;
  psychologistId: string | null;
  date: Date | null;
  slotId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  reason: string;
  notes: string;
  paymentMethod: PaymentMethod | null;
  consent: boolean;
}

const initialDraft: BookingDraft = {
  serviceId: null,
  mode: null,
  psychologistId: null,
  date: null,
  slotId: null,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  reason: "",
  notes: "",
  paymentMethod: null,
  consent: false,
};

function BookPage() {
  const { data: servicesData } = useSuspenseQuery(servicesQuery({ pageSize: 50 }));
  const { data: psychologistsData } = useSuspenseQuery(
    psychologistsQuery({ pageSize: 50 }),
  );
  const services = servicesData.results;
  const psychologists = psychologistsData.results;

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<BookingDraft>(initialDraft);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const update = <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const selectedService = useMemo(
    () => services.find((s) => s.id === draft.serviceId) ?? null,
    [services, draft.serviceId],
  );
  const selectedPsychologist = useMemo(
    () => psychologists.find((p) => p.id === draft.psychologistId) ?? null,
    [psychologists, draft.psychologistId],
  );

  const availability = useQuery({
    ...availabilityQuery(draft.psychologistId ?? undefined),
    enabled: !!draft.psychologistId,
  });

  const dateKey = draft.date ? toDateKey(draft.date) : null;
  const slotsForDate = useMemo(() => {
    if (!availability.data || !dateKey) return [];
    return availability.data
      .filter((s) => s.date === dateKey)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [availability.data, dateKey]);

  const availableDateKeys = useMemo(() => {
    if (!availability.data) return new Set<string>();
    return new Set(availability.data.filter((s) => !s.isBooked).map((s) => s.date));
  }, [availability.data]);

  const selectedSlot = slotsForDate.find((s) => s.id === draft.slotId) ?? null;

  const mutation = useMutation({
    mutationFn: () => {
      if (!selectedService || !selectedPsychologist || !selectedSlot || !draft.date)
        throw new Error("Missing booking details");
      const startsAt = combineDateTime(draft.date, selectedSlot.startTime);
      const endsAt = combineDateTime(draft.date, selectedSlot.endTime);
      return AppointmentService.create({
        serviceId: selectedService.id,
        psychologistId: selectedPsychologist.id,
        mode: draft.mode ?? "online",
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
      });
    },
    onSuccess: (appt) => setConfirmedId(appt.id),
  });

  const canContinue = isStepValid(step, draft);
  const total = STEPS.length;

  if (confirmedId) {
    return (
      <PublicLayout>
        <ConfirmationView
          id={confirmedId}
          draft={draft}
          service={selectedService}
          psychologist={selectedPsychologist}
          slotTime={selectedSlot?.startTime ?? ""}
        />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="mx-auto max-w-5xl px-5 py-14">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[.18em] text-primary">
            Private &amp; secure booking
          </p>
          <h1 className="mt-4 font-display text-4xl">Find a time that feels right</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Nine gentle steps. You can pause and come back any time — nothing is shared until you confirm.
          </p>
        </div>

        <Stepper step={step} total={total} />

        <div className="warm-card mt-8 p-6 sm:p-10">
          <header className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Step {step} of {total}
              </p>
              <h2 className="font-display text-2xl">{STEPS[step - 1]}</h2>
            </div>
            {selectedService && (
              <span className="hidden rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-primary sm:inline-flex">
                {selectedService.title}
              </span>
            )}
          </header>

          {step === 1 && (
            <ServiceStep services={services} value={draft.serviceId} onChange={(v) => update("serviceId", v)} />
          )}
          {step === 2 && (
            <ModeStep
              value={draft.mode}
              modes={selectedService?.modes ?? ["online", "in_person"]}
              onChange={(v) => update("mode", v)}
            />
          )}
          {step === 3 && (
            <PsychologistStep
              psychologists={psychologists}
              value={draft.psychologistId}
              onChange={(v) => {
                update("psychologistId", v);
                update("slotId", null);
                update("date", null);
              }}
            />
          )}
          {step === 4 && (
            <DateStep
              isLoading={availability.isLoading}
              isError={availability.isError}
              onRetry={() => availability.refetch()}
              date={draft.date}
              onChange={(d) => {
                update("date", d);
                update("slotId", null);
              }}
              availableDateKeys={availableDateKeys}
            />
          )}
          {step === 5 && (
            <TimeStep
              isLoading={availability.isLoading}
              date={draft.date}
              slots={slotsForDate}
              value={draft.slotId}
              onChange={(v) => update("slotId", v)}
            />
          )}
          {step === 6 && <DetailsStep draft={draft} update={update} />}
          {step === 7 && <ConcernsStep draft={draft} update={update} />}
          {step === 8 && (
            <PaymentStep
              value={draft.paymentMethod}
              onChange={(v) => update("paymentMethod", v)}
              price={selectedService?.price}
            />
          )}
          {step === 9 && (
            <ReviewStep
              draft={draft}
              service={selectedService}
              psychologist={selectedPsychologist}
              slotTime={selectedSlot?.startTime ?? ""}
              consent={draft.consent}
              onConsent={(v) => update("consent", v)}
              isSubmitting={mutation.isPending}
              error={mutation.isError ? (mutation.error as Error).message : null}
              onRetry={() => mutation.reset()}
            />
          )}

          <div className="mt-10 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
            <Button
              variant="ghost"
              disabled={step === 1 || mutation.isPending}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
            >
              <ArrowLeft aria-hidden="true" /> Back
            </Button>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
              Encrypted &amp; confidential
            </div>
            {step < total ? (
              <Button
                disabled={!canContinue}
                onClick={() => setStep((s) => Math.min(total, s + 1))}
              >
                Continue <ArrowRight aria-hidden="true" />
              </Button>
            ) : (
              <Button
                disabled={!canContinue || mutation.isPending}
                onClick={() => mutation.mutate()}
              >
                {mutation.isPending ? (
                  <>
                    <Spinner className="size-4" /> Confirming…
                  </>
                ) : (
                  <>
                    Confirm booking <Check aria-hidden="true" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

// ---------- Stepper ----------
function Stepper({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <Progress value={pct} aria-label={`Booking progress: step ${step} of ${total}`} />
      <ol
        className="mt-4 grid grid-cols-9 gap-1 text-[10px] sm:text-xs"
        aria-label="Booking steps"
      >
        {STEPS.map((label, i) => {
          const idx = i + 1;
          const state = idx < step ? "done" : idx === step ? "current" : "upcoming";
          return (
            <li
              key={label}
              className="flex flex-col items-center gap-1 text-center"
              aria-current={state === "current" ? "step" : undefined}
            >
              <span
                className={
                  state === "done"
                    ? "grid size-7 place-items-center rounded-full bg-primary text-primary-foreground"
                    : state === "current"
                      ? "grid size-7 place-items-center rounded-full border-2 border-primary bg-background font-semibold text-primary"
                      : "grid size-7 place-items-center rounded-full border border-border bg-card text-muted-foreground"
                }
              >
                {state === "done" ? <Check className="size-3.5" aria-hidden="true" /> : idx}
              </span>
              <span className="hidden text-muted-foreground sm:block">{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ---------- Steps ----------
function ServiceStep({
  services,
  value,
  onChange,
}: {
  services: Service[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  if (services.length === 0)
    return (
      <EmptyState
        title="No services available"
        description="Please check back soon or contact us directly."
      />
    );
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {services.map((s) => {
        const active = value === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            aria-pressed={active}
            className={
              active
                ? "rounded-2xl border-2 border-primary bg-secondary p-5 text-left transition"
                : "rounded-2xl border border-border bg-card p-5 text-left transition hover:border-primary/40"
            }
          >
            <div className="flex items-start justify-between gap-3">
              <strong className="font-display text-lg">{s.title}</strong>
              <span className="rounded-full bg-background px-2 py-0.5 text-xs font-semibold text-primary">
                {formatMoney(s.price)}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{s.shortDescription}</p>
            <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
              {s.durationMinutes} min · {s.category.replace("-", " ")}
            </p>
          </button>
        );
      })}
    </div>
  );
}

function ModeStep({
  value,
  modes,
  onChange,
}: {
  value: ConsultationMode | null;
  modes: ConsultationMode[];
  onChange: (m: ConsultationMode) => void;
}) {
  const options: {
    key: ConsultationMode;
    label: string;
    Icon: typeof Laptop;
    desc: string;
  }[] = [
    {
      key: "online",
      label: "Online",
      Icon: Laptop,
      desc: "Secure video from your own space — perfect for busy weeks.",
    },
    {
      key: "in_person",
      label: "In person",
      Icon: MapPin,
      desc: "Visit our calm, accessible clinic in San Francisco.",
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {options.map(({ key, label, Icon, desc }) => {
        const enabled = modes.includes(key);
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            disabled={!enabled}
            aria-pressed={active}
            onClick={() => onChange(key)}
            className={
              active
                ? "rounded-2xl border-2 border-primary bg-secondary p-6 text-left"
                : enabled
                  ? "rounded-2xl border border-border bg-card p-6 text-left hover:border-primary/40"
                  : "cursor-not-allowed rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-left opacity-60"
            }
          >
            <Icon className="text-primary" aria-hidden="true" />
            <strong className="mt-4 block font-display text-lg">{label}</strong>
            <span className="mt-2 block text-sm text-muted-foreground">{desc}</span>
            {!enabled && (
              <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Not offered for this service
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function PsychologistStep({
  psychologists,
  value,
  onChange,
}: {
  psychologists: Psychologist[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  if (psychologists.length === 0)
    return (
      <EmptyState
        title="No therapists available"
        description="All of our clinicians are at capacity. Please try again soon."
      />
    );
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {psychologists.map((p) => {
        const active = value === p.id;
        const disabled = !p.acceptingNewPatients;
        return (
          <button
            key={p.id}
            type="button"
            disabled={disabled}
            aria-pressed={active}
            onClick={() => onChange(p.id)}
            className={
              active
                ? "flex gap-4 rounded-2xl border-2 border-primary bg-secondary p-5 text-left"
                : disabled
                  ? "flex cursor-not-allowed gap-4 rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-left opacity-60"
                  : "flex gap-4 rounded-2xl border border-border bg-card p-5 text-left hover:border-primary/40"
            }
          >
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary/15 font-display text-lg text-primary">
              {initials(p.firstName, p.lastName)}
            </span>
            <div className="min-w-0">
              <strong className="block font-display text-base">
                {p.title ? `${p.title} ` : ""}
                {p.firstName} {p.lastName}
              </strong>
              <p className="mt-1 text-sm text-muted-foreground">{p.headline}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                ★ {p.rating.toFixed(1)} ({p.reviewCount}) · {p.yearsExperience} yrs ·{" "}
                {formatMoney(p.sessionPrice)}
              </p>
              {disabled && (
                <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Waitlist only
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function DateStep({
  isLoading,
  isError,
  onRetry,
  date,
  onChange,
  availableDateKeys,
}: {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  date: Date | null;
  onChange: (d: Date) => void;
  availableDateKeys: Set<string>;
}) {
  if (isLoading) return <SkeletonGrid count={4} className="md:grid-cols-2" />;
  if (isError)
    return (
      <ErrorState
        title="Couldn't load availability"
        description="We couldn't reach the scheduling service."
        onRetry={onRetry}
      />
    );
  if (availableDateKeys.size === 0)
    return (
      <EmptyState
        title="No open dates this week"
        description="This therapist is fully booked. Try another clinician or check back soon."
      />
    );

  return (
    <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-10">
      <div className="warm-card p-4">
        <Calendar
          mode="single"
          selected={date ?? undefined}
          onSelect={(d) => d && onChange(d)}
          disabled={(d) => !availableDateKeys.has(toDateKey(d))}
          className="pointer-events-auto p-3"
        />
      </div>
      <div className="flex-1 space-y-3 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">Choose a day that works</p>
        <p>Highlighted dates have open times. You'll pick a specific slot next.</p>
        {date && (
          <p className="rounded-xl bg-secondary p-3 text-foreground">
            <CalendarDays className="mr-2 inline size-4 text-primary" aria-hidden="true" />
            Selected: {date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </p>
        )}
      </div>
    </div>
  );
}

function TimeStep({
  isLoading,
  date,
  slots,
  value,
  onChange,
}: {
  isLoading: boolean;
  date: Date | null;
  slots: { id: string; startTime: string; endTime: string; isBooked: boolean }[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  if (!date)
    return <EmptyState title="Pick a date first" description="Go back one step to choose a day." />;
  if (isLoading)
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-xl bg-primary/10" />
        ))}
      </div>
    );
  const free = slots.filter((s) => !s.isBooked);
  if (free.length === 0)
    return (
      <EmptyState
        title="No times on this day"
        description="Try selecting another date — the calendar shows availability in real time."
      />
    );

  return (
    <div>
      <div className="mb-4 flex items-center gap-3 rounded-xl bg-secondary p-4">
        <CalendarDays className="text-primary" aria-hidden="true" />
        <span className="font-medium">
          {date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {slots.map((s) => {
          const active = value === s.id;
          return (
            <button
              key={s.id}
              type="button"
              disabled={s.isBooked}
              aria-pressed={active}
              onClick={() => onChange(s.id)}
              className={
                active
                  ? "flex min-h-12 items-center justify-center rounded-xl border-2 border-primary bg-secondary font-semibold text-primary"
                  : s.isBooked
                    ? "flex min-h-12 cursor-not-allowed items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground opacity-60"
                    : "flex min-h-12 items-center justify-center rounded-xl border border-border hover:border-primary hover:bg-secondary"
              }
            >
              {format12h(s.startTime)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DetailsStep({
  draft,
  update,
}: {
  draft: BookingDraft;
  update: <K extends keyof BookingDraft>(k: K, v: BookingDraft[K]) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="First name" icon={<UserIcon className="size-4" />}>
        <Input
          value={draft.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          autoComplete="given-name"
          maxLength={60}
          required
        />
      </Field>
      <Field label="Last name" icon={<UserIcon className="size-4" />}>
        <Input
          value={draft.lastName}
          onChange={(e) => update("lastName", e.target.value)}
          autoComplete="family-name"
          maxLength={60}
          required
        />
      </Field>
      <Field label="Email" icon={<Mail className="size-4" />}>
        <Input
          type="email"
          value={draft.email}
          onChange={(e) => update("email", e.target.value)}
          autoComplete="email"
          maxLength={120}
          required
        />
      </Field>
      <Field label="Phone" icon={<Phone className="size-4" />}>
        <Input
          type="tel"
          value={draft.phone}
          onChange={(e) => update("phone", e.target.value)}
          autoComplete="tel"
          maxLength={20}
          required
        />
      </Field>
      <Field label="Date of birth" icon={<CalendarDays className="size-4" />}>
        <Input
          type="date"
          value={draft.dateOfBirth}
          onChange={(e) => update("dateOfBirth", e.target.value)}
          required
        />
      </Field>
    </div>
  );
}

function ConcernsStep({
  draft,
  update,
}: {
  draft: BookingDraft;
  update: <K extends keyof BookingDraft>(k: K, v: BookingDraft[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <Field
        label="What brings you in?"
        icon={<ClipboardList className="size-4" />}
        hint="A sentence or two helps your therapist prepare a warm welcome."
      >
        <Textarea
          rows={4}
          value={draft.reason}
          onChange={(e) => update("reason", e.target.value)}
          maxLength={500}
          placeholder="e.g. I've been feeling anxious about work and would like support."
          required
        />
      </Field>
      <Field
        label="Anything else we should know? (optional)"
        icon={<Sparkles className="size-4" />}
      >
        <Textarea
          rows={3}
          value={draft.notes}
          onChange={(e) => update("notes", e.target.value)}
          maxLength={500}
          placeholder="Accessibility needs, preferred pronouns, scheduling preferences…"
        />
      </Field>
    </div>
  );
}

function PaymentStep({
  value,
  onChange,
  price,
}: {
  value: PaymentMethod | null;
  onChange: (v: PaymentMethod) => void;
  price?: { amount: number; currency: "USD" | "EUR" | "GBP" | "AUD" | "CAD" };
}) {
  const options: { key: PaymentMethod; label: string; desc: string; Icon: typeof CreditCard }[] = [
    {
      key: "card",
      label: "Credit / debit card",
      desc: "Charged after your session is confirmed.",
      Icon: CreditCard,
    },
    {
      key: "insurance",
      label: "Insurance",
      desc: "We'll prepare a superbill for reimbursement.",
      Icon: ShieldCheck,
    },
    {
      key: "bank_transfer",
      label: "Bank transfer",
      desc: "Receive an invoice with payment instructions.",
      Icon: Landmark,
    },
  ];
  return (
    <div className="space-y-4">
      {price && (
        <div className="flex items-center justify-between rounded-xl bg-secondary p-4 text-sm">
          <span className="text-muted-foreground">Session fee</span>
          <span className="font-display text-lg">{formatMoney(price)}</span>
        </div>
      )}
      <div className="grid gap-3">
        {options.map(({ key, label, desc, Icon }) => {
          const active = value === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(key)}
              className={
                active
                  ? "flex items-start gap-4 rounded-2xl border-2 border-primary bg-secondary p-5 text-left"
                  : "flex items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left hover:border-primary/40"
              }
            >
              <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <strong className="block font-display text-base">{label}</strong>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        No payment method is charged today. You'll receive a secure link after your therapist confirms.
      </p>
    </div>
  );
}

function ReviewStep({
  draft,
  service,
  psychologist,
  slotTime,
  consent,
  onConsent,
  isSubmitting,
  error,
  onRetry,
}: {
  draft: BookingDraft;
  service: Service | null;
  psychologist: Psychologist | null;
  slotTime: string;
  consent: boolean;
  onConsent: (v: boolean) => void;
  isSubmitting: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  const rows: { label: string; value: string; Icon: typeof Stethoscope }[] = [
    { label: "Service", value: service?.title ?? "—", Icon: Stethoscope },
    {
      label: "Format",
      value: draft.mode === "in_person" ? "In person" : "Online video",
      Icon: draft.mode === "in_person" ? Building2 : Laptop,
    },
    {
      label: "Therapist",
      value: psychologist
        ? `${psychologist.title ? psychologist.title + " " : ""}${psychologist.firstName} ${psychologist.lastName}`
        : "—",
      Icon: UserIcon,
    },
    {
      label: "When",
      value: draft.date
        ? `${draft.date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} · ${format12h(slotTime)}`
        : "—",
      Icon: CalendarDays,
    },
    { label: "Name", value: `${draft.firstName} ${draft.lastName}`.trim() || "—", Icon: UserIcon },
    { label: "Email", value: draft.email || "—", Icon: Mail },
    { label: "Phone", value: draft.phone || "—", Icon: Phone },
    {
      label: "Payment",
      value:
        draft.paymentMethod === "card"
          ? "Credit / debit card"
          : draft.paymentMethod === "insurance"
            ? "Insurance"
            : draft.paymentMethod === "bank_transfer"
              ? "Bank transfer"
              : "—",
      Icon: CreditCard,
    },
  ];
  return (
    <div className="space-y-6">
      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map(({ label, value, Icon }) => (
          <div key={label} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
            <Icon className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {label}
              </dt>
              <dd className="mt-1 text-sm font-medium">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
      {draft.reason && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            What brings you in
          </p>
          <p className="mt-2 text-sm leading-6">{draft.reason}</p>
        </div>
      )}
      <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-secondary p-4 text-sm">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => onConsent(e.target.checked)}
          className="mt-1 size-4 accent-primary"
        />
        <span>
          I agree to the{" "}
          <Link to="/privacy" className="font-semibold text-primary underline-offset-4 hover:underline">
            privacy policy
          </Link>{" "}
          and{" "}
          <Link to="/terms" className="font-semibold text-primary underline-offset-4 hover:underline">
            terms of service
          </Link>
          , and consent to being contacted about my appointment.
        </span>
      </label>
      {error && (
        <ErrorState
          title="We couldn't confirm your booking"
          description={error}
          onRetry={onRetry}
        />
      )}
      {isSubmitting && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner className="size-4" /> Holding your slot…
        </p>
      )}
    </div>
  );
}

// ---------- Confirmation ----------
function ConfirmationView({
  id,
  draft,
  service,
  psychologist,
  slotTime,
}: {
  id: string;
  draft: BookingDraft;
  service: Service | null;
  psychologist: Psychologist | null;
  slotTime: string;
}) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <div className="warm-card p-8 text-center sm:p-12">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary/15 text-primary">
          <CheckCircle2 className="size-9" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-4xl">You're booked</h1>
        <p className="mt-3 text-muted-foreground">
          A confirmation is on its way to{" "}
          <strong className="text-foreground">{draft.email || "your email"}</strong>. We'll send a
          gentle reminder the day before.
        </p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Reference {id}
        </p>

        <dl className="mt-8 grid gap-3 text-left sm:grid-cols-2">
          <SummaryRow label="Therapist" value={
            psychologist
              ? `${psychologist.title ? psychologist.title + " " : ""}${psychologist.firstName} ${psychologist.lastName}`
              : "—"
          } />
          <SummaryRow label="Service" value={service?.title ?? "—"} />
          <SummaryRow label="Format" value={draft.mode === "in_person" ? "In person" : "Online video"} />
          <SummaryRow
            label="When"
            value={
              draft.date
                ? `${draft.date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} · ${format12h(slotTime)}`
                : "—"
            }
          />
          {service && <SummaryRow label="Fee" value={formatMoney(service.price)} />}
          <SummaryRow
            label="Payment"
            value={
              draft.paymentMethod === "card"
                ? "Card on file"
                : draft.paymentMethod === "insurance"
                  ? "Insurance"
                  : "Bank transfer"
            }
          />
        </dl>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link to="/">Back to home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/resources">Browse calming resources</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}

// ---------- Small helpers ----------
function Field({
  label,
  icon,
  hint,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm">
        {icon && <span className="text-primary">{icon}</span>}
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function toDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function combineDateTime(date: Date, time: string) {
  const [h, m] = time.split(":").map(Number);
  const out = new Date(date);
  out.setHours(h, m, 0, 0);
  return out;
}

function format12h(t: string) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, "0")} ${period}`;
}

function isEmail(s: string) {
  return /.+@.+\..+/.test(s.trim());
}

function isStepValid(step: number, d: BookingDraft): boolean {
  switch (step) {
    case 1:
      return !!d.serviceId;
    case 2:
      return !!d.mode;
    case 3:
      return !!d.psychologistId;
    case 4:
      return !!d.date;
    case 5:
      return !!d.slotId;
    case 6:
      return (
        d.firstName.trim().length > 0 &&
        d.lastName.trim().length > 0 &&
        isEmail(d.email) &&
        d.phone.trim().length >= 6 &&
        d.dateOfBirth.length > 0
      );
    case 7:
      return d.reason.trim().length >= 5;
    case 8:
      return !!d.paymentMethod;
    case 9:
      return d.consent;
    default:
      return false;
  }
}