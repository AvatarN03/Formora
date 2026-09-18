import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import {
  ArrowLeft,
  ArrowUpRight,
  Layers,
  Plus,
  Sparkles,
} from "lucide-react";

import { FormCollection, FormCollectionSkeleton } from "@/app/console/_components/form-collection";
import { StatsCards, StatsCardsSkeleton } from "@/app/console/_components/stats-cards";
import { buttonVariants } from "@/components/ui/button";

export default async function ConsolePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const firstName = user?.firstName ?? "there";

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/25 selection:text-foreground">
      {/* -------------------- COMPACT TOP BAR -------------------- */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-semibold tracking-tight"
            >
              <span className="flex size-6 items-center justify-center rounded-md bg-primary text-[11px] font-semibold text-primary-foreground">
                f
              </span>
              <span className="font-medium text-foreground tracking-tight">formly</span>
            </Link>

            <span className="text-border/80">/</span>

            <div className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 text-xs text-muted-foreground">
              <Layers className="size-3 text-primary" />
              <span className="font-medium text-foreground max-w-30 sm:max-w-none truncate">
                {firstName}&apos;s workspace
              </span>
              <span className="rounded bg-primary/15 px-1 py-0.2 text-[9px] font-mono text-primary uppercase">
                Free
              </span>
            </div>
          </div>

                   

            

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-7 border border-border/80",
                },
              }}
            />
          
        </div>
      </header>

      {/* -------------------- MAIN WORKSPACE CONTENT -------------------- */}
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 space-y-6">
        {/* Workspace Title & Quick Action */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-5">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Workspace Console</span>
            </div>
            <h1 className="text-xl font-medium tracking-tight text-foreground mt-1">
              Welcome back, {firstName}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Overview of active forms, response collection, and deployment status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <span>Explore demo</span>
            </Link>
            <button
              type="button"
              className={buttonVariants({ size: "sm" })}
            >
              <Plus className="size-3.5" />
              <span>New form</span>
            </button>
          </div>
        </div>

        {/* -------------------- STATS CARDS (PRISMA AGGREGATION) -------------------- */}
        <Suspense fallback={<StatsCardsSkeleton />}>
          <StatsCards userId={userId} />
        </Suspense>

        {/* -------------------- FORMS MANAGEMENT COLLECTION (PRISMA FETCH) -------------------- */}
        <Suspense fallback={<FormCollectionSkeleton />}>
          <FormCollection userId={userId} />
        </Suspense>

        {/* -------------------- COMPACT STARTER TEMPLATES -------------------- */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              <Sparkles className="size-3.5 text-primary" />
              <span>Quick Starter Presets</span>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              Pre-structured components
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                title: "Feedback & NPS Survey",
                fields: "4 fields · Rating, Short text, Single choice",
                tag: "Product",
              },
              {
                title: "Lead Qualification",
                fields: "5 fields · Email, Company size, Role",
                tag: "Growth",
              },
              {
                title: "Event Registration",
                fields: "6 fields · Date, Dietary, Attendance",
                tag: "Events",
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="group rounded-xl border border-border/60 bg-card/40 p-3.5 hover:border-primary/50 hover:bg-card/80 transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="rounded bg-muted/60 px-1.5 py-0.5 text-[9px] font-mono uppercase text-muted-foreground">
                      {t.tag}
                    </span>
                    <ArrowUpRight className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {t.fields}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Click to instantiate</span>
                  <span className="text-primary font-medium">Use preset</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}