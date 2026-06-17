import { Link } from "react-router-dom";
import { useLocalStorageState, LS_KEYS } from "../hooks/useLocalStorageState";
import { useMastery } from "../hooks/useMastery";
import { useSRS } from "../hooks/useSRS";
import { usePlacementProgress } from "../hooks/usePlacementProgress";
import { useApplications } from "../hooks/useApplications";
import { usePYQs } from "../hooks/usePYQs";
import { useEngagement } from "../components/adaptive/EngagementProvider";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Donut } from "../components/ui/Donut";
import { Radar } from "../components/ui/Radar";
import { ProgressBar } from "../components/ui/ProgressBar";
import { COMPANIES, getCompany } from "../data/companies";
import { STATUS_LABELS, STATUS_COLORS } from "../types/application";
import type { Profile } from "./Onboarding";
import { Flame, BrainCircuit, Sparkles, AlertTriangle, Rocket, ArrowRight, Bookmark, Calendar, Building2, Database, Plus } from "lucide-react";

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
  const [statuses] = useLocalStorageState<Record<number, string>>(LS_KEYS.dsaStatuses, {});
  const { map: mastery, top } = useMastery();
  const { dueCount } = useSRS();
  const { streakDays, log } = useEngagement();
  const placement = usePlacementProgress();
  const { apps, active, offers, upcoming } = useApplications();
  const { all: pyqs } = usePYQs();

  const solved = Object.values(statuses).filter((s) => s === "solved").length;
  const attempted = Object.values(statuses).filter((s) => s === "attempted").length;

  const { weak } = top(3);

  const radarPoints = Object.entries(mastery).slice(0, 8).map(([k, v]) => ({
    label: k.length > 14 ? k.slice(0, 14) + "…" : k,
    value: v.score,
  }));

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
          <Link to="/applications"><Button><Plus className="w-4 h-4" /> Track application</Button></Link>
          <Link to="/companies"><Button variant="outline">Browse recruiters</Button></Link>
          <Link to="/internships"><Button variant="outline">Find internships</Button></Link>
          <Link to="/review">
            <Button variant="ghost">
              Review {dueCount > 0 && `(${dueCount} due)`}
            </Button>
          </Link>
        </div>
      </header>

      {/* PLACEMENT SEASON — top of dashboard */}
      <Card className="mb-6 border-[var(--color-neon)]/30">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="display text-2xl flex items-center gap-2"><Building2 className="w-5 h-5 text-[var(--color-neon)]" /> MY PLACEMENT SEASON.</h3>
          <Link to="/applications" className="text-xs text-[var(--color-neon)] underline">Open tracker →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat2 label="Tracked" value={apps.length} sub={`${active.length} active`} />
          <Stat2 label="Offers" value={offers.length} sub={`${apps.length ? Math.round((offers.length/apps.length)*100) : 0}% conversion`} />
          <Stat2 label="PYQs available" value={pyqs.length} sub="across all companies" />
          <Stat2 label="Companies seeded" value={COMPANIES.length} sub="recruiter map" />
        </div>
        {upcoming.length > 0 && (
          <div className="mt-5 border-t border-white/10 pt-4">
            <div className="mono text-xs uppercase tracking-widest text-white/40 mb-3 flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Upcoming
            </div>
            <div className="space-y-2">
              {upcoming.slice(0, 4).map((a) => {
                const c = getCompany(a.companySlug);
                const days = Math.ceil((new Date(a.nextActionAt!).getTime() - Date.now()) / 86400000);
                return (
                  <div key={a.id} className="flex items-center gap-3 text-sm">
                    <span className="display text-2xl text-[var(--color-neon)] w-12 text-right">{days >= 0 ? `+${days}d` : `${days}d`}</span>
                    <Link to={`/companies/${a.companySlug}`} className="font-semibold flex-1 hover:text-[var(--color-neon)] truncate">{c?.name} · <span className="font-normal text-white/60">{a.role}</span></Link>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${STATUS_COLORS[a.status]}22`, color: STATUS_COLORS[a.status] }}>{STATUS_LABELS[a.status]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {apps.length === 0 && (
          <div className="mt-5 border-t border-white/10 pt-4 text-center py-3">
            <div className="text-sm text-white/60 mb-3">No applications yet. Pick a company and start tracking.</div>
            <Link to="/companies"><Button size="sm" variant="outline">Browse 50 recruiters →</Button></Link>
          </div>
        )}
      </Card>

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

      {/* Placement Hub analytics */}
      <Card className="mb-6 bg-white/[0.04] backdrop-blur-xl">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Rocket className="w-5 h-5 text-[var(--color-neon)]" />
            <h3 className="display text-2xl">PLACEMENT HUB.</h3>
          </div>
          <Link to="/placement-hub">
            <Button size="sm" variant="outline">
              Open hub <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-center">
          <div className="flex items-center gap-4">
            <Donut
              size={84}
              thickness={11}
              showLegend={false}
              centerValue={placement.readinessScore}
              segments={[
                { label: "Ready", value: placement.readinessScore, color: "#c8ff3d" },
                { label: "Left", value: Math.max(0, 100 - placement.readinessScore), color: "#1f1f1f" },
              ]}
            />
            <div>
              <div className="mono text-[11px] uppercase tracking-widest text-white/50">Readiness</div>
              <div className="text-xs text-white/40 mt-1">placement score</div>
            </div>
          </div>
          <div>
            <div className="mono text-[11px] uppercase tracking-widest text-white/50 mb-2">Topics completed</div>
            <div className="display text-4xl">
              {placement.completedCount}<span className="text-white/30 text-xl">/{placement.totalTopics}</span>
            </div>
            <div className="mt-2"><ProgressBar value={placement.completionPct} /></div>
          </div>
          <div>
            <div className="mono text-[11px] uppercase tracking-widest text-white/50 mb-2">Recommended next</div>
            <ul className="space-y-1">
              {placement.recommended.slice(0, 3).map((r) => (
                <li key={r.topicId} className="text-sm text-white/75 truncate">
                  <Link to="/placement-hub" className="hover:text-[var(--color-neon)]">
                    {r.topicTitle}
                    <span className="text-white/30 text-xs"> · {r.sectionTitle}</span>
                  </Link>
                </li>
              ))}
              {placement.recommended.length === 0 && (
                <li className="text-sm text-[var(--color-neon)]">All topics done 🎉</li>
              )}
            </ul>
          </div>
          <div>
            <div className="mono text-[11px] uppercase tracking-widest text-white/50 mb-2 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" /> Saved resources
            </div>
            <div className="display text-4xl">{placement.bookmarks.length}</div>
            <div className="text-xs text-white/40 mt-1">bookmarked across the hub</div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="display text-2xl flex items-center gap-2"><Database className="w-5 h-5 text-[var(--color-neon)]" /> EXPLORE RECRUITERS.</h3>
            <Link to="/companies" className="text-xs text-[var(--color-neon)] underline">All 50 →</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {COMPANIES.slice(0, 4).map((c) => (
              <Link
                key={c.slug}
                to={`/companies/${c.slug}`}
                className="border border-white/10 rounded-xl p-3 hover:border-[var(--color-neon)]/40 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center display text-xl shrink-0" style={{ background: c.brandColor || "#1a1a1a", color: c.brandColor ? "#fff" : "#c8ff3d" }}>{c.logoLetter}</div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{c.name}</div>
                  <div className="text-[10px] mono text-white/40 truncate">₹{c.ctcBand.typical} LPA · {c.indianOffices[0]}</div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <div className="mono text-xs uppercase tracking-widest text-white/50 mb-3">Mastery snapshot</div>
          {radarPoints.length >= 3 ? (
            <Radar points={radarPoints} size={280} />
          ) : (
            <div className="text-white/50 text-sm py-12 text-center">
              Solve some DSA problems to populate your mastery radar.
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
                Your lowest-mastery topics: <strong>{weak.join(", ")}</strong>. Practice these on the DSA hub or browse PYQs on these topics.
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link to="/dsa"><Button size="sm" variant="outline">Practice DSA</Button></Link>
                <Link to="/pyq"><Button size="sm" variant="ghost">Browse PYQs</Button></Link>
              </div>
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

function Stat2({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="border border-white/10 rounded-xl p-4">
      <div className="mono text-[10px] uppercase tracking-widest text-white/40">{label}</div>
      <div className="display text-4xl neon-text mt-1">{value}</div>
      {sub && <div className="mono text-[10px] text-white/40 mt-1">{sub}</div>}
    </div>
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
