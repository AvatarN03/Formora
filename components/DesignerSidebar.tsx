import type { FormElement, FormElementInstance } from "@/components/FormElements";
import DesignerSidebarElement from "@/components/DesignerSidebarElement";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DesignerSidebarProps {
  layoutElements: FormElement[];
  formElements: FormElement[];
  selectedElement?: FormElement;
  selectedInstance?: FormElementInstance;
  onUpdateElement: (element: FormElementInstance) => void;
  onBack: () => void;
}

const DesignerSidebar = ({
  layoutElements,
  formElements,
  selectedElement,
  selectedInstance,
  onUpdateElement,
  onBack,
}: DesignerSidebarProps) => {
  if (selectedElement) {
    const PropertiesComponent = selectedElement.propertiesComponent;

    return (
      <aside className="flex h-full w-full max-w-94 grow flex-col gap-4 overflow-y-auto border-l-2 border-muted bg-background p-4">
        <Button type="button" variant="ghost" className="w-fit gap-2 px-2" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back to elements
        </Button>
        <div>
          <h3 className="text-sm font-medium text-foreground">{selectedElement.designerBtn.label}</h3>
          <p className="mt-1 text-xs text-muted-foreground">Edit element properties</p>
        </div>
        {selectedInstance ? (
          <PropertiesComponent element={selectedInstance} updateElement={onUpdateElement} />
        ) : null}
      </aside>
    );
  }

  const renderElements = (elements: FormElement[]) => (
    <div className="grid grid-cols-2 gap-2">
      {elements.map((formElement) => (
        <DesignerSidebarElement key={formElement.type} formElement={formElement} />
      ))}
    </div>
  );

  return (
    <aside className="flex h-full w-full max-w-94 grow flex-col gap-3 overflow-y-auto border-l-2 border-muted bg-background p-4">
      <h3 className="text-sm font-medium text-foreground">Elements</h3>
      <section className="space-y-2">
        <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Layout</h4>
        {renderElements(layoutElements)}
      </section>
      <section className="space-y-2">
        <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Form elements</h4>
        {renderElements(formElements)}
      </section>
    </aside>
  );
};

export default DesignerSidebar;