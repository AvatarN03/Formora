import { getForms } from "@/actions/form";
import { FormsView } from "./forms-view";
import { Skeleton } from "@/components/ui/skeleton";

interface FormCollectionProps {
  userId: string;
}

export async function FormCollection({ userId }: FormCollectionProps) {
  const forms = await getForms(userId);

  return <FormsView forms={forms} />;
}

export function FormCollectionSkeleton() {
  return (
    <div className="rounded-2xl border border-border/70 bg-[#f2ede4] dark:border-border/50 dark:bg-[#13151b] overflow-hidden shadow-xs">
      <div className="border-b border-border/60 bg-[#eae3d8] dark:border-border/40 dark:bg-[#161922] px-5 py-3.5 flex items-center justify-between gap-3">
        <Skeleton className="h-9 w-60 rounded-lg" />
        <Skeleton className="h-9 w-64 rounded-lg" />
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-border/80 bg-card dark:bg-[#1c202a] dark:border-white/[0.08] p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <Skeleton className="h-8 w-full rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
            <div className="grid grid-cols-3 gap-2 pt-2">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
