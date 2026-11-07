"use client";

import type { Form } from "@prisma/client";
import { ArrowLeft, CheckSquare, CircleDot, Hash, List } from "lucide-react";

import type { FormElementInstance } from "@/components/FormElements";

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
    case "Select":
      return (
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="text-foreground">{label}</span>
          <span className="flex items-center gap-2">
            <List className="size-4 text-primary" />
            <select
              required={required}
              className="h-10 min-w-0 flex-1 rounded-lg border border-border/70 bg-background px-3 text-sm font-normal text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Choose an option</option>
              {readOptions(element).map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </span>
        </label>
      );
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
    case "Checkbox":
      return (
        <label className="flex items-center gap-2.5 text-sm font-medium text-foreground">
          <CheckSquare className="size-4 text-primary" />
          <input
            type="checkbox"
            required={required}
            className="size-4 rounded border-border/70 text-primary focus:ring-primary"
          />
          {label}
        </label>
      );
    case "Radio":
      return (
        <fieldset className="grid gap-3 text-sm text-foreground">
          <legend className="font-semibold text-foreground">
            <CircleDot className="mr-2 inline size-4 text-primary" />
            {label}
          </legend>
          {readOptions(element).map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <input type="radio" name={element.id} required={required} className="size-4 text-primary" />
              {option}
            </label>
          ))}
        </fieldset>
      );
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
