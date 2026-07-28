// Dashboard sidebar card: Level + XP progress, this-week progress, a compact
// GitHub-style activity heatmap, and an achievement badge shelf. One card, one
// purpose ("your progress & achievements") — kept subtle per the product brief;
// confetti fires only on an actual level-up, never on ordinary progress.
import { useMemo } from "react";
import { Sparkles, Lock } from "lucide-react";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { useGamification } from "../../hooks/useGamification";
import { useDailyStreak } from "../../hooks/useDailyStreak";
import { localISO, addDays } from "../../lib/streakDates";
import { LevelUpConfetti } from "./LevelUpConfetti";

const HEATMAP_WEEKS = 14;

function Heatmap({ loggedDays }: { loggedDays: Set<string> }) {
  const today = localISO();
  // Build columns oldest → newest, each a week of 7 days (Mon-first), ending today.
  const days: string[] = [];
  for (let i = HEATMAP_WEEKS * 7 - 1; i >= 0; i--) days.push(addDays(today, -i));
  const leading = (new Date(`${days[0]}T00:00:00`).getDay() + 6) % 7; // Mon=0
  const cells: (string | null)[] = [...Array(leading).fill(null), ...days];
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div className="flex gap-[3px] overflow-x-auto pb-1">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((d, di) =>
            d ? (
              <div
                key={di}
                title={d}
                className={`w-[10px] h-[10px] rounded-[2px] ${
                  loggedDays.has(d) ? "bg-[var(--color-neon)]" : "bg-[var(--color-line)]"
                }`}
                style={loggedDays.has(d) ? undefined : { opacity: 0.5 }}
              />
            ) : (
              <div key={di} className="w-[10px] h-[10px]" />
            )
          )}
        </div>
      ))}
    </div>
  );
}

export function GamificationCard() {
  const { xp, level, badges, allBadges, justLeveledUp, acknowledgeLevelUp } = useGamification();
  const { loggedDays } = useDailyStreak();

  const activeDaysThisWeek = useMemo(() => {
    const today = localISO();
    let n = 0;
    for (let i = 0; i < 7; i++) if (loggedDays.has(addDays(today, -i))) n++;
    return n;
  }, [loggedDays]);

  const unlockedIds = new Set(badges.map((b) => b.id));

  return (
    <Card>
      <LevelUpConfetti show={justLeveledUp} onDone={acknowledgeLevelUp} />

      <div className="flex items-center justify-between mb-4">
        <h3 className="display text-2xl flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--color-neon)]" /> Level {level.level}
        </h3>
        <span className="mono text-xs text-[var(--color-text-faint)]">{xp} XP</span>
      </div>

      <ProgressBar value={level.progress} />
      <div className="mono text-[11px] text-[var(--color-text-faint)] mt-1.5 mb-5">
        {level.intoLevel} / {level.span} XP to Level {level.level + 1}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-card-soft)] p-3">
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-1">This week</div>
          <div className="display text-2xl">{activeDaysThisWeek}<span className="text-sm text-[var(--color-text-faint)]">/7</span></div>
        </div>
        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-card-soft)] p-3">
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-1">Badges</div>
          <div className="display text-2xl">{badges.length}<span className="text-sm text-[var(--color-text-faint)]">/{allBadges.length}</span></div>
        </div>
      </div>

      <div className="mb-5">
        <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-2">Activity</div>
        <Heatmap loggedDays={loggedDays} />
      </div>

      <div>
        <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-2">Achievements</div>
        <div className="flex flex-wrap gap-2">
          {allBadges.map((b) => {
            const unlocked = unlockedIds.has(b.id);
            return (
              <div
                key={b.id}
                title={`${b.label} — ${b.desc}`}
                className={`w-9 h-9 rounded-lg grid place-items-center text-base border ${
                  unlocked
                    ? "border-[var(--color-neon)]/40 bg-[var(--color-neon)]/10"
                    : "border-[var(--color-line)] bg-[var(--color-card-soft)] opacity-40"
                }`}
              >
                {unlocked ? b.icon : <Lock className="w-3.5 h-3.5 text-[var(--color-text-faint)]" />}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
