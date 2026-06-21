import { memo } from "react";
import { Map, Github, Youtube, FileText, Target, ExternalLink, Bookmark } from "lucide-react";
import type { Resource, ResourceType } from "../../data/placement/types";

const TYPE_ICON: Record<ResourceType, typeof Map> = {
  roadmap: Map,
  repo: Github,
  video: Youtube,
  notes: FileText,
  practice: Target,
};

const TYPE_LABEL: Record<ResourceType, string> = {
  roadmap: "Roadmap",
  repo: "Repo",
  video: "Video",
  notes: "Notes",
  practice: "Practice",
};

interface Props {
  resource: Resource;
  bookmarked: boolean;
  onBookmark: () => void;
}

export const ResourceLink = memo(function ResourceLink({ resource, bookmarked, onBookmark }: Props) {
  const Icon = TYPE_ICON[resource.type] ?? FileText;
  return (
    <li className="flex items-center gap-2 group/res">
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 flex-1 min-w-0 text-sm text-[var(--color-text-faint)] hover:text-[var(--color-neon)] transition-colors py-1"
      >
        <Icon className="w-3.5 h-3.5 shrink-0 text-[var(--color-text-faint)] group-hover/res:text-[var(--color-neon)]" aria-hidden="true" />
        <span className="truncate">{resource.title}</span>
        <span className="text-[9px] uppercase tracking-wider text-[var(--color-text-faint)] shrink-0">
          {TYPE_LABEL[resource.type]}
        </span>
        <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover/res:opacity-100 text-[var(--color-text-faint)]" aria-hidden="true" />
      </a>
      <button
        type="button"
        onClick={onBookmark}
        aria-label={bookmarked ? `Remove bookmark for ${resource.title}` : `Bookmark ${resource.title}`}
        aria-pressed={bookmarked}
        className="shrink-0 p-1 rounded hover:bg-[var(--color-text)]/5 transition-colors"
      >
        <Bookmark
          className={`w-3.5 h-3.5 ${bookmarked ? "fill-[var(--color-neon)] text-[var(--color-neon)]" : "text-[var(--color-text-faint)]"}`}
          aria-hidden="true"
        />
      </button>
    </li>
  );
});
