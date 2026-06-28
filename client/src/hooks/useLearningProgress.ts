// Central DSA-learning store: per-topic checklist, per-question solved state, and
// the activity-day log that powers the streak. Single source of truth (one
// localStorage key); useChecklist + useDailyStreak read from the same store so
// everything stays in sync. Backend-migratable (swap the persistence here).
import { useCallback, useMemo } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { localISO } from "../lib/streakDates";
import {
  EMPTY_STORE, checklistKey, computeStats, topicStatus, topicCompleted,
  type LearningStore,
} from "../services/progressService";
import { getTopic, type Topic } from "../data/dsa/roadmap";

const KEY = "prepnext.dsaLearning.v1";

export function useLearningProgress() {
  const [store, setStore] = useLocalStorageState<LearningStore>(KEY, EMPTY_STORE);

  // Stamp today into the activity log (idempotent) — called on any completion.
  const markActiveToday = useCallback((s: LearningStore): LearningStore => {
    const today = localISO();
    if (s.activeDays.includes(today)) return s;
    return { ...s, activeDays: [...s.activeDays, today].sort() };
  }, []);

  const isChecked = useCallback(
    (topicId: string, itemId: string) => !!store.checklist[checklistKey(topicId, itemId)],
    [store.checklist]
  );

  const toggleChecklist = useCallback(
    (topicId: string, itemId: string) => {
      setStore((prev) => {
        const key = checklistKey(topicId, itemId);
        const next: LearningStore = { ...prev, checklist: { ...prev.checklist } };
        if (next.checklist[key]) delete next.checklist[key];
        else next.checklist[key] = true;
        // Completing an item counts as learning activity for today.
        return next.checklist[key] ? markActiveToday(next) : next;
      });
    },
    [setStore, markActiveToday]
  );

  const isSolved = useCallback((qid: string) => !!store.solved[qid], [store.solved]);

  const toggleSolved = useCallback(
    (qid: string) => {
      setStore((prev) => {
        const next: LearningStore = { ...prev, solved: { ...prev.solved } };
        if (next.solved[qid]) delete next.solved[qid];
        else next.solved[qid] = true;
        return next.solved[qid] ? markActiveToday(next) : next;
      });
    },
    [setStore, markActiveToday]
  );

  const statusOf = useCallback(
    (topicId: string): ReturnType<typeof topicStatus> => {
      const t = getTopic(topicId);
      return t ? topicStatus(store, t) : "not_started";
    },
    [store]
  );

  const completedTopic = useCallback(
    (topic: Topic) => topicCompleted(store, topic),
    [store]
  );

  const stats = useMemo(() => computeStats(store), [store]);

  return {
    store, stats,
    isChecked, toggleChecklist,
    isSolved, toggleSolved,
    statusOf, completedTopic,
  };
}
