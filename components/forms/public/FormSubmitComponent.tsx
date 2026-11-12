"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, CheckSquare, CircleDot, Hash, List, Loader2, Tag } from "lucide-react";
import { getSubmissionStatus, submitForm } from "@/actions/form";
import type { FormElementInstance } from "@/components/builder/FormElements";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeLogo } from "@/components/theme-logo";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormSubmitComponentProps {
  formUrl: string;
  name: string;
  description: string;
  responsePolicy: "UNLIMITED" | "ONE_PER_BROWSER";
  content: FormElementInstance[];
}

function readText(element: FormElementInstance, key: string, fallback: string) {
  const value = element.extraAttributes?.[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function readOptions(element: FormElementInstance): string[] {
  const value = element.extraAttributes?.options;
  const options = Array.isArray(value)
    ? value
        .filter((option): option is string => typeof option === "string")
        .map((option) => option.trim())
        .filter(Boolean)
    : [];
  return options.length > 0 ? options : ["Option 1", "Option 2"];
}

function FormoraFooter() {
  return (
    <footer className="mt-6 px-2 text-center opacity-60 transition-opacity hover:opacity-80">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-border" />
        <div className="flex shrink-0 flex-col items-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Powered by
          </span>
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-semibold tracking-tight text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Go to Formora home"
          >
            <ThemeLogo className="size-10" />
            <span className="text-lg">Formora</span>
          </Link>
        </div>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-border" />
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Forms that feel effortless.
      </p>
    </footer>
  );
}

export default function FormSubmitComponent({
  formUrl,
  name,
  description,
  responsePolicy,
  content,
}: FormSubmitComponentProps) {
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCheckingSubmission, setIsCheckingSubmission] = useState(
    responsePolicy === "ONE_PER_BROWSER",
  );
  const [submitted, setSubmitted] = useState(false);
  const [wasAlreadySubmitted, setWasAlreadySubmitted] = useState(false);

  useEffect(() => {
    if (responsePolicy !== "ONE_PER_BROWSER") {
      return;
    }

    let active = true;
    const storageKey = `formora:submission-key:${formUrl}`;
    let hasLocalMarker = false;

    try {
      hasLocalMarker = Boolean(window.localStorage.getItem(storageKey));
    } catch {
      // The server-side signed cookie check still works when storage is blocked.
    }

    void getSubmissionStatus(formUrl)
      .then((result) => {
        if (!active) return;
        if (result.alreadySubmitted || hasLocalMarker) {
          setWasAlreadySubmitted(true);
          setSubmitted(true);
        }
      })
      .catch(() => {
        // A status-check failure should not prevent a legitimate response.
      })
      .finally(() => {
        if (active) setIsCheckingSubmission(false);
      });

    return () => {
      active = false;
    };
  }, [formUrl, responsePolicy]);

  const handleInputChange = (elementId: string, value: unknown) => {
    setSubmitError(null);
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
        if (element.type === "Checkbox") {
          const rawOptions = element.extraAttributes?.options;
          const hasOptions = Array.isArray(rawOptions) && rawOptions.length > 0;
          if (hasOptions) {
            if (!Array.isArray(val) || val.length === 0) {
              errors[element.id] = "Please select at least one option";
            }
          } else {
            if (!val) {
              errors[element.id] = "This field is required";
            }
          }
        } else if (
          val === undefined ||
          val === null ||
          val === "" ||
          (typeof val === "boolean" && !val)
        ) {
          errors[element.id] = "This field is required";
        }
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const storageKey = `formora:submission-key:${formUrl}`;
      let submissionKey = crypto.randomUUID();

      if (responsePolicy === "ONE_PER_BROWSER") {
        try {
          const storedKey = window.localStorage.getItem(storageKey);
          if (storedKey) submissionKey = storedKey;
          // Persist the marker only after the server accepts the response.
        } catch {
          // The signed HttpOnly browser token remains available when storage is blocked.
        }
      }

      const result = await submitForm(
        formUrl,
        JSON.stringify(formValues),
        submissionKey,
      );
      if (responsePolicy === "ONE_PER_BROWSER") {
        try {
          window.localStorage.setItem(storageKey, submissionKey);
        } catch {
          // The signed HttpOnly browser token remains available.
        }
      }
      setWasAlreadySubmitted(result.duplicate);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong while submitting the form. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-xl">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/70 bg-card p-8 text-center shadow-xs sm:p-12">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Check className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            {wasAlreadySubmitted ? "Response Already Submitted" : "Response Submitted"}
          </h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {wasAlreadySubmitted
              ? "This form response was already received from this browser."
              : <>Thank you for your response! Your answers for <span className="font-semibold text-foreground">{name}</span> have been recorded.</>}
          </p>
        </div>
        <FormoraFooter />
      </div>
    );
  }

  if (responsePolicy === "ONE_PER_BROWSER" && isCheckingSubmission) {
    return (
      <div className="mx-auto w-full max-w-xl">
        <div className="rounded-2xl border border-border/70 bg-card p-8 text-center shadow-xs sm:p-12">
          <Loader2 className="mx-auto size-6 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Checking response status...</p>
        </div>
        <FormoraFooter />
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
              case "Label":
                return (
                  <div key={element.id} className="space-y-1">
                    <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Tag className="size-3.5 text-primary" />
                      <span>{readText(element, "text", "Label text")}</span>
                      {required ? <span className="ml-1 text-primary">*</span> : null}
                    </span>
                    {element.extraAttributes?.helperText ? (
                      <p className="text-xs text-muted-foreground">
                        {readText(element, "helperText", "")}
                      </p>
                    ) : null}
                  </div>
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
                  <div key={element.id} className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {label}
                      {required ? <span className="ml-1 text-primary">*</span> : null}
                    </label>
                    <div className="flex items-center gap-2">
                      <List className="size-4 shrink-0 text-primary" />
                      <Select
                        value={String(formValues[element.id] ?? "")}
                        onValueChange={(value) => handleInputChange(element.id, value)}
                      >
                        <SelectTrigger className="h-10 w-full rounded-lg border-border/70 bg-background text-foreground">
                          <SelectValue placeholder="Select an option..." />
                        </SelectTrigger>
                        <SelectContent>
                        {options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[11px] font-medium text-muted-foreground">Options:</span>
                      {options.map((opt, idx) => (
                        <span key={idx} className="rounded-md border border-border/70 bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-foreground">
                          {opt}
                        </span>
                      ))}
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
              case "Checkbox": {
                const rawOptions = element.extraAttributes?.options;
                const hasOptions = Array.isArray(rawOptions) && rawOptions.length > 0;
                const options = hasOptions ? (rawOptions as string[]) : [];

                if (hasOptions) {
                  const selected = Array.isArray(formValues[element.id])
                    ? (formValues[element.id] as string[])
                    : [];

                  return (
                    <fieldset key={element.id} className="space-y-2">
                      <legend className="text-sm font-medium text-foreground">
                        <CheckSquare className="mr-1.5 inline size-4 text-primary" />
                        {label}
                        {required ? <span className="ml-1 text-primary">*</span> : null}
                      </legend>
                      <div className="space-y-1.5 pl-6">
                        {options.map((opt) => (
                          <label
                            key={opt}
                            className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground"
                          >
                            <Checkbox
                              name={element.id}
                              value={opt}
                              checked={selected.includes(opt)}
                              onCheckedChange={(checked) => {
                                const next = checked === true
                                  ? [...selected, opt]
                                  : selected.filter((item) => item !== opt);
                                handleInputChange(element.id, next);
                              }}
                              aria-label={opt}
                            />
                            <span>{opt}</span>
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
                      {error ? <p className="text-xs text-destructive">{error}</p> : null}
                    </fieldset>
                  );
                }

                return (
                  <div key={element.id} className="space-y-1">
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground">
                      <Checkbox
                        checked={Boolean(formValues[element.id] ?? false)}
                        onCheckedChange={(checked) => handleInputChange(element.id, checked === true)}
                        aria-label={label}
                      />
                      <span>
                        {label}
                        {required ? <span className="ml-1 text-primary">*</span> : null}
                      </span>
                    </label>
                    {error ? <p className="text-xs text-destructive">{error}</p> : null}
                  </div>
                );
              }
              case "Radio": {
                const options = readOptions(element);
                return (
                  <fieldset key={element.id} className="space-y-2">
                    <legend className="text-sm font-medium text-foreground">
                      <CircleDot className="mr-1.5 inline size-4 text-primary" />
                      {label}
                      {required ? <span className="ml-1 text-primary">*</span> : null}
                    </legend>
                    <RadioGroup
                      value={String(formValues[element.id] ?? "")}
                      onValueChange={(value) => handleInputChange(element.id, value)}
                      className="space-y-1.5 pl-6"
                    >
                      {options.map((opt) => (
                        <label
                          key={opt}
                          className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <RadioGroupItem value={opt} aria-label={opt} />
                          <span>{opt}</span>
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

          {submitError ? (
            <Alert variant="destructive">
              <AlertTitle>We couldn&apos;t submit your response</AlertTitle>
              <AlertDescription>
                {submitError} Your answers are still here, so you can try again.
              </AlertDescription>
            </Alert>
          ) : null}

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
      <FormoraFooter />
    </div>
  );
}

