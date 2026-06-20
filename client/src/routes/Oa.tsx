import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Play, Clock, Timer, Brain, Trash2, TrendingUp, Building2, Sparkles } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Chip } from "../components/ui/Chip";
import { Button } from "../components/ui/Button";
import { COMPANIES, getCompany } from "../data/companies";
import { useOaSessions, pickQuestionsForConfig } from "../hooks/useOaSessions";
import { type OADifficulty, defaultOaConfig } from "../types/oa";
import { usePageMeta } from "../hooks/usePageMeta";

// OA Practice Mode — setup + history list.

const DURATION_OPTIONS = [15, 30, 45, 60, 90] as const;
const COUNT_OPTIONS = [1, 2, 3, 5] as const;
const DIFFICULTIES: OADifficulty[] = ["Easy", "Medium", "Hard", "Mixed"];

export default function Oa() {
  usePageMeta({
    title: "OA Practice — timed mock placement tests",
    description: "Timed online assessment practice from real PYQs. Pick a company, set duration, get a real OA simulation. Self-graded.",
    canonical: "/oa",
  });

  const navigate = useNavigate();
  const { sessions, create, remove } = useOaSessions();
  const [config, setConfig] = useState(defaultOaConfig());

  const matchingPreview = useMemo(
    () => pickQuestionsForConfig({ ...config, questionCount: 100 }).length,
    [config]
  );

  const start = () => {
    const s = create(config);
    if (!s) return;
    navigate(`/oa/test/${s.id}`);
  };

  const finishedHistory = sessions.filter((s) => s.finishedAt);
  const inProgress = sessions.filter((s) => !s.finishedAt);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <header className="mb-8">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// oa practice</div>
        <h1 className="display text-5xl sm:text-6xl">MOCK OA.</h1>
        <p className="text-white/60 mt-2 max-w-2xl">
          Real interview questions, real time pressure. Pick a company, hit start, simulate the
          conditions you'll face. Self-graded with our suggested rubric.
        </p>
      </header>

      {/* IN PROGRESS — resume */}
      {inProgress.length > 0 && (
        <Card className="mb-6 border-[var(--color-neon)]/40">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-neon)] mb-1">· resume ·</div>
              <div className="display text-xl">
                Active test {inProgress[0].config.companySlug ? `· ${getCompany(inProgress[0].config.companySlug)?.name}` : ""}
              </div>
              <div className="text-xs text-white/55 mt-0.5">
                Started {new Date(inProgress[0].startedAt).toLocaleString()}
              </div>
            </div>
            <Link to={`/oa/test/${inProgress[0].id}`}>
              <Button>
                <Play className="w-4 h-4" /> Resume
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* SETUP */}
      <Card className="mb-6">
        <h2 className="display text-2xl mb-1">NEW TEST.</h2>
        <p className="text-white/55 text-sm mb-5">
          Tune the simulation to match your real OA.
        </p>

        <div className="space-y-5">
          {/* Company */}
          <div>
            <label className="mono text-[10px] uppercase tracking-widest text-white/50 block mb-1.5">Company</label>
            <div className="flex flex-wrap gap-1.5">
              <Chip active={!config.companySlug} onClick={() => setConfig({ ...config, companySlug: undefined })}>
                All companies (random)
              </Chip>
              {COMPANIES.slice(0, 30).map((c) => (
                <Chip
                  key={c.slug}
                  active={config.companySlug === c.slug}
                  onClick={() => setConfig({ ...config, companySlug: c.slug })}
                >
                  {c.name}
                </Chip>
              ))}
            </div>
            {COMPANIES.length > 30 && (
              <p className="text-[10px] text-white/40 mt-1.5">Showing top 30 — full list in /companies.</p>
            )}
          </div>

          {/* Difficulty */}
          <div>
            <label className="mono text-[10px] uppercase tracking-widest text-white/50 block mb-1.5">Difficulty</label>
            <div className="flex flex-wrap gap-1.5">
              {DIFFICULTIES.map((d) => (
                <Chip
                  tone="neon"
                  key={d}
                  active={config.difficulty === d}
                  onClick={() => setConfig({ ...config, difficulty: d })}
                >
                  {d}
                </Chip>
              ))}
            </div>
          </div>

          {/* Duration + Count side by side */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="mono text-[10px] uppercase tracking-widest text-white/50 block mb-1.5">
                <Clock className="w-3 h-3 inline -mt-0.5" /> Duration · {config.durationMin} min
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DURATION_OPTIONS.map((d) => (
                  <Chip
                    tone="neon"
                    key={d}
                    active={config.durationMin === d}
                    onClick={() => setConfig({ ...config, durationMin: d })}
                  >
                    {d}m
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <label className="mono text-[10px] uppercase tracking-widest text-white/50 block mb-1.5">
                <Brain className="w-3 h-3 inline -mt-0.5" /> Questions · {config.questionCount}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COUNT_OPTIONS.map((n) => (
                  <Chip
                    tone="neon"
                    key={n}
                    active={config.questionCount === n}
                    onClick={() => setConfig({ ...config, questionCount: n })}
                  >
                    {n} Q
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          {/* Topic filter (optional) */}
          <div>
            <label className="mono text-[10px] uppercase tracking-widest text-white/50 block mb-1.5">
              Topic filter (optional)
            </label>
            <input
              type="text"
              value={config.topicFilter || ""}
              onChange={(e) => setConfig({ ...config, topicFilter: e.target.value || undefined })}
              placeholder="e.g. DP, Arrays, Graphs"
              className="w-full bg-white/[0.03] border border-white/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-neon)]"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="text-xs text-white/60">
              <span className="text-[var(--color-neon)] font-bold">{matchingPreview}</span> matching question{matchingPreview === 1 ? "" : "s"} in the pool
              {matchingPreview < config.questionCount && (
                <span className="text-[#ffe87a] ml-2">
                  · we'll top up from related rounds if short
                </span>
              )}
            </div>
            <Button
              onClick={start}
              disabled={matchingPreview === 0}
            >
              <Play className="w-4 h-4" /> Start test
            </Button>
          </div>
        </div>
      </Card>

      {/* HISTORY */}
      {finishedHistory.length > 0 ? (
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="display text-2xl">HISTORY.</h2>
            <span className="mono text-[10px] uppercase tracking-widest text-white/40">
              {finishedHistory.length} tests
            </span>
          </div>
          <div className="space-y-2">
            {finishedHistory.map((s) => {
              const c = s.config.companySlug ? getCompany(s.config.companySlug) : null;
              const stats = s.resultStats;
              return (
                <Link
                  key={s.id}
                  to={`/oa/result/${s.id}`}
                  className="block border border-white/10 rounded-xl p-3 hover:border-[var(--color-neon)]/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 display text-base"
                      style={{
                        background: c?.brandColor || "#1a1a1a",
                        color: c?.brandColor ? "#fff" : "#c8ff3d",
                      }}
                    >
                      {c?.logoLetter || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">
                        {c?.name || "Mixed Companies"} · {s.config.difficulty}
                      </div>
                      <div className="text-[11px] text-white/50 mono">
                        {new Date(s.startedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} ·
                        {" "}{s.config.questionCount} Q · {s.config.durationMin} min
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="display text-2xl"
                        style={{ color: scoreColor(stats?.score || 0) }}
                      >
                        {stats?.score ?? 0}
                      </div>
                      <div className="text-[10px] mono uppercase tracking-widest text-white/40">/ 100</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (confirm("Delete this test?")) remove(s.id);
                      }}
                      className="text-white/30 hover:text-red-300 ml-1"
                      aria-label="Delete test"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <Card className="text-center py-10 bg-white/[0.02]">
          <Sparkles className="w-8 h-8 text-[var(--color-neon)] mx-auto mb-2" />
          <div className="display text-xl mb-1">No tests yet.</div>
          <p className="text-white/55 text-sm">
            Run your first mock OA above. We'll track scores + suggest topics to focus.
          </p>
        </Card>
      )}
    </div>
  );
}

function scoreColor(score: number) {
  if (score >= 75) return "#c8ff3d";
  if (score >= 50) return "#ffe87a";
  return "#ff8a7a";
}
