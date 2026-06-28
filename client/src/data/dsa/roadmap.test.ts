import { describe, it, expect } from "vitest";
import { PHASES, TOPICS_ALL, TOPICS_ORDERED, getTopic, getPhase, checklistFor } from "./roadmap";

describe("DSA roadmap data integrity", () => {
  it("every phase topicId resolves to a defined topic", () => {
    for (const p of PHASES) {
      for (const id of p.topicIds) {
        expect(getTopic(id), `phase ${p.id} references missing topic "${id}"`).toBeTruthy();
      }
    }
  });

  it("topic ids are unique", () => {
    const ids = TOPICS_ALL.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every topic belongs to exactly one phase", () => {
    for (const t of TOPICS_ALL) {
      const owning = PHASES.filter((p) => p.topicIds.includes(t.id));
      expect(owning.length, `topic "${t.id}" is in ${owning.length} phases`).toBe(1);
      expect(getPhase(t.phaseId)?.topicIds).toContain(t.id);
    }
  });

  it("question ids are globally unique", () => {
    const qids = TOPICS_ALL.flatMap((t) => t.questions.map((q) => q.id));
    expect(new Set(qids).size).toBe(qids.length);
  });

  it("every question has a non-empty C++ solution and complexities", () => {
    for (const t of TOPICS_ALL) {
      for (const q of t.questions) {
        expect(q.solution.cpp.trim().length, `${q.id} has empty C++`).toBeGreaterThan(0);
        expect(q.timeComplexity.length).toBeGreaterThan(0);
        expect(q.spaceComplexity.length).toBeGreaterThan(0);
        expect(["Easy", "Medium", "Hard"]).toContain(q.difficulty);
      }
    }
  });

  it("every topic exposes a non-empty checklist", () => {
    for (const t of TOPICS_ALL) {
      expect(checklistFor(t).length).toBeGreaterThan(0);
    }
  });

  it("TOPICS_ORDERED equals the flattened phase order with no gaps", () => {
    const expected = PHASES.flatMap((p) => p.topicIds);
    expect(TOPICS_ORDERED.map((t) => t.id)).toEqual(expected);
  });
});
