import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

import { ThemeLogo } from "@/components/theme-logo";
import { ThemeToggle } from "@/components/theme-toggle";

interface DashboardHeaderProps {
  name: string;
  email?: string;
}

export function DashboardHeader({ name, email }: DashboardHeaderProps) {
  return (
    <header className="console-header sticky top-0 z-40 border-b border-border/40 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-[96rem] items-center justify-between px-5 py-3 sm:px-6 lg:px-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="relative flex size-8 items-center justify-center">
              <ThemeLogo />
            </span>
            <span className="font-mono text-base font-semibold uppercase tracking-[0.14em] text-foreground">
              FORMORA
            </span>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-border/50 bg-card px-3 py-1 font-mono text-[11px] text-muted-foreground sm:flex shadow-2xs">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="tracking-wider uppercase">Workspace</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold leading-tight text-foreground">{name}</p>
            {email && (
              <p className="mt-0.5 max-w-[200px] truncate text-[11px] text-muted-foreground">{email}</p>
            )}
          </div>

          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-8 rounded-full border border-border/60",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
