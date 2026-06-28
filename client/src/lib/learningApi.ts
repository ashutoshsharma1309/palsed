// Thin client for the learning-progress backup endpoints. All calls are
// best-effort — callers swallow errors and fall back to localStorage.
import { getApiUrl } from "./api";
import { supabase } from "./supabase";
import type { LearningStore } from "../services/progressService";

async function authToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function fetchProgress(): Promise<LearningStore | null> {
  const token = await authToken();
  if (!token) return null;
  const res = await fetch(`${getApiUrl()}/api/learning/progress`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return (json?.progress as LearningStore) ?? null;
}

export async function saveProgress(store: LearningStore): Promise<void> {
  const token = await authToken();
  if (!token) return;
  await fetch(`${getApiUrl()}/api/learning/progress`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ progress: store }),
  });
}
