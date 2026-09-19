"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
}: {
  element: FormElementInstance;
  updateElement: (element: FormElementInstance) => void;
  name: string;
  label: string;
  placeholder?: string;
}) {
  const value = String(element.extraAttributes?.[name] ?? "");

  return (
    <div className="space-y-2">
      <Label htmlFor={`${element.id}-${name}`}>{label}</Label>
      <Input
        id={`${element.id}-${name}`}
        value={value}
        placeholder={placeholder}
        onChange={(event) => updateAttributes(element, updateElement, { [name]: event.target.value })}
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
    <label className="flex items-center gap-2 text-sm text-foreground">
      <input
        type="checkbox"
        checked={required}
        onChange={(event) => updateAttributes(element, updateElement, { required: event.target.checked })}
      />
      Required
    </label>
  );
}

export function PropertiesGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}
