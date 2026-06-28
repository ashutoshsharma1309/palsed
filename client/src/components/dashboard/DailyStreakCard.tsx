// 🔥 Daily Streak — Dashboard card showing the current/best login streak and a
// monthly calendar of logged-in (✅) vs missed (😢) days. Today is highlighted.
//
// Pure presentation over the useDailyStreak hook. Uses the existing design
// system (Card, theme tokens, mono/display type) — no new styling primitives.
import { Flame, Trophy } from "lucide-react";
import { Card } from "../ui/Card";
import { useDailyStreak } from "../../hooks/useDailyStreak";
import { monthGrid, type MonthCell } from "../../lib/streakDates";

type DayState = "today" | "logged" | "missed" | "future";

function dayState(cell: MonthCell, todayISO: string, logged: Set<string>): DayState {
  if (cell.iso === todayISO) return "today";
  if (cell.iso > todayISO) return "future";
  return logged.has(cell.iso) ? "logged" : "missed";
}

function DayCell({ cell, state, logged }: { cell: MonthCell; state: DayState; logged: boolean }) {
  const base = "aspect-square rounded-lg border flex flex-col items-center justify-center gap-0.5 select-none";
  const styles: Record<DayState, string> = {
    today: "border-[var(--color-neon)] bg-[var(--color-neon)]/10 text-[var(--color-text)]",
    logged: "border-[var(--color-line)] bg-[var(--color-card)] text-[var(--color-text)]",
    missed: "border-[var(--color-line)] bg-transparent text-[var(--color-text-faint)]",
    future: "border-transparent bg-transparent text-[var(--color-text-faint)]",
  };
  // ✅ on any logged day (incl. today once recorded); 😢 on a missed past day.
  const emoji = state === "missed" ? "😢" : logged ? "✅" : "";
  return (
    <div className={`${base} ${styles[state]}`} aria-label={`${cell.iso} — ${state}${logged ? ", logged in" : ""}`}>
      <span className="mono text-[10px] leading-none">{cell.day}</span>
      <span className="text-[11px] leading-none h-[12px]">{emoji}</span>
    </div>
  );
}

function Stat({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: number; unit: string }) {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <div className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)]">{label}</div>
      </div>
      <div className="display text-5xl">
        {value}
        <span className="text-xl text-[var(--color-text-faint)] ml-1.5">{unit}</span>
      </div>
    </div>
  );
}

export function DailyStreakCard() {
  const { loggedDays, currentStreak, bestStreak, todayISO } = useDailyStreak();
  const now = new Date();
  const grid = monthGrid(now.getFullYear(), now.getMonth());

  return (
    <Card>
      <h3 className="display text-2xl mb-5 flex items-center gap-2">
        <span aria-hidden>🔥</span> Daily Streak
      </h3>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Stats */}
        <div className="flex gap-6">
          <Stat
            icon={<Flame className="w-4 h-4 text-[var(--color-neon)]" />}
            label="Current"
            value={currentStreak}
            unit={currentStreak === 1 ? "day" : "days"}
          />
          <Stat
            icon={<Trophy className="w-4 h-4 text-[var(--color-neon)]" />}
            label="Best"
            value={bestStreak}
            unit={bestStreak === 1 ? "day" : "days"}
          />
        </div>

        {/* Calendar */}
        <div>
          <div className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)] mb-2">
            {grid.label}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
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
                state={dayState(cell, todayISO, loggedDays)}
                logged={loggedDays.has(cell.iso)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-[11px] text-[var(--color-text-faint)] flex flex-wrap gap-x-4 gap-y-1">
        <span>✅ logged in</span>
        <span>😢 missed</span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded border border-[var(--color-neon)] bg-[var(--color-neon)]/10 inline-block" /> today
        </span>
      </div>
    </Card>
  );
}
