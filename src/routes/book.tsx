import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Check, Clock, Laptop, MapPin } from "lucide-react";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { servicesQuery } from "@/queries";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a Psychology Appointment | Mindwell" },
      { name: "description", content: "Choose a service, appointment format, and time for your Mindwell consultation." },
      { property: "og:title", content: "Book an Appointment | Mindwell" },
      { property: "og:description", content: "A simple, private way to take the next step." },
      { property: "og:url", content: "/book" },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery({ pageSize: 50 })),
  component: BookPage,
});
function BookPage() {
  const { data } = useSuspenseQuery(servicesQuery({ pageSize: 50 }));
  const services = data.results;
  const [step, setStep] = useState(1);
  const [service, setService] = useState<string>(services[0]?.title ?? "");
  const [format, setFormat] = useState<"Online" | "In person">("Online");
  return (
    <PublicLayout>
      <section className="mx-auto max-w-5xl px-5 py-14">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[.18em] text-primary">Private & secure booking</p>
          <h1 className="mt-4 text-4xl font-semibold">Find a time that feels right</h1>
        </div>
        <ol className="mx-auto mt-10 flex max-w-xl items-center justify-between" aria-label="Booking progress">
          {["Support", "Format", "Time"].map((label, i) => (
            <li key={label} className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
              <span className={step > i ? "grid size-9 place-items-center rounded-full bg-primary text-primary-foreground" : "grid size-9 place-items-center rounded-full border border-border bg-card"}>
                {step > i + 1 ? <Check aria-hidden="true" /> : i + 1}
              </span>
              {label}
            </li>
          ))}
        </ol>
        <div className="mt-10 warm-card p-6 sm:p-10">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold">What kind of support are you looking for?</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <button key={s.id} type="button" onClick={() => setService(s.title)} className={service === s.title ? "rounded-2xl border-2 border-primary bg-secondary p-5 text-left" : "rounded-2xl border border-border p-5 text-left hover:border-primary/40"}>
                    <strong>{s.title}</strong>
                    <span className="mt-2 block text-sm text-muted-foreground">{s.shortDescription}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold">How would you like to meet?</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {([["Online", Laptop, "Secure video from your own space"], ["In person", MapPin, "Visit our calm, accessible clinic"]] as const).map(([label, Icon, desc]) => (
                  <button key={label} type="button" onClick={() => setFormat(label)} className={format === label ? "rounded-2xl border-2 border-primary bg-secondary p-6 text-left" : "rounded-2xl border border-border p-6 text-left"}>
                    <Icon className="text-primary" aria-hidden="true" />
                    <strong className="mt-4 block">{label}</strong>
                    <span className="mt-2 block text-sm text-muted-foreground">{desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold">Choose an available time</h2>
              <div className="mt-6 flex items-center gap-3 rounded-xl bg-secondary p-4">
                <CalendarDays className="text-primary" aria-hidden="true" />
                <span className="font-medium">Tuesday, June 16</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM"].map((t) => (
                  <button type="button" key={t} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border hover:border-primary hover:bg-secondary">
                    <Clock className="size-4" aria-hidden="true" /> {t}
                  </button>
                ))}
              </div>
              <div className="mt-8 rounded-2xl border border-border bg-background p-5">
                <strong>Booking summary</strong>
                <p className="mt-2 text-sm text-muted-foreground">{service} · {format} · 50 minutes</p>
              </div>
            </div>
          )}
          <div className="mt-8 flex justify-between">
            <Button variant="ghost" disabled={step === 1} onClick={() => setStep(step - 1)}>Back</Button>
            <Button onClick={() => step < 3 && setStep(step + 1)}>{step === 3 ? "Continue to account" : "Continue"}</Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}