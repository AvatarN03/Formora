"use client";

import { useState } from "react";
import { Check, CheckSquare, CircleDot, Hash, List, Loader2 } from "lucide-react";
import { submitForm } from "@/actions/form";
import type { FormElementInstance } from "./FormElements";
import { ThemeToggle } from "./theme-toggle";

interface FormSubmitComponentProps {
  formUrl: string;
  name: string;
  description: string;
  content: FormElementInstance[];
}

function readText(element: FormElementInstance, key: string, fallback: string) {
  const value = element.extraAttributes?.[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function readOptions(element: FormElementInstance): string[] {
  const value = element.extraAttributes?.options;
  return Array.isArray(value) && value.every((option) => typeof option === "string")
    ? (value as string[])
    : ["Option 1", "Option 2"];
}

export default function FormSubmitComponent({
  formUrl,
  name,
  description,
  content,
}: FormSubmitComponentProps) {
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (elementId: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [elementId]: value }));
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[elementId];
      return next;
    });
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    for (const element of content) {
      if (element.extraAttributes?.required) {
        const val = formValues[element.id];
        if (val === undefined || val === null || val === "" || (typeof val === "boolean" && !val)) {
          errors[element.id] = "This field is required";
        }
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitForm(formUrl, JSON.stringify(formValues));
      setSubmitted(true);
    } catch {
      alert("Something went wrong while submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-2xl border border-border/70 bg-card p-8 text-center shadow-xs sm:p-12">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Check className="size-7" />
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">Response Submitted</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Thank you for your response! Your answers for <span className="font-semibold text-foreground">{name}</span> have been recorded.
        </p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute right-0 top-0 -mt-10 sm:-mt-12">
        <ThemeToggle />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs sm:p-10">
        <div className="border-b border-border/60 pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{name}</h1>
          {description ? (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {content.map((element) => {
            const label = readText(element, "label", "Field");
            const required = Boolean(element.extraAttributes?.required);
            const error = formErrors[element.id];

            switch (element.type) {
              case "H1":
                return (
                  <h1 key={element.id} className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {readText(element, "text", "Heading")}
                  </h1>
                );
              case "H2":
                return (
                  <h2 key={element.id} className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                    {readText(element, "text", "Section")}
                  </h2>
                );
              case "Paragraph":
                return (
                  <p key={element.id} className="text-sm leading-relaxed text-muted-foreground">
                    {readText(element, "text", "")}
                  </p>
                );
              case "Separator":
                return <hr key={element.id} className="border-border/70" />;
              case "Spacer":
                return (
                  <div
                    key={element.id}
                    style={{ height: `${Number(element.extraAttributes?.height ?? 64)}px` }}
                    aria-hidden="true"
                  />
                );
              case "DatePicker":
                return (
                  <div key={element.id} className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      {label}
                      {required ? <span className="ml-1 text-primary">*</span> : null}
                    </label>
                    <input
                      type="date"
                      value={String(formValues[element.id] ?? "")}
                      onChange={(e) => handleInputChange(element.id, e.target.value)}
                      className="h-10 w-full rounded-lg border border-border/70 bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    {error ? <p className="text-xs text-destructive">{error}</p> : null}
                  </div>
                );
              case "Select": {
                const options = readOptions(element);
                return (
                  <div key={element.id} className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      {label}
                      {required ? <span className="ml-1 text-primary">*</span> : null}
                    </label>
                    <div className="flex items-center gap-2">
                      <List className="size-4 shrink-0 text-primary" />
                      <select
                        value={String(formValues[element.id] ?? "")}
                        onChange={(e) => handleInputChange(element.id, e.target.value)}
                        className="h-10 w-full rounded-lg border border-border/70 bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Select an option...</option>
                        {options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    {error ? <p className="text-xs text-destructive">{error}</p> : null}
                  </div>
                );
              }
              case "NumberField":
                return (
                  <div key={element.id} className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      {label}
                      {required ? <span className="ml-1 text-primary">*</span> : null}
                    </label>
                    <div className="flex items-center gap-2">
                      <Hash className="size-4 shrink-0 text-primary" />
                      <input
                        type="number"
                        placeholder={readText(element, "placeholder", "Enter a number...")}
                        value={String(formValues[element.id] ?? "")}
                        onChange={(e) => handleInputChange(element.id, e.target.value)}
                        className="h-10 w-full rounded-lg border border-border/70 bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    {error ? <p className="text-xs text-destructive">{error}</p> : null}
                  </div>
                );
              case "Checkbox":
                return (
                  <div key={element.id} className="space-y-1">
                    <label className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                      <input
                        type="checkbox"
                        checked={Boolean(formValues[element.id] ?? false)}
                        onChange={(e) => handleInputChange(element.id, e.target.checked)}
                        className="size-4 rounded border-border/70 text-primary accent-primary focus:ring-primary"
                      />
                      <span>
                        {label}
                        {required ? <span className="ml-1 text-primary">*</span> : null}
                      </span>
                    </label>
                    {error ? <p className="text-xs text-destructive">{error}</p> : null}
                  </div>
                );
              case "Radio": {
                const options = readOptions(element);
                return (
                  <fieldset key={element.id} className="space-y-2">
                    <legend className="text-sm font-medium text-foreground">
                      <CircleDot className="mr-1.5 inline size-4 text-primary" />
                      {label}
                      {required ? <span className="ml-1 text-primary">*</span> : null}
                    </legend>
                    <div className="space-y-1.5 pl-6">
                      {options.map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <input
                            type="radio"
                            name={element.id}
                            value={opt}
                            checked={formValues[element.id] === opt}
                            onChange={(e) => handleInputChange(element.id, e.target.value)}
                            className="size-4 text-primary accent-primary"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                    {error ? <p className="text-xs text-destructive">{error}</p> : null}
                  </fieldset>
                );
              }
              case "TextField":
              default:
                return (
                  <div key={element.id} className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      {label}
                      {required ? <span className="ml-1 text-primary">*</span> : null}
                    </label>
                    <input
                      type="text"
                      placeholder={readText(element, "placeholder", "Your answer...")}
                      value={String(formValues[element.id] ?? "")}
                      onChange={(e) => handleInputChange(element.id, e.target.value)}
                      className="h-10 w-full rounded-lg border border-border/70 bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
                    />
                    {element.extraAttributes?.helperText ? (
                      <p className="text-xs text-muted-foreground">
                        {String(element.extraAttributes.helperText)}
                      </p>
                    ) : null}
                    {error ? <p className="text-xs text-destructive">{error}</p> : null}
                  </div>
                );
            }
          })}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-2xs transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Response</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

