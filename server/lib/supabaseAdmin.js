// Server-side Supabase Admin client.
// Uses SUPABASE_SERVICE_ROLE_KEY (full access — never expose to browser).
// Used for admin operations like auto-confirming emails.
import { createClient } from "@supabase/supabase-js";

let _admin = null;
export function getSupabaseAdmin() {
  if (_admin) return _admin;
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set on the server. See server/.env.example."
    );
  }
  _admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return _admin;
}
