"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HeroInteractiveCanvas } from "@/components/hero-interactive-canvas";

export function HeroSection() {
  const { isSignedIn } = useUser();

  return (
    <section className="landing-reveal relative mx-auto max-w-7xl px-5 pt-12 pb-10 sm:px-6 lg:px-10 lg:pt-20 lg:pb-16 overflow-hidden">
      {/* Subtle Ambient Warm Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 -z-10 size-[420px] rounded-full bg-gradient-to-br from-primary/[0.08] via-orange-400/[0.03] to-transparent blur-[120px]"
      />

      <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="landing-hero-item lg:col-span-6">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-3 py-1 font-mono text-[11px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="tracking-wider uppercase">Form Composition Platform</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl leading-[0.98] text-foreground uppercase">
            Build forms people <br />
            <span className="text-muted-foreground">actually finish.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground font-normal sm:text-lg sm:leading-8">
            A tactile workspace engineered for composing clear, thoughtful forms.
            Arrange questions on an open canvas, preview every detail, and share without friction.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={isSignedIn ? "/console" : "/sign-in"}
              className={buttonVariants({ size: "lg" })}
            >
              <span>Open studio</span>
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#workbench"
              className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-card/60 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              <SlidersHorizontal className="size-4" />
              <span>Explore workbench</span>
            </a>
          </div>
        </div>

        {/* Interactive animated drag-and-drop showcase */}
        <div className="landing-hero-item lg:col-span-6 relative">
          <HeroInteractiveCanvas />
        </div>
      </div>
    </section>
  );
}

