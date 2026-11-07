import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

type ResponseColumn = {
  id: string;
  label: string;
};

function getResponseColumns(content: string): ResponseColumn[] {
  try {
    const parsed: unknown = JSON.parse(content);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((element) => {
      if (!element || typeof element !== "object") return [];
      const item = element as {
        id?: unknown;
        type?: unknown;
        extraAttributes?: Record<string, unknown>;
      };

      if (
        typeof item.id !== "string" ||
        !["TextField", "NumberField", "DatePicker", "Select", "Checkbox", "Radio"].includes(
          String(item.type),
        )
      ) {
        return [];
      }

      const label = item.extraAttributes?.label;
      return [{
        id: item.id,
        label: typeof label === "string" && label.trim() ? label : "Untitled field",
      }];
    });
  } catch {
    return [];
  }
}

function parseResponse(content: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(content);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function formatValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === null || value === undefined) return "";
  return String(value);
}

function escapeCsv(value: string) {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const form = await prisma.form.findFirst({
    where: { id: Number(id), userId },
    select: {
      name: true,
      content: true,
      formSubmissions: {
        orderBy: { createdAt: "asc" },
        select: { content: true, createdAt: true },
      },
    },
  });

  if (!form) {
    return new NextResponse("Form not found", { status: 404 });
  }

  const columns = getResponseColumns(form.content);
  const header = ["Submitted at", ...columns.map((column) => column.label)];
  const rows = form.formSubmissions.map((submission) => {
    const response = parseResponse(submission.content);
    return [
      new Date(submission.createdAt).toISOString(),
      ...columns.map((column) => formatValue(response[column.id])),
    ];
  });
  const csv = [header, ...rows]
    .map((row) => row.map((value) => escapeCsv(value)).join(","))
    .join("\r\n");
  const filename = `${form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "form"}-responses.csv`;

  return new NextResponse(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
