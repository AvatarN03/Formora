"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Check,
  Eye,
  Code2,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Zap,
  CornerDownRight,
  Database,
  Layers,
} from "lucide-react";

interface FormFieldItem {
  id: string;
  type: "text" | "email" | "choice" | "rating";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  condition?: string;
}

const INITIAL_FIELDS: FormFieldItem[] = [
  {
    id: "f_1",
    type: "text",
    label: "What is your primary workspace name?",
    placeholder: "e.g. Acme Design Labs",
    required: true,
  },
  {
    id: "f_2",
    type: "choice",
    label: "How does your team capture customer inputs today?",
    options: ["Google Forms / Typeform", "Custom coded forms", "Not collecting yet"],
    required: true,
  },
  {
    id: "f_3",
    type: "email",
    label: "Where should we send your submission receipt?",
    placeholder: "alex@domain.com",
    required: false,
    condition: "Shown when team size > 1",
  },
  {
    id: "f_4",
    type: "rating",
    label: "Rate the speed of your current workflow",
    required: true,
  },
];

export default function Home() {
  const { isSignedIn } = useUser();

  // Interactive Workbench State
  const [fields, setFields] = useState<FormFieldItem[]>(INITIAL_FIELDS);
  const [activeFieldId, setActiveFieldId] = useState<string>("f_1");
  const [viewMode, setViewMode] = useState<"builder" | "preview" | "schema">("builder");

  // Live preview answers
  const [answers, setAnswers] = useState<Record<string, any>>({
    f_1: "",
    f_2: "Custom coded forms",
    f_3: "",
    f_4: 4,
  });
  const [submitted, setSubmitted] = useState(false);

  // Field manipulation helpers
  const moveField = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;
    const updated = [...fields];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFields(updated);
  };

  const removeField = (id: string) => {
    if (fields.length <= 1) return;
    const filtered = fields.filter((f) => f.id !== id);
    setFields(filtered);
    if (activeFieldId === id) {
      setActiveFieldId(filtered[0].id);
    }
  };

  const addField = (type: FormFieldItem["type"]) => {
    const newId = `f_${Date.now()}`;
    const newField: FormFieldItem = {
      id: newId,
      type,
      label:
        type === "text"
          ? "Untitled question"
          : type === "email"
          ? "Contact email"
          : type === "choice"
          ? "Select one option"
          : "Overall satisfaction",
      placeholder: type === "email" ? "name@company.com" : "Write your response...",
      required: true,
      options: type === "choice" ? ["Option A", "Option B"] : undefined,
    };
    setFields([...fields, newField]);
    setActiveFieldId(newId);
  };

  const activeField = fields.find((f) => f.id === activeFieldId) || fields[0];

  const updateActiveFieldLabel = (val: string) => {
    setFields(
      fields.map((f) => (f.id === activeFieldId ? { ...f, label: val } : f))
    );
  };

  const toggleActiveFieldRequired = () => {
    setFields(
      fields.map((f) =>
        f.id === activeFieldId ? { ...f, required: !f.required } : f
      )
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/25 selection:text-foreground">
      {/* -------------------- HEADER -------------------- */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 text-base font-semibold tracking-tight">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
                f
              </span>
              <span className="font-medium text-foreground tracking-tight">formly</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-muted-foreground">
              <a href="#workbench" className="hover:text-foreground transition-colors">
                Workbench
              </a>
              <a href="#architecture" className="hover:text-foreground transition-colors">
                Architecture
              </a>
              <a href="#specifications" className="hover:text-foreground transition-colors">
                Specs
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={isSignedIn ? "/console" : "/sign-in"}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
            >
              {isSignedIn ? "Console" : "Sign in"}
            </Link>
            <Link
              href={isSignedIn ? "/console" : "/sign-in"}
              className={buttonVariants({ size: "sm" })}
            >
              <span>Start building</span>
              <ArrowRight className="size-3.5 opacity-70" />
            </Link>
          </div>
        </div>
      </header>

      {/* -------------------- HERO SECTION -------------------- */}
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-12 lg:px-10 lg:pt-24 lg:pb-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3 py-1 text-[11px] font-mono text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              <span>FORM BUILDER & COMPILER</span>
              <span className="text-border">/</span>
              <span className="text-foreground">NEXT.JS 16</span>
            </div>

            <h1 className="text-4xl font-medium tracking-[-0.045em] sm:text-6xl lg:text-7xl leading-[1.04] text-foreground">
              Build forms people <br />
              <span className="text-muted-foreground">actually finish.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground font-normal">
              A tactile workspace designed for speed and clarity. Arrange fields,
              inspect the live schema, and deploy native forms that feel effortless to answer.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={isSignedIn ? "/console" : "/sign-in"}
                className={buttonVariants({ size: "lg" })}
              >
                <span>Open studio</span>
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#workbench"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
              >
                <SlidersHorizontal className="size-4" />
                <span>Try interactive canvas</span>
              </a>
            </div>
          </div>

          {/* Quick Technical Specs Table */}
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 text-xs font-mono text-muted-foreground">
              <span>SYSTEM SPECIFICATION</span>
              <span className="text-emerald-500 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                READY
              </span>
            </div>

            <div className="mt-4 divide-y divide-border/40 text-xs font-mono">
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground">Runtime Rendering</span>
                <span className="text-foreground">Zero-iframe Native React 19</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground">Data Layer</span>
                <span className="text-foreground">PostgreSQL & Prisma ORM</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground">Authentication</span>
                <span className="text-foreground">Clerk Session Guards</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground">Component Primitive</span>
                <span className="text-foreground">shadcn/ui maia-olive</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- INTERACTIVE WORKBENCH -------------------- */}
      <section id="workbench" className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="rounded-2xl border border-border/80 bg-card shadow-2xl shadow-black/40 overflow-hidden">
          {/* Workbench Title Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 bg-muted/30 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-border" />
                <div className="size-2.5 rounded-full bg-border" />
                <div className="size-2.5 rounded-full bg-border" />
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                workspace / feedback_survey.form
              </span>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center rounded-lg border border-border/70 bg-background/80 p-0.5">
              <button
                onClick={() => setViewMode("builder")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  viewMode === "builder"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <SlidersHorizontal className="size-3" />
                <span>Canvas</span>
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  viewMode === "preview"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="size-3" />
                <span>Respondent View</span>
              </button>
              <button
                onClick={() => setViewMode("schema")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  viewMode === "schema"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Code2 className="size-3" />
                <span>Schema</span>
              </button>
            </div>
          </div>

          {/* MODE 1: BUILDER WORKBENCH */}
          {viewMode === "builder" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
              {/* Left Column: Component Drawer */}
              <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-border/60 bg-muted/10 p-5">
                <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
                  Insert Field
                </p>
                <div className="space-y-1.5">
                  {[
                    { type: "text" as const, label: "Short text", desc: "Single line input" },
                    { type: "email" as const, label: "Email address", desc: "Format validated" },
                    { type: "choice" as const, label: "Single choice", desc: "Radio selection" },
                    { type: "rating" as const, label: "Rating scale", desc: "1 to 5 stars" },
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => addField(item.type)}
                      className="w-full flex items-center justify-between rounded-xl border border-border/50 bg-background/50 p-2.5 text-left transition-all hover:border-border hover:bg-card group cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                      </div>
                      <Plus className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-4 border-t border-border/40">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                    Active Preset
                  </p>
                  <div className="rounded-lg border border-border/50 bg-background/40 p-2.5 text-[11px] font-mono text-muted-foreground">
                    <p className="text-foreground font-medium">Customer Feedback</p>
                    <p className="mt-0.5">{fields.length} questions registered</p>
                  </div>
                </div>
              </div>

              {/* Center Column: Live Reorderable Canvas */}
              <div className="lg:col-span-6 bg-background/50 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
                    <span className="text-xs font-mono text-muted-foreground">
                      CANVAS // DRAG & ARRANGE
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {fields.length} fields total
                    </span>
                  </div>

                  <div className="space-y-3">
                    {fields.map((field, idx) => {
                      const isActive = field.id === activeFieldId;
                      return (
                        <div
                          key={field.id}
                          onClick={() => setActiveFieldId(field.id)}
                          className={`rounded-xl border p-4 transition-all cursor-pointer ${
                            isActive
                              ? "border-primary/80 bg-card shadow-sm ring-1 ring-primary/40"
                              : "border-border/60 bg-card/40 hover:border-border hover:bg-card/70"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <span className="font-mono text-xs text-muted-foreground pt-0.5">
                                {String(idx + 1).padStart(2, "0")}
                              </span>
                              <div>
                                <div className="text-xs font-medium text-foreground flex items-center gap-2">
                                  <span>{field.label}</span>
                                  {field.required && (
                                    <span className="text-[10px] text-primary">*</span>
                                  )}
                                </div>
                                {field.condition && (
                                  <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                                    <CornerDownRight className="size-3 text-muted-foreground" />
                                    <span>{field.condition}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Reorder & Action controls */}
                            <div className="flex items-center gap-1">
                              <button
                                title="Move Up"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveField(idx, "up");
                                }}
                                disabled={idx === 0}
                                className="size-6 flex items-center justify-center rounded border border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors"
                              >
                                <ChevronUp className="size-3.5" />
                              </button>
                              <button
                                title="Move Down"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveField(idx, "down");
                                }}
                                disabled={idx === fields.length - 1}
                                className="size-6 flex items-center justify-center rounded border border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors"
                              >
                                <ChevronDown className="size-3.5" />
                              </button>
                              <button
                                title="Delete Field"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeField(field.id);
                                }}
                                className="size-6 flex items-center justify-center rounded border border-border/40 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors ml-1"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            </div>
                          </div>

                          {/* Field mock visualization */}
                          <div className="mt-3">
                            {field.type === "choice" ? (
                              <div className="flex flex-wrap gap-2">
                                {field.options?.map((opt, i) => (
                                  <span
                                    key={i}
                                    className="text-[11px] rounded-md border border-border/70 bg-background px-2.5 py-1 text-muted-foreground"
                                  >
                                    {opt}
                                  </span>
                                ))}
                              </div>
                            ) : field.type === "rating" ? (
                              <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <span
                                    key={num}
                                    className="size-6 rounded border border-border/70 bg-background flex items-center justify-center text-[10px] font-mono text-muted-foreground"
                                  >
                                    {num}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <div className="h-8 rounded-lg border border-border/50 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground/60 flex items-center">
                                {field.placeholder}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/40 text-xs font-mono text-muted-foreground">
                  <span>Press field to configure properties</span>
                  <span className="text-primary flex items-center gap-1.5">
                    <Check className="size-3.5" /> Auto-sync active
                  </span>
                </div>
              </div>

              {/* Right Column: Properties Inspector */}
              <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-border/60 bg-muted/10 p-5">
                <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
                  Field Inspector
                </p>

                {activeField ? (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        Question Label
                      </label>
                      <input
                        type="text"
                        value={activeField.label}
                        onChange={(e) => updateActiveFieldLabel(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        Field Identifier
                      </label>
                      <input
                        type="text"
                        disabled
                        value={activeField.id}
                        className="w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2 text-xs font-mono text-muted-foreground"
                      />
                    </div>

                    <div className="pt-3 border-t border-border/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Required answer</span>
                        <button
                          onClick={toggleActiveFieldRequired}
                          className={`size-4 rounded border flex items-center justify-center transition-colors ${
                            activeField.required
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-border bg-background"
                          }`}
                        >
                          {activeField.required && <Check className="size-3" />}
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Auto-focus on entry</span>
                        <span className="font-mono text-[10px] text-muted-foreground">ENABLED</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <p className="text-[11px] font-mono text-muted-foreground mb-1">DATA TYPE</p>
                      <p className="font-mono text-xs uppercase text-foreground">
                        {activeField.type}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Select a field on the canvas.</p>
                )}
              </div>
            </div>
          )}

          {/* MODE 2: RESPONDENT PREVIEW */}
          {viewMode === "preview" && (
            <div className="p-8 sm:p-12 max-w-xl mx-auto min-h-[520px] flex flex-col justify-center">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="size-12 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center mx-auto">
                    <Check className="size-6" />
                  </div>
                  <h3 className="text-xl font-medium tracking-tight text-foreground">
                    Response recorded
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    This demonstrates the actual respondent submission flow in Formly. No redirects, no friction.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-medium text-primary underline underline-offset-4 hover:opacity-80"
                  >
                    Reset and test again
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-6"
                >
                  <div className="border-b border-border/60 pb-3">
                    <p className="text-xs font-mono uppercase text-muted-foreground tracking-wider">
                      Customer Experience Survey
                    </p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      Please answer the following questions:
                    </p>
                  </div>

                  {fields.map((field, idx) => (
                    <div key={field.id} className="space-y-2">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <span className="font-mono text-muted-foreground">
                          {String(idx + 1).padStart(2, "0")}.
                        </span>
                        <span>{field.label}</span>
                        {field.required && <span className="text-primary">*</span>}
                      </label>

                      {field.type === "choice" ? (
                        <div className="space-y-1.5">
                          {field.options?.map((opt, i) => (
                            <label
                              key={i}
                              className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-xs transition-colors cursor-pointer ${
                                answers[field.id] === opt
                                  ? "border-primary bg-primary/10 text-foreground font-medium"
                                  : "border-border bg-background text-muted-foreground hover:border-border/80"
                              }`}
                            >
                              <input
                                type="radio"
                                name={field.id}
                                value={opt}
                                checked={answers[field.id] === opt}
                                onChange={() =>
                                  setAnswers({ ...answers, [field.id]: opt })
                                }
                                className="hidden"
                              />
                              <span
                                className={`size-3.5 rounded-full border flex items-center justify-center ${
                                  answers[field.id] === opt
                                    ? "border-primary bg-primary"
                                    : "border-muted-foreground/50"
                                }`}
                              >
                                {answers[field.id] === opt && (
                                  <span className="size-1.5 rounded-full bg-primary-foreground" />
                                )}
                              </span>
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : field.type === "rating" ? (
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setAnswers({ ...answers, [field.id]: num })}
                              className={`size-10 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                                answers[field.id] >= num
                                  ? "border-primary bg-primary/20 text-primary font-semibold"
                                  : "border-border bg-background text-muted-foreground hover:border-border/80"
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input
                          type={field.type === "email" ? "email" : "text"}
                          required={field.required}
                          placeholder={field.placeholder}
                          value={answers[field.id] || ""}
                          onChange={(e) =>
                            setAnswers({ ...answers, [field.id]: e.target.value })
                          }
                          className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                        />
                      )}
                    </div>
                  ))}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-primary py-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
                  >
                    Submit Form Response
                  </button>
                </form>
              )}
            </div>
          )}

          {/* MODE 3: GENERATED SCHEMA */}
          {viewMode === "schema" && (
            <div className="p-6 bg-[#0c0e17] font-mono text-xs text-muted-foreground min-h-[520px] overflow-x-auto">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/40 text-[11px]">
                <span className="text-foreground">// Generated Abstract Syntax Schema</span>
                <span>Type: FormlySchemaV1</span>
              </div>
              <pre className="text-emerald-400/90 leading-relaxed">
                {JSON.stringify(
                  {
                    formId: "formly_feedback_v1",
                    version: "1.0.0",
                    theme: "base-maia-olive",
                    engine: "react-19-server-actions",
                    fields: fields.map((f, i) => ({
                      index: i + 1,
                      id: f.id,
                      type: f.type,
                      label: f.label,
                      required: f.required,
                      ...(f.options ? { options: f.options } : {}),
                      ...(f.condition ? { rule: f.condition } : {}),
                    })),
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      </section>

      {/* -------------------- ARCHITECTURAL TENETS -------------------- */}
      <section id="architecture" className="border-t border-border/50 bg-card/20 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl mb-16">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-2">
              Design Philosophy
            </p>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
              Form infrastructure without the clutter.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Every design choice in Formly prioritizes submission completion over flashy gimmicks.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            <div className="space-y-2 border-l border-border/70 pl-6">
              <span className="font-mono text-xs text-primary">01 / TACTILE CANVAS</span>
              <h3 className="text-base font-medium text-foreground">
                Immediate visual arrangement
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Reorder, toggle requirements, and configure field parameters directly inline. No nested modals or cumbersome settings trees.
              </p>
            </div>

            <div className="space-y-2 border-l border-border/70 pl-6">
              <span className="font-mono text-xs text-primary">02 / ZERO IFRAMES</span>
              <h3 className="text-base font-medium text-foreground">
                Native React components
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Forms compile into clean, lightweight DOM trees. They inherit your existing fonts, dark-mode tokens, and accessibility standards.
              </p>
            </div>

            <div className="space-y-2 border-l border-border/70 pl-6">
              <span className="font-mono text-xs text-primary">03 / TYPED PERSISTENCE</span>
              <h3 className="text-base font-medium text-foreground">
                PostgreSQL & Prisma backing
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Submissions flow directly into your structured database tables, ready for real-time webhooks, CSV export, or dashboard analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- SPECIFICATIONS & DETAILS -------------------- */}
      <section id="specifications" className="border-t border-border/50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-2">
                Built For Craft
              </p>
              <h2 className="text-3xl font-medium tracking-tight text-foreground">
                Engineered for teams who care about the details.
              </h2>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Formly pairs the convenience of drag-and-drop with developer-grade execution.
                Authentication is protected by Clerk, layouts are styled with Tailwind 4, and database records map 1:1 with Prisma schemas.
              </p>

              <div className="mt-8 space-y-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-4 text-primary" />
                  <span>Role-based access & protected console routes via proxy middleware</span>
                </div>
                <div className="flex items-center gap-3">
                  <Database className="size-4 text-primary" />
                  <span>Normalized relational models for forms, fields, and submissions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="size-4 text-primary" />
                  <span>Sub-millisecond keyboard navigation for respondents</span>
                </div>
              </div>
            </div>

            {/* Code / Architecture Card */}
            <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 text-xs font-mono text-muted-foreground">
                <span>formly.config.ts</span>
                <span>TypeScript</span>
              </div>
              <pre className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground overflow-x-auto">
                <code>
                  <span className="text-primary">import</span> &#123; defineForm &#125; <span className="text-primary">from</span> <span className="text-foreground">"@/lib/formly"</span>;{"\n\n"}
                  <span className="text-primary">export default</span> defineForm&#40;&#123;{"\n"}
                  {"  "}slug: <span className="text-emerald-400">"product-feedback"</span>,{"\n"}
                  {"  "}auth: <span className="text-emerald-400">"clerk-optional"</span>,{"\n"}
                  {"  "}theme: <span className="text-emerald-400">"base-maia-olive"</span>,{"\n"}
                  {"  "}storage: <span className="text-emerald-400">"prisma-postgres"</span>,{"\n"}
                  {"  "}onComplete: <span className="text-primary">async</span> &#40;submission&#41; =&gt; &#123;{"\n"}
                  {"    "}<span className="text-muted-foreground">// Instant webhook notification</span>{"\n"}
                  {"    "}<span className="text-primary">await</span> notifyTeam&#40;submission&#41;;{"\n"}
                  {"  "}&#125;,{"\n"}
                  &#125;&#41;;
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- CALLOUT SECTION -------------------- */}
      <section className="border-t border-border/50 bg-muted/20 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-medium tracking-tight text-foreground">
              Ready to assemble your first form?
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Create an account or launch your local workspace immediately.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={isSignedIn ? "/console" : "/sign-in"}
              className={buttonVariants({ size: "default" })}
            >
              <span>Launch workspace</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* -------------------- FOOTER -------------------- */}
      <footer className="border-t border-border/40 py-8 text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded bg-primary text-[10px] font-semibold text-primary-foreground">
              f
            </span>
            <span className="font-medium text-foreground">formly</span>
            <span className="text-border">·</span>
            <span>Quiet, focused form builder for modern teams</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/console" className="hover:text-foreground transition-colors">
              Console
            </Link>
            <Link href="/sign-in" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
