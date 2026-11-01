import { Suspense } from "react";

import { auth } from "@clerk/nextjs/server";

import { FormCollection, FormCollectionSkeleton } from "./_components/form-collection";
import { StatsCards, StatsCardsSkeleton } from "./_components/stats-cards";
import CreateForm from "./_components/createForm";

export default async function ConsolePage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return (
    <main data-console className="console-page min-h-screen">
      <div className="mx-auto max-w-[96rem] space-y-10 px-5 py-10 sm:px-6 lg:px-10 lg:py-14">
        <div className="flex flex-col gap-6 border-b border-border/50 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-0.5 w-10 bg-primary" />
              <span>Workspace / Console</span>
            </div>
            <h1 className="max-w-[9ch] text-5xl font-bold uppercase leading-[0.9] tracking-[-0.06em] text-foreground sm:text-7xl">
              Your forms, in focus.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
              A focused workspace for composing clear forms, collecting responses, and keeping every project moving.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:inline">
              {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
            <CreateForm />
          </div>
        </div>

        <div className="console-section-label">
          <span>01</span>
          <span>Workspace overview</span>
        </div>
        <Suspense fallback={<StatsCardsSkeleton />}>
          <StatsCards userId={userId} />
        </Suspense>

        <div className="console-section-label pt-2">
          <span>02</span>
          <span>Form collection</span>
        </div>
        <Suspense fallback={<FormCollectionSkeleton />}>
          <FormCollection userId={userId} />
        </Suspense>
      </div>
    </main>
  );
}