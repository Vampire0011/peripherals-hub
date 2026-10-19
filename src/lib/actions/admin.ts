"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { runSync, SyncSummary } from "@/lib/engine/syncEngine";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Forbidden: admin access required.");
  }
  return session;
}

export async function triggerSync(mode: "mock" | "playwright" = "mock"): Promise<SyncSummary> {
  await requireAdmin();
  const summary = await runSync(mode);
  revalidatePath("/admin");
  revalidatePath("/");
  return summary;
}

export async function getSyncLogs(limit = 50) {
  await requireAdmin();
  return prisma.syncLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getAdminStats() {
  await requireAdmin();
  const [productCount, userCount, mouseCount, keyboardCount] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.product.count({ where: { category: "MOUSE" } }),
    prisma.product.count({ where: { category: "KEYBOARD" } }),
  ]);
  return { productCount, userCount, mouseCount, keyboardCount };
}
