"use client"
import { useState } from "react";
import type { Form } from "@prisma/client";
import { ArrowLeft, Check, Pencil, X } from "lucide-react";

import {  DragDropProvider } from "@dnd-kit/react";

import PreviewDialogBtn from "@/components/PreviewDialogBtn";
import PublishFormBtn from "@/components/PublishFormBtn";
import SaveFormBtn from "@/components/SaveFormBtn";
import { ButtonGroup } from "@/components/ui/button-group";
import { ThemeToggle } from "@/components/theme-toggle";
import { updateFormName } from "@/actions/form";

import Designer from "@/components/Designer";
import DragOverlayWrapper from "@/components/DragOverlayWrapper";
import {
  FormElements,
  type FormElementInstance,
} from "@/components/FormElements";
import FormPreview from "@/components/FormPreview";

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
  const [elements, setElements] = useState<FormElementInstance[]>(() => readFormElements(form.content));

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
    <DragDropProvider
      onDragEnd={(event) => {
        console.log("Dragged element:", event);
      }}
    >
        <main data-builder className="flex min-h-screen flex-col bg-[var(--builder-paper)] text-[var(--builder-ink)]">
          <nav className="builder-topbar border-b border-[var(--builder-ink)] bg-[var(--builder-paper)] px-4 py-3 sm:px-6">
            <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <a href="/console" className="builder-icon-button" aria-label="Back to workspace">
                  <ArrowLeft className="size-4" />
                </a>
                <span className="builder-signal hidden text-[10px] font-bold uppercase tracking-[0.2em] sm:inline">Builder / 01</span>
                <span className="builder-muted">/</span>
              {isEditingName ? (
                <div className="flex min-w-0 items-center gap-2">
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
                    className="h-9 w-full max-w-xs border-b-2 border-[var(--builder-signal)] bg-transparent px-1 text-base font-bold outline-none"
                    aria-label="Form name"
                  />
                  <button type="button" onClick={() => void saveFormName()} disabled={isSavingName} className="builder-icon-button builder-signal disabled:cursor-not-allowed" aria-label="Save form name">
                    <Check className="size-4" />
                  </button>
                  <button type="button" onClick={() => { setDraftName(formName); setIsEditingName(false); }} className="builder-icon-button builder-muted" aria-label="Cancel editing form name">
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setIsEditingName(true)} className="group flex min-w-0 cursor-pointer items-center gap-2 text-left" title="Edit form name">
                  <span className="truncate text-lg font-bold tracking-[-0.03em]">{formName}</span>
                  <Pencil className="size-3.5 shrink-0 builder-muted transition-colors group-hover:text-[var(--builder-signal)]" />
                </button>
              )}
              </div>
              <div className="flex items-center gap-2">
              <span className="builder-muted mr-2 hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] md:flex">
                <span className={`size-2 rounded-full ${isPublished ? "bg-[var(--builder-signal)]" : "bg-[var(--builder-ink)]/30"}`} />
                {isPublished ? "Published" : "Draft"}
              </span>
              <ButtonGroup className="builder-button-group">
                <PreviewDialogBtn onClick={() => setIsPreviewing((current) => !current)} />
              {!isPublished && (
                <SaveFormBtn formId={String(form.id)} elements={elements} />
              )}
              </ButtonGroup>
              {!isPublished && (
                <PublishFormBtn
                  formId={String(form.id)}
                  elements={elements}
                  onPublished={() => setIsPublished(true)}
                />
              )}
              <ThemeToggle />
              </div>
            </div>
          </nav>
          <div className="builder-workspace relative flex min-h-150 w-full grow overflow-y-auto p-4 sm:p-6 lg:min-h-200 lg:p-8">
            {isPreviewing ? (
              <FormPreview form={form} elements={elements} onBack={() => setIsPreviewing(false)} />
            ) : (
              <>
                <Designer elements={elements} onElementsChange={setElements} />
                <DragOverlayWrapper />
              </>
            )}
          </div>
        </main>
    </DragDropProvider>
  );
};

export default FormBuilder;
