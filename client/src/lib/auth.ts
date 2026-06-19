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
 * Server-side check — is this an email we should bother sending an OTP to?
 * Catches gibberish/disposable/no-MX addresses before they consume a Supabase
 * email rate-limit slot.
 */
export async function validateEmail(email: string): Promise<{ ok: boolean; reason?: string }> {
  const base = await ensureApi();
  const res = await fetch(`${base}/api/auth/validate-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, reason: json.reason || json.error || "Invalid email" };
  return { ok: true };
}

/**
 * Send a 6-digit OTP to the user's email. Creates the user if they don't exist
 * yet (and stamps `display_name` into user_metadata for first-time signups).
 * After this returns, the user receives a code in their inbox; verify it via
 * verifyOtpCode().
 */
export async function sendOtp(email: string, displayName?: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: displayName ? { display_name: displayName } : undefined,
    },
  });
  if (error) {
    // Supabase rate-limit message: "email rate limit exceeded"
    if (/rate limit|too many/i.test(error.message)) {
      throw new Error("Too many emails sent. Wait a few minutes and try again.");
    }
    throw new Error(error.message);
  }
}

/**
 * Verify a 6-digit code the user typed. On success, Supabase issues a session
 * and onAuthStateChange fires (useAuth updates automatically).
 */
export async function verifyOtpCode(email: string, code: string): Promise<void> {
  const { error } = await supabase.auth.verifyOtp({
    email,
    token: code.trim(),
    type: "email",
  });
  if (error) {
    if (/invalid|expired/i.test(error.message)) {
      throw new Error("That code is wrong or expired. Request a new one.");
    }
    throw new Error(error.message);
  }
}

/**
 * Email + password signup via our server (admin API).
 *
 * Why server-side instead of supabase.auth.signUp?
 *   - Bypasses Supabase free-tier email rate limit
 *     ("over_email_send_rate_limit" error blocks the public endpoint).
 *   - Pre-confirms the email server-side so the user is instantly usable.
 *   - Eliminates the "didn't receive email" UX dead-end on free tier.
 *
 * After signup we immediately sign in via the public Supabase JS client to
 * establish a session in the browser.
 */
export async function signupEmail(
  email: string,
  password: string,
  displayName: string
): Promise<{ needsEmailConfirmation: boolean }> {
  const base = await ensureApi();
  const res = await fetch(`${base}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, displayName }),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.error || `Signup failed (HTTP ${res.status})`);
  }
  // Immediately sign in to establish a Supabase session in the browser.
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Account was created server-side but we couldn't sign in — surface error
    throw new Error(error.message || "Couldn't sign in after signup");
  }
  return { needsEmailConfirmation: false };
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

/**
 * Bypass email confirmation server-side using the service_role admin API.
 * Returns true if the user is now confirmed (newly or already was).
 *
 * Why this exists: Supabase's built-in mailer is heavily rate-limited and
 * Gmail-filtered, so confirmation emails often never arrive on free tier.
 * This endpoint sidesteps that for demos. In production you should use a
 * real SMTP provider (Resend, Postmark, SES) instead.
 */
export async function devConfirmEmail(email: string): Promise<boolean> {
  const base = await ensureApi();
  try {
    const res = await fetch(`${base}/api/auth/dev-confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) return false;
    const json = await res.json();
    return !!json.ok;
  } catch {
    return false;
  }
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
  try { localStorage.removeItem(AUTH_USER_KEY); } catch {}
  try { localStorage.removeItem(AUTH_TOKEN_KEY); } catch {}
}

// Legacy named exports for any code that still imports these directly.
export const login = loginEmail;
export const signup = signupEmail;
