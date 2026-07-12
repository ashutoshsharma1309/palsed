import { useCallback, useMemo } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { PYQ, PYQ_SEED } from "../data/pyqs-seed";

const KEY = "prepnext.pyq.v1";

// The seed data ships a handful of duplicate ids. Guarantee unique ids once, at
// module load, so React keys and per-question vote state never collide.
const SEED: PYQ[] = (() => {
  const seen = new Set<string>();
  return PYQ_SEED.map((p) => {
    let id = p.id;
    while (seen.has(id)) id = `${id}_${seen.size}`;
    seen.add(id);
    return id === p.id ? p : { ...p, id };
  });
})();

interface State {
  userSubmitted: PYQ[];        // crowd-submitted (this browser)
  votes: Record<string, "up" | "down" | undefined>; // pyqId → user vote
}

const DEFAULT: State = { userSubmitted: [], votes: {} };

export function usePYQs() {
  const [state, setState] = useLocalStorageState<State>(KEY, DEFAULT);

  const all = useMemo(
    () => [...state.userSubmitted, ...SEED],
    [state.userSubmitted]
  );

  // Displayed counts = stored base + this user's own vote, applied uniformly to
  // seed and crowd entries so a vote always visibly moves the number.
  const countsFor = useCallback(
    (p: PYQ) => {
      const v = state.votes[p.id];
      return {
        upvotes: p.upvotes + (v === "up" ? 1 : 0),
        downvotes: p.downvotes + (v === "down" ? 1 : 0),
      };
    },
    [state.votes]
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
          // toggle the vote off
          const { [pyqId]: _removed, ...rest } = prev.votes;
          return { ...prev, votes: rest };
        }
        // set/switch the vote — display counts are derived via countsFor().
        return { ...prev, votes: { ...prev.votes, [pyqId]: dir } };
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

  return { all, userSubmitted: state.userSubmitted, votes: state.votes, countsFor, submit, vote, remove };
}
