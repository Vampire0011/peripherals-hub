import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { detectCountry, localizeAffiliateLink } from "@/lib/affiliate";

/**
 * Outbound redirect. Affiliate tags are applied here, on the server, because
 * env vars are not available to client components. Cards link to /go/<id>.
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    select: { buyUrl: true },
  });
  if (!product) return NextResponse.redirect(new URL("/", req.url));

  const target = localizeAffiliateLink(product.buyUrl, detectCountry(req.headers));
  return NextResponse.redirect(target, 307);
}
