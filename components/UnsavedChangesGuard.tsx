"use client";

import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UnsavedChangesGuardProps {
  hasUnsavedChanges: boolean;
  onSave: () => Promise<void>;
  onDiscard: () => void;
}

/**
 * Guards against accidental navigation away from the builder
 * when there are unsaved changes.
 *
 * Usage:
 *   - Wraps browser `beforeunload` to catch tab close / hard navigation.
 *   - Exposes `checkAndNavigate(url)` for in-app navigations (Back link).
 */
export function useUnsavedChangesGuard({
  hasUnsavedChanges,
  onSave,
  onDiscard,
}: UnsavedChangesGuardProps) {
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  /* ── Browser-level guard (tab close / hard reload) ── */
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsavedChanges]);

  /* ── In-app navigation interceptor ── */
  const checkAndNavigate = (url: string) => {
    if (!hasUnsavedChanges) {
      window.location.href = url;
      return;
    }
    setPendingUrl(url);
  };

  const handleSaveAndNavigate = async () => {
    if (!pendingUrl) return;
    setIsSaving(true);
    try {
      await onSave();
      window.location.href = pendingUrl;
    } finally {
      setIsSaving(false);
      setPendingUrl(null);
    }
  };

  const handleDiscard = () => {
    if (!pendingUrl) return;
    const url = pendingUrl;
    setPendingUrl(null);
    onDiscard();
    window.location.href = url;
  };

  const handleCancel = () => setPendingUrl(null);

  const dialogOpen = pendingUrl !== null;

  return { checkAndNavigate, dialogOpen, handleSaveAndNavigate, handleDiscard, handleCancel, isSaving };
}

/* ------------------------------------------------------------------ */
/* Dialog UI                                                           */
/* ------------------------------------------------------------------ */

interface UnsavedChangesDialogProps {
  open: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export function UnsavedChangesDialog({
  open,
  isSaving,
  onSave,
  onDiscard,
  onCancel,
}: UnsavedChangesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent showCloseButton={false} className="max-w-sm">
        <DialogHeader>
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Save className="size-5" />
          </div>
          <DialogTitle className="text-base font-semibold text-foreground">
            Unsaved changes
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Your form has unsaved changes. Would you like to save before
            leaving?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            size="sm"
            disabled={isSaving}
            onClick={onSave}
            className="w-full rounded-lg gap-2"
          >
            {isSaving ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                Saving...
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                Save and leave
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDiscard}
            disabled={isSaving}
            className="w-full rounded-lg gap-2 text-destructive hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
          >
            <X className="size-3.5" />
            Discard and leave
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSaving}
            className="w-full rounded-lg text-muted-foreground hover:text-foreground"
          >
            Stay on page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
