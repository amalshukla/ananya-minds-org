import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome | Mindwell" },
      { name: "description", content: "Personalize your Mindwell care experience." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OnboardingPage,
});

const FOCUS = [
  "Anxiety",
  "Depression",
  "Stress & burnout",
  "Sleep",
  "Relationships",
  "Trauma",
  "Self-esteem",
  "Grief",
];

function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [focus, setFocus] = useState<string[]>([]);
  const [mode, setMode] = useState<"online" | "in_person" | "">("");
  const navigate = useNavigate();

  function toggle(f: string) {
    setFocus((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));
  }

  const steps = ["About you", "What brings you here", "Care preference"];

  return (
    <AuthShell
      eyebrow={`Step ${step + 1} of ${steps.length}`}
      title={steps[step]}
      description="A few quick questions so we can match you with the right care."
    >
      <div className="mb-6 flex items-center gap-2">
        {steps.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i <= step ? "bg-primary" : "bg-secondary",
            )}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-5">
          <div>
            <Label htmlFor="name">Preferred name</Label>
            <Input
              id="name"
              className="mt-2 h-12"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              autoComplete="given-name"
            />
          </div>
          <div>
            <Label htmlFor="pronouns">Pronouns (optional)</Label>
            <Input
              id="pronouns"
              className="mt-2 h-12"
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
              placeholder="she/her, he/him, they/them…"
              maxLength={40}
            />
          </div>
          <Button className="w-full" onClick={() => setStep(1)} disabled={!name}>
            Continue
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <p className="text-sm text-muted-foreground">Pick any that resonate—you can change later.</p>
          <div className="flex flex-wrap gap-2">
            {FOCUS.map((f) => {
              const active = focus.includes(f);
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggle(f)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:bg-secondary",
                  )}
                >
                  {active && <Check className="mr-1 inline size-3.5" />}
                  {f}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button className="flex-1" onClick={() => setStep(2)} disabled={focus.length === 0}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="grid gap-3">
            {(["online", "in_person"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  "warm-card flex items-center justify-between p-5 text-left transition-shadow",
                  mode === m && "ring-2 ring-primary",
                )}
              >
                <div>
                  <p className="font-display text-lg">
                    {m === "online" ? "Online sessions" : "In-person sessions"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {m === "online"
                      ? "Secure video from anywhere you feel safe."
                      : "Visit our warm, private studio space."}
                  </p>
                </div>
                {mode === m && <Check className="text-primary" />}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button className="flex-1" disabled={!mode} onClick={() => navigate({ to: "/" })}>
              Finish setup
            </Button>
          </div>
        </div>
      )}
    </AuthShell>
  );
}