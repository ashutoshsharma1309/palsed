// PrepPlace — DSA Learning home.
//
// The dashboard is now entirely focused on the DSA journey: continue-where-you-
// left-off, learning stats (activity streak, problems solved, topics completed,
// completion %, current phase), and the full roadmap. The daily streak lives in
// a sticky right sidebar. (Placement widgets were removed in the pivot.)
import { Link } from "react-router-dom";
import {
  Flame, Trophy, CheckCircle2, ListChecks, Layers, BarChart3, Target, ArrowRight, Clock, CalendarDays,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";
import { usePageMeta } from "../hooks/usePageMeta";
import { useAuth } from "../hooks/useAuth";
import { useLearningProgress } from "../hooks/useLearningProgress";
import { RoadmapView } from "../components/roadmap/RoadmapView";
import { DailyStreakCard } from "../components/dashboard/DailyStreakCard";
import { TOTAL_QUESTIONS } from "../data/dsa/roadmap";

function StatTile({
  icon, label, value, sub,
}: { icon: React.ReactNode; label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-card-soft)] p-4">
      <div className="flex items-center gap-2 mb-2 text-[var(--color-neon)]">
        {icon}
        <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">{label}</div>
      </div>
      <div className="display text-4xl leading-none">{value}</div>
      {sub && <div className="mt-2">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  usePageMeta({ title: "Dashboard", description: "Your DSA learning journey — roadmap, progress, and streak.", canonical: "/dashboard" });
  const { user } = useAuth();
  const { stats } = useLearningProgress();
  const name = user?.displayName || user?.fullName || "Learner";
  const next = stats.nextTopic;
  const pct = Math.round(stats.completionPct * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <header className="mb-8">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// welcome back, {name}</div>
        <h1 className="display text-5xl sm:text-7xl">CONTINUE YOUR<br />DSA JOURNEY.</h1>
        <p className="text-[var(--color-text-faint)] max-w-2xl mt-3 text-lg">
          From zero to interview-ready — one topic, a few problems, and a daily streak at a time.
        </p>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        {/* ===================== MAIN ===================== */}
        <div className="min-w-0 space-y-6">

          {/* Continue / today's goal */}
          <Card className="border-[var(--color-neon)]/30">
            <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-center">
              <div>
                <div className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)] mb-1">Continue from</div>
                {next ? (
                  <>
                    <div className="display text-3xl">{next.name}</div>
                    <div className="text-sm text-[var(--color-text-faint)] mt-1">{stats.currentPhase.name}</div>
                  </>
                ) : (
                  <div className="display text-3xl">🎉 All topics complete!</div>
                )}
              </div>
              {next ? (
                <Link to={`/learn/${next.id}`}>
                  <Button size="lg">Continue learning <ArrowRight className="w-4 h-4" /></Button>
                </Link>
              ) : (
                <Link to={`/learn/interview-revision`}>
                  <Button size="lg" variant="outline">Revise <ArrowRight className="w-4 h-4" /></Button>
                </Link>
              )}
            </div>
            <div className="mt-4 border-t border-[var(--color-line)] pt-3 flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-[var(--color-neon)]" />
              <span className="text-[var(--color-text-dim)]">Today's goal: complete at least one lesson item.</span>
              {stats.todayActive ? (
                <span className="ml-auto inline-flex items-center gap-1 text-[var(--color-neon)] text-xs"><CheckCircle2 className="w-4 h-4" /> Done today</span>
              ) : (
                <span className="ml-auto text-xs text-[var(--color-text-faint)]">not yet</span>
              )}
            </div>
          </Card>

          {/* Learning stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatTile icon={<Flame className="w-4 h-4" />} label="Current streak" value={<>{stats.currentStreak}<span className="text-base text-[var(--color-text-faint)] ml-1">{stats.currentStreak === 1 ? "day" : "days"}</span></>} />
            <StatTile icon={<Trophy className="w-4 h-4" />} label="Best streak" value={<>{stats.bestStreak}<span className="text-base text-[var(--color-text-faint)] ml-1">days</span></>} />
            <StatTile icon={<CheckCircle2 className="w-4 h-4" />} label="Problems solved" value={<>{stats.problemsSolved}<span className="text-base text-[var(--color-text-faint)]">/{TOTAL_QUESTIONS}</span></>} />
            <StatTile icon={<ListChecks className="w-4 h-4" />} label="Topics completed" value={<>{stats.topicsCompleted}<span className="text-base text-[var(--color-text-faint)]">/{stats.totalTopics}</span></>} />
            <StatTile
              icon={<BarChart3 className="w-4 h-4" />} label="Completion"
              value={<>{pct}<span className="text-base text-[var(--color-text-faint)]">%</span></>}
              sub={<ProgressBar value={stats.completionPct} />}
            />
            <StatTile icon={<CalendarDays className="w-4 h-4" />} label="This week" value={<>{stats.weekActiveDays}<span className="text-base text-[var(--color-text-faint)]">/7</span></>} sub={<div className="mono text-[10px] text-[var(--color-text-faint)]">active learning days</div>} />
            <StatTile icon={<Layers className="w-4 h-4" />} label="Current phase" value={<span className="text-xl">{stats.currentPhase.name.replace(/Phase \d+ — /, "")}</span>} />
            <StatTile icon={<Clock className="w-4 h-4" />} label="Hours studied" value={<span className="text-[var(--color-text-faint)] text-2xl">soon</span>} sub={<div className="mono text-[10px] text-[var(--color-text-faint)]">time tracking coming</div>} />
          </div>

          {/* Roadmap */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-[var(--color-neon)]" />
              <h2 className="display text-2xl">DSA ROADMAP.</h2>
            </div>
            <RoadmapView />
          </div>
        </div>

        {/* ===================== SIDEBAR ===================== */}
        <aside className="lg:sticky lg:top-20 space-y-6">
          <DailyStreakCard />
        </aside>
      </div>
    </div>
  );
}
