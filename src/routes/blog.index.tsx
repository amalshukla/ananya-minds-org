import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import { PublicLayout } from "@/components/site-shell";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/states/empty";
import { blogCategoriesQuery, blogsQuery } from "@/queries";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Mindwell Blog | Mental health insights" },
      { name: "description", content: "Clinician-reviewed articles on anxiety, relationships, neurodiversity, grief, and everyday wellbeing." },
      { property: "og:title", content: "Mindwell Blog" },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(blogsQuery({ pageSize: 50 })),
      context.queryClient.ensureQueryData(blogCategoriesQuery()),
    ]);
  },
  component: BlogIndex,
});

function BlogIndex() {
  const { data } = useSuspenseQuery(blogsQuery({ pageSize: 50 }));
  const { data: categories } = useSuspenseQuery(blogCategoriesQuery());
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const filtered = data.results
    .filter((a) => (category ? categories.find((c) => c.slug === category)?.id === a.categoryId : true))
    .filter((a) =>
      query ? a.title.toLowerCase().includes(query.toLowerCase()) || a.excerpt.toLowerCase().includes(query.toLowerCase()) : true,
    );

  return (
    <PublicLayout>
      <section className="bg-secondary/55 px-5 py-20 text-center">
        <p className="text-sm font-bold uppercase tracking-[.18em] text-primary">Insights</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-5xl">A library of gentle, clear thinking</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Short, clinician-reviewed articles on what helps and what gets in the way.
        </p>
        <label className="relative mx-auto mt-8 block max-w-xl">
          <Search aria-hidden="true" className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles"
            className="h-12 rounded-full pl-11"
            aria-label="Search articles"
          />
        </label>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter by category">
          <CategoryChip active={category === null} onClick={() => setCategory(null)}>
            All
          </CategoryChip>
          {categories.map((c) => (
            <CategoryChip key={c.id} active={category === c.slug} onClick={() => setCategory(c.slug)}>
              {c.name}
            </CategoryChip>
          ))}
        </div>
        <div className="mt-10">
          {filtered.length === 0 ? (
            <EmptyState icon={<BookOpen aria-hidden="true" />} title="No articles match" description="Try a different category or search term." />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((a) => (
                <Link
                  key={a.id}
                  to="/blog/$slug"
                  params={{ slug: a.slug }}
                  className="warm-card group flex flex-col p-6 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="text-xs font-bold uppercase tracking-[.14em] text-primary">
                    {categories.find((c) => c.id === a.categoryId)?.name ?? "Article"}
                  </span>
                  <h2 className="mt-3 text-xl leading-snug">{a.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{a.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between pt-6 text-xs text-muted-foreground">
                    <span>{formatDate(a.publishedAt)} · {a.readingMinutes} min</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                      Read <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}

function CategoryChip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-semibold transition",
        active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      )}
      role="tab"
      aria-selected={active}
    >
      {children}
    </button>
  );
}