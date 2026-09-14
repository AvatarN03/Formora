"use client";

import { buttonVariants } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50 bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">f</span>
            formly
          </Link>
          <Link href={isSignedIn ? "/console" : "/sign-in"} className={buttonVariants({ size: "sm" })}>
            {isSignedIn ? "Open workspace" : "Sign in"}
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-[1fr_0.82fr] lg:px-10 lg:py-28">
        <div className="max-w-2xl">
          <p className="mb-7 text-xs font-medium uppercase tracking-[0.2em] text-primary">Form builder</p>
          <h1 className="max-w-xl text-5xl font-medium leading-[1.05] tracking-[-0.055em] sm:text-6xl lg:text-7xl">Build forms people can finish.</h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-muted-foreground">A straightforward workspace for creating clear, useful forms. Arrange the fields, set the details, and share when it is ready.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/sign-in" className={buttonVariants({ size: "lg" })}>Start a new form</Link>
            <Link href="/console" className="px-3 py-2 text-sm font-medium text-muted-foreground underline decoration-border underline-offset-8 transition-colors hover:text-foreground">View workspace</Link>
          </div>
        </div>

        <div className="border border-border/70 bg-card p-5 shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:p-7">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div><p className="text-sm font-semibold">Customer feedback</p><p className="mt-1 text-xs text-muted-foreground">Draft · 4 questions</p></div>
            <span className="text-xs text-muted-foreground">Edit</span>
          </div>
          <div className="space-y-6 py-6">
            <div><label className="text-sm font-medium">How was your experience?</label><div className="mt-2 h-11 border border-border bg-background px-3 py-3 text-sm text-muted-foreground">Choose one</div></div>
            <div><label className="text-sm font-medium">What should we improve?</label><div className="mt-2 h-24 border border-border bg-background px-3 py-3 text-sm text-muted-foreground">Write a response</div></div>
            <div><label className="text-sm font-medium">Would you recommend us?</label><div className="mt-3 flex gap-5 text-sm text-muted-foreground"><span className="flex items-center gap-2"><span className="size-4 rounded-full border border-muted-foreground/60" /> Yes</span><span className="flex items-center gap-2"><span className="size-4 rounded-full border border-muted-foreground/60" /> No</span></div></div>
          </div>
          <div className="flex items-center justify-between border-t border-border/60 pt-4"><span className="text-xs text-muted-foreground">Last edited just now</span><span className="text-sm font-medium text-primary">Preview form</span></div>
        </div>
      </section>

      <section className="border-y border-border/50">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 text-sm text-muted-foreground sm:grid-cols-3 lg:px-10">
          <div><p className="mb-2 font-medium text-foreground">Start with structure</p><p>Use the fields your audience already understands.</p></div>
          <div><p className="mb-2 font-medium text-foreground">Keep it focused</p><p>Make every question earn its place.</p></div>
          <div><p className="mb-2 font-medium text-foreground">Ship with confidence</p><p>Review the finished form before it goes live.</p></div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 text-xs text-muted-foreground lg:px-10"><span>© {new Date().getFullYear()} Formly</span><span>Form builder for focused teams</span></footer>
    </main>
  );
}
