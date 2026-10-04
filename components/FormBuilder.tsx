"use client"
import { useState } from "react";
import type { Form } from "@prisma/client";
import { Check, Pencil, X } from "lucide-react";

import {  DragDropProvider } from "@dnd-kit/react";

import PreviewDialogBtn from "@/components/PreviewDialogBtn";
import PublishFormBtn from "@/components/PublishFormBtn";
import SaveFormBtn from "@/components/SaveFormBtn";
import { updateFormName } from "@/actions/form";

import Designer from "@/components/Designer";
import DragOverlayWrapper from "@/components/DragOverlayWrapper";
import type { FormElementInstance } from "@/components/FormElements";
import FormPreview from "@/components/FormPreview";

const FormBuilder = ({ form }: { form: Form }) => {
  const [formName, setFormName] = useState(form.name);
  const [draftName, setDraftName] = useState(form.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [elements, setElements] = useState<FormElementInstance[]>([]);

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
        <main className="flex min-h-screen flex-col">
          <nav className="border-b border-border/60 px-4 py-3 sm:px-6">
            <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3">
              {isEditingName ? (
                <div className="flex min-w-0 items-center gap-2">
                  <span className="mr-1 text-sm font-medium text-muted-foreground">Form:</span>
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
                    className="h-9 w-full max-w-xs rounded-md border border-border bg-background px-3 text-base font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    aria-label="Form name"
                  />
                  <button type="button" onClick={() => void saveFormName()} disabled={isSavingName} className="cursor-pointer rounded-md p-2 text-primary hover:bg-primary/10 disabled:cursor-not-allowed" aria-label="Save form name">
                    <Check className="size-4" />
                  </button>
                  <button type="button" onClick={() => { setDraftName(formName); setIsEditingName(false); }} className="cursor-pointer rounded-md p-2 text-muted-foreground hover:bg-muted" aria-label="Cancel editing form name">
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setIsEditingName(true)} className="flex min-w-0 cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-left hover:bg-muted/60" title="Edit form name">
                  <span className="text-sm font-medium text-muted-foreground">Form:</span>
                  <span className="truncate text-xl font-semibold text-foreground">{formName}</span>
                  <Pencil className="size-4 shrink-0 text-muted-foreground" />
                </button>
              )}
              <div className="flex items-center gap-2">
              <PreviewDialogBtn onClick={() => setIsPreviewing((current) => !current)} />
              {!form.published && (
                <>
                  <SaveFormBtn />
                  <PublishFormBtn />
                </>
              )}
              </div>
            </div>
          </nav>
          <div className="form-builder-container relative flex min-h-150 w-full grow overflow-y-auto bg-background p-8 lg:min-h-200">
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
