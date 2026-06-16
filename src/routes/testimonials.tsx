import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { PublicLayout } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { testimonialsQuery } from "@/queries";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "What our patients say | Mindwell" },
      { name: "description", content: "Read real reflections from people who have worked with our clinical psychology team." },
      { property: "og:title", content: "Patient stories | Mindwell" },
      { property: "og:url", content: "/testimonials" },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(testimonialsQuery({ pageSize: 50 })),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const { data } = useSuspenseQuery(testimonialsQuery({ pageSize: 50 }));
  return (
    <PublicLayout>
      <section className="bg-secondary/55 px-5 py-20 text-center">
        <p className="text-sm font-bold uppercase tracking-[.18em] text-primary">In their words</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-5xl">Stories of steadier days</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Anonymous reflections from people we've supported. Names and details are removed to protect their privacy.
        </p>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.results.map((t) => (
            <blockquote key={t.id} className="warm-card flex flex-col gap-5 p-7">
              <div className="flex gap-1 text-primary" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={i < t.rating ? "size-4 fill-current" : "size-4 opacity-25"} aria-hidden="true" />
                ))}
              </div>
              <p className="font-display text-lg leading-8">“{t.quote}”</p>
              <footer className="mt-auto flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-secondary font-semibold text-primary">
                  {t.authorInitials}
                </span>
                <span className="text-sm text-muted-foreground">{t.authorContext}</span>
              </footer>
            </blockquote>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Button asChild variant="hero" size="lg">
            <Link to="/book">Find your own steadier days</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}