"use client";

import { Text } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ElementsType, FormElement } from "../FormElements";

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

    designerComponent: () => (
        <div className="w-full rounded-md border border-border/60 bg-card p-4 shadow-xs">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Text className="size-4 text-primary" />
                <span>Text Field</span>
            </div>
            <Input placeholder="Enter text" disabled />
        </div>
    ),
    propertiesComponent: () => <div>TextField Properties</div>,
    formComponent: () => <div>TextField Form</div>
}