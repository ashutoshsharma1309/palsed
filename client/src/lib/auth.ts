// Auth wrappers around Supabase Auth.
//
// Why Supabase Auth and not our own JWT:
//   - Email verification built in (anti–any-email-gets-in attack)
//   - Google OAuth built in
//   - Magic links + password reset built in
//   - Session refresh + rotation handled
//   - Login attempt throttling handled
//
// The "AuthUser" shape stays compatible with what the rest of the app expects.

import { supabase } from "./supabase";
import { getApiUrl, refreshApiUrl } from "./api";

export interface AuthUser {
  id: string;             // Our internal User.id (synced from Supabase auth.users.id)
  email: string;
  displayName: string;
  authId?: string;
  avatarSeed?: string;
  learningGoal?: string;
  preferredStyle?: "visual" | "code_first" | "analogy" | "step_by_step";
  dailyMinutes?: number;
  joinedAt?: string;
}

// Storage keys kept so legacy useLocalStorageState calls keep finding their data.
// The supabase-js client manages the *session* itself; these mirror display data.
export const AUTH_USER_KEY = "prepnext.auth.user.v1";
export const AUTH_TOKEN_KEY = "prepnext.auth.token.v1"; // legacy: no longer authoritative

let _apiReady = false;
async function ensureApi(): Promise<string> {
  if (!_apiReady) { await refreshApiUrl(); _apiReady = true; }
  return getApiUrl();
}

/** Get the current Supabase JWT (used as Authorization: Bearer ... on API calls). */
export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

/** Pull (or refresh) the matching User row from our backend. Creates one on first call. */
export async function fetchAppUser(): Promise<AuthUser> {
  const token = await getAccessToken();
  if (!token) throw new Error("Not authenticated");
  const base = await ensureApi();
  const res = await fetch(`${base}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.error || `HTTP ${res.status}`);
  }
  const { user } = (await res.json()) as { user: AuthUser };
  return user;
}

/**
 * Email + password signup. Supabase sends a verification email automatically
 * when "Confirm email" is on in the dashboard. Until they click the link,
 * login is blocked — fixes the "any email gets in" issue.
 */
export async function signupEmail(
  email: string,
  password: string,
  displayName: string
): Promise<{ needsEmailConfirmation: boolean }> {
  const redirectTo = `${window.location.origin}/auth/callback`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
      data: { display_name: displayName },
    },
  });
  if (error) throw new Error(error.message);
  return { needsEmailConfirmation: data.session === null };
}

export async function loginEmail(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
}

/** Kick off Google OAuth. Redirects to Google's consent screen. */
export async function loginGoogle(): Promise<void> {
  const redirectTo = `${window.location.origin}/auth/callback`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo, queryParams: { access_type: "offline", prompt: "consent" } },
  });
  if (error) throw new Error(error.message);
}

export async function requestPasswordReset(email: string): Promise<void> {
  const redirectTo = `${window.location.origin}/auth/callback?intent=reset`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw new Error(error.message);
}

export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
}

export async function resendConfirmation(email: string): Promise<void> {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw new Error(error.message);
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
  try { localStorage.removeItem(AUTH_USER_KEY); } catch {}
  try { localStorage.removeItem(AUTH_TOKEN_KEY); } catch {}
}

// Legacy named exports for any code that still imports these directly.
export const login = loginEmail;
export const signup = signupEmail;
