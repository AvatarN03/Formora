"use server";

import { auth } from "@clerk/nextjs/server";
import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createHash, createHmac, randomBytes } from "node:crypto";
import { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { formSchema, type FormValues } from "@/schemas/form";

export async function getFormStats(userId: string) {
  const { userId: authenticatedUserId } = await auth();

  if (!authenticatedUserId || authenticatedUserId !== userId) {
    throw new Error("Unauthorized");
  }

  const stats = await prisma.form.aggregate({
    where: { userId },
    _sum: {
      visits: true,
      submissions: true,
    },
    _count: {
      id: true,
    },
  });

  const totalForms = stats._count.id ?? 0;
  const totalVisits = stats._sum.visits ?? 0;
  const totalSubmissions = stats._sum.submissions ?? 0;
  const submissionRate =
    totalVisits > 0 ? (totalSubmissions / totalVisits) * 100 : 0;

  return {
    totalForms,
    totalVisits,
    totalSubmissions,
    submissionRate,
    bounceRate: totalVisits > 0 ? 100 - submissionRate : 0,
  };
}

export async function getForms(userId: string) {
  const { userId: authenticatedUserId } = await auth();

  if (!authenticatedUserId || authenticatedUserId !== userId) {
    throw new Error("Unauthorized");
  }

  return prisma.form.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export const createForm = async (data: FormValues) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }


  const validation = formSchema.safeParse(data);

  if (!validation.success) {
    throw new Error("Invalid form data");
  }

  const form = await prisma.form.create({
    data: {
      userId,
      name: data.name,
      description: data.description ?? "",
    },
  });

  if (!form) {
    throw new Error("Failed to create form");
  }

  revalidatePath("/console");
  return form.id;
}


export const getFormById = async (id: string) => {
  const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const form = await prisma.form.findUnique({
        where: { id: Number(id), userId },
    });

    if (!form) {
        throw new Error("Form not found");
    }

    return form;
};

export const getFormResponses = async (id: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const form = await prisma.form.findFirst({
    where: { id: Number(id), userId },
    select: {
      id: true,
      name: true,
      content: true,
      visits: true,
      submissions: true,
      formSubmissions: {
        orderBy: { createdAt: "desc" },
        select: { id: true, content: true, createdAt: true },
      },
    },
  });

  if (!form) {
    throw new Error("Form not found");
  }

  return form;
};

export const getPublishedFormByShareURL = async (shareURL: string) => {
  const form = await prisma.form.findFirst({
    where: { shareURL, published: true },
  });

  if (!form) {
    throw new Error("Published form not found");
  }

  await prisma.form.update({
    where: { id: form.id },
    data: { visits: { increment: 1 } },
  });

  return form;
};

export const updateFormName = async (id: string, name: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("Form name is required");
  }

  const form = await prisma.form.updateMany({
    where: { id: Number(id), userId },
    data: { name: trimmedName },
  });

  if (form.count === 0) {
    throw new Error("Form not found");
  }

  revalidatePath(`/builder/${id}`);
  revalidatePath("/console");
  return trimmedName;
};

export const updateFormResponsePolicy = async (
  id: string,
  responsePolicy: "UNLIMITED" | "ONE_PER_BROWSER",
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (responsePolicy !== "UNLIMITED" && responsePolicy !== "ONE_PER_BROWSER") {
    throw new Error("Invalid response policy");
  }

  const result = await prisma.$executeRaw`
    UPDATE "Form"
    SET "responsePolicy" = CAST(${responsePolicy} AS "ResponsePolicy")
    WHERE "id" = ${Number(id)} AND "userId" = ${userId}
  `;

  if (result === 0) {
    throw new Error("Form not found");
  }

  revalidatePath(`/builder/${id}`);
  revalidatePath("/console");
};

