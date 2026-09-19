"use client";

import { useDragDropMonitor, useDragOperation } from "@dnd-kit/react";
import { Fragment, useState } from "react";
import { Trash2 } from "lucide-react";

import {
  FormElements,
  FormFieldElements,
  LayoutElements,
  type ElementsType,
  type FormElementInstance,
} from "@/components/FormElements";

import DesignerDropZone from "./DesignerDropZone";
import DesignerSidebar from "./DesignerSidebar";

const Designer = () => {
  const { source } = useDragOperation<{
    type?: ElementsType;
    isDesignerElement?: boolean;
  }>();
  const [elements, setElements] = useState<FormElementInstance[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string>();

  useDragDropMonitor<{
    type?: ElementsType;
    isDesignerElement?: boolean;
  }>({
    onDragEnd(event) {
      if (event.canceled) {
        return;
      }

      const targetId = event.operation.target?.id;
      const data = event.operation.source?.data;
      if (
        typeof targetId !== "string" ||
        !targetId.startsWith("designer-drop-") ||
        !data?.isDesignerElement ||
        !data.type
      ) {
        return;
      }

      const elementType = data.type;
      const insertionIndex = Number(targetId.replace("designer-drop-", ""));

      if (!Number.isInteger(insertionIndex) || insertionIndex < 0) {
        return;
      }

      setElements((currentElements) => {
        const nextElements = [...currentElements];
        nextElements.splice(
          Math.min(insertionIndex, nextElements.length),
          0,
          FormElements[elementType].constuct(crypto.randomUUID()),
        );
        return nextElements;
      });
    },
  });

  const activeType = source?.data.isDesignerElement ? source.data.type : undefined;
  const activeElement = activeType ? FormElements[activeType] : undefined;
  const selectedInstance = elements.find(({ id }) => id === selectedElementId);
  const selectedElement = selectedInstance ? FormElements[selectedInstance.type] : undefined;
  const isDragging = Boolean(activeElement);

  return (
    <div className="flex h-full w-full">
      <div
        className={`m-auto flex h-full w-full max-w-230 flex-col items-center justify-start rounded-md border-2 bg-background transition-colors ${isDragging ? "border-primary/60" : "border-primary/50"}`}
      >
        <div className="flex w-full flex-col gap-3 p-5">
          <DesignerDropZone
            id="designer-drop-0"
            formElement={activeElement}
            isDragging={isDragging}
          />

          {elements.length > 0 ? (
            elements.map((element, index) => {
              const DesignerComponent = FormElements[element.type].designerComponent;
              return (
                <Fragment key={element.id}>
                  <div
                    className={`group relative w-full cursor-pointer rounded-md transition-all ${selectedElementId === element.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:ring-1 hover:ring-primary/60"}`}
                    onClick={() => setSelectedElementId(element.id)}
                  >
                    <DesignerComponent element={element} />
                    <button
                      type="button"
                      aria-label={`Delete ${FormElements[element.type].designerBtn.label}`}
                      className="absolute right-2 top-2 z-10 hidden rounded-md border border-destructive/40 bg-background p-1.5 text-destructive shadow-sm group-hover:block"
                      onClick={(event) => {
                        event.stopPropagation();
                        setElements((currentElements) => currentElements.filter(({ id }) => id !== element.id));
                        setSelectedElementId((currentId) => currentId === element.id ? undefined : currentId);
                      }}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <DesignerDropZone
                    id={`designer-drop-${index + 1}`}
                    formElement={activeElement}
                    isDragging={isDragging}
                  />
                </Fragment>
              );
            })
          ) : !activeElement ? (
            <p className="flex min-h-20 items-center justify-center text-3xl font-bold text-muted-foreground">
              Drop Here
            </p>
          ) : null}
        </div>
      </div>
      <DesignerSidebar
        layoutElements={LayoutElements}
        formElements={FormFieldElements}
        selectedElement={selectedElement}
        selectedInstance={selectedInstance}
        onUpdateElement={(updatedElement) => {
          setElements((currentElements) => currentElements.map((element) => (
            element.id === updatedElement.id ? updatedElement : element
          )));
        }}
        onBack={() => setSelectedElementId(undefined)}
      />
    </div>
  );
};

export default Designer;