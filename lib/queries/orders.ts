import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { mapOrder } from "@/lib/supabase/mappers";
import type { Order } from "@/types/marketplace";

async function fetchOrders(customerId?: string, limit = 20): Promise<Order[]> {
  let supabase;
  try {
    supabase = createAdminSupabaseClient();
  } catch (err) {
    console.error("fetchOrders: admin client unavailable —", (err as Error).message);
    return [];
  }

  let orderQuery = supabase
    .from("orders")
    .select("*, restaurants(name)")
    .order("placed_at", { ascending: false })
    .limit(limit);
  if (customerId) orderQuery = orderQuery.eq("customer_id", customerId);

  const { data: orderRows, error } = await orderQuery;
  if (error || !orderRows) {
    console.error("fetchOrders failed:", error?.message);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = orderRows as any[];
  const orderIds = rows.map((order) => order.id);
  const { data: itemRows } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderIds.length > 0 ? orderIds : ["00000000-0000-0000-0000-000000000000"]);

  return rows.map((row) => {
    const items = (itemRows ?? []).filter((item) => item.order_id === row.id);
    const restaurantName = row.restaurants?.name as string | undefined;
    return mapOrder(row, items, restaurantName);
  });
}

export function getOrders(limit = 20) {
  return fetchOrders(undefined, limit);
}

export function getOrdersForCustomer(customerId: string, limit = 20) {
  return fetchOrders(customerId, limit);
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
  const { data: items } = await supabase.from("order_items").select("*").eq("order_id", row.id);
  const restaurantName = row.restaurants?.name as string | undefined;
  return mapOrder(row, items ?? [], restaurantName);
}
