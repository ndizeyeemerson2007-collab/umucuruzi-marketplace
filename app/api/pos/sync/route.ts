import { NextRequest, NextResponse } from "next/server";
import {
  fetchRestaurantFromPosApi,
  upsertRestaurantFromPos,
  validatePosRestaurantPayload,
} from "@/lib/pos/sync";

export const dynamic = "force-dynamic";

/**
 * POS → Marketplace sync endpoint.
 *
 * This route is fully implemented but not wired up to anything yet — the
 * POS integration hasn't been designed, so nothing in this app calls it
 * automatically. Once it is:
 *
 *  - PUSH model: the POS calls `POST /api/pos/sync` directly with a full
 *    restaurant + menu JSON body (see lib/pos/types.ts for the shape).
 *  - PULL model: the POS instead calls this route with just
 *    `{ "pos_restaurant_id": "..." }`, and this route fetches the full
 *    payload from POS_API_BASE_URL itself (only works once that env var is
 *    set — see .env.local.example).
 *
 * Either way, every request must include the shared secret configured in
 * POS_WEBHOOK_SECRET so random requests can't rewrite restaurant/menu data.
 */
export async function POST(request: NextRequest) {
  const expectedSecret = process.env.POS_WEBHOOK_SECRET;
  if (!expectedSecret) {
    return NextResponse.json(
      {
        error:
          "POS sync is not configured yet. Set POS_WEBHOOK_SECRET (and POS_API_BASE_URL / POS_API_KEY for the pull model) in .env.local when the POS API is ready.",
      },
      { status: 503 }
    );
  }

  const providedSecret = request.headers.get("x-pos-webhook-secret");
  if (providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Invalid or missing webhook secret." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const isPullRequest =
      body &&
      typeof body === "object" &&
      "pos_restaurant_id" in body &&
      !("menu" in body);

    const payload = isPullRequest
      ? await fetchRestaurantFromPosApi((body as { pos_restaurant_id: string }).pos_restaurant_id)
      : validatePosRestaurantPayload(body);

    const result = await upsertRestaurantFromPos(payload);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ready",
    configured: Boolean(process.env.POS_WEBHOOK_SECRET),
    message:
      "POS sync endpoint is implemented but idle. POST a restaurant+menu payload with the x-pos-webhook-secret header once the POS API is finalized.",
  });
}
