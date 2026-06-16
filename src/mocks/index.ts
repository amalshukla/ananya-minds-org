/**
 * Production-quality mock data for the Mindwell platform.
 *
 * All UI components should consume this data through the service layer in
 * `src/services/` so the data source can be swapped for a real Django REST
 * Framework backend without component changes.
 */
import type {
  Appointment,
  AppNotification,
  AssessmentResult,
  AssessmentTemplate,
  AvailabilitySlot,
  BlogArticle,
  BlogCategory,
  CalendarEvent,
  DashboardStat,
  EmergencyContact,
  FAQ,
  Invoice,
  JournalEntry,
  Message,
  MessageThread,
  Patient,
  Payment,
  Psychologist,
  Resource,
  Review,
  Service,
  SOAPNote,
  Testimonial,
  TreatmentPlan,
  ClinicalReport,
} from "@/types";

const iso = (daysFromToday: number, hour = 9, minute = 0) => {
  const d = new Date(Date.UTC(2026, 5, 16, hour, minute));
  d.setUTCDate(d.getUTCDate() + daysFromToday);
  return d.toISOString();
};

// ---------- Services (14) ----------
export const services: Service[] = [
  { id: "svc_01", slug: "individual-therapy", title: "Individual therapy", shortDescription: "A private, supportive space for you.", description: "Weekly one-to-one psychotherapy tailored to your goals. Sessions blend evidence-based methods (CBT, ACT, schema therapy) with deep listening and warmth.", category: "individual", icon: "HeartHandshake", durationMinutes: 50, price: { amount: 180, currency: "USD" }, modes: ["online", "in_person"], outcomes: ["Reduced anxiety and low mood", "Healthier relationships", "Greater self-understanding"], whoItsFor: ["Adults navigating change", "People feeling stuck or overwhelmed"], popular: true },
  { id: "svc_02", slug: "anxiety-therapy", title: "Anxiety & panic support", shortDescription: "Calm your nervous system.", description: "Targeted treatment for generalised anxiety, panic, social anxiety, and worry. Practical tools you can use between sessions.", category: "individual", icon: "Sparkles", durationMinutes: 50, price: { amount: 180, currency: "USD" }, modes: ["online", "in_person"], outcomes: ["Fewer panic episodes", "Confidence in feared situations"], whoItsFor: ["Adults with anxiety, panic, or phobias"], popular: true },
  { id: "svc_03", slug: "depression-care", title: "Depression care", shortDescription: "Reconnect with what matters.", description: "Compassionate, structured support to lift mood, restore energy, and rebuild meaning.", category: "individual", icon: "Sun", durationMinutes: 50, price: { amount: 180, currency: "USD" }, modes: ["online", "in_person"], outcomes: ["Improved mood and motivation", "Restored daily routines"], whoItsFor: ["Adults experiencing low mood or burnout"] },
  { id: "svc_04", slug: "trauma-therapy", title: "Trauma-focused therapy", shortDescription: "Gentle, paced trauma care.", description: "Specialist treatment using EMDR and trauma-focused CBT for single-event and complex trauma.", category: "individual", icon: "Shield", durationMinutes: 60, price: { amount: 220, currency: "USD" }, modes: ["in_person"], outcomes: ["Reduced flashbacks", "Greater sense of safety"], whoItsFor: ["Adults with PTSD or complex trauma"] },
  { id: "svc_05", slug: "couples-therapy", title: "Couples therapy", shortDescription: "Reconnect with each other.", description: "Evidence-based couples work (Gottman, EFT) to repair trust, improve communication, and deepen intimacy.", category: "couples", icon: "Users", durationMinutes: 75, price: { amount: 260, currency: "USD" }, modes: ["online", "in_person"], outcomes: ["Constructive conversations", "Renewed connection"], whoItsFor: ["Partners in any stage of relationship"], popular: true },
  { id: "svc_06", slug: "family-therapy", title: "Family therapy", shortDescription: "Strengthen family bonds.", description: "Systemic family therapy for parents, siblings, and blended families navigating tension or transition.", category: "family", icon: "UsersRound", durationMinutes: 75, price: { amount: 260, currency: "USD" }, modes: ["in_person"], outcomes: ["Healthier communication", "Shared agreements"], whoItsFor: ["Families seeking guided conversations"] },
  { id: "svc_07", slug: "child-therapy", title: "Child & adolescent therapy", shortDescription: "Support that meets kids where they are.", description: "Developmentally attuned therapy for children and teens, including play, art, and CBT approaches.", category: "child-adolescent", icon: "Smile", durationMinutes: 50, price: { amount: 200, currency: "USD" }, modes: ["in_person"], outcomes: ["Better emotion regulation", "Stronger coping skills"], whoItsFor: ["Children 6–17 and their families"] },
  { id: "svc_08", slug: "adhd-assessment", title: "Adult ADHD assessment", shortDescription: "Clarity and a clear plan.", description: "Comprehensive diagnostic assessment for adults exploring ADHD, with a detailed written report and recommendations.", category: "assessment", icon: "BrainCircuit", durationMinutes: 180, price: { amount: 950, currency: "USD" }, modes: ["online", "in_person"], outcomes: ["Diagnostic clarity", "Personalised recommendations"], whoItsFor: ["Adults exploring an ADHD diagnosis"] },
  { id: "svc_09", slug: "autism-assessment", title: "Autism assessment", shortDescription: "Affirming, neurodiversity-informed.", description: "Adult autism diagnostic assessment using gold-standard tools (ADOS-2, ADI-R) in a respectful, paced format.", category: "assessment", icon: "PuzzlePiece", durationMinutes: 240, price: { amount: 1450, currency: "USD" }, modes: ["in_person"], outcomes: ["Diagnostic clarity", "Strengths-based report"], whoItsFor: ["Adults exploring autism"] },
  { id: "svc_10", slug: "group-therapy", title: "Therapy groups", shortDescription: "Heal alongside others.", description: "Small, facilitated groups for anxiety, grief, and self-compassion. Eight weekly sessions.", category: "group", icon: "Users2", durationMinutes: 90, price: { amount: 80, currency: "USD" }, modes: ["online", "in_person"], outcomes: ["Shared understanding", "Skill-building in community"], whoItsFor: ["Adults open to group work"] },
  { id: "svc_11", slug: "perinatal-care", title: "Perinatal mental health", shortDescription: "Care through pregnancy & postpartum.", description: "Specialist support for anxiety, depression, and adjustment during pregnancy and the first year postpartum.", category: "individual", icon: "Heart", durationMinutes: 50, price: { amount: 190, currency: "USD" }, modes: ["online", "in_person"], outcomes: ["Steadier mood", "Confident parenting"], whoItsFor: ["Birthing parents and partners"] },
  { id: "svc_12", slug: "grief-counselling", title: "Grief counselling", shortDescription: "Companioned grief support.", description: "Compassionate, paced work to move through loss in your own way.", category: "individual", icon: "Cloud", durationMinutes: 50, price: { amount: 180, currency: "USD" }, modes: ["online", "in_person"], outcomes: ["Integrated grief", "Continuing bonds"], whoItsFor: ["Anyone living with loss"] },
  { id: "svc_13", slug: "executive-coaching", title: "Executive coaching", shortDescription: "Psychologically-informed coaching.", description: "Coaching for senior leaders integrating psychological insight, stress regulation, and leadership identity.", category: "coaching", icon: "BarChart3", durationMinutes: 60, price: { amount: 320, currency: "USD" }, modes: ["online", "in_person"], outcomes: ["Clearer leadership", "Sustainable performance"], whoItsFor: ["Founders and senior leaders"] },
  { id: "svc_14", slug: "wellbeing-checkin", title: "Wellbeing check-in", shortDescription: "A free 15-minute call.", description: "A short, no-pressure call to discuss what support might suit you. Free of charge.", category: "individual", icon: "MessagesSquare", durationMinutes: 15, price: { amount: 0, currency: "USD" }, modes: ["online"], outcomes: ["Clarity on next steps"], whoItsFor: ["Anyone curious about therapy"] },
];

