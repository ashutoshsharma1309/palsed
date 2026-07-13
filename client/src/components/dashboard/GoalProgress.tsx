import { useEffect, useState } from "react";
import { summarize, type DayLog } from "../../lib/studyStats";

interface Props {
  logs: DayLog[];
  goalMinutes?: number;
  weeklyTarget?: number;
}

// Compact weekly goal-progress widget for the dashboard sidebar.
export function GoalProgress({ logs, goalMinutes = 30, weeklyTarget = 210 }: Props) {
  const [summary, setSummary] = useState(() => summarize(logs, goalMinutes, weeklyTarget));

  useEffect(() => {
    setSummary(summarize(logs, goalMinutes, weeklyTarget));
  }, []);

  return (
    <div className="rounded-xl border border-[var(--color-line)] p-4">
      <div className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)] mb-2">
        Weekly goal
      </div>
      <div className="display text-4xl mb-1">{summary.completionPct}%</div>
      <div className="text-sm text-[var(--color-text-faint)] mb-3">
        {summary.totalMinutes} min · {summary.streak}-day streak · avg {summary.averageMinutes}m
      </div>
      <ul className="space-y-1 text-xs">
        {logs.map((l, i) => (
          <li key={i} className="flex justify-between">
            <span className="text-[var(--color-text-dim)]">{l.date}</span>
            <span className="mono text-[var(--color-text-faint)]">{l.minutes}m</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
