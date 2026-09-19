import { LucideIcon } from "lucide-react"
import { H1FormElement, H2FormElement } from "./fields/Heading"
import { TextFieldFormElement } from "./fields/TextField"

export type ElementsType = 'TextField' | 'H1' | 'H2'


export type FormElement = {
    type: ElementsType

    constuct: (id:string) => FormElementInstance

    designerBtn : {
        icon: LucideIcon,
        label: string
    }

    designerComponent: React.FC
    propertiesComponent: React.FC
    formComponent: React.FC
}

export type FormElementInstance = {
    id: string
    type: ElementsType
    extraAttributes?: Record<string, unknown>
}

type FormElementType = {
    [key in ElementsType]: FormElement
}

export const FormElements: FormElementType = {
    TextField: TextFieldFormElement,
    H1: H1FormElement,
    H2: H2FormElement,
}
