import { describe, it, expect } from "vitest";
import {
  EMPTY_STORE, checklistKey, topicCompleted, topicStatus, computeStats, type LearningStore,
} from "./progressService";
import { getTopic, checklistFor, PHASES, TOPICS_ORDERED } from "../data/dsa/roadmap";
import { localISO } from "../lib/streakDates";

// A topic whose checklist we'll drive.
const TOPIC = getTopic("io")!;
const items = checklistFor(TOPIC);

function storeWith(partial: Partial<LearningStore>): LearningStore {
  return { ...EMPTY_STORE, ...partial };
}

describe("topic completion", () => {
  it("topicStatus reflects checklist progress", () => {
    expect(topicStatus(EMPTY_STORE, TOPIC)).toBe("not_started");

    const oneChecked = storeWith({ checklist: { [checklistKey(TOPIC.id, items[0].id)]: true } });
    expect(topicStatus(oneChecked, TOPIC)).toBe("in_progress");

    const allChecked = storeWith({
      checklist: Object.fromEntries(items.map((it) => [checklistKey(TOPIC.id, it.id), true])),
    });
    expect(topicStatus(allChecked, TOPIC)).toBe("completed");
    expect(topicCompleted(allChecked, TOPIC)).toBe(true);
  });
});

describe("computeStats", () => {
  it("empty store → zeroed stats, first topic is next", () => {
    const s = computeStats(EMPTY_STORE);
    expect(s.problemsSolved).toBe(0);
    expect(s.topicsCompleted).toBe(0);
    expect(s.completionPct).toBe(0);
    expect(s.nextTopic?.id).toBe(TOPICS_ORDERED[0].id);
    expect(s.currentPhase.id).toBe(PHASES[0].id);
    expect(s.currentStreak).toBe(0);
  });

  it("counts solved problems and active-streak from today", () => {
    const today = localISO();
    const s = computeStats(storeWith({ solved: { "io-q1": true, "io-q2": true }, activeDays: [today] }));
    expect(s.problemsSolved).toBe(2);
    expect(s.todayActive).toBe(true);
    expect(s.currentStreak).toBe(1);
    expect(s.weekActiveDays).toBe(1);
  });

  it("advances nextTopic once the first topic is completed", () => {
    const first = TOPICS_ORDERED[0];
    const completedFirst = storeWith({
      checklist: Object.fromEntries(checklistFor(first).map((it) => [checklistKey(first.id, it.id), true])),
    });
    const s = computeStats(completedFirst);
    expect(s.topicsCompleted).toBe(1);
    expect(s.nextTopic?.id).toBe(TOPICS_ORDERED[1].id);
    expect(s.completionPct).toBeCloseTo(1 / TOPICS_ORDERED.length, 5);
  });
});
