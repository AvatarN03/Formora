"use client";

import {
  useDragDropMonitor,
  useDragOperation,
  useDraggable,
  useDroppable,
} from "@dnd-kit/react";
import {
  Fragment,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";
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

interface DesignerProps {
  elements: FormElementInstance[];
  onElementsChange: Dispatch<SetStateAction<FormElementInstance[]>>;
}

const Designer = ({ elements, onElementsChange }: DesignerProps) => {
  const { ref: canvasRef } = useDroppable({ id: "designer-canvas" });
  const { source } = useDragOperation<{
    type?: ElementsType;
    isDesignerElement?: boolean;
    isExistingElement?: boolean;
    elementId?: string;
  }>();
  const [selectedElementId, setSelectedElementId] = useState<string>();

  useDragDropMonitor<{
    type?: ElementsType;
    isDesignerElement?: boolean;
    isExistingElement?: boolean;
    elementId?: string;
  }>({
    onDragEnd(event) {
      if (event.canceled) {
        return;
      }

      const targetId = event.operation.target?.id;
      const data = event.operation.source?.data;
      if (typeof targetId !== "string" || !data) {
        return;
      }

      const insertionIndex = targetId.startsWith("designer-drop-")
        ? Number(targetId.replace("designer-drop-", ""))
        : targetId.startsWith("designer-field-")
          ? Number(targetId.replace("designer-field-", ""))
          : targetId === "designer-canvas"
            ? undefined
            : Number.NaN;

      if (data.isExistingElement && data.elementId) {
        if (
          insertionIndex !== undefined &&
          (!Number.isInteger(insertionIndex) || insertionIndex < 0)
        ) {
          return;
        }

        onElementsChange((currentElements) => {
          const sourceIndex = currentElements.findIndex(({ id }) => id === data.elementId);
          if (
            sourceIndex < 0 ||
            (insertionIndex !== undefined && insertionIndex === sourceIndex)
          ) {
            return currentElements;
          }

          const nextElements = [...currentElements];
          const [movedElement] = nextElements.splice(sourceIndex, 1);
          if (!movedElement) {
            return currentElements;
          }
          const targetIndex = Math.min(insertionIndex ?? currentElements.length, nextElements.length);
          const adjustedIndex = insertionIndex !== undefined && sourceIndex < insertionIndex
            ? targetIndex - 1
            : targetIndex;
          nextElements.splice(adjustedIndex, 0, movedElement);
          return nextElements;
        });
        return;
      }

      if (!data.isDesignerElement || !data.type) {
        return;
      }

      const elementType = data.type;
      if (
        insertionIndex !== undefined &&
        (!Number.isInteger(insertionIndex) || insertionIndex < 0)
      ) {
        return;
      }

      onElementsChange((currentElements) => {
        const nextElements = [...currentElements];
        nextElements.splice(
          Math.min(insertionIndex ?? nextElements.length, nextElements.length),
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
    <div className="builder-layout flex h-full w-full flex-col gap-5 xl:flex-row">
      <p id="designer-drag-instructions" className="sr-only">
        Drag fields to the canvas to add them. Drag existing fields to reorder them.
      </p>
      <div
        ref={canvasRef}
        className={`builder-canvas m-auto flex min-h-[600px] h-full w-full max-w-[920px] flex-col items-center justify-start border transition-colors lg:min-h-[800px] ${isDragging ? "border-[var(--builder-signal)]" : "border-[var(--builder-ink)]/25"}`}
      >
        <div className="flex w-full items-center justify-between border-b border-[#171717]/15 px-5 py-3">
          <span className="builder-muted text-[10px] font-bold uppercase tracking-[0.18em]">Canvas / {elements.length.toString().padStart(2, "0")} fields</span>
          <span className="builder-muted text-[10px] font-mono">A4 · 01</span>
        </div>
        <div className="flex w-full flex-col gap-3 p-5 sm:p-8">
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
                  <DesignerFieldDropTarget
                    id={`designer-field-${index}`}
                    elementId={element.id}
                    elementType={element.type}
                    isSelected={selectedElementId === element.id}
                    onClick={() => setSelectedElementId(element.id)}
                  >
                    <DesignerComponent element={element} />
                    <button
                      type="button"
                      aria-label={`Delete ${FormElements[element.type].designerBtn.label}`}
                      className="absolute right-2 top-2 z-10 hidden rounded-sm border border-destructive/40 bg-background p-1.5 text-destructive shadow-sm group-hover:block"
                      onClick={(event) => {
                        event.stopPropagation();
                        onElementsChange((currentElements) => currentElements.filter(({ id }) => id !== element.id));
                        setSelectedElementId((currentId) => currentId === element.id ? undefined : currentId);
                      }}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </DesignerFieldDropTarget>
                  <DesignerDropZone
                    id={`designer-drop-${index + 1}`}
                    formElement={activeElement}
                    isDragging={isDragging}
                    isBottom={index === elements.length - 1}
                  />
                </Fragment>
              );
            })
          ) : !activeElement ? (
            <p className="builder-muted flex min-h-28 items-center justify-center border border-dashed border-[var(--builder-ink)]/30 text-[11px] font-bold uppercase tracking-[0.18em]">
              Drop field here
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
          onElementsChange((currentElements) => currentElements.map((element) => (
            element.id === updatedElement.id ? updatedElement : element
          )));
        }}
        onBack={() => setSelectedElementId(undefined)}
      />
    </div>
  );
};

interface DesignerFieldDropTargetProps {
  id: string;
  elementId: string;
  elementType: ElementsType;
  isSelected: boolean;
  onClick: () => void;
  children: ReactNode;
}

function DesignerFieldDropTarget({
  id,
  elementId,
  elementType,
  isSelected,
  onClick,
  children,
}: DesignerFieldDropTargetProps) {
  const { isDragging, ref: draggableRef } = useDraggable({
    id: `designer-existing-${elementId}`,
    data: {
      isExistingElement: true,
      elementId,
      type: elementType,
    },
  });
  const { isDropTarget, ref } = useDroppable({ id });

  return (
    <div
      ref={draggableRef}
      role="button"
      tabIndex={0}
      aria-roledescription="draggable field"
      aria-label="Drag field to reorder"
      aria-describedby="designer-drag-instructions"
      className={`group relative w-full cursor-pointer touch-none rounded-sm transition-all ${
        isDropTarget
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : isSelected
            ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
            : "hover:ring-1 hover:ring-primary/60"
      } ${isDragging ? "opacity-50" : ""}`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      {isDropTarget ? (
        <div className="pointer-events-none absolute -top-3 left-0 z-10 flex w-full items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
          <span className="h-0.5 flex-1 bg-primary" />
          <span className="rounded-sm bg-primary px-2 py-1 text-primary-foreground shadow-sm">
            Drop before
          </span>
          <span className="h-0.5 flex-1 bg-primary" />
        </div>
      ) : null}
      <div ref={ref}>{children}</div>
    </div>
  );
}

export default Designer;
