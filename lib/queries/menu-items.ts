import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mapProduct } from "@/lib/supabase/mappers";
import type { Product } from "@/types/marketplace";

type MenuItemWithRestaurant = Record<string, unknown> & {
  restaurants?: { name: string; delivery_fee: number } | null;
};

function extractRestaurantInfo(row: MenuItemWithRestaurant) {
  const restaurant = row.restaurants;
  if (!restaurant) return undefined;
  return { name: restaurant.name, deliveryFee: restaurant.delivery_fee };
}

const MENU_ITEM_SELECT = "*, restaurants!inner(name, delivery_fee, status)";

export async function getProductsByRestaurantId(restaurantId: string): Promise<Product[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select(MENU_ITEM_SELECT)
    .eq("restaurant_id", restaurantId)
    .eq("restaurants.status", "active")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getProductsByRestaurantId failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapProduct(row as any, extractRestaurantInfo(row as MenuItemWithRestaurant))
  );
}

export async function getBestSellers(limit = 5): Promise<Product[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select(MENU_ITEM_SELECT)
    .eq("is_bestseller", true)
    .eq("restaurants.status", "active")
    .order("rating", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getBestSellers failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapProduct(row as any, extractRestaurantInfo(row as MenuItemWithRestaurant))
  );
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select(MENU_ITEM_SELECT)
    .in("id", ids)
    .eq("restaurants.status", "active");

  if (error) {
    console.error("getProductsByIds failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapProduct(row as any, extractRestaurantInfo(row as MenuItemWithRestaurant))
  );
}

export async function getProductsByRestaurantIds(restaurantIds: string[]): Promise<Product[]> {
  if (restaurantIds.length === 0) return [];
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select(MENU_ITEM_SELECT)
    .in("restaurant_id", restaurantIds)
    .eq("restaurants.status", "active")
    .order("is_bestseller", { ascending: false });

  if (error) {
    console.error("getProductsByRestaurantIds failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapProduct(row as any, extractRestaurantInfo(row as MenuItemWithRestaurant))
  );
}