// ---------- Psychologists (6) ----------
export const psychologists: Psychologist[] = [
  { id: "psy_01", email: "maya.bennett@mindwell.health", firstName: "Maya", lastName: "Bennett", role: "psychologist", title: "Dr.", headline: "Anxiety, trauma & women's mental health", bio: "Clinical psychologist with 15+ years of experience integrating CBT, EMDR, and compassion-focused therapy.", specialties: ["Anxiety", "Trauma", "Perinatal"], languages: ["English", "Spanish"], yearsExperience: 15, rating: 4.9, reviewCount: 184, sessionPrice: { amount: 220, currency: "USD" }, registrationNumber: "PSY-22841", acceptingNewPatients: true, isActive: true, createdAt: iso(-900) },
  { id: "psy_02", email: "noah.alvarez@mindwell.health", firstName: "Noah", lastName: "Alvarez", role: "psychologist", title: "Dr.", headline: "Couples, families & relational repair", bio: "Couples therapist trained in Gottman and Emotionally Focused Therapy.", specialties: ["Couples", "Family", "Communication"], languages: ["English"], yearsExperience: 12, rating: 4.8, reviewCount: 146, sessionPrice: { amount: 240, currency: "USD" }, registrationNumber: "PSY-30215", acceptingNewPatients: true, isActive: true, createdAt: iso(-800) },
  { id: "psy_03", email: "priya.shah@mindwell.health", firstName: "Priya", lastName: "Shah", role: "psychologist", title: "Dr.", headline: "Adult ADHD & autism assessments", bio: "Neuropsychologist specialising in adult ADHD and autism diagnostic assessment.", specialties: ["ADHD", "Autism", "Neurodiversity"], languages: ["English", "Hindi"], yearsExperience: 10, rating: 4.9, reviewCount: 92, sessionPrice: { amount: 260, currency: "USD" }, registrationNumber: "PSY-41008", acceptingNewPatients: false, isActive: true, createdAt: iso(-700) },
  { id: "psy_04", email: "sam.chen@mindwell.health", firstName: "Sam", lastName: "Chen", role: "psychologist", title: "", headline: "Child & adolescent therapy", bio: "Child and adolescent psychologist using play therapy and CBT.", specialties: ["Child", "Adolescent", "Anxiety"], languages: ["English", "Mandarin"], yearsExperience: 8, rating: 4.7, reviewCount: 71, sessionPrice: { amount: 200, currency: "USD" }, registrationNumber: "PSY-51330", acceptingNewPatients: true, isActive: true, createdAt: iso(-600) },
  { id: "psy_05", email: "amelia.okafor@mindwell.health", firstName: "Amelia", lastName: "Okafor", role: "psychologist", title: "Dr.", headline: "Depression, grief & life transitions", bio: "Warm, integrative therapist with a focus on grief, identity, and meaning.", specialties: ["Depression", "Grief", "Identity"], languages: ["English", "Yoruba"], yearsExperience: 11, rating: 4.8, reviewCount: 118, sessionPrice: { amount: 200, currency: "USD" }, registrationNumber: "PSY-33124", acceptingNewPatients: true, isActive: true, createdAt: iso(-500) },
  { id: "psy_06", email: "leon.muller@mindwell.health", firstName: "Leon", lastName: "Müller", role: "psychologist", title: "Dr.", headline: "Executive coaching & burnout recovery", bio: "Coaches founders and leaders through stress, burnout, and identity shifts.", specialties: ["Coaching", "Burnout", "Leadership"], languages: ["English", "German"], yearsExperience: 14, rating: 4.9, reviewCount: 64, sessionPrice: { amount: 320, currency: "USD" }, registrationNumber: "PSY-29011", acceptingNewPatients: true, isActive: true, createdAt: iso(-400) },
];

