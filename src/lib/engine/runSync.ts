/**
 * Standalone CLI runner: `npm run sync:mock`
 * Useful for cron jobs / CI pipelines outside of the Next.js server context.
 */
import { runSync } from "./syncEngine";

async function main() {
  const mode = (process.env.SYNC_MODE as "mock" | "playwright") || "mock";
  const summary = await runSync(mode);
  console.log("Sync summary:", summary);
  process.exit(0);
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
