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
  Tag,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export const LabelFormElement: FormElement = {
  type: "Label",
  constuct: (id) => ({
    id,
    type: "Label",
    extraAttributes: {
      text: "Label Text",
      helperText: "",
      required: false,
    },
  }),
  designerBtn: { icon: Tag, label: "Label" },
  designerComponent: ({ element }) => {
    const text = String(element.extraAttributes?.text ?? "Label Text");
    const helperText = String(element.extraAttributes?.helperText ?? "");
    const required = Boolean(element.extraAttributes?.required);

    return (
      <div className="w-full rounded-xl border border-border/70 bg-card/90 p-4 shadow-2xs">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Tag className="size-4 text-primary" />
          <span>{text}</span>
          {required ? <span className="text-primary">*</span> : null}
        </div>
        {helperText ? (
          <p className="mt-1 text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    );
  },
  propertiesComponent: ({ element, updateElement }) => (
    <PropertiesGroup>
      <TextProperty
        element={element}
        updateElement={updateElement!}
        name="text"
        label="Label text"
      />
      <TextProperty
        element={element}
        updateElement={updateElement!}
        name="helperText"
        label="Helper text / Description (optional)"
      />
      <RequiredProperty element={element} updateElement={updateElement!} />
    </PropertiesGroup>
  ),
  formComponent: () => <label>Label Text</label>,
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
          type="date"
          placeholder="Pick a date"
          className="cursor-pointer rounded-lg border-border/70 bg-background/50 text-foreground"
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

        {/* Real interactive select dropdown */}
        <div className="relative">
          <Select defaultValue="">
            <SelectTrigger className="h-10 w-full rounded-lg border-border/70 bg-background/60 text-foreground">
              <SelectValue placeholder={`Choose an option (${options.length} available)...`} />
            </SelectTrigger>
            <SelectContent>
            {options.map((option, idx) => (
              <SelectItem key={`${idx}-${option}`} value={option}>
                {option}
              </SelectItem>
            ))}
            </SelectContent>
          </Select>
        </div>

        {/* Options Preview Pills / Badges */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-muted-foreground">
            Options preview:
          </span>
          {options.map((option, idx) => (
            <span
              key={idx}
              className="inline-flex items-center rounded-md border border-border/70 bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-foreground shadow-2xs"
            >
              {option}
            </span>
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
          className="cursor-text rounded-lg border-border/70 bg-background/50 text-foreground"
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
      label: "Checkbox Options",
      helperText: "Select one or more",
      required: false,
      options: ["Option 1", "Option 2"],
    },
  }),
  designerBtn: { icon: CheckSquare, label: "Checkbox" },
  designerComponent: ({ element }) => {
    const label = String(
      element.extraAttributes?.label ?? "Checkbox Options",
    );
    const helperText = String(element.extraAttributes?.helperText ?? "");
    const required = Boolean(element.extraAttributes?.required);
    const rawOptions = element.extraAttributes?.options;
    const hasOptions = Array.isArray(rawOptions) && rawOptions.length > 0;
    const options = hasOptions ? (rawOptions as string[]) : [];

    return (
      <div className="w-full rounded-xl border border-border/70 bg-card/90 p-4 shadow-2xs">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
          <CheckSquare className="size-4 text-primary" />
          <span>{label}</span>
          {required ? <span className="text-primary">*</span> : null}
        </div>

        {hasOptions ? (
          <div className="space-y-1.5 pl-6">
            {options.map((option, idx) => (
              <label
                key={idx}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1 text-sm text-foreground transition-colors hover:bg-muted/40"
              >
                <Checkbox name={`checkbox-designer-${element.id}`} aria-label={option} />
                <span>{option}</span>
              </label>
            ))}
            {/* Options Preview Badges */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-muted-foreground">
                Options preview:
              </span>
              {options.map((option, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-md border border-border/70 bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-foreground shadow-2xs"
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <label className="flex cursor-pointer items-center gap-2.5 pl-6 text-sm font-medium text-foreground">
            <Checkbox aria-label={label} />
            <span>{label}</span>
          </label>
        )}

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
        <RadioGroup className="space-y-1.5 pl-6">
          {options.map((option, idx) => (
            <label
              key={idx}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1 text-sm text-foreground transition-colors hover:bg-muted/40"
            >
              <RadioGroupItem value={option} aria-label={option} />
              <span>{option}</span>
            </label>
          ))}
        </RadioGroup>

        {/* Options Preview Badges */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pl-6">
          <span className="text-[11px] font-medium text-muted-foreground">
            Options preview:
          </span>
          {options.map((option, idx) => (
            <span
              key={idx}
              className="inline-flex items-center rounded-md border border-border/70 bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-foreground shadow-2xs"
            >
              {option}
            </span>
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
