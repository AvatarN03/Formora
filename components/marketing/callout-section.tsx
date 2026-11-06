"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function CalloutSection() {
  const { isSignedIn } = useUser();

  return (
    <section className="landing-reveal relative border-t border-border/40 py-16 overflow-hidden">
      {/* Soft Warm Bottom Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-primary/[0.03] to-transparent blur-2xl"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground">
            Ready to assemble your first form?
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Launch your studio workspace and start building immediately.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={isSignedIn ? "/console" : "/sign-in"}
            className={buttonVariants({ size: "default" })}
          >
            <span>Launch workspace</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

