// ────────────────────────────────────────────────────────────────────────────
//  Roadmap — AI-ready career roadmap module
//
//  Renders entirely from data/roadmaps.ts. Adding a role requires no changes
//  here. Progress is persisted via useRoadmapProgress (localStorage), 3-state
//  for topics and done/undone for DSA / CS / projects / skills.
//
//  Built with the existing design system (Card, ProgressBar, Donut, Chip,
//  Button), theme tokens, and usePageMeta — so it feels native to the app.
// ────────────────────────────────────────────────────────────────────────────
import { useMemo, useState } from "react";
import {
  ArrowLeft, ChevronDown, Circle, CircleDot, CheckCircle2, Clock,
  GraduationCap, BookOpen, FolderGit2, Boxes, Cpu, ExternalLink, RotateCcw,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Donut } from "../components/ui/Donut";
import { Button } from "../components/ui/Button";
import { usePageMeta } from "../hooks/usePageMeta";
import { useRoadmapProgress } from "../hooks/useRoadmapProgress";
import {
  ROLES, DSA_CATEGORIES, CS_AREAS, getRole, roleContentIds, TOTAL_DSA_QUESTIONS,
  type Role, type Difficulty, type Importance, type SkillLevel,
} from "../data/roadmaps";

// ── Small presentational helpers ──────────────────────────────────────────────

// Mid-tone hues chosen to stay legible in BOTH light and dark themes.
const TONE: Record<string, string> = {
  green: "#1a9c4f",
  amber: "#c2820a",
  red: "#d8513f",
  neon: "var(--color-neon-text)",
};
function Badge({ label, tone }: { label: string; tone: keyof typeof TONE }) {
  const color = TONE[tone];
  return (
    <span
      className="text-[10px] mono uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ color, backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)` }}
    >
      {label}
    </span>
  );
}
const diffTone = (d: Difficulty | "Easy" | "Easy-Medium" | "Medium"): keyof typeof TONE =>
  d === "Beginner" || d === "Easy" ? "green" : d === "Advanced" || d === "Medium" ? "red" : "amber";
const impTone = (i: Importance): keyof typeof TONE =>
  i === "Critical" ? "red" : i === "High" ? "amber" : "green";

// 3-state status control (topics).
function StatusToggle({ status, onClick }: { status: string; onClick: () => void }) {
  const map = {
    not_started: { Icon: Circle, cls: "text-[var(--color-text-faint)]", label: "Not started" },
    in_progress: { Icon: CircleDot, cls: "text-[var(--color-neon)]", label: "In progress" },
    completed: { Icon: CheckCircle2, cls: "text-[var(--color-neon)]", label: "Completed" },
  } as const;
  const s = map[(status as keyof typeof map)] ?? map.not_started;
  return (
    <button
      onClick={onClick}
      className={`shrink-0 ${s.cls} hover:opacity-80 transition-opacity`}
      aria-label={`Toggle status — currently ${s.label}`}
      title={s.label}
    >
      <s.Icon className="w-5 h-5" />
    </button>
  );
}

