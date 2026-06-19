// Auth state powered by Supabase Auth.
// - Subscribes to onAuthStateChange so login/logout/refresh from anywhere updates the UI.
// - On every session change, syncs the matching row from our User table.
// - Exposes the same shape (token, user, isAuthenticated, login, signup, logout)
//   so existing callers don't break.
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

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from existing session (set by supabase-js across navigations / reloads).
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
          try { localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u)); } catch {}
        } catch { /* leave user null */ }
      }
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  // Listen for login / logout / token-refresh.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const t = session?.access_token ?? null;
      setToken(t);
      try { localStorage.setItem(AUTH_TOKEN_KEY, t || ""); } catch {}
      if (t) {
        try {
          const u = await fetchAppUser();
          setUser(u);
          try { localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u)); } catch {}
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
        try { localStorage.removeItem(AUTH_USER_KEY); } catch {}
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await loginEmail(email, password);
    const u = await fetchAppUser();
    setUser(u);
    return u;
  }, []);

  /**
   * Sign up + immediately bring the user in.
   * If Supabase requires email confirmation, we bypass it via the server's
   * dev-confirm endpoint (uses service_role to mark the email confirmed),
   * then log them in. This avoids the "email never arrives" UX dead-end.
   * Falls back to returning a stub if everything fails — UI can then show
   * the "check your email" state with a resend button.
   */
  const signup = useCallback(async (email: string, password: string, displayName: string) => {
    const { needsEmailConfirmation } = await signupEmail(email, password, displayName);

    if (!needsEmailConfirmation) {
      // Supabase returned a session immediately ("Confirm email" is OFF) — done.
      const u = await fetchAppUser();
      setUser(u);
      return u;
    }

    // Confirm email is ON. Try the server-side bypass.
    const confirmed = await devConfirmEmail(email);
    if (confirmed) {
      // Now log them in — Supabase will issue a session since the email is confirmed.
      try {
        await loginEmail(email, password);
        const u = await fetchAppUser();
        setUser(u);
        return u;
      } catch {
        // Login failed for some reason — fall through to "check email" state.
      }
    }

    // True fallback: show "check your email" UI so they can use the resend button.
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
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    signup,
    google,
    logout,
  };
}
