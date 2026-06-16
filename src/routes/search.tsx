import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { Search } from "lucide-react";
import { PublicLayout } from "@/components/site-shell";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/states/empty";
import { FullPageLoader } from "@/components/states/loading";
import { searchQuery } from "@/queries";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Search | Mindwell" },
      { name: "description", content: "Search Mindwell services, articles, resources, and frequently asked questions." },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "/search" },
    ],
    links: [{ rel: "canonical", href: "/search" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [value, setValue] = useState(q);
  const { data, isFetching } = useQuery(searchQuery(q));

  return (
    <PublicLayout>
      <section className="bg-secondary/55 px-5 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl">Search Mindwell</h1>
          <form
            className="relative mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ search: { q: value.trim() || undefined } });
            }}
          >
            <Search aria-hidden="true" className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search services, articles, resources…"
              className="h-14 rounded-full pl-12 text-lg"
              aria-label="Search query"
            />
          </form>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-5 py-14">
        {!q ? (
          <EmptyState title="Start typing to search" description="We'll look across services, articles, resources, and FAQs." />
        ) : isFetching || !data ? (
          <FullPageLoader label="Searching…" />
        ) : Object.values(data).every((v) => v.length === 0) ? (
          <EmptyState title={`No results for "${q}"`} description="Try different keywords or browse our blog and resources." />
        ) : (
          <div className="space-y-12">
            <ResultGroup title="Services">
              {data.services.map((s) => (
                <Link key={s.id} to="/services/$slug" params={{ slug: s.slug }} className="warm-card block p-5">
                  <strong>{s.title}</strong>
                  <p className="mt-1 text-sm text-muted-foreground">{s.shortDescription}</p>
                </Link>
              ))}
            </ResultGroup>
            <ResultGroup title="Articles">
              {data.articles.map((a) => (
                <Link key={a.id} to="/blog/$slug" params={{ slug: a.slug }} className="warm-card block p-5">
                  <strong>{a.title}</strong>
                  <p className="mt-1 text-sm text-muted-foreground">{a.excerpt}</p>
                </Link>
              ))}
            </ResultGroup>
            <ResultGroup title="Resources">
              {data.resources.map((r) => (
                <div key={r.id} className="warm-card p-5">
                  <strong>{r.title}</strong>
                  <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                </div>
              ))}
            </ResultGroup>
            <ResultGroup title="FAQs">
              {data.faqs.map((f) => (
                <div key={f.id} className="warm-card p-5">
                  <strong>{f.question}</strong>
                  <p className="mt-1 text-sm text-muted-foreground">{f.answer}</p>
                </div>
              ))}
            </ResultGroup>
          </div>
        )}
      </section>
    </PublicLayout>
  );
}

function ResultGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const items = Array.isArray(children) ? children.flat().filter(Boolean) : [children];
  if (items.length === 0) return null;
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-[.18em] text-primary">{title}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">{children}</div>
    </div>
  );
}