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
        "flex w-full shrink-0 items-center justify-center rounded-xl transition-all",
        isDropTarget
          ? "min-h-20 border-2 border-dashed border-primary bg-primary/5 px-3 shadow-xs"
          : isDragging && isBottom
            ? "min-h-24 border border-dashed border-primary/40 bg-primary/5"
            : isDragging
              ? "h-12 border border-dashed border-border/70 bg-muted/30"
              : "h-3",
      )}
    >
      {isDropTarget && formElement && Icon ? (
        <div className="flex w-full flex-col gap-2 px-3 py-2">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
            <span className="h-px flex-1 bg-primary/30" />
            <span>Drop here</span>
            <span className="h-px flex-1 bg-primary/30" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" />
            </div>
            <span className="text-sm font-medium text-foreground">
              {formElement.designerBtn.label}
            </span>
            <div className="ml-auto h-7 w-1/3 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
