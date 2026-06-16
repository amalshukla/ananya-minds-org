import type {
  AppointmentStatus,
  ConsultationMode,
  InvoiceStatus,
  PaymentStatus,
  Severity,
  UserRole,
} from "@/types";

export const APPOINTMENT_STATUS_LABEL: Record<AppointmentStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  rescheduled: "Rescheduled",
  no_show: "No-show",
};

export const APPOINTMENT_STATUS_TONE: Record<AppointmentStatus, "primary" | "success" | "danger" | "warn" | "muted"> = {
  scheduled: "primary",
  completed: "success",
  cancelled: "danger",
  rescheduled: "warn",
  no_show: "muted",
};

export const CONSULTATION_MODE_LABEL: Record<ConsultationMode, string> = {
  online: "Online",
  in_person: "In person",
};

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  paid: "Paid",
  overdue: "Overdue",
  refunded: "Refunded",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  succeeded: "Succeeded",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  minimal: "Minimal",
  mild: "Mild",
  moderate: "Moderate",
  severe: "Severe",
};

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  patient: "Patient",
  psychologist: "Psychologist",
  admin: "Administrator",
};

export const SITE = {
  name: "Mindwell",
  legalName: "Mindwell Clinical Psychology",
  tagline: "Compassionate, evidence-based therapy",
  email: "hello@mindwell.health",
  phone: "+1 (415) 555-0142",
  address: "1240 Larkspur Lane, Suite 200, San Francisco, CA",
  url: "https://ananya-minds-org.lovable.app",
} as const;

export const DEFAULT_PAGE_SIZE = 10;