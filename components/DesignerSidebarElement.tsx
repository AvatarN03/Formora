"use client";

import { cn } from "cn";
import { GripVertical } from "lucide-react";
import { useDraggable } from "@dnd-kit/react";

import type { FormElement } from "@/components/FormElements";

interface DesignerSidebarElementProps {
  formElement: FormElement;
  onAdd: () => void;
}

export default function DesignerSidebarElement({
  formElement,
  onAdd,
}: DesignerSidebarElementProps) {
  const Icon = formElement.designerBtn.icon;
  const { label } = formElement.designerBtn;

  /**
   * We attach the draggable ref to the grip handle only.
   * The card body handles click-to-add via onAdd.
   */
  const { isDragging, ref: gripRef } = useDraggable({
    id: `designer-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerElement: true,
    },
  });

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Add ${label} to canvas`}
      className={cn(
        "group relative flex h-auto min-h-[76px] w-full cursor-pointer flex-col items-start justify-between rounded-xl border border-border/70 bg-card/60 p-3 text-left shadow-2xs transition-all",
        "hover:border-primary/50 hover:bg-primary/5 hover:shadow-xs",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "active:scale-[0.98]",
        isDragging && "opacity-40 pointer-events-none",
      )}
      onClick={onAdd}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onAdd();
        }
      }}
    >
      {/* Drag grip handle — only this initiates dnd-kit drag */}
      <div
        ref={gripRef}
        role="button"
        tabIndex={-1}
        aria-label={`Drag handle for ${label}`}
        title="Drag to place precisely on canvas"
        className={cn(
          "absolute right-2 top-2 z-10 cursor-grab touch-none rounded-md p-1 text-muted-foreground/0 opacity-0 transition-all",
          "group-hover:opacity-100 group-hover:text-muted-foreground/60 hover:bg-muted hover:text-muted-foreground",
          "active:cursor-grabbing",
        )}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <GripVertical className="size-3.5" />
      </div>

      {/* Icon */}
      <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-3.5" />
      </div>

      {/* Label */}
      <span className="text-xs font-medium text-foreground">{label}</span>
    </div>
  );
}
