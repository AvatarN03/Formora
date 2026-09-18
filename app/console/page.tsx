import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Plus,
  ArrowUpRight,
  FileText,
  BarChart2,
  Clock,
  Search,
  Sparkles,
  Layers,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

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
              <span className="font-medium text-foreground max-w-[120px] sm:max-w-none truncate">
                {firstName}&apos;s workspace
              </span>
              <span className="rounded bg-primary/15 px-1 py-0.2 text-[9px] font-mono text-primary uppercase">
                Free
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
            >
              <ArrowLeft className="size-3" />
              <span>Landing</span>
            </Link>

            <div className="h-4 w-px bg-border/60 hidden sm:block" />

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-7 border border-border/80",
                },
              }}
            />
          </div>
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

        {/* -------------------- COMPACT STATS (SMALL ONES) -------------------- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Total forms",
              value: "0",
              sub: "Drafts & published",
              icon: FileText,
            },
            {
              label: "Responses",
              value: "0",
              sub: "0 received this week",
              icon: BarChart2,
            },
            {
              label: "Avg. completion",
              value: "—",
              sub: "Ready for traffic",
              icon: CheckCircle2,
            },
            {
              label: "Active endpoints",
              value: "0",
              sub: "Webhook handlers",
              icon: Clock,
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border/60 bg-card/60 p-3.5 hover:border-border transition-colors"
            >
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider">
                  {stat.label}
                </span>
                <stat.icon className="size-3.5 text-muted-foreground/60" />
              </div>
              <div className="text-xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </div>
              <p className="text-[11px] text-muted-foreground/80 mt-0.5">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* -------------------- FORMS MANAGEMENT TABLE / LIST -------------------- */}
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
          {/* Subheader Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border/50 bg-muted/20 px-4 py-2.5">
            <div className="flex items-center gap-1 text-xs">
              <button className="px-2.5 py-1 rounded-md bg-background text-foreground font-medium border border-border/60 shadow-xs">
                All forms (0)
              </button>
              <button className="px-2.5 py-1 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                Published
              </button>
              <button className="px-2.5 py-1 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                Drafts
              </button>
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by name..."
                className="w-full h-7 rounded-md border border-border/60 bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Compact Empty State */}
          <div className="py-12 px-4 text-center">
            <div className="size-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto mb-3">
              <FileText className="size-5" />
            </div>
            <h2 className="text-sm font-medium text-foreground">
              No forms created yet
            </h2>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
              Create your first form using the visual drag-and-drop builder, or jumpstart with one of the quick presets below.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                className={buttonVariants({ size: "sm" })}
              >
                <Plus className="size-3.5" />
                <span>Create first form</span>
              </button>
            </div>
          </div>
        </div>

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