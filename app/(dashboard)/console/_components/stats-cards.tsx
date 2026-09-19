import {
  BarChart2,
  Eye,
  FileText,
  TrendingDown,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import { getFormStats } from "@/actions/form";

interface StatsCardsProps {
  userId: string;
}

export async function StatsCards({ userId }: StatsCardsProps) {
  const {
    totalForms,
    totalVisits,
    totalSubmissions,
    submissionRate,
    bounceRate,
  } = await getFormStats(userId);

  const statItems = [
    {
      label: "Total forms",
      value: totalForms.toLocaleString(),
      sub: totalForms === 1 ? "1 form created" : `${totalForms} forms created`,
      icon: FileText,
    },
    {
      label: "Total visits",
      value: totalVisits.toLocaleString(),
      sub: "All-time form views",
      icon: Eye,
    },
    {
      label: "Total submissions",
      value: `${submissionRate.toFixed(1)}%`,
      sub: `${totalSubmissions.toLocaleString()} completed responses`,
      icon: BarChart2,
    },
    {
      label: "Bounce rate",
      value: `${bounceRate.toFixed(1)}%`,
      sub: "Visits without submission",
      icon: TrendingDown,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {statItems.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="rounded-md border border-border/60 bg-card/60 p-3.5 hover:border-border transition-colors shadow-xs"
          >
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider">
                {stat.label}
              </span>
              <Icon className="size-3.5 text-muted-foreground/70" />
            </div>
            <div className="text-xl font-semibold tracking-tight text-foreground">
              {stat.value}
            </div>
            <p className="text-[11px] text-muted-foreground/80 mt-0.5">
              {stat.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-md border border-border/60 bg-card/60 p-3.5 shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="size-3.5 rounded-full" />
          </div>
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-2.5 w-24" />
        </div>
      ))}
    </div>
  );
}
