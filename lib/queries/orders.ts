import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { mapOrder } from "@/lib/supabase/mappers";
import type { Order } from "@/types/marketplace";

// NOTE: orders/order_items intentionally have NO public RLS read policy
// (see the row_level_security_policies migration) — order data is private.
// These queries use the service-role admin client instead, which is safe
// here because this file only ever runs in Server Components (never
// shipped to the browser). Today that means "show all orders" since there
// is no customer auth yet; once login exists, filter by the signed-in
// customer_id here rather than opening a public RLS policy on orders.

export async function getOrders(limit = 20): Promise<Order[]> {
  let supabase;
  try {
    supabase = createAdminSupabaseClient();
  } catch (err) {
    console.error("getOrders: admin client unavailable —", (err as Error).message);
    return [];
  }

  const { data: orderRows, error } = await supabase
    .from("orders")
    .select("*, restaurants(name)")
    .order("placed_at", { ascending: false })
    .limit(limit);

  if (error || !orderRows) {
    console.error("getOrders failed:", error?.message);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = orderRows as any[];
  const orderIds = rows.map((o) => o.id);
  const { data: itemRows } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderIds.length > 0 ? orderIds : ["00000000-0000-0000-0000-000000000000"]);

  return rows.map((row) => {
    const items = (itemRows ?? []).filter((i) => i.order_id === row.id);
    const restaurantName = row.restaurants?.name as string | undefined;
    return mapOrder(row, items, restaurantName);
  });
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  let supabase;
  try {
    supabase = createAdminSupabaseClient();
  } catch (err) {
    console.error("getOrderByNumber: admin client unavailable —", (err as Error).message);
    return null;
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("*, restaurants(name)")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error || !order) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = order as any;

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", row.id);

  const restaurantName = row.restaurants?.name as string | undefined;
  return mapOrder(row, items ?? [], restaurantName);
}