// ---------- Patients (16) ----------
const patientNames: ReadonlyArray<[string, string]> = [
  ["Ava", "Thompson"], ["Liam", "Patel"], ["Sophia", "Nguyen"], ["Ethan", "Garcia"],
  ["Olivia", "Rossi"], ["Noah", "Kim"], ["Mia", "Williams"], ["Lucas", "Park"],
  ["Harper", "Brooks"], ["Aiden", "Singh"], ["Zoe", "Anderson"], ["Mateo", "Diaz"],
  ["Ruby", "Foster"], ["Kai", "Wong"], ["Layla", "Hassan"], ["Owen", "Larsen"],
];
export const patients: Patient[] = patientNames.map(([first, last], i) => ({
  id: `pat_${String(i + 1).padStart(2, "0")}`,
  email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
  firstName: first,
  lastName: last,
  role: "patient",
  phone: `+1 415 555 ${String(2100 + i).padStart(4, "0")}`,
  dateOfBirth: `19${75 + (i % 25)}-0${(i % 9) + 1}-1${i % 9}`,
  pronouns: i % 2 === 0 ? "she/her" : "he/him",
  emergencyContactId: null,
  primaryPsychologistId: psychologists[i % psychologists.length].id,
  preferredMode: i % 3 === 0 ? "in_person" : "online",
  tags: i % 4 === 0 ? ["anxiety"] : i % 4 === 1 ? ["couples"] : i % 4 === 2 ? ["adhd"] : ["wellbeing"],
  isActive: i !== 14,
  createdAt: iso(-(30 + i * 11)),
}));

// ---------- Appointments (24) ----------
const apptStatuses = ["scheduled", "scheduled", "scheduled", "completed", "completed", "completed", "cancelled", "rescheduled", "no_show"] as const;
export const appointments: Appointment[] = Array.from({ length: 24 }, (_, i) => {
  const offset = i < 8 ? i + 1 : i < 16 ? -(i - 6) : -(i + 4);
  const hour = 9 + (i % 8);
  return {
    id: `apt_${String(i + 1).padStart(3, "0")}`,
    patientId: patients[i % patients.length].id,
    psychologistId: psychologists[i % psychologists.length].id,
    serviceId: services[i % services.length].id,
    startsAt: iso(offset, hour, 0),
    endsAt: iso(offset, hour, 50),
    mode: i % 3 === 0 ? "in_person" : "online",
    status: apptStatuses[i % apptStatuses.length],
    notes: i % 5 === 0 ? "Focus on sleep hygiene and morning routine." : null,
    meetingUrl: i % 3 === 0 ? null : "https://meet.mindwell.health/" + (1000 + i),
    location: i % 3 === 0 ? "Suite 200, San Francisco" : null,
    invoiceId: i % 2 === 0 ? `inv_${String((i % 12) + 1).padStart(3, "0")}` : null,
    createdAt: iso(-(60 + i)),
  };
});

