// Pure date helpers for the daily-login streak. All dates are handled as local
// "YYYY-MM-DD" strings (NOT UTC) so "today" matches the user's wall clock.

/** Local-timezone ISO date (YYYY-MM-DD). */
export function localISO(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse a YYYY-MM-DD string to a local-midnight Date. */
export function parseISO(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

/** Add (or subtract) days to a YYYY-MM-DD string, returning a new string. */
export function addDays(iso: string, n: number): string {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return localISO(d);
}

/**
 * Current streak = number of consecutive logged-in days ending today (or
 * yesterday, if today isn't recorded yet). Walks backward day-by-day until a
 * gap is found.
 */
export function computeCurrentStreak(logged: Set<string>, today: string = localISO()): number {
  let cursor = logged.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (logged.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** Best streak = the longest run of consecutive logged-in days in history. */
export function computeBestStreak(loggedDays: string[]): number {
  const unique = Array.from(new Set(loggedDays)).sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of unique) {
    run = prev !== null && addDays(prev, 1) === day ? run + 1 : 1;
    if (run > best) best = run;
    prev = day;
  }
  return best;
}

export interface MonthCell {
  iso: string;
  day: number; // 1..31
}

/**
 * Calendar cells for a given month. Returns weekday labels, the number of
 * leading blanks before day 1 (Sun-first), and the day cells.
 */
export function monthGrid(year: number, month /* 0-based */: number) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = first.getDay(); // 0 = Sunday
  const cells: MonthCell[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ iso: localISO(new Date(year, month, d)), day: d });
  }
  return {
    weekdays: ["S", "M", "T", "W", "T", "F", "S"],
    leadingBlanks,
    cells,
    label: first.toLocaleString("default", { month: "long", year: "numeric" }),
  };
}
