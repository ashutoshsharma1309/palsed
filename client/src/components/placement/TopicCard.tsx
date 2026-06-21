import { memo } from "react";
import { Check } from "lucide-react";
import type { Topic, Difficulty } from "../../data/placement/types";
import { ResourceLink } from "./ResourceLink";

const DIFF_STYLE: Record<string, string> = {
  Easy: "text-[var(--color-mint)] border-[var(--color-mint)]/40",
  Beginner: "text-[var(--color-mint)] border-[var(--color-mint)]/40",
  Medium: "text-[var(--color-yellow)] border-[var(--color-yellow)]/40",
  Intermediate: "text-[var(--color-yellow)] border-[var(--color-yellow)]/40",
  Hard: "text-[var(--color-peach)] border-[var(--color-peach)]/40",
  Advanced: "text-[var(--color-peach)] border-[var(--color-peach)]/40",
};

function diffClass(d?: Difficulty) {
  return d ? DIFF_STYLE[d] ?? "text-[var(--color-text-faint)] border-[var(--color-line)]" : "";
}

interface Props {
  topic: Topic;
  completed: boolean;
  onToggleComplete: () => void;
  isBookmarked: (url: string) => boolean;
  onToggleBookmark: (url: string) => void;
}

export const TopicCard = memo(function TopicCard({
  topic,
  completed,
  onToggleComplete,
  isBookmarked,
  onToggleBookmark,
}: Props) {
  return (
    <article
      className={`group flex flex-col rounded-2xl border backdrop-blur-xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(200,255,61,0.12)] ${
        completed
          ? "bg-[var(--color-neon)]/[0.06] border-[var(--color-neon)]/40"
          : "bg-[var(--color-card-soft)] border-[var(--color-line)] hover:border-[var(--color-neon)]/40"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-[var(--color-text)] truncate">{topic.title}</h3>
          {topic.difficulty && (
            <span
              className={`inline-block mt-1.5 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${diffClass(
                topic.difficulty
              )}`}
            >
              {topic.difficulty}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onToggleComplete}
          aria-pressed={completed}
          aria-label={completed ? `Mark ${topic.title} as not done` : `Mark ${topic.title} as done`}
          className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
            completed
              ? "bg-[var(--color-neon)] border-[var(--color-neon)] text-black"
              : "border-[var(--color-line)] text-transparent hover:border-[var(--color-neon)]"
          }`}
        >
          <Check className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {topic.blurb && <p className="text-xs text-[var(--color-text-faint)] mb-3">{topic.blurb}</p>}

      {typeof topic.recommended === "number" && (
        <div className="mono text-[11px] text-[var(--color-neon)] mb-3">
          {topic.recommended}+ recommended problems
        </div>
      )}

      <ul className="mt-auto space-y-0.5">
        {topic.resources.map((r) => (
          <ResourceLink
            key={r.url + r.title}
            resource={r}
            bookmarked={isBookmarked(r.url)}
            onBookmark={() => onToggleBookmark(r.url)}
          />
        ))}
      </ul>
    </article>
  );
});
