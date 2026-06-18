import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password | Mindwell" },
      { name: "description", content: "Reset your Mindwell account password securely." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <AuthShell
        eyebrow="Check your inbox"
        title="Reset link sent"
        description={`If an account exists for ${email}, we've sent a secure password reset link. It expires in 30 minutes.`}
        footer={
          <>
            Didn't receive it?{" "}
            <button onClick={() => setSent(false)} className="font-semibold text-primary">
              Try a different email
            </button>
          </>
        }
      >
        <div className="warm-card flex items-center gap-4 p-6">
          <span className="grid size-12 place-items-center rounded-full bg-secondary text-primary">
            <MailCheck />
          </span>
          <p className="text-sm text-muted-foreground">
            Tip: check spam or promotions folders if you don't see it within a few minutes.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot password?"
      description="Enter your email and we'll send you a secure link to set a new one."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/auth" className="font-semibold text-primary">
            Back to sign in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            className="mt-2 h-12"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={255}
            autoComplete="email"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending…" : "Send reset link"}
        </Button>
      </form>
    </AuthShell>
  );
}