import { describe, it, expect } from "vitest";
import { totalXp, xpForLevel, levelInfo, earnedBadges, BADGES, type ActivitySnapshot } from "./gamification";

const empty: ActivitySnapshot = {
  checklistTicks: 0,
  solvedProblems: 0,
  quizCorrect: 0,
  lessonsCompleted: 0,
  currentStreak: 0,
};

describe("gamification: XP", () => {
  it("awards zero XP for no activity", () => {
    expect(totalXp(empty)).toBe(0);
  });

  it("sums weighted contributions", () => {
    const xp = totalXp({ ...empty, checklistTicks: 2, solvedProblems: 1, quizCorrect: 3 });
    expect(xp).toBe(2 * 10 + 1 * 15 + 3 * 12);
  });
});

describe("gamification: levels", () => {
  it("level 1 requires 0 XP", () => {
    expect(xpForLevel(1)).toBe(0);
  });

  it("xpForLevel is strictly increasing", () => {
    for (let n = 1; n < 20; n++) {
      expect(xpForLevel(n + 1)).toBeGreaterThan(xpForLevel(n));
    }
  });

  it("levelInfo resolves to level 1 at 0 XP", () => {
    const info = levelInfo(0);
    expect(info.level).toBe(1);
    expect(info.progress).toBeGreaterThanOrEqual(0);
  });

  it("levelInfo advances exactly at each threshold", () => {
    const l2Threshold = xpForLevel(2);
    expect(levelInfo(l2Threshold - 1).level).toBe(1);
    expect(levelInfo(l2Threshold).level).toBe(2);
  });

  it("progress is always within [0, 1]", () => {
    for (const xp of [0, 50, 100, 500, 5000, 50000]) {
      const info = levelInfo(xp);
      expect(info.progress).toBeGreaterThanOrEqual(0);
      expect(info.progress).toBeLessThanOrEqual(1);
    }
  });
});

describe("gamification: badges", () => {
  it("earns nothing at zero activity", () => {
    expect(earnedBadges(empty, 0)).toEqual([]);
  });

  it("badge ids are unique", () => {
    const ids = BADGES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("earns first-steps after one checklist tick", () => {
    const earned = earnedBadges({ ...empty, checklistTicks: 1 }, totalXp({ ...empty, checklistTicks: 1 }));
    expect(earned.some((b) => b.id === "first-steps")).toBe(true);
  });

  it("earns streak badges only once the threshold is met", () => {
    const under = earnedBadges({ ...empty, currentStreak: 6 }, 0);
    const at = earnedBadges({ ...empty, currentStreak: 7 }, 0);
    expect(under.some((b) => b.id === "on-fire")).toBe(false);
    expect(at.some((b) => b.id === "on-fire")).toBe(true);
  });

  it("centurion requires 1000 XP regardless of activity mix", () => {
    expect(earnedBadges(empty, 999).some((b) => b.id === "centurion")).toBe(false);
    expect(earnedBadges(empty, 1000).some((b) => b.id === "centurion")).toBe(true);
  });
});
