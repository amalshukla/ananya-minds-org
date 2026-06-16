import { Link } from "@tanstack/react-router";

export interface LegalSection {
  id: string;
  heading: string;
  body: string;
}

export interface LegalDocumentProps {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export function LegalDocument({ eyebrow, title, lastUpdated, sections }: LegalDocumentProps) {
  return (
    <>
      <section className="bg-secondary/55 px-5 py-16 text-center">
        <p className="text-sm font-bold uppercase tracking-[.18em] text-primary">{eyebrow}</p>
        <h1 className="mt-4 text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">{lastUpdated}</p>
      </section>
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[220px_1fr] lg:px-8">
        <nav aria-label="Document sections" className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
          <ul className="space-y-2 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <Link to="." hash={s.id} className="text-muted-foreground transition hover:text-primary">
                  {s.heading}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="warm-card prose-like space-y-10 p-8 sm:p-12">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="font-display text-2xl">{s.heading}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </article>
      </section>
    </>
  );
}