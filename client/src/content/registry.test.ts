import { describe, it, expect } from "vitest";
import { checklistForLesson, isLessonComplete } from "./registry";
import { DEFAULT_CHECKLIST } from "../data/dsa/roadmap";
import type { Lesson } from "./types";

const base: Lesson = {
  id: "sample",
  domain: "web",
  moduleId: "m1",
  title: "Sample",
  objective: "Test",
  difficulty: "Beginner",
  estMinutes: 5,
  theory: "…",
};

describe("checklistForLesson", () => {
  it("DSA lessons without an override use the exact legacy DEFAULT_CHECKLIST (no regression)", () => {
    const dsaLesson: Lesson = { ...base, domain: "dsa" };
    expect(checklistForLesson(dsaLesson)).toBe(DEFAULT_CHECKLIST);
  });

  it("non-DSA lessons without a quiz get theory/understood/revised only", () => {
    const items = checklistForLesson(base);
    expect(items.map((i) => i.id)).toEqual(["theory", "understood", "revised"]);
  });

  it("non-DSA lessons with a quiz include a quiz checklist item", () => {
    const withQuiz: Lesson = {
      ...base,
      quiz: [{ id: "q1", type: "truefalse", prompt: "?", answer: true, explanation: "…" }],
    };
    const items = checklistForLesson(withQuiz);
    expect(items.map((i) => i.id)).toContain("quiz");
  });

  it("an explicit lesson.checklist always wins", () => {
    const custom: Lesson = { ...base, checklist: [{ id: "x", label: "Custom" }] };
    expect(checklistForLesson(custom)).toEqual([{ id: "x", label: "Custom" }]);
  });
});

describe("isLessonComplete", () => {
  it("is false until every checklist item is checked", () => {
    const checked = new Set(["sample:theory"]);
    const isChecked = (lessonId: string, itemId: string) => checked.has(`${lessonId}:${itemId}`);
    expect(isLessonComplete(isChecked, base)).toBe(false);
  });

  it("is true once every checklist item is checked", () => {
    const items = checklistForLesson(base).map((i) => i.id);
    const checked = new Set(items.map((id) => `sample:${id}`));
    const isChecked = (lessonId: string, itemId: string) => checked.has(`${lessonId}:${itemId}`);
    expect(isLessonComplete(isChecked, base)).toBe(true);
  });
});
