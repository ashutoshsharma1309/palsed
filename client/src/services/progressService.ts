// Pure progress derivations for the DSA Learning OS. No React, no storage — just
// functions over the persisted store + the roadmap data. Keeps hooks/components
// thin and makes the logic unit-testable.
import {
  PHASES, TOPICS_ORDERED, TOTAL_TOPICS, checklistFor, type Topic, type Phase, type TopicStatus,
} from "../data/dsa/roadmap";
import { computeCurrentStreak, computeBestStreak, localISO, addDays } from "../lib/streakDates";

export interface LearningStore {
  /** key: `${topicId}:${checklistItemId}` → checked */
  checklist: Record<string, boolean>;
  /** key: questionId → solved */
  solved: Record<string, boolean>;
  /** ISO dates on which ≥1 item was completed (drives the activity streak) */
  activeDays: string[];
}

export const EMPTY_STORE: LearningStore = { checklist: {}, solved: {}, activeDays: [] };

export const checklistKey = (topicId: string, itemId: string) => `${topicId}:${itemId}`;

export function topicCompleted(store: LearningStore, topic: Topic): boolean {
  return checklistFor(topic).every((it) => store.checklist[checklistKey(topic.id, it.id)]);
}

export function topicStatus(store: LearningStore, topic: Topic): TopicStatus {
  const items = checklistFor(topic);
  const done = items.filter((it) => store.checklist[checklistKey(topic.id, it.id)]).length;
  if (done === 0) return "not_started";
  if (done === items.length) return "completed";
  return "in_progress";
}

export interface LearningStats {
  problemsSolved: number;
  topicsCompleted: number;
  totalTopics: number;
  completionPct: number;        // 0..1
  currentStreak: number;
  bestStreak: number;
  todayActive: boolean;
  weekActiveDays: number;       // distinct active days in the last 7
  currentPhase: Phase;
  nextTopic: Topic | null;      // first not-yet-completed topic
}

export function computeStats(store: LearningStore): LearningStats {
  const problemsSolved = Object.values(store.solved).filter(Boolean).length;
  const topicsCompleted = TOPICS_ORDERED.filter((t) => topicCompleted(store, t)).length;
  const completionPct = TOTAL_TOPICS ? topicsCompleted / TOTAL_TOPICS : 0;

  const nextTopic = TOPICS_ORDERED.find((t) => !topicCompleted(store, t)) ?? null;
  const currentPhase =
    (nextTopic ? PHASES.find((p) => p.topicIds.includes(nextTopic.id)) : null) ??
    PHASES[PHASES.length - 1];

  const activeSet = new Set(store.activeDays);
  const today = localISO();
  let weekActiveDays = 0;
  for (let i = 0; i < 7; i++) if (activeSet.has(addDays(today, -i))) weekActiveDays++;

  return {
    problemsSolved,
    topicsCompleted,
    totalTopics: TOTAL_TOPICS,
    completionPct,
    currentStreak: computeCurrentStreak(activeSet, today),
    bestStreak: computeBestStreak(store.activeDays),
    todayActive: activeSet.has(today),
    weekActiveDays,
    currentPhase,
    nextTopic,
  };
}
