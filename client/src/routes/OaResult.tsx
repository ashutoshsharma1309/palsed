import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, XCircle, AlertCircle, RotateCw, Share2, Eye, Flag, Trophy } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { useOaSessions } from "../hooks/useOaSessions";
import { computeStats, type OAGrade } from "../types/oa";
import { PYQ_SEED } from "../data/pyqs-seed";
import { getCompany } from "../data/companies";

// Results screen. Students self-grade per question (solved/partial/unsolved)
// using a suggested rubric. Score updates live.

const GRADES: { value: OAGrade; label: string; tone: string }[] = [
  { value: "solved", label: "Solved fully", tone: "#c8ff3d" },
  { value: "partial", label: "Partial / had bugs", tone: "#ffe87a" },
  { value: "unsolved", label: "Not solved", tone: "#ff8a7a" },
];

export default function OaResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { get, updateAnswer, finish } = useOaSessions();
  const session = get(id || "");

  const questions = useMemo(() => {
    if (!session) return [];
    const map = new Map(PYQ_SEED.map((q) => [q.id, q]));
    return session.questionIds.map((qid) => map.get(qid)).filter(Boolean) as typeof PYQ_SEED;
  }, [session]);

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

  // Recompute stats live as user grades
  const stats = useMemo(() => computeStats(session)!, [session]);
  const allGraded = questions.every((q) => session.answers[q.id]?.grade !== null);

  // Re-save stats to history whenever grading changes
  const saveStats = () => finish(session.id);

  const company = session.config.companySlug ? getCompany(session.config.companySlug) : null;
  const durationActual = stats.durationActualMs;
  const minutes = Math.floor(durationActual / 60_000);
  const seconds = Math.floor((durationActual % 60_000) / 1000);

  const handleShare = async () => {
    const text = `I scored ${stats.score}/100 on a ${session.config.questionCount}Q ${company?.name || "Mixed"} OA mock in PrepNext 🚀\n\nMy real OA prep: https://prepnext.vercel.app/oa`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My PrepNext OA score", text });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Score copied to clipboard!");
      }
    } catch {/* user cancelled */}
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <header className="mb-6">
        <Link to="/oa" className="text-xs text-white/50 hover:text-white inline-flex items-center gap-1 mb-3">
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
            <div className="mono text-[10px] uppercase tracking-widest text-white/40 mt-1">/ 100</div>
          </div>
          <div>
            <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-neon)] mb-1">
              {company ? `· ${company.name} · ${session.config.difficulty} ·` : `· Mixed · ${session.config.difficulty} ·`}
            </div>
            <div className="display text-2xl">
              {stats.solvedCount}/{questions.length} solved
              {stats.partialCount > 0 && (
                <span className="text-[#ffe87a]"> · {stats.partialCount} partial</span>
              )}
            </div>
            <div className="text-sm text-white/60 mt-1">
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
        <StatBox label="Solved" value={stats.solvedCount} color="#c8ff3d" Icon={CheckCircle2} />
        <StatBox label="Partial" value={stats.partialCount} color="#ffe87a" Icon={AlertCircle} />
        <StatBox label="Missed" value={stats.unsolvedCount} color="#ff8a7a" Icon={XCircle} />
        <StatBox
          label="Hints used"
          value={questions.filter((q) => session.answers[q.id].viewedApproach).length}
          color="#9ca3af"
          Icon={Eye}
        />
      </div>

      {!allGraded && (
        <Card className="mb-6 border-[#ffe87a]/30 bg-[#ffe87a]/[0.04]">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#ffe87a]" />
            <div className="text-sm">
              Grade each question below to lock in your score. Be honest — your future self benefits.
            </div>
          </div>
        </Card>
      )}

      {/* PER-QUESTION REVIEW */}
      <div className="space-y-4">
        {questions.map((q, i) => {
          const a = session.answers[q.id];
          return (
            <Card key={q.id} className={a.flagged ? "border-[var(--color-neon)]/30" : ""}>
              <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="display text-xl text-[var(--color-neon)]">Q{i + 1}</div>
                  <Chip>{q.topic}</Chip>
                  <Chip
                    style={
                      {
                        background:
                          q.difficulty === "Easy"
                            ? "#b9f5c822"
                            : q.difficulty === "Medium"
                            ? "#ffe87a22"
                            : "#ff8a7a22",
                        color:
                          q.difficulty === "Easy"
                            ? "#b9f5c8"
                            : q.difficulty === "Medium"
                            ? "#ffe87a"
                            : "#ff8a7a",
                      } as any
                    }
                  >
                    {q.difficulty}
                  </Chip>
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
              </div>

              <details className="text-sm text-white/85 mb-3">
                <summary className="cursor-pointer text-[var(--color-neon)] mono text-[10px] uppercase tracking-widest mb-1">
                  See question
                </summary>
                <pre className="whitespace-pre-wrap leading-relaxed font-sans mt-2 bg-white/[0.03] rounded-lg p-3 border border-white/10">
                  {q.question}
                </pre>
              </details>

              {/* Your answer */}
              {a.notes && (
                <details className="text-sm text-white/85 mb-3">
                  <summary className="cursor-pointer text-white/60 mono text-[10px] uppercase tracking-widest mb-1">
                    Your approach ({a.notes.length} chars)
                  </summary>
                  <div className="bg-white/[0.03] rounded-lg p-3 border border-white/10 mt-2 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                    {a.notes}
                  </div>
                </details>
              )}

              {/* Expected approach */}
              {q.expectedApproach && (
                <details className="text-sm text-white/85 mb-4">
                  <summary className="cursor-pointer text-[var(--color-neon)] mono text-[10px] uppercase tracking-widest mb-1">
                    Expected approach
                  </summary>
                  <div className="bg-[var(--color-neon)]/[0.04] rounded-lg p-3 border border-[var(--color-neon)]/20 mt-2 whitespace-pre-wrap leading-relaxed">
                    {q.expectedApproach}
                  </div>
                </details>
              )}

              {/* Grade buttons */}
              <div className="border-t border-white/10 pt-3">
                <div className="mono text-[10px] uppercase tracking-widest text-white/50 mb-2">
                  Grade yourself honestly
                </div>
                <div className="flex flex-wrap gap-2">
                  {GRADES.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => {
                        updateAnswer(session.id, q.id, { grade: g.value });
                        // re-save stats
                        setTimeout(saveStats, 50);
                      }}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        a.grade === g.value
                          ? "border-current text-black font-semibold"
                          : "border-white/20 text-white/70 hover:text-white"
                      }`}
                      style={a.grade === g.value ? { background: g.tone, borderColor: g.tone, color: "#000" } : undefined}
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" style={{ color }} />
        <div className="mono text-[10px] uppercase tracking-widest text-white/50">{label}</div>
      </div>
      <div className="display text-3xl mt-1" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function scoreColor(score: number) {
  if (score >= 75) return "#c8ff3d";
  if (score >= 50) return "#ffe87a";
  return "#ff8a7a";
}
