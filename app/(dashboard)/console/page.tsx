import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";

import { FormCollection, FormCollectionSkeleton } from "@/components/forms/form-collection";
import { StatsCards, StatsCardsSkeleton } from "@/components/forms/stats-cards";
import CreateForm from "@/components/forms/createForm";

export default async function ConsolePage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return (
    <main data-console className="console-page relative min-h-screen overflow-hidden">
      {/* Subtle Ambient Warm Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 -z-10 size-120 rounded-full bg-linear-to-br from-primary/6 via-orange-400/2 to-transparent blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -left-32 -z-10 size-105 rounded-full bg-linear-to-tr from-primary/4 via-orange-400/2 to-transparent blur-[120px]"
      />

      <div className="mx-auto max-w-384 space-y-12 px-5 py-10 sm:px-6 lg:px-10 lg:py-14">
        {/* Workspace Hero Header */}
        <div className="flex flex-col gap-6 border-b border-border/40 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-3 py-1 font-mono text-[11px] text-muted-foreground shadow-2xs">
              <span className="size-1.5 rounded-full bg-primary" />
              <span className="tracking-wider uppercase">Workspace Studio</span>
            </div>

            <h1 className="text-4xl font-bold uppercase tracking-tight sm:text-6xl lg:text-7xl leading-[0.98] text-foreground">
              Your forms, <br />
              <span className="text-muted-foreground">in focus.</span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              A tactile workspace for composing thoughtful forms, inspecting live responses, and keeping your pipeline moving.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden font-mono text-[11px] uppercase tracking-wider text-muted-foreground sm:inline">
              {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
            <CreateForm />
          </div>
        </div>

        {/* Section 1: Overview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground font-semibold">
              Performance Overview
            </h2>
            <span className="text-[11px] font-mono text-muted-foreground/70">
              Aggregated across all forms
            </span>
          </div>
          <Suspense fallback={<StatsCardsSkeleton />}>
            <StatsCards userId={userId} />
          </Suspense>
        </section>

        {/* Section 2: Form Collection */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground font-semibold">
              Forms Library
            </h2>
          </div>
          <Suspense fallback={<FormCollectionSkeleton />}>
            <FormCollection userId={userId} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
