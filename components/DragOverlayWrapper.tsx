"use client";

import { DragOverlay, useDragOperation } from "@dnd-kit/react";
import { cn } from "cn";

import { FormElements, type ElementsType } from "@/components/FormElements";

export default function DragOverlayWrapper() {
  const { source } = useDragOperation<{ type?: ElementsType; isDesignerElement?: boolean }>();

  if (!source?.data.isDesignerElement || !source.data.type) {
    return null;
  }

  const formElement = FormElements[source.data.type];
  const Icon = formElement.designerBtn.icon;

  return (
    <DragOverlay dropAnimation={null}>
      <div
        className={cn(
          "flex h-20 w-full min-w-64 items-center gap-3 rounded-md",
          "border border-primary/60 bg-card px-4 text-xs text-foreground shadow-lg",
        )}
      >
        <Icon className="size-5 text-primary" />
        <span>{formElement.designerBtn.label}</span>
        <div className="ml-auto h-8 w-2/5 rounded-md bg-muted" />
      </div>
    </DragOverlay>
  );
}
