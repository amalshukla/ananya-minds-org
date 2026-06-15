import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, CalendarCheck, Heart, LockKeyhole, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PublicLayout } from "@/components/site-shell";
import { faqs, services } from "@/lib/content";
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
  component: Index,
});

function Index() {
  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-background">
        <div className="absolute -left-24 top-20 size-80 rounded-full bg-accent/45 blur-3xl" aria-hidden="true" />
        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-14 px-5 py-16 lg:grid-cols-[1.02fr_.98fr] lg:px-8 lg:py-24">
          <div className="relative z-10 reveal-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground"><Heart className="size-4" aria-hidden="true" /> Compassionate care, at your pace</div>
            <h1 className="mt-7 max-w-2xl text-5xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-6xl lg:text-7xl">Feel understood.<br /><span className="text-primary">Feel like you again.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">Evidence-based therapy with a human touch. A calm, confidential space to work through what matters—without judgment.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button size="lg" variant="hero" asChild><a href="/book">Book a consultation <ArrowRight /></a></Button><Button size="lg" variant="outline" asChild><a href="/services">Explore support options</a></Button></div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground"><span className="flex items-center gap-2"><LockKeyhole className="size-4 text-primary" /> Private & confidential</span><span className="flex items-center gap-2"><CalendarCheck className="size-4 text-primary" /> Appointments this week</span><span className="flex items-center gap-2"><BadgeCheck className="size-4 text-primary" /> Registered psychologists</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none"><div className="absolute -inset-5 rotate-2 rounded-[2.5rem] bg-surface-teal" aria-hidden="true" /><img src={therapistHero} width={1536} height={1024} fetchPriority="high" alt="A welcoming clinical psychologist in a calm therapy room" className="relative aspect-[4/5] w-full rounded-[2rem] object-cover object-center shadow-[var(--shadow-soft)] lg:aspect-[5/6]" /><div className="glass-surface absolute -bottom-6 left-4 flex items-center gap-4 rounded-2xl border border-border/70 p-4 sm:left-[-2rem]"><span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary"><Star /></span><div><strong className="block text-sm">4.9 patient rating</strong><span className="text-xs text-muted-foreground">Care that feels personal</span></div></div></div>
        </div>
      </section>
      <section className="border-y border-border bg-card"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-10 text-center md:grid-cols-4 lg:px-8">{[["15+","Years experience"],["2,500+","Sessions supported"],["98%","Feel heard"],["12","Specialist areas"]].map(([value,label])=><div key={label}><strong className="font-display text-3xl text-primary">{value}</strong><p className="mt-1 text-sm text-muted-foreground">{label}</p></div>)}</div></section>
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><div className="max-w-2xl"><span className="text-sm font-bold uppercase tracking-[.18em] text-primary">How we can help</span><h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Support for the whole you</h2><p className="mt-5 text-lg text-muted-foreground">Personalized care for where you are now and where you want to go.</p></div><div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{services.map(({slug,title,description,icon:Icon})=><a href={`/services/${slug}`} key={slug} className="group rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-primary/30"><span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary"><Icon /></span><h3 className="mt-6 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">Learn more <ArrowRight className="size-4 transition group-hover:translate-x-1" /></span></a>)}</div></section>
      <section className="bg-secondary/55"><div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 lg:grid-cols-2 lg:px-8"><div><span className="text-sm font-bold uppercase tracking-[.18em] text-primary">A gentler first step</span><h2 className="mt-4 text-4xl font-semibold tracking-tight">You do not have to figure it out alone.</h2><p className="mt-6 text-lg leading-8 text-muted-foreground">Therapy should feel collaborative—not clinical or rushed. We combine proven methods with warmth, curiosity, and respect for your lived experience.</p><Button className="mt-8" variant="soft" asChild><a href="/about">Meet our approach <ArrowRight /></a></Button></div><blockquote className="rounded-3xl bg-card p-8 shadow-[var(--shadow-soft)]"><div className="flex gap-1 text-primary" aria-label="5 out of 5 stars">{[1,2,3,4,5].map(i=><Star key={i} className="size-5 fill-current" />)}</div><p className="mt-6 font-display text-2xl leading-10">“For the first time, I felt I could talk openly without having to explain or defend how I felt.”</p><footer className="mt-6 text-sm text-muted-foreground">Verified patient · Individual therapy</footer></blockquote></div></section>
      <section className="mx-auto max-w-4xl px-5 py-24"><div className="text-center"><span className="text-sm font-bold uppercase tracking-[.18em] text-primary">Common questions</span><h2 className="mt-4 text-4xl font-semibold">It is okay to ask</h2></div><Accordion type="single" collapsible className="mt-10">{faqs.map(([q,a],i)=><AccordionItem key={q} value={`item-${i}`}><AccordionTrigger className="text-base">{q}</AccordionTrigger><AccordionContent className="text-muted-foreground leading-7">{a}</AccordionContent></AccordionItem>)}</Accordion></section>
      <section className="px-5 pb-24"><div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12"><h2 className="text-3xl font-semibold sm:text-4xl">A calmer next chapter can start today.</h2><p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">Book a free 15-minute consultation. No pressure—just a thoughtful conversation about what support might help.</p><Button size="lg" className="mt-8 bg-card text-foreground hover:bg-card/90" asChild><a href="/book">Find an appointment <ArrowRight /></a></Button></div></section>
    </PublicLayout>
  );
}
