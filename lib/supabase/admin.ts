import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Admin Supabase client using the SERVICE ROLE key. This bypasses Row
 * Level Security entirely, so it must NEVER be imported into anything that
 * ships to the browser — the `server-only` import above makes any accidental
 * client-side import fail at build time.
 *
 * Used by:
 *  - app/api/orders/route.ts (writing a new order + order_items)
 *  - app/api/pos/sync/route.ts (upserting restaurants/menu from the POS)
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY to be set in .env.local — see
 * .env.local.example for where to get it (Supabase dashboard → Project
 * Settings → API → service_role key). It is intentionally left blank in
 * that example file since it must never be committed.
 */
export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add the service role key to .env.local (see .env.local.example)."
    );
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
