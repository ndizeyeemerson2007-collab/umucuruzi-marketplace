import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Server-side Supabase client for Server Components and Route Handlers.
 *
 * Uses the public anon/publishable key — safe to use here because every
 * public-facing table has an explicit "public read" RLS policy (see the
 * migrations run against the umucuruziltd project). This client can only
 * ever read what an anonymous visitor is allowed to read.
 *
 * Fetches bypass Next.js's fetch cache so pages stay dynamic (fresh on
 * every request) once the POS starts pushing updates — pair with
 * `export const dynamic = "force-dynamic"` on pages that need it.
 */
export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Check your .env.local file."
    );
  }

  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}
