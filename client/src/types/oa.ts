// OA (Online Assessment) Practice Mode types.
// Persistent in localStorage via the useOaSessions hook.

export type OAGrade = "solved" | "partial" | "unsolved";
export type OADifficulty = "Easy" | "Medium" | "Hard" | "Mixed";

export interface OAAnswer {
  notes: string;                  // user's approach notes
  grade: OAGrade | null;          // self-graded after the test
  flagged: boolean;               // marked for review during test
  viewedApproach: boolean;        // used the "show expected" peek during test
  timeSpentMs?: number;
}

export interface OASession {
  id: string;
  config: {
    companySlug?: string;          // undefined = "All companies" mix
    durationMin: number;           // total time budget
    questionCount: number;
    difficulty: OADifficulty;
    topicFilter?: string;
    label?: string;                // user-friendly name e.g. "Razorpay Mock — Sat"
  };
  questionIds: string[];           // PYQ ids in order
  answers: Record<string, OAAnswer>;
  startedAt: string;               // ISO timestamp test was started
  finishedAt?: string;             // ISO timestamp test ended (submit or timeout)
  // Derived but persisted so the history list is fast:
  resultStats?: {
    solvedCount: number;
    partialCount: number;
    unsolvedCount: number;
    score: number;                 // 0-100, weighted (solved=1, partial=0.5, unsolved=0, -0.2 if viewed approach)
    durationActualMs: number;
  };
}

export interface OAConfig {
  companySlug?: string;
  durationMin: number;
  questionCount: number;
  difficulty: OADifficulty;
  topicFilter?: string;
}

// Scoring: each question is worth 100/count points.
// solved=full, partial=50%, unsolved=0%. -20% penalty per question if approach
// was viewed (since real OAs don't have hints).
export function computeStats(session: OASession): OASession["resultStats"] {
  const total = session.questionIds.length;
  let solvedCount = 0;
  let partialCount = 0;
  let unsolvedCount = 0;
  let raw = 0;
  for (const qid of session.questionIds) {
    const a = session.answers[qid];
    const g = a?.grade;
    let q = 0;
    if (g === "solved") {
      solvedCount++;
      q = 1;
    } else if (g === "partial") {
      partialCount++;
      q = 0.5;
    } else {
      unsolvedCount++;
      q = 0;
    }
    if (a?.viewedApproach) q = Math.max(0, q - 0.2);
    raw += q;
  }
  const score = Math.round((raw / total) * 100);
  const durationActualMs =
    session.finishedAt
      ? new Date(session.finishedAt).getTime() - new Date(session.startedAt).getTime()
      : 0;
  return { solvedCount, partialCount, unsolvedCount, score, durationActualMs };
}

export function defaultOaConfig(): OAConfig {
  return {
    companySlug: undefined,
    durationMin: 30,
    questionCount: 2,
    difficulty: "Mixed",
    topicFilter: undefined,
  };
}
