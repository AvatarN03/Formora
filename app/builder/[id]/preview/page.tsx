import Link from "next/link";
import { ArrowLeft, CheckSquare, CircleDot, Hash, List } from "lucide-react";

import { getFormById } from "@/actions/form";
import { buttonVariants } from "@/components/ui/button";
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
      return <h1 className="text-3xl font-semibold tracking-tight text-foreground">{readText(element, "text", "Form heading")}</h1>;
    case "H2":
      return <h2 className="text-xl font-semibold text-foreground">{readText(element, "text", "Section heading")}</h2>;
    case "Paragraph":
      return <p className="text-sm leading-6 text-muted-foreground">{readText(element, "text", "Add supporting text to your form.")}</p>;
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
    case "Select":
      return (
        <label className="grid gap-2 text-sm font-medium text-foreground">
          {label}
          <span className="flex items-center gap-2">
            <List className="size-4 text-primary" />
            <select required={required} className="h-10 min-w-0 flex-1 rounded-sm border border-border bg-background px-3 text-sm font-normal text-foreground">
              <option value="">Choose an option</option>
              {readOptions(element).map((option) => <option key={option}>{option}</option>)}
            </select>
          </span>
        </label>
      );
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
    case "Checkbox":
      return <label className="flex items-center gap-2 text-sm text-foreground"><CheckSquare className="size-4 text-primary" /><input type="checkbox" required={required} />{label}</label>;
    case "Radio":
      return (
        <fieldset className="grid gap-3 text-sm text-foreground">
          <legend className="font-medium"><CircleDot className="mr-2 inline size-4 text-primary" />{label}</legend>
          {readOptions(element).map((option) => <label key={option} className="flex items-center gap-2"><input type="radio" name={element.id} required={required} />{option}</label>)}
        </fieldset>
      );
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
