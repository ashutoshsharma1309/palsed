// Per-topic learning checklist. Each item persists; completing one counts as
// learning activity (extends the streak via the central store).
import { Circle, CheckCircle2 } from "lucide-react";
import { useChecklist } from "../../hooks/useChecklist";
import { ProgressBar } from "../ui/ProgressBar";

export function Checklist({ topicId }: { topicId: string }) {
  const { items, isChecked, toggle, completedCount, total } = useChecklist(topicId);
  if (!items.length) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)]">Checklist</h4>
        <span className="mono text-[11px] text-[var(--color-text-faint)]">{completedCount}/{total}</span>
      </div>
      <div className="mb-4"><ProgressBar value={total ? completedCount / total : 0} /></div>
      <ul className="space-y-1.5">
        {items.map((it) => {
          const done = isChecked(it.id);
          return (
            <li key={it.id}>
              <button
                onClick={() => toggle(it.id)}
                className="w-full flex items-center gap-3 text-left rounded-lg px-2 py-1.5 hover:bg-[var(--color-card)]"
                aria-pressed={done}
              >
                {done ? (
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-neon)] shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-[var(--color-text-faint)] shrink-0" />
                )}
                <span className={`text-sm ${done ? "line-through text-[var(--color-text-faint)]" : "text-[var(--color-text)]"}`}>
                  {it.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
