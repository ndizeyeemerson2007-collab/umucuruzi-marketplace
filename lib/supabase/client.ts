import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

let browserClient: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Browser Supabase client — public anon/publishable key only. Used sparingly,
 * from client components that need to look up specific rows by id (e.g. the
 * favorites page resolving saved restaurant/product ids). Server Components
 * should use `createServerSupabaseClient` instead for the main data fetching.
 */
export function getBrowserSupabaseClient() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Check your .env.local file."
    );
  }

  browserClient = createClient<Database>(url, anonKey, {
    auth: { persistSession: false },
  });
  return browserClient;
}
