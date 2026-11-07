"use client";

import { DragOverlay, useDragOperation } from "@dnd-kit/react";
import { cn } from "cn";

import { FormElements, type ElementsType } from "@/components/FormElements";

export default function DragOverlayWrapper() {
  const { source } = useDragOperation<{
    type?: ElementsType;
    isDesignerElement?: boolean;
    isExistingElement?: boolean;
  }>();

  if (
    (!source?.data.isDesignerElement && !source?.data.isExistingElement) ||
    !source.data.type
  ) {
    return null;
  }

  const formElement = FormElements[source.data.type];
  const Icon = formElement.designerBtn.icon;
  const actionLabel = source.data.isExistingElement ? "Moving" : "Adding";

  return (
    <DragOverlay dropAnimation={null}>
      <div
        className={cn(
          "flex h-16 w-full min-w-60 items-center gap-3 rounded-xl border border-primary/40 bg-card px-4 shadow-xl ring-2 ring-primary/20 backdrop-blur-sm",
        )}
      >
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            {actionLabel}
          </span>
          <span className="text-xs font-medium text-foreground">
            {formElement.designerBtn.label}
          </span>
        </div>
        <div className="ml-auto h-7 w-1/4 animate-pulse rounded-md bg-muted" />
      </div>
    </DragOverlay>
  );
}
