"use client";

import { Button } from "@/components/ui/button";
import { saveFormContent } from "@/actions/form";
import type { FormElementInstance } from "@/components/FormElements";
import { toast } from "@/components/ui/toast";
import { useState } from "react";

export default function SaveFormBtn({ formId, elements }: { formId: string; elements: FormElementInstance[] }) {
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    setIsSaving(true);
    try {
      await saveFormContent(formId, JSON.stringify(elements));
      toast.add({ title: "Form saved", description: "Your form structure is up to date.", type: "success" });
    } catch {
      toast.add({ title: "Unable to save form", description: "Please try again.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" className="builder-action" onClick={save} disabled={isSaving}>
      {isSaving ? "Saving..." : "Save"}
    </Button>
  );
}
