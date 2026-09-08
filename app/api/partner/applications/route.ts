import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getUserFromRequest } from "@/lib/supabase/auth-server";

export const dynamic = "force-dynamic";

interface PartnerApplicationBody {
  businessName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  businessType?: string;
  location?: string;
  notes?: string;
  acceptsPrivacyTerms?: boolean;
  authorizesPosAndSubscription?: boolean;
}

export async function POST(request: NextRequest) {
  let body: PartnerApplicationBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const requiredFields = [
    ["businessName", body.businessName],
    ["contactName", body.contactName],
    ["email", body.email],
    ["phone", body.phone],
    ["businessType", body.businessType],
    ["location", body.location],
  ] as const;
  const missingField = requiredFields.find(([, value]) => !String(value ?? "").trim());
  if (missingField) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  const email = body.email!.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!body.acceptsPrivacyTerms) {
    return NextResponse.json(
      { error: "You must accept the Privacy Policy and Terms before applying." },
      { status: 400 },
    );
  }

  const user = await getUserFromRequest(request);
  try {
    const supabase = createAdminSupabaseClient();
    if (user) {
      await supabase.from("customers").upsert(
        {
          id: user.id,
          name: body.contactName!.trim(),
          email: user.email ?? email,
          phone: body.phone!.trim(),
        },
        { onConflict: "id" },
      );
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("partner_applications")
      .insert({
        customer_id: user?.id ?? null,
        business_name: body.businessName!.trim(),
        contact_name: body.contactName!.trim(),
        email,
        phone: body.phone!.trim(),
        business_type: body.businessType!.trim(),
        location: body.location!.trim(),
        notes: body.notes?.trim() || null,
        accepts_privacy_terms: true,
        privacy_terms_accepted_at: now,
        authorizes_pos_and_subscription: Boolean(body.authorizesPosAndSubscription),
        pos_subscription_accepted_at: body.authorizesPosAndSubscription ? now : null,
      })
      .select("id, status, created_at")
      .single();

    if (error || !data) {
      console.error("Partner application insert failed:", error?.message);
      return NextResponse.json({ error: "Could not submit your application." }, { status: 500 });
    }

    return NextResponse.json({ applicationId: data.id, status: data.status });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Partner application service unavailable." },
      { status: 503 },
    );
  }
}
