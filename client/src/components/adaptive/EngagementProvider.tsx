import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useLocalStorageState, LS_KEYS } from "../../hooks/useLocalStorageState";

interface DailyEntry {
  date: string; // YYYY-MM-DD
  activeMs: number;
  interventions: number;
  routes: Record<string, number>; // route → ms
}

export interface EngagementLog {
  days: DailyEntry[]; // last 14
  interventions: Array<{ at: string; route: string; action: string }>;
}

interface LessonStats {
  scrollDepth: number;
  tabSwitches: number;
  hints: number;
  retries: number;
}

interface Ctx {
  signal: number; // 0..1 live engagement
  activeMs: number; // for current route
  noteHint: () => void;
  noteRetry: () => void;
  noteIntervention: (action: string) => void;
  log: EngagementLog;
  streakDays: number;
}

const C = createContext<Ctx | null>(null);

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function tickStreak(log: EngagementLog): number {
  // count consecutive most-recent days with activeMs > 60_000
  let streak = 0;
  const sortedDays = [...log.days].sort((a, b) => (a.date < b.date ? 1 : -1));
  let cursor = new Date();
  for (const d of sortedDays) {
    const expected = cursor.toISOString().slice(0, 10);
    if (d.date === expected && d.activeMs > 60_000) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function EngagementProvider({ children }: { children: React.ReactNode }) {
  const [log, setLog] = useLocalStorageState<EngagementLog>(LS_KEYS.engagement, {
    days: [],
    interventions: [],
  });
  const [signal, setSignal] = useState(1);
  const [activeMs, setActiveMs] = useState(0);

  const lastInputRef = useRef<number>(Date.now());
  const visibleRef = useRef(!document.hidden);
  const routeRef = useRef<string>(window.location.pathname);
  const tabSwitchesRef = useRef(0);
  const lastScrollRef = useRef<{ y: number; t: number }>({ y: 0, t: Date.now() });
  const skimRef = useRef(0); // frequency of long-fast scrolls
  const tickActiveRef = useRef(0);

  const noteHint = useCallback(() => {
    setSignal((s) => Math.max(0, s - 0.1));
  }, []);
  const noteRetry = useCallback(() => {
    setSignal((s) => Math.max(0, s - 0.15));
  }, []);
  const noteIntervention = useCallback(
    (action: string) => {
      setLog((prev) => ({
        ...prev,
        interventions: [
          ...prev.interventions.slice(-49),
          { at: new Date().toISOString(), route: window.location.pathname, action },
        ],
        days: prev.days.map((d) =>
          d.date === todayKey() ? { ...d, interventions: d.interventions + 1 } : d
        ),
      }));
    },
    [setLog]
  );

  // Input + visibility tracking
  useEffect(() => {
    const onActivity = () => {
      lastInputRef.current = Date.now();
    };
    const onVisibility = () => {
      visibleRef.current = !document.hidden;
      if (document.hidden) {
        tabSwitchesRef.current += 1;
        setSignal((s) => Math.max(0, s - 0.3));
      }
    };
    const onScroll = () => {
      const now = Date.now();
      const y = window.scrollY;
      const dy = Math.abs(y - lastScrollRef.current.y);
      const dt = now - lastScrollRef.current.t;
      if (dt < 500 && dy > 600) {
        skimRef.current += 1;
        setSignal((s) => Math.max(0, s - 0.05));
      }
      lastScrollRef.current = { y, t: now };
    };
    const onRoute = () => {
      routeRef.current = window.location.pathname;
      tickActiveRef.current = 0;
      setActiveMs(0);
      setSignal(1);
    };
    window.addEventListener("mousemove", onActivity, { passive: true });
    window.addEventListener("keydown", onActivity);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("popstate", onRoute);
    document.addEventListener("visibilitychange", onVisibility);
    // monkey-patch pushState/replaceState for SPA route changes
    const origPush = history.pushState;
    history.pushState = function (...args) {
      origPush.apply(this, args as any);
      onRoute();
    };
    return () => {
      window.removeEventListener("mousemove", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", onRoute);
      document.removeEventListener("visibilitychange", onVisibility);
      history.pushState = origPush;
    };
  }, []);

  // 1Hz tick — accumulate active time + decay/recover signal
  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now();
      const idle = now - lastInputRef.current;
      if (visibleRef.current && idle < 60_000) {
        tickActiveRef.current += 1000;
        setActiveMs(tickActiveRef.current);
        setSignal((s) => Math.min(1, s + 0.02));
        // accumulate today's daily entry
        setLog((prev) => {
          const today = todayKey();
          const days = [...prev.days];
          const idx = days.findIndex((d) => d.date === today);
          if (idx === -1) {
            days.push({ date: today, activeMs: 1000, interventions: 0, routes: { [routeRef.current]: 1000 } });
          } else {
            days[idx] = {
              ...days[idx],
              activeMs: days[idx].activeMs + 1000,
              routes: {
                ...days[idx].routes,
                [routeRef.current]: (days[idx].routes[routeRef.current] || 0) + 1000,
              },
            };
          }
          // FIFO cap 14
          while (days.length > 14) days.shift();
          return { ...prev, days };
        });
      } else if (visibleRef.current && idle >= 60_000) {
        setSignal((s) => Math.max(0, s - 0.05));
      }
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const streakDays = React.useMemo(() => tickStreak(log), [log]);

  return (
    <C.Provider value={{ signal, activeMs, noteHint, noteRetry, noteIntervention, log, streakDays }}>
      {children}
    </C.Provider>
  );
}

export function useEngagement() {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useEngagement must be used within EngagementProvider");
  return ctx;
}
