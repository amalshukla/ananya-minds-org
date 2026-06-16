/**
 * TanStack Query option factories.
 *
 * Components should import these and pass them to `useQuery` /
 * `useSuspenseQuery`. Loaders should call
 * `context.queryClient.ensureQueryData(...)` with the same options object.
 */
import { queryOptions } from "@tanstack/react-query";
import {
  AppointmentService,
  AssessmentService,
  AvailabilityService,
  BlogService,
  CalendarService,
  EmergencyService,
  FaqService,
  InvoiceService,
  JournalService,
  MessageService,
  NotificationService,
  PatientService,
  PaymentService,
  PsychologistService,
  ReportService,
  ResourceService,
  ReviewService,
  ServicesService,
  SoapNoteService,
  StatsService,
  TestimonialService,
  TreatmentPlanService,
  SearchService,
} from "@/services";
import type { FAQ, ListQuery } from "@/types";

export const qk = {
  services: ["services"] as const,
  service: (slug: string) => ["services", slug] as const,
  popularServices: ["services", "popular"] as const,
  psychologists: ["psychologists"] as const,
  psychologist: (id: string) => ["psychologists", id] as const,
  patients: ["patients"] as const,
  appointments: ["appointments"] as const,
  upcomingAppointments: ["appointments", "upcoming"] as const,
  appointment: (id: string) => ["appointments", id] as const,
  availability: (psychologistId?: string) => ["availability", psychologistId ?? "all"] as const,
  calendar: ["calendar"] as const,
  testimonials: ["testimonials"] as const,
  blogs: (params?: { categorySlug?: string; search?: string }) => ["blogs", params ?? {}] as const,
  blog: (slug: string) => ["blog", slug] as const,
  blogCategories: ["blog-categories"] as const,
  blogRelated: (slug: string) => ["blog", slug, "related"] as const,
  resources: ["resources"] as const,
  faqs: (category?: FAQ["category"]) => ["faqs", category ?? "all"] as const,
  notifications: ["notifications"] as const,
  unreadCount: ["notifications", "unread"] as const,
  threads: ["threads"] as const,
  messages: (threadId: string) => ["messages", threadId] as const,
  assessmentTemplates: ["assessment-templates"] as const,
  assessmentResults: ["assessment-results"] as const,
  invoices: ["invoices"] as const,
  payments: ["payments"] as const,
  reviews: ["reviews"] as const,
  treatmentPlans: ["treatment-plans"] as const,
  soapNotes: ["soap-notes"] as const,
  reports: ["reports"] as const,
  emergency: ["emergency"] as const,
  journal: ["journal"] as const,
  stats: ["stats"] as const,
  search: (q: string) => ["search", q] as const,
};

export const servicesQuery = (params?: ListQuery) =>
  queryOptions({ queryKey: [...qk.services, params ?? {}], queryFn: () => ServicesService.list(params) });
export const serviceQuery = (slug: string) =>
  queryOptions({ queryKey: qk.service(slug), queryFn: () => ServicesService.bySlug(slug) });
export const popularServicesQuery = () =>
  queryOptions({ queryKey: qk.popularServices, queryFn: ServicesService.popular });

export const psychologistsQuery = (params?: ListQuery) =>
  queryOptions({ queryKey: [...qk.psychologists, params ?? {}], queryFn: () => PsychologistService.list(params) });
export const psychologistQuery = (id: string) =>
  queryOptions({ queryKey: qk.psychologist(id), queryFn: () => PsychologistService.byId(id) });

export const patientsQuery = (params?: ListQuery) =>
  queryOptions({ queryKey: [...qk.patients, params ?? {}], queryFn: () => PatientService.list(params) });

export const appointmentsQuery = (params?: ListQuery) =>
  queryOptions({ queryKey: [...qk.appointments, params ?? {}], queryFn: () => AppointmentService.list(params) });
export const upcomingAppointmentsQuery = () =>
  queryOptions({ queryKey: qk.upcomingAppointments, queryFn: AppointmentService.upcoming });

