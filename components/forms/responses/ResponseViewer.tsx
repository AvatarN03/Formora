"use client";

import { useMemo, useState } from "react";
import { Eye, FileText } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

type ResponseColumn = {
  id: string;
  label: string;
};

type ResponseRecord = {
  id: number;
  content: string;
  createdAt: string;
  locationGroup: string;
};

const PAGE_SIZE = 10;

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
  const [page, setPage] = useState(1);
  const responses = useMemo(
    () => submissions.map((submission) => ({ ...submission, values: parseResponse(submission.content) })),
    [submissions],
  );
  const pageCount = Math.max(1, Math.ceil(responses.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageResponses = responses.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <section className="mt-10">
      <div className="flex flex-col gap-1 border-b border-border/50 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">Response inbox</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">Individual responses</h2>
        </div>
        <p className="text-xs text-muted-foreground">Select a response to inspect every answer.</p>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-card/70 shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16">#</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Answered</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageResponses.map((response, index) => {
              const answered = columns.filter((column) => {
                const value = response.values[column.id];
                return value !== undefined && value !== null && value !== "" && !(Array.isArray(value) && value.length === 0);
              }).length;
              const responseNumber = responses.length - pageStart - index;

              return (
                <Sheet key={response.id}>
                  <TableRow>
                    <TableCell className="font-mono text-xs text-primary">
                      {String(responseNumber).padStart(2, "0")}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(response.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="max-w-48 truncate text-xs text-muted-foreground">
                      {response.locationGroup}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {answered} of {columns.length}
                    </TableCell>
                    <TableCell className="text-right">
                      <SheetTrigger className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted">
                        <Eye className="size-3.5" />
                        <span className="hidden sm:inline">View response</span>
                      </SheetTrigger>
                    </TableCell>
                  </TableRow>

                  <SheetContent side="right" className="w-full sm:max-w-xl">
                    <SheetHeader className="border-b border-border/60 px-5 py-5 sm:px-6">
                      <SheetTitle className="flex items-center gap-2">
                        <FileText className="size-4 text-primary" />
                        Response {responseNumber}
                      </SheetTitle>
                      <SheetDescription>
                        Submitted {new Date(response.createdAt).toLocaleString()}
                      </SheetDescription>
                    </SheetHeader>

                    <ScrollArea className="min-h-0 flex-1">
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
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 ? (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  setPage((value) => Math.max(1, value - 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  isActive={pageNumber === currentPage}
                  onClick={(event) => {
                    event.preventDefault();
                    setPage(pageNumber);
                  }}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={currentPage === pageCount}
                className={currentPage === pageCount ? "pointer-events-none opacity-50" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  setPage((value) => Math.min(pageCount, value + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </section>
  );
}
