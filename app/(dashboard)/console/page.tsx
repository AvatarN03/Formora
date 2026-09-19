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
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-3 border-b border-border/50 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Workspace Console</span>
            </div>
            <h1 className="mt-1 text-2xl font-medium tracking-tight text-foreground">
              Form workspace
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Overview of active forms, response collection, and deployment status.
            </p>
          </div>

          <CreateForm />
        </div>

        <Suspense fallback={<StatsCardsSkeleton />}>
          <StatsCards userId={userId} />
        </Suspense>

        <Suspense fallback={<FormCollectionSkeleton />}>
          <FormCollection userId={userId} />
        </Suspense>
      </div>
    </main>
  );
}