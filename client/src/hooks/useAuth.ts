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

  /** Returns the synced user if instant-login, OR a stub indicating email confirmation is required. */
  const signup = useCallback(async (email: string, password: string, displayName: string) => {
    const { needsEmailConfirmation } = await signupEmail(email, password, displayName);
    if (needsEmailConfirmation) {
      return { id: "", email, displayName, emailVerified: false } as AuthUser;
    }
    const u = await fetchAppUser();
    setUser(u);
    return u;
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
