"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  BarChart2,
  ClipboardList,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Pencil,
  Search,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import CreateForm from "./createForm";

export interface FormItem {
  id: number;
  userId: string;
  name: string;
  description: string;
  content: string;
  published: boolean;
  visits: number;
  submissions: number;
  shareURL: string;
  createdAt: Date;
}

interface FormsViewProps {
  forms: FormItem[];
}

function PublishedFormActions({ shareURL }: { shareURL: string }) {
  const [copied, setCopied] = useState(false);
  const publicPath = `/f/${shareURL}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${publicPath}`);
      setCopied(true);
      toast.add({
        title: "Link copied",
        description: "The public form link is ready to share.",
        type: "success",
      });
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.add({
        title: "Unable to copy link",
        description: "Open the form and copy the URL manually.",
        type: "error",
      });
    }
  };

  return (
    <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-2">
      <Link
        href={publicPath}
        target="_blank"
        rel="noreferrer"
        className="min-w-0 flex-1 truncate text-[11px] font-medium text-emerald-700 hover:underline dark:text-emerald-400"
        title="Open public form"
      >
        /f/{shareURL}
      </Link>
      <button
        type="button"
        onClick={() => void copyLink()}
        className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-emerald-700 transition-colors hover:bg-emerald-500/10 dark:text-emerald-400"
        aria-label={copied ? "Link copied" : "Copy public form link"}
        title={copied ? "Copied" : "Copy link"}
      >
        {copied ? <span className="text-[10px] font-bold">✓</span> : <Copy className="size-3.5" />}
      </button>
      <Link
        href={publicPath}
        target="_blank"
        rel="noreferrer"
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-emerald-700 transition-colors hover:bg-emerald-500/10 dark:text-emerald-400"
        aria-label="Visit public form"
        title="Visit form"
      >
        <ExternalLink className="size-3.5" />
      </Link>
    </div>
  );
}

