"use client";

import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PreviewDialogBtn({
  onClick,
  isPreviewing = false,
}: {
  onClick: () => void;
  isPreviewing?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-9 gap-1.5 rounded-lg border-border/70 bg-card/60 px-3 text-xs font-medium text-foreground shadow-2xs hover:bg-accent hover:text-accent-foreground"
      onClick={onClick}
    >
      {isPreviewing ? (
        <>
          <EyeOff className="size-3.5 text-muted-foreground" />
          <span>Exit Preview</span>
        </>
      ) : (
        <>
          <Eye className="size-3.5 text-muted-foreground" />
          <span>Preview</span>
        </>
      )}
    </Button>
  );
}
