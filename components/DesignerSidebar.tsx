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
      <aside className="builder-rail flex min-h-[600px] h-full w-full max-w-[360px] shrink-0 flex-col gap-5 overflow-y-auto border border-[var(--builder-line)] bg-[var(--builder-paper)] p-5 lg:min-h-[800px]">
      <Button type="button" variant="ghost" className="builder-muted w-fit gap-2 px-0 text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-transparent hover:text-[var(--builder-signal)]" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back to elements
        </Button>
        <div>
          <p className="builder-signal text-[10px] font-bold uppercase tracking-[0.18em]">Properties</p>
          <h3 className="builder-ink mt-2 text-xl font-bold tracking-[-0.04em]">{selectedElement.designerBtn.label}</h3>
          <p className="builder-muted mt-1 text-xs">Edit field properties</p>
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
    <aside className="builder-rail flex min-h-[600px] h-full w-full max-w-[360px] shrink-0 flex-col gap-5 overflow-y-auto border border-[var(--builder-line)] bg-[var(--builder-paper)] p-5 lg:min-h-[800px]">
      <div>
        <p className="builder-signal text-[10px] font-bold uppercase tracking-[0.18em]">Library / 02</p>
        <h3 className="builder-ink mt-2 text-2xl font-bold tracking-[-0.05em]">Elements</h3>
        <p className="builder-muted mt-1 text-xs">Drag a field onto the canvas.</p>
      </div>
      <section className="space-y-2">
        <h4 className="builder-muted text-[10px] font-bold uppercase tracking-[0.18em]">01 / Layout</h4>
        {renderElements(layoutElements)}
      </section>
      <section className="space-y-2">
        <h4 className="builder-muted text-[10px] font-bold uppercase tracking-[0.18em]">02 / Form fields</h4>
        {renderElements(formElements)}
      </section>
    </aside>
  );
};

export default DesignerSidebar;