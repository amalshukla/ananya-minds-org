import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify Email | Mindwell" },
      { name: "description", content: "Confirm your email address to activate your Mindwell account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const [sending, setSending] = useState(false);
  const [resent, setResent] = useState(false);

  async function resend() {
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    setSending(false);
    setResent(true);
  }

  return (
    <AuthShell
      eyebrow="One more step"
      title="Verify your email"
      description="We've sent a confirmation link to your inbox. Click it to activate your care account."
      footer={
        <>
          Wrong address?{" "}
          <Link to="/register" className="font-semibold text-primary">
            Update email
          </Link>
        </>
      }
    >
      <div className="warm-card flex flex-col items-center gap-4 p-8 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-secondary text-primary">
          <MailCheck />
        </span>
        <p className="text-sm text-muted-foreground">
          The link expires in 24 hours. If you don't see it, please check spam or promotions.
        </p>
        <Button variant="outline" onClick={resend} disabled={sending || resent}>
          {resent ? "Email resent" : sending ? "Sending…" : "Resend email"}
        </Button>
      </div>
    </AuthShell>
  );
}