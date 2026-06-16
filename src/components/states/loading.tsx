import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block size-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary",
        className,
      )}
    />
  );
}

export function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn("h-4 animate-pulse rounded-full bg-primary/10", className)} />;
}

export function SkeletonCard() {
  return (
    <div className="warm-card space-y-4 p-6" aria-hidden="true">
      <div className="size-12 rounded-2xl bg-primary/10" />
      <SkeletonLine className="w-2/3" />
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-5/6" />
    </div>
  );
}

export function SkeletonGrid({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div
      className={cn("grid gap-5 md:grid-cols-2 lg:grid-cols-4", className)}
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
          <div className="size-10 shrink-0 animate-pulse rounded-full bg-primary/10" />
          <div className="flex-1 space-y-2">
            <SkeletonLine className="w-1/3" />
            <SkeletonLine className="w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FullPageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="grid min-h-[40vh] place-items-center py-20">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Spinner className="size-8" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}