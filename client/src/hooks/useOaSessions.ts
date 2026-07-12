import { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import type { OASession, OAConfig, OAAnswer } from "../types/oa";
import { computeStats } from "../types/oa";
import { PYQ_SEED, type PYQ } from "../data/pyqs-seed";
import { OA_QUESTIONS, type OAQuestion } from "../data/oa-questions";

const KEY = "prepnext.oaSessions.v1";

// Common shape that both curated OA questions and seeded PYQs satisfy. The
// test/result UI consumes this — never the raw types — so we can swap sources
// without rewriting components.
export interface EnrichedQuestion {
  id: string;
  title?: string;
  companySlug: string;
  companies?: string[];
  round: "OA" | "Tech" | "HR" | "Managerial" | "Group Discussion" | "Case" | "Bar Raiser";
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  problemStatement: string;          // detailed problem (from curated) or `question` (from PYQ)
  examples?: { input: string; output: string; explanation?: string }[];
  constraints?: string[];
  timeAllowedMin?: number;
  tags?: string[];
  expectedApproach?: string;         // legacy quick-summary (PYQ)
  solution?: OAQuestion["solution"];  // rich solution (curated)
  relatedLeetcode?: OAQuestion["relatedLeetcode"];
  source: "curated" | "seeded" | "crowd";
}

export function enrichPYQ(p: PYQ): EnrichedQuestion {
  return {
    id: p.id,
    companySlug: p.companySlug,
    round: p.round,
    topic: p.topic,
    difficulty: p.difficulty,
    problemStatement: p.question,
    expectedApproach: p.expectedApproach,
    source: p.source,
  };
}

export function enrichOA(q: OAQuestion): EnrichedQuestion {
  return {
    id: q.id,
    title: q.title,
    companySlug: q.companySlug,
    companies: q.companies,
    round: q.round,
    topic: q.topic,
    difficulty: q.difficulty,
    problemStatement: q.problemStatement,
    examples: q.examples,
    constraints: q.constraints,
    timeAllowedMin: q.timeAllowedMin,
    tags: q.tags,
    solution: q.solution,
    relatedLeetcode: q.relatedLeetcode,
    source: "curated",
  };
}

// Resolve any question ID to an EnrichedQuestion — used by test + result UIs.
export function getQuestionById(id: string): EnrichedQuestion | undefined {
  const oa = OA_QUESTIONS.find((q) => q.id === id);
  if (oa) return enrichOA(oa);
  const pyq = PYQ_SEED.find((q) => q.id === id);
  if (pyq) return enrichPYQ(pyq);
  return undefined;
}

/**
 * Pick `count` questions matching the OA config.
 *
 * Strategy:
 *   1. Build the pool, preferring CURATED OA questions (full solutions)
 *      then padding with seeded PYQs of round === 'OA'.
 *   2. Narrow by companySlug + difficulty + topic.
 *   3. Shuffle and take `count`.
 *   4. If under-supplied, fall back to 'Tech' round PYQs; if still short,
 *      return what we got.
 */
export function pickQuestionsForConfig(config: OAConfig): EnrichedQuestion[] {
  let pool: EnrichedQuestion[] = [
    ...OA_QUESTIONS.map(enrichOA),
    ...PYQ_SEED.filter((p) => p.round === "OA").map(enrichPYQ),
  ];

  if (config.companySlug) {
    pool = pool.filter(
      (q) => q.companySlug === config.companySlug || (q.companies && q.companies.some((c) => c.toLowerCase().replace(/[^a-z0-9]/g, "") === config.companySlug!.replace(/-/g, "")))
    );
  }
  if (config.difficulty && config.difficulty !== "Mixed") {
    pool = pool.filter((q) => q.difficulty === config.difficulty);
  }
  if (config.topicFilter) {
    const needle = config.topicFilter.toLowerCase();
    pool = pool.filter(
      (q) =>
        q.topic.toLowerCase().includes(needle) ||
        (q.tags || []).some((t) => t.toLowerCase().includes(needle))
    );
  }

  // Fallback: top up from Tech-round PYQs
  if (pool.length < config.questionCount) {
    let fb = PYQ_SEED.filter((p) => p.round === "Tech").map(enrichPYQ);
    if (config.companySlug) fb = fb.filter((q) => q.companySlug === config.companySlug);
    if (config.difficulty && config.difficulty !== "Mixed") {
      fb = fb.filter((q) => q.difficulty === config.difficulty);
    }
    pool = [...pool, ...fb];
  }

  // Shuffle then take
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
          // Preserve the original finish time — re-grading on the result page
          // must not reset it and inflate the displayed "time spent".
          const finishedAt = s.finishedAt || new Date().toISOString();
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

  return { sessions, create, get, update, updateAnswer, finish, remove };
}
