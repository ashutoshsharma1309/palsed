// Offline-first progress sync: localStorage stays the source of truth the app
// always reads/writes (nothing above this hook changes); this just mirrors it
// to the server so progress survives a cleared browser or a new device.
//   - On sign-in: hydrate from the server ONCE per session (only if the server
//     actually has data — an empty/new account must not clobber fresh local
//     progress with nothing).
//   - While signed in: periodically push a snapshot if it changed since the
//     last successful push, plus an eager push when the tab is hidden/closed.
// Network failures are swallowed (console.warn) — sync is best-effort and must
// never block or break the app if the server/DB isn't reachable.
import { useEffect, useRef } from "react";
import { useAuth } from "./useAuth";
import { exportUserData, importUserData } from "./useLocalStorageState";
import { fetchProgress, pushProgress } from "../lib/sync/progressSync";

const PUSH_INTERVAL_MS = 20_000;

export function useProgressSync(): void {
  const { isAuthenticated, user } = useAuth();
  const hydratedForUserRef = useRef<string | null>(null);
  const lastPushedRef = useRef<string>("");

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    let cancelled = false;

    const hydrate = async () => {
      if (hydratedForUserRef.current === user.id) return;
      hydratedForUserRef.current = user.id;
      try {
        const { data } = await fetchProgress();
        if (!cancelled && data && Object.keys(data).length > 0) {
          importUserData(data);
          lastPushedRef.current = JSON.stringify(data);
        }
      } catch (e) {
        console.warn("[progressSync] hydrate failed:", (e as Error)?.message);
      }
    };

    const push = async () => {
      try {
        const snapshot = exportUserData();
        const serialized = JSON.stringify(snapshot);
        if (serialized === lastPushedRef.current) return;
        await pushProgress(snapshot);
        lastPushedRef.current = serialized;
      } catch (e) {
        console.warn("[progressSync] push failed:", (e as Error)?.message);
      }
    };

    void hydrate();
    const interval = setInterval(push, PUSH_INTERVAL_MS);
    const onVisibility = () => { if (document.hidden) void push(); };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", push);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", push);
    };
  }, [isAuthenticated, user?.id]);
}
