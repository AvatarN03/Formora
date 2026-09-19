import {
    CalendarDays,
    CheckSquare,
    CircleDot,
    Hash,
    List,
    Minus,
    MoveVertical,
    Pilcrow,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { ElementsType, FormElement } from "../FormElements"
import { PropertiesGroup, TextProperty } from "./ElementProperties"

const createElement = (type: ElementsType) => (id: string) => ({ id, type })

const propertyPlaceholder = (label: string) => {
    const Properties = () => (
        <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">{label} properties</p>
            <p className="text-xs text-muted-foreground">Configure this element here.</p>
        </div>
    )

    Properties.displayName = `${label}Properties`
    return Properties
}

const fieldPreview = (icon: typeof CalendarDays, label: string, content: React.ReactNode) => {
    const Icon = icon
    return (
        <div className="w-full rounded-md border border-border/60 bg-card p-4 shadow-xs">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Icon className="size-4 text-primary" />
                <span>{label}</span>
            </div>
            {content}
        </div>
    )
}

export const ParagraphFormElement: FormElement = {
    type: "Paragraph",
    constuct: (id) => ({ id, type: "Paragraph", extraAttributes: { text: "Add supporting text to your form." } }),
    designerBtn: { icon: Pilcrow, label: "Paragraph" },
    designerComponent: ({ element }) => (
        <div className="w-full rounded-md border border-border/60 bg-card p-4 text-sm text-muted-foreground shadow-xs">
            {String(element.extraAttributes?.text ?? "Add supporting text to your form.")}
        </div>
    ),
    propertiesComponent: ({ element, updateElement }) => (
        <PropertiesGroup>
            <TextProperty element={element} updateElement={updateElement!} name="text" label="Paragraph text" />
        </PropertiesGroup>
    ),
    formComponent: () => <p>Add supporting text to your form.</p>,
}

export const SeparatorFormElement: FormElement = {
    type: "Separator",
    constuct: (id) => ({ id, type: "Separator", extraAttributes: { label: "" } }),
    designerBtn: { icon: Minus, label: "Separator" },
    designerComponent: ({ element }) => <div className="w-full rounded-md border border-border/60 bg-card p-4 shadow-xs"><hr className="border-border" />{element.extraAttributes?.label ? <p className="mt-2 text-center text-xs text-muted-foreground">{String(element.extraAttributes.label)}</p> : null}</div>,
    propertiesComponent: ({ element, updateElement }) => <PropertiesGroup><TextProperty element={element} updateElement={updateElement!} name="label" label="Label (optional)" /></PropertiesGroup>,
    formComponent: () => <hr />,
}

export const SpacerFormElement: FormElement = {
    type: "Spacer",
    constuct: (id) => ({ id, type: "Spacer", extraAttributes: { height: "64" } }),
    designerBtn: { icon: MoveVertical, label: "Space" },
    designerComponent: ({ element }) => <div style={{ height: `${Number(element.extraAttributes?.height ?? 64)}px` }} className="flex w-full items-center justify-center rounded-md border border-dashed border-border/60 bg-card text-xs text-muted-foreground shadow-xs">Space</div>,
    propertiesComponent: ({ element, updateElement }) => <PropertiesGroup><TextProperty element={element} updateElement={updateElement!} name="height" label="Height (px)" /></PropertiesGroup>,
    formComponent: () => <div className="h-16" />,
}

export const DatePickerFormElement: FormElement = {
    type: "DatePicker",
    constuct: createElement("DatePicker"),
    designerBtn: { icon: CalendarDays, label: "Date Picker" },
    designerComponent: () => fieldPreview(CalendarDays, "Date Picker", <Input placeholder="Select a date" disabled />),
    propertiesComponent: propertyPlaceholder("Date picker"),
    formComponent: () => <input type="date" />,
}

export const SelectFormElement: FormElement = {
    type: "Select",
    constuct: createElement("Select"),
    designerBtn: { icon: List, label: "Select" },
    designerComponent: () => fieldPreview(List, "Select", <Input placeholder="Choose an option" disabled />),
    propertiesComponent: propertyPlaceholder("Select"),
    formComponent: () => <select />,
}

export const NumberFieldFormElement: FormElement = {
    type: "NumberField",
    constuct: createElement("NumberField"),
    designerBtn: { icon: Hash, label: "Number Field" },
    designerComponent: () => fieldPreview(Hash, "Number Field", <Input type="number" placeholder="Enter a number" disabled />),
    propertiesComponent: propertyPlaceholder("Number field"),
    formComponent: () => <input type="number" />,
}

export const CheckboxFormElement: FormElement = {
    type: "Checkbox",
    constuct: createElement("Checkbox"),
    designerBtn: { icon: CheckSquare, label: "Checkbox" },
    designerComponent: () => fieldPreview(CheckSquare, "Checkbox", <label className="flex items-center gap-2 text-sm"><input type="checkbox" disabled /> Check this option</label>),
    propertiesComponent: propertyPlaceholder("Checkbox"),
    formComponent: () => <input type="checkbox" />,
}

export const RadioFormElement: FormElement = {
    type: "Radio",
    constuct: createElement("Radio"),
    designerBtn: { icon: CircleDot, label: "Radio" },
    designerComponent: () => fieldPreview(CircleDot, "Radio", <label className="flex items-center gap-2 text-sm"><input type="radio" disabled /> Choose this option</label>),
    propertiesComponent: propertyPlaceholder("Radio"),
    formComponent: () => <input type="radio" />,
}