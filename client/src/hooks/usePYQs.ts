import { useCallback, useMemo } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { PYQ, PYQ_SEED } from "../data/pyqs-seed";

const KEY = "prepnext.pyq.v1";

interface State {
  userSubmitted: PYQ[];        // crowd-submitted (this browser)
  votes: Record<string, "up" | "down" | undefined>; // pyqId → user vote
}

const DEFAULT: State = { userSubmitted: [], votes: {} };

export function usePYQs() {
  const [state, setState] = useLocalStorageState<State>(KEY, DEFAULT);

  const all = useMemo(
    () => [...state.userSubmitted, ...PYQ_SEED],
    [state.userSubmitted]
  );

  const submit = useCallback(
    (pyq: Omit<PYQ, "id" | "source" | "status" | "upvotes" | "downvotes" | "submittedAt">) => {
      const next: PYQ = {
        ...pyq,
        id: `pyq_u_${Date.now().toString(36)}`,
        source: "crowd",
        status: "pending",
        upvotes: 0,
        downvotes: 0,
        submittedAt: new Date().toISOString(),
      };
      setState((prev) => ({ ...prev, userSubmitted: [next, ...prev.userSubmitted] }));
      return next;
    },
    [setState]
  );

  const vote = useCallback(
    (pyqId: string, dir: "up" | "down") => {
      setState((prev) => {
        const current = prev.votes[pyqId];
        if (current === dir) {
          // toggle off
          const { [pyqId]: _, ...rest } = prev.votes;
          // mirror counts on user-submitted entries
          const userSubmitted = prev.userSubmitted.map((p) =>
            p.id === pyqId
              ? { ...p, [dir === "up" ? "upvotes" : "downvotes"]: Math.max(0, (dir === "up" ? p.upvotes : p.downvotes) - 1) }
              : p
          );
          return { ...prev, votes: rest, userSubmitted };
        }
        const votes = { ...prev.votes, [pyqId]: dir };
        const userSubmitted = prev.userSubmitted.map((p) => {
          if (p.id !== pyqId) return p;
          let up = p.upvotes, down = p.downvotes;
          // reverse previous vote
          if (current === "up") up = Math.max(0, up - 1);
          if (current === "down") down = Math.max(0, down - 1);
          if (dir === "up") up += 1; else down += 1;
          return { ...p, upvotes: up, downvotes: down };
        });
        return { ...prev, votes, userSubmitted };
      });
    },
    [setState]
  );

  const remove = useCallback(
    (pyqId: string) => {
      setState((prev) => ({
        ...prev,
        userSubmitted: prev.userSubmitted.filter((p) => p.id !== pyqId),
        votes: Object.fromEntries(Object.entries(prev.votes).filter(([k]) => k !== pyqId)),
      }));
    },
    [setState]
  );

  return { all, userSubmitted: state.userSubmitted, votes: state.votes, submit, vote, remove };
}
