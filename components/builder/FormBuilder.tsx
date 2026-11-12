"use client";

import { useCallback, useState } from "react";
import type { Form } from "@prisma/client";
import { ArrowLeft, Check, Pencil, X } from "lucide-react";
import { DragDropProvider } from "@dnd-kit/react";

import PreviewDialogBtn from "@/components/builder/PreviewDialogBtn";
import PublishFormBtn, { PublishedFormDialog } from "@/components/builder/PublishFormBtn";
import SaveFormBtn from "@/components/builder/SaveFormBtn";
import ResponsePolicyControl from "@/components/builder/ResponsePolicyControl";
import RateLimitControl from "@/components/builder/RateLimitControl";
import { ButtonGroup } from "@/components/ui/button-group";
import { ThemeToggle } from "@/components/theme-toggle";
import { updateFormName, saveFormContent } from "@/actions/form";
import Designer from "@/components/builder/Designer";
import DragOverlayWrapper from "@/components/builder/DragOverlayWrapper";
import {
  FormElements,
  type FormElementInstance,
} from "@/components/builder/FormElements";
import FormPreview from "@/components/builder/FormPreview";
import {
  UnsavedChangesDialog,
  useUnsavedChangesGuard,
} from "@/components/builder/UnsavedChangesGuard";
import { cn } from "cn";

function readFormElements(content: string): FormElementInstance[] {
  const parsed: unknown = JSON.parse(content);

  if (!Array.isArray(parsed)) {
    throw new Error("Saved form content must be an array");
  }

  return parsed.filter((element): element is FormElementInstance => {
    if (!element || typeof element !== "object") {
      return false;
    }

    const candidate = element as Record<string, unknown>;
    return (
      typeof candidate.id === "string" &&
      typeof candidate.type === "string" &&
      candidate.type in FormElements
    );
  });
}

