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
import { Copy, GripVertical, Layers, RotateCcw, Trash2 } from "lucide-react";

import {
  FormElements,
  FormFieldElements,
  LayoutElements,
  type ElementsType,
  type FormElementInstance,
} from "@/components/builder/FormElements";

import DesignerDropZone from "./DesignerDropZone";
import DesignerSidebar from "./DesignerSidebar";
import { ClearCanvasDialog } from "./ClearCanvasDialog";
import { cn } from "cn";

interface DesignerProps {
  formName: string;
  elements: FormElementInstance[];
  onElementsChange: Dispatch<SetStateAction<FormElementInstance[]>>;
}

const Designer = ({ formName, elements, onElementsChange }: DesignerProps) => {
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
      if (event.canceled) return;

      const targetId = event.operation.target?.id;
      const data = event.operation.source?.data;
      if (typeof targetId !== "string" || !data) return;

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
        ) return;

        onElementsChange((currentElements) => {
          const sourceIndex = currentElements.findIndex(
            ({ id }) => id === data.elementId,
          );
          if (
            sourceIndex < 0 ||
            (insertionIndex !== undefined && insertionIndex === sourceIndex)
          ) return currentElements;

          const nextElements = [...currentElements];
          const [movedElement] = nextElements.splice(sourceIndex, 1);
          if (!movedElement) return currentElements;

          const targetIndex = Math.min(
            insertionIndex ?? currentElements.length,
            nextElements.length,
          );
          const adjustedIndex =
            insertionIndex !== undefined && sourceIndex < insertionIndex
              ? targetIndex - 1
              : targetIndex;
          nextElements.splice(adjustedIndex, 0, movedElement);
          return nextElements;
        });
        return;
      }

      if (!data.isDesignerElement || !data.type) return;

      const elementType = data.type;
      if (
        insertionIndex !== undefined &&
        (!Number.isInteger(insertionIndex) || insertionIndex < 0)
      ) return;

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

  /** Add element to end of canvas (from sidebar click) */
  const appendElement = (type: ElementsType) => {
    const newElement = FormElements[type].constuct(crypto.randomUUID());
    onElementsChange((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  const activeType = source?.data.isDesignerElement
    ? source.data.type
    : undefined;
  const activeElement = activeType ? FormElements[activeType] : undefined;
  const selectedInstance = elements.find(({ id }) => id === selectedElementId);
  const selectedElement = selectedInstance
    ? FormElements[selectedInstance.type]
    : undefined;
  const isDragging = Boolean(activeElement);

  return (
    <div className="flex h-full w-full flex-col gap-6 xl:flex-row">
      <p id="designer-drag-instructions" className="sr-only">
        Click to add an element. Use the drag handle to reorder elements on the
        canvas. Click an element on the canvas to edit its properties.
      </p>

      {/* Main Canvas Area */}
      <div
        ref={canvasRef}
        className={cn(
          "m-auto flex min-h-[640px] h-full w-full max-w-[880px] flex-col items-center justify-start rounded-2xl border bg-card p-6 shadow-xs transition-all lg:min-h-[820px] lg:p-8",
          isDragging
            ? "border-primary/50 ring-2 ring-primary/20 bg-card/95"
            : "border-border/70",
        )}
      >
        {/* Canvas Header */}
        <div className="mb-6 flex w-full items-center justify-between border-b border-border/60 pb-3.5">
          <div className="flex items-center gap-2.5">
            {/* Form name badge */}
            <span className="max-w-[220px] truncate text-sm font-semibold tracking-tight text-foreground sm:max-w-xs">
              {formName || "Untitled Form"}
            </span>
            <span className="rounded-full bg-muted/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {elements.length}{" "}
              {elements.length === 1 ? "field" : "fields"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {elements.length > 0 ? (
              <ClearCanvasDialog
                formName={formName}
                onConfirm={() => {
                  onElementsChange([]);
                  setSelectedElementId(undefined);
                }}
              >
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
                >
                  <RotateCcw className="size-3" />
                  <span>Clear all</span>
                </button>
              </ClearCanvasDialog>
            ) : null}
            <span className="text-xs text-muted-foreground/60">
              Click element to edit
            </span>
          </div>
        </div>

        {/* Canvas Drop Area */}
        <div className="flex w-full flex-col gap-3">
          <DesignerDropZone
            id="designer-drop-0"
            formElement={activeElement}
            isDragging={isDragging}
          />

          {elements.length > 0 ? (
            elements.map((element, index) => {
              const DesignerComponent =
                FormElements[element.type].designerComponent;
              return (
                <Fragment key={element.id}>
                  <DesignerFieldDropTarget
                    id={`designer-field-${index}`}
                    elementId={element.id}
                    elementType={element.type}
                    isSelected={selectedElementId === element.id}
                    onClick={() => setSelectedElementId(element.id)}
                    onDuplicate={() => {
                      const duplicateElement: FormElementInstance = {
                        ...element,
                        id: crypto.randomUUID(),
                        extraAttributes: element.extraAttributes
                          ? JSON.parse(JSON.stringify(element.extraAttributes))
                          : undefined,
                      };
                      onElementsChange((currentElements) => {
                        const next = [...currentElements];
                        next.splice(index + 1, 0, duplicateElement);
                        return next;
                      });
                      setSelectedElementId(duplicateElement.id);
                    }}
                    onDelete={() => {
                      onElementsChange((currentElements) =>
                        currentElements.filter(({ id }) => id !== element.id),
                      );
                      setSelectedElementId((currentId) =>
                        currentId === element.id ? undefined : currentId,
                      );
                    }}
                  >
                    <DesignerComponent element={element} />
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
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Layers className="size-6" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                Canvas is empty
              </h3>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                Click any element in the sidebar to add it here, or drag it to
                a specific position.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Sidebar */}
      <DesignerSidebar
        layoutElements={LayoutElements}
        formElements={FormFieldElements}
        selectedElement={selectedElement}
        selectedInstance={selectedInstance}
        onAddElement={appendElement}
        onUpdateElement={(updatedElement) => {
          onElementsChange((currentElements) =>
            currentElements.map((element) =>
              element.id === updatedElement.id ? updatedElement : element,
            ),
          );
        }}
        onBack={() => setSelectedElementId(undefined)}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* DesignerFieldDropTarget                                              */
/* ------------------------------------------------------------------ */

interface DesignerFieldDropTargetProps {
  id: string;
  elementId: string;
  elementType: ElementsType;
  isSelected: boolean;
  onClick: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  children: ReactNode;
}

function DesignerFieldDropTarget({
  id,
  elementId,
  elementType,
  isSelected,
  onClick,
  onDuplicate,
  onDelete,
  children,
}: DesignerFieldDropTargetProps) {
  /**
   * We attach `useDraggable` to the grip handle only (via its own ref),
   * so the rest of the card is click-to-select, not drag-to-reorder.
   */
  const { isDragging, ref: gripRef } = useDraggable({
    id: `designer-existing-${elementId}`,
    data: {
      isExistingElement: true,
      elementId,
      type: elementType,
    },
  });
  const { isDropTarget, ref: dropRef } = useDroppable({ id });

  return (
    <div
      role="button"
      tabIndex={0}
      aria-roledescription="form field"
      aria-label={`${elementType} field — click to edit properties`}
      aria-describedby="designer-drag-instructions"
      className={cn(
        "group relative w-full cursor-pointer rounded-xl transition-all select-none",
        isDropTarget
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : isSelected
            ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-xs"
            : "hover:ring-1 hover:ring-primary/50",
        isDragging && "opacity-40",
      )}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      {/* Drop-before indicator */}
      {isDropTarget ? (
        <div className="pointer-events-none absolute -top-3 left-0 z-20 flex w-full items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
          <span className="h-0.5 flex-1 bg-primary/70" />
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-primary-foreground shadow-xs">
            Drop before
          </span>
          <span className="h-0.5 flex-1 bg-primary/70" />
        </div>
      ) : null}

      {/* Drop-target ref wrapper */}
      <div ref={dropRef}>{children}</div>

      {/* Drag grip handle — only this initiates dragging */}
      <div
        ref={gripRef}
        onClick={(e) => e.stopPropagation()}
        title="Drag to reorder"
        aria-label="Drag handle — drag to reorder this field"
        role="button"
        tabIndex={0}
        className={cn(
          "absolute left-2 top-1/2 z-20 -translate-y-1/2 cursor-grab touch-none rounded-md p-1 text-muted-foreground/40 opacity-0 transition-all",
          "group-hover:opacity-100 hover:bg-muted hover:text-muted-foreground active:cursor-grabbing",
        )}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <GripVertical className="size-4" />
      </div>

      {/* Action buttons — Duplicate + Delete */}
      <div className="absolute right-2 top-2 z-20 hidden items-center gap-0.5 rounded-lg border border-border/70 bg-card/95 p-0.5 shadow-2xs backdrop-blur-sm group-hover:flex">
        <button
          type="button"
          title="Duplicate"
          className="cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
        >
          <Copy className="size-3.5" />
        </button>
        <button
          type="button"
          title="Delete"
          className="cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export default Designer;
