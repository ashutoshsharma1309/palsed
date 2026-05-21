import { Link } from "react-router-dom";
import { useLocalStorageState, LS_KEYS } from "../hooks/useLocalStorageState";
import { useMastery } from "../hooks/useMastery";
import { useSRS } from "../hooks/useSRS";
import { useEngagement } from "../components/adaptive/EngagementProvider";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Donut } from "../components/ui/Donut";
import { Radar } from "../components/ui/Radar";
import { ProgressBar } from "../components/ui/ProgressBar";
import type { Profile } from "./Onboarding";
import { Flame, GraduationCap, Map as MapIcon, BrainCircuit, Layers, Sparkles, AlertTriangle } from "lucide-react";

const DEFAULT_PROFILE: Profile = {
  displayName: "Learner",
  avatarSeed: "default",
  joinedAt: new Date().toISOString(),
  learningGoal: "Master DSA",
  preferredStyle: "step_by_step",
  dailyMinutes: 30,
};

export default function Dashboard() {
  const [profile] = useLocalStorageState<Profile>(LS_KEYS.profile, DEFAULT_PROFILE);
  const [courses] = useLocalStorageState<any[]>(LS_KEYS.courses, []);
  const [roadmaps] = useLocalStorageState<any[]>(LS_KEYS.roadmaps, []);
  const [statuses] = useLocalStorageState<Record<number, string>>(LS_KEYS.dsaStatuses, {});
  const [lessons] = useLocalStorageState<Record<string, any>>(LS_KEYS.lessons, {});
  const { map: mastery, top } = useMastery();
  const { dueCount } = useSRS();
  const { streakDays, log } = useEngagement();

  const solved = Object.values(statuses).filter((s) => s === "solved").length;
  const attempted = Object.values(statuses).filter((s) => s === "attempted").length;

  const { weak } = top(3);

  const radarPoints = Object.entries(mastery).slice(0, 8).map(([k, v]) => ({
    label: k.length > 14 ? k.slice(0, 14) + "…" : k,
    value: v.score,
  }));

  // Continue-where-you-left-off: most recently touched lesson
  const recentLessons = Object.entries(lessons)
    .filter(([, v]) => v?.lastAt)
    .sort((a, b) => new Date(b[1].lastAt).getTime() - new Date(a[1].lastAt).getTime());
  const resume = recentLessons[0];

  const todayActiveMs = log.days.find((d) => d.date === new Date().toISOString().slice(0, 10))?.activeMs ?? 0;
  const goalMs = profile.dailyMinutes * 60 * 1000;
  const goalFrac = Math.min(1, todayActiveMs / goalMs);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">
            // welcome back, {profile.displayName}
          </div>
          <h1 className="display text-5xl sm:text-7xl">DASHBOARD.</h1>
          <p className="text-white/60 max-w-xl mt-2">
            Goal: <span className="text-white">{profile.learningGoal}</span> · Style:{" "}
            <span className="text-white">{profile.preferredStyle.replace("_", " ")}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/courses/create">
            <Button>Generate a course</Button>
          </Link>
          <Link to="/review">
            <Button variant="outline">
              Review {dueCount > 0 && `(${dueCount} due)`}
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Flame className="w-5 h-5 text-[var(--color-neon)]" />
            <div className="mono text-xs uppercase tracking-widest text-white/50">Streak</div>
          </div>
          <div className="display text-6xl neon-text">{streakDays}<span className="text-2xl ml-2">d</span></div>
          <div className="text-xs text-white/40 mt-2">consecutive days of focus &gt; 1 min</div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-5 h-5 text-[var(--color-neon)]" />
            <div className="mono text-xs uppercase tracking-widest text-white/50">Today's focus</div>
          </div>
          <div className="display text-6xl">{Math.floor(todayActiveMs / 60000)}<span className="text-2xl ml-2">min</span></div>
          <div className="mt-4">
            <ProgressBar value={goalFrac} label={`Goal · ${profile.dailyMinutes}min`} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <BrainCircuit className="w-5 h-5 text-[var(--color-neon)]" />
            <div className="mono text-xs uppercase tracking-widest text-white/50">DSA progress</div>
          </div>
          <div className="display text-6xl">
            {solved}<span className="text-white/30 text-3xl">/150</span>
          </div>
          <div className="text-xs text-white/40 mt-2">{attempted} attempted but unsolved</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="mono text-xs uppercase tracking-widest text-white/50">Continue learning</div>
              <h3 className="display text-2xl">PICK UP WHERE YOU LEFT OFF.</h3>
            </div>
          </div>
          {resume ? (
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">{resume[0]}</div>
                <div className="text-xs text-white/50 mono mt-1">
                  last touched {new Date(resume[1].lastAt).toLocaleString()}
                </div>
              </div>
              <Link to="/courses">
                <Button size="sm">Resume</Button>
              </Link>
            </div>
          ) : (
            <div className="text-white/50 text-sm">
              No course in progress.{" "}
              <Link to="/courses/create" className="text-[var(--color-neon)] underline">
                Generate one
              </Link>
              .
            </div>
          )}

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Stat icon={<Layers className="w-4 h-4" />} label="Courses" value={courses.length} to="/courses" />
            <Stat icon={<MapIcon className="w-4 h-4" />} label="Roadmaps" value={roadmaps.length} to="/roadmaps" />
            <Stat icon={<GraduationCap className="w-4 h-4" />} label="Lessons done" value={Object.values(lessons).filter((l: any) => l?.status === "complete").length} to="/courses" />
          </div>
        </Card>
        <Card>
          <div className="mono text-xs uppercase tracking-widest text-white/50 mb-3">Mastery snapshot</div>
          {radarPoints.length >= 3 ? (
            <Radar points={radarPoints} size={280} />
          ) : (
            <div className="text-white/50 text-sm py-12 text-center">
              Solve a few problems or take a quiz to populate your mastery radar.
            </div>
          )}
          <Link to="/mastery" className="block text-center mt-4 text-xs text-[var(--color-neon)] underline">
            See full mastery →
          </Link>
        </Card>
      </div>

      {weak.length > 0 && (
        <Card className="mb-6 border-[var(--color-neon)]/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[var(--color-neon)] shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold mb-1">Weak topic alert</div>
              <div className="text-sm text-white/70 mb-3">
                Your lowest-mastery topics right now: <strong>{weak.join(", ")}</strong>. PalsEd will
                push easier questions on these and weight your next course toward them.
              </div>
              <Link to="/courses/create">
                <Button size="sm" variant="outline">Generate course on {weak[0]}</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="display text-2xl">14-DAY ENGAGEMENT.</h3>
          <Link to="/engagement" className="text-xs text-[var(--color-neon)] underline">Full report →</Link>
        </div>
        <Heatmap days={log.days} />
      </Card>
    </div>
  );
}

function Stat({ icon, label, value, to }: { icon: React.ReactNode; label: string; value: number; to: string }) {
  return (
    <Link to={to} className="card-base p-4 hover:border-[var(--color-neon)] transition-colors">
      <div className="flex items-center gap-2 text-white/50 text-xs mono uppercase">{icon}{label}</div>
      <div className="display text-3xl mt-1">{value}</div>
    </Link>
  );
}

function Heatmap({ days }: { days: { date: string; activeMs: number }[] }) {
  // Build last 14 days
  const today = new Date();
  const cells = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const entry = days.find((x) => x.date === key);
    const ms = entry?.activeMs ?? 0;
    const intensity = Math.min(1, ms / (30 * 60 * 1000));
    cells.push({ key, label: d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" }), intensity, ms });
  }
  return (
    <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
      {cells.map((c) => (
        <div
          key={c.key}
          title={`${c.label} · ${Math.floor(c.ms / 60000)} min`}
          className="aspect-square rounded-md flex items-end justify-end p-1 text-[9px] mono text-black/70"
          style={{
            background: c.intensity > 0
              ? `rgba(200,255,61,${0.15 + 0.85 * c.intensity})`
              : "#1a1a1a",
          }}
        >
          {Math.floor(c.ms / 60000) || ""}
        </div>
      ))}
    </div>
  );
}
