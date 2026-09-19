import type { FormElement } from "@/components/FormElements";
import DesignerSidebarElement from "@/components/DesignerSidebarElement";

interface DesignerSidebarProps {
  formElements: FormElement[];
}

const DesignerSidebar = ({ formElements }: DesignerSidebarProps) => {
  return (
    <aside className="flex h-full w-full max-w-94 grow flex-col gap-3 overflow-y-auto border-l-2 border-muted bg-background p-4">
      <h3 className="text-sm font-medium text-foreground">Elements</h3>
      <div className="grid grid-cols-2 gap-2">
        {formElements.map((formElement) => (
          <DesignerSidebarElement key={formElement.type} formElement={formElement} />
        ))}
      </div>
    </aside>
  );
};

export default DesignerSidebar;