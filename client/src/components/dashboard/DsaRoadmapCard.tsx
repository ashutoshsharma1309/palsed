// DSA Roadmap Tracker — replaces the old "DSA progress" dashboard widget.
// Shows the ordered DSA journey with per-topic 3-state progress, an overall
// completion %/bar, and a future-ready expand affordance per topic.
//
// Reuses the existing design system (Card, ProgressBar, theme tokens). Progress
// persists via useDsaRoadmap (localStorage, backend-migratable).
import { useState } from "react";
import { Link } from "react-router-dom";
import { Circle, CircleDot, CheckCircle2, ChevronDown, Route as RouteIcon } from "lucide-react";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { useDsaRoadmap, type TopicStatus } from "../../hooks/useDsaRoadmap";

function StatusIcon({ status }: { status: TopicStatus }) {
  if (status === "completed") return <CheckCircle2 className="w-5 h-5 text-[var(--color-neon)]" />;
  if (status === "in_progress") return <CircleDot className="w-5 h-5 text-[var(--color-neon)]" />;
  return <Circle className="w-5 h-5 text-[var(--color-text-faint)]" />;
}

const STATUS_LABEL: Record<TopicStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
};

function TopicRow({
  index, name, status, onCycle,
}: { index: number; name: string; status: TopicStatus; onCycle: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border-b border-[var(--color-line)] last:border-0">
      <div className="flex items-center gap-3 py-2.5">
        {/* 3-state toggle: click to cycle Not started → In progress → Completed */}
        <button
          onClick={onCycle}
          className="shrink-0 hover:opacity-80 transition-opacity"
          aria-label={`${name} — ${STATUS_LABEL[status]}. Click to change.`}
          title={STATUS_LABEL[status]}
        >
          <StatusIcon status={status} />
        </button>
        <span className="mono text-[10px] text-[var(--color-text-faint)] w-5 shrink-0">{index + 1}</span>
        <span
          className={`flex-1 text-sm ${
            status === "completed"
              ? "line-through text-[var(--color-text-faint)]"
              : status === "in_progress"
              ? "text-[var(--color-text)]"
              : "text-[var(--color-text-dim)]"
          }`}
        >
          {name}
        </span>
        {/* Expand — future-ready (lessons/problems per topic later) */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={`Expand ${name}`}
          className="shrink-0 text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {open && (
        <div className="pb-3 pl-11 text-[13px] text-[var(--color-text-faint)]">
          Practice {name} on the{" "}
          <Link to="/dsa" className="text-[var(--color-neon)] hover:underline">DSA hub →</Link>
        </div>
      )}
    </li>
  );
}

export function DsaRoadmapCard() {
  const { topics, statusOf, cycle, completed, total, pct } = useDsaRoadmap();
  const pctLabel = Math.round(pct * 100);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="display text-2xl flex items-center gap-2">
          <RouteIcon className="w-5 h-5 text-[var(--color-neon)]" /> DSA ROADMAP.
        </h3>
        <Link to="/dsa" className="text-xs text-[var(--color-neon)] underline">Open DSA hub →</Link>
      </div>

      {/* Overall progress */}
      <div className="mb-5">
        <div className="flex items-end justify-between mb-1.5">
          <span className="mono text-[11px] uppercase tracking-widest text-[var(--color-text-faint)]">Progress</span>
          <span className="display text-3xl leading-none">
            {pctLabel}<span className="text-base text-[var(--color-text-faint)]">%</span>
          </span>
        </div>
        <ProgressBar value={pct} />
        <div className="mono text-[10px] text-[var(--color-text-faint)] mt-1.5">{completed}/{total} topics completed</div>
      </div>

      {/* Ordered topic list */}
      <ul>
        {topics.map((t, i) => (
          <TopicRow key={t.id} index={i} name={t.name} status={statusOf(t.id)} onCycle={() => cycle(t.id)} />
        ))}
      </ul>
    </Card>
  );
}
