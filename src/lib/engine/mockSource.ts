import { RawScrapedProduct } from "@/types";

/**
 * Simulated upstream feed. In a real deployment this would be replaced by
 * calls into retailer APIs or the Playwright scraper (see playwrightSource.ts).
 * Prices are randomly jittered on each call to emulate live price changes,
 * which drives the Price Trend Visualizer.
 */
const BASE_CATALOG: Omit<RawScrapedProduct, "price">[] = [
  {
    sku: "MOU-LGT2S",
    title: "Logitech G Pro X Superlight 2",
    category: "MOUSE",
    imageUrl: "/products/MOU-LGT2S.svg",
    buyUrl: "https://www.logitechg.com/en-us/products/gaming-mice/pro-x-superlight-2.html",
    connectionType: "WIRELESS",
    sensor: "HERO 2 32K DPI",
    weight: "60g",
    sourcePlatform: "logitech",
  },
  {
    sku: "MOU-RAZ-VP2",
    title: "Razer Viper V2 Pro",
    category: "MOUSE",
    imageUrl: "/products/MOU-RAZ-VP2.svg",
    buyUrl: "https://www.razer.com/gaming-mice/razer-viper-v2-pro",
    connectionType: "WIRELESS",
    sensor: "Focus Pro 30K",
    weight: "58g",
    sourcePlatform: "razer",
  },
  {
    sku: "MOU-ZOW-EC2",
    title: "Zowie EC2-C",
    category: "MOUSE",
    imageUrl: "/products/MOU-ZOW-EC2.svg",
    buyUrl: "https://zowie.benq.com/en/product/mouse/ec-c.html",
    connectionType: "WIRED",
    sensor: "3395 Optical",
    weight: "73g",
    sourcePlatform: "benq",
  },
  {
    sku: "KEY-WOO-R2",
    title: "Wooting 60HE+",
    category: "KEYBOARD",
    imageUrl: "/products/KEY-WOO-R2.svg",
    buyUrl: "https://wooting.io/wooting-60he",
    connectionType: "WIRED",
    switches: "Lekker60 Analog Hall Effect",
    weight: "650g",
    sourcePlatform: "wooting",
  },
  {
    sku: "KEY-KEYD-V3",
    title: "Keychron Q3 Max",
    category: "KEYBOARD",
    imageUrl: "/products/KEY-KEYD-V3.svg",
    buyUrl: "https://www.keychron.com/products/keychron-q3-max-qmk-via-wireless-custom-mechanical-keyboard",
    connectionType: "WIRELESS",
    switches: "Gateron Jupiter Banana",
    weight: "1155g",
    sourcePlatform: "keychron",
  },
  {
    sku: "KEY-CORS-K70",
    title: "Corsair K70 Pro TKL",
    category: "KEYBOARD",
    imageUrl: "/products/KEY-CORS-K70.svg",
    buyUrl: "https://www.corsair.com/us/en/p/gaming-keyboards/k70-pro-tkl",
    connectionType: "WIRED",
    switches: "Corsair MLX Red",
    weight: "800g",
    sourcePlatform: "corsair",
  },
  {
    sku: "MOU-PULSAR-X2V2",
    title: "Pulsar X2V2 Mini",
    category: "MOUSE",
    imageUrl: "/products/MOU-PULSAR-X2V2.svg",
    buyUrl: "https://www.pulsargg.com/products/pulsar-x2v2-wireless-gaming-mouse",
    connectionType: "WIRELESS",
    sensor: "PAW3395",
    weight: "52g",
    sourcePlatform: "pulsar",
  },
  {
    sku: "KEY-NUPHY-AIR75",
    title: "NuPhy Air75 V2",
    category: "KEYBOARD",
    imageUrl: "/products/KEY-NUPHY-AIR75.svg",
    buyUrl: "https://nuphy.com/products/air75-v2",
    connectionType: "WIRELESS",
    switches: "Gateron Low-Profile 2.0",
    weight: "720g",
    sourcePlatform: "nuphy",
  },
];

function jitterPrice(base: number): number {
  const variance = base * 0.08; // +/- 8%
  const delta = (Math.random() * 2 - 1) * variance;
  return Math.round((base + delta) * 100) / 100;
}

const BASE_PRICES: Record<string, number> = {
  "MOU-LGT2S": 159.99,
  "MOU-RAZ-VP2": 149.99,
  "MOU-ZOW-EC2": 69.99,
  "KEY-WOO-R2": 174.99,
  "KEY-KEYD-V3": 219.99,
  "KEY-CORS-K70": 189.99,
  "MOU-PULSAR-X2V2": 99.99,
  "KEY-NUPHY-AIR75": 129.99,
};

export async function fetchMockFeed(): Promise<RawScrapedProduct[]> {
  // Simulate network latency of a real fetch/scrape.
  await new Promise((resolve) => setTimeout(resolve, 400));

  return BASE_CATALOG.map((item) => ({
    ...item,
    price: jitterPrice(BASE_PRICES[item.sku] ?? 99.99),
  }));
}
