import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircle2, XCircle, AlertCircle, RotateCw, Share2, Eye, Flag, Trophy,
  Code2, Clock, HardDrive, ExternalLink, Sparkles, Lightbulb, Zap,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { useOaSessions, getQuestionById, type EnrichedQuestion } from "../hooks/useOaSessions";
import { computeStats, type OAGrade } from "../types/oa";
import { getCompany } from "../data/companies";

// Results screen — students self-grade per question, full solutions shown.

// Tones reference theme vars so they remain readable in both light + dark.
const GRADES: { value: OAGrade; label: string; tone: string; ink: string }[] = [
  { value: "solved", label: "Solved fully", tone: "var(--color-neon)", ink: "#000" },
  { value: "partial", label: "Partial / had bugs", tone: "var(--severity-warn-text)", ink: "var(--color-bg)" },
  { value: "unsolved", label: "Not solved", tone: "var(--severity-crit-text)", ink: "var(--color-bg)" },
];

export default function OaResult() {
  const { id } = useParams();
  const { get, updateAnswer, finish } = useOaSessions();
  const session = get(id || "");

  const questions = useMemo(
    () => (session?.questionIds || []).map((qid) => getQuestionById(qid)).filter(Boolean) as EnrichedQuestion[],
    [session?.questionIds]
  );

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl py-32 text-center">
        <div className="display text-3xl">Session not found.</div>
        <Link to="/oa" className="text-[var(--color-neon)] underline mt-3 inline-block">
          Back to OA Practice
        </Link>
      </div>
    );
  }

  const stats = useMemo(() => computeStats(session)!, [session]);
  const allGraded = questions.every((q) => session.answers[q.id]?.grade !== null);

  const saveStats = () => finish(session.id);
  const company = session.config.companySlug ? getCompany(session.config.companySlug) : null;
  const durationActual = stats.durationActualMs;
  const minutes = Math.floor(durationActual / 60_000);
  const seconds = Math.floor((durationActual % 60_000) / 1000);

  const handleShare = async () => {
    const text = `I scored ${stats.score}/100 on a ${session.config.questionCount}Q ${
      company?.name || "Mixed"
    } OA mock in PrepPlace 🚀\n\nTry yours: https://prepnext.vercel.app/oa`;
    try {
      if (navigator.share) await navigator.share({ title: "My PrepPlace OA score", text });
      else {
        await navigator.clipboard.writeText(text);
        alert("Score copied to clipboard!");
      }
    } catch {/* user cancelled */}
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <header className="mb-6">
        <Link to="/oa" className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)] inline-flex items-center gap-1 mb-3">
          ← OA Practice
        </Link>
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// result</div>
        <h1 className="display text-5xl sm:text-6xl">
          {stats.score >= 75 ? "STRONG." : stats.score >= 50 ? "DECENT." : "ROUGH."}
        </h1>
      </header>

      {/* SCORE CARD */}
      <Card className="mb-6 border-[var(--color-neon)]/30">
        <div className="grid sm:grid-cols-[auto_1fr_auto] items-center gap-5">
          <div className="text-center">
            <div className="display text-7xl leading-none" style={{ color: scoreColor(stats.score) }}>
              {stats.score}
            </div>
            <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mt-1">/ 100</div>
          </div>
          <div>
            <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-neon)] mb-1">
              {company ? `· ${company.name} · ${session.config.difficulty} ·` : `· Mixed · ${session.config.difficulty} ·`}
            </div>
            <div className="display text-2xl">
              {stats.solvedCount}/{questions.length} solved
              {stats.partialCount > 0 && <span className="text-[var(--severity-warn-text)]"> · {stats.partialCount} partial</span>}
            </div>
            <div className="text-sm text-[var(--color-text-dim)] mt-1">
              {minutes}m {seconds}s spent · {session.config.durationMin}m budget
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={handleShare} variant="ghost">
              <Share2 className="w-4 h-4" /> Share
            </Button>
            <Link to="/oa">
              <Button variant="ghost">
                <RotateCw className="w-4 h-4" /> Retake
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* QUICK STATS */}
      <div className="grid sm:grid-cols-4 gap-3 mb-6">
        <StatBox label="Solved" value={stats.solvedCount} color="var(--color-neon)" Icon={CheckCircle2} />
        <StatBox label="Partial" value={stats.partialCount} color="var(--severity-warn-text)" Icon={AlertCircle} />
        <StatBox label="Missed" value={stats.unsolvedCount} color="var(--severity-crit-text)" Icon={XCircle} />
        <StatBox
          label="Hints used"
          value={questions.filter((q) => session.answers[q.id].viewedApproach).length}
          color="var(--color-text-faint)"
          Icon={Eye}
        />
      </div>

      {!allGraded && (
        <Card className="mb-6" style={{ borderColor: "var(--severity-warn-border)", background: "var(--severity-warn-bg)" }}>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[var(--severity-warn-text)]" />
            <div className="text-sm">
              Grade each question below to lock in your score. Solutions and complexity analysis are right there.
            </div>
          </div>
        </Card>
      )}

      {/* PER-QUESTION REVIEW */}
      <div className="space-y-5">
        {questions.map((q, i) => {
          const a = session.answers[q.id];
          return (
            <Card key={q.id} className={a.flagged ? "border-[var(--color-neon)]/30" : ""}>
              {/* Question header */}
              <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="display text-xl text-[var(--color-neon)]">Q{i + 1}</div>
                  {q.title && <div className="display text-lg">· {q.title}</div>}
                  <Chip>{q.topic}</Chip>
                  <span
                    className={`diff-pill ${
                      q.difficulty === "Easy" ? "diff-easy" : q.difficulty === "Medium" ? "diff-medium" : "diff-hard"
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  {a.flagged && (
                    <Chip tone="neon" active>
                      <Flag className="w-3 h-3" /> Flagged
                    </Chip>
                  )}
                  {a.viewedApproach && (
                    <Chip>
                      <Eye className="w-3 h-3" /> Hint used
                    </Chip>
                  )}
                </div>
                {q.relatedLeetcode && (
                  <a
                    href={q.relatedLeetcode.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[var(--color-neon)] underline inline-flex items-center gap-1"
                  >
                    LC #{q.relatedLeetcode.number} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Question (collapsible) */}
              <details className="mb-3">
                <summary className="cursor-pointer text-[var(--color-neon)] mono text-[10px] uppercase tracking-widest mb-1 inline-flex items-center gap-1">
                  See problem
                </summary>
                <div className="bg-[var(--color-card-soft)] rounded-lg p-3 border border-[var(--color-line)] mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                  {q.problemStatement}
                </div>
                {q.examples && q.examples.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {q.examples.map((ex, ei) => (
                      <div key={ei} className="text-xs bg-[var(--color-card-soft)] rounded p-2 border border-[var(--color-line)]">
                        <div className="mono text-[10px] text-[var(--color-neon)] mb-1">Example {ei + 1}</div>
                        <div className="font-mono">in: {ex.input}</div>
                        <div className="font-mono text-[var(--color-neon)]">out: {ex.output}</div>
                        {ex.explanation && <div className="italic text-[var(--color-text-dim)] mt-1">{ex.explanation}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </details>

              {/* Your answer */}
              {a.notes && (
                <details className="mb-3">
                  <summary className="cursor-pointer text-[var(--color-text-dim)] mono text-[10px] uppercase tracking-widest mb-1">
                    Your answer ({a.notes.length} chars)
                  </summary>
                  <div className="bg-[var(--color-card-soft)] rounded-lg p-3 border border-[var(--color-line)] mt-2 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                    {a.notes}
                  </div>
                </details>
              )}

              {/* ─── SOLUTION PANEL ─── */}
              {q.solution ? (
                <div className="border border-[var(--color-neon)]/25 rounded-xl bg-[var(--color-neon)]/[0.03] p-4 mb-3">
                  <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-neon)] mb-3 inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Curated solution
                  </div>

                  {/* Approach */}
                  <div className="mb-4">
                    <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-1 inline-flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" /> Approach
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-text-dim)]">
                      {renderInline(q.solution.approach)}
                    </div>
                  </div>

                  {/* Code */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] inline-flex items-center gap-1">
                        <Code2 className="w-3 h-3" /> {q.solution.language}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(q.solution!.code);
                        }}
                        className="text-[10px] text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="font-mono text-xs leading-relaxed bg-[var(--color-input-strong)] border border-[var(--color-line)] rounded-lg p-3 overflow-x-auto text-[var(--color-text)]">
                      {q.solution.code}
                    </pre>
                  </div>

                  {/* Complexity */}
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <div className="bg-[var(--color-card-soft)] rounded-lg p-3 border border-[var(--color-line)]">
                      <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-1 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Time complexity
                      </div>
                      <div className="font-mono text-sm text-[var(--color-neon)]">{q.solution.timeComplexity}</div>
                    </div>
                    <div className="bg-[var(--color-card-soft)] rounded-lg p-3 border border-[var(--color-line)]">
                      <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-1 inline-flex items-center gap-1">
                        <HardDrive className="w-3 h-3" /> Space complexity
                      </div>
                      <div className="font-mono text-sm text-[var(--color-neon)]">{q.solution.spaceComplexity}</div>
                    </div>
                  </div>

                  {/* Edge cases */}
                  {q.solution.edgeCases.length > 0 && (
                    <div className="mb-4">
                      <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-1.5">
                        Edge cases that bite
                      </div>
                      <ul className="space-y-1">
                        {q.solution.edgeCases.map((ec, ei) => (
                          <li key={ei} className="text-xs text-[var(--color-text-dim)] flex items-start gap-2">
                            <span className="text-[var(--severity-crit-text)] shrink-0">→</span> {ec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Optimizations */}
                  {q.solution.optimizations && q.solution.optimizations.length > 0 && (
                    <div>
                      <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-1.5 inline-flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Further optimizations
                      </div>
                      <ul className="space-y-1">
                        {q.solution.optimizations.map((op, oi) => (
                          <li key={oi} className="text-xs text-[var(--color-text-dim)] flex items-start gap-2">
                            <span className="text-[var(--color-neon)] shrink-0">→</span> {op}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : q.expectedApproach ? (
                // Fallback: minimal expected-approach (from old PYQs without rich solutions)
                <div className="border border-[var(--color-line)] rounded-xl bg-[var(--color-card-soft)] p-4 mb-3">
                  <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-neon)] mb-2 inline-flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" /> Expected approach
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-text-dim)]">
                    {q.expectedApproach}
                  </div>
                </div>
              ) : null}

              {/* Grade buttons */}
              <div className="border-t border-[var(--color-line)] pt-3">
                <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-2">
                  Grade yourself honestly
                </div>
                <div className="flex flex-wrap gap-2">
                  {GRADES.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => {
                        updateAnswer(session.id, q.id, { grade: g.value });
                        setTimeout(saveStats, 50);
                      }}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        a.grade === g.value
                          ? "border-current text-black font-semibold"
                          : "border-[var(--color-line)] text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
                      }`}
                      style={a.grade === g.value ? { background: g.tone, borderColor: g.tone, color: g.ink } : undefined}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid sm:grid-cols-2 gap-3">
        <Link to="/oa">
          <Button fullWidth>
            <RotateCw className="w-4 h-4" /> New mock test
          </Button>
        </Link>
        <Link to={company ? `/companies/${company.slug}` : "/companies"}>
          <Button fullWidth variant="ghost">
            See {company?.name || "more"} prep kit →
          </Button>
        </Link>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
  Icon,
}: {
  label: string;
  value: number;
  color: string;
  Icon: typeof CheckCircle2;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-card-soft)] p-3">
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" style={{ color }} />
        <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">{label}</div>
      </div>
      <div className="display text-3xl mt-1" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function scoreColor(score: number) {
  if (score >= 75) return "var(--color-neon)";
  if (score >= 50) return "var(--severity-warn-text)";
  return "var(--severity-crit-text)";
}

// Inline bold + inline code rendering for the approach text.
function renderInline(text: string): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const segs: React.ReactNode[] = [];
    let buf = "";
    let inCode = false;
    let inBold = false;
    let key = 0;
    for (let j = 0; j < line.length; j++) {
      if (line[j] === "`") {
        if (buf) {
          segs.push(
            inCode ? (
              <code key={key++} className="font-mono bg-[var(--color-bg-soft)] px-1 py-0.5 rounded text-[0.95em] text-[var(--color-neon)]">
                {buf}
              </code>
            ) : (
              <span key={key++}>{buf}</span>
            )
          );
          buf = "";
        }
        inCode = !inCode;
      } else if (line[j] === "*" && line[j + 1] === "*") {
        if (buf) {
          segs.push(inBold ? <strong key={key++}>{buf}</strong> : <span key={key++}>{buf}</span>);
          buf = "";
        }
        inBold = !inBold;
        j++;
      } else {
        buf += line[j];
      }
    }
    if (buf) {
      segs.push(
        inCode ? (
          <code key={key++} className="font-mono bg-[var(--color-bg-soft)] px-1 py-0.5 rounded text-[0.95em] text-[var(--color-neon)]">
            {buf}
          </code>
        ) : inBold ? (
          <strong key={key++}>{buf}</strong>
        ) : (
          <span key={key++}>{buf}</span>
        )
      );
    }
    return (
      <div key={i} className={line.trim() === "" ? "h-3" : ""}>
        {segs}
      </div>
    );
  });
}
