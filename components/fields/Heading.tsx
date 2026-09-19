import { Heading1, Heading2 } from "lucide-react";

import { ElementsType, FormElement } from "../FormElements";
import { PropertiesGroup, TextProperty } from "./ElementProperties";

const h1Type: ElementsType = "H1";
const h2Type: ElementsType = "H2";

export const H1FormElement: FormElement = {
  type: h1Type,
  constuct: (id) => ({ id, type: h1Type, extraAttributes: { text: "Heading 1" } }),
  designerBtn: {
    icon: Heading1,
    label: "Heading 1",
  },
  designerComponent: ({ element }) => (
    <div className="w-full rounded-md border border-border/60 bg-card p-4 shadow-xs">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
        <Heading1 className="size-5 text-primary" />
        {String(element.extraAttributes?.text ?? "Heading 1")}
      </h1>
    </div>
  ),
  propertiesComponent: ({ element, updateElement }) => (
    <PropertiesGroup>
      <TextProperty element={element} updateElement={updateElement!} name="text" label="Heading text" />
    </PropertiesGroup>
  ),
  formComponent: () => <h1>Heading 1</h1>,
};

export const H2FormElement: FormElement = {
  type: h2Type,
  constuct: (id) => ({ id, type: h2Type, extraAttributes: { text: "Heading 2" } }),
  designerBtn: {
    icon: Heading2,
    label: "Heading 2",
  },
  designerComponent: ({ element }) => (
    <div className="w-full rounded-md border border-border/60 bg-card p-4 shadow-xs">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
        <Heading2 className="size-5 text-primary" />
        {String(element.extraAttributes?.text ?? "Heading 2")}
      </h2>
    </div>
  ),
  propertiesComponent: ({ element, updateElement }) => (
    <PropertiesGroup>
      <TextProperty element={element} updateElement={updateElement!} name="text" label="Heading text" />
    </PropertiesGroup>
  ),
  formComponent: () => <h2>Heading 2</h2>,
};
