import { createFileRoute, Link } from "@tanstack/react-router";
import { LockKeyhole, LifeBuoy } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/account-locked")({
  head: () => ({
    meta: [
      { title: "Account Locked | Mindwell" },
      { name: "description", content: "Your account is temporarily locked for security." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountLockedPage,
});

function AccountLockedPage() {
  return (
    <AuthShell
      eyebrow="Security hold"
      title="Account temporarily locked"
      description="For your protection, we've paused sign-in after several failed attempts. You can unlock it through email or contact our care team."
      footer={
        <>
          Back to{" "}
          <Link to="/auth" className="font-semibold text-primary">
            sign in
          </Link>
        </>
      }
    >
      <div className="warm-card space-y-5 p-6">
        <div className="flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
            <LockKeyhole />
          </span>
          <div>
            <p className="font-semibold">5 failed attempts detected</p>
            <p className="text-sm text-muted-foreground">
              The lock lifts automatically in 15 minutes.
            </p>
          </div>
        </div>
        <Button asChild className="w-full">
          <Link to="/forgot-password">Reset password to unlock</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link to="/contact">
            <LifeBuoy /> Contact support
          </Link>
        </Button>
      </div>
    </AuthShell>
  );
}