"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import { updateFormResponsePolicy } from "@/actions/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";

type ResponsePolicy = "UNLIMITED" | "ONE_PER_BROWSER";

export default function ResponsePolicyControl({
  formId,
  initialPolicy,
}: {
  formId: string;
  initialPolicy: ResponsePolicy;
}) {
  const [policy, setPolicy] = useState<ResponsePolicy>(initialPolicy);
  const [isSaving, setIsSaving] = useState(false);

  const updatePolicy = async (nextPolicy: ResponsePolicy) => {
    const previousPolicy = policy;
    setPolicy(nextPolicy);
    setIsSaving(true);

    try {
      await updateFormResponsePolicy(formId, nextPolicy);
      toast.add({
        title: "Response settings updated",
        description:
          nextPolicy === "ONE_PER_BROWSER"
            ? "Each browser can submit this form once."
            : "This form accepts multiple responses.",
        type: "success",
      });
    } catch {
      setPolicy(previousPolicy);
      toast.add({
        title: "Unable to update response settings",
        description: "Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="hidden items-center gap-2 md:flex">
      <ShieldCheck className="size-3.5 text-muted-foreground" aria-hidden="true" />
      <Select
        value={policy}
        onValueChange={(value) => void updatePolicy(value as ResponsePolicy)}
        disabled={isSaving}
      >
        <SelectTrigger
          size="sm"
          className="h-8 w-[172px] rounded-lg border-border/70 bg-card/60 text-xs text-foreground"
          aria-label="Response policy"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ONE_PER_BROWSER">One per browser</SelectItem>
          <SelectItem value="UNLIMITED">Unlimited responses</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
