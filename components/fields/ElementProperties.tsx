"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { FormElementInstance } from "../FormElements";

export function updateAttributes(
  element: FormElementInstance,
  updateElement: (element: FormElementInstance) => void,
  attributes: Record<string, unknown>,
) {
  updateElement({
    ...element,
    extraAttributes: {
      ...element.extraAttributes,
      ...attributes,
    },
  });
}

export function TextProperty({
  element,
  updateElement,
  name,
  label,
  placeholder,
  description,
}: {
  element: FormElementInstance;
  updateElement: (element: FormElementInstance) => void;
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
}) {
  const value = String(element.extraAttributes?.[name] ?? "");

  return (
    <div className="space-y-1.5">
      <Label htmlFor={`${element.id}-${name}`} className="text-xs font-semibold text-foreground">
        {label}
      </Label>
      <Input
        id={`${element.id}-${name}`}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          updateAttributes(element, updateElement, { [name]: event.target.value })
        }
        className="h-9 rounded-lg border-border/70 bg-background text-sm shadow-2xs"
      />
      {description ? (
        <p className="text-[11px] text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function NumberProperty({
  element,
  updateElement,
  name,
  label,
  placeholder,
  min,
  max,
}: {
  element: FormElementInstance;
  updateElement: (element: FormElementInstance) => void;
  name: string;
  label: string;
  placeholder?: string;
  min?: number;
  max?: number;
}) {
  const value = String(element.extraAttributes?.[name] ?? "");

  return (
    <div className="space-y-1.5">
      <Label htmlFor={`${element.id}-${name}`} className="text-xs font-semibold text-foreground">
        {label}
      </Label>
      <Input
        id={`${element.id}-${name}`}
        type="number"
        min={min}
        max={max}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          updateAttributes(element, updateElement, { [name]: event.target.value })
        }
        className="h-9 rounded-lg border-border/70 bg-background text-sm shadow-2xs"
      />
    </div>
  );
}

export function RequiredProperty({
  element,
  updateElement,
}: {
  element: FormElementInstance;
  updateElement: (element: FormElementInstance) => void;
}) {
  const required = Boolean(element.extraAttributes?.required);

  return (
    <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 p-3">
      <div className="space-y-0.5">
        <span className="text-xs font-semibold text-foreground">Required field</span>
        <p className="text-[11px] text-muted-foreground">User cannot submit form without filling this</p>
      </div>
      <input
        type="checkbox"
        id={`${element.id}-required`}
        checked={required}
        onChange={(event) =>
          updateAttributes(element, updateElement, { required: event.target.checked })
        }
        className="size-4 cursor-pointer rounded border-border/70 text-primary accent-primary"
      />
    </div>
  );
}

export function OptionsProperty({
  element,
  updateElement,
}: {
  element: FormElementInstance;
  updateElement: (element: FormElementInstance) => void;
}) {
  const rawOptions = element.extraAttributes?.options;
  const options =
    Array.isArray(rawOptions) && rawOptions.every((opt) => typeof opt === "string")
      ? (rawOptions as string[])
      : ["Option 1", "Option 2"];

  const [newOption, setNewOption] = useState("");

  const addOption = () => {
    const trimmed = newOption.trim();
    if (!trimmed) return;
    const nextOptions = [...options, trimmed];
    updateAttributes(element, updateElement, { options: nextOptions });
    setNewOption("");
  };

  const removeOption = (indexToRemove: number) => {
    if (options.length <= 1) return;
    const nextOptions = options.filter((_, idx) => idx !== indexToRemove);
    updateAttributes(element, updateElement, { options: nextOptions });
  };

  const updateOptionText = (indexToUpdate: number, text: string) => {
    const nextOptions = options.map((opt, idx) => (idx === indexToUpdate ? text : opt));
    updateAttributes(element, updateElement, { options: nextOptions });
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-foreground">Options</Label>
        <span className="text-[11px] text-muted-foreground">{options.length} options</span>
      </div>

      <div className="space-y-1.5">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <Input
              value={option}
              onChange={(e) => updateOptionText(index, e.target.value)}
              className="h-8 rounded-lg border-border/70 bg-background text-xs shadow-2xs"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={options.length <= 1}
              onClick={() => removeOption(index)}
              className="size-8 shrink-0 rounded-lg p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
              aria-label="Remove option"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 pt-1">
        <Input
          placeholder="New option name..."
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addOption();
            }
          }}
          className="h-8 rounded-lg border-border/70 bg-background text-xs shadow-2xs"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addOption}
          className="h-8 shrink-0 gap-1 rounded-lg border-border/70 px-2.5 text-xs font-medium hover:border-primary hover:text-primary"
        >
          <Plus className="size-3.5" />
          <span>Add</span>
        </Button>
      </div>
    </div>
  );
}

export function PropertiesGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}
