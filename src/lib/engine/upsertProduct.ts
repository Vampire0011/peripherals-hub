import { prisma } from "@/lib/prisma";
import { RawScrapedProduct } from "@/types";

export type UpsertResult =
  | { action: "created"; sku: string; title: string }
  | { action: "updated"; sku: string; title: string; oldPrice: number; newPrice: number }
  | { action: "unchanged"; sku: string; title: string };

/**
 * Deduplication logic: a product is uniquely identified by its SKU.
 * - If it exists: update price (moving old price -> oldPrice) and log a
 *   PriceHistory entry so the Price Trend Visualizer has data to work with.
 * - If it does not exist: create a new Product record.
 */
export async function upsertProduct(item: RawScrapedProduct): Promise<UpsertResult> {
  const existing = await prisma.product.findUnique({ where: { sku: item.sku } });

  if (!existing) {
    await prisma.product.create({
      data: {
        sku: item.sku,
        title: item.title,
        category: item.category,
        price: item.price,
        oldPrice: null,
        imageUrl: item.imageUrl,
        buyUrl: item.buyUrl,
        sourcePlatform: item.sourcePlatform,
        connectionType: item.connectionType,
        switches: item.switches ?? null,
        sensor: item.sensor ?? null,
        weight: item.weight ?? null,
        isAvailable: true,
        priceHistory: {
          create: { price: item.price },
        },
      },
    });
    return { action: "created", sku: item.sku, title: item.title };
  }

  const priceChanged = existing.price !== item.price;

  if (!priceChanged) {
    // Still log a price-history checkpoint so trend data reflects check frequency.
    await prisma.priceHistory.create({
      data: { productId: existing.id, price: item.price },
    });
    return { action: "unchanged", sku: item.sku, title: item.title };
  }

  await prisma.product.update({
    where: { id: existing.id },
    data: {
      price: item.price,
      oldPrice: existing.price,
      imageUrl: item.imageUrl,
      buyUrl: item.buyUrl,
      isAvailable: true,
      priceHistory: {
        create: { price: item.price },
      },
    },
  });

  return {
    action: "updated",
    sku: item.sku,
    title: item.title,
    oldPrice: existing.price,
    newPrice: item.price,
  };
}