// ---------- Availability slots (next 7 days × 6 times) ----------
const slotTimes: ReadonlyArray<[string, string]> = [
  ["09:00", "09:50"], ["10:30", "11:20"], ["12:00", "12:50"],
  ["14:00", "14:50"], ["15:30", "16:20"], ["17:00", "17:50"],
];
export const availabilitySlots: AvailabilitySlot[] = Array.from({ length: 7 }, (_, day) =>
  slotTimes.map(([startTime, endTime], i): AvailabilitySlot => {
    const date = new Date(Date.UTC(2026, 5, 16));
    date.setUTCDate(date.getUTCDate() + day + 1);
    return {
      id: `slot_${day}_${i}`,
      psychologistId: psychologists[(day + i) % psychologists.length].id,
      date: date.toISOString().slice(0, 10),
      startTime,
      endTime,
      isBooked: (day + i) % 4 === 0,
    };
  }),
).flat();

export const calendarEvents: CalendarEvent[] = appointments.slice(0, 12).map((a) => ({
  id: `evt_${a.id}`,
  title: services.find((s) => s.id === a.serviceId)?.title ?? "Appointment",
  start: a.startsAt,
  end: a.endsAt,
  kind: "appointment",
  appointmentId: a.id,
}));

// ---------- Testimonials (10) ----------
export const testimonials: Testimonial[] = [
  { id: "tst_01", authorInitials: "A.T.", authorContext: "Verified patient · Individual therapy", rating: 5, quote: "For the first time, I felt I could talk openly without having to explain or defend how I felt.", serviceId: "svc_01", publishedAt: iso(-30) },
  { id: "tst_02", authorInitials: "M.R.", authorContext: "Couples therapy", rating: 5, quote: "We learned to actually hear each other. The change in our home has been profound.", serviceId: "svc_05", publishedAt: iso(-45) },
  { id: "tst_03", authorInitials: "S.K.", authorContext: "Anxiety support", rating: 5, quote: "Practical, kind, and steady. I have tools now that I use every single day.", serviceId: "svc_02", publishedAt: iso(-60) },
  { id: "tst_04", authorInitials: "J.P.", authorContext: "Adult ADHD assessment", rating: 5, quote: "The assessment process was thorough, affirming, and gave me clarity I had been searching for.", serviceId: "svc_08", publishedAt: iso(-90) },
  { id: "tst_05", authorInitials: "D.N.", authorContext: "Grief counselling", rating: 5, quote: "Held with such care. I never felt rushed or judged. It made a difficult time a little softer.", serviceId: "svc_12", publishedAt: iso(-120) },
  { id: "tst_06", authorInitials: "L.O.", authorContext: "Perinatal mental health", rating: 5, quote: "I felt human again. The right kind of support at the right time.", serviceId: "svc_11", publishedAt: iso(-150) },
  { id: "tst_07", authorInitials: "R.F.", authorContext: "Executive coaching", rating: 5, quote: "More clarity in twelve sessions than I'd found in years of self-help books.", serviceId: "svc_13", publishedAt: iso(-180) },
  { id: "tst_08", authorInitials: "H.B.", authorContext: "Trauma therapy", rating: 5, quote: "I never thought I would feel safe in my own body again. I do.", serviceId: "svc_04", publishedAt: iso(-200) },
  { id: "tst_09", authorInitials: "C.W.", authorContext: "Therapy group", rating: 4, quote: "Sharing with others on the same path made me feel less alone.", serviceId: "svc_10", publishedAt: iso(-220) },
  { id: "tst_10", authorInitials: "E.G.", authorContext: "Individual therapy", rating: 5, quote: "Warm, professional, and never preachy. Genuinely the best therapist I have worked with.", serviceId: "svc_01", publishedAt: iso(-260) },
];

// ---------- Blog ----------
export const blogCategories: BlogCategory[] = [
  { id: "cat_01", slug: "anxiety", name: "Anxiety" },
  { id: "cat_02", slug: "relationships", name: "Relationships" },
  { id: "cat_03", slug: "neurodiversity", name: "Neurodiversity" },
  { id: "cat_04", slug: "wellbeing", name: "Wellbeing" },
  { id: "cat_05", slug: "therapy-explained", name: "Therapy explained" },
];

