import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { HelpCircle, Search } from "lucide-react";
import { PublicLayout } from "@/components/site-shell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/states/empty";
import { faqsQuery } from "@/queries";
import { SITE } from "@/constants";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions | Mindwell" },
      { name: "description", content: "Answers to common questions about therapy, appointments, fees, online sessions, and privacy at Mindwell." },
      { property: "og:title", content: "FAQs | Mindwell" },
      { property: "og:url", content: "/faqs" },
    ],
    links: [{ rel: "canonical", href: "/faqs" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", url: `${SITE.url}/faqs` }),
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(faqsQuery()),
  component: FaqsPage,
});

function FaqsPage() {
  const { data } = useSuspenseQuery(faqsQuery());
  const [query, setQuery] = useState("");
  const filtered = data.results.filter(
    (f) => f.question.toLowerCase().includes(query.toLowerCase()) || f.answer.toLowerCase().includes(query.toLowerCase()),
  );
  const categories = Array.from(new Set(filtered.map((f) => f.category)));
  return (
    <PublicLayout>
      <section className="bg-secondary/55 px-5 py-20 text-center">
        <p className="text-sm font-bold uppercase tracking-[.18em] text-primary">Frequently asked</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-5xl">It is okay to ask</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Honest answers about therapy, sessions, fees, online care, and privacy.
        </p>
        <label className="relative mx-auto mt-8 block max-w-xl">
          <Search aria-hidden="true" className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions"
            className="h-12 rounded-full pl-11"
            aria-label="Search questions"
          />
        </label>
      </section>
      <section className="mx-auto max-w-3xl space-y-12 px-5 py-20">
        {filtered.length === 0 ? (
          <EmptyState icon={<HelpCircle aria-hidden="true" />} title="No matching questions" description="Try a different search term, or reach out to us directly." />
        ) : (
          categories.map((category) => (
            <div key={category}>
              <h2 className="text-2xl capitalize">{category}</h2>
              <Accordion type="single" collapsible className="mt-4">
                {filtered
                  .filter((f) => f.category === category)
                  .map((f) => (
                    <AccordionItem key={f.id} value={f.id}>
                      <AccordionTrigger className="text-left text-base">{f.question}</AccordionTrigger>
                      <AccordionContent className="leading-7 text-muted-foreground">{f.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
          ))
        )}
      </section>
    </PublicLayout>
  );
}