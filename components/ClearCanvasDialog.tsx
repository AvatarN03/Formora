"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ClearCanvasDialogProps {
  formName: string;
  onConfirm: () => void;
  children: React.ReactNode;
}

export function ClearCanvasDialog({
  formName,
  onConfirm,
  children,
}: ClearCanvasDialogProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const isMatch = inputValue.trim() === formName.trim();

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleConfirm = () => {
    if (!isMatch) return;
    onConfirm();
    setOpen(false);
    setInputValue("");
  };

  const handleClose = () => {
    setOpen(false);
    setInputValue("");
  };

  return (
    <>
      {/* Trigger — clone child to inject onClick */}
      <span onClick={handleOpen} className="contents">
        {children}
      </span>

      <Dialog open={open} onOpenChange={(next) => { if (!next) handleClose(); }}>
        <DialogContent showCloseButton className="max-w-sm">
          <DialogHeader>
            <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Trash2 className="size-5" />
            </div>
            <DialogTitle className="text-base font-semibold text-foreground">
              Clear all fields?
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              This will permanently remove every field from your canvas. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">
              Type{" "}
              <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
                {formName}
              </span>{" "}
              to confirm
            </p>
            <input
              autoFocus
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirm();
                if (e.key === "Escape") handleClose();
              }}
              placeholder={formName}
              className="h-9 w-full rounded-lg border border-border/70 bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!isMatch}
              onClick={handleConfirm}
              className="rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-40"
            >
              Clear all fields
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
