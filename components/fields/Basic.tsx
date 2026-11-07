"use client";

import {
  CalendarDays,
  CheckSquare,
  CircleDot,
  Hash,
  List,
  Minus,
  MoveVertical,
  Pilcrow,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import type { FormElement, FormElementInstance } from "../FormElements";
import {
  OptionsProperty,
  PropertiesGroup,
  RequiredProperty,
  TextProperty,
} from "./ElementProperties";

function readOptions(element: FormElementInstance): string[] {
  const value = element.extraAttributes?.options;
  return Array.isArray(value) && value.every((opt) => typeof opt === "string")
    ? value
    : ["Option 1", "Option 2"];
}

export const ParagraphFormElement: FormElement = {
  type: "Paragraph",
  constuct: (id) => ({
    id,
    type: "Paragraph",
    extraAttributes: { text: "Add supporting text to your form." },
  }),
  designerBtn: { icon: Pilcrow, label: "Paragraph" },
  designerComponent: ({ element }) => (
    <div className="w-full rounded-xl border border-border/70 bg-card/90 p-4 text-sm leading-relaxed text-muted-foreground shadow-2xs">
      {String(
        element.extraAttributes?.text ?? "Add supporting text to your form.",
      )}
    </div>
  ),
  propertiesComponent: ({ element, updateElement }) => (
    <PropertiesGroup>
      <TextProperty
        element={element}
        updateElement={updateElement!}
        name="text"
        label="Paragraph text"
      />
    </PropertiesGroup>
  ),
  formComponent: () => <p>Add supporting text to your form.</p>,
};

export const SeparatorFormElement: FormElement = {
  type: "Separator",
  constuct: (id) => ({
    id,
    type: "Separator",
    extraAttributes: { label: "" },
  }),
  designerBtn: { icon: Minus, label: "Separator" },
  designerComponent: ({ element }) => (
    <div className="w-full rounded-xl border border-border/70 bg-card/90 p-4 shadow-2xs">
      <hr className="border-border/70" />
      {element.extraAttributes?.label ? (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {String(element.extraAttributes.label)}
        </p>
      ) : null}
    </div>
  ),
  propertiesComponent: ({ element, updateElement }) => (
    <PropertiesGroup>
      <TextProperty
        element={element}
        updateElement={updateElement!}
        name="label"
        label="Label (optional)"
      />
    </PropertiesGroup>
  ),
  formComponent: () => <hr />,
};

export const SpacerFormElement: FormElement = {
  type: "Spacer",
  constuct: (id) => ({
    id,
    type: "Spacer",
    extraAttributes: { height: "64" },
  }),
  designerBtn: { icon: MoveVertical, label: "Space" },
  designerComponent: ({ element }) => (
    <div
      style={{ height: `${Number(element.extraAttributes?.height ?? 64)}px` }}
      className="flex w-full items-center justify-center rounded-xl border border-dashed border-border/70 bg-card/50 text-xs text-muted-foreground shadow-2xs"
    >
      Spacer ({Number(element.extraAttributes?.height ?? 64)}px)
    </div>
  ),
  propertiesComponent: ({ element, updateElement }) => (
    <PropertiesGroup>
      <TextProperty
        element={element}
        updateElement={updateElement!}
        name="height"
        label="Height (px)"
      />
    </PropertiesGroup>
  ),
  formComponent: () => <div className="h-16" />,
};

export const DatePickerFormElement: FormElement = {
  type: "DatePicker",
  constuct: (id) => ({
    id,
    type: "DatePicker",
    extraAttributes: {
      label: "Date Picker",
      helperText: "Pick a date",
      required: false,
    },
  }),
  designerBtn: { icon: CalendarDays, label: "Date Picker" },
  designerComponent: ({ element }) => {
    const label = String(element.extraAttributes?.label ?? "Date Picker");
    const helperText = String(element.extraAttributes?.helperText ?? "");
    const required = Boolean(element.extraAttributes?.required);

    return (
      <div className="w-full rounded-xl border border-border/70 bg-card/90 p-4 shadow-2xs">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
          <CalendarDays className="size-4 text-primary" />
          <span>{label}</span>
          {required ? <span className="text-primary">*</span> : null}
        </div>
        <Input
          placeholder="Pick a date"
          disabled
          className="rounded-lg border-border/70 bg-background/50"
        />
        {helperText ? (
          <p className="mt-2 text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    );
  },
  propertiesComponent: ({ element, updateElement }) => (
    <PropertiesGroup>
      <TextProperty
        element={element}
        updateElement={updateElement!}
        name="label"
        label="Label"
      />
      <TextProperty
        element={element}
        updateElement={updateElement!}
        name="helperText"
        label="Helper text"
      />
      <RequiredProperty element={element} updateElement={updateElement!} />
    </PropertiesGroup>
  ),
  formComponent: () => <input type="date" />,
};

export const SelectFormElement: FormElement = {
  type: "Select",
  constuct: (id) => ({
    id,
    type: "Select",
    extraAttributes: {
      label: "Dropdown Select",
      helperText: "Choose one option",
      required: false,
      options: ["Option 1", "Option 2"],
    },
  }),
  designerBtn: { icon: List, label: "Select" },
  designerComponent: ({ element }) => {
    const label = String(element.extraAttributes?.label ?? "Dropdown Select");
    const helperText = String(element.extraAttributes?.helperText ?? "");
    const required = Boolean(element.extraAttributes?.required);
    const options = readOptions(element);

    return (
      <div className="w-full rounded-xl border border-border/70 bg-card/90 p-4 shadow-2xs">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
          <List className="size-4 text-primary" />
          <span>{label}</span>
          {required ? <span className="text-primary">*</span> : null}
        </div>
        <div className="flex h-9 items-center justify-between rounded-lg border border-border/70 bg-background/50 px-3 text-xs text-muted-foreground">
          <span>Choose an option ({options.length} available)</span>
          <span className="text-[10px]">▼</span>
        </div>
        {helperText ? (
          <p className="mt-2 text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    );
  },
  propertiesComponent: ({ element, updateElement }) => (
    <PropertiesGroup>
      <TextProperty
        element={element}
        updateElement={updateElement!}
        name="label"
        label="Label"
      />
      <TextProperty
        element={element}
        updateElement={updateElement!}
        name="helperText"
        label="Helper text"
      />
      <RequiredProperty element={element} updateElement={updateElement!} />
      <OptionsProperty element={element} updateElement={updateElement!} />
    </PropertiesGroup>
  ),
  formComponent: () => <select />,
};

export const NumberFieldFormElement: FormElement = {
  type: "NumberField",
  constuct: (id) => ({
    id,
    type: "NumberField",
    extraAttributes: {
      label: "Number Field",
      placeholder: "Enter number...",
      helperText: "",
      required: false,
    },
  }),
  designerBtn: { icon: Hash, label: "Number Field" },
  designerComponent: ({ element }) => {
    const label = String(element.extraAttributes?.label ?? "Number Field");
    const placeholder = String(
      element.extraAttributes?.placeholder ?? "Enter number...",
    );
    const helperText = String(element.extraAttributes?.helperText ?? "");
    const required = Boolean(element.extraAttributes?.required);

    return (
      <div className="w-full rounded-xl border border-border/70 bg-card/90 p-4 shadow-2xs">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
          <Hash className="size-4 text-primary" />
          <span>{label}</span>
          {required ? <span className="text-primary">*</span> : null}
        </div>
        <Input
          type="number"
          placeholder={placeholder}
          disabled
          className="rounded-lg border-border/70 bg-background/50"
        />
        {helperText ? (
          <p className="mt-2 text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    );
  },
  propertiesComponent: ({ element, updateElement }) => (
    <PropertiesGroup>
      <TextProperty
        element={element}
        updateElement={updateElement!}
        name="label"
        label="Label"
      />
      <TextProperty
        element={element}
        updateElement={updateElement!}
        name="placeholder"
        label="Placeholder"
      />
      <TextProperty
        element={element}
        updateElement={updateElement!}
        name="helperText"
        label="Helper text"
      />
      <RequiredProperty element={element} updateElement={updateElement!} />
    </PropertiesGroup>
  ),
  formComponent: () => <input type="number" />,
};

export const CheckboxFormElement: FormElement = {
  type: "Checkbox",
  constuct: (id) => ({
    id,
    type: "Checkbox",
    extraAttributes: {
      label: "I agree to the terms and conditions",
      helperText: "",
      required: false,
    },
  }),
  designerBtn: { icon: CheckSquare, label: "Checkbox" },
  designerComponent: ({ element }) => {
    const label = String(
      element.extraAttributes?.label ??
        "I agree to the terms and conditions",
    );
    const helperText = String(element.extraAttributes?.helperText ?? "");
    const required = Boolean(element.extraAttributes?.required);

    return (
      <div className="w-full rounded-xl border border-border/70 bg-card/90 p-4 shadow-2xs">
        <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
          <CheckSquare className="size-4 text-primary" />
          <input
            type="checkbox"
            disabled
            className="size-4 rounded border-border/70"
          />
          <span>{label}</span>
          {required ? <span className="text-primary">*</span> : null}
        </div>
        {helperText ? (
          <p className="mt-2 text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    );
  },
  propertiesComponent: ({ element, updateElement }) => (
    <PropertiesGroup>
      <TextProperty
        element={element}
        updateElement={updateElement!}
        name="label"
        label="Label"
      />
      <TextProperty
        element={element}
        updateElement={updateElement!}
        name="helperText"
        label="Helper text"
      />
      <RequiredProperty element={element} updateElement={updateElement!} />
    </PropertiesGroup>
  ),
  formComponent: () => <input type="checkbox" />,
};

export const RadioFormElement: FormElement = {
  type: "Radio",
  constuct: (id) => ({
    id,
    type: "Radio",
    extraAttributes: {
      label: "Select an Option",
      helperText: "Choose one",
      required: false,
      options: ["Option 1", "Option 2"],
    },
  }),
  designerBtn: { icon: CircleDot, label: "Radio" },
  designerComponent: ({ element }) => {
    const label = String(
      element.extraAttributes?.label ?? "Select an Option",
    );
    const helperText = String(element.extraAttributes?.helperText ?? "");
    const required = Boolean(element.extraAttributes?.required);
    const options = readOptions(element);

    return (
      <div className="w-full rounded-xl border border-border/70 bg-card/90 p-4 shadow-2xs">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
          <CircleDot className="size-4 text-primary" />
          <span>{label}</span>
          {required ? <span className="text-primary">*</span> : null}
        </div>
        <div className="space-y-1.5 pl-6">
          {options.map((option, idx) => (
            <label
              key={idx}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <input
                type="radio"
                disabled
                className="size-3.5 text-primary"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {helperText ? (
          <p className="mt-2 text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    );
  },
  propertiesComponent: ({ element, updateElement }) => (
    <PropertiesGroup>
      <TextProperty
        element={element}
        updateElement={updateElement!}
        name="label"
        label="Label"
      />
      <TextProperty
        element={element}
        updateElement={updateElement!}
        name="helperText"
        label="Helper text"
      />
      <RequiredProperty element={element} updateElement={updateElement!} />
      <OptionsProperty element={element} updateElement={updateElement!} />
    </PropertiesGroup>
  ),
  formComponent: () => <input type="radio" />,
};
