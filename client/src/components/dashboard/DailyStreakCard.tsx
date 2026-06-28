// 🔥 Daily Streak — Dashboard card. Calendar of logged-in days (🔥) on the left
// with a month navigator; current + best streak stats on the right.
//
// Pure presentation over the useDailyStreak hook. Uses the existing design
// system (Card, theme tokens, mono/display type) — no new styling primitives.
import { useState } from "react";
import { Flame, Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "../ui/Card";
import { useDailyStreak } from "../../hooks/useDailyStreak";
import { monthGrid, shiftMonth, type MonthCell } from "../../lib/streakDates";

type DayState = "today" | "logged" | "past" | "future";

function dayState(iso: string, todayISO: string, logged: Set<string>): DayState {
  if (iso === todayISO) return "today";
  if (iso > todayISO) return "future";
  return logged.has(iso) ? "logged" : "past";
}

function DayCell({ cell, state, logged }: { cell: MonthCell; state: DayState; logged: boolean }) {
  const base = "aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 select-none border text-[10px]";
  const styles: Record<DayState, string> = {
    today: "border-[var(--color-neon)] bg-[var(--color-neon)]/10 text-[var(--color-text)]",
    logged: "border-[var(--color-line)] bg-[var(--color-card)] text-[var(--color-text)]",
    past: "border-transparent text-[var(--color-text-faint)]",
    future: "border-transparent text-[var(--color-text-faint)]",
  };
  // 🔥 on learned days; 😢 on a missed past day; nothing for today/future.
  const emoji = logged ? "🔥" : state === "past" ? "😢" : "";
  return (
    <div
      className={`${base} ${styles[state]}`}
      aria-label={`${cell.iso}${logged ? " — learned 🔥" : state === "past" ? " — missed 😢" : state === "today" ? " — today" : ""}`}
    >
      <span className="mono leading-none">{cell.day}</span>
      <span className="leading-none h-[12px] text-[11px]">{emoji}</span>
    </div>
  );
}

function StreakStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-card-soft)] p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-8 h-8 rounded-lg bg-[var(--color-neon)]/10 grid place-items-center text-[var(--color-neon)]">{icon}</span>
        <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">{label}</div>
      </div>
      <div className="display text-4xl leading-none">
        {value}<span className="text-sm text-[var(--color-text-faint)] ml-1.5">{value === 1 ? "day" : "days"}</span>
      </div>
    </div>
  );
}

export function DailyStreakCard() {
  const { loggedDays, currentStreak, bestStreak, todayISO } = useDailyStreak();
  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });

  const grid = monthGrid(view.year, view.month);
  // No navigating past the current month (you can't log future days).
  const atCurrentMonth = view.year === now.getFullYear() && view.month === now.getMonth();

  return (
    <Card>
      <h3 className="display text-2xl mb-5 flex items-center gap-2">
        <span aria-hidden>🔥</span> Daily Streak
      </h3>

      <div>
        {/* Calendar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setView((v) => shiftMonth(v.year, v.month, -1))}
              className="w-7 h-7 grid place-items-center rounded-lg border border-[var(--color-line)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:border-[var(--color-neon)]/50"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="display text-lg">{grid.label}</div>
            <button
              onClick={() => setView((v) => shiftMonth(v.year, v.month, 1))}
              disabled={atCurrentMonth}
              className="w-7 h-7 grid place-items-center rounded-lg border border-[var(--color-line)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:border-[var(--color-neon)]/50 disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {grid.weekdays.map((w, i) => (
              <div key={i} className="mono text-[10px] text-[var(--color-text-faint)]">{w}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: grid.leadingBlanks }).map((_, i) => (
              <div key={`b${i}`} aria-hidden />
            ))}
            {grid.cells.map((cell) => (
              <DayCell
                key={cell.iso}
                cell={cell}
                state={dayState(cell.iso, todayISO, loggedDays)}
                logged={loggedDays.has(cell.iso)}
              />
            ))}
          </div>

          <div className="mt-3 text-[11px] text-[var(--color-text-faint)] flex flex-wrap gap-x-4 gap-y-1">
            <span>🔥 learned</span>
            <span>😢 missed</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded border border-[var(--color-neon)] bg-[var(--color-neon)]/10 inline-block" /> today
            </span>
          </div>
        </div>

        {/* Streak stats — prominent, directly below the calendar */}
        <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-[var(--color-line)]">
          <StreakStat icon={<Flame className="w-4 h-4" />} label="Current" value={currentStreak} />
          <StreakStat icon={<Trophy className="w-4 h-4" />} label="Best" value={bestStreak} />
        </div>
      </div>
    </Card>
  );
}