export const updateFormRateLimit = async (id: string, rateLimitPerHour: number) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!Number.isInteger(rateLimitPerHour) || rateLimitPerHour < 0 || rateLimitPerHour > 100) {
    throw new Error("Invalid rate limit");
  }

  const result = await prisma.$executeRaw`
    UPDATE "Form"
    SET "rateLimitPerHour" = ${rateLimitPerHour}
    WHERE "id" = ${Number(id)} AND "userId" = ${userId}
  `;

  if (result === 0) {
    throw new Error("Form not found");
  }

  revalidatePath(`/builder/${id}`);
  revalidatePath("/console");
};

const supportedElementTypes = new Set([
  "TextField",
  "H1",
  "H2",
  "Paragraph",
  "Label",
  "Separator",
  "Spacer",
  "DatePicker",
  "Select",
  "NumberField",
  "Checkbox",
  "Radio",
]);

function validateContent(content: string, requireElements = false) {
  try {
    const parsed: unknown = JSON.parse(content);
    if (!Array.isArray(parsed) || (requireElements && parsed.length === 0)) {
      throw new Error("Invalid form content");
    }

    const ids = new Set<string>();
    for (const element of parsed) {
      if (!element || typeof element !== "object") {
        throw new Error("Invalid form element");
      }

      const candidate = element as Record<string, unknown>;
      if (
        typeof candidate.id !== "string" ||
        !candidate.id.trim() ||
        ids.has(candidate.id) ||
        typeof candidate.type !== "string" ||
        !supportedElementTypes.has(candidate.type)
      ) {
        throw new Error("Invalid form element");
      }

      ids.add(candidate.id);
    }

    return parsed;
  } catch {
    throw new Error(
      requireElements
        ? "Add at least one valid element before publishing"
        : "Invalid form content",
    );
  }
}

const interactiveElementTypes = new Set([
  "TextField",
  "DatePicker",
  "Select",
  "NumberField",
  "Checkbox",
  "Radio",
]);

const maxSubmissionPayloadLength = 100_000;
const shareURLPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validateShareURL(shareURL: string) {
  if (typeof shareURL !== "string" || !shareURLPattern.test(shareURL)) {
    throw new Error("Invalid form link");
  }
}

function isValidCalendarDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function getElementOptions(element: Record<string, unknown>) {
  const attributes = element.extraAttributes;
  if (!attributes || typeof attributes !== "object") return [];

  const options = (attributes as Record<string, unknown>).options;
  return Array.isArray(options) && options.every((option) => typeof option === "string")
    ? options
    : [];
}

function isMissingSubmissionValue(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "") ||
    (typeof value === "boolean" && !value) ||
    (Array.isArray(value) && value.length === 0)
  );
}

