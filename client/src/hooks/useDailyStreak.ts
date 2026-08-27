// Daily streak — now driven by LEARNING ACTIVITY, not login.
//
// Reads the same DSA-learning store that useLearningProgress writes to: every
// time the user completes a checklist item or marks a problem solved, today's
// date is recorded in `activeDays`. The streak is the run of consecutive active
// days ending today (or yesterday). So opening the site does nothing — only
// actually learning extends the streak.
import { useMemo } from "react";
import { useLocalStorageState, LS_KEYS } from "./useLocalStorageState";
import { localISO, computeCurrentStreak, computeBestStreak } from "../lib/streakDates";
import { EMPTY_STORE, type LearningStore } from "../services/progressService";

const KEY = LS_KEYS.dsaLearning;

export interface DailyStreak {
  /** Set of active-learning dates for O(1) calendar lookups. */
  loggedDays: Set<string>;
  currentStreak: number;
  bestStreak: number;
  todayISO: string;
  todayLogged: boolean;
}

export function useDailyStreak(): DailyStreak {
  const [store] = useLocalStorageState<LearningStore>(KEY, EMPTY_STORE);
  const today = localISO();

  const loggedDays = useMemo(() => new Set(store.activeDays), [store.activeDays]);
  const currentStreak = useMemo(() => computeCurrentStreak(loggedDays, today), [loggedDays, today]);
  const bestStreak = useMemo(() => computeBestStreak(store.activeDays), [store.activeDays]);

  return { loggedDays, currentStreak, bestStreak, todayISO: today, todayLogged: loggedDays.has(today) };
}
