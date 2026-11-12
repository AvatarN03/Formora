import { ThemeLogo } from "@/components/custom/theme-logo";

export function FormoraLoading({ label = "Loading your workspace..." }: { label?: string }) {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-6 text-foreground"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.08] blur-3xl"
      />
      <div className="relative flex flex-col items-center text-center">
        <div className="animate-pulse rounded-[2rem] p-4">
          <ThemeLogo className="size-24 sm:size-28" />
        </div>
        <div className="mt-5 flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-border sm:w-14" />
          <h1 className="text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">Formora</h1>
          <span aria-hidden="true" className="h-px w-8 bg-border sm:w-14" />
        </div>
        <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
          <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-primary" />
          <span>{label}</span>
        </div>
      </div>
    </main>
  );
}