export const availabilityQuery = (psychologistId?: string) =>
  queryOptions({ queryKey: qk.availability(psychologistId), queryFn: () => AvailabilityService.list(psychologistId) });

export const calendarQuery = () =>
  queryOptions({ queryKey: qk.calendar, queryFn: CalendarService.events });

export const testimonialsQuery = (params?: ListQuery) =>
  queryOptions({ queryKey: [...qk.testimonials, params ?? {}], queryFn: () => TestimonialService.list(params) });

export const blogsQuery = (params?: ListQuery & { categorySlug?: string }) =>
  queryOptions({ queryKey: qk.blogs(params), queryFn: () => BlogService.list(params) });
export const blogQuery = (slug: string) =>
  queryOptions({ queryKey: qk.blog(slug), queryFn: () => BlogService.bySlug(slug) });
export const blogCategoriesQuery = () =>
  queryOptions({ queryKey: qk.blogCategories, queryFn: BlogService.categories });
export const blogRelatedQuery = (slug: string) =>
  queryOptions({ queryKey: qk.blogRelated(slug), queryFn: () => BlogService.related(slug) });

export const resourcesQuery = (params?: ListQuery) =>
  queryOptions({ queryKey: [...qk.resources, params ?? {}], queryFn: () => ResourceService.list(params) });

export const faqsQuery = (category?: FAQ["category"]) =>
  queryOptions({ queryKey: qk.faqs(category), queryFn: () => FaqService.list({ pageSize: 50, category }) });

export const notificationsQuery = () =>
  queryOptions({ queryKey: qk.notifications, queryFn: () => NotificationService.list() });
export const unreadCountQuery = () =>
  queryOptions({ queryKey: qk.unreadCount, queryFn: NotificationService.unreadCount });

export const threadsQuery = () =>
  queryOptions({ queryKey: qk.threads, queryFn: MessageService.threads });
export const messagesQuery = (threadId: string) =>
  queryOptions({ queryKey: qk.messages(threadId), queryFn: () => MessageService.messages(threadId) });

export const assessmentTemplatesQuery = () =>
  queryOptions({ queryKey: qk.assessmentTemplates, queryFn: AssessmentService.templates });
export const assessmentResultsQuery = (params?: ListQuery) =>
  queryOptions({ queryKey: [...qk.assessmentResults, params ?? {}], queryFn: () => AssessmentService.results(params) });

export const invoicesQuery = (params?: ListQuery) =>
  queryOptions({ queryKey: [...qk.invoices, params ?? {}], queryFn: () => InvoiceService.list(params) });
export const paymentsQuery = (params?: ListQuery) =>
  queryOptions({ queryKey: [...qk.payments, params ?? {}], queryFn: () => PaymentService.list(params) });

export const reviewsQuery = (params?: ListQuery) =>
  queryOptions({ queryKey: [...qk.reviews, params ?? {}], queryFn: () => ReviewService.list(params) });

export const treatmentPlansQuery = () =>
  queryOptions({ queryKey: qk.treatmentPlans, queryFn: TreatmentPlanService.list });
export const soapNotesQuery = () =>
  queryOptions({ queryKey: qk.soapNotes, queryFn: SoapNoteService.list });
export const reportsQuery = (params?: ListQuery) =>
  queryOptions({ queryKey: [...qk.reports, params ?? {}], queryFn: () => ReportService.list(params) });

export const emergencyQuery = () =>
  queryOptions({ queryKey: qk.emergency, queryFn: EmergencyService.list });
export const journalQuery = () =>
  queryOptions({ queryKey: qk.journal, queryFn: JournalService.list });
export const statsQuery = () =>
  queryOptions({ queryKey: qk.stats, queryFn: StatsService.dashboard });

export const searchQuery = (q: string) =>
  queryOptions({ queryKey: qk.search(q), queryFn: () => SearchService.global(q), enabled: q.trim().length > 0 });