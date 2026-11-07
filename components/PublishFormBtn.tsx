"use client";

import { useState } from "react";
import { Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publishForm } from "@/actions/form";
import type { FormElementInstance } from "@/components/FormElements";
import { toast } from "@/components/ui/toast";

export default function PublishFormBtn({
  formId,
  elements,
  onPublished,
}: {
  formId: string;
  elements: FormElementInstance[];
  onPublished?: (publicURL: string) => void;
}) {
  const [isPublishing, setIsPublishing] = useState(false);

  const publish = async () => {
    setIsPublishing(true);
    try {
      const shareURL = await publishForm(formId, JSON.stringify(elements));
      const publicURL = `${window.location.origin}/f/${shareURL}`;
      await navigator.clipboard?.writeText(publicURL);
      onPublished?.(publicURL);
      toast.add({
        title: "Form published",
        description: `Public URL copied to clipboard: ${publicURL}`,
        type: "success",
      });
    } catch {
      toast.add({
        title: "Unable to publish form",
        description: "Please try again.",
        type: "error",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      className="h-9 gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary/90 disabled:opacity-60"
      onClick={publish}
      disabled={isPublishing}
    >
      {isPublishing ? (
        <>
          <Loader2 className="size-3.5 animate-spin" />
          <span>Publishing...</span>
        </>
      ) : (
        <>
          <Globe className="size-3.5" />
          <span>Publish</span>
        </>
      )}
    </Button>
  );
}