const FormBuilder = ({ form }: { form: Form }) => {
  const [formName, setFormName] = useState(form.name);
  const [draftName, setDraftName] = useState(form.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isPublished, setIsPublished] = useState(form.published);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  // Track "saved snapshot" to detect unsaved changes
  const [savedContent, setSavedContent] = useState(form.content);
  const [elements, setElements] = useState<FormElementInstance[]>(() =>
    readFormElements(form.content),
  );

  const currentContent = JSON.stringify(elements);
  const hasUnsavedChanges = currentContent !== savedContent;

  /* ── Save helper (also used by unsaved-changes guard) ── */
  const handleSave = useCallback(async () => {
    await saveFormContent(String(form.id), currentContent);
    setSavedContent(currentContent);
  }, [form.id, currentContent]);

  /* ── Unsaved changes guard ── */
  const {
    checkAndNavigate,
    dialogOpen,
    handleSaveAndNavigate,
    handleDiscard,
    handleCancel,
    isSaving: isSavingGuard,
  } = useUnsavedChangesGuard({
    hasUnsavedChanges,
    onSave: handleSave,
    onDiscard: () => {
      setSavedContent(currentContent); // mark clean so no double guard
    },
  });

  const saveFormName = async () => {
    const nextName = draftName.trim();
    if (!nextName || nextName === formName) {
      setDraftName(formName);
      setIsEditingName(false);
      return;
    }

    setIsSavingName(true);
    try {
      const savedName = await updateFormName(String(form.id), nextName);
      setFormName(savedName);
      setDraftName(savedName);
      setIsEditingName(false);
    } finally {
      setIsSavingName(false);
    }
  };

  return (
    <>
      {/* Unsaved changes dialog — rendered outside DragDropProvider so it's always accessible */}
      <UnsavedChangesDialog
        open={dialogOpen}
        isSaving={isSavingGuard}
        onSave={() => void handleSaveAndNavigate()}
        onDiscard={handleDiscard}
        onCancel={handleCancel}
      />

      <PublishedFormDialog
        publicUrl={publishedUrl}
        onClose={() => setPublishedUrl(null)}
      />

      <DragDropProvider
        onDragEnd={(event) => {
          console.log("Dragged element:", event);
        }}
      >
        <main data-builder className="flex min-h-screen flex-col bg-background text-foreground">
          <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-[96rem] flex-wrap items-center justify-between gap-4 px-5 py-3 sm:px-6 lg:px-10">
              {/* Left: Back Button (intercepted by guard) & Form Title */}
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => checkAndNavigate("/console")}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-card/60 text-muted-foreground shadow-2xs transition-colors hover:border-border hover:bg-accent hover:text-foreground"
                  aria-label="Back to workspace"
                >
                  <ArrowLeft className="size-4" />
                </button>

                {isEditingName ? (
                  <div className="flex min-w-0 items-center gap-1.5">
                    <input
                      autoFocus
                      value={draftName}
                      onChange={(event) => setDraftName(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") void saveFormName();
                        if (event.key === "Escape") {
                          setDraftName(formName);
                          setIsEditingName(false);
                        }
                      }}
                      className="h-9 w-48 rounded-lg border border-primary bg-background px-2.5 text-sm font-semibold text-foreground shadow-xs outline-none focus:ring-2 focus:ring-primary/20 sm:w-64"
                      aria-label="Form name"
                    />
                    <button
                      type="button"
                      onClick={() => void saveFormName()}
                      disabled={isSavingName}
                      className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs hover:bg-primary/90 disabled:opacity-50"
                      aria-label="Save form name"
                    >
                      <Check className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDraftName(formName);
                        setIsEditingName(false);
                      }}
                      className="flex size-8 items-center justify-center rounded-lg border border-border/70 bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                      aria-label="Cancel editing form name"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="group flex min-w-0 cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-left transition-colors hover:bg-muted/50"
                    title="Click to rename"
                  >
                    <span className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                      {formName}
                    </span>
                    <Pencil className="size-3.5 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-foreground" />
                  </button>
                )}

                {/* Unsaved dot indicator */}
                {hasUnsavedChanges && (
                  <span
                    title="Unsaved changes"
                    className="size-2 shrink-0 rounded-full bg-amber-500"
                  />
                )}

                {/* Published / Draft badge */}
                <span
                  className={cn(
                    "hidden items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide sm:inline-flex border",
                    isPublished
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-border/70 bg-muted/40 text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      isPublished
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-muted-foreground/50",
                    )}
                  />
                  {isPublished ? "Published" : "Draft"}
                </span>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2.5">
                <ButtonGroup className="gap-2">
                  <ResponsePolicyControl
                    formId={String(form.id)}
                    initialPolicy={form.responsePolicy ?? "ONE_PER_BROWSER"}
                  />
                  <RateLimitControl
                    formId={String(form.id)}
                    initialRateLimit={form.rateLimitPerHour}
                  />
                  <PreviewDialogBtn
                    isPreviewing={isPreviewing}
                    onClick={() => setIsPreviewing((current) => !current)}
                  />
                  <SaveFormBtn
                    formId={String(form.id)}
                    elements={elements}
                    onSaved={() => {
                      setSavedContent(currentContent);
                    }}
                  />
                </ButtonGroup>

                {!isPublished && (
                  <PublishFormBtn
                    formId={String(form.id)}
                    elements={elements}
                    onPublished={(publicURL) => {
                      setSavedContent(currentContent);
                      setIsPublished(true);
                      setPublishedUrl(publicURL);
                    }}
                  />
                )}

                <div className="h-5 w-px bg-border/60" />
                <ThemeToggle />
              </div>
            </div>
          </nav>

          <div className="builder-workspace relative flex min-h-[calc(100vh-65px)] w-full grow overflow-y-auto p-4 sm:p-6 lg:p-8">
            {isPreviewing ? (
              <FormPreview
                form={form}
                elements={elements}
                onBack={() => setIsPreviewing(false)}
              />
            ) : (
              <>
                <Designer
                  formName={formName}
                  elements={elements}
                  onElementsChange={setElements}
                />
                <DragOverlayWrapper />
              </>
            )}
          </div>
        </main>
      </DragDropProvider>
    </>
  );
};

export default FormBuilder;