function validateSubmission(formContent: string, submissionContent: string) {
  if (
    typeof submissionContent !== "string" ||
    submissionContent.length > maxSubmissionPayloadLength
  ) {
    throw new Error("Submission is too large");
  }

  const savedElements = validateContent(formContent, true) as Array<Record<string, unknown>>;
  let submitted: unknown;

  try {
    submitted = JSON.parse(submissionContent);
  } catch {
    throw new Error("Invalid submission data");
  }

  if (!submitted || typeof submitted !== "object" || Array.isArray(submitted)) {
    throw new Error("Invalid submission data");
  }

  const payload = submitted as Record<string, unknown>;
  const elementById = new Map<string, Record<string, unknown>>();

  for (const element of savedElements) {
    if (typeof element.id !== "string") continue;
    if (elementById.has(element.id)) {
      throw new Error("The published form contains duplicate field IDs");
    }
    elementById.set(element.id, element);
  }

  for (const key of Object.keys(payload)) {
    const element = elementById.get(key);
    if (!element || typeof element.type !== "string" || !interactiveElementTypes.has(element.type)) {
      throw new Error("Submission contains an unknown field");
    }
  }

  const normalized: Record<string, unknown> = {};

  for (const element of savedElements) {
    const id = typeof element.id === "string" ? element.id : "";
    const type = typeof element.type === "string" ? element.type : "";
    if (!id || !interactiveElementTypes.has(type)) continue;

    const attributes =
      element.extraAttributes && typeof element.extraAttributes === "object"
        ? (element.extraAttributes as Record<string, unknown>)
        : {};
    const required = attributes.required === true;
    const value = payload[id];

    if (required && isMissingSubmissionValue(value)) {
      throw new Error("Please complete all required fields");
    }
    if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
      continue;
    }

    switch (type) {
      case "TextField":
        if (typeof value !== "string" || value.length > 10_000) {
          throw new Error("Invalid text field value");
        }
        normalized[id] = value;
        break;
      case "NumberField":
        if (
          typeof value !== "string" ||
          value.length > 100 ||
          !Number.isFinite(Number(value))
        ) {
          throw new Error("Invalid number field value");
        }
        normalized[id] = value;
        break;
      case "DatePicker":
        if (
          typeof value !== "string" ||
          !isValidCalendarDate(value)
        ) {
          throw new Error("Invalid date field value");
        }
        normalized[id] = value;
        break;
      case "Select":
      case "Radio": {
        const options = getElementOptions(element);
        if (typeof value !== "string" || !options.includes(value)) {
          throw new Error("Invalid option selected");
        }
        normalized[id] = value;
        break;
      }
      case "Checkbox": {
        const options = getElementOptions(element);
        if (options.length > 0) {
          if (
            !Array.isArray(value) ||
            value.length > options.length ||
            value.some(
              (option) => typeof option !== "string" || !options.includes(option),
            ) ||
            new Set(value).size !== value.length
          ) {
            throw new Error("Invalid checkbox selection");
          }
          normalized[id] = value;
        } else {
          if (typeof value !== "boolean") {
            throw new Error("Invalid checkbox value");
          }
          normalized[id] = value;
        }
        break;
      }
    }
  }

  return JSON.stringify(normalized);
}

export const saveFormContent = async (id: string, content: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  validateContent(content);

  const result = await prisma.form.updateMany({
    where: { id: Number(id), userId },
    data: { content },
  });

  if (result.count === 0) {
    throw new Error("Form not found");
  }

  revalidatePath(`/builder/${id}`);
  revalidatePath(`/builder/${id}/preview`);
};

export const publishForm = async (id: string, content: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  validateContent(content, true);

  const shareURL = await prisma.$transaction(async (tx) => {
    const form = await tx.form.findFirst({
      where: { id: Number(id), userId },
      select: { id: true, shareURL: true },
    });

    if (!form) {
      throw new Error("Form not found");
    }

    await tx.form.update({
      where: { id: form.id },
      data: { content, published: true },
    });

    return form.shareURL;
  });

  revalidatePath(`/builder/${id}`);
  revalidatePath(`/builder/${id}/preview`);
  revalidatePath("/console");

  return shareURL;
};

function hashSubmissionKey(submissionKey: string) {
  return createHash("sha256").update(submissionKey).digest("hex");
}

function getClientIpHash(requestHeaders: Headers) {
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const forwardedIp = forwardedFor?.split(",")[0]?.trim();
  const ip = forwardedIp || requestHeaders.get("x-real-ip")?.trim();
  if (!ip) return null;

  return createHmac("sha256", getBrowserTokenSecret())
    .update(`formora-ip:${ip}`)
    .digest("hex");
}

const browserTokenCookieName = "formora_browser_token";

function getBrowserTokenSecret() {
  const secret = process.env.SUBMISSION_COOKIE_SECRET ?? process.env.CLERK_SECRET_KEY;
  if (!secret) {
    throw new Error("Submission cookie secret is not configured");
  }
  return secret;
}

function signBrowserToken(token: string) {
  return createHmac("sha256", getBrowserTokenSecret()).update(token).digest("hex");
}

function readSignedBrowserToken(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const stored = cookieStore.get(browserTokenCookieName)?.value;
  if (!stored) return null;

  const separator = stored.lastIndexOf(".");
  const token = separator > 0 ? stored.slice(0, separator) : "";
  const signature = separator > 0 ? stored.slice(separator + 1) : "";

  return token && signature === signBrowserToken(token) ? token : null;
}

