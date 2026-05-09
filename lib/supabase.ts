import { createClient } from "@supabase/supabase-js";

// Lazy clients — created on first use so missing env vars fail at call
// time (with a clear error) rather than crashing module evaluation.
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env vars missing — check .env.local");
  return createClient(url, key);
}

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service role env vars missing — check .env.local");
  return createClient(url, key);
}
