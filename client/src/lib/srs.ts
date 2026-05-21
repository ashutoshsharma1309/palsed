// SM-2 lite spaced-repetition scheduler.

export type SRSRating = "again" | "hard" | "good" | "easy";
export type SRSKind = "concept" | "dsa" | "quiz";

export interface SRSItem {
  itemId: string;
  kind: SRSKind;
  payload?: Record<string, unknown>;
  dueAt: string;
  easeFactor: number; // default 2.5
  interval: number; // days
  reps: number;
  lastReviewedAt?: string;
}

const MS_PER_DAY = 86_400_000;

export function newSRSItem({
  itemId,
  kind,
  payload,
}: {
  itemId: string;
  kind: SRSKind;
  payload?: Record<string, unknown>;
}): SRSItem {
  return {
    itemId,
    kind,
    payload,
    dueAt: new Date(Date.now() + MS_PER_DAY).toISOString(),
    easeFactor: 2.5,
    interval: 1,
    reps: 0,
  };
}

export function rate(item: SRSItem, rating: SRSRating): SRSItem {
  let { easeFactor, interval, reps } = item;
  switch (rating) {
    case "again":
      reps = 0;
      interval = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      break;
    case "hard":
      interval = Math.max(1, Math.round(interval * 1.2));
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      break;
    case "good":
      interval = reps === 0 ? 1 : reps === 1 ? 6 : Math.round(interval * easeFactor);
      reps += 1;
      break;
    case "easy":
      interval = (reps === 0 ? 1 : reps === 1 ? 6 : Math.round(interval * easeFactor)) ;
      interval = Math.round(interval * 1.3);
      easeFactor = easeFactor + 0.15;
      reps += 1;
      break;
  }
  return {
    ...item,
    easeFactor,
    interval,
    reps,
    lastReviewedAt: new Date().toISOString(),
    dueAt: new Date(Date.now() + interval * MS_PER_DAY).toISOString(),
  };
}

export function dueCount(items: SRSItem[], now = Date.now()): number {
  return items.filter((i) => new Date(i.dueAt).getTime() <= now).length;
}

export function dueItems(items: SRSItem[], now = Date.now()): SRSItem[] {
  return items.filter((i) => new Date(i.dueAt).getTime() <= now);
}

export function upsert(items: SRSItem[], next: SRSItem): SRSItem[] {
  const idx = items.findIndex((i) => i.itemId === next.itemId && i.kind === next.kind);
  if (idx === -1) return [...items, next];
  const copy = items.slice();
  copy[idx] = next;
  return copy;
}
