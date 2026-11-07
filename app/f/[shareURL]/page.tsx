import { notFound } from "next/navigation";

import { getPublishedFormByShareURL } from "@/actions/form";
import FormSubmitComponent from "@/components/FormSubmitComponent";
import type { FormElementInstance } from "@/components/FormElements";

function parseContent(content: string): FormElementInstance[] {
  try {
    const parsed: unknown = JSON.parse(content);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((element): element is FormElementInstance => {
      if (!element || typeof element !== "object") return false;
      const candidate = element as { id?: unknown; type?: unknown };
      return (
        typeof candidate.id === "string" && typeof candidate.type === "string"
      );
    });
  } catch {
    return [];
  }
}

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ shareURL: string }>;
}) {
  const { shareURL } = await params;
  const form = await getPublishedFormByShareURL(shareURL).catch(() => null);

  if (!form) notFound();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground sm:px-6">
      <FormSubmitComponent
        formUrl={shareURL}
        name={form.name}
        description={form.description}
        responsePolicy={form.responsePolicy ?? "ONE_PER_BROWSER"}
        content={parseContent(form.content)}
      />
    </main>
  );
}
