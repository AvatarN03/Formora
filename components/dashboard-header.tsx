import Link from "next/link";

import { UserButton } from "@clerk/nextjs";
import { Layers } from "lucide-react";

interface DashboardHeaderProps {
  name: string;
  email?: string;
}

export function DashboardHeader({ name, email }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <img
              src="https://cdn-icons-png.flaticon.com/512/11213/11213073.png"
              alt="Formora logo"
              className="size-7 rounded-md object-cover"
            />
            <span className="text-base font-semibold tracking-tight text-foreground">formora</span>
          </Link>

          <span className="text-border/80">/</span>

          <div className="flex items-center gap-1.5 rounded border border-border/60 bg-muted/30 px-2 py-0.5 text-sm text-muted-foreground">
            <Layers className="size-3 text-primary" />
            <span className="max-w-30 truncate font-medium text-foreground sm:max-w-none">
              {name}&apos;s workspace
            </span>
            <span className="rounded bg-primary/15 px-1 py-0.2 text-[9px] font-mono uppercase text-primary">
              Free
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium leading-tight text-foreground">{name}</p>
            <p className="mt-0.5 break-words text-xs text-muted-foreground">{email}</p>
          </div>
          <UserButton appearance={{ elements: { avatarBox: "size-8 border border-border/80" } }} />
        </div>
      </div>
    </header>
  );
}