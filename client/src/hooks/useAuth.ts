// Auth state powered by Supabase Auth.
// - `isAuthenticated` depends ONLY on token presence (not user-row fetch
//   success), so a slow /api/auth/me call never gets us stuck in a "logged in
//   but redirected" loop.
// - Synchronously primes initial state from Supabase's localStorage key so
//   RequireAuth doesn't redirect on the first render after a hard refresh.
// - Subscribes to onAuthStateChange so login/logout/refresh from anywhere
//   updates the UI.
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  fetchAppUser,
  loginEmail,
  loginGoogle,
  signupEmail,
  devConfirmEmail,
  logout as apiLogout,
  type AuthUser,
} from "../lib/auth";

const SUPA_STORAGE_KEY = "prepnext.supabase.auth.v1";

/** Read the token synchronously from Supabase's localStorage (set by supabase-js). */
function readInitialToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SUPA_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const tok: string | undefined = parsed?.access_token || parsed?.currentSession?.access_token;
    if (!tok) return null;
    // Check expiry if present
    const exp: number | undefined = parsed?.expires_at || parsed?.currentSession?.expires_at;
    if (exp && exp * 1000 < Date.now()) return null;
    return tok;
  } catch {
    return null;
  }
}

function readInitialUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch { return null; }
}

export function useAuth() {
  // Prime from localStorage so the first render already reflects a logged-in user.
  const [token, setToken] = useState<string | null>(readInitialToken);
  const [user, setUser] = useState<AuthUser | null>(readInitialUser);
  const [loading, setLoading] = useState<boolean>(() => !readInitialToken());

  // Hydrate from existing Supabase session (handles cross-tab + cold start).
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const t = data.session?.access_token ?? null;
      if (!active) return;
      setToken(t);
      if (t) {
        try {
          const u = await fetchAppUser();
          if (!active) return;
          setUser(u);
          try { window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u)); } catch {}
        } catch (e) {
          // Don't clear token on a transient /me failure — keeps the user
          // logged-in and components can retry.
          if (active) console.warn("[useAuth] fetchAppUser failed:", (e as Error)?.message);
        }
      } else {
        if (active) setUser(null);
      }
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  // Listen for login / logout / token-refresh from anywhere.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      const t = session?.access_token ?? null;
      setToken(t);
      try { window.localStorage.setItem(AUTH_TOKEN_KEY, t || ""); } catch {}
      if (t) {
        try {
          const u = await fetchAppUser();
          setUser(u);
          try { window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u)); } catch {}
        } catch (e) {
          console.warn("[useAuth] fetchAppUser on event failed:", (e as Error)?.message);
        }
      } else {
        setUser(null);
        try { window.localStorage.removeItem(AUTH_USER_KEY); } catch {}
      }
      // Any state change means we're no longer in initial loading.
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await loginEmail(email, password);
    // Re-fetch user inline so the AuthPanel's local state has it immediately.
    try {
      const u = await fetchAppUser();
      setUser(u);
      return u;
    } catch {
      // Even if fetchAppUser fails, the Supabase session is set; isAuthenticated
      // will be true. Components can retry on demand.
      return null as unknown as AuthUser;
    }
  }, []);

  /**
   * Sign up + immediately bring the user in.
   * Server creates the user via admin API (no email sent, no rate limit),
   * then we sign in to establish a Supabase session.
   */
  const signup = useCallback(async (email: string, password: string, displayName: string) => {
    const { needsEmailConfirmation } = await signupEmail(email, password, displayName);

    if (!needsEmailConfirmation) {
      try {
        const u = await fetchAppUser();
        setUser(u);
        return u;
      } catch {
        return null as unknown as AuthUser;
      }
    }

    // Server-side admin signup should never set needsEmailConfirmation, but if
    // something falls through, try dev-confirm + login as a safety net.
    const confirmed = await devConfirmEmail(email);
    if (confirmed) {
      try {
        await loginEmail(email, password);
        const u = await fetchAppUser();
        setUser(u);
        return u;
      } catch { /* fall through */ }
    }
    return { id: "", email, displayName, emailVerified: false } as AuthUser;
  }, []);

  const google = useCallback(async () => {
    await loginGoogle();
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setToken(null);
    setUser(null);
  }, []);

  return {
    token,
    user,
    // Auth is "in" as soon as we have a Supabase token. user-row sync is
    // a profile detail, not a gate.
    isAuthenticated: Boolean(token),
    loading,
    login,
    signup,
    google,
    logout,
  };
}
