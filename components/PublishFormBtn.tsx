"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { publishForm } from "@/actions/form";
import type { FormElementInstance } from "@/components/FormElements";
import { toast } from "@/components/ui/toast";

export default function PublishFormBtn({
  formId,
  elements,
  onPublished,
}: {
  formId: string;
  elements: FormElementInstance[];
  onPublished?: (publicURL: string) => void;
}) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const publish = async () => {
    setIsPublishing(true);
    try {
      const shareURL = await publishForm(formId, JSON.stringify(elements));
      const publicURL = `${window.location.origin}/f/${shareURL}`;
      onPublished?.(publicURL);
      toast.add({
        title: "Form published",
        description: "Your form is live. You can copy or open the public link.",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Unable to publish form",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <Button
        type="button"
        size="sm"
        className="h-9 gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary/90 disabled:opacity-60"
        onClick={() => setIsConfirmOpen(true)}
        disabled={isPublishing}
      >
        <Globe className="size-3.5" />
        <span>Publish</span>
      </Button>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Publish this form?</AlertDialogTitle>
          <AlertDialogDescription>
            Anyone with the public link will be able to open this form and
            submit a response.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => void publish()} disabled={isPublishing}>
            {isPublishing ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish form"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function PublishedFormDialog({
  publicUrl,
  onClose,
}: {
  publicUrl: string | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.add({
        title: "Link copied",
        description: "The public form link is ready to share.",
        type: "success",
      });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.add({
        title: "Unable to copy link",
        description: "Copy the link manually from the dialog.",
        type: "error",
      });
    }
  };

  return (
    <AlertDialog
      open={Boolean(publicUrl)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-emerald-500/10 text-emerald-500">
            <Check />
          </AlertDialogMedia>
          <AlertDialogTitle>Your form is live</AlertDialogTitle>
          <AlertDialogDescription>
            Share the link below or open the public form to check the visitor
            experience.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs leading-relaxed text-foreground break-all">
          {publicUrl}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
          <Button type="button" variant="outline" onClick={copyLink}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy link"}
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (publicUrl) window.open(publicUrl, "_blank", "noopener,noreferrer");
            }}
          >
            <ExternalLink className="size-4" />
            Open form
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
