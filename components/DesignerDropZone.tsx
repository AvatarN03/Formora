"use client";

import { useDroppable } from "@dnd-kit/react";
import { cn } from "cn";

import type { FormElement } from "@/components/FormElements";

interface DesignerDropZoneProps {
  id: string;
  formElement?: FormElement;
  isDragging: boolean;
  isBottom?: boolean;
}

export default function DesignerDropZone({
  id,
  formElement,
  isDragging,
  isBottom = false,
}: DesignerDropZoneProps) {
  const { isDropTarget, ref } = useDroppable({ id });
  const Icon = formElement?.designerBtn.icon;

  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full shrink-0 items-center justify-center rounded-sm transition-all",
        isDropTarget
          ? "min-h-20 border border-dashed border-primary/60 bg-primary/5 px-2"
          : isDragging && isBottom
            ? "min-h-28 border border-dashed border-border/60 bg-muted/20"
            : isDragging
              ? "h-14 border border-dashed border-border/60 bg-muted/10"
              : "h-4",
      )}
    >
      {isDropTarget && formElement && Icon ? (
        <div className="flex w-full flex-col gap-2 px-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
            <span className="h-px flex-1 bg-primary/60" />
            <span>Drop here</span>
            <span className="h-px flex-1 bg-primary/60" />
          </div>
          <div className="flex items-center gap-3">
            <Icon className="size-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {formElement.designerBtn.label}
            </span>
            <div className="ml-auto h-8 w-2/5 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
