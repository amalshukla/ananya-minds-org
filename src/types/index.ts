/**
 * Shared domain types for the Mindwell platform.
 * These mirror the future Django REST Framework models so that swapping
 * the mock service layer for real API calls requires no UI changes.
 */

// ---------- Primitives ----------
export type ID = string;
export type ISODateString = string; // e.g. "2026-06-16T09:00:00.000Z"
export type DateString = string;    // e.g. "2026-06-16"
export type TimeString = string;    // e.g. "09:00"
export type Currency = "USD" | "EUR" | "GBP" | "AUD" | "CAD";

export interface Money {
  amount: number;
  currency: Currency;
}

export interface Paginated<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface ListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: string;
}

// ---------- Users ----------
export type UserRole = "patient" | "psychologist" | "admin";

export interface BaseUser {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  phone?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: ISODateString;
}

export interface Patient extends BaseUser {
  role: "patient";
  dateOfBirth?: DateString | null;
  pronouns?: string | null;
  emergencyContactId?: ID | null;
  primaryPsychologistId?: ID | null;
  preferredMode: ConsultationMode;
  tags: string[];
}

export interface Psychologist extends BaseUser {
  role: "psychologist";
  title: string;                 // e.g. "Dr."
  headline: string;              // e.g. "Anxiety & trauma specialist"
  bio: string;
  specialties: string[];
  languages: string[];
  yearsExperience: number;
  rating: number;                // 0-5
  reviewCount: number;
  sessionPrice: Money;
  registrationNumber: string;
  acceptingNewPatients: boolean;
}

export interface Admin extends BaseUser {
  role: "admin";
  permissions: string[];
}

export type AppUser = Patient | Psychologist | Admin;

// ---------- Services / Catalog ----------
export type ServiceCategory =
  | "individual"
  | "couples"
  | "family"
  | "child-adolescent"
  | "group"
  | "assessment"
  | "coaching";

export interface Service {
  id: ID;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: ServiceCategory;
  /** Lucide icon name, resolved on the client */
  icon: string;
  durationMinutes: number;
  price: Money;
  modes: ConsultationMode[];
  outcomes: string[];
  whoItsFor: string[];
  popular?: boolean;
}

// ---------- Appointments ----------
export type ConsultationMode = "online" | "in_person";
export type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "rescheduled"
  | "no_show";

export interface Appointment {
  id: ID;
  patientId: ID;
  psychologistId: ID;
  serviceId: ID;
  startsAt: ISODateString;
  endsAt: ISODateString;
  mode: ConsultationMode;
  status: AppointmentStatus;
  notes?: string | null;
  meetingUrl?: string | null;
  location?: string | null;
  invoiceId?: ID | null;
  createdAt: ISODateString;
}

export interface AvailabilitySlot {
  id: ID;
  psychologistId: ID;
  date: DateString;
  startTime: TimeString;
  endTime: TimeString;
  isBooked: boolean;
}

export interface CalendarEvent {
  id: ID;
  title: string;
  start: ISODateString;
  end: ISODateString;
  kind: "appointment" | "block" | "personal";
  appointmentId?: ID | null;
}

// ---------- Clinical ----------
export type AssessmentCategory = "anxiety" | "depression" | "trauma" | "adhd" | "wellbeing";
export type Severity = "minimal" | "mild" | "moderate" | "severe";

export interface AssessmentTemplate {
  id: ID;
  slug: string;
  title: string;
  description: string;
  category: AssessmentCategory;
  durationMinutes: number;
  questionCount: number;
}

export interface AssessmentResult {
  id: ID;
  templateId: ID;
  patientId: ID;
  score: number;
  maxScore: number;
  severity: Severity;
  takenAt: ISODateString;
  summary: string;
}

