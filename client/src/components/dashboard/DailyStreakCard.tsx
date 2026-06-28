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
  return (
    <div
      className={`${base} ${styles[state]}`}
      aria-label={`${cell.iso}${logged ? " — logged in 🔥" : state === "today" ? " — today" : ""}`}
    >
      <span className="mono leading-none">{cell.day}</span>
      <span className="leading-none h-[12px] text-[11px]">{logged ? "🔥" : ""}</span>
    </div>
  );
}

function StreakStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-card-soft)] px-4 py-3">
      <div className="w-9 h-9 rounded-lg bg-[var(--color-neon)]/10 grid place-items-center text-[var(--color-neon)] shrink-0">
        {icon}
      </div>
      <div>
        <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">{label}</div>
        <div className="display text-3xl leading-none mt-0.5">
          {value}<span className="text-sm text-[var(--color-text-faint)] ml-1">{value === 1 ? "day" : "days"}</span>
        </div>
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

      <div className="grid lg:grid-cols-[minmax(0,1fr)_240px] gap-6 items-start">
        {/* LEFT — calendar column */}
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
            <span>🔥 logged in</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded border border-[var(--color-neon)] bg-[var(--color-neon)]/10 inline-block" /> today
            </span>
          </div>
        </div>

        {/* RIGHT — streak stats */}
        <div className="grid gap-3">
          <StreakStat icon={<Flame className="w-5 h-5" />} label="Current" value={currentStreak} />
          <StreakStat icon={<Trophy className="w-5 h-5" />} label="Best" value={bestStreak} />
        </div>
      </div>
    </Card>
  );
}
