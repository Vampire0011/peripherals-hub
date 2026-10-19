"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { computePriceTrend } from "@/lib/priceTrend";
import { revalidatePath } from "next/cache";
import { ProductDTO } from "@/types";

export async function getProducts(): Promise<ProductDTO[]> {
  const session = await auth();

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      priceHistory: { orderBy: { checkedAt: "desc" }, take: 20 },
      wishlistedBy: session?.user?.id ? { where: { userId: session.user.id } } : false,
    },
  });

  return products.map((p) => {
    const trend = computePriceTrend(p.price, p.priceHistory);
    return {
      id: p.id,
      sku: p.sku,
      title: p.title,
      category: p.category as ProductDTO["category"],
      price: p.price,
      oldPrice: p.oldPrice,
      currency: p.currency,
      imageUrl: p.imageUrl,
      buyUrl: p.buyUrl,
      sourcePlatform: p.sourcePlatform,
      connectionType: p.connectionType as ProductDTO["connectionType"],
      switches: p.switches,
      sensor: p.sensor,
      weight: p.weight,
      isAvailable: p.isAvailable,
      isWishlisted: Array.isArray(p.wishlistedBy) ? p.wishlistedBy.length > 0 : false,
      priceDrop: { isDrop: trend.isDrop, dropPercent: trend.dropPercent },
    };
  });
}

export async function toggleWishlist(productId: string): Promise<{ wishlisted: boolean }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be signed in to save favorites.");
  }

  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { wishlisted: false };
  }

  await prisma.wishlist.create({
    data: { userId: session.user.id, productId },
  });
  revalidatePath("/");
  revalidatePath("/dashboard");
  return { wishlisted: true };
}

export async function getUserWishlist(): Promise<ProductDTO[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const items = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: { product: { include: { priceHistory: { orderBy: { checkedAt: "desc" }, take: 20 } } } },
    orderBy: { createdAt: "desc" },
  });

  return items.map(({ product: p }) => {
    const trend = computePriceTrend(p.price, p.priceHistory);
    return {
      id: p.id,
      sku: p.sku,
      title: p.title,
      category: p.category as ProductDTO["category"],
      price: p.price,
      oldPrice: p.oldPrice,
      currency: p.currency,
      imageUrl: p.imageUrl,
      buyUrl: p.buyUrl,
      sourcePlatform: p.sourcePlatform,
      connectionType: p.connectionType as ProductDTO["connectionType"],
      switches: p.switches,
      sensor: p.sensor,
      weight: p.weight,
      isAvailable: p.isAvailable,
      isWishlisted: true,
      priceDrop: { isDrop: trend.isDrop, dropPercent: trend.dropPercent },
    };
  });
}
