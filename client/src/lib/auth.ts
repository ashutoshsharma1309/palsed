// Client-side auth: talks to /api/auth/* and persists the JWT + user locally.
import { getApiUrl, refreshApiUrl } from "./api";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarSeed: string;
  learningGoal: string;
  preferredStyle: "visual" | "code_first" | "analogy" | "step_by_step";
  dailyMinutes: number;
  joinedAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const AUTH_TOKEN_KEY = "prepnext.auth.token.v1";
export const AUTH_USER_KEY = "prepnext.auth.user.v1";

let _ensured = false;
async function ensureApi() {
  if (!_ensured) {
    await refreshApiUrl();
    _ensured = true;
  }
  return getApiUrl();
}

async function authFetch<T>(path: string, init: RequestInit): Promise<T> {
  const base = await ensureApi();
  const r = await fetch(`${base}${path}`, {
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init,
  });
  let data: any = null;
  try {
    data = await r.json();
  } catch {
    /* ignore */
  }
  if (!r.ok) {
    const err: any = new Error(data?.error || `HTTP ${r.status}`);
    err.status = r.status;
    throw err;
  }
  return data as T;
}

export function signup(email: string, password: string, displayName: string) {
  return authFetch<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, displayName }),
  });
}

export function login(email: string, password: string) {
  return authFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function fetchMe(token: string) {
  return authFetch<{ user: AuthUser }>("/api/auth/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}
