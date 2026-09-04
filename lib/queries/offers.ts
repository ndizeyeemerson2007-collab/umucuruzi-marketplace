import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mapOffer } from "@/lib/supabase/mappers";
import type { Offer } from "@/types/marketplace";

export async function getActiveOffers(limit?: number): Promise<Offer[]> {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("offers")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getActiveOffers failed:", error.message);
    return [];
  }

  return (data ?? []).map(mapOffer);
}
