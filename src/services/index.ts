/**
 * Typed service layer.
 *
 * Every method returns a Promise typed to the API contract. The current
 * implementation reads from `src/mocks/`; the production implementation
 * will use the `apiClient` from `src/api/client.ts` to call Django REST
 * Framework endpoints. UI code should never import mocks directly.
 */
import { mockDelay } from "@/api/client";
import * as M from "@/mocks";
import type {
  Appointment,
  AppNotification,
  AssessmentResult,
  AssessmentTemplate,
  AvailabilitySlot,
  BlogArticle,
  BlogCategory,
  CalendarEvent,
  ClinicalReport,
  ContactRequest,
  DashboardStat,
  EmergencyContact,
  FAQ,
  Invoice,
  JournalEntry,
  ListQuery,
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
} from "@/types";

function paginate<T>(items: T[], { page = 1, pageSize = 10, search }: ListQuery & { searchFields?: (keyof T)[] } = {}) {
  let filtered = items;
  if (search) {
    const q = search.toLowerCase();
    filtered = items.filter((item) =>
      Object.values(item as Record<string, unknown>).some(
        (v) => typeof v === "string" && v.toLowerCase().includes(q),
      ),
    );
  }
  const start = (page - 1) * pageSize;
  return {
    results: filtered.slice(start, start + pageSize),
    count: filtered.length,
    next: start + pageSize < filtered.length ? `?page=${page + 1}` : null,
    previous: page > 1 ? `?page=${page - 1}` : null,
  };
}

export const ServicesService = {
  list: async (q?: ListQuery) => {
    await mockDelay();
    return paginate<Service>(M.services, q);
  },
  bySlug: async (slug: string): Promise<Service> => {
    await mockDelay();
    const found = M.services.find((s) => s.slug === slug);
    if (!found) throw new Error(`Service not found: ${slug}`);
    return found;
  },
  popular: async (): Promise<Service[]> => {
    await mockDelay();
    return M.services.filter((s) => s.popular);
  },
};

export const PsychologistService = {
  list: async (q?: ListQuery) => {
    await mockDelay();
    return paginate<Psychologist>(M.psychologists, q);
  },
  byId: async (id: string): Promise<Psychologist> => {
    await mockDelay();
    const found = M.psychologists.find((p) => p.id === id);
    if (!found) throw new Error(`Psychologist not found: ${id}`);
    return found;
  },
};

export const PatientService = {
  list: async (q?: ListQuery) => {
    await mockDelay();
    return paginate<Patient>(M.patients, q);
  },
  byId: async (id: string): Promise<Patient | null> => {
    await mockDelay();
    return M.patients.find((p) => p.id === id) ?? null;
  },
};

export const AppointmentService = {
  list: async (q?: ListQuery) => {
    await mockDelay();
    return paginate<Appointment>(M.appointments, q);
  },
  upcoming: async (): Promise<Appointment[]> => {
    await mockDelay();
    return M.appointments
      .filter((a) => a.status === "scheduled" && new Date(a.startsAt) > new Date())
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  },
  byId: async (id: string): Promise<Appointment | null> => {
    await mockDelay();
    return M.appointments.find((a) => a.id === id) ?? null;
  },
  create: async (input: Partial<Appointment>): Promise<Appointment> => {
    await mockDelay(450);
    return {
      id: `apt_new_${Date.now()}`,
      patientId: input.patientId ?? "pat_01",
      psychologistId: input.psychologistId ?? "psy_01",
      serviceId: input.serviceId ?? "svc_01",
      startsAt: input.startsAt ?? new Date().toISOString(),
      endsAt: input.endsAt ?? new Date().toISOString(),
      mode: input.mode ?? "online",
      status: "scheduled",
      notes: null,
      meetingUrl: null,
      location: null,
      invoiceId: null,
      createdAt: new Date().toISOString(),
    };
  },
};

export const AvailabilityService = {
  list: async (psychologistId?: string): Promise<AvailabilitySlot[]> => {
    await mockDelay();
    return psychologistId
      ? M.availabilitySlots.filter((s) => s.psychologistId === psychologistId)
      : M.availabilitySlots;
  },
};

export const CalendarService = {
  events: async (): Promise<CalendarEvent[]> => {
    await mockDelay();
    return M.calendarEvents;
  },
};

export const TestimonialService = {
  list: async (q?: ListQuery) => {
    await mockDelay();
    return paginate<Testimonial>(M.testimonials, q);
  },
};

