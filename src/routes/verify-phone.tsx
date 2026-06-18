import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Phone } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/verify-phone")({
  head: () => ({
    meta: [
      { title: "Verify Phone | Mindwell" },
      { name: "description", content: "Verify your phone number to enable secure SMS notifications." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VerifyPhonePage,
});

function VerifyPhonePage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"send" | "verify">("send");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setStage("verify");
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    navigate({ to: "/onboarding" });
  }

  return (
    <AuthShell
      eyebrow="Verify identity"
      title={stage === "send" ? "Verify your phone" : "Enter the SMS code"}
      description={
        stage === "send"
          ? "We'll send a 6-digit code via SMS to confirm it's really you."
          : `We sent a code to ${phone}. It expires in 10 minutes.`
      }
      footer={
        <>
          Skip for now?{" "}
          <Link to="/" className="font-semibold text-primary">
            Continue without SMS
          </Link>
        </>
      }
    >
      {stage === "send" ? (
        <form className="space-y-5" onSubmit={send}>
          <div>
            <Label htmlFor="phone">Phone number</Label>
            <div className="relative mt-2">
              <Phone className="pointer-events-none absolute left-3 top-3.5 size-5 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                className="h-12 pl-11"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 123 4567"
                required
                maxLength={20}
                autoComplete="tel"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send verification code"}
          </Button>
        </form>
      ) : (
        <form className="space-y-5" onSubmit={verify}>
          <div>
            <Label htmlFor="code">6-digit code</Label>
            <Input
              id="code"
              inputMode="numeric"
              className="mt-2 h-12 text-center font-display text-2xl tracking-[0.5em]"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              maxLength={6}
              autoComplete="one-time-code"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
            {loading ? "Verifying…" : "Verify phone"}
          </Button>
          <button
            type="button"
            onClick={() => setStage("send")}
            className="block w-full text-center text-sm text-primary"
          >
            Change phone number
          </button>
        </form>
      )}
    </AuthShell>
  );
}