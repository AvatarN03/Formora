"use client";

import { useDragDropMonitor, useDragOperation } from "@dnd-kit/react";
import { Fragment, useState } from "react";

import { FormElements, type ElementsType, type FormElementInstance } from "@/components/FormElements";

import DesignerDropZone from "./DesignerDropZone";
import DesignerSidebar from "./DesignerSidebar";

const Designer = () => {
  const { source } = useDragOperation<{
    type?: ElementsType;
    isDesignerElement?: boolean;
  }>();
  const [elements, setElements] = useState<FormElementInstance[]>([]);

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

      if (!Number.isInteger(insertionIndex)) {
        return;
      }

      setElements((currentElements) => {
        const nextElements = [...currentElements];
        nextElements.splice(
          insertionIndex,
          0,
          FormElements[elementType].constuct(crypto.randomUUID()),
        );
        return nextElements;
      });
    },
  });

  const activeType = source?.data.isDesignerElement ? source.data.type : undefined;
  const activeElement = activeType ? FormElements[activeType] : undefined;
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
                  <DesignerComponent />
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
        formElements={[FormElements.TextField, FormElements.H1, FormElements.H2]}
      />
    </div>
  );
};

export default Designer;