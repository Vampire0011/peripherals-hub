/**
 * Monetization: Affiliate Tag Generator
 * -------------------------------------
 * Appends country-specific affiliate/tracking IDs to an outbound buy URL.
 * Falls back to AFFILIATE_TAG_DEFAULT when no country-specific tag exists.
 *
 * Tags are sourced from environment variables so they can be rotated
 * without a redeploy of application code:
 *   AFFILIATE_TAG_DEFAULT, AFFILIATE_TAG_US, AFFILIATE_TAG_UK, AFFILIATE_TAG_IN, ...
 */

export type CountryCode = "US" | "UK" | "IN" | "DEFAULT";

function resolveTag(country: CountryCode): string {
  const key = `AFFILIATE_TAG_${country}`;
  return process.env[key] || process.env.AFFILIATE_TAG_DEFAULT || "peripheralshub-20";
}

/**
 * localizeAffiliateLink
 * Appends (or replaces) the `tag` query parameter on a product URL based
 * on the visitor's country, so click-throughs are attributed correctly.
 */
export function localizeAffiliateLink(url: string, country: CountryCode = "DEFAULT"): string {
  try {
    const parsed = new URL(url);
    const tag = resolveTag(country);
    parsed.searchParams.set("tag", tag);
    parsed.searchParams.set("ref", "peripheralshub");
    return parsed.toString();
  } catch {
    // If the stored buyUrl is malformed, return it untouched rather than throw.
    return url;
  }
}

/** Resolve the visitor's country from CDN/edge geo headers (Vercel, Cloudflare). */
export function detectCountry(headers: Headers): CountryCode {
  const raw = (headers.get("x-vercel-ip-country") ?? headers.get("cf-ipcountry") ?? "").toUpperCase();
  if (raw === "US") return "US";
  if (raw === "GB" || raw === "UK") return "UK";
  if (raw === "IN") return "IN";
  return "DEFAULT";
}
