import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Download, Headphones, NotebookPen, PlayCircle } from "lucide-react";
import { PublicLayout } from "@/components/site-shell";
import { resourcesQuery } from "@/queries";
import type { ResourceKind } from "@/types";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Mental Health Resources | Mindwell" },
      { name: "description", content: "Practical, clinician-reviewed mental health guides, audio practices, and worksheets." },
      { property: "og:title", content: "Mental Health Resources | Mindwell" },
      { property: "og:url", content: "/resources" },
    ],
    links: [{ rel: "canonical", href: "/resources" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(resourcesQuery({ pageSize: 50 })),
  component: ResourcesPage,
});

const KIND_ICON: Record<ResourceKind, typeof BookOpen> = {
  guide: BookOpen,
  worksheet: NotebookPen,
  audio: Headphones,
  video: PlayCircle,
  article: BookOpen,
};
const KIND_LABEL: Record<ResourceKind, string> = {
  guide: "Guide",
  worksheet: "Worksheet",
  audio: "Audio practice",
  video: "Video",
  article: "Article",
};

function ResourcesPage() {
  const { data } = useSuspenseQuery(resourcesQuery({ pageSize: 50 }));
  return (
    <PublicLayout>
      <section className="bg-secondary/55 px-5 py-20 text-center">
        <p className="text-sm font-bold uppercase tracking-[.18em] text-primary">Self-guided care</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-5xl">Resources for steadier days</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          Clinician-reviewed guides, audio practices, and worksheets — free to use, any time.
        </p>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.results.map((r) => {
            const Icon = KIND_ICON[r.kind];
            return (
              <article key={r.id} className="warm-card flex flex-col p-7">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-primary">
                  <Icon className="size-4" aria-hidden="true" /> {KIND_LABEL[r.kind]}
                  {r.durationMinutes ? <span className="text-muted-foreground">· {r.durationMinutes} min</span> : null}
                </span>
                <h2 className="mt-4 text-xl">{r.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{r.description}</p>
                <Link to="/contact" className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-primary">
                  <Download className="size-4" aria-hidden="true" /> Request access <ArrowRight className="size-3.5" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </PublicLayout>
  );
}