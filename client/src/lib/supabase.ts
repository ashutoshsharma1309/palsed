// Singleton Supabase client used by the entire app.
// - Auto-persists session in localStorage (default behavior).
// - Auto-refreshes the JWT in the background.
// - Re-uses the same instance across hot reloads.
//
// Security notes:
// - The `anon` key is intentionally public (designed to be exposed to clients).
//   It only allows operations the project's RLS policies permit.
// - We don't use Supabase Postgres/Storage from the client directly; only auth.
//   All data access goes through our Express API for type safety + audit.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Fail loudly so misconfigured prod builds don't silently fall back to a broken auth flow.
  throw new Error(
    "Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in client/.env (or in Vercel's environment variables)."
  );
}

const globalForSupabase = globalThis as unknown as { __prepnextSupabase?: SupabaseClient };

export const supabase: SupabaseClient =
  globalForSupabase.__prepnextSupabase ??
  createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true, // for OAuth + email-verification callback URLs
      storageKey: "prepnext.supabase.auth.v1",
    },
  });

if (import.meta.env.DEV) globalForSupabase.__prepnextSupabase = supabase;
