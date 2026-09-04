import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slug";
import type { PosRestaurantPayload, PosSyncResult } from "./types";

/**
 * Validates an unknown request body against the expected POS payload shape.
 * Throws with a clear message on the first problem found — deliberately
 * strict, since this is the boundary where external data enters the DB.
 */
export function validatePosRestaurantPayload(body: unknown): PosRestaurantPayload {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be a JSON object.");
  }
  const b = body as Record<string, unknown>;

  if (typeof b.pos_restaurant_id !== "string" || b.pos_restaurant_id.trim() === "") {
    throw new Error("pos_restaurant_id (string) is required.");
  }
  if (typeof b.name !== "string" || b.name.trim() === "") {
    throw new Error("name (string) is required.");
  }
  if (!Array.isArray(b.menu)) {
    throw new Error("menu (array) is required.");
  }

  const menu = b.menu.map((item, idx) => {
    if (!item || typeof item !== "object") {
      throw new Error(`menu[${idx}] must be an object.`);
    }
    const m = item as Record<string, unknown>;
    if (typeof m.pos_product_id !== "string" || m.pos_product_id.trim() === "") {
      throw new Error(`menu[${idx}].pos_product_id (string) is required.`);
    }
    if (typeof m.name !== "string" || m.name.trim() === "") {
      throw new Error(`menu[${idx}].name (string) is required.`);
    }
    if (typeof m.price !== "number" || m.price < 0) {
      throw new Error(`menu[${idx}].price (non-negative number) is required.`);
    }
    return {
      pos_product_id: m.pos_product_id,
      name: m.name,
      description: typeof m.description === "string" ? m.description : undefined,
      price: m.price,
      image_url: typeof m.image_url === "string" ? m.image_url : undefined,
      menu_category: typeof m.menu_category === "string" ? m.menu_category : undefined,
      available: typeof m.available === "boolean" ? m.available : true,
      is_bestseller: typeof m.is_bestseller === "boolean" ? m.is_bestseller : false,
    };
  });

  return {
    pos_restaurant_id: b.pos_restaurant_id,
    name: b.name,
    description: typeof b.description === "string" ? b.description : undefined,
    phone: typeof b.phone === "string" ? b.phone : undefined,
    address_line: typeof b.address_line === "string" ? b.address_line : undefined,
    city: typeof b.city === "string" ? b.city : undefined,
    latitude: typeof b.latitude === "number" ? b.latitude : undefined,
    longitude: typeof b.longitude === "number" ? b.longitude : undefined,
    cover_image_url: typeof b.cover_image_url === "string" ? b.cover_image_url : undefined,
    logo_url: typeof b.logo_url === "string" ? b.logo_url : undefined,
    category_slugs: Array.isArray(b.category_slugs)
      ? b.category_slugs.filter((s): s is string => typeof s === "string")
      : undefined,
    opening_hours: Array.isArray(b.opening_hours) ? (b.opening_hours as PosRestaurantPayload["opening_hours"]) : undefined,
    menu,
  };
}

/**
 * Upserts a restaurant + its menu from a validated POS payload, and records
 * the run in pos_sync_logs. Idempotent: re-running with the same
 * pos_restaurant_id / pos_product_id values updates existing rows instead
 * of creating duplicates.
 */
export async function upsertRestaurantFromPos(
  payload: PosRestaurantPayload
): Promise<PosSyncResult> {
  const supabase = createAdminSupabaseClient();

  try {
    const { data: existing } = await supabase
      .from("restaurants")
      .select("id, slug")
      .eq("pos_restaurant_id", payload.pos_restaurant_id)
      .maybeSingle();

    const slug = existing?.slug ?? (await uniqueSlugFor(payload.name));

    const { data: restaurant, error: upsertError } = await supabase
      .from("restaurants")
      .upsert(
        {
          pos_restaurant_id: payload.pos_restaurant_id,
          source: "pos",
          slug,
          name: payload.name,
          description: payload.description ?? null,
          phone: payload.phone ?? null,
          address_line: payload.address_line ?? null,
          city: payload.city ?? "Musanze",
          latitude: payload.latitude ?? null,
          longitude: payload.longitude ?? null,
          cover_image_url: payload.cover_image_url ?? null,
          logo_url: payload.logo_url ?? null,
          opening_hours: payload.opening_hours ?? [],
          status: "active",
        },
        { onConflict: "pos_restaurant_id" }
      )
      .select("id, slug")
      .single();

    if (upsertError || !restaurant) {
      throw new Error(upsertError?.message ?? "Failed to upsert restaurant.");
    }

    if (payload.category_slugs && payload.category_slugs.length > 0) {
      const { data: categories } = await supabase
        .from("categories")
        .select("id, slug")
        .in("slug", payload.category_slugs);

      if (categories && categories.length > 0) {
        await supabase
          .from("restaurant_categories")
          .delete()
          .eq("restaurant_id", restaurant.id);
        await supabase.from("restaurant_categories").insert(
          categories.map((c) => ({ restaurant_id: restaurant.id, category_id: c.id }))
        );
      }
    }

    const { error: menuError } = await supabase.from("menu_items").upsert(
      payload.menu.map((item) => ({
        restaurant_id: restaurant.id,
        pos_product_id: item.pos_product_id,
        slug: slugify(item.name),
        name: item.name,
        description: item.description ?? null,
        price: item.price,
        image_url: item.image_url ?? null,
        menu_category: item.menu_category ?? "Menu",
        available: item.available ?? true,
        is_bestseller: item.is_bestseller ?? false,
      })),
      { onConflict: "restaurant_id,pos_product_id" }
    );

    if (menuError) {
      throw new Error(menuError.message);
    }

    await supabase.from("pos_sync_logs").insert({
      sync_type: "full_sync",
      pos_restaurant_id: payload.pos_restaurant_id,
      status: "success",
      payload_summary: {
        name: payload.name,
        menu_item_count: payload.menu.length,
      },
    });

    return {
      restaurantId: restaurant.id,
      restaurantSlug: restaurant.slug,
      menuItemsUpserted: payload.menu.length,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown sync error.";
    await supabase.from("pos_sync_logs").insert({
      sync_type: "full_sync",
      pos_restaurant_id: payload.pos_restaurant_id,
      status: "failed",
      error_message: message,
    });
    throw err;
  }
}

async function uniqueSlugFor(name: string): Promise<string> {
  const supabase = createAdminSupabaseClient();
  const base = slugify(name);
  let candidate = base;
  let attempt = 1;
  // Small, bounded loop — restaurant name collisions are rare.
  while (attempt < 20) {
    const { data } = await supabase
      .from("restaurants")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
    attempt += 1;
    candidate = `${base}-${attempt}`;
  }
  return `${base}-${Date.now()}`;
}

/**
 * Dormant PULL path: only used if POS_API_BASE_URL is configured (it is
 * blank by default — see .env.local.example). Nothing in this codebase
 * calls this function automatically; it exists so that once the POS API is
 * finalized, wiring it up is just pointing a route or a scheduled job at
 * this function.
 */
export async function fetchRestaurantFromPosApi(
  posRestaurantId: string
): Promise<PosRestaurantPayload> {
  const baseUrl = process.env.POS_API_BASE_URL;
  const apiKey = process.env.POS_API_KEY;

  if (!baseUrl) {
    throw new Error(
      "POS_API_BASE_URL is not configured yet. Set it in .env.local once the POS API is ready."
    );
  }

  const response = await fetch(`${baseUrl}/restaurants/${posRestaurantId}`, {
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`POS API request failed with status ${response.status}.`);
  }

  return validatePosRestaurantPayload(await response.json());
}
