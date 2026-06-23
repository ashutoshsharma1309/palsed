// Career-roadmap progress, persisted in localStorage and reactive across
// components (built on useLocalStorageState's subscriber model — same pattern as
// usePlacementProgress). Progress is keyed by stable content id, so shared items
// (DSA questions, CS topics) count across every roadmap that includes them.
import { useCallback, useMemo } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import type { ItemStatus } from "../data/roadmaps";

const PROGRESS_KEY = "prepnext.roadmap.progress.v1";
const ROLE_KEY = "prepnext.roadmap.role.v1";

type StatusMap = Record<string, ItemStatus>;

// 3-state cycle used by topic chips.
const nextStatus: Record<ItemStatus, ItemStatus> = {
  not_started: "in_progress",
  in_progress: "completed",
  completed: "not_started",
};

export interface ProgressSummary {
  completed: number;
  inProgress: number;
  notStarted: number;
  total: number;
  pct: number; // 0..1 (completed / total)
}

export function useRoadmapProgress() {
  const [statuses, setStatuses] = useLocalStorageState<StatusMap>(PROGRESS_KEY, {});
  const [selectedRole, setSelectedRole] = useLocalStorageState<string | null>(ROLE_KEY, null);

  const statusOf = useCallback(
    (id: string): ItemStatus => statuses[id] ?? "not_started",
    [statuses]
  );

  const isDone = useCallback((id: string) => statuses[id] === "completed", [statuses]);

  // Explicit set (writes "not_started" as a deletion to keep the map small).
  const setStatus = useCallback(
    (id: string, status: ItemStatus) => {
      setStatuses((prev) => {
        const next = { ...prev };
        if (status === "not_started") delete next[id];
        else next[id] = status;
        return next;
      });
    },
    [setStatuses]
  );

  // Cycle not_started → in_progress → completed → not_started (topics).
  const cycleStatus = useCallback(
    (id: string) => {
      setStatuses((prev) => {
        const cur = prev[id] ?? "not_started";
        const nxt = nextStatus[cur];
        const next = { ...prev };
        if (nxt === "not_started") delete next[id];
        else next[id] = nxt;
        return next;
      });
    },
    [setStatuses]
  );

  // Simple done/undone toggle (DSA questions, CS topics, projects, skills).
  const toggleDone = useCallback(
    (id: string) => {
      setStatuses((prev) => {
        const next = { ...prev };
        if (prev[id] === "completed") delete next[id];
        else next[id] = "completed";
        return next;
      });
    },
    [setStatuses]
  );

  // Summarize progress over an arbitrary set of content ids.
  const progressFor = useCallback(
    (ids: string[]): ProgressSummary => {
      let completed = 0;
      let inProgress = 0;
      for (const id of ids) {
        const s = statuses[id];
        if (s === "completed") completed++;
        else if (s === "in_progress") inProgress++;
      }
      const total = ids.length;
      const notStarted = total - completed - inProgress;
      return { completed, inProgress, notStarted, total, pct: total ? completed / total : 0 };
    },
    [statuses]
  );

  const resetRole = useCallback(
    (ids: string[]) => {
      setStatuses((prev) => {
        const next = { ...prev };
        for (const id of ids) delete next[id];
        return next;
      });
    },
    [setStatuses]
  );

  return useMemo(
    () => ({
      statuses,
      selectedRole,
      setSelectedRole,
      statusOf,
      isDone,
      setStatus,
      cycleStatus,
      toggleDone,
      progressFor,
      resetRole,
    }),
    [statuses, selectedRole, setSelectedRole, statusOf, isDone, setStatus, cycleStatus, toggleDone, progressFor, resetRole]
  );
}
