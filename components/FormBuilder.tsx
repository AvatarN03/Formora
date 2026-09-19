"use client"
import type { Form } from "@prisma/client";

import {  DragDropProvider } from "@dnd-kit/react";

import PreviewDialogBtn from "@/components/PreviewDialogBtn";
import PublishFormBtn from "@/components/PublishFormBtn";
import SaveFormBtn from "@/components/SaveFormBtn";

import Designer from "@/components/Designer";
import DragOverlayWrapper from "@/components/DragOverlayWrapper";

const FormBuilder = ({ form }: { form: Form }) => {
  return (
    <DragDropProvider
      onDragEnd={(event) => {
        console.log("Dragged element:", event);
      }}
    >
        <main className="flex min-h-screen flex-col">
          <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-4 sm:px-6">
            <h2 className="text-lg font-medium">
              <span className="mr-2 text-muted-foreground">Form:</span>
              {form.name}
            </h2>
            <div className="flex items-center gap-2">
              <PreviewDialogBtn />
              {!form.published && (
                <>
                  <SaveFormBtn />
                  <PublishFormBtn />
                </>
              )}
            </div>
          </nav>
          <div className="flex grow justify-center items-center w-full relative overflow-y-auto h-50 bg-background form-builder-container p-8">
            <Designer />
            <DragOverlayWrapper />
          </div>
        </main>
    </DragDropProvider>
  );
};

export default FormBuilder;