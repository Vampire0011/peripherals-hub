import type { Page } from "playwright";
import { RawScrapedProduct, Category, ConnectionType } from "@/types";

/**
 * Real scraping path. Targets come from the SCRAPE_TARGETS env var (JSON array):
 *   [{"sku":"MOU-X","url":"https://...","category":"MOUSE","connectionType":"WIRELESS","platform":"acme"}]
 * Extraction is generic: schema.org JSON-LD Product first, then OpenGraph/product meta tags.
 * For sites without structured data, add a site-specific extractor in ./adapters.
 */
export interface ScrapeTarget {
  sku: string;
  url: string;
  category: Category;
  connectionType: ConnectionType;
  platform: string;
  switches?: string;
  sensor?: string;
  weight?: string;
}

export function loadTargets(): ScrapeTarget[] {
  try {
    const parsed = JSON.parse(process.env.SCRAPE_TARGETS ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.warn("[engine] SCRAPE_TARGETS is not valid JSON; ignoring.");
    return [];
  }
}

interface Extracted { title: string; price: number; imageUrl: string }

async function extractGeneric(page: Page): Promise<Extracted> {
  return page.evaluate(() => {
    const meta = (n: string) =>
      document.querySelector<HTMLMetaElement>(`meta[property="${n}"],meta[name="${n}"]`)?.content ?? "";
    let title = "", price = "", image = "";

    for (const el of Array.from(document.querySelectorAll('script[type="application/ld+json"]'))) {
      try {
        const data = JSON.parse(el.textContent ?? "null");
        const nodes: any[] = Array.isArray(data) ? data : data?.["@graph"] ?? [data];
        const prod = nodes.find((n) => n && (n["@type"] === "Product" || n["@type"]?.includes?.("Product")));
        if (prod) {
          title ||= prod.name ?? "";
          image ||= Array.isArray(prod.image) ? prod.image[0] : prod.image ?? "";
          const offer = Array.isArray(prod.offers) ? prod.offers[0] : prod.offers;
          price ||= String(offer?.price ?? offer?.lowPrice ?? "");
        }
      } catch { /* ignore malformed JSON-LD */ }
    }
    title ||= meta("og:title") || document.title;
    image ||= meta("og:image");
    price ||= meta("product:price:amount") || meta("og:price:amount");
    return { title, price: parseFloat(price.replace(/[^0-9.]/g, "")), imageUrl: image };
  });
}

export async function fetchPlaywrightFeed(): Promise<RawScrapedProduct[]> {
  const targets = loadTargets();
  if (targets.length === 0) throw new Error("No SCRAPE_TARGETS configured");

  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const out: RawScrapedProduct[] = [];

  try {
    const ctx = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    });
    for (const t of targets) {
      const page = await ctx.newPage();
      try {
        await page.goto(t.url, { waitUntil: "domcontentloaded", timeout: 30_000 });
        const x = await extractGeneric(page);
        if (!x.title || !Number.isFinite(x.price)) throw new Error("title/price not found on page");
        out.push({
          sku: t.sku, title: x.title, category: t.category, price: x.price,
          imageUrl: x.imageUrl || `/products/${t.sku}.svg`, buyUrl: t.url,
          connectionType: t.connectionType, switches: t.switches, sensor: t.sensor,
          weight: t.weight, sourcePlatform: t.platform,
        });
      } catch (err) {
        console.error(`[engine] ${t.platform}/${t.sku} failed:`, (err as Error).message);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  return out;
}
