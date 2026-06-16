import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Globe, MapPin } from "lucide-react";
import { PublicLayout } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { ServiceIcon } from "@/components/service-icon";
import { serviceQuery, popularServicesQuery } from "@/queries";
import { CONSULTATION_MODE_LABEL } from "@/constants";
import { formatMoney } from "@/lib/format";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ context, params }) => {
    try {
      const service = await context.queryClient.ensureQueryData(serviceQuery(params.slug));
      await context.queryClient.ensureQueryData(popularServicesQuery());
      return { service };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData, params }) => ({
    meta: [
      { title: loaderData?.service ? `${loaderData.service.title} | Mindwell` : "Service | Mindwell" },
      { name: "description", content: loaderData?.service?.shortDescription ?? "" },
      { property: "og:title", content: loaderData?.service?.title ?? "Mindwell" },
      { property: "og:description", content: loaderData?.service?.shortDescription ?? "" },
      { property: "og:url", content: `/services/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/services/${params.slug}` }],
  }),
  component: ServiceDetailPage,
  notFoundComponent: () => (
    <PublicLayout>
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="text-3xl">Service not found</h1>
        <Link to="/services" className="mt-6 inline-flex items-center gap-2 text-primary">
          <ArrowLeft className="size-4" /> All services
        </Link>
      </div>
    </PublicLayout>
  ),
});

function ServiceDetailPage() {
  const { slug } = Route.useParams();
  const { data: service } = useSuspenseQuery(serviceQuery(slug));
  const { data: related } = useSuspenseQuery(popularServicesQuery());

  return (
    <PublicLayout>
      <section className="bg-secondary/55 px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="size-4" /> All services
          </Link>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.18em] text-primary">{service.category.replace("-", " ")}</p>
              <h1 className="mt-3 max-w-2xl text-5xl">{service.title}</h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{service.shortDescription}</p>
            </div>
            <span className="grid size-16 shrink-0 place-items-center rounded-3xl bg-primary text-primary-foreground">
              <ServiceIcon name={service.icon} className="size-7" />
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><Clock className="size-4 text-primary" /> {service.durationMinutes} minutes</span>
            <span className="inline-flex items-center gap-2 font-semibold text-foreground">{formatMoney(service.price)}</span>
            {service.modes.map((m) => (
              <span key={m} className="inline-flex items-center gap-2">
                {m === "online" ? <Globe className="size-4 text-primary" /> : <MapPin className="size-4 text-primary" />}
                {CONSULTATION_MODE_LABEL[m]}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-12 px-5 py-16 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <p className="text-lg leading-8 text-muted-foreground whitespace-pre-line">{service.description}</p>
          <div className="warm-card p-7">
            <h2 className="text-xl">What you can expect</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {service.outcomes.map((o) => (
                <li key={o} className="flex gap-3"><CheckCircle2 className="size-5 text-primary" /> {o}</li>
              ))}
            </ul>
          </div>
          <div className="warm-card p-7">
            <h2 className="text-xl">Who this is for</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {service.whoItsFor.map((w) => (
                <li key={w} className="flex gap-3"><CheckCircle2 className="size-5 text-primary" /> {w}</li>
              ))}
            </ul>
          </div>
        </div>
        <aside className="warm-card sticky top-28 h-fit space-y-4 p-7">
          <p className="text-sm text-muted-foreground">From</p>
          <p className="font-display text-4xl text-primary">{formatMoney(service.price)}</p>
          <p className="text-sm text-muted-foreground">{service.durationMinutes}-minute session</p>
          <Button variant="hero" size="lg" className="w-full" asChild>
            <Link to="/book">Book this service <ArrowRight /></Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/contact">Ask a question</Link>
          </Button>
        </aside>
      </section>
      {related.length > 0 && (
        <section className="bg-secondary/55 px-5 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl">Other ways we can help</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {related.filter((r) => r.id !== service.id).slice(0, 3).map((s) => (
                <Link key={s.id} to="/services/$slug" params={{ slug: s.slug }} className="warm-card group flex flex-col p-6">
                  <ServiceIcon name={s.icon} className="size-7 text-primary" />
                  <h3 className="mt-4 text-lg">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.shortDescription}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-primary">
                    Learn more <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
}