// Best-effort sync of the DSA-learning store to the server.
//
// Strategy = "local-authoritative, server backup, restore-on-empty":
//  • On first authenticated load, if local progress is EMPTY, pull the server
//    backup (so a fresh device restores). If local has data, keep it.
//  • After that, debounced-push local → server on every change (backup).
// Everything is wrapped so an offline client / un-migrated DB silently keeps
// working on localStorage. Never merges, so it can't corrupt local data.
import { useEffect, useRef, useState } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { useAuth } from "./useAuth";
import { EMPTY_STORE, type LearningStore } from "../services/progressService";
import { fetchProgress, saveProgress } from "../lib/learningApi";

const KEY = "prepnext.dsaLearning.v1";

const isEmpty = (s: LearningStore) =>
  !Object.keys(s.checklist ?? {}).length &&
  !Object.keys(s.solved ?? {}).length &&
  !(s.activeDays ?? []).length;

export function useLearningSync() {
  const { isAuthenticated } = useAuth();
  const [store, setStore] = useLocalStorageState<LearningStore>(KEY, EMPTY_STORE);
  const [ready, setReady] = useState(false); // backup enabled only after restore settles
  const startedRestore = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // One-time restore on first authenticated render.
  useEffect(() => {
    if (!isAuthenticated || startedRestore.current) return;
    startedRestore.current = true;
    (async () => {
      try {
        if (isEmpty(store)) {
          const server = await fetchProgress();
          if (server && !isEmpty(server)) setStore(server);
        }
      } catch {
        /* offline / un-migrated → stay on localStorage */
      } finally {
        setReady(true);
      }
    })();
    // store read once at first authed render — intentionally not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Debounced backup after the restore step settled (avoids pushing empty over a
  // real server backup before it loads).
  useEffect(() => {
    if (!isAuthenticated || !ready) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { void saveProgress(store).catch(() => {}); }, 1500);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [store, isAuthenticated, ready]);
}
