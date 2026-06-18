import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/signed-out")({
  head: () => ({
    meta: [
      { title: "Signed Out | Mindwell" },
      { name: "description", content: "You've signed out of Mindwell." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignedOutPage,
});

function SignedOutPage() {
  return (
    <AuthShell
      eyebrow="See you soon"
      title="You're signed out"
      description="Your session has ended and your data is safe. Take a breath—come back whenever you're ready."
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="font-semibold text-primary">
            Create an account
          </Link>
        </>
      }
    >
      <div className="warm-card flex flex-col items-center gap-5 p-8 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-secondary text-primary">
          <Heart />
        </span>
        <p className="text-sm text-muted-foreground">
          Thank you for taking care of yourself today.
        </p>
        <Button asChild className="w-full">
          <Link to="/auth">Sign back in</Link>
        </Button>
      </div>
    </AuthShell>
  );
}