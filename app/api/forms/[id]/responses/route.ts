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

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function createExcelWorkbook(
  sheetName: string,
  header: string[],
  rows: string[][],
) {
  const columns = header
    .map((value) => `<Column ss:Width="${Math.min(260, Math.max(110, value.length * 8 + 32))}"/>`)
    .join("");
  const headerRow = `<Row ss:StyleID="Header">${header
    .map((value) => `<Cell><Data ss:Type="String">${escapeXml(value)}</Data></Cell>`)
    .join("")}</Row>`;
  const bodyRows = rows
    .map(
      (row) => `<Row>${row
        .map((value) => `<Cell><Data ss:Type="String">${escapeXml(value)}</Data></Cell>`)
        .join("")}</Row>`,
    )
    .join("");

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Center"/>
      <Font ss:FontName="Aptos" ss:Size="10"/>
    </Style>
    <Style ss:ID="Header">
      <Font ss:FontName="Aptos Display" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#D96445" ss:Pattern="Solid"/>
      <Alignment ss:Vertical="Center"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="${escapeXml(sheetName)}">
    <Table>
      ${columns}
      ${headerRow}
      ${bodyRows}
    </Table>
    <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
      <FreezePanes/>
      <FrozenNoSplit/>
      <SplitHorizontal>1</SplitHorizontal>
      <TopRowBottomPane>1</TopRowBottomPane>
      <ActivePane>2</ActivePane>
    </WorksheetOptions>
  </Worksheet>
</Workbook>`;
}

export async function GET(
  request: Request,
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

  if (new URL(request.url).searchParams.get("format") === "excel") {
    const workbook = createExcelWorkbook(
      form.name.slice(0, 31) || "Responses",
      header,
      rows,
    );

    return new NextResponse(workbook, {
      headers: {
        "Content-Type": "application/vnd.ms-excel; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename.replace(/\.csv$/, ".xls")}"`,
        "Cache-Control": "no-store",
      },
    });
  }

  return new NextResponse(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