const blogTitles: ReadonlyArray<[string, string, string, string]> = [
  ["five-grounding-practices", "Five grounding practices for an anxious morning", "anxiety", "Simple, body-based exercises to steady yourself before the day starts."],
  ["when-to-seek-therapy", "How do you know it is time for therapy?", "therapy-explained", "Therapy is not only for crisis. Six signs it might be the right next step."],
  ["sleep-and-mood", "The honest link between sleep and mood", "wellbeing", "How sleep quietly shapes our mental health — and small changes that help."],
  ["adult-adhd-overlooked", "Why adult ADHD is so often overlooked", "neurodiversity", "What ADHD can look like in adulthood, and why so many people are diagnosed late."],
  ["couples-repair", "The two-minute repair that saves arguments", "relationships", "A short, evidence-based practice from Gottman research."],
  ["panic-not-dangerous", "Panic feels dangerous. Here is why it is not.", "anxiety", "Understanding the panic cycle is often the first step to breaking it."],
  ["self-compassion-myths", "Three myths about self-compassion", "wellbeing", "Self-compassion is not self-indulgence — and the research is clear on why."],
  ["autism-late-diagnosis", "Receiving an autism diagnosis as an adult", "neurodiversity", "What to expect, what changes, and what stays the same."],
  ["good-enough-parenting", "Good-enough parenting is the goal", "relationships", "Why perfection is the enemy of secure attachment."],
  ["first-session", "What actually happens in your first session", "therapy-explained", "A gentle walkthrough so the unknown feels a little more known."],
  ["burnout-vs-depression", "Burnout or depression — how do you tell?", "wellbeing", "They overlap, but treating the wrong one slows your recovery."],
  ["grief-non-linear", "Grief is not a staircase", "wellbeing", "Why the 'stages' model is being rethought, and what helps instead."],
];
export const blogArticles: BlogArticle[] = blogTitles.map(([slug, title, catSlug, excerpt], i) => ({
  id: `blog_${String(i + 1).padStart(2, "0")}`,
  slug,
  title,
  excerpt,
  content: `${excerpt}\n\nThis is a clinician-reviewed article exploring the topic in more depth. We share practical, evidence-based perspectives that you can apply gently and at your own pace. If anything here resonates strongly, that may be a signal worth honouring — and a therapist can help you explore it further.\n\nKey ideas covered in this article:\n\n• Why this matters and who it is for\n• What the research actually shows\n• Small, realistic practices to try this week\n• When professional support is worth considering`,
  coverImageUrl: `https://images.unsplash.com/photo-${1500000000 + i * 7777}?w=1200&auto=format&fit=crop`,
  categoryId: blogCategories.find((c) => c.slug === catSlug)?.id ?? blogCategories[0].id,
  tags: [catSlug, "evidence-based"],
  authorId: psychologists[i % psychologists.length].id,
  readingMinutes: 4 + (i % 6),
  publishedAt: iso(-(7 + i * 11)),
}));

// ---------- Resources (12) ----------
const resourceData: ReadonlyArray<[string, string, string, Resource["kind"], number?]> = [
  ["calm-breath", "A 4-minute calm breath", "Slow breathing audio to gently down-regulate your nervous system.", "audio", 4],
  ["worry-time", "Worry-time worksheet", "A simple worksheet to contain anxious thinking to a chosen window.", "worksheet"],
  ["values-cards", "Values clarification cards", "Sort your values to guide intentional change.", "worksheet"],
  ["body-scan", "10-minute body scan", "A guided practice to reconnect with your body.", "audio", 10],
  ["sleep-reset", "Sleep reset guide", "A 7-day plan for steadier, more restorative rest.", "guide"],
  ["panic-plan", "Panic response plan", "Step-by-step guide to follow during a panic episode.", "guide"],
  ["repair-script", "Repair conversation script", "A short framework for repairing after an argument.", "worksheet"],
  ["self-compassion-break", "Self-compassion break", "A 5-minute audio practice from compassion-focused therapy.", "audio", 5],
  ["first-session-prep", "Preparing for your first session", "What to think about and bring to your first appointment.", "article"],
  ["adhd-toolkit", "Adult ADHD toolkit", "Strategies for focus, follow-through, and emotional regulation.", "guide"],
  ["grief-letter", "A letter to your grief", "A gentle written practice for tending to loss.", "worksheet"],
  ["mindful-walk", "Mindful walking practice", "Take your nervous system outside, on purpose.", "audio", 8],
];
export const resources: Resource[] = resourceData.map(([slug, title, description, kind, durationMinutes], i) => ({
  id: `res_${String(i + 1).padStart(2, "0")}`,
  slug,
  title,
  description,
  kind,
  durationMinutes,
  fileUrl: `/resources/${slug}.pdf`,
  thumbnailUrl: `https://images.unsplash.com/photo-${1600000000 + i * 3333}?w=600&auto=format&fit=crop`,
  tags: [kind],
  publishedAt: iso(-(15 + i * 9)),
}));

