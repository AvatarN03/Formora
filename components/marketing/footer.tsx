import Link from "next/link";
import { ThemeLogo } from "@/components/theme-logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/40 py-8 text-xs text-muted-foreground">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="relative flex size-6 items-center justify-center">
            <ThemeLogo />
          </span>
          <span className="font-mono text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
            FORMORA
          </span>
          <span className="text-border">·</span>
          <span>Effortless drag-and-drop form composition for modern teams</span>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <Link href="/console" className="hover:text-foreground transition-colors">
            Console
          </Link>
          <Link href="/sign-in" className="hover:text-foreground transition-colors">
            Sign In
          </Link>
          <a
            href="https://github.com/AvatarN03/Formora"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

