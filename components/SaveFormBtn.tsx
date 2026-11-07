"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveFormContent } from "@/actions/form";
import type { FormElementInstance } from "@/components/FormElements";
import { toast } from "@/components/ui/toast";

export default function SaveFormBtn({
  formId,
  elements,
  onSaved,
}: {
  formId: string;
  elements: FormElementInstance[];
  onSaved?: () => void;
}) {
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    setIsSaving(true);
    try {
      await saveFormContent(formId, JSON.stringify(elements));
      onSaved?.();
      toast.add({
        title: "Form saved",
        description: "Your form structure is up to date.",
        type: "success",
      });
    } catch {
      toast.add({
        title: "Unable to save form",
        description: "Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-9 gap-1.5 rounded-lg border-border/70 bg-card/60 px-3 text-xs font-medium text-foreground shadow-2xs hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
      onClick={save}
      disabled={isSaving}
    >
      {isSaving ? (
        <>
          <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Save className="size-3.5 text-muted-foreground" />
          <span>Save</span>
        </>
      )}
    </Button>
  );
}
