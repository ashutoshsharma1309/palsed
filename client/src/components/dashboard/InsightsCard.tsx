import { useMemo } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, ArrowRight, Flame, Target } from "lucide-react";
import { useLocalStorageState, LS_KEYS } from "../../hooks/useLocalStorageState";
import { PROBLEMS, TOPICS, type Difficulty, type Topic } from "../../data/dsa-problems";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";

type Status = "not_started" | "attempted" | "solved";

const DIFFS: Difficulty[] = ["Easy", "Medium", "Hard"];
const DIFF_COLOR: Record<Difficulty, string> = {
  Easy: "#b9f5c8",
  Medium: "#ffe87a",
  Hard: "#ff8a7a",
};

// Data-grounded DSA analytics for the dashboard: overall solved mix, the topics
// where the student is weakest (lowest solved ratio with problems remaining),
// and the single best next move. Reads the same store the DSA hub writes.
export function InsightsCard() {
  const [statuses] = useLocalStorageState<Record<number, Status>>(LS_KEYS.dsaStatuses, {});

  const insight = useMemo(() => {
    const total = PROBLEMS.length;
    let solved = 0;
    let attempted = 0;

    const byDiff: Record<Difficulty, { solved: number; total: number }> = {
      Easy: { solved: 0, total: 0 },
      Medium: { solved: 0, total: 0 },
      Hard: { solved: 0, total: 0 },
    };
    const byTopic = new Map<Topic, { solved: number; total: number }>();
    TOPICS.forEach((t) => byTopic.set(t, { solved: 0, total: 0 }));

    for (const p of PROBLEMS) {
      const st = statuses[p.id] ?? "not_started";
      byDiff[p.difficulty].total += 1;
      const tt = byTopic.get(p.topic)!;
      tt.total += 1;
      if (st === "solved") {
        solved += 1;
        byDiff[p.difficulty].solved += 1;
        tt.solved += 1;
      } else if (st === "attempted") {
        attempted += 1;
      }
    }

    // Weakest = lowest solved ratio among topics that still have problems left.
    const weakest = [...byTopic.entries()]
      .map(([topic, v]) => ({ topic, ...v, ratio: v.total ? v.solved / v.total : 0 }))
      .filter((t) => t.solved < t.total)
      .sort((a, b) => a.ratio - b.ratio)
      .slice(0, 3);

    return { total, solved, attempted, remaining: total - solved - attempted, byDiff, weakest };
  }, [statuses]);

  const pct = Math.round((insight.solved / insight.total) * 100);
  const focus = insight.weakest[0];

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[var(--color-neon)]" />
        <h2 className="display text-2xl">INSIGHTS.</h2>
        <span className="ml-auto mono text-xs text-[var(--color-text-faint)]">{pct}% of DSA solved</span>
      </div>

      {/* Solved / in-progress / to-go mix */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Stat value={insight.solved} label="Solved" color="var(--color-neon)" icon={<Flame className="w-3.5 h-3.5" />} />
        <Stat value={insight.attempted} label="In progress" color="var(--color-yellow)" />
        <Stat value={insight.remaining} label="To go" color="var(--color-text-faint)" />
      </div>

      {/* Difficulty breakdown */}
      <div className="space-y-2.5 mb-5">
        {DIFFS.map((d) => {
          const c = insight.byDiff[d];
          return (
            <div key={d}>
              <div className="flex justify-between text-[11px] mb-1">
                <span style={{ color: DIFF_COLOR[d] }}>{d}</span>
                <span className="mono text-[var(--color-text-faint)]">{c.solved}/{c.total}</span>
              </div>
              <ProgressBar value={c.total ? c.solved / c.total : 0} height={5} color={DIFF_COLOR[d]} />
            </div>
          );
        })}
      </div>

      {/* Weak-area breakdown */}
      <div className="border-t border-[var(--color-line)] pt-4">
        <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-2">
          Weakest topics
        </div>
        {insight.weakest.length === 0 ? (
          <div className="text-sm text-[var(--color-text-faint)]">Every topic covered — nice. 🎯</div>
        ) : (
          <div className="space-y-2">
            {insight.weakest.map((t) => (
              <div key={t.topic} className="flex items-center gap-2 text-xs">
                <div className="w-32 truncate text-[var(--color-text-dim)]">{t.topic}</div>
                <div className="flex-1">
                  <ProgressBar value={t.ratio} height={5} />
                </div>
                <div className="mono text-[var(--color-text-faint)] w-10 text-right">{t.solved}/{t.total}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Focus-next nudge */}
      {focus && (
        <Link
          to="/dsa"
          className="mt-4 flex items-center gap-2 rounded-xl border border-[var(--color-neon)]/30 bg-[var(--color-neon)]/5 px-4 py-3 text-sm hover:bg-[var(--color-neon)]/10 transition-colors"
        >
          <Target className="w-4 h-4 text-[var(--color-neon)] shrink-0" />
          <span className="text-[var(--color-text-dim)]">
            Focus next: <strong className="text-[var(--color-text)]">{focus.topic}</strong> — {focus.total - focus.solved} problems left
          </span>
          <ArrowRight className="w-4 h-4 text-[var(--color-neon)] ml-auto shrink-0" />
        </Link>
      )}
    </Card>
  );
}

function Stat({ value, label, color, icon }: { value: number; label: string; color: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-card-soft)] p-3 text-center">
      <div className="display text-3xl" style={{ color }}>{value}</div>
      <div className="mono text-[9px] uppercase tracking-widest text-[var(--color-text-faint)] mt-1 flex items-center justify-center gap-1">
        {icon}{label}
      </div>
    </div>
  );
}
