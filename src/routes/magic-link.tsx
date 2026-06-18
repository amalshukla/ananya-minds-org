import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/magic-link")({
  head: () => ({
    meta: [
      { title: "Sign in with Magic Link | Mindwell" },
      { name: "description", content: "Sign in to Mindwell with a secure email link—no password required." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MagicLinkPage,
});

function MagicLinkPage() {
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

  return (
    <AuthShell
      eyebrow="Password-free"
      title={sent ? "Check your email" : "Sign in with a magic link"}
      description={
        sent
          ? `We sent a one-tap sign-in link to ${email}. It expires in 15 minutes.`
          : "We'll email you a one-tap secure link to sign in—no password required."
      }
      footer={
        <>
          Prefer password?{" "}
          <Link to="/auth" className="font-semibold text-primary">
            Sign in normally
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="warm-card flex items-center gap-4 p-6">
          <span className="grid size-12 place-items-center rounded-full bg-secondary text-primary">
            <Sparkles />
          </span>
          <p className="text-sm text-muted-foreground">
            Open the email on this device for the smoothest experience.
          </p>
        </div>
      ) : (
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
            {loading ? "Sending…" : "Email me a magic link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}