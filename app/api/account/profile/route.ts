import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getUserFromRequest } from "@/lib/supabase/auth-server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  let body: { name?: string; email?: string; phone?: string } = {};
  try {
    body = await request.json();
  } catch {
    // A profile can still be created from Auth metadata when the body is empty.
  }

  try {
    const supabase = createAdminSupabaseClient();
    const name = (body.name ?? user.user_metadata?.full_name ?? "").trim() || null;
    const email = (body.email ?? user.email ?? "").trim() || null;
    const phone = (body.phone ?? user.phone ?? "").trim() || null;
    const { error } = await supabase.from("customers").upsert(
      {
        id: user.id,
        name,
        email,
        phone,
        avatar_url: user.user_metadata?.avatar_url ?? null,
      },
      { onConflict: "id" },
    );

    if (error) {
      console.error("Customer profile sync failed:", error.message);
      return NextResponse.json({ error: "Could not save your profile." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Account service unavailable." },
      { status: 503 },
    );
  }
}
