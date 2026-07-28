// Thin fetch wrappers for /api/progress, mirroring the exact auth pattern
// already used by fetchAppUser (lib/auth.ts): fresh Supabase JWT per call +
// the runtime-resolved API base URL. No new auth machinery.
import { getAccessToken } from "../auth";
import { getApiUrl, refreshApiUrl } from "../api";

let apiReady = false;
async function ensureApi(): Promise<string> {
  if (!apiReady) { await refreshApiUrl(); apiReady = true; }
  return getApiUrl();
}

export interface ProgressPayload {
  data: Record<string, unknown> | null;
  updatedAt: string | null;
}

async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  if (!token) throw new Error("Not authenticated");
  const base = await ensureApi();
  return fetch(`${base}${path}`, {
    ...init,
    headers: { ...(init.headers || {}), Authorization: `Bearer ${token}` },
  });
}

/** Fetch the durable server-side progress blob for the signed-in user. */
export async function fetchProgress(): Promise<ProgressPayload> {
  const res = await authedFetch("/api/progress");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Push a full progress snapshot to the server (overwrites the stored blob). */
export async function pushProgress(data: Record<string, unknown>): Promise<void> {
  const res = await authedFetch("/api/progress", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
