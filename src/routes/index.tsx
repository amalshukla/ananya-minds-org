import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeCheck, CalendarCheck, Heart, LockKeyhole, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PublicLayout } from "@/components/site-shell";
import { ServiceIcon } from "@/components/service-icon";
import { faqsQuery, popularServicesQuery, testimonialsQuery } from "@/queries";
import therapistHero from "@/assets/therapist-warm.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mindwell Clinical Psychology | Feel Like You Again" },
      { name: "description", content: "Compassionate, evidence-based therapy and assessment in a calm, confidential space. Book an online or in-person appointment." },
      { property: "og:title", content: "Mindwell Clinical Psychology" },
      { property: "og:description", content: "Professional psychological care, thoughtfully tailored to you." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(popularServicesQuery()),
      context.queryClient.ensureQueryData(faqsQuery("general")),
      context.queryClient.ensureQueryData(testimonialsQuery({ pageSize: 3 })),
    ]);
  },
  component: Index,
});

function Index() {
  const { data: services } = useSuspenseQuery(popularServicesQuery());
  const { data: faqList } = useSuspenseQuery(faqsQuery("general"));
  const { data: testimonials } = useSuspenseQuery(testimonialsQuery({ pageSize: 3 }));
  const featuredTestimonial = testimonials.results[0];
  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-background">
        <div className="organic-blob absolute -left-24 top-20 size-80 bg-accent/20 blur-3xl" aria-hidden="true" />
        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-14 px-5 py-16 lg:grid-cols-[1.02fr_.98fr] lg:px-8 lg:py-24">
          <div className="relative z-10 reveal-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground"><Heart className="size-4" aria-hidden="true" /> Compassionate care, at your pace</div>
            <h1 className="mt-7 max-w-2xl text-5xl leading-[1.08] tracking-[-0.035em] text-foreground sm:text-6xl lg:text-7xl">Feel <em className="font-normal text-primary">understood.</em><br />Feel like you again.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">Evidence-based therapy with a human touch. A calm, confidential space to work through what matters—without judgment.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button size="lg" variant="hero" asChild><Link to="/book">Book a consultation <ArrowRight /></Link></Button><Button size="lg" variant="outline" asChild><Link to="/services">Explore support options</Link></Button></div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground"><span className="flex items-center gap-2"><LockKeyhole className="size-4 text-primary" /> Private & confidential</span><span className="flex items-center gap-2"><CalendarCheck className="size-4 text-primary" /> Appointments this week</span><span className="flex items-center gap-2"><BadgeCheck className="size-4 text-primary" /> Registered psychologists</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none"><div className="organic-blob absolute -inset-8 bg-accent/20" aria-hidden="true" /><img src={therapistHero} width={1024} height={1280} fetchPriority="high" alt="A welcoming clinical psychologist in a warm, sunlit therapy room" className="relative aspect-[4/5] w-full rotate-2 rounded-[3rem] object-cover object-center shadow-[var(--shadow-soft)] transition duration-1000 hover:rotate-0 sm:rounded-[5rem]" /><div className="glass-surface absolute -bottom-6 left-4 flex items-center gap-4 rounded-3xl border border-card/70 p-4 sm:left-[-2rem]"><span className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary"><BadgeCheck /></span><div><strong className="block text-sm">Fully accredited</strong><span className="text-xs text-muted-foreground">Clinical excellence, human care</span></div></div></div>
        </div>
      </section>
      <section className="border-y border-border bg-card"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-10 text-center md:grid-cols-4 lg:px-8">{[["15+","Years experience"],["2,500+","Sessions supported"],["98%","Feel heard"],["12","Specialist areas"]].map(([value,label])=><div key={label}><strong className="font-display text-3xl text-primary">{value}</strong><p className="mt-1 text-sm text-muted-foreground">{label}</p></div>)}</div></section>
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="max-w-2xl"><span className="text-sm font-bold uppercase tracking-[.18em] text-primary">How we can help</span><h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Support for the whole you</h2><p className="mt-5 text-lg text-muted-foreground">Personalized care for where you are now and where you want to go.</p></div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <Link to="/services/$slug" params={{ slug: s.slug }} key={s.id} className="warm-card group flex flex-col p-6">
              <span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary"><ServiceIcon name={s.icon} className="size-6" /></span>
              <h3 className="mt-6 text-xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{s.shortDescription}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-primary">Learn more <ArrowRight className="size-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center"><Button variant="outline" asChild><Link to="/services">See all services <ArrowRight /></Link></Button></div>
      </section>
      <section className="bg-secondary/55">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="text-sm font-bold uppercase tracking-[.18em] text-primary">A gentler first step</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">You do not have to figure it out alone.</h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">Therapy should feel collaborative—not clinical or rushed. We combine proven methods with warmth, curiosity, and respect for your lived experience.</p>
            <Button className="mt-8" variant="soft" asChild><Link to="/about">Meet our approach <ArrowRight /></Link></Button>
          </div>
          {featuredTestimonial && (
            <blockquote className="warm-card p-8">
              <div className="flex gap-1 text-primary" aria-label={`${featuredTestimonial.rating} out of 5 stars`}>
                {Array.from({ length: featuredTestimonial.rating }, (_, i) => <Star key={i} className="size-5 fill-current" aria-hidden="true" />)}
              </div>
              <p className="mt-6 font-display text-2xl leading-10">“{featuredTestimonial.quote}”</p>
              <footer className="mt-6 text-sm text-muted-foreground">{featuredTestimonial.authorContext}</footer>
            </blockquote>
          )}
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-5 py-24">
        <div className="text-center"><span className="text-sm font-bold uppercase tracking-[.18em] text-primary">Common questions</span><h2 className="mt-4 text-4xl font-semibold">It is okay to ask</h2></div>
        <Accordion type="single" collapsible className="mt-10">
          {faqList.results.slice(0, 5).map((f) => (
            <AccordionItem key={f.id} value={f.id}>
              <AccordionTrigger className="text-base">{f.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-7">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-10 text-center"><Button variant="link" asChild><Link to="/faqs">All frequently asked questions <ArrowRight /></Link></Button></div>
      </section>
      <section className="px-5 pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
          <h2 className="text-3xl font-semibold sm:text-4xl">A calmer next chapter can start today.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">Book a free 15-minute consultation. No pressure—just a thoughtful conversation about what support might help.</p>
          <Button size="lg" className="mt-8 bg-card text-foreground hover:bg-card/90" asChild><Link to="/book">Find an appointment <ArrowRight /></Link></Button>
        </div>
      </section>
    </PublicLayout>
  );
}