export function FormsView({ forms }: FormsViewProps) {
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allCount = forms.length;
  const publishedCount = forms.filter((f) => f.published).length;
  const draftsCount = allCount - publishedCount;

  const filteredForms = useMemo(() => {
    return forms.filter((form) => {
      // Tab filter
      if (activeTab === "published" && !form.published) return false;
      if (activeTab === "draft" && form.published) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = form.name.toLowerCase().includes(query);
        const matchesDesc = form.description
          ? form.description.toLowerCase().includes(query)
          : false;
        if (!matchesName && !matchesDesc) return false;
      }

      return true;
    });
  }, [forms, activeTab, searchQuery]);

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 overflow-hidden shadow-xs">
      {/* Subheader Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border/50 bg-muted/40 px-5 py-3">
        {/* Clickable Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "all" | "published" | "draft")}
          className="w-auto"
        >
          <TabsList className="h-9 rounded-lg bg-muted/60 border border-border/60 p-1">
            <TabsTrigger
              value="all"
              className="rounded-md text-xs px-3 py-1 font-medium text-muted-foreground hover:text-foreground transition-all data-active:bg-card data-active:text-foreground data-active:shadow-2xs data-active:font-semibold"
            >
              All ({allCount})
            </TabsTrigger>
            <TabsTrigger
              value="published"
              className="rounded-md text-xs px-3 py-1 font-medium text-muted-foreground hover:text-foreground transition-all data-active:bg-card data-active:text-foreground data-active:shadow-2xs data-active:font-semibold"
            >
              Published ({publishedCount})
            </TabsTrigger>
            <TabsTrigger
              value="draft"
              className="rounded-md text-xs px-3 py-1 font-medium text-muted-foreground hover:text-foreground transition-all data-active:bg-card data-active:text-foreground data-active:shadow-2xs data-active:font-semibold"
            >
              Drafts ({draftsCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Visible, Crisper Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search forms by name..."
            className="w-full h-9 rounded-lg border border-border/70 bg-card pl-9 pr-8 text-xs text-foreground placeholder:text-muted-foreground shadow-2xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {forms.length === 0 ? (
        <Empty className="min-h-72 rounded-none border-0 px-6 py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-12 rounded-2xl text-primary">
              <FileText className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No forms created yet</EmptyTitle>
            <EmptyDescription>
              Create your first form using our tactile drag-and-drop workspace, preview in real time, and share seamlessly.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <CreateForm />
          </EmptyContent>
        </Empty>
      ) : filteredForms.length === 0 ? (
        <Empty className="min-h-72 rounded-none border-0 px-6 py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-10 rounded-xl text-muted-foreground">
              <Search className="size-4" />
            </EmptyMedia>
            <EmptyTitle className="text-sm">No forms matching criteria</EmptyTitle>
            <EmptyDescription className="max-w-xs text-xs">
              {searchQuery
                ? `No forms found matching "${searchQuery}".`
                : `No forms currently in the ${activeTab} category.`}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <button
              onClick={() => {
                setActiveTab("all");
                setSearchQuery("");
              }}
              className="text-xs font-mono text-primary underline underline-offset-4 hover:opacity-80"
            >
              Reset filters
            </button>
          </EmptyContent>
        </Empty>
      ) : (
        /* Form Cards Grid - with reduced rounding corners (rounded-xl) */
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredForms.map((form) => {
            const completionRate =
              form.visits > 0
                ? `${((form.submissions / form.visits) * 100).toFixed(0)}%`
                : "0%";

            return (
              <div
                key={form.id}
                className="rounded-xl border border-border/70 bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate text-base font-semibold text-foreground">
                      {form.name}
                    </h3>
                    {form.published ? (
                      <Badge
                        variant="secondary"
                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] rounded-full font-mono uppercase tracking-wider font-semibold"
                      >
                        Published
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-border/70 bg-secondary/60 text-muted-foreground text-[10px] rounded-full font-mono uppercase tracking-wider font-medium"
                      >
                        Draft
                      </Badge>
                    )}
                  </div>

                  <p className="mt-1.5 line-clamp-2 min-h-9 text-xs text-muted-foreground leading-relaxed">
                    {form.description || "No description provided."}
                  </p>

                  <div className="mt-3 text-[11px] text-muted-foreground font-mono">
                    Created {formatDistanceToNow(new Date(form.createdAt), { addSuffix: true })}
                  </div>
                </div>

                <div className="mt-4">
                  {form.published ? (
                    <PublishedFormActions shareURL={form.shareURL} />
                  ) : null}

                  {/* Mini-metrics inside cards with reduced rounding (rounded-lg) */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-lg bg-secondary/50 border border-border/50 p-2">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px] font-mono uppercase">
                        <Eye className="size-3" />
                        <span>Visits</span>
                      </div>
                      <span className="mt-0.5 block font-semibold text-foreground text-xs">
                        {form.visits.toLocaleString()}
                      </span>
                    </div>

                    <div className="rounded-lg bg-secondary/50 border border-border/50 p-2">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px] font-mono uppercase">
                        <BarChart2 className="size-3" />
                        <span>Replies</span>
                      </div>
                      <span className="mt-0.5 block font-semibold text-foreground text-xs">
                        {form.submissions.toLocaleString()}
                      </span>
                    </div>

                    <div className="rounded-lg bg-secondary/50 border border-border/50 p-2">
                      <div className="text-muted-foreground text-[10px] font-mono uppercase">Rate</div>
                      <span className="mt-0.5 block font-semibold text-foreground text-xs">
                        {completionRate}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex w-full gap-2 pt-3 border-t border-border/50">
                    <Link
                      href={`/forms/${form.id}`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className:
                          "flex-1 rounded-lg text-xs font-medium border border-border/70 bg-card text-foreground shadow-2xs hover:bg-secondary/80 hover:text-foreground transition-colors",
                      })}
                    >
                      <ClipboardList className="size-3.5" />
                      <span>Responses</span>
                    </Link>

                    <Link
                      href={`/builder/${form.id}`}
                      className={buttonVariants({
                        size: "sm",
                        className: "flex-1 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity",
                      })}
                    >
                      <Pencil className="size-3.5" />
                      <span>Edit form</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

