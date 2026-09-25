"use client";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";

export default function BuilderError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[calc(100vh-57px)] items-center justify-center px-6">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Builder could not load</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Something went wrong while opening this form.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Link href="/console" className={buttonVariants({ variant: "outline" })}>
            Back to console
          </Link>
        </div>
      </div>
    </main>
  );
}
