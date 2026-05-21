// EWMA mastery scoring + difficulty selection helpers.

export interface MasteryEntry {
  score: number; // 0..1
  lastUpdatedAt: string;
  samples: number;
}

export type MasteryMap = Record<string, MasteryEntry>;

const ALPHA = 0.25;

export function observe({
  correct,
  hintsUsed = 0,
}: {
  correct: boolean;
  hintsUsed?: number;
}): number {
  if (!correct) return 0;
  return Math.max(0, 1 - 0.15 * hintsUsed);
}

export function ewmaUpdate(prev: number | undefined, observed: number): number {
  const p = prev ?? 0.3; // cold-start guess: low-ish so adaptation can climb
  return Math.min(1, Math.max(0, p + ALPHA * (observed - p)));
}

export function updateMastery(
  map: MasteryMap,
  topic: string,
  { correct, hintsUsed = 0 }: { correct: boolean; hintsUsed?: number }
): MasteryMap {
  const prev = map[topic];
  const observed = observe({ correct, hintsUsed });
  const next: MasteryEntry = {
    score: ewmaUpdate(prev?.score, observed),
    lastUpdatedAt: new Date().toISOString(),
    samples: (prev?.samples ?? 0) + 1,
  };
  return { ...map, [topic]: next };
}

/** Returns target difficulty (1..5) aiming at ~70% expected success for current mastery. */
export function targetDifficulty(masteryScore: number | undefined): number {
  const m = masteryScore ?? 0.3;
  // Map mastery 0..1 to difficulty band 1..5, with the "sweet spot" tuned for ~0.7 success
  // Higher mastery → push difficulty up
  const raw = 1 + Math.round(m * 4); // 1..5
  return Math.max(1, Math.min(5, raw));
}

/** Adjust difficulty band on the fly given recent answer outcomes. */
export function adjustDifficulty(
  current: number,
  outcome: { correct: boolean; fast: boolean }
): number {
  let next = current;
  if (outcome.correct && outcome.fast) next += 1;
  else if (outcome.correct && !outcome.fast) next += 0.5;
  else if (!outcome.correct && outcome.fast) next -= 1;
  else next -= 0.5;
  return Math.max(1, Math.min(5, next));
}

export function rollingStdev(values: number[], window = 5): number {
  const slice = values.slice(-window);
  if (slice.length < 2) return Infinity;
  const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
  const variance = slice.reduce((a, b) => a + (b - mean) ** 2, 0) / slice.length;
  return Math.sqrt(variance);
}

/** Pick top weak and strong topics from the mastery map. */
export function topByMastery(map: MasteryMap, count = 3) {
  const entries = Object.entries(map);
  const sorted = [...entries].sort((a, b) => a[1].score - b[1].score);
  const weak = sorted.slice(0, count).map(([t]) => t);
  const strong = sorted.slice(-count).map(([t]) => t).reverse();
  return { weak, strong };
}
