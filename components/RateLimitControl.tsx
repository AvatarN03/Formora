"use client";

import { useState } from "react";
import { Gauge } from "lucide-react";

import { updateFormRateLimit } from "@/actions/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";

const options = [0, 1, 5, 10, 25, 50];

export default function RateLimitControl({
  formId,
  initialRateLimit,
}: {
  formId: string;
  initialRateLimit: number;
}) {
  const [rateLimit, setRateLimit] = useState(initialRateLimit);
  const [isSaving, setIsSaving] = useState(false);

  const updateLimit = async (value: string) => {
    const nextLimit = Number(value);
    const previousLimit = rateLimit;
    setRateLimit(nextLimit);
    setIsSaving(true);

    try {
      await updateFormRateLimit(formId, nextLimit);
      toast.add({
        title: "Rate limit updated",
        description:
          nextLimit === 0
            ? "Network-based rate limiting is disabled."
            : `Each network can submit up to ${nextLimit} response${nextLimit === 1 ? "" : "s"} per hour.`,
        type: "success",
      });
    } catch {
      setRateLimit(previousLimit);
      toast.add({
        title: "Unable to update rate limit",
        description: "Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="hidden items-center gap-2 md:flex">
      <Gauge className="size-3.5 text-muted-foreground" aria-hidden="true" />
      <Select
        value={String(rateLimit)}
        onValueChange={(value) => value && void updateLimit(value)}
        disabled={isSaving}
      >
        <SelectTrigger
          size="sm"
          className="h-8 w-[172px] rounded-lg border-border/70 bg-card/60 text-xs text-foreground"
          aria-label="Network response limit"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option === 0 ? "Network limit off" : `${option} per network / hour`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
