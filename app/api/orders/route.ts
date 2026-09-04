import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { PaymentMethod } from "@/types/marketplace";

export const dynamic = "force-dynamic";

interface CreateOrderBody {
  restaurantId: string;
  items: { productId: string; quantity: number; specialInstructions?: string }[];
  deliveryAddress: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

/**
 * Creates an order. Runs entirely server-side with the service-role client
 * (orders has no public write policy) and — importantly — recomputes prices
 * and the delivery fee from the current `menu_items` / `restaurants` rows
 * rather than trusting whatever the client sent, so a tampered request body
 * can't place a discounted order.
 */
export async function POST(request: NextRequest) {
  let body: CreateOrderBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.restaurantId || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { error: "restaurantId and a non-empty items array are required." },
      { status: 400 }
    );
  }

  let supabase;
  try {
    supabase = createAdminSupabaseClient();
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 503 }
    );
  }

  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("id, name, delivery_fee, status")
    .eq("id", body.restaurantId)
    .maybeSingle();

  if (restaurantError || !restaurant || restaurant.status !== "active") {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const productIds = body.items.map((i) => i.productId);
  const { data: products, error: productsError } = await supabase
    .from("menu_items")
    .select("id, name, price, available, restaurant_id")
    .in("id", productIds);

  if (productsError || !products || products.length === 0) {
    return NextResponse.json({ error: "Could not load order items." }, { status: 400 });
  }

  let orderItems: {
    product_id: string;
    name: string;
    quantity: number;
    price: number;
    special_instructions: string | null;
  }[];

  try {
    orderItems = body.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.restaurant_id !== body.restaurantId) {
        throw new Error(`Item ${item.productId} does not belong to this restaurant.`);
      }
      if (!product.available) {
        throw new Error(`${product.name} is sold out.`);
      }
      return {
        product_id: product.id,
        name: product.name,
        quantity: Math.max(1, item.quantity),
        price: product.price,
        special_instructions: item.specialInstructions ?? null,
      };
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid order items.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  let subtotal = 0;
  for (const item of orderItems) subtotal += item.price * item.quantity;
  const deliveryFee = restaurant.delivery_fee;
  const total = subtotal + deliveryFee;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      restaurant_id: body.restaurantId,
      customer_name: body.customerName ?? null,
      customer_phone: body.customerPhone ?? null,
      status: "confirmed",
      subtotal,
      delivery_fee: deliveryFee,
      total,
      delivery_address: body.deliveryAddress,
      payment_method: body.paymentMethod,
      notes: body.notes ?? null,
      source: "marketplace",
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Could not create order." }, { status: 500 });
  }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems.map((item) => ({ ...item, order_id: order.id })));

  if (itemsError) {
    return NextResponse.json({ error: "Could not save order items." }, { status: 500 });
  }

  return NextResponse.json({
    id: order.id,
    orderNumber: order.order_number,
    subtotal,
    deliveryFee,
    total,
  });
}
