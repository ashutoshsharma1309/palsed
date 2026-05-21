import { useCallback, useEffect, useRef, useState } from "react";

type Setter<T> = T | ((prev: T) => T);

const subscribers = new Map<string, Set<(v: unknown) => void>>();

function notify(key: string, value: unknown) {
  subscribers.get(key)?.forEach((cb) => cb(value));
}

export function useLocalStorageState<T>(
  key: string,
  initial: T | (() => T)
): [T, (v: Setter<T>) => void, () => void] {
  const initialRef = useRef<T>(typeof initial === "function" ? (initial as () => T)() : initial);

  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return initialRef.current;
      return JSON.parse(raw) as T;
    } catch {
      return initialRef.current;
    }
  });

  // subscribe so cross-component updates within same tab stay in sync
  useEffect(() => {
    if (!subscribers.has(key)) subscribers.set(key, new Set());
    const set = subscribers.get(key)!;
    const cb = (v: unknown) => setState(v as T);
    set.add(cb);
    return () => {
      set.delete(cb);
    };
  }, [key]);

  // cross-tab sync via storage event
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return;
      try {
        setState(JSON.parse(e.newValue) as T);
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  const set = useCallback(
    (v: Setter<T>) => {
      setState((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch (e) {
          console.warn("localStorage write failed", e);
        }
        notify(key, next);
        return next;
      });
    },
    [key]
  );

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {}
    setState(initialRef.current);
    notify(key, initialRef.current);
  }, [key]);

  return [state, set, reset];
}

export const LS_KEYS = {
  profile: "palsed.profile.v1",
  dsaStatuses: "palsed.dsa.statuses.v1",
  dsaBookmarks: "palsed.dsa.bookmarks.v1",
  dsaAttempts: "palsed.dsa.attempts.v1",
  courses: "palsed.courses.v1",
  roadmaps: "palsed.roadmaps.v1",
  lessons: "palsed.lessons.progress.v1",
  engagement: "palsed.engagement.v1",
  mastery: "palsed.mastery.v1",
  srs: "palsed.srs.v1",
  tutorThreads: "palsed.tutor.threads.v1",
  certificates: "palsed.certificates.v1",
  notes: "palsed.notes.v1",
  notifications: "palsed.notifications.v1",
} as const;
