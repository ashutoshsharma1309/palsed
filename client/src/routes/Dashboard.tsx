// PrepNext — DSA Learning home.
//
// The dashboard is now entirely focused on the DSA journey: continue-where-you-
// left-off, learning stats (activity streak, problems solved, topics completed,
// completion %, current phase), and the full roadmap. The daily streak lives in
// a sticky right sidebar. (Placement widgets were removed in the pivot.)
import { Link } from "react-router-dom";
import { CheckCircle2, BarChart3, Target, ArrowRight } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { usePageMeta } from "../hooks/usePageMeta";
import { useAuth } from "../hooks/useAuth";
import { useLearningProgress } from "../hooks/useLearningProgress";
import { RoadmapView } from "../components/roadmap/RoadmapView";
import { DailyStreakCard } from "../components/dashboard/DailyStreakCard";
import { GamificationCard } from "../components/dashboard/GamificationCard";
import { DailyGoalBanner } from "../components/dashboard/DailyGoalBanner";
import { JourneyMap } from "../components/dashboard/JourneyMap";
import { ReadinessCard } from "../components/dashboard/ReadinessCard";
import { InsightsCard } from "../components/dashboard/InsightsCard";

export default function Dashboard() {
  usePageMeta({ title: "Dashboard", description: "Your placement journey — learn, practice, build, interview, and place.", canonical: "/dashboard" });
  const { user } = useAuth();
  const { stats } = useLearningProgress();
  const name = user?.displayName || user?.fullName || "Learner";
  const next = stats.nextTopic;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <header className="mb-8">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// welcome back, {name}</div>
        <h1 className="display text-5xl sm:text-7xl">YOUR PLACEMENT<br />JOURNEY.</h1>
        <p className="text-[var(--color-text-faint)] max-w-2xl mt-3 text-lg">
          Learn → Practice → Build → Interview → Placement. Pick up where you left off, one focused session a day.
        </p>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        {/* ===================== MAIN ===================== */}
        <div className="min-w-0 space-y-6">

          {/* Daily-goal retention nudge (shows until today's goal is met) */}
          <DailyGoalBanner />

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

          {/* Placement journey map — orient students across the full arc */}
          <JourneyMap />

          {/* DSA analytics — solved mix, difficulty, weak areas, focus-next */}
          <InsightsCard />

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
          <ReadinessCard />
          <GamificationCard />
          <DailyStreakCard />
        </aside>
      </div>
    </div>
  );
}
