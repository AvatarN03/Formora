"use client";

import { Button } from "@/components/ui/button";
import { publishForm } from "@/actions/form";
import type { FormElementInstance } from "@/components/FormElements";
import { toast } from "@/components/ui/toast";
import { useState } from "react";

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
      toast.add({ title: "Form published", description: `Public URL copied: ${publicURL}`, type: "success" });
    } catch {
      toast.add({ title: "Unable to publish form", description: "Please try again.", type: "error" });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Button type="button" size="sm" className="builder-action-primary" onClick={publish} disabled={isPublishing}>
      {isPublishing ? "Publishing..." : "Publish"}
    </Button>
  );
}