export const BlogService = {
  list: async (q?: ListQuery & { categorySlug?: string }) => {
    await mockDelay();
    let items = M.blogArticles;
    if (q?.categorySlug) {
      const cat = M.blogCategories.find((c) => c.slug === q.categorySlug);
      if (cat) items = items.filter((a) => a.categoryId === cat.id);
    }
    return paginate<BlogArticle>(items, q);
  },
  bySlug: async (slug: string): Promise<BlogArticle | null> => {
    await mockDelay();
    return M.blogArticles.find((a) => a.slug === slug) ?? null;
  },
  categories: async (): Promise<BlogCategory[]> => {
    await mockDelay();
    return M.blogCategories;
  },
  related: async (slug: string, limit = 3): Promise<BlogArticle[]> => {
    await mockDelay();
    const article = M.blogArticles.find((a) => a.slug === slug);
    if (!article) return [];
    return M.blogArticles
      .filter((a) => a.id !== article.id && a.categoryId === article.categoryId)
      .slice(0, limit);
  },
};

export const ResourceService = {
  list: async (q?: ListQuery) => {
    await mockDelay();
    return paginate<Resource>(M.resources, q);
  },
  bySlug: async (slug: string): Promise<Resource | null> => {
    await mockDelay();
    return M.resources.find((r) => r.slug === slug) ?? null;
  },
};

export const FaqService = {
  list: async (q?: ListQuery & { category?: FAQ["category"] }) => {
    await mockDelay();
    let items = M.faqs;
    if (q?.category) items = items.filter((f) => f.category === q.category);
    return paginate<FAQ>(items, q);
  },
};

export const NotificationService = {
  list: async (q?: ListQuery): Promise<AppNotification[]> => {
    await mockDelay();
    return paginate<AppNotification>(M.notifications, { pageSize: 50, ...q }).results;
  },
  unreadCount: async (): Promise<number> => {
    await mockDelay();
    return M.notifications.filter((n) => !n.read).length;
  },
  markRead: async (id: string): Promise<void> => {
    await mockDelay(120);
    const target = M.notifications.find((n) => n.id === id);
    if (target) target.read = true;
  },
};

export const MessageService = {
  threads: async (): Promise<MessageThread[]> => {
    await mockDelay();
    return M.messageThreads;
  },
  messages: async (threadId: string): Promise<Message[]> => {
    await mockDelay();
    return M.messages.filter((m) => m.threadId === threadId);
  },
};

export const AssessmentService = {
  templates: async (): Promise<AssessmentTemplate[]> => {
    await mockDelay();
    return M.assessmentTemplates;
  },
  results: async (q?: ListQuery) => {
    await mockDelay();
    return paginate<AssessmentResult>(M.assessmentResults, q);
  },
};

export const InvoiceService = {
  list: async (q?: ListQuery) => {
    await mockDelay();
    return paginate<Invoice>(M.invoices, q);
  },
};

export const PaymentService = {
  list: async (q?: ListQuery) => {
    await mockDelay();
    return paginate<Payment>(M.payments, q);
  },
  process: async (_invoiceId: string): Promise<{ ok: true; reference: string }> => {
    await mockDelay(600);
    return { ok: true, reference: `txn_${Date.now()}` };
  },
};

export const ReviewService = {
  list: async (q?: ListQuery) => {
    await mockDelay();
    return paginate<Review>(M.reviews, q);
  },
};

export const TreatmentPlanService = {
  list: async (): Promise<TreatmentPlan[]> => {
    await mockDelay();
    return M.treatmentPlans;
  },
};

export const SoapNoteService = {
  list: async (): Promise<SOAPNote[]> => {
    await mockDelay();
    return M.soapNotes;
  },
};

export const ReportService = {
  list: async (q?: ListQuery) => {
    await mockDelay();
    return paginate<ClinicalReport>(M.clinicalReports, q);
  },
};

export const EmergencyService = {
  list: async (): Promise<EmergencyContact[]> => {
    await mockDelay();
    return M.emergencyContacts;
  },
};

export const JournalService = {
  list: async (): Promise<JournalEntry[]> => {
    await mockDelay();
    return M.journalEntries;
  },
};

export const StatsService = {
  dashboard: async (): Promise<DashboardStat[]> => {
    await mockDelay();
    return M.dashboardStats;
  },
};

export const ContactService = {
  submit: async (input: Omit<ContactRequest, "id" | "createdAt">): Promise<ContactRequest> => {
    await mockDelay(450);
    return { id: `cnt_${Date.now()}`, createdAt: new Date().toISOString(), ...input };
  },
};

export const SearchService = {
  global: async (query: string) => {
    await mockDelay();
    const q = query.toLowerCase().trim();
    if (!q) return { services: [], articles: [], resources: [], faqs: [] };
    return {
      services: M.services.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)).slice(0, 5),
      articles: M.blogArticles.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)).slice(0, 5),
      resources: M.resources.filter((r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)).slice(0, 5),
      faqs: M.faqs.filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)).slice(0, 5),
    };
  },
};