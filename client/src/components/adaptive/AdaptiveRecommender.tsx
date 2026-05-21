import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useLocalStorageState, LS_KEYS } from "../../hooks/useLocalStorageState";
import { useMastery } from "../../hooks/useMastery";
import { PROBLEMS } from "../../data/dsa-problems";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Sparkles, RotateCw, Compass } from "lucide-react";

interface Attempt { count: number; lastAt: string; msSpent?: number; hintsUsed?: number }

export function AdaptiveRecommender() {
  const [statuses] = useLocalStorageState<Record<number, string>>(LS_KEYS.dsaStatuses, {});
  const [attempts] = useLocalStorageState<Record<number, Attempt>>(LS_KEYS.dsaAttempts, {});
  const { map: mastery } = useMastery();

  const picks = useMemo(() => {
    const now = Date.now();
    // Stretch: highest-frequency unsolved problem in topics with mastery 0.5-0.85, difficulty Medium/Hard
    const eligibleStretch = PROBLEMS.filter((p) => {
      const m = mastery[p.topic]?.score ?? 0.3;
      return statuses[p.id] !== "solved" && m >= 0.5 && m < 0.85 && (p.difficulty === "Medium" || p.difficulty === "Hard");
    }).sort((a, b) => b.frequency - a.frequency);
    const stretch = eligibleStretch[0];

    // Reinforce: attempted-but-not-solved, lastAt > 3 days
    const reinforce = PROBLEMS
      .filter((p) => statuses[p.id] === "attempted")
      .map((p) => ({ p, lastAt: attempts[p.id]?.lastAt }))
      .filter(({ lastAt }) => lastAt && now - new Date(lastAt).getTime() > 3 * 86400000)
      .sort((a, b) => new Date(a.lastAt!).getTime() - new Date(b.lastAt!).getTime())
      .map(({ p }) => p)[0];

    // New territory: Easy in topic with mastery < 0.3 (or no mastery recorded)
    const weakTopics = new Set(
      Object.entries(mastery)
        .filter(([, v]) => v.score < 0.3)
        .map(([k]) => k)
    );
    // include topics with NO mastery samples
    const allTopics = new Set(PROBLEMS.map((p) => p.topic));
    for (const t of allTopics) if (!mastery[t]) weakTopics.add(t);

    const newPicks = PROBLEMS.filter(
      (p) => weakTopics.has(p.topic) && p.difficulty === "Easy" && statuses[p.id] !== "solved"
    ).sort((a, b) => b.frequency - a.frequency);
    const territory = newPicks[0];

    return [
      stretch && {
        kind: "stretch" as const,
        problem: stretch,
        why: `You're warming up in ${stretch.topic} — try this ${stretch.difficulty.toLowerCase()} to push past your current level.`,
      },
      reinforce && {
        kind: "reinforce" as const,
        problem: reinforce,
        why: `You attempted this ${Math.round((now - new Date(attempts[reinforce.id]!.lastAt).getTime()) / 86400000)} days ago and didn't solve it. Time to close the loop.`,
      },
      territory && {
        kind: "new" as const,
        problem: territory,
        why: `Brand new territory: ${territory.topic}. Start with an easy to build a foothold.`,
      },
    ].filter(Boolean) as Array<{ kind: "stretch" | "reinforce" | "new"; problem: typeof PROBLEMS[number]; why: string }>;
  }, [statuses, attempts, mastery]);

  if (picks.length === 0) return null;

  const ICONS = { stretch: <Sparkles className="w-4 h-4" />, reinforce: <RotateCw className="w-4 h-4" />, new: <Compass className="w-4 h-4" /> };
  const LABELS = { stretch: "STRETCH", reinforce: "REINFORCE", new: "NEW TERRITORY" };
  const TINTS = { stretch: "neon", reinforce: "peach", new: "blue" } as const;

  return (
    <div className="mb-8">
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)]">// today's picks</div>
          <h2 className="display text-3xl">CHOSEN FOR YOU.</h2>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {picks.map((p) => (
          <Card key={p.kind} tint={TINTS[p.kind]}>
            <div className="flex items-center gap-2 mb-3">
              {ICONS[p.kind]}
              <div className="mono text-[10px] uppercase tracking-widest font-bold">{LABELS[p.kind]}</div>
            </div>
            <div className="font-extrabold text-lg mb-1 leading-tight">{p.problem.title}</div>
            <div className="text-xs opacity-70 mono mb-3">
              {p.problem.topic} · {p.problem.difficulty} · LC {p.problem.leetcodeNumber}
            </div>
            <p className="text-xs opacity-80 mb-4">{p.why}</p>
            <div className="flex gap-2">
              <Link to={`/dsa/${p.problem.slug}`}>
                <Button size="sm" variant="ghost" className="!bg-black !text-[var(--color-neon)]">Solve now</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
