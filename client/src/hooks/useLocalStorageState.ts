import { useCallback, useEffect, useRef, useState } from "react";

type Setter<T> = T | ((prev: T) => T);

const subscribers = new Map<string, Set<(v: unknown) => void>>();

function notify(key: string, value: unknown) {
  subscribers.get(key)?.forEach((cb) => cb(value));
}

const AUTH_USER_KEY = "prepnext.auth.user.v1";

// Auth keys identify the user and stay browser-global. Everything else is
// namespaced per signed-in user so different accounts never share data.
function isGlobalKey(key: string) {
  return key.startsWith("prepnext.auth.");
}

function readUid(): string {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return "guest";
    const u = JSON.parse(raw);
    return u?.id ? String(u.id) : "guest";
  } catch {
    return "guest";
  }
}

function readValue<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// Effective storage key, reactive to login/logout. When the current user
// changes, the key changes and consumers re-read from the new namespace.
function useScopedKey(key: string): string {
  const global = isGlobalKey(key);
  const [uid, setUid] = useState<string>(() => (global ? "" : readUid()));

  useEffect(() => {
    if (global) return;
    const update = () => setUid(readUid());
    if (!subscribers.has(AUTH_USER_KEY)) subscribers.set(AUTH_USER_KEY, new Set());
    const set = subscribers.get(AUTH_USER_KEY)!;
    set.add(update);
    const onStorage = (e: StorageEvent) => {
      if (e.key === AUTH_USER_KEY) update();
    };
    window.addEventListener("storage", onStorage);
    update(); // sync in case the user changed before this effect ran
    return () => {
      set.delete(update);
      window.removeEventListener("storage", onStorage);
    };
  }, [global]);

  return global ? key : `${key}__u:${uid}`;
}

export function useLocalStorageState<T>(
  key: string,
  initial: T | (() => T)
): [T, (v: Setter<T>) => void, () => void] {
  const initialRef = useRef<T>(typeof initial === "function" ? (initial as () => T)() : initial);
  const storeKey = useScopedKey(key);

  const [state, setState] = useState<T>(() => readValue(storeKey, initialRef.current));

  // Re-read whenever the effective key changes (e.g. the user logged in/out).
  const lastKey = useRef(storeKey);
  useEffect(() => {
    if (lastKey.current !== storeKey) {
      lastKey.current = storeKey;
      setState(readValue(storeKey, initialRef.current));
    }
  }, [storeKey]);

  // subscribe so cross-component updates within same tab stay in sync
  useEffect(() => {
    if (!subscribers.has(storeKey)) subscribers.set(storeKey, new Set());
    const set = subscribers.get(storeKey)!;
    const cb = (v: unknown) => setState(v as T);
    set.add(cb);
    return () => {
      set.delete(cb);
    };
  }, [storeKey]);

  // cross-tab sync via storage event
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== storeKey || e.newValue === null) return;
      try {
        setState(JSON.parse(e.newValue) as T);
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storeKey]);

  const set = useCallback(
    (v: Setter<T>) => {
      setState((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        try {
          localStorage.setItem(storeKey, JSON.stringify(next));
        } catch (e) {
          console.warn("localStorage write failed", e);
        }
        notify(storeKey, next);
        return next;
      });
    },
    [storeKey]
  );

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(storeKey);
    } catch {}
    setState(initialRef.current);
    notify(storeKey, initialRef.current);
  }, [storeKey]);

  return [state, set, reset];
}

export const LS_KEYS = {
  // legacy "palsed.*" namespace (still used by features built pre-pivot)
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
  focusMode: "palsed.focusmode.v1",

  // new "prepnext.*" namespace (placement-OS pivot)
  // NOTE: every per-user key MUST be registered here — exportUserData /
  // importUserData / wipeUserData iterate these values, and the server progress
  // sync (lib/sync/progressSync.ts) rides on that snapshot. A key that's missing
  // here silently never syncs and never gets wiped.
  dsaLearning: "prepnext.dsaLearning.v1",   // central learning store (checklist/solved/activeDays)
  quiz: "prepnext.quiz.v1",                 // inline lesson-quiz results
  gamificationLevel: "prepnext.gamification.lastLevel.v1", // last celebrated level
  pyq: "prepnext.pyq.v1",
  placementCompleted: "prepnext.placement.completed.v1",
  placementBookmarks: "prepnext.placement.bookmarks.v1",
  authToken: "prepnext.auth.token.v1",
  authUser: "prepnext.auth.user.v1",
  theme: "prepnext.theme.v1",
} as const;

// Session/identity keys — never exported, imported, or wiped so a data wipe
// or restore doesn't silently log the user out mid-session.
const PROTECTED_BASE_KEYS: string[] = [LS_KEYS.authToken, LS_KEYS.authUser];
const BASE_KEYS: string[] = Object.values(LS_KEYS);

/** The actual localStorage key a base LS_KEYS value is stored under right now,
 *  matching useScopedKey (global auth keys as-is, everything else per-user). */
export function scopedKeyFor(baseKey: string): string {
  return isGlobalKey(baseKey) ? baseKey : `${baseKey}__u:${readUid()}`;
}

/** Snapshot of the current user's saved data, keyed by base LS_KEYS value. */
export function exportUserData(): Record<string, unknown> {
  const blob: Record<string, unknown> = {};
  for (const base of BASE_KEYS) {
    if (PROTECTED_BASE_KEYS.includes(base)) continue;
    const raw = localStorage.getItem(scopedKeyFor(base));
    if (raw === null) continue;
    try {
      blob[base] = JSON.parse(raw);
    } catch {
      /* skip unparyseable entry */
    }
  }
  return blob;
}

/** Restore a previously exported snapshot into the current user's namespace.
 *  Accepts both base keys and already-scoped keys for backward-compat. Returns
 *  the number of entries written. Live subscribers are notified so open views
 *  update immediately. */
export function importUserData(parsed: Record<string, unknown>): number {
  let count = 0;
  for (const [k, value] of Object.entries(parsed)) {
    const base = k.includes("__u:") ? k.slice(0, k.indexOf("__u:")) : k;
    if (!BASE_KEYS.includes(base) || PROTECTED_BASE_KEYS.includes(base)) continue;
    const sk = scopedKeyFor(base);
    try {
      localStorage.setItem(sk, JSON.stringify(value));
      notify(sk, value);
      count++;
    } catch {
      /* quota or serialization failure — skip */
    }
  }
  return count;
}

/** Remove all of the current user's saved data (keeps them signed in).
 *  Returns the number of keys actually removed. */
export function wipeUserData(): number {
  let count = 0;
  for (const base of BASE_KEYS) {
    if (PROTECTED_BASE_KEYS.includes(base)) continue;
    const sk = scopedKeyFor(base);
    if (localStorage.getItem(sk) !== null) count++;
    localStorage.removeItem(sk);
    notify(sk, undefined);
  }
  return count;
}
