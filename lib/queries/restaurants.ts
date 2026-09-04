import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mapRestaurant } from "@/lib/supabase/mappers";
import type { Restaurant } from "@/types/marketplace";

// Nested select shape: each restaurant row plus its joined category slugs
// via the restaurant_categories junction table.
type RestaurantWithCategories = Record<string, unknown> & {
  restaurant_categories?: { categories: { slug: string } | null }[] | null;
};

function extractCategorySlugs(row: RestaurantWithCategories): string[] {
  return (row.restaurant_categories ?? [])
    .map((rc) => rc.categories?.slug)
    .filter((slug): slug is string => Boolean(slug));
}

const RESTAURANT_SELECT = "*, restaurant_categories(categories(slug))";

export async function getAllRestaurants(): Promise<Restaurant[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("restaurants")
    .select(RESTAURANT_SELECT)
    .eq("status", "active")
    .order("is_featured", { ascending: false })
    .order("rating", { ascending: false });

  if (error) {
    console.error("getAllRestaurants failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapRestaurant(row as any, extractCategorySlugs(row as RestaurantWithCategories))
  );
}

export async function getFeaturedRestaurants(limit = 4): Promise<Restaurant[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("restaurants")
    .select(RESTAURANT_SELECT)
    .eq("status", "active")
    .eq("is_featured", true)
    .order("rating", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getFeaturedRestaurants failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapRestaurant(row as any, extractCategorySlugs(row as RestaurantWithCategories))
  );
}

export async function getRestaurantsByCategory(categorySlug: string): Promise<Restaurant[]> {
  if (categorySlug === "all") return getAllRestaurants();

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("restaurants")
    .select(
      "*, restaurant_categories!inner(categories!inner(slug))"
    )
    .eq("status", "active")
    .eq("restaurant_categories.categories.slug", categorySlug)
    .order("rating", { ascending: false });

  if (error) {
    console.error("getRestaurantsByCategory failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapRestaurant(row as any, extractCategorySlugs(row as RestaurantWithCategories))
  );
}

export async function getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("restaurants")
    .select(RESTAURANT_SELECT)
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return mapRestaurant(data as any, extractCategorySlugs(data as RestaurantWithCategories));
}

export async function getRestaurantsByIds(ids: string[]): Promise<Restaurant[]> {
  if (ids.length === 0) return [];
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("restaurants")
    .select(RESTAURANT_SELECT)
    .in("id", ids)
    .eq("status", "active");

  if (error) {
    console.error("getRestaurantsByIds failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapRestaurant(row as any, extractCategorySlugs(row as RestaurantWithCategories))
  );
}
