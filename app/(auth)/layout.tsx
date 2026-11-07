"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ThemeLogo } from "@/components/theme-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeroInteractiveCanvas } from "@/components/hero-interactive-canvas";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSignIn = !pathname.includes("/sign-up");

  return (
    <main className="auth-scene relative isolate flex min-h-screen items-center justify-center overflow-hidden px-5 py-24 sm:px-6 lg:px-10">
      {/* Subtle Ambient Warm Auras */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 -z-10 size-[450px] rounded-full bg-gradient-to-br from-primary/[0.07] via-orange-400/[0.03] to-transparent blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 -z-10 size-[450px] rounded-full bg-gradient-to-tl from-primary/[0.05] via-orange-400/[0.02] to-transparent blur-[130px]"
      />

      {/* Modern Top Header - matching landing navbar width */}
      <header className="auth-header absolute inset-x-0 top-0 z-20 border-b">
        <div className="mx-auto flex w-full max-w-[96rem] items-center justify-between px-5 py-3.5 sm:px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="relative flex size-8 items-center justify-center">
              <ThemeLogo />
            </span>
            <span className="font-mono text-base font-semibold uppercase tracking-[0.14em] text-foreground">
              FORMORA
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to home</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Layout - full 7xl width */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-12 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Column: Context & Interactive Drag & Drop Animation */}
        <div className="hidden max-w-md lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1 font-mono text-[11px] text-foreground/80 shadow-2xs">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="tracking-wider uppercase font-medium">
              {isSignIn ? "Studio Access" : "Create Account"}
            </span>
          </div>

          <h1 className="text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-6xl leading-[0.98] text-foreground">
            {isSignIn ? "Return to the studio." : "Build forms that feel effortless."}
          </h1>

          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground font-normal sm:text-base">
            {isSignIn
              ? "Sign in to access your forms, review submissions, and manage live respondent pipelines."
              : "A tactile workspace engineered for composing clear, thoughtful forms without clutter."}
          </p>

          {/* Interactive Drag & Drop Preview (Refined 2-Card Swiss Canvas) */}
          <div className="mt-10 rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
              <span>Visual composition</span>
              <span className="text-primary font-semibold">Drag to reorder</span>
            </div>

            <HeroInteractiveCanvas />
          </div>
        </div>

        {/* Right Column: Clerk Form Card Shell */}
        <div className="auth-card-wrap w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs">
          {children}
        </div>
      </div>
    </main>
  );
}