// ---------- FAQs (18) ----------
const faqData: ReadonlyArray<[FAQ["category"], string, string]> = [
  ["general", "How do I know therapy is right for me?", "You do not need to be in crisis to benefit from therapy. A free 15-minute call can help us understand what you need and whether our approach feels right."],
  ["general", "What kinds of issues do you work with?", "We support anxiety, depression, trauma, relationships, grief, life transitions, neurodiversity, and more. If you are unsure, reach out and we will help."],
  ["general", "Do you offer free consultations?", "Yes. We offer a complimentary 15-minute wellbeing check-in so you can ask questions before committing."],
  ["appointments", "How long does each session last?", "Most individual sessions are 50 minutes. Couples and family sessions run 75 minutes. Assessments take longer and are scheduled in blocks."],
  ["appointments", "How often will we meet?", "Most people start weekly, then move to fortnightly as you progress. We will agree a cadence that suits you."],
  ["appointments", "Do you offer online sessions?", "Yes — secure video sessions are available alongside in-person appointments."],
  ["appointments", "What if I need to cancel?", "We ask for 48 hours' notice. Late cancellations may be charged at the full session fee."],
  ["appointments", "Can I switch therapists?", "Absolutely. Fit matters. We will help you transition with care and continuity."],
  ["fees", "How much does a session cost?", "Individual sessions start at $180. Couples and assessments are priced separately — see Services."],
  ["fees", "Do you accept insurance?", "We are out-of-network with most insurers but provide superbills you can submit for reimbursement."],
  ["fees", "How do I pay for sessions?", "Sessions are paid by card on file at the time of the appointment. Invoices are issued for your records."],
  ["fees", "Do you offer sliding scale fees?", "A limited number of reduced-fee places are available. Please ask in your free consultation."],
  ["online", "Is the video platform secure?", "Yes. We use a HIPAA-compliant video platform. No session is recorded."],
  ["online", "What if my internet drops out?", "We will move to a phone call so you do not lose your session time."],
  ["online", "Do online sessions work as well as in-person?", "Research consistently shows comparable outcomes for most therapy formats."],
  ["privacy", "Is what I share confidential?", "Yes. There is a small number of legal and safety exceptions, which we explain in your first session."],
  ["privacy", "Where is my data stored?", "Notes and records are stored in an encrypted, HIPAA-compliant clinical platform."],
  ["privacy", "Who can see my information?", "Only your clinician, and our practice manager for administrative purposes. We never sell data."],
];
export const faqs: FAQ[] = faqData.map(([category, question, answer], i) => ({
  id: `faq_${String(i + 1).padStart(2, "0")}`,
  question,
  answer,
  category,
  order: i,
}));

// ---------- Notifications (18) ----------
export const notifications: AppNotification[] = Array.from({ length: 18 }, (_, i) => {
  const categories: AppNotification["category"][] = ["appointment", "billing", "message", "assessment", "system"];
  const category = categories[i % categories.length];
  const titles: Record<AppNotification["category"], string> = {
    appointment: "Appointment reminder",
    billing: "Invoice ready",
    message: "New message from your therapist",
    assessment: "New assessment shared",
    system: "Profile updated",
  };
  return {
    id: `ntf_${String(i + 1).padStart(2, "0")}`,
    userId: patients[i % patients.length].id,
    category,
    title: titles[category],
    body: "Tap to view the details. This is a sample notification body.",
    href: "/",
    read: i % 3 === 0,
    createdAt: iso(-i, 8, 0),
  };
});

// ---------- Messages (12 messages across 4 threads) ----------
export const messageThreads: MessageThread[] = Array.from({ length: 4 }, (_, i) => ({
  id: `thr_${i + 1}`,
  participantIds: [patients[i].id, psychologists[i % psychologists.length].id],
  subject: ["Quick question between sessions", "Homework follow-up", "Rescheduling next week", "Thank you"][i],
  lastMessageAt: iso(-i),
  unreadCount: i === 0 ? 2 : 0,
}));
export const messages: Message[] = messageThreads.flatMap((thread, t) =>
  Array.from({ length: 3 }, (_, m) => ({
    id: `msg_${t}_${m}`,
    threadId: thread.id,
    senderId: m % 2 === 0 ? thread.participantIds[0] : thread.participantIds[1],
    body: ["Thinking of you between sessions — how are things landing?", "Better than expected, actually. The breathing practice helped.", "Wonderful. Let's build on that on Tuesday."][m],
    sentAt: iso(-t, 10 + m, 0),
    read: t !== 0,
  })),
);

