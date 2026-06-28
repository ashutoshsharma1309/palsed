// Daily-login streak — gamification.
//
// Records the first visit each day for a logged-in user, then derives the
// current + best streak. Persisted with the app's existing localStorage
// pattern (useLocalStorageState) under the `prepnext.*` namespace, so it can be
// migrated to a backend table later without changing callers.
//
// Backend note: when a streak table exists server-side, swap the persistence
// here (read on mount, POST today's login) — the returned shape stays the same.
import { useEffect, useMemo } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { useAuth } from "./useAuth";
import { localISO, computeCurrentStreak, computeBestStreak } from "../lib/streakDates";

const STREAK_KEY = "prepnext.streak.v1";

interface StreakState {
  /** Sorted-unique YYYY-MM-DD dates the user logged in on. */
  days: string[];
}

export interface DailyStreak {
  /** Set of logged-in dates for O(1) calendar lookups. */
  loggedDays: Set<string>;
  currentStreak: number;
  bestStreak: number;
  todayISO: string;
  todayLogged: boolean;
}

export function useDailyStreak(): DailyStreak {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useLocalStorageState<StreakState>(STREAK_KEY, { days: [] });

  const today = localISO();

  // Record today's login once per day, for authenticated users only. De-duped:
  // we only write when today isn't already present, so multiple visits/re-renders
  // never create duplicate entries.
  useEffect(() => {
    if (!isAuthenticated) return;
    setState((prev) => {
      if (prev.days.includes(today)) return prev; // already logged today → no write
      return { days: [...prev.days, today].sort() };
    });
  }, [isAuthenticated, today, setState]);

  const loggedDays = useMemo(() => new Set(state.days), [state.days]);
  const currentStreak = useMemo(() => computeCurrentStreak(loggedDays, today), [loggedDays, today]);
  const bestStreak = useMemo(() => computeBestStreak(state.days), [state.days]);

  return {
    loggedDays,
    currentStreak,
    bestStreak,
    todayISO: today,
    todayLogged: loggedDays.has(today),
  };
}
