"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { ThemeLogo } from "@/components/theme-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";

export function MarketingHeader() {
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[96rem] items-center justify-between px-5 py-3.5 sm:px-6 lg:px-10">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 text-lg font-semibold sm:text-xl">
            <span className="relative flex size-8 items-center justify-center">
              <ThemeLogo />
            </span>
            <span className="font-mono text-base font-semibold uppercase tracking-[0.04em] leading-none text-foreground sm:text-lg">
              FORMORA
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#workbench" className="hover:text-foreground transition-colors">
              Workbench
            </a>
            <a href="#architecture" className="hover:text-foreground transition-colors">
              Principles
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href={isSignedIn ? "/console" : "/sign-in"}
            className={buttonVariants({ size: "sm" })}
          >
            <span>Start building</span>
            <ArrowRight className="size-3.5 opacity-70" />
          </Link>
        </div>
      </div>
    </header>
  );
}

