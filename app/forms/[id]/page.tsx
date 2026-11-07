import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Download, Inbox, Pencil } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import { getFormResponses } from "@/actions/form";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ResponseColumn = {
  id: string;
  label: string;
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
      return [{
        id: item.id,
        label: typeof label === "string" && label.trim() ? label : "Untitled field",
      }];
    });
  } catch {
    return [];
  }
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
  const form = await getFormResponses(id).catch(() => null);
  if (!form) notFound();

  const columns = getResponseColumns(form.content);

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/console"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back to console
            </Link>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <Inbox className="size-5" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{form.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">Review responses collected by this form.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/api/forms/${form.id}/responses`}
              className={buttonVariants({ variant: "outline", size: "sm", className: "rounded-lg" })}
            >
              <Download className="size-3.5" />
              Export CSV
            </a>
            <Link
              href={`/builder/${form.id}`}
              className={buttonVariants({ variant: "outline", size: "sm", className: "rounded-lg" })}
            >
              <Pencil className="size-3.5" />
              Edit form
            </Link>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full">
            {form.formSubmissions.length.toLocaleString()} responses
          </Badge>
          {form.submissions !== form.formSubmissions.length ? (
            <span className="text-xs text-muted-foreground">Showing the latest stored responses</span>
          ) : null}
        </div>

        {form.formSubmissions.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-border/60 bg-card/60 px-6 py-20 text-center shadow-xs">
            <Inbox className="mx-auto size-8 text-muted-foreground" />
            <h2 className="mt-4 text-base font-semibold">No responses yet</h2>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
              Responses will appear here after someone submits the published form.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-xs">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-44">Submitted</TableHead>
                  {columns.map((column) => (
                    <TableHead key={column.id}>{column.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {form.formSubmissions.map((submission) => {
                  const response = parseResponse(submission.content);
                  return (
                    <TableRow key={submission.id}>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(submission.createdAt).toLocaleString()}
                      </TableCell>
                      {columns.map((column) => (
                        <TableCell key={column.id} className="max-w-xs truncate text-sm text-foreground">
                          {formatResponseValue(response[column.id])}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </main>
  );
}
