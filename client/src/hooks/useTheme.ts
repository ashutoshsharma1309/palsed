import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "prepnext.theme.v1";

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

/** Resolve the active theme without React (used by main.tsx before paint). */
export function resolveInitialTheme(): Theme {
  return readStored() ?? systemTheme();
}

/** Apply theme to the document + sync the theme-color meta tag. */
export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#f7f7f5" : "#0a0a0a");
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document !== "undefined") {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "dark" || attr === "light") return attr;
    }
    return resolveInitialTheme();
  });

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch {}
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  // Listen for cross-tab theme changes
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const v = e.newValue;
      if (v === "dark" || v === "light") {
        setThemeState(v);
        applyTheme(v);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Honor system theme changes ONLY when the user hasn't pinned one.
  useEffect(() => {
    if (readStored()) return;
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = (e: MediaQueryListEvent) => {
      const t: Theme = e.matches ? "light" : "dark";
      setThemeState(t);
      applyTheme(t);
    };
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  return { theme, setTheme, toggle };
}
