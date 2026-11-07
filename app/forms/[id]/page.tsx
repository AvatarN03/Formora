import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Download, Inbox, Pencil } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import { getFormResponses } from "@/actions/form";
import { buttonVariants } from "@/components/ui/button";
import ResponseViewer from "@/components/ResponseViewer";
import PublicFormLinkActions from "@/components/PublicFormLinkActions";

type ResponseColumn = {
  id: string;
  label: string;
  type: string;
  options: string[];
};

function getResponseColumns(content: string): ResponseColumn[] {
  try {
    const parsed: unknown = JSON.parse(content);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((element) => {
      if (!element || typeof element !== "object") return [];
      const item = element as {
        id?: unknown;
        type?: unknown;
        extraAttributes?: Record<string, unknown>;
      };

      if (
        typeof item.id !== "string" ||
        !["TextField", "NumberField", "DatePicker", "Select", "Checkbox", "Radio"].includes(
          String(item.type),
        )
      ) {
        return [];
      }

      const label = item.extraAttributes?.label;
      const rawOptions = item.extraAttributes?.options;
      return [{
        id: item.id,
        label: typeof label === "string" && label.trim() ? label : "Untitled field",
        type: String(item.type),
        options: Array.isArray(rawOptions)
          ? rawOptions.filter((option): option is string => typeof option === "string")
          : [],
      }];
    });
  } catch {
    return [];
  }
}

type ResponseInsight = ResponseColumn & {
  answered: number;
  total: number;
  distribution: Array<{ label: string; count: number }>;
  average?: number;
  range?: string;
};

function getResponseInsights(
  columns: ResponseColumn[],
  submissions: Array<{ content: string }>,
): ResponseInsight[] {
  return columns.map((column) => {
    const values = submissions
      .map((submission) => parseResponse(submission.content)[column.id])
      .filter((value) => value !== undefined && value !== null && value !== "");
    const distribution = new Map<string, number>();

    if (["Select", "Radio", "Checkbox"].includes(column.type)) {
      for (const option of column.options) distribution.set(option, 0);
    }

    for (const value of values) {
      const list = Array.isArray(value) ? value : [value];
      for (const item of list) {
        const label = formatResponseValue(item);
        distribution.set(label, (distribution.get(label) ?? 0) + 1);
      }
    }

    const sortedDistribution = [...distribution.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
      .slice(0, 5);

    const numericValues = values
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));
    const average = numericValues.length
      ? numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length
      : undefined;
    const range = numericValues.length
      ? `${Math.min(...numericValues)} – ${Math.max(...numericValues)}`
      : undefined;

    return {
      ...column,
      answered: values.length,
      total: submissions.length,
      distribution: sortedDistribution,
      average,
      range,
    };
  });
}

function formatResponseValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

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

