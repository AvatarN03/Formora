import type { LucideIcon } from "lucide-react"

import { H1FormElement, H2FormElement } from "./fields/Heading"
import {
    CheckboxFormElement,
    DatePickerFormElement,
    NumberFieldFormElement,
    ParagraphFormElement,
    RadioFormElement,
    SelectFormElement,
    SeparatorFormElement,
    SpacerFormElement,
} from "./fields/Basic"
import { TextFieldFormElement } from "./fields/TextField"

export type ElementsType =
    | "TextField"
    | "H1"
    | "H2"
    | "Paragraph"
    | "Separator"
    | "Spacer"
    | "DatePicker"
    | "Select"
    | "NumberField"
    | "Checkbox"
    | "Radio"

export type FormElementInstance = {
    id: string
    type: ElementsType
    extraAttributes?: Record<string, unknown>
}

export type ElementComponentProps = {
    element: FormElementInstance
    updateElement?: (element: FormElementInstance) => void
}

export type FormElement = {
    type: ElementsType

    constuct: (id:string) => FormElementInstance

    designerBtn : {
        icon: LucideIcon,
        label: string
    }

    designerComponent: React.FC<ElementComponentProps>
    propertiesComponent: React.FC<ElementComponentProps>
    formComponent: React.FC
}

type FormElementType = {
    [key in ElementsType]: FormElement
}

export const FormElements: FormElementType = {
    TextField: TextFieldFormElement,
    H1: H1FormElement,
    H2: H2FormElement,
    Paragraph: ParagraphFormElement,
    Separator: SeparatorFormElement,
    Spacer: SpacerFormElement,
    DatePicker: DatePickerFormElement,
    Select: SelectFormElement,
    NumberField: NumberFieldFormElement,
    Checkbox: CheckboxFormElement,
    Radio: RadioFormElement,
}

export const LayoutElements: FormElement[] = [
    FormElements.H1,
    FormElements.H2,
    FormElements.Paragraph,
    FormElements.Separator,
    FormElements.Spacer,
]

export const FormFieldElements: FormElement[] = [
    FormElements.TextField,
    FormElements.DatePicker,
    FormElements.Select,
    FormElements.NumberField,
    FormElements.Checkbox,
    FormElements.Radio,
]
