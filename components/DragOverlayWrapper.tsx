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
  const actionLabel = source.data.isExistingElement ? "Move" : "Add";

  return (
    <DragOverlay dropAnimation={null}>
      <div
        className={cn(
          "flex h-20 w-full min-w-64 items-center gap-3 border border-[var(--builder-signal)] bg-[var(--builder-card)] px-4 text-[11px] font-bold uppercase tracking-[0.04em] text-[var(--builder-ink)] shadow-[8px_8px_0_var(--builder-signal)]",
        )}
      >
        <Icon className="size-5 text-[var(--builder-signal)]" />
        <div className="flex flex-col gap-1">
          <span className="text-[9px] tracking-[0.16em] text-[var(--builder-signal)]">
            {actionLabel}
          </span>
          <span>{formElement.designerBtn.label}</span>
        </div>
        <div className="ml-auto h-8 w-2/5 rounded-md bg-muted" />
      </div>
    </DragOverlay>
  );
}
