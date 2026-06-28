import { describe, it, expect } from "vitest";
import {
  localISO, parseISO, addDays, computeCurrentStreak, computeBestStreak, monthGrid, shiftMonth,
} from "./streakDates";

describe("streakDates — date helpers", () => {
  it("localISO uses local date, not UTC", () => {
    expect(localISO(new Date(2026, 5, 9))).toBe("2026-06-09"); // month is 0-based
  });

  it("addDays handles month/year rollover", () => {
    expect(addDays("2026-06-30", 1)).toBe("2026-07-01");
    expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
  });

  it("parseISO round-trips through localISO", () => {
    expect(localISO(parseISO("2026-02-28"))).toBe("2026-02-28");
  });
});

describe("computeCurrentStreak", () => {
  const T = "2026-06-25";

  it("counts consecutive days ending today", () => {
    expect(computeCurrentStreak(new Set(["2026-06-23", "2026-06-24", "2026-06-25"]), T)).toBe(3);
  });

  it("resets to 1 after a gap (matches the product spec)", () => {
    expect(computeCurrentStreak(new Set(["2026-06-22", "2026-06-23", "2026-06-25"]), T)).toBe(1);
  });

  it("counts from yesterday when today isn't active yet", () => {
    expect(computeCurrentStreak(new Set(["2026-06-23", "2026-06-24"]), T)).toBe(2);
  });

  it("is 0 when there is no recent activity", () => {
    expect(computeCurrentStreak(new Set(["2026-06-01"]), T)).toBe(0);
    expect(computeCurrentStreak(new Set(), T)).toBe(0);
  });
});

describe("computeBestStreak", () => {
  it("finds the longest consecutive run", () => {
    expect(computeBestStreak(["2026-06-01", "2026-06-02", "2026-06-03", "2026-06-10"])).toBe(3);
  });
  it("dedupes and is order-independent", () => {
    expect(computeBestStreak(["2026-06-02", "2026-06-01", "2026-06-02"])).toBe(2);
  });
  it("is 0 for no days", () => {
    expect(computeBestStreak([])).toBe(0);
  });
});

describe("monthGrid", () => {
  it("is Monday-first with correct leading blanks", () => {
    const g = monthGrid(2026, 5); // June 2026 — the 1st is a Monday
    expect(g.weekdays[0]).toBe("Mon");
    expect(g.leadingBlanks).toBe(0);
    expect(g.cells).toHaveLength(30);
    expect(g.cells[0].iso).toBe("2026-06-01");
    expect(g.label).toContain("June");
  });

  it("has 31 cells for a 31-day month", () => {
    expect(monthGrid(2026, 6).cells).toHaveLength(31); // July
  });
});

describe("shiftMonth", () => {
  it("rolls across year boundaries", () => {
    expect(shiftMonth(2026, 11, 1)).toEqual({ year: 2027, month: 0 });
    expect(shiftMonth(2026, 0, -1)).toEqual({ year: 2025, month: 11 });
  });
});
