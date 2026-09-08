import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/supabase/auth-server";
import { getOrdersForCustomer } from "@/lib/queries/orders";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const orders = await getOrdersForCustomer(user.id);
  return NextResponse.json({ orders });
}
