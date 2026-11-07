"use client";

import { Text } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ElementsType, FormElement } from "../FormElements";
import { PropertiesGroup, RequiredProperty, TextProperty } from "./ElementProperties";

const type: ElementsType = 'TextField';

export const TextFieldFormElement: FormElement = {
    type,

    constuct: (id: string) => ({
        id,
        type,
        extraAttributes: {
            label: "Text Field",
            placeholder: "Enter text",
            required: false,
            helperText: "This is a text field",
        }
    }),

    designerBtn: {
        icon: Text,
        label: "Text Field"
    },

    designerComponent: ({ element }) => (
        <div className="w-full rounded-xl border border-border/70 bg-card/90 p-4 shadow-2xs">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Text className="size-4 text-primary" />
                <span>{String(element.extraAttributes?.label ?? "Text Field")}</span>
                {element.extraAttributes?.required ? <span className="text-primary">*</span> : null}
            </div>
            <Input
                placeholder={String(element.extraAttributes?.placeholder ?? "Enter text")}
                className="cursor-text rounded-lg border-border/70 bg-background/50 text-foreground"
            />
            {element.extraAttributes?.helperText ? (
                <p className="mt-2 text-xs text-muted-foreground">{String(element.extraAttributes.helperText)}</p>
            ) : null}
        </div>
    ),
    propertiesComponent: ({ element, updateElement }) => (
        <PropertiesGroup>
            <TextProperty element={element} updateElement={updateElement!} name="label" label="Label" />
            <TextProperty element={element} updateElement={updateElement!} name="placeholder" label="Placeholder" />
            <TextProperty element={element} updateElement={updateElement!} name="helperText" label="Helper text" />
            <RequiredProperty element={element} updateElement={updateElement!} />
        </PropertiesGroup>
    ),
    formComponent: () => <div>TextField Form</div>
}