// The full DSA roadmap — phases (collapsible) → topics (linking to lesson pages).
// Topic rows render only when their phase is expanded, so the long roadmap stays
// cheap. Status comes from the central learning store.
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Circle, CircleDot, CheckCircle2, ArrowRight } from "lucide-react";
import { PHASES, getTopic, type Phase, type TopicStatus } from "../../data/dsa/roadmap";
import { useLearningProgress } from "../../hooks/useLearningProgress";

function StatusIcon({ status }: { status: TopicStatus }) {
  if (status === "completed") return <CheckCircle2 className="w-5 h-5 text-[var(--color-neon)]" />;
  if (status === "in_progress") return <CircleDot className="w-5 h-5 text-[var(--color-neon)]" />;
  return <Circle className="w-5 h-5 text-[var(--color-text-faint)]" />;
}

function PhaseSection({
  phase, defaultOpen, statusOf, index,
}: {
  phase: Phase; defaultOpen: boolean; statusOf: (id: string) => TopicStatus; index: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const topics = phase.topicIds.map(getTopic).filter((t): t is NonNullable<typeof t> => Boolean(t));
  const done = topics.filter((t) => statusOf(t.id) === "completed").length;

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-card-soft)] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[var(--color-card)] transition-colors"
      >
        <span className="w-7 h-7 rounded-lg bg-[var(--color-neon)]/10 grid place-items-center mono text-sm font-bold text-[var(--color-neon)] shrink-0">{index + 1}</span>
        <span className="flex-1 min-w-0">
          <span className="font-semibold block truncate">{phase.name}</span>
          <span className="text-[11px] text-[var(--color-text-faint)]">{phase.summary}</span>
        </span>
        <span className="mono text-[11px] text-[var(--color-text-faint)] mr-1">{done}/{topics.length}</span>
        <ChevronDown className={`w-4 h-4 text-[var(--color-text-faint)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul className="px-2 pb-2">
          {topics.map((t) => {
            const status = statusOf(t.id);
            return (
              <li key={t.id}>
                <Link
                  to={`/learn/${t.id}`}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--color-card)]"
                >
                  <StatusIcon status={status} />
                  <span className="min-w-0 flex-1">
                    <span className={`text-sm font-medium block truncate ${status === "completed" ? "text-[var(--color-text-faint)]" : "text-[var(--color-text)]"}`}>{t.name}</span>
                    <span className="text-[11px] text-[var(--color-text-faint)] block truncate">{t.blurb}</span>
                  </span>
                  {t.questions.length > 0 && (
                    <span className="mono text-[10px] text-[var(--color-text-faint)] shrink-0">{t.questions.length}Q</span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-faint)] opacity-0 group-hover:opacity-100 shrink-0" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function RoadmapView() {
  const { statusOf, stats } = useLearningProgress();
  return (
    <div className="space-y-3">
      {PHASES.map((p, i) => (
        <PhaseSection key={p.id} phase={p} index={i} statusOf={statusOf} defaultOpen={p.id === stats.currentPhase.id} />
      ))}
    </div>
  );
}