export default async function FormResponsesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  let form;
  try {
    form = await getFormResponses(id);
  } catch (error) {
    if (error instanceof Error && error.message === "Form not found") {
      notFound();
    }
    throw error;
  }

  const columns = getResponseColumns(form.content);
  const insights = getResponseInsights(columns, form.formSubmissions);
  const locationGroups = new Map<string, string>();
  const responseRecords = form.formSubmissions.map((submission) => {
    if (submission.locationLabel && !locationGroups.has(submission.locationLabel)) {
      locationGroups.set(submission.locationLabel, submission.locationLabel);
    }

    return {
      id: submission.id,
      content: submission.content,
      createdAt: submission.createdAt.toISOString(),
      locationGroup: submission.locationLabel ?? "Location unavailable",
    };
  });

  return (
    <main data-console className="console-page relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[520px] rounded-full bg-primary/[0.06] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-40 -z-10 size-[460px] rounded-full bg-orange-400/[0.04] blur-[130px]"
      />

      <div className="mx-auto max-w-[96rem] px-5 py-4 sm:px-6 lg:px-10 lg:py-6">
        <div className="border-b border-border/60 pb-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/75">
            <Link
              href="/console"
              aria-label="Back to console"
              title="Back to console"
              className="inline-flex size-6 items-center justify-center rounded-md border border-border bg-muted/60 text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
            </Link>
            <Link href="/console" className="transition-colors hover:text-foreground">Workspace</Link>
            <span className="text-border">/</span>
            <span>Responses</span>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <Inbox className="size-4" strokeWidth={1.8} />
              </div>
              <h1 className="truncate text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{form.name}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
            {form.published ? <PublicFormLinkActions shareURL={form.shareURL} /> : null}
            <a
              href={`/api/forms/${form.id}/responses`}
              className={buttonVariants({ size: "sm", className: "rounded-lg" })}
            >
              <Download className="size-3.5" />
              CSV
            </a>
            <Link
              href={`/builder/${form.id}`}
              className={buttonVariants({ variant: "outline", size: "sm", className: "rounded-lg border-border bg-muted/50 text-foreground hover:bg-muted" })}
            >
              <Pencil className="size-3.5" />
              Edit form
            </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/50 sm:grid-cols-3">
          <div className="bg-card/80 px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Responses</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{form.formSubmissions.length.toLocaleString()}</p>
          </div>
          <div className="bg-card/80 px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Visits</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{form.visits.toLocaleString()}</p>
          </div>
          <div className="bg-card/80 px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Submission rate</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {form.visits > 0 ? `${((form.submissions / form.visits) * 100).toFixed(1)}%` : "0%"}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {locationGroups.size.toLocaleString()} location group{locationGroups.size === 1 ? "" : "s"} detected from coarse provider metadata. Raw IP addresses are never displayed.
        </p>

        {form.formSubmissions.length > 0 && columns.length > 0 ? (
          <section className="mt-10">
            <div className="flex flex-col gap-1 border-b border-border/50 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">Response overview</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">Question insights</h2>
              </div>
              <p className="text-xs text-muted-foreground">A compact view of how people answered.</p>
            </div>

            <div className="mt-4 columns-1 gap-3 md:columns-2 xl:columns-3">
              {insights.map((insight, index) => {
                const maxCount = insight.distribution[0]?.count ?? 1;
                const isChoice = ["Select", "Radio", "Checkbox"].includes(insight.type);
                const isNumber = insight.type === "NumberField";

                return (
                  <article
                    key={insight.id}
                    className="mb-3 break-inside-avoid rounded-2xl border border-border/60 bg-card/70 p-5 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                          <span className="mr-2 font-mono text-[10px] text-primary">{String(index + 1).padStart(2, "0")}</span>
                          {insight.label}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {insight.answered.toLocaleString()} of {insight.total.toLocaleString()} answered
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-muted px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                        {insight.type.replace("Field", "")}
                      </span>
                    </div>

                    {isChoice && insight.distribution.length > 0 ? (
                      <div className="mt-5 space-y-3">
                        {insight.distribution.slice(0, 5).map((item) => (
                          <div key={item.label}>
                            <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                              <span className="truncate text-muted-foreground">{item.label}</span>
                              <span className="font-mono text-[10px] text-foreground">{item.count}</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${Math.max(8, (item.count / maxCount) * 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                        {insight.distribution[0]?.count > 0 ? (
                          <p className="pt-1 text-[11px] text-muted-foreground">
                            Most selected: <span className="font-medium text-foreground">{insight.distribution[0].label}</span>
                          </p>
                        ) : (
                          <p className="pt-1 text-[11px] text-muted-foreground">No selections recorded yet.</p>
                        )}
                        {insight.distribution.length > 5 ? (
                          <p className="pt-1 text-[11px] text-muted-foreground">Showing the five most common choices.</p>
                        ) : null}
                      </div>
                    ) : isNumber && insight.average !== undefined ? (
                      <div className="mt-5 flex items-end justify-between gap-4">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Average</p>
                          <p className="mt-1 text-2xl font-semibold tracking-tight">{insight.average.toFixed(1)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Range</p>
                          <p className="mt-1 text-sm font-medium text-foreground">{insight.range}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 rounded-xl border border-dashed border-border/70 bg-muted/30 px-3 py-3 text-xs text-muted-foreground">
                        {insight.answered > 0 ? "Free-text responses collected" : "No answers yet"}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {form.formSubmissions.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-border/60 bg-card/60 px-6 py-20 text-center shadow-xs">
            <Inbox className="mx-auto size-8 text-muted-foreground" />
            <h2 className="mt-4 text-base font-semibold">No responses yet</h2>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
              Responses will appear here after someone submits the published form.
            </p>
          </div>
        ) : (
          <ResponseViewer
            columns={columns.map(({ id, label }) => ({ id, label }))}
            submissions={responseRecords}
          />
        )}
      </div>
    </main>
  );
}