// ---------- Assessments (9 templates + 18 results) ----------
export const assessmentTemplates: AssessmentTemplate[] = [
  { id: "asm_01", slug: "gad-7", title: "GAD-7 — Generalised Anxiety", description: "A 7-item screening tool for generalised anxiety disorder.", category: "anxiety", durationMinutes: 4, questionCount: 7 },
  { id: "asm_02", slug: "phq-9", title: "PHQ-9 — Depression", description: "Validated 9-item depression screening tool.", category: "depression", durationMinutes: 5, questionCount: 9 },
  { id: "asm_03", slug: "pcl-5", title: "PCL-5 — PTSD", description: "Screens for symptoms of post-traumatic stress.", category: "trauma", durationMinutes: 8, questionCount: 20 },
  { id: "asm_04", slug: "asrs", title: "ASRS — Adult ADHD", description: "WHO Adult ADHD self-report scale.", category: "adhd", durationMinutes: 6, questionCount: 18 },
  { id: "asm_05", slug: "who-5", title: "WHO-5 — Wellbeing", description: "A short measure of current mental wellbeing.", category: "wellbeing", durationMinutes: 3, questionCount: 5 },
  { id: "asm_06", slug: "swls", title: "SWLS — Life Satisfaction", description: "Five-item satisfaction with life scale.", category: "wellbeing", durationMinutes: 3, questionCount: 5 },
  { id: "asm_07", slug: "iesr", title: "IES-R — Impact of Event", description: "Measures distress related to a specific traumatic event.", category: "trauma", durationMinutes: 6, questionCount: 22 },
  { id: "asm_08", slug: "psqi", title: "PSQI — Sleep Quality", description: "Pittsburgh Sleep Quality Index.", category: "wellbeing", durationMinutes: 8, questionCount: 19 },
  { id: "asm_09", slug: "spin", title: "SPIN — Social Anxiety", description: "Social phobia inventory.", category: "anxiety", durationMinutes: 5, questionCount: 17 },
];
const severities = ["minimal", "mild", "moderate", "severe"] as const;
export const assessmentResults: AssessmentResult[] = Array.from({ length: 18 }, (_, i) => {
  const template = assessmentTemplates[i % assessmentTemplates.length];
  return {
    id: `asr_${String(i + 1).padStart(2, "0")}`,
    templateId: template.id,
    patientId: patients[i % patients.length].id,
    score: 6 + (i % 18),
    maxScore: template.questionCount * 3,
    severity: severities[i % severities.length],
    takenAt: iso(-(5 + i * 4)),
    summary: "Scores in the moderate range. Consider continuing weekly therapy and reviewing in four weeks.",
  };
});

// ---------- Invoices (12) & Payments (12) ----------
export const invoices: Invoice[] = Array.from({ length: 12 }, (_, i) => {
  const statuses: Invoice["status"][] = ["paid", "paid", "paid", "pending", "pending", "overdue", "refunded"];
  const amount = [180, 220, 260, 200, 320, 950][i % 6];
  return {
    id: `inv_${String(i + 1).padStart(3, "0")}`,
    number: `MW-2026-${String(1000 + i)}`,
    patientId: patients[i % patients.length].id,
    appointmentId: appointments[i % appointments.length].id,
    issuedAt: iso(-(i * 7)),
    dueAt: iso(-(i * 7) + 14),
    status: statuses[i % statuses.length],
    items: [
      { id: `li_${i}_1`, description: "Therapy session (50 min)", quantity: 1, unitPrice: { amount, currency: "USD" } },
    ],
    total: { amount, currency: "USD" },
  };
});
export const payments: Payment[] = invoices.slice(0, 12).map((inv, i) => ({
  id: `pay_${String(i + 1).padStart(3, "0")}`,
  invoiceId: inv.id,
  patientId: inv.patientId,
  amount: inv.total,
  method: (["card", "card", "card", "bank_transfer", "insurance"] as const)[i % 5],
  status: (["succeeded", "succeeded", "pending", "failed", "refunded"] as const)[i % 5],
  processedAt: inv.issuedAt,
  reference: `txn_${10000 + i}`,
}));

// ---------- Reviews (12) ----------
export const reviews: Review[] = Array.from({ length: 12 }, (_, i) => ({
  id: `rev_${String(i + 1).padStart(2, "0")}`,
  patientId: patients[i % patients.length].id,
  psychologistId: psychologists[i % psychologists.length].id,
  rating: 4 + (i % 2),
  comment: ["Genuinely changed how I see myself.", "Kind, sharp, and consistently helpful.", "I leave every session feeling lighter."][i % 3],
  createdAt: iso(-(20 + i * 8)),
}));

