import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <main className="flex min-h-[calc(100vh-57px)] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Spinner className="size-6 text-primary" />
        <span className="text-sm">Loading builder...</span>
      </div>
    </main>
  );
}
