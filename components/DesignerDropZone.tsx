"use client";

import { useDroppable } from "@dnd-kit/react";
import { cn } from "cn";

import type { FormElement } from "@/components/FormElements";

interface DesignerDropZoneProps {
  id: string;
  formElement?: FormElement;
  isDragging: boolean;
}

export default function DesignerDropZone({
  id,
  formElement,
  isDragging,
}: DesignerDropZoneProps) {
  const { isDropTarget, ref } = useDroppable({ id });
  const Icon = formElement?.designerBtn.icon;

  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full shrink-0 items-center justify-center rounded-md transition-all",
        isDropTarget
          ? "h-20 border border-dashed border-primary/60 bg-primary/5"
          : isDragging
            ? "h-10 border border-dashed border-border/60"
            : "h-3",
      )}
    >
      {isDropTarget && formElement && Icon ? (
        <div className="flex w-full items-center gap-3 px-4">
          <Icon className="size-5 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {formElement.designerBtn.label}
          </span>
          <div className="ml-auto h-8 w-2/5 animate-pulse rounded-md bg-muted" />
        </div>
      ) : null}
    </div>
  );
}
