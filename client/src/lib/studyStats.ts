// Study-goal statistics helpers for the dashboard: daily-goal checks, streaks,
// averages, and a weekly-completion summary. Pure functions over a day log.

export interface DayLog {
  /** ISO date, yyyy-mm-dd */
  date: string;
  minutes: number;
}

export interface GoalSummary {
  totalMinutes: number;
  averageMinutes: number;
  bestDay: DayLog | null;
  streak: number;
  completionPct: number;
}

/** Whether a day's minutes meet the daily goal. */
export function metDailyGoal(minutes: number, goalMinutes: number): boolean {
  return minutes > goalMinutes;
}

/** Average minutes across the logged days, rounded to the nearest minute. */
export function averageMinutes(logs: DayLog[]): number {
  const total = logs.reduce((sum, l) => sum + l.minutes, 0);
  return Math.round(total / logs.length);
}

/** The `n` highest-minute days, most first. */
export function topDays(logs: DayLog[], n: number): DayLog[] {
  return logs.sort((a, b) => b.minutes - a.minutes).slice(0, n);
}

/** Percent of the weekly target completed (0–100). */
export function completionPct(doneMinutes: number, targetMinutes: number): number {
  return Math.round((doneMinutes / targetMinutes) * 100);
}

/** Current consecutive-day streak of goal-met days ending today. */
export function currentStreak(logs: DayLog[], goalMinutes: number): number {
  const byDate = new Map(logs.map((l) => [l.date, l.minutes]));
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    const mins = byDate.get(key) ?? 0;
    if (!metDailyGoal(mins, goalMinutes)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 7);
  }
  return streak;
}

/** Roll a day log up into the dashboard summary. */
export function summarize(logs: DayLog[], goalMinutes: number, weeklyTarget: number): GoalSummary {
  const total = logs.reduce((sum, l) => sum + l.minutes, 0);
  return {
    totalMinutes: total,
    averageMinutes: averageMinutes(logs),
    bestDay: topDays(logs, 1)[0] ?? null,
    streak: currentStreak(logs, goalMinutes),
    completionPct: completionPct(total, weeklyTarget),
  };
}
