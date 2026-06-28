import { describe, it, expect } from "vitest";
import {
  PATTERNS, PATTERN_CATEGORIES, PATTERN_CHECKLIST, getPattern,
  patternsByCategory, TOTAL_PATTERNS, TOTAL_PATTERN_QUESTIONS,
} from "./patterns";

describe("Patterns module data integrity", () => {
  it("pattern ids are unique", () => {
    const ids = PATTERNS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every pattern belongs to a known category", () => {
    for (const p of PATTERNS) {
      expect(PATTERN_CATEGORIES as readonly string[], `"${p.id}" has unknown category "${p.category}"`).toContain(p.category);
    }
  });

  it("every pattern has the required teaching sections filled", () => {
    for (const p of PATTERNS) {
      expect(p.definition.length, `${p.id} definition`).toBeGreaterThan(0);
      expect(p.why.length, `${p.id} why`).toBeGreaterThan(0);
      expect(p.recognitionClues.length, `${p.id} recognitionClues`).toBeGreaterThan(0);
      expect(p.whenToUse.length, `${p.id} whenToUse`).toBeGreaterThan(0);
      expect(p.whenNotToUse.length, `${p.id} whenNotToUse`).toBeGreaterThan(0);
      expect(p.example.code.trim().length, `${p.id} example`).toBeGreaterThan(0);
    }
  });

  it("question ids are globally unique with valid C++ + complexities", () => {
    const qids = PATTERNS.flatMap((p) => p.questions.map((q) => q.id));
    expect(new Set(qids).size).toBe(qids.length);
    for (const p of PATTERNS) {
      for (const q of p.questions) {
        expect(q.solution.cpp.trim().length, `${q.id} empty C++`).toBeGreaterThan(0);
        expect(["Easy", "Medium", "Hard"]).toContain(q.difficulty);
      }
    }
  });

  it("getPattern resolves every pattern id", () => {
    for (const p of PATTERNS) expect(getPattern(p.id)?.name).toBe(p.name);
  });

  it("checklist is non-empty and counts are consistent", () => {
    expect(PATTERN_CHECKLIST.length).toBeGreaterThan(0);
    expect(TOTAL_PATTERNS).toBe(PATTERNS.length);
    expect(TOTAL_PATTERN_QUESTIONS).toBe(PATTERNS.reduce((n, p) => n + p.questions.length, 0));
  });

  it("patternsByCategory covers every pattern exactly once", () => {
    const grouped = patternsByCategory().flatMap((g) => g.patterns.map((p) => p.id));
    expect(new Set(grouped).size).toBe(PATTERNS.length);
  });
});
