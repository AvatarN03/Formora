"use client";

import type {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "@/components/builder/FormElements";
import DesignerSidebarElement from "@/components/builder/DesignerSidebarElement";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DesignerSidebarProps {
  layoutElements: FormElement[];
  formElements: FormElement[];
  selectedElement?: FormElement;
  selectedInstance?: FormElementInstance;
  onAddElement: (type: ElementsType) => void;
  onUpdateElement: (element: FormElementInstance) => void;
  onBack: () => void;
}

const DesignerSidebar = ({
  layoutElements,
  formElements,
  selectedElement,
  selectedInstance,
  onAddElement,
  onUpdateElement,
  onBack,
}: DesignerSidebarProps) => {
  if (selectedElement) {
    const PropertiesComponent = selectedElement.propertiesComponent;

    return (
      <aside className="flex min-h-[640px] h-full w-full max-w-[360px] shrink-0 flex-col gap-5 overflow-y-auto rounded-2xl border border-border/70 bg-card p-5 shadow-xs lg:min-h-[820px]">
        <Button
          type="button"
          variant="ghost"
          className="w-fit gap-2 px-0 text-xs font-semibold text-muted-foreground hover:bg-transparent hover:text-foreground"
          onClick={onBack}
        >
          <ArrowLeft className="size-3.5" />
          Back to element library
        </Button>

        <div className="border-b border-border/60 pb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <SlidersHorizontal className="size-3.5" />
            <span>Element Properties</span>
          </div>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-foreground">
            {selectedElement.designerBtn.label}
          </h3>
          <p className="text-xs text-muted-foreground">
            Customize the settings and validation for this field.
          </p>
        </div>

        {selectedInstance ? (
          <PropertiesComponent
            element={selectedInstance}
            updateElement={onUpdateElement}
          />
        ) : null}
      </aside>
    );
  }

  const renderElements = (elements: FormElement[]) => (
    <div className="grid grid-cols-2 gap-2.5">
      {elements.map((formElement) => (
        <DesignerSidebarElement
          key={formElement.type}
          formElement={formElement}
          onAdd={() => onAddElement(formElement.type)}
        />
      ))}
    </div>
  );

  return (
    <aside className="flex min-h-[640px] h-full w-full max-w-[360px] shrink-0 flex-col gap-6 overflow-y-auto rounded-2xl border border-border/70 bg-card p-5 shadow-xs lg:min-h-[820px]">
      <div className="border-b border-border/60 pb-3">
        <h3 className="text-base font-bold tracking-tight text-foreground">
          Element Library
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Click</span> to add to canvas ·{" "}
          <span className="font-medium text-foreground">Drag</span> to place precisely
        </p>
      </div>

      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Layout Elements
          </h4>
          <span className="text-[11px] text-muted-foreground/60">
            {layoutElements.length}
          </span>
        </div>
        {renderElements(layoutElements)}
      </section>

      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Form Fields
          </h4>
          <span className="text-[11px] text-muted-foreground/60">
            {formElements.length}
          </span>
        </div>
        {renderElements(formElements)}
      </section>
    </aside>
  );
};

export default DesignerSidebar;
