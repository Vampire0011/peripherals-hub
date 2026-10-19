import { prisma } from "@/lib/prisma";
import { fetchMockFeed } from "./mockSource";
import { fetchPlaywrightFeed } from "./playwrightSource";
import { upsertProduct, UpsertResult } from "./upsertProduct";

export interface SyncSummary {
  total: number;
  created: number;
  updated: number;
  unchanged: number;
  startedAt: string;
  finishedAt: string;
}

async function log(message: string, level: "info" | "success" | "warn" | "error" = "info") {
  await prisma.syncLog.create({ data: { message, level } });
}

/**
 * Runs a full ingestion cycle. Mode is controlled by SYNC_MODE env var:
 * - "mock": uses the instant simulated feed (default, safe for demos/tests)
 * - "playwright": launches headless browser scraping against configured targets
 *
 * All activity is written to the SyncLog table so the admin panel can show
 * a live-updating console of engine activity.
 */
export async function runSync(mode: "mock" | "playwright" = "mock"): Promise<SyncSummary> {
  const startedAt = new Date().toISOString();
  await log(`Sync started (mode=${mode})`, "info");

  let feed: Awaited<ReturnType<typeof fetchMockFeed>> = [];
  if (mode === "playwright") {
    try {
      feed = await fetchPlaywrightFeed();
    } catch (err) {
      await log(`Playwright unavailable (${(err as Error).message}) - falling back to mock feed.`, "warn");
    }
    if (feed.length === 0) {
      await log("Scraper returned nothing - falling back to mock feed.", "warn");
      feed = await fetchMockFeed();
    }
  } else {
    feed = await fetchMockFeed();
  }
  const stepDelay = Number(process.env.SYNC_STEP_DELAY_MS ?? 150); // keeps the admin console visibly "live"

  if (feed.length === 0) {
    await log("No products returned from source feed.", "warn");
  }

  const results: UpsertResult[] = [];

  for (const item of feed) {
    if (stepDelay > 0) await new Promise((r) => setTimeout(r, stepDelay));
    try {
      const result = await upsertProduct(item);
      results.push(result);

      if (result.action === "created") {
        await log(`Created: "${result.title}" (${result.sku})`, "success");
      } else if (result.action === "updated") {
        await log(
          `Updated: "${result.title}" (${result.sku}) — $${result.oldPrice.toFixed(2)} → $${result.newPrice.toFixed(2)}`,
          "success"
        );
      } else {
        await log(`No change: "${result.title}" (${result.sku})`, "info");
      }
    } catch (err) {
      await log(`Failed to process ${item.sku}: ${(err as Error).message}`, "error");
    }
  }

  const summary: SyncSummary = {
    total: feed.length,
    created: results.filter((r) => r.action === "created").length,
    updated: results.filter((r) => r.action === "updated").length,
    unchanged: results.filter((r) => r.action === "unchanged").length,
    startedAt,
    finishedAt: new Date().toISOString(),
  };

  await log(
    `Sync finished — ${summary.created} created, ${summary.updated} updated, ${summary.unchanged} unchanged.`,
    "success"
  );

  return summary;
}