function readOrCreateBrowserToken(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const existingToken = readSignedBrowserToken(cookieStore);
  if (existingToken) return existingToken;

  const token = randomBytes(32).toString("hex");
  cookieStore.set(browserTokenCookieName, `${token}.${signBrowserToken(token)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return token;
}

export const getSubmissionStatus = async (shareURL: string) => {
  validateShareURL(shareURL);
  const cookieStore = await cookies();
  const browserToken = readSignedBrowserToken(cookieStore);
  if (!browserToken) return { alreadySubmitted: false };

  const forms = await prisma.$queryRaw<Array<{ id: number; responsePolicy: string }>>`
    SELECT "id", "responsePolicy"::text AS "responsePolicy"
    FROM "Form"
    WHERE "shareURL" = ${shareURL} AND "published" = true
    LIMIT 1
  `;
  const form = forms[0];

  if (!form || form.responsePolicy !== "ONE_PER_BROWSER") {
    return { alreadySubmitted: false };
  }

  const matches = await prisma.$queryRaw<Array<{ exists: boolean }>>`
    SELECT EXISTS(
      SELECT 1
      FROM "FormSubmission"
      WHERE "formId" = ${form.id}
        AND "browserTokenHash" = ${hashSubmissionKey(browserToken)}
    ) AS "exists"
  `;

  return { alreadySubmitted: Boolean(matches[0]?.exists) };
};

export const submitForm = async (
  shareURL: string,
  content: string,
  submissionKey: string,
) => {
  validateShareURL(shareURL);

  if (
    typeof submissionKey !== "string" ||
    submissionKey.length < 16 ||
    submissionKey.length > 200
  ) {
    throw new Error("Invalid submission key");
  }

  const forms = await prisma.$queryRaw<
    Array<{
      id: number;
      content: string;
      responsePolicy: "UNLIMITED" | "ONE_PER_BROWSER";
      rateLimitPerHour: number;
    }>
  >`
    SELECT "id", "content", "responsePolicy"::text AS "responsePolicy", "rateLimitPerHour"
    FROM "Form"
    WHERE "shareURL" = ${shareURL} AND "published" = true
    LIMIT 1
  `;
  const form = forms[0];

  if (!form) {
    throw new Error("Form not found");
  }

  const validatedContent = validateSubmission(form.content, content);
  const submissionKeyHash = hashSubmissionKey(submissionKey);
  const requestHeaders = await headers();
  const ipHash = getClientIpHash(requestHeaders);

  const existingSubmission = await prisma.$queryRaw<Array<{ id: number }>>`
    SELECT "id"
    FROM "FormSubmission"
    WHERE "formId" = ${form.id} AND "submissionKeyHash" = ${submissionKeyHash}
    LIMIT 1
  `;
  if (existingSubmission[0]) {
    return { duplicate: true };
  }

  if (ipHash && form.rateLimitPerHour > 0) {
    const windowStart = new Date(Date.now() - 60 * 60 * 1000);
    const recentSubmissions = await prisma.formSubmission.count({
      where: {
        formId: form.id,
        ipHash,
        createdAt: { gte: windowStart },
      },
    });

    if (recentSubmissions >= form.rateLimitPerHour) {
      throw new Error("This form has reached its hourly response limit for your network. Please try again later.");
    }
  }

  const cookieStore = await cookies();
  const browserTokenHash =
    form.responsePolicy === "ONE_PER_BROWSER"
      ? hashSubmissionKey(readOrCreateBrowserToken(cookieStore))
      : null;

  try {
    return await prisma.$transaction(async (tx) => {
      const submission = await tx.formSubmission.create({
        data: {
          formId: form.id,
          content: validatedContent,
          submissionKeyHash,
          browserTokenHash,
          ipHash,
        },
      });

      await tx.form.update({
        where: { id: form.id },
        data: { submissions: { increment: 1 } },
      });

      return { duplicate: false, submissionId: submission.id };
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { duplicate: true };
    }

    throw error;
  }
};
