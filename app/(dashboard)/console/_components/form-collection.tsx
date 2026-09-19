import Link from "next/link";

import { formatDistanceToNow } from "date-fns";
import {
  BarChart2,
  ClipboardList,
  Eye,
  FileText,
  Pencil,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { getForms } from "@/actions/form";
import CreateForm from "./createForm";

interface FormCollectionProps {
  userId: string;
}

export async function FormCollection({ userId }: FormCollectionProps) {
  const forms = await getForms(userId);

  const allCount = forms.length;
  const publishedCount = forms.filter((form) => form.published).length;
  const draftsCount = allCount - publishedCount;

  return (
    <div className="rounded-md border border-border/60 bg-card overflow-hidden">
      {/* Subheader Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border/50 bg-muted/20 px-4 py-2.5">
        <div className="flex items-center gap-1 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-background text-foreground font-medium border border-border/60 shadow-xs">
            All forms ({allCount})
          </span>
          <span className="px-2.5 py-1 rounded-md text-muted-foreground">
            Published ({publishedCount})
          </span>
          <span className="px-2.5 py-1 rounded-md text-muted-foreground">
            Drafts ({draftsCount})
          </span>
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by name..."
            className="w-full h-7 rounded-md border border-border/60 bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {forms.length === 0 ? (
        /* Empty State */
        <div className="py-14 px-4 text-left">
          <div className="size-10 rounded-md bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-3">
            <FileText className="size-5" />
          </div>
          <h2 className="text-sm font-medium text-foreground">
            No forms created yet
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            Create your first form using the visual drag-and-drop builder, or jumpstart with one of the quick presets below.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <CreateForm />
          </div>
        </div>
      ) : (
        /* Form Cards Grid */
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form) => {
            const completionRate =
              form.visits > 0
                ? `${((form.submissions / form.visits) * 100).toFixed(0)}%`
                : "0%";

            return (
              <Card
                key={form.id}
                size="sm"
                className="rounded-md border border-border/60 bg-card/60 hover:border-primary/50 hover:bg-card/90 transition-all shadow-xs"
              >
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {form.name}
                    </CardTitle>
                    {form.published ? (
                      <Badge
                        variant="secondary"
                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]"
                      >
                        Published
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-border text-muted-foreground text-[10px]"
                      >
                        Draft
                      </Badge>
                    )}
                  </div>

                  <CardDescription className="line-clamp-2 min-h-8 text-xs">
                    {form.description || "No description provided."}
                  </CardDescription>

                  <div className="mt-3 text-[11px] text-muted-foreground/70 font-mono">
                    Created {formatDistanceToNow(new Date(form.createdAt), { addSuffix: true })}
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-3">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-md bg-muted/40 p-1.5">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px]">
                        <Eye className="size-3" />
                        <span>Visits</span>
                      </div>
                      <span className="font-semibold text-foreground text-xs">
                        {form.visits.toLocaleString()}
                      </span>
                    </div>

                    <div className="rounded-md bg-muted/40 p-1.5">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px]">
                        <BarChart2 className="size-3" />
                        <span>Replies</span>
                      </div>
                      <span className="font-semibold text-foreground text-xs">
                        {form.submissions.toLocaleString()}
                      </span>
                    </div>

                    <div className="rounded-md bg-muted/40 p-1.5">
                      <div className="text-muted-foreground text-[10px]">Rate</div>
                      <span className="font-semibold text-foreground text-xs">
                        {completionRate}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-border/40 p-4 pt-3">
                  <div className="flex w-full gap-2">
                    <Link
                      href={`/forms/${form.id}`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className: "flex-1",
                      })}
                    >
                      <ClipboardList className="size-3.5" />
                      <span>Responses</span>
                    </Link>

                    <Link
                      href={`/builder/${form.id}`}
                      className={buttonVariants({
                        size: "sm",
                        className: "flex-1",
                      })}
                    >
                      <Pencil className="size-3.5" />
                      <span>Edit form</span>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function FormCollectionSkeleton() {
  return (
    <div className="rounded-md border border-border/60 bg-card overflow-hidden">
      <div className="border-b border-border/50 bg-muted/20 px-4 py-2.5 flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-md border border-border/60 bg-card/60 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-14" />
            </div>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-3 w-24" />
            <div className="grid grid-cols-3 gap-2 pt-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