// Binary checkbox (DSA / CS / projects / skills).
function DoneToggle({ done, onClick }: { done: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 transition-opacity hover:opacity-80 ${done ? "text-[var(--color-neon)]" : "text-[var(--color-text-faint)]"}`}
      aria-label={done ? "Mark as not done" : "Mark as done"}
    >
      {done ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
    </button>
  );
}

// Collapsible section shell.
function Collapsible({
  title, subtitle, icon, defaultOpen = false, right, children,
}: {
  title: string; subtitle?: string; icon?: React.ReactNode; defaultOpen?: boolean;
  right?: React.ReactNode; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-card-soft)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[var(--color-card)] transition-colors"
      >
        {icon && <span className="text-[var(--color-neon)] shrink-0">{icon}</span>}
        <span className="flex-1">
          <span className="font-semibold text-[var(--color-text)] block">{title}</span>
          {subtitle && <span className="text-[11px] text-[var(--color-text-faint)]">{subtitle}</span>}
        </span>
        {right}
        <ChevronDown className={`w-4 h-4 text-[var(--color-text-faint)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 pt-1">{children}</div>}
    </div>
  );
}

const SKILL_GROUPS: { level: SkillLevel; label: string; note: string }[] = [
  { level: "must", label: "Must Know", note: "Critical skills" },
  { level: "good", label: "Good To Know", note: "Additional skills" },
  { level: "optional", label: "Optional", note: "Bonus skills" },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Roadmap() {
  usePageMeta({
    title: "Career Roadmap",
    description: "Structured, role-based learning roadmaps for software & IT careers — with DSA, CS fundamentals, projects, curated courses, and progress tracking.",
    canonical: "/roadmap",
  });

  const prog = useRoadmapProgress();
  const role = prog.selectedRole ? getRole(prog.selectedRole) : undefined;

  if (!role) return <RoleSelector onPick={(id) => prog.setSelectedRole(id)} prog={prog} />;
  return <RoleRoadmap role={role} prog={prog} onBack={() => prog.setSelectedRole(null)} />;
}

// ── Step 1: role selection ─────────────────────────────────────────────────────
function RoleSelector({
  onPick, prog,
}: { onPick: (id: string) => void; prog: ReturnType<typeof useRoadmapProgress> }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <header className="mb-8">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-3">
          · career roadmap ·
        </div>
        <h1 className="display text-5xl sm:text-7xl">PICK YOUR PATH.</h1>
        <p className="text-[var(--color-text-faint)] max-w-2xl mt-3 text-lg">
          Choose a target role to generate a complete, stage-by-stage roadmap — required skills,
          DSA, CS fundamentals, curated courses, projects, and live progress tracking.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROLES.map((r) => {
          const summary = prog.progressFor(roleContentIds(r));
          const started = summary.completed + summary.inProgress > 0;
          return (
            <button
              key={r.id}
              onClick={() => onPick(r.id)}
              className="text-left group rounded-2xl border border-[var(--color-line)] bg-[var(--color-card-soft)] p-5 hover:-translate-y-1 hover:border-[var(--color-neon)]/40 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-[var(--color-neon)]/10 grid place-items-center text-[var(--color-neon)] shrink-0">
                  <r.icon className="w-5 h-5" />
                </div>
                {started && (
                  <span className="mono text-[10px] text-[var(--color-neon)]">
                    {Math.round(summary.pct * 100)}%
                  </span>
                )}
              </div>
              <div className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-neon)] transition-colors">
                {r.title}
              </div>
              <p className="text-[13px] text-[var(--color-text-dim)] mt-1 line-clamp-2">{r.blurb}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {r.requiresDSA && <Badge label="DSA" tone="neon" />}
                {r.requiresCS && <Badge label="CS Core" tone="amber" />}
                <Badge label={`${r.stages.length} stages`} tone="green" />
              </div>
              {started && <div className="mt-3"><ProgressBar value={summary.pct} /></div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 2: full role roadmap ──────────────────────────────────────────────────
function RoleRoadmap({
  role, prog, onBack,
}: { role: Role; prog: ReturnType<typeof useRoadmapProgress>; onBack: () => void }) {
  // Per-section id universes.
  const ids = useMemo(() => {
    const topic = role.stages.flatMap((s) => s.topics.map((t) => `topic:${t.id}`));
    const skill = role.skills.map((s) => `skill:${s.id}`);
    const project = role.projects.map((p) => `project:${p.id}`);
    const dsa = role.requiresDSA ? DSA_CATEGORIES.flatMap((c) => c.questions.map((q) => `dsa:${q.id}`)) : [];
    const cs = role.requiresCS ? CS_AREAS.flatMap((a) => a.topics.map((t) => `cs:${t.id}`)) : [];
    return { topic, skill, project, dsa, cs, all: roleContentIds(role) };
  }, [role]);

  const overall = prog.progressFor(ids.all);
  const topicP = prog.progressFor(ids.topic);
  const dsaP = prog.progressFor(ids.dsa);
  const csP = prog.progressFor(ids.cs);
  const projP = prog.progressFor(ids.project);

  const projectsByLevel = useMemo(() => {
    const groups: Record<string, typeof role.projects> = { Beginner: [], Intermediate: [], Advanced: [] };
    for (const p of role.projects) groups[p.level].push(p);
    return groups;
  }, [role]);

  const dsaHours = useMemo(
    () => Math.round(DSA_CATEGORIES.reduce((m, c) => m + c.estMinutes, 0) / 60),
    []
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* Header + back */}
      <button
        onClick={onBack}
        className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)] inline-flex items-center gap-1 mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> All roadmaps
      </button>
      <header className="mb-8 flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[var(--color-neon)]/10 grid place-items-center text-[var(--color-neon)] shrink-0">
          <role.icon className="w-7 h-7" />
        </div>
        <div>
          <h1 className="display text-4xl sm:text-5xl leading-[0.95]">{role.title}</h1>
          <p className="text-[var(--color-text-dim)] mt-2 max-w-2xl">{role.blurb}</p>
        </div>
      </header>

      {/* ── Progress dashboard ── */}
      <div className="grid lg:grid-cols-3 gap-5 mb-10">
        <Card className="flex items-center gap-5 bg-[var(--color-card-soft)] backdrop-blur-xl">
          <Donut
            size={92}
            thickness={12}
            showLegend={false}
            centerValue={Math.round(overall.pct * 100)}
            segments={[
              { label: "Done", value: Math.round(overall.pct * 100), color: "#c8ff3d" },
              { label: "Left", value: Math.max(0, 100 - Math.round(overall.pct * 100)), color: "#1f1f1f" },
            ]}
          />
          <div>
            <div className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)]">Overall completion</div>
            <div className="text-[var(--color-text-dim)] text-sm mt-1">
              {overall.completed} done · {overall.inProgress} in progress · {overall.total} total
            </div>
          </div>
        </Card>

        <Card className="bg-[var(--color-card-soft)] backdrop-blur-xl sm:col-span-1 lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            <MiniBar label="Topics" p={topicP} />
            {role.requiresDSA && <MiniBar label="DSA" p={dsaP} />}
            {role.requiresCS && <MiniBar label="CS Fundamentals" p={csP} />}
            <MiniBar label="Projects" p={projP} />
          </div>
        </Card>
      </div>

      {/* ── Roadmap timeline (stages) ── */}
      <SectionTitle>Roadmap timeline</SectionTitle>
      <div className="space-y-3 mb-10">
        {role.stages.map((stage, i) => {
          const sIds = stage.topics.map((t) => `topic:${t.id}`);
          const sp = prog.progressFor(sIds);
          return (
            <Collapsible
              key={stage.id}
              defaultOpen={i === 0}
              icon={<span className="mono text-sm font-bold">{i + 1}</span>}
              title={stage.name}
              subtitle={stage.summary}
              right={<span className="mono text-[11px] text-[var(--color-text-faint)] mr-1">{sp.completed}/{sp.total}</span>}
            >
              <div className="grid sm:grid-cols-2 gap-2">
                {stage.topics.map((t) => {
                  const id = `topic:${t.id}`;
                  return (
                    <div key={t.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--color-card)] border border-[var(--color-line)]">
                      <StatusToggle status={prog.statusOf(id)} onClick={() => prog.cycleStatus(id)} />
                      <span className={`text-sm ${prog.statusOf(id) === "completed" ? "line-through text-[var(--color-text-faint)]" : "text-[var(--color-text)]"}`}>
                        {t.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Collapsible>
          );
        })}
      </div>

      {/* ── Skills ── */}
      <SectionTitle>Skills</SectionTitle>
      <div className="space-y-6 mb-10">
        {SKILL_GROUPS.map((g) => {
          const items = role.skills.filter((s) => s.level === g.level);
          if (!items.length) return null;
          return (
            <div key={g.level}>
              <div className="flex items-baseline gap-2 mb-3">
                <h3 className="font-semibold text-[var(--color-text)]">{g.label}</h3>
                <span className="text-[11px] text-[var(--color-text-faint)]">{g.note}</span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((s) => {
                  const id = `skill:${s.id}`;
                  const done = prog.isDone(id);
                  return (
                    <div key={s.id} className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-card-soft)] p-4">
                      <div className="flex items-start gap-3">
                        <DoneToggle done={done} onClick={() => prog.toggleDone(id)} />
                        <div className="min-w-0">
                          <div className={`font-semibold ${done ? "text-[var(--color-text-faint)]" : "text-[var(--color-text)]"}`}>{s.name}</div>
                          <p className="text-[13px] text-[var(--color-text-dim)] mt-1">{s.description}</p>
                          <p className="text-[12px] text-[var(--color-text-faint)] mt-1.5"><span className="text-[var(--color-neon)]">Why:</span> {s.why}</p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                            <Badge label={s.difficulty} tone={diffTone(s.difficulty)} />
                            <span className="inline-flex items-center gap-1 text-[11px] text-[var(--color-text-faint)] mono">
                              <Clock className="w-3 h-3" /> {s.estTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── DSA module ── */}
      {role.requiresDSA && (
        <>
          <SectionTitle right={<span className="mono text-[11px] text-[var(--color-text-faint)]">{dsaP.completed}/{TOTAL_DSA_QUESTIONS} · ~{dsaHours}h</span>}>
            DSA — interview-focused
          </SectionTitle>
          <div className="space-y-3 mb-10">
            {DSA_CATEGORIES.map((c) => {
              const cIds = c.questions.map((q) => `dsa:${q.id}`);
              const cp = prog.progressFor(cIds);
              return (
                <Collapsible
                  key={c.id}
                  icon={<Boxes className="w-4 h-4" />}
                  title={c.name}
                  subtitle={`${c.concepts.join(" · ")} · ~${Math.round(c.estMinutes / 60)}h`}
                  right={<span className="mono text-[11px] text-[var(--color-text-faint)] mr-1">{cp.completed}/{cp.total}</span>}
                >
                  <div className="space-y-2">
                    {c.questions.map((qn) => {
                      const id = `dsa:${qn.id}`;
                      const done = prog.isDone(id);
                      return (
                        <div key={qn.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--color-card)] border border-[var(--color-line)]">
                          <DoneToggle done={done} onClick={() => prog.toggleDone(id)} />
                          <span className={`text-sm flex-1 ${done ? "line-through text-[var(--color-text-faint)]" : "text-[var(--color-text)]"}`}>{qn.title}</span>
                          <Badge label={qn.difficulty} tone={diffTone(qn.difficulty)} />
                          <Badge label={qn.importance} tone={impTone(qn.importance)} />
                        </div>
                      );
                    })}
                  </div>
                </Collapsible>
              );
            })}
          </div>
        </>
      )}

      {/* ── CS Fundamentals ── */}
      {role.requiresCS && (
        <>
          <SectionTitle right={<span className="mono text-[11px] text-[var(--color-text-faint)]">{csP.completed}/{csP.total}</span>}>
            CS Fundamentals
          </SectionTitle>
          <div className="space-y-3 mb-10">
            {CS_AREAS.map((a) => {
              const aIds = a.topics.map((t) => `cs:${t.id}`);
              const ap = prog.progressFor(aIds);
              return (
                <Collapsible
                  key={a.id}
                  icon={<Cpu className="w-4 h-4" />}
                  title={a.name}
                  right={<span className="mono text-[11px] text-[var(--color-text-faint)] mr-1">{ap.completed}/{ap.total}</span>}
                >
                  <div className="space-y-2">
                    {a.topics.map((t) => {
                      const id = `cs:${t.id}`;
                      const done = prog.isDone(id);
                      return (
                        <div key={t.id} className="flex flex-wrap items-center gap-2 px-3 py-2 rounded-xl bg-[var(--color-card)] border border-[var(--color-line)]">
                          <DoneToggle done={done} onClick={() => prog.toggleDone(id)} />
                          <span className={`text-sm flex-1 min-w-0 ${done ? "line-through text-[var(--color-text-faint)]" : "text-[var(--color-text)]"}`}>{t.name}</span>
                          <Badge label={t.importance} tone={impTone(t.importance)} />
                          <Badge label={`IV: ${t.interviewRelevance}`} tone="neon" />
                          <span className="basis-full text-[11px] text-[var(--color-text-faint)] pl-8">
                            Resources: {t.resources.join(" · ")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Collapsible>
              );
            })}
          </div>
        </>
      )}

      {/* ── Courses ── */}
      <SectionTitle>Curated courses & resources</SectionTitle>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        {role.courses.map((c, i) => (
          <div key={i} className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-card-soft)] p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Badge label={c.type} tone={c.type === "Free" || c.type === "Open-source" ? "green" : c.type === "YouTube" ? "red" : "amber"} />
              <Badge label={c.difficulty} tone={diffTone(c.difficulty)} />
            </div>
            <div className="font-semibold text-[var(--color-text)] flex items-center gap-1.5">
              {c.title}
              {c.url && <ExternalLink className="w-3 h-3 text-[var(--color-text-faint)]" />}
            </div>
            <div className="text-[12px] text-[var(--color-text-faint)] mono mt-0.5">{c.provider} · {c.duration}</div>
            <p className="text-[13px] text-[var(--color-text-dim)] mt-2">{c.why}</p>
          </div>
        ))}
      </div>

      {/* ── Projects ── */}
      <SectionTitle right={<span className="mono text-[11px] text-[var(--color-text-faint)]">{projP.completed}/{projP.total} built</span>}>
        Projects
      </SectionTitle>
      <div className="space-y-6">
        {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => {
          const list = projectsByLevel[lvl];
          if (!list.length) return null;
          return (
            <div key={lvl}>
              <div className="flex items-center gap-2 mb-3">
                <Badge label={lvl} tone={diffTone(lvl)} />
                <span className="text-[11px] text-[var(--color-text-faint)]">{list.length} project{list.length > 1 ? "s" : ""}</span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {list.map((p) => {
                  const id = `project:${p.id}`;
                  const done = prog.isDone(id);
                  return (
                    <div key={p.id} className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-card-soft)] p-4 flex flex-col">
                      <div className="flex items-start gap-2.5">
                        <DoneToggle done={done} onClick={() => prog.toggleDone(id)} />
                        <div className="min-w-0">
                          <div className={`font-semibold ${done ? "text-[var(--color-text-faint)]" : "text-[var(--color-text)]"}`}>{p.title}</div>
                          <p className="text-[13px] text-[var(--color-text-dim)] mt-1">{p.description}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.tech.map((t) => (
                          <span key={t} className="text-[10px] mono px-1.5 py-0.5 rounded bg-[var(--color-card)] border border-[var(--color-line)] text-[var(--color-text-dim)]">{t}</span>
                        ))}
                      </div>
                      <div className="mt-auto pt-3 flex items-center justify-between text-[11px] text-[var(--color-text-faint)] mono">
                        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {p.duration}</span>
                        <span>Portfolio: {p.portfolioValue}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset */}
      <div className="mt-12 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { if (confirm(`Reset all progress for ${role.title}?`)) prog.resetRole(ids.all); }}
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset this roadmap
        </Button>
      </div>
    </div>
  );
}

// ── Tiny shared bits ──────────────────────────────────────────────────────────
function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="display text-2xl flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-[var(--color-neon)]" /> {children}
      </h2>
      {right}
    </div>
  );
}

function MiniBar({ label, p }: { label: string; p: { completed: number; total: number; pct: number } }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-[var(--color-text-dim)] inline-flex items-center gap-1.5">
          {label === "Projects" ? <FolderGit2 className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
          {label}
        </span>
        <span className="mono text-[11px] text-[var(--color-text-faint)]">{p.completed}/{p.total}</span>
      </div>
      <ProgressBar value={p.pct} />
    </div>
  );
}
