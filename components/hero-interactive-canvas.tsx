"use client";

import { GripVertical, MousePointer2 } from "lucide-react";

export function HeroInteractiveCanvas() {
  return (
    <div className="hero-interactive-stage relative flex w-full max-w-md mx-auto flex-col items-center justify-center py-6 select-none">
      {/* 2-Element Drag & Drop Stage (Borderless, Rounded, Minimalist) */}
      <div className="relative w-full h-[190px]">
        {/* Item A (Initially Top) */}
        <div className="hero-drag-item-a absolute inset-x-0 top-0 rounded-2xl bg-card p-4 shadow-sm transition-shadow hover:shadow-md border border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GripVertical className="size-4 text-muted-foreground/50" />
              <span className="text-sm font-semibold text-foreground">
                Workplace name
              </span>
            </div>
            <span className="text-[11px] font-mono font-medium text-muted-foreground">
              Text
            </span>
          </div>
          <div className="mt-2.5 h-8 w-full rounded-lg bg-secondary/70 border border-border/50 px-3 text-xs font-normal text-foreground/80 flex items-center">
            e.g. Acme Design Labs
          </div>
        </div>

        {/* Drop Insertion Line between components during drag */}
        <div className="hero-drag-drop-line pointer-events-none absolute inset-x-4 top-[87px] z-20 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-primary" />
          <div className="h-0.5 flex-1 rounded-full bg-primary/80 shadow-[0_0_8px_rgba(227,59,47,0.5)]" />
          <span className="size-1.5 rounded-full bg-primary" />
        </div>

        {/* Item B (Initially Bottom, Smoothly Dragged to Top) */}
        <div className="hero-drag-item-b absolute inset-x-0 top-[94px] rounded-2xl bg-card p-4 shadow-sm transition-shadow border border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <GripVertical className="size-4 text-primary" />

                {/* Cursor physically anchored directly to this grip handle */}
                <div className="hero-drag-cursor pointer-events-none absolute -left-1.5 -top-1.5 z-30">
                  <MousePointer2 className="size-5 rotate-[-15deg] fill-primary text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
                </div>
              </div>

              <span className="text-sm font-semibold text-foreground">
                Contact email
              </span>
            </div>
            <span className="text-[11px] font-mono font-medium text-muted-foreground">
              Email
            </span>
          </div>
          <div className="mt-2.5 h-8 w-full rounded-lg bg-secondary/70 border border-border/50 px-3 text-xs font-normal text-foreground/80 flex items-center">
            alex@acme.ch
          </div>
        </div>
      </div>
    </div>
  );
}
