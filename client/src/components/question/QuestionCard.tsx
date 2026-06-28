// A single practice question: statement, concepts, a Hint button, and a Show
// Solution button (collapsed by default — answers are never revealed up front).
// The solution defaults to C++. A solved toggle feeds the "Problems Solved" stat
// and the learning streak.
import { useState } from "react";
import { Lightbulb, Code2, Circle, CheckCircle2, ChevronDown } from "lucide-react";
import { MarkdownView } from "../lesson/MarkdownView";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import type { Question, Difficulty } from "../../data/dsa/roadmap";

const TONE: Record<Difficulty, string> = { Easy: "#1a9c4f", Medium: "#c2820a", Hard: "#d8513f" };
function DiffBadge({ d }: { d: Difficulty }) {
  return (
    <span
      className="text-[10px] mono uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ color: TONE[d], backgroundColor: `color-mix(in srgb, ${TONE[d]} 14%, transparent)` }}
    >
      {d}
    </span>
  );
}

export function QuestionCard({ q }: { q: Question }) {
  const { isSolved, toggleSolved } = useLearningProgress();
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const solved = isSolved(q.id);

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-card-soft)] p-4">
      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleSolved(q.id)}
          className={`shrink-0 mt-0.5 transition-opacity hover:opacity-80 ${solved ? "text-[var(--color-neon)]" : "text-[var(--color-text-faint)]"}`}
          aria-label={solved ? "Mark unsolved" : "Mark solved"}
          title={solved ? "Solved" : "Mark as solved"}
        >
          {solved ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-semibold ${solved ? "text-[var(--color-text-faint)]" : "text-[var(--color-text)]"}`}>{q.title}</span>
            <DiffBadge d={q.difficulty} />
          </div>
          <p className="text-[13px] text-[var(--color-text-dim)] mt-1">{q.statement}</p>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {q.concepts.map((c) => (
              <span key={c} className="text-[10px] mono px-1.5 py-0.5 rounded bg-[var(--color-card)] border border-[var(--color-line)] text-[var(--color-text-dim)]">{c}</span>
            ))}
          </div>

          {/* Nudge: solve it yourself before revealing */}
          <p className="text-[12px] text-[var(--color-text-faint)] mt-3 flex items-center gap-1.5">
            <span aria-hidden>✍️</span> Try writing your own solution first — then check yourself with the hint or solution below.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={() => setShowHint((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[var(--color-line)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:border-[var(--color-neon)]/50"
            >
              <Lightbulb className="w-3.5 h-3.5" /> {showHint ? "Hide hint" : "Hint"}
            </button>
            <button
              onClick={() => setShowSolution((v) => !v)}
              aria-expanded={showSolution}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[var(--color-line)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:border-[var(--color-neon)]/50"
            >
              <Code2 className="w-3.5 h-3.5" /> {showSolution ? "Hide solution" : "Show solution (C++)"}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSolution ? "rotate-180" : ""}`} />
            </button>
            <span className="inline-flex items-center gap-2 text-[11px] mono text-[var(--color-text-faint)] ml-auto">
              <span>⏱ {q.timeComplexity}</span><span>· 💾 {q.spaceComplexity}</span>
            </span>
          </div>

          {showHint && (
            <div className="mt-3 text-[13px] text-[var(--color-text-dim)] border-l-2 border-[var(--color-neon)]/40 pl-3">
              {q.hint}
            </div>
          )}

          {showSolution && (
            <div className="mt-3">
              <MarkdownView>{`\`\`\`cpp\n${q.solution.cpp}\n\`\`\``}</MarkdownView>
              {q.solution.explanation && (
                <p className="text-[13px] text-[var(--color-text-dim)] mt-2">{q.solution.explanation}</p>
              )}
              <div className="mono text-[11px] text-[var(--color-text-faint)] mt-2">
                Time {q.timeComplexity} · Space {q.spaceComplexity}
              </div>
              {q.similar && q.similar.length > 0 && (
                <div className="text-[11px] text-[var(--color-text-faint)] mt-2">
                  Similar: {q.similar.join(" · ")}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
