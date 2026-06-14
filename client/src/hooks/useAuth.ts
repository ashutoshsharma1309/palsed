// Auth state backed by localStorage (token + user), synced across components
// via useLocalStorageState's subscriber model.
import { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  login as apiLogin,
  signup as apiSignup,
  type AuthUser,
} from "../lib/auth";

export function useAuth() {
  const [token, setToken, clearToken] = useLocalStorageState<string | null>(AUTH_TOKEN_KEY, null);
  const [user, setUser, clearUser] = useLocalStorageState<AuthUser | null>(AUTH_USER_KEY, null);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiLogin(email, password);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    },
    [setToken, setUser]
  );

  const signup = useCallback(
    async (email: string, password: string, displayName: string) => {
      const res = await apiSignup(email, password, displayName);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    },
    [setToken, setUser]
  );

  const logout = useCallback(() => {
    clearToken();
    clearUser();
  }, [clearToken, clearUser]);

  return {
    token,
    user,
    isAuthenticated: Boolean(token && user),
    login,
    signup,
    logout,
  };
}
