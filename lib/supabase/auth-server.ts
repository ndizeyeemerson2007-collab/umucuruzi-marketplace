import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  const authorization = request.headers.get("authorization");
  const accessToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!accessToken || !url || !anonKey) return null;

  const supabase = createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
  const { data, error } = await supabase.auth.getUser(accessToken);
  return error ? null : data.user;
}
