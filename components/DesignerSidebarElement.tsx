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
                "h-auto min-h-16 flex-col gap-2 border-border/60 px-3 py-3 text-xs",
                "hover:border-primary/60 hover:bg-primary/5",
                isDragging && "opacity-50",
            )}
        >
            <Icon className="size-5 text-muted-foreground" />
            <span>{label}</span>
        </Button>
    );
}
