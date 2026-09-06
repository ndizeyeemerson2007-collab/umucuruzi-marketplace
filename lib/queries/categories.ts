import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mapCategory } from "@/lib/supabase/mappers";
import type { Category } from "@/types/marketplace";

export async function getCategories(): Promise<Category[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getCategories failed:", error.message);
    return [];
  }

  return (data ?? []).map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return mapCategory(data);
}
