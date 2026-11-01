"use client";

import { cn } from "cn";
import { useDraggable } from "@dnd-kit/react";

import { Button } from "@/components/ui/button";
import type { FormElement } from "@/components/FormElements";

interface DesignerSidebarElementProps {
    formElement: FormElement;
}

export default function DesignerSidebarElement({
    formElement,
}: DesignerSidebarElementProps) {
    const Icon = formElement.designerBtn.icon;
    const { label } = formElement.designerBtn;
    const { isDragging, ref } = useDraggable({
        id: `designer-${formElement.type}`,
        data: {
            type: formElement.type,
            isDesignerElement: true
        },
    });

    return (
        <Button
            ref={ref}
            type="button"
            variant="outline"
            className={cn(
                "h-auto min-h-20 rounded-none flex-col items-start gap-3 border-[var(--builder-line)] bg-transparent px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.04em] text-[var(--builder-ink)]",
                "touch-none hover:border-[var(--builder-signal)] hover:bg-[var(--builder-signal)]/5",
                isDragging && "opacity-50",
            )}
            aria-roledescription="draggable form element"
            aria-describedby="designer-drag-instructions"
        >
            <Icon className="size-5 text-[var(--builder-signal)]" />
            <span>{label}</span>
        </Button>
    );
}
