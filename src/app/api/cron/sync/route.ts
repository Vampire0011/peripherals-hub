import { NextRequest, NextResponse } from "next/server";
import { runSync } from "@/lib/engine/syncEngine";

export const maxDuration = 60;

/** Scheduled sync. Secured with CRON_SECRET (Vercel Cron sends it as a Bearer token). */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const mode = (process.env.SYNC_MODE as "mock" | "playwright") || "mock";
  return NextResponse.json(await runSync(mode));
}
