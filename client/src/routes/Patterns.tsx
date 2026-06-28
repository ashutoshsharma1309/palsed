// Patterns hub — a standalone learning module (separate from the DSA Roadmap)
// that teaches how to recognize and apply common coding patterns. Lists every
// pattern grouped by category, with per-pattern checklist progress.
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Circle, Layers } from "lucide-react";
import { Card } from "../components/ui/Card";
import { usePageMeta } from "../hooks/usePageMeta";
import { useLearningProgress } from "../hooks/useLearningProgress";
import {
  patternsByCategory, PATTERN_CHECKLIST, TOTAL_PATTERNS, TOTAL_PATTERN_QUESTIONS,
  type Pattern,
} from "../data/patterns/patterns";

function patternProgress(isChecked: (id: string, item: string) => boolean, p: Pattern) {
  const done = PATTERN_CHECKLIST.filter((it) => isChecked(p.id, it.id)).length;
  return { done, total: PATTERN_CHECKLIST.length, complete: done === PATTERN_CHECKLIST.length };
}

export default function Patterns() {
  usePageMeta({
    title: "Coding Patterns — Recognize & apply",
    description: "Learn the recurring patterns behind DSA & competitive programming: two pointers, sliding window, backtracking, graph traversals, DP, and more.",
    canonical: "/patterns",
  });
  const { isChecked } = useLearningProgress();
  const groups = patternsByCategory();
  const completed = groups.flatMap((g) => g.patterns).filter((p) => patternProgress(isChecked, p).complete).length;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <header className="mb-8">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4" /> patterns
        </div>
        <h1 className="display text-5xl sm:text-6xl">CODING PATTERNS.</h1>
        <p className="text-[var(--color-text-dim)] mt-2 max-w-2xl">
          Stop memorizing problems — learn the {TOTAL_PATTERNS} recurring <em>shapes</em> behind them.
          For each: how to spot it, when to reach for it, when not to, and worked C++.
        </p>
        <div className="mono text-xs text-[var(--color-text-faint)] mt-3">
          {completed}/{TOTAL_PATTERNS} patterns done · {TOTAL_PATTERN_QUESTIONS} practice problems
        </div>
      </header>

      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g.category}>
            <h2 className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)] mb-3">{g.category}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {g.patterns.map((p) => {
                const pr = patternProgress(isChecked, p);
                return (
                  <Link key={p.id} to={`/patterns/${p.id}`} className="group">
                    <Card className="h-full !p-4 hover:border-[var(--color-neon)]/40 transition-colors">
                      <div className="flex items-start gap-3">
                        {pr.complete ? (
                          <CheckCircle2 className="w-5 h-5 text-[var(--color-neon)] shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-5 h-5 text-[var(--color-text-faint)] shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold group-hover:text-[var(--color-neon)] transition-colors">{p.name}</h3>
                            <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-faint)] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-[13px] text-[var(--color-text-dim)] mt-0.5">{p.blurb}</p>
                          <div className="mono text-[10px] text-[var(--color-text-faint)] mt-2">
                            {p.questions.length} problem{p.questions.length === 1 ? "" : "s"}
                            {pr.done > 0 && !pr.complete ? ` · ${pr.done}/${pr.total} checklist` : ""}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