export interface SOAPNote {
  id: ID;
  appointmentId: ID;
  patientId: ID;
  psychologistId: ID;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface TreatmentGoal {
  id: ID;
  title: string;
  description: string;
  progress: number; // 0-100
  status: "active" | "completed" | "paused";
  dueDate?: DateString | null;
}

export interface TreatmentPlan {
  id: ID;
  patientId: ID;
  psychologistId: ID;
  title: string;
  diagnosis: string;
  startDate: DateString;
  reviewDate: DateString;
  goals: TreatmentGoal[];
  status: "active" | "completed" | "archived";
}

export interface ClinicalReport {
  id: ID;
  patientId: ID;
  psychologistId: ID;
  title: string;
  type: "assessment" | "progress" | "discharge" | "referral";
  createdAt: ISODateString;
  fileUrl: string;
  fileSizeKb: number;
}

// ---------- Billing ----------
export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue" | "refunded";
export type PaymentStatus = "succeeded" | "pending" | "failed" | "refunded";
export type PaymentMethod = "card" | "bank_transfer" | "insurance" | "cash";

export interface InvoiceLineItem {
  id: ID;
  description: string;
  quantity: number;
  unitPrice: Money;
}

export interface Invoice {
  id: ID;
  number: string;
  patientId: ID;
  appointmentId?: ID | null;
  issuedAt: ISODateString;
  dueAt: ISODateString;
  status: InvoiceStatus;
  items: InvoiceLineItem[];
  total: Money;
}

export interface Payment {
  id: ID;
  invoiceId: ID;
  patientId: ID;
  amount: Money;
  method: PaymentMethod;
  status: PaymentStatus;
  processedAt: ISODateString;
  reference: string;
}

// ---------- CMS ----------
export interface BlogCategory {
  id: ID;
  slug: string;
  name: string;
}

export interface BlogArticle {
  id: ID;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  categoryId: ID;
  tags: string[];
  authorId: ID;
  readingMinutes: number;
  publishedAt: ISODateString;
}

export type ResourceKind = "guide" | "worksheet" | "audio" | "video" | "article";

export interface Resource {
  id: ID;
  slug: string;
  title: string;
  description: string;
  kind: ResourceKind;
  durationMinutes?: number;
  fileUrl?: string;
  thumbnailUrl?: string;
  tags: string[];
  publishedAt: ISODateString;
}

export interface FAQ {
  id: ID;
  question: string;
  answer: string;
  category: "general" | "appointments" | "fees" | "online" | "privacy";
  order: number;
}

export interface Testimonial {
  id: ID;
  authorInitials: string;
  authorContext: string; // e.g. "Verified patient · Anxiety therapy"
  rating: number;        // 0-5
  quote: string;
  serviceId?: ID;
  publishedAt: ISODateString;
}

export interface Review {
  id: ID;
  patientId: ID;
  psychologistId: ID;
  rating: number;
  comment: string;
  createdAt: ISODateString;
}

// ---------- Communications ----------
export type NotificationCategory =
  | "appointment"
  | "billing"
  | "message"
  | "assessment"
  | "system";

export interface AppNotification {
  id: ID;
  userId: ID;
  category: NotificationCategory;
  title: string;
  body: string;
  href?: string;
  read: boolean;
  createdAt: ISODateString;
}

export interface MessageThread {
  id: ID;
  participantIds: ID[];
  subject: string;
  lastMessageAt: ISODateString;
  unreadCount: number;
}

export interface Message {
  id: ID;
  threadId: ID;
  senderId: ID;
  body: string;
  sentAt: ISODateString;
  read: boolean;
}

export interface JournalEntry {
  id: ID;
  patientId: ID;
  mood: number; // 1-5
  title: string;
  body: string;
  createdAt: ISODateString;
}

export interface ContactRequest {
  id: ID;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: ISODateString;
}

export interface EmergencyContact {
  id: ID;
  region: string;
  name: string;
  description: string;
  phone: string;
  url?: string;
  available24h: boolean;
}

// ---------- Dashboard ----------
export interface DashboardStat {
  key: string;
  label: string;
  value: string;
  delta?: number;
  trend?: "up" | "down" | "flat";
}