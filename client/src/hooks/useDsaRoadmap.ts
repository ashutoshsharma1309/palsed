// DSA Roadmap — an ordered, beginner→advanced topic journey with 3-state
// progress per topic. Persisted with the app's existing localStorage pattern
// (useLocalStorageState, prepnext.* namespace) so it's backend-migratable later.
import { useCallback, useMemo } from "react";
import { useLocalStorageState } from "./useLocalStorageState";

export type TopicStatus = "not_started" | "in_progress" | "completed";

export interface DsaTopic {
  id: string;
  name: string;
}

/** The roadmap, in learning order. */
export const DSA_ROADMAP_TOPICS: DsaTopic[] = [
  { id: "input", name: "Taking Input" },
  { id: "variables", name: "Variables & Data Types" },
  { id: "loops", name: "Loops" },
  { id: "functions", name: "Functions" },
  { id: "arrays", name: "Arrays" },
  { id: "strings", name: "Strings" },
  { id: "searching", name: "Searching" },
  { id: "sorting", name: "Sorting" },
  { id: "recursion", name: "Recursion" },
  { id: "backtracking", name: "Backtracking" },
  { id: "linked-list", name: "Linked List" },
  { id: "stack", name: "Stack" },
  { id: "queue", name: "Queue" },
  { id: "hashing", name: "Hashing" },
  { id: "trees", name: "Trees" },
  { id: "bst", name: "Binary Search Tree" },
  { id: "heap", name: "Heap" },
  { id: "graphs", name: "Graphs" },
  { id: "greedy", name: "Greedy" },
  { id: "dp", name: "Dynamic Programming" },
];

const KEY = "prepnext.dsaRoadmap.v1";
const NEXT: Record<TopicStatus, TopicStatus> = {
  not_started: "in_progress",
  in_progress: "completed",
  completed: "not_started",
};

export function useDsaRoadmap() {
  const [statuses, setStatuses] = useLocalStorageState<Record<string, TopicStatus>>(KEY, {});

  const statusOf = useCallback(
    (id: string): TopicStatus => statuses[id] ?? "not_started",
    [statuses]
  );

  // Cycle Not Started → In Progress → Completed → Not Started.
  const cycle = useCallback(
    (id: string) => {
      setStatuses((prev) => {
        const next = { ...prev };
        const nxt = NEXT[prev[id] ?? "not_started"];
        if (nxt === "not_started") delete next[id];
        else next[id] = nxt;
        return next;
      });
    },
    [setStatuses]
  );

  const setStatus = useCallback(
    (id: string, status: TopicStatus) => {
      setStatuses((prev) => {
        const next = { ...prev };
        if (status === "not_started") delete next[id];
        else next[id] = status;
        return next;
      });
    },
    [setStatuses]
  );

  const { completed, inProgress } = useMemo(() => {
    let c = 0;
    let i = 0;
    for (const t of DSA_ROADMAP_TOPICS) {
      const s = statuses[t.id];
      if (s === "completed") c++;
      else if (s === "in_progress") i++;
    }
    return { completed: c, inProgress: i };
  }, [statuses]);

  const total = DSA_ROADMAP_TOPICS.length;
  const pct = total ? completed / total : 0;

  return { topics: DSA_ROADMAP_TOPICS, statusOf, cycle, setStatus, completed, inProgress, total, pct };
}
