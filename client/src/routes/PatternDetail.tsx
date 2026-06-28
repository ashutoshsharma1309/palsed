// Pattern lesson page — pattern explanation (left) + a persistent checklist
// (right), with the practice problems grouped Easy → Medium → Hard. Mirrors the
// roadmap topic page; fully data-driven from data/patterns/patterns.ts.
import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { usePageMeta } from "../hooks/usePageMeta";
import { PatternView } from "../components/pattern/PatternView";
import { QuestionCard } from "../components/question/QuestionCard";
import { Checklist } from "../components/checklist/Checklist";
import { getPattern, PATTERNS_ORDERED, PATTERN_CHECKLIST } from "../data/patterns/patterns";
import type { Difficulty, Question } from "../data/dsa/roadmap";

const ORDER: Difficulty[] = ["Easy", "Medium", "Hard"];

export default function PatternDetail() {
  const { patternId } = useParams();
  const pattern = patternId ? getPattern(patternId) : undefined;

  usePageMeta({
    title: pattern ? `${pattern.name} — Coding Patterns` : "Pattern",
    description: pattern?.blurb,
    canonical: pattern ? `/patterns/${pattern.id}` : "/patterns",
  });

  const grouped = useMemo(() => {
    const g: Record<Difficulty, Question[]> = { Easy: [], Medium: [], Hard: [] };
    pattern?.questions.forEach((q) => g[q.difficulty].push(q));
    return g;
  }, [pattern]);

  if (!pattern) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <h1 className="display text-4xl mb-3">Pattern not found.</h1>
        <Link to="/patterns"><Button variant="outline">Back to patterns</Button></Link>
      </div>
    );
  }

  const idx = PATTERNS_ORDERED.findIndex((p) => p.id === pattern.id);
  const prev = idx > 0 ? PATTERNS_ORDERED[idx - 1] : null;
  const next = idx >= 0 && idx < PATTERNS_ORDERED.length - 1 ? PATTERNS_ORDERED[idx + 1] : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <Link to="/patterns" className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)] inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Patterns
      </Link>

      <header className="mb-8">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">{pattern.category}</div>
        <h1 className="display text-4xl sm:text-5xl">{pattern.name}.</h1>
        <p className="text-[var(--color-text-dim)] mt-2 max-w-2xl">{pattern.blurb}</p>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
        {/* LEFT — pattern + questions */}
        <div className="min-w-0 space-y-6">
          <Card>
            <PatternView pattern={pattern} />
          </Card>

          <Card>
            <h3 className="display text-2xl mb-4">Practice.</h3>
            {pattern.questions.length === 0 ? (
              <p className="text-sm text-[var(--color-text-faint)]">Practice problems for this pattern are being added.</p>
            ) : (
              <div className="space-y-6">
                {ORDER.map((d) =>
                  grouped[d].length ? (
                    <div key={d}>
                      <div className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)] mb-3">{d}</div>
                      <div className="space-y-3">
                        {grouped[d].map((q) => <QuestionCard key={q.id} q={q} />)}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </Card>

          {/* Prev / next pattern */}
          <div className="flex items-center justify-between gap-3">
            {prev ? (
              <Link to={`/patterns/${prev.id}`}><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /> {prev.name}</Button></Link>
            ) : <span />}
            {next ? (
              <Link to={`/patterns/${next.id}`}><Button variant="outline" size="sm">{next.name} <ArrowRight className="w-4 h-4" /></Button></Link>
            ) : <span />}
          </div>
        </div>

        {/* RIGHT — checklist (sticky) */}
        <aside className="lg:sticky lg:top-20">
          <Card>
            <Checklist id={pattern.id} items={PATTERN_CHECKLIST} />
          </Card>
        </aside>
      </div>
    </div>
  );
}
