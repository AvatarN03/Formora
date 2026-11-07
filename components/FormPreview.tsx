"use client";

import type { Form } from "@prisma/client";
import { ArrowLeft, CheckSquare, CircleDot, Hash, List, Tag } from "lucide-react";

import type { FormElementInstance } from "@/components/FormElements";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function readText(element: FormElementInstance, key: string, fallback: string) {
  const value = element.extraAttributes?.[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function readOptions(element: FormElementInstance) {
  const value = element.extraAttributes?.options;
  return Array.isArray(value) && value.every((option) => typeof option === "string")
    ? value
    : ["Option one", "Option two"];
}

function PreviewElement({ element }: { element: FormElementInstance }) {
  const label = readText(element, "label", "Untitled field");
  const required = Boolean(element.extraAttributes?.required);

  switch (element.type) {
    case "H1":
      return (
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {readText(element, "text", "Form heading")}
        </h1>
      );
    case "H2":
      return (
        <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {readText(element, "text", "Section heading")}
        </h2>
      );
    case "Paragraph":
      return (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {readText(element, "text", "Add supporting text to your form.")}
        </p>
      );
    case "Label":
      return (
        <div className="space-y-1">
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Tag className="size-3.5 text-primary" />
            <span>{readText(element, "text", "Label text")}</span>
            {required ? <span className="text-primary">*</span> : null}
          </span>
          {element.extraAttributes?.helperText ? (
            <p className="text-xs text-muted-foreground">
              {readText(element, "helperText", "")}
            </p>
          ) : null}
        </div>
      );
    case "Separator":
      return <hr className="border-border/70" />;
    case "Spacer":
      return (
        <div
          style={{ height: `${Number(element.extraAttributes?.height ?? 64)}px` }}
          aria-hidden="true"
        />
      );
    case "DatePicker":
      return (
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="text-foreground">{label}</span>
          <input
            type="date"
            required={required}
            className="h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-normal text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
      );
    case "Select": {
      const options = readOptions(element);
      return (
        <div className="space-y-2">
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="text-foreground">{label}</span>
            <span className="flex items-center gap-2">
              <List className="size-4 text-primary" />
              <Select defaultValue="">
                <SelectTrigger className="h-10 min-w-0 flex-1 rounded-lg border-border/70 bg-background text-foreground">
                  <SelectValue placeholder="Choose an option..." />
                </SelectTrigger>
                <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
                </SelectContent>
              </Select>
            </span>
          </label>
          {/* Options preview pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] font-medium text-muted-foreground">Options:</span>
            {options.map((opt, idx) => (
              <span key={idx} className="rounded-md border border-border/70 bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-foreground">
                {opt}
              </span>
            ))}
          </div>
        </div>
      );
    }
    case "NumberField":
      return (
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="text-foreground">{label}</span>
          <span className="flex items-center gap-2">
            <Hash className="size-4 text-primary" />
            <input
              type="number"
              required={required}
              placeholder="Enter a number"
              className="h-10 min-w-0 flex-1 rounded-lg border border-border/70 bg-background px-3 text-sm font-normal text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </span>
        </label>
      );
    case "Checkbox": {
      const rawOptions = element.extraAttributes?.options;
      const hasOptions = Array.isArray(rawOptions) && rawOptions.length > 0;
      const options = hasOptions ? (rawOptions as string[]) : [];

      if (hasOptions) {
        return (
          <fieldset className="grid gap-3 text-sm text-foreground">
            <legend className="font-semibold text-foreground">
              <CheckSquare className="mr-2 inline size-4 text-primary" />
              {label}
              {required ? <span className="ml-1 text-primary">*</span> : null}
            </legend>
            <div className="space-y-1.5 pl-6">
              {options.map((option, idx) => (
                <label key={idx} className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground">
                  <Checkbox name={`preview-cb-${element.id}`} value={option} aria-label={option} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pl-6 pt-0.5">
              <span className="text-[11px] font-medium text-muted-foreground">Options:</span>
              {options.map((opt, idx) => (
                <span key={idx} className="rounded-md border border-border/70 bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-foreground">
                  {opt}
                </span>
              ))}
            </div>
            {element.extraAttributes?.helperText ? (
              <p className="text-xs text-muted-foreground">{String(element.extraAttributes.helperText)}</p>
            ) : null}
          </fieldset>
        );
      }

      return (
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground">
          <CheckSquare className="size-4 text-primary" />
          <Checkbox required={required} aria-label={label} />
          <span>{label}</span>
          {required ? <span className="text-primary">*</span> : null}
        </label>
      );
    }
    case "Radio": {
      const options = readOptions(element);
      return (
        <fieldset className="grid gap-3 text-sm text-foreground">
          <legend className="font-semibold text-foreground">
            <CircleDot className="mr-2 inline size-4 text-primary" />
            {label}
            {required ? <span className="text-primary">*</span> : null}
          </legend>
          <RadioGroup className="space-y-1.5 pl-6">
            {options.map((option, idx) => (
              <label key={idx} className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground">
                <RadioGroupItem value={option} aria-label={option} />
                <span>{option}</span>
              </label>
            ))}
          </RadioGroup>
          <div className="flex flex-wrap items-center gap-1.5 pl-6 pt-0.5">
            <span className="text-[11px] font-medium text-muted-foreground">Options:</span>
            {options.map((opt, idx) => (
              <span key={idx} className="rounded-md border border-border/70 bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-foreground">
                {opt}
              </span>
            ))}
          </div>
          {element.extraAttributes?.helperText ? (
            <p className="text-xs text-muted-foreground">{String(element.extraAttributes.helperText)}</p>
          ) : null}
        </fieldset>
      );
    }
    case "TextField":
    default:
      return (
        <label className="grid gap-1.5 text-sm font-medium text-foreground">
          <span>
            {label}
            {required ? <span className="text-primary ml-1">*</span> : null}
          </span>
          <input
            type="text"
            required={required}
            placeholder={readText(element, "placeholder", "Enter your response")}
            className="h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-normal text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
          />
          {element.extraAttributes?.helperText ? (
            <span className="text-xs font-normal text-muted-foreground">
              {readText(element, "helperText", "")}
            </span>
          ) : null}
        </label>
      );
  }
}

export default function FormPreview({
  form,
  elements,
  onBack,
}: {
  form: Pick<Form, "name" | "description">;
  elements: FormElementInstance[];
  onBack?: () => void;
}) {
  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-border/70 bg-card p-6 shadow-xs sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to builder
          </button>
        ) : (
          <span />
        )}
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
          Live Preview
        </span>
      </div>

      <div className="border-b border-border/60 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {form.name}
        </h1>
        {form.description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {form.description}
          </p>
        ) : null}
      </div>

      {elements.length > 0 ? (
        <form className="mt-6 grid gap-6" onSubmit={(event) => event.preventDefault()}>
          {elements.map((element) => (
            <PreviewElement key={element.id} element={element} />
          ))}
          <button
            type="submit"
            className="mt-2 h-10 cursor-pointer rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-2xs transition-colors hover:bg-primary/90"
          >
            Submit response
          </button>
        </form>
      ) : (
        <div className="mt-6 flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-background/50 px-5 py-8 text-center">
          <p className="text-sm font-semibold text-foreground">
            This form has no fields yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Return to the builder to add fields and preview your form live.
          </p>
        </div>
      )}
    </section>
  );
}
