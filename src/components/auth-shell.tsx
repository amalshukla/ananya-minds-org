import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Brain, LockKeyhole } from "lucide-react";

export interface AuthShellProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ eyebrow, title, description, children, footer }: AuthShellProps) {
  return (
    <main className="grid min-h-dvh bg-background lg:grid-cols-2">
      <section className="hidden bg-secondary/60 p-14 lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-3 font-display text-xl">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Brain />
          </span>
          Mindwell
        </Link>
        <div className="max-w-lg">
          <p className="font-display text-4xl font-semibold leading-tight">
            A calm, private space for your wellbeing.
          </p>
          <p className="mt-5 text-muted-foreground">
            Care that meets you where you are—gentle, modern, and human.
          </p>
        </div>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <LockKeyhole className="size-4" />
          Privacy-first and confidential
        </p>
      </section>
      <section className="flex items-center justify-center p-5">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-10 flex items-center gap-2 font-display text-lg lg:hidden">
            <Brain className="text-primary" />
            Mindwell
          </Link>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
          )}
          <h1 className="mt-2 text-4xl font-semibold">{title}</h1>
          {description && <p className="mt-3 text-muted-foreground">{description}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-7 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </section>
    </main>
  );
}