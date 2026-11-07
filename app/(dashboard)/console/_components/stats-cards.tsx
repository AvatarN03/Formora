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
      sub: totalForms === 1 ? "1 active form" : `${totalForms} active forms`,
      icon: FileText,
    },
    {
      label: "Total visits",
      value: totalVisits.toLocaleString(),
      sub: "All-time form impressions",
      icon: Eye,
    },
    {
      label: "Submission rate",
      value: `${submissionRate.toFixed(1)}%`,
      sub: `${totalSubmissions.toLocaleString()} completed responses`,
      icon: BarChart2,
    },
    {
      label: "Bounce rate",
      value: `${bounceRate.toFixed(1)}%`,
      sub: "Visits without submissions",
      icon: TrendingDown,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="rounded-2xl border border-border/50 bg-card p-5 shadow-xs transition-all hover:border-border hover:shadow-sm"
          >
            <div className="flex items-center justify-between text-muted-foreground mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider font-medium">
                {stat.label}
              </span>
              <div className="flex size-7 items-center justify-center rounded-lg bg-secondary/70 text-primary border border-border/40">
                <Icon className="size-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {stat.value}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-border/50 bg-card p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-20 rounded-md" />
            <Skeleton className="size-7 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-3 w-32 rounded-md" />
        </div>
      ))}
    </div>
  );
}
