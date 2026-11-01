import Link from "next/link";

import { UserButton } from "@clerk/nextjs";
import { ArrowUpRight, Layers } from "lucide-react";

import { ThemeLogo } from "@/components/theme-logo";
import { ThemeToggle } from "@/components/theme-toggle";

interface DashboardHeaderProps {
  name: string;
  email?: string;
}

export function DashboardHeader({ name, email }: DashboardHeaderProps) {
  return (
    <header className="console-header sticky top-0 z-40 border-b">
      <div className="mx-auto flex min-h-16 max-w-[96rem] items-center justify-between px-5 py-3 sm:px-6 lg:px-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <ThemeLogo />
            <span className="font-mono text-sm font-semibold tracking-[0.16em]">FORMORA</span>
          </Link>

          <span className="text-muted-foreground/50">/</span>

          <div className="hidden items-center gap-2 text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground sm:flex">
            <Layers className="size-3 text-primary" />
            <span>Workspace</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground">{name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/" className="hidden items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary md:flex">
            View site
            <ArrowUpRight className="size-3" />
          </Link>
          <ThemeToggle />
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium leading-tight text-foreground">{name}</p>
            <p className="mt-0.5 break-words text-[10px] text-muted-foreground">{email}</p>
          </div>
          <UserButton appearance={{ elements: { avatarBox: "size-8 border border-border/80" } }} />
        </div>
      </div>
    </header>
  );
}