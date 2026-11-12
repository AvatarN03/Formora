import Link from "next/link";
import { ArrowLeft, CheckSquare, CircleDot, Hash, List, Tag } from "lucide-react";

import { getFormById } from "@/actions/form";
import { buttonVariants } from "@/components/ui/button";
import type { FormElementInstance } from "@/components/builder/FormElements";

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

function readCheckboxOptions(element: FormElementInstance) {
  const value = element.extraAttributes?.options;
  return Array.isArray(value) && value.every((option) => typeof option === "string") ? value : [];
}

function OptionSummary({ options }: { options: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
      <span className="text-[11px] font-medium text-muted-foreground">Options:</span>
      {options.map((option, index) => (
        <span key={`${option}-${index}`} className="rounded-md border border-border/70 bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-foreground">
          {option}
        </span>
      ))}
    </div>
  );
}

function PreviewElement({ element }: { element: FormElementInstance }) {
  const label = readText(element, "label", "Untitled field");
  const required = Boolean(element.extraAttributes?.required);

  switch (element.type) {
    case "H1":
      return <h1 className="text-3xl font-semibold tracking-tight text-foreground">{readText(element, "text", "Form heading")}</h1>;
    case "H2":
      return <h2 className="text-xl font-semibold text-foreground">{readText(element, "text", "Section heading")}</h2>;
    case "Paragraph":
      return <p className="text-sm leading-6 text-muted-foreground">{readText(element, "text", "Add supporting text to your form.")}</p>;
    case "Label":
      return (
        <div className="space-y-1">
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Tag className="size-3.5 text-primary" />
            <span>{readText(element, "text", "Label text")}</span>
            {required ? <span className="text-primary">*</span> : null}
          </span>
          {element.extraAttributes?.helperText ? (
            <p className="text-xs text-muted-foreground">{readText(element, "helperText", "")}</p>
          ) : null}
        </div>
      );
    case "Separator":
      return <hr className="border-border" />;
    case "Spacer":
      return <div style={{ height: `${Number(element.extraAttributes?.height ?? 64)}px` }} aria-hidden="true" />;
    case "DatePicker":
      return (
        <label className="grid gap-2 text-sm font-medium text-foreground">
          {label}
          <input type="date" required={required} className="h-10 rounded-sm border border-border bg-background px-3 text-sm text-foreground" />
        </label>
      );
    case "Select": {
      const options = readOptions(element);
      return (
        <div className="space-y-2">
          <label className="grid gap-2 text-sm font-medium text-foreground">
            {label}
            <span className="flex items-center gap-2">
              <List className="size-4 text-primary" />
              <select required={required} defaultValue="" className="h-10 min-w-0 flex-1 rounded-sm border border-border bg-background px-3 text-sm font-normal text-foreground">
                <option value="" disabled>Choose an option...</option>
                {options.map((option, index) => <option key={`${option}-${index}`} value={option}>{option}</option>)}
              </select>
            </span>
          </label>
          <OptionSummary options={options} />
        </div>
      );
    }
    case "NumberField":
      return (
        <label className="grid gap-2 text-sm font-medium text-foreground">
          {label}
          <span className="flex items-center gap-2">
            <Hash className="size-4 text-primary" />
            <input type="number" required={required} placeholder="Enter a number" className="h-10 min-w-0 flex-1 rounded-sm border border-border bg-background px-3 text-sm font-normal text-foreground" />
          </span>
        </label>
      );
    case "Checkbox": {
      const options = readCheckboxOptions(element);
      const hasOptions = options.length > 0;

      if (hasOptions) {
        return (
          <fieldset className="grid gap-3 text-sm text-foreground">
            <legend className="font-medium">
              <CheckSquare className="mr-2 inline size-4 text-primary" />
              {label}
              {required ? <span className="ml-1 text-primary">*</span> : null}
            </legend>
            <div className="space-y-1.5 pl-6">
              {options.map((option, index) => (
                <label key={`${option}-${index}`} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <input type="checkbox" name={`preview-cb-${element.id}`} value={option} className="size-4 text-primary accent-primary" />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            <div className="pl-6">
              <OptionSummary options={options} />
            </div>
          </fieldset>
        );
      }

      return (
        <label className="flex items-center gap-2 text-sm text-foreground">
          <CheckSquare className="size-4 text-primary" />
          <input type="checkbox" required={required} className="size-4 text-primary accent-primary" />
          <span>{label}</span>
          {required ? <span className="text-primary">*</span> : null}
        </label>
      );
    }
    case "Radio": {
      const options = readOptions(element);
      return (
        <fieldset className="grid gap-3 text-sm text-foreground">
          <legend className="font-medium">
            <CircleDot className="mr-2 inline size-4 text-primary" />
            {label}
            {required ? <span className="text-primary">*</span> : null}
          </legend>
          <div className="space-y-1.5 pl-6">
            {options.map((option, index) => (
                <label key={`${option}-${index}`} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <input type="radio" name={element.id} value={option} required={required} className="size-4 text-primary accent-primary" />
                <span>{option}</span>
              </label>
            ))}
          </div>
          <div className="pl-6">
            <OptionSummary options={options} />
          </div>
        </fieldset>
      );
    }
    case "TextField":
    default:
      return (
        <label className="grid gap-2 text-sm font-medium text-foreground">
          {label}{required ? " *" : ""}
          <input type="text" required={required} placeholder={readText(element, "placeholder", "Enter your response")} className="h-10 rounded-sm border border-border bg-background px-3 text-sm font-normal text-foreground placeholder:text-muted-foreground/60" />
          <span className="text-xs font-normal text-muted-foreground">{readText(element, "helperText", "")}</span>
        </label>
      );
  }
}

function parseContent(content: string): FormElementInstance[] {
  try {
    const parsed: unknown = JSON.parse(content);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((element): element is FormElementInstance => {
      if (!element || typeof element !== "object") return false;
      const candidate = element as { id?: unknown; type?: unknown };
      return typeof candidate.id === "string" && typeof candidate.type === "string";
    });
  } catch {
    return [];
  }
}

export default async function FormPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form = await getFormById(id);
  const elements = parseContent(form.content);

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-border/60 pb-5">
          <Link href={`/builder/${id}`} className={buttonVariants({ variant: "ghost", size: "sm", className: "gap-2" })}>
            <ArrowLeft className="size-4" />
            Back to builder
          </Link>
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Preview mode</span>
        </div>

        <section className="mx-auto max-w-2xl rounded-sm border border-border/70 bg-card p-6 shadow-xl sm:p-8">
          <div className="border-b border-border/60 pb-6">
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-primary">Form preview</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{form.name}</h1>
            {form.description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{form.description}</p> : null}
          </div>

          {elements.length > 0 ? (
            <form className="mt-6 grid gap-6" onSubmit={(event) => event.preventDefault()}>
              {elements.map((element) => <PreviewElement key={element.id} element={element} />)}
              <button type="submit" className="mt-2 h-10 rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                Submit response
              </button>
            </form>
          ) : (
            <div className="mt-6 border border-dashed border-border/70 bg-background/50 px-5 py-10 text-center">
              <p className="text-sm font-medium text-foreground">This form has no fields yet.</p>
              <p className="mt-1 text-xs text-muted-foreground">Return to the builder to add fields and save your form.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
