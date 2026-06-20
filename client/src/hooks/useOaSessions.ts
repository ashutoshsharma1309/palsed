import { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import type { OASession, OAConfig, OAAnswer } from "../types/oa";
import { computeStats } from "../types/oa";
import { PYQ_SEED, type PYQ } from "../data/pyqs-seed";

const KEY = "prepnext.oaSessions.v1";

// In-session draft of answers (separate from history). Keeps user input
// resilient to refresh during an active test without polluting the history.
const DRAFT_KEY_PREFIX = "prepnext.oaDraft.";

/**
 * Pick `count` PYQs matching the OA config. Strategy:
 *   1. Filter PYQ_SEED to round === "OA".
 *   2. Narrow by companySlug + difficulty + topic if set.
 *   3. Shuffle and take `count`.
 *   4. If under-supplied, fall back to "Tech" round; if still short, return what we got.
 */
export function pickQuestionsForConfig(config: OAConfig): PYQ[] {
  let pool = PYQ_SEED.filter((p) => p.round === "OA");
  if (config.companySlug) pool = pool.filter((p) => p.companySlug === config.companySlug);
  if (config.difficulty && config.difficulty !== "Mixed") {
    pool = pool.filter((p) => p.difficulty === config.difficulty);
  }
  if (config.topicFilter) {
    pool = pool.filter((p) => p.topic.toLowerCase().includes(config.topicFilter!.toLowerCase()));
  }
  // Fallback: if too few OA questions, top up with Tech-round questions of same filters.
  if (pool.length < config.questionCount) {
    let fb = PYQ_SEED.filter((p) => p.round === "Tech");
    if (config.companySlug) fb = fb.filter((p) => p.companySlug === config.companySlug);
    if (config.difficulty && config.difficulty !== "Mixed") {
      fb = fb.filter((p) => p.difficulty === config.difficulty);
    }
    pool = [...pool, ...fb];
  }
  // Fisher-Yates shuffle
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, config.questionCount);
}

export function useOaSessions() {
  const [sessions, setSessions] = useLocalStorageState<OASession[]>(KEY, []);

  const create = useCallback(
    (config: OAConfig) => {
      const qs = pickQuestionsForConfig(config);
      if (qs.length === 0) return null;
      const id = `oa_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
      const empty: Record<string, OAAnswer> = {};
      qs.forEach((q) => (empty[q.id] = { notes: "", grade: null, flagged: false, viewedApproach: false }));
      const s: OASession = {
        id,
        config,
        questionIds: qs.map((q) => q.id),
        answers: empty,
        startedAt: new Date().toISOString(),
      };
      setSessions((prev) => [s, ...prev]);
      return s;
    },
    [setSessions]
  );

  const get = useCallback((id: string) => sessions.find((s) => s.id === id), [sessions]);

  const update = useCallback(
    (id: string, patch: Partial<OASession>) => {
      setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    },
    [setSessions]
  );

  const updateAnswer = useCallback(
    (id: string, qid: string, patch: Partial<OAAnswer>) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, answers: { ...s.answers, [qid]: { ...s.answers[qid], ...patch } } }
            : s
        )
      );
    },
    [setSessions]
  );

  const finish = useCallback(
    (id: string) => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          const finishedAt = new Date().toISOString();
          const full = { ...s, finishedAt };
          full.resultStats = computeStats(full);
          return full;
        })
      );
    },
    [setSessions]
  );

  const remove = useCallback(
    (id: string) => setSessions((prev) => prev.filter((s) => s.id !== id)),
    [setSessions]
  );

  // Derived list ordered newest-first; sessions persist start order already.
  return { sessions, create, get, update, updateAnswer, finish, remove };
}

export function draftKey(sessionId: string) {
  return `${DRAFT_KEY_PREFIX}${sessionId}`;
}
