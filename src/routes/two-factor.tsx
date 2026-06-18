import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/two-factor")({
  head: () => ({
    meta: [
      { title: "Two-Factor Authentication | Mindwell" },
      { name: "description", content: "Verify your identity with a second factor to keep your account safe." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TwoFactorPage,
});

function TwoFactorPage() {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function setAt(i: number, v: string) {
    const next = [...digits];
    next[i] = v.replace(/\D/g, "").slice(-1);
    setDigits(next);
    if (v && i < 5) inputs.current[i + 1]?.focus();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const code = digits.join("");
    if (code.length !== 6) return setError("Enter all six digits.");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    if (code === "000000") return setError("Invalid code. Please try again.");
    navigate({ to: "/" });
  }

  return (
    <AuthShell
      eyebrow="Extra security"
      title="Two-factor verification"
      description="Enter the 6-digit code from your authenticator app."
      footer={
        <>
          Lost access?{" "}
          <Link to="/account-locked" className="font-semibold text-primary">
            Use a recovery code
          </Link>
        </>
      }
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="flex justify-between gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => setAt(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !d && i > 0) inputs.current[i - 1]?.focus();
              }}
              className="h-14 w-12 rounded-xl border border-input bg-card text-center font-display text-2xl shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          <ShieldCheck /> {loading ? "Verifying…" : "Verify and continue"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Didn't receive a code? <button type="button" className="font-semibold text-primary">Resend</button>
        </p>
      </form>
    </AuthShell>
  );
}