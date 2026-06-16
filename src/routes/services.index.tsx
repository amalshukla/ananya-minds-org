import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PublicLayout } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { ServiceIcon } from "@/components/service-icon";
import { servicesQuery } from "@/queries";
import { CONSULTATION_MODE_LABEL } from "@/constants";
import { formatMoney } from "@/lib/format";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Therapy & Assessments | Mindwell" },
      { name: "description", content: "Explore individual therapy, couples work, assessments, and specialist care from Mindwell's clinical team." },
      { property: "og:title", content: "Therapy & Assessments | Mindwell" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery({ pageSize: 50 })),
  component: ServicesPage,
});

function ServicesPage() {
  const { data } = useSuspenseQuery(servicesQuery({ pageSize: 50 }));
  return (
    <PublicLayout>
      <section className="bg-secondary/55 px-5 py-20 text-center">
        <p className="text-sm font-bold uppercase tracking-[.18em] text-primary">Our services</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-5xl tracking-tight">Care designed around your life, not a label</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Thoughtful, evidence-based support for individuals, couples, children, and families.
        </p>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.results.map((s) => (
            <article key={s.id} className="warm-card flex flex-col p-7">
              <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
                <ServiceIcon name={s.icon} className="size-6" />
              </span>
              <h2 className="mt-5 text-2xl">{s.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.shortDescription}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {s.outcomes.slice(0, 2).map((o) => (
                  <li key={o} className="flex gap-2"><CheckCircle2 className="size-4 text-primary" />{o}</li>
                ))}
              </ul>
              <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                <span>{s.durationMinutes} min · {s.modes.map((m) => CONSULTATION_MODE_LABEL[m]).join(" · ")}</span>
                <strong className="text-base text-foreground">{formatMoney(s.price)}</strong>
              </div>
              <Button variant="link" className="mt-4 self-start px-0" asChild>
                <Link to="/services/$slug" params={{ slug: s.slug }}>
                  Learn more <ArrowRight />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}