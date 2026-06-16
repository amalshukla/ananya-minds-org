import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { PublicLayout } from "@/components/site-shell";
import { blogQuery, blogRelatedQuery } from "@/queries";
import { SITE } from "@/constants";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    const article = await context.queryClient.ensureQueryData(blogQuery(params.slug));
    if (!article) throw notFound();
    await context.queryClient.ensureQueryData(blogRelatedQuery(params.slug));
    return { article };
  },
  head: ({ loaderData, params }) => ({
    meta: [
      { title: loaderData?.article ? `${loaderData.article.title} | Mindwell Blog` : "Article | Mindwell" },
      { name: "description", content: loaderData?.article?.excerpt ?? "" },
      { property: "og:title", content: loaderData?.article?.title ?? "Mindwell" },
      { property: "og:description", content: loaderData?.article?.excerpt ?? "" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/blog/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
    scripts: loaderData?.article
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: loaderData.article.title,
              datePublished: loaderData.article.publishedAt,
              url: `${SITE.url}/blog/${params.slug}`,
            }),
          },
        ]
      : [],
  }),
  component: BlogArticlePage,
  notFoundComponent: () => (
    <PublicLayout>
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="text-3xl">Article not found</h1>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-primary">
          <ArrowLeft className="size-4" /> Back to blog
        </Link>
      </div>
    </PublicLayout>
  ),
});

function BlogArticlePage() {
  const { slug } = Route.useParams();
  const { data: article } = useSuspenseQuery(blogQuery(slug));
  const { data: related } = useSuspenseQuery(blogRelatedQuery(slug));
  if (!article) return null;
  return (
    <PublicLayout>
      <article className="mx-auto max-w-3xl px-5 py-16">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" /> All articles
        </Link>
        <h1 className="mt-6 text-4xl leading-tight sm:text-5xl">{article.title}</h1>
        <p className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
          <span>{formatDate(article.publishedAt)}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-4" aria-hidden="true" /> {article.readingMinutes} min read
          </span>
        </p>
        <div className="prose-like mt-10 space-y-5 whitespace-pre-line text-lg leading-8 text-foreground/90">
          {article.content}
        </div>
      </article>
      {related.length > 0 && (
        <section className="bg-secondary/55 px-5 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl">Keep reading</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((a) => (
                <Link key={a.id} to="/blog/$slug" params={{ slug: a.slug }} className="warm-card group flex flex-col p-6">
                  <h3 className="text-lg leading-snug">{a.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{a.excerpt}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-primary">
                    Read <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
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