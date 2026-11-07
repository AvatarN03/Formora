"use client";

import { useMemo } from "react";
import { Eye, FileText } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type ResponseColumn = {
  id: string;
  label: string;
};

type ResponseRecord = {
  id: number;
  content: string;
  createdAt: string;
  networkGroup: string;
};

function parseResponse(content: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(content);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function formatValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === null || value === undefined || value === "") return "No answer";
  return String(value);
}

export default function ResponseViewer({
  columns,
  submissions,
}: {
  columns: ResponseColumn[];
  submissions: ResponseRecord[];
}) {
  const responses = useMemo(
    () => submissions.map((submission) => ({ ...submission, values: parseResponse(submission.content) })),
    [submissions],
  );

  return (
    <section className="mt-10">
      <div className="flex flex-col gap-1 border-b border-border/50 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">Response inbox</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">Individual responses</h2>
        </div>
        <p className="text-xs text-muted-foreground">Select a response to inspect every answer.</p>
      </div>

      <div className="mt-4 divide-y divide-border/50 overflow-hidden rounded-2xl border border-border/60 bg-card/70 shadow-xs">
        {responses.map((response, index) => {
          const answered = columns.filter((column) => {
            const value = response.values[column.id];
            return value !== undefined && value !== null && value !== "" && !(Array.isArray(value) && value.length === 0);
          }).length;

          return (
            <Sheet key={response.id}>
              <div className="flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-muted/30 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-mono text-xs font-semibold text-primary">
                    {String(responses.length - index).padStart(2, "0")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">Response {responses.length - index}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(response.createdAt).toLocaleString()} · {answered} of {columns.length} answered · {response.networkGroup}
                    </p>
                  </div>
                </div>

                <SheetTrigger className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted">
                  <Eye className="size-3.5" />
                  <span className="hidden sm:inline">View response</span>
                </SheetTrigger>
              </div>

              <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
                <SheetHeader className="border-b border-border/60 px-5 py-5 sm:px-6">
                  <SheetTitle className="flex items-center gap-2">
                    <FileText className="size-4 text-primary" />
                    Response {responses.length - index}
                  </SheetTitle>
                  <SheetDescription>
                    Submitted {new Date(response.createdAt).toLocaleString()}
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-3 px-5 py-5 sm:px-6">
                  {columns.map((column, fieldIndex) => (
                    <div key={column.id} className="rounded-xl border border-border/60 bg-card/60 p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        {String(fieldIndex + 1).padStart(2, "0")} · {column.label}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
                        {formatValue(response.values[column.id])}
                      </p>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          );
        })}
      </div>
    </section>
  );
}