// ---------- Treatment Plans (8) & SOAP Notes (10) ----------
export const treatmentPlans: TreatmentPlan[] = Array.from({ length: 8 }, (_, i) => ({
  id: `tx_${String(i + 1).padStart(2, "0")}`,
  patientId: patients[i].id,
  psychologistId: psychologists[i % psychologists.length].id,
  title: ["Anxiety stabilisation plan", "Relationship repair plan", "ADHD coaching plan", "Trauma processing plan"][i % 4],
  diagnosis: ["Generalised anxiety disorder", "Relational distress", "Adult ADHD", "PTSD"][i % 4],
  startDate: "2026-04-01",
  reviewDate: "2026-07-01",
  goals: [
    { id: `g_${i}_1`, title: "Daily grounding practice", description: "Complete a 5-minute grounding practice each morning.", progress: 60 + (i % 4) * 10, status: "active", dueDate: "2026-07-01" },
    { id: `g_${i}_2`, title: "Reduce panic episodes", description: "Track and reduce panic episodes to fewer than 1 per fortnight.", progress: 40 + (i % 5) * 10, status: "active", dueDate: "2026-08-01" },
    { id: `g_${i}_3`, title: "Rebuild sleep routine", description: "Bed by 10:30pm on weekdays.", progress: 80, status: "completed" },
  ],
  status: i === 7 ? "completed" : "active",
}));
export const soapNotes: SOAPNote[] = Array.from({ length: 10 }, (_, i) => ({
  id: `note_${String(i + 1).padStart(3, "0")}`,
  appointmentId: appointments[i].id,
  patientId: appointments[i].patientId,
  psychologistId: appointments[i].psychologistId,
  subjective: "Reports a calmer week. Sleep improving. One panic episode on Tuesday.",
  objective: "Engaged, brighter affect compared to last session.",
  assessment: "Mild residual anxiety. Responding well to CBT components and exposure.",
  plan: "Continue exposure hierarchy. Introduce values clarification next week.",
  createdAt: appointments[i].startsAt,
  updatedAt: appointments[i].startsAt,
}));

// ---------- Reports (12) ----------
export const clinicalReports: ClinicalReport[] = Array.from({ length: 12 }, (_, i) => ({
  id: `rpt_${String(i + 1).padStart(3, "0")}`,
  patientId: patients[i % patients.length].id,
  psychologistId: psychologists[i % psychologists.length].id,
  title: ["Initial assessment summary", "Quarterly progress report", "ADHD diagnostic report", "Discharge summary"][i % 4],
  type: (["assessment", "progress", "assessment", "discharge"] as const)[i % 4],
  createdAt: iso(-(10 + i * 14)),
  fileUrl: `/reports/${i + 1}.pdf`,
  fileSizeKb: 240 + i * 40,
}));

// ---------- Emergency Contacts ----------
export const emergencyContacts: EmergencyContact[] = [
  { id: "emr_01", region: "United States", name: "988 Suicide & Crisis Lifeline", description: "Free, confidential support 24/7.", phone: "988", url: "https://988lifeline.org", available24h: true },
  { id: "emr_02", region: "United States", name: "Crisis Text Line", description: "Text HOME to 741741 to connect with a counselor.", phone: "741741", url: "https://www.crisistextline.org", available24h: true },
  { id: "emr_03", region: "United Kingdom", name: "Samaritans", description: "Confidential emotional support, any time.", phone: "116 123", url: "https://samaritans.org", available24h: true },
  { id: "emr_04", region: "Australia", name: "Lifeline Australia", description: "24/7 crisis support and suicide prevention.", phone: "13 11 14", url: "https://lifeline.org.au", available24h: true },
  { id: "emr_05", region: "Canada", name: "Talk Suicide Canada", description: "Bilingual suicide prevention support.", phone: "1-833-456-4566", url: "https://talksuicide.ca", available24h: true },
  { id: "emr_06", region: "Global", name: "Local emergency services", description: "If you are in immediate danger, call your local emergency number.", phone: "112 / 911 / 999", available24h: true },
];

// ---------- Journal entries (sample) ----------
export const journalEntries: JournalEntry[] = Array.from({ length: 10 }, (_, i) => ({
  id: `jrn_${String(i + 1).padStart(2, "0")}`,
  patientId: patients[0].id,
  mood: ((i % 5) + 1),
  title: ["Steadier than expected", "A wobbly morning", "Small win", "Anxious before work", "Calm walk", "Family call", "Slept badly", "Good session", "Tough afternoon", "Quiet evening"][i],
  body: "A short note to myself about how today felt and what helped.",
  createdAt: iso(-i),
}));

// ---------- Dashboard statistics ----------
export const dashboardStats: DashboardStat[] = [
  { key: "upcoming", label: "Upcoming sessions", value: "3", delta: 1, trend: "up" },
  { key: "completed", label: "Sessions this year", value: "24", delta: 4, trend: "up" },
  { key: "wellbeing", label: "Wellbeing score", value: "68", delta: 6, trend: "up" },
  { key: "outstanding", label: "Outstanding balance", value: "$180", delta: -40, trend: "down" },
];