"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  BarChart2,
  ClipboardList,
  Eye,
  FileText,
  Pencil,
  Search,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <div className="rounded-2xl border border-border/70 bg-[#f2ede4] dark:border-border/50 dark:bg-[#13151b] overflow-hidden shadow-xs">
      {/* Subheader Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border/60 bg-[#eae3d8] dark:border-border/40 dark:bg-[#161922] px-5 py-3">
        {/* Clickable Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "all" | "published" | "draft")}
          className="w-auto"
        >
          <TabsList className="h-9 rounded-lg bg-card/70 dark:bg-[#1a1d26] border border-border/70 p-1">
            <TabsTrigger
              value="all"
              className="rounded-md text-xs px-3 py-1 font-medium transition-all data-active:bg-card data-active:text-foreground data-active:shadow-2xs data-active:font-semibold"
            >
              All ({allCount})
            </TabsTrigger>
            <TabsTrigger
              value="published"
              className="rounded-md text-xs px-3 py-1 font-medium transition-all data-active:bg-card data-active:text-foreground data-active:shadow-2xs data-active:font-semibold"
            >
              Published ({publishedCount})
            </TabsTrigger>
            <TabsTrigger
              value="draft"
              className="rounded-md text-xs px-3 py-1 font-medium transition-all data-active:bg-card data-active:text-foreground data-active:shadow-2xs data-active:font-semibold"
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
            className="w-full h-9 rounded-lg border border-border/80 bg-background dark:bg-[#1a1d26] pl-9 pr-8 text-xs text-foreground placeholder:text-muted-foreground shadow-2xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
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
        /* Empty State when no forms exist in the account */
        <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
          <div className="size-12 rounded-2xl bg-card text-primary border border-border/60 shadow-xs flex items-center justify-center mb-4">
            <FileText className="size-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            No forms created yet
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1.5 leading-relaxed">
            Create your first form using our tactile drag-and-drop workspace, preview in real time, and share seamlessly.
          </p>
          <div className="mt-5">
            <CreateForm />
          </div>
        </div>
      ) : filteredForms.length === 0 ? (
        /* Empty State when filtering yields 0 results */
        <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
          <div className="size-10 rounded-xl bg-card text-muted-foreground border border-border/60 shadow-2xs flex items-center justify-center mb-3">
            <Search className="size-4" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            No forms matching criteria
          </h3>
          <p className="text-xs text-muted-foreground max-w-xs mt-1">
            {searchQuery
              ? `No forms found matching "${searchQuery}".`
              : `No forms currently in the ${activeTab} category.`}
          </p>
          <button
            onClick={() => {
              setActiveTab("all");
              setSearchQuery("");
            }}
            className="mt-4 text-xs font-mono text-primary underline underline-offset-4 hover:opacity-80"
          >
            Reset filters
          </button>
        </div>
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
                className="rounded-xl border border-border/80 bg-card dark:bg-[#1c202a] dark:border-white/[0.08] dark:hover:border-primary/40 dark:hover:bg-[#1f2430] p-5 shadow-xs hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate text-base font-semibold text-foreground">
                      {form.name}
                    </h3>
                    {form.published ? (
                      <Badge
                        variant="secondary"
                        className="border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] rounded-full font-mono uppercase tracking-wider font-semibold"
                      >
                        Published
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-border/60 bg-secondary/50 text-muted-foreground text-[10px] rounded-full font-mono uppercase tracking-wider font-medium"
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
                  {/* Mini-metrics inside cards with reduced rounding (rounded-lg) */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-lg bg-[#f7f4ed] border border-border/60 dark:bg-[#151720] dark:border-white/[0.06] p-2">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px] font-mono uppercase">
                        <Eye className="size-3" />
                        <span>Visits</span>
                      </div>
                      <span className="mt-0.5 block font-semibold text-foreground text-xs">
                        {form.visits.toLocaleString()}
                      </span>
                    </div>

                    <div className="rounded-lg bg-[#f7f4ed] border border-border/60 dark:bg-[#151720] dark:border-white/[0.06] p-2">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px] font-mono uppercase">
                        <BarChart2 className="size-3" />
                        <span>Replies</span>
                      </div>
                      <span className="mt-0.5 block font-semibold text-foreground text-xs">
                        {form.submissions.toLocaleString()}
                      </span>
                    </div>

                    <div className="rounded-lg bg-[#f7f4ed] border border-border/60 dark:bg-[#151720] dark:border-white/[0.06] p-2">
                      <div className="text-muted-foreground text-[10px] font-mono uppercase">Rate</div>
                      <span className="mt-0.5 block font-semibold text-foreground text-xs">
                        {completionRate}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex w-full gap-2 pt-3 border-t border-border/40 dark:border-white/[0.06]">
                    <Link
                      href={`/forms/${form.id}`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className: "flex-1 rounded-lg text-xs font-medium",
                      })}
                    >
                      <ClipboardList className="size-3.5" />
                      <span>Responses</span>
                    </Link>

                    <Link
                      href={`/builder/${form.id}`}
                      className={buttonVariants({
                        size: "sm",
                        className: "flex-1 rounded-lg text-xs font-medium",
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

