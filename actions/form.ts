"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
  redirect(`/builder/${form.id}`);
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