import { memo } from "react";
import {
  Code2, Binary, ListChecks, Globe, LineChart, Sparkles,
  Smartphone, Calculator, Cpu, MessagesSquare, BookOpen, type LucideIcon,
} from "lucide-react";
import type { HubSection } from "../../data/placement/types";
import { ProgressBar } from "../ui/ProgressBar";
import { TopicCard } from "./TopicCard";

const ICONS: Record<string, LucideIcon> = {
  Code2, Binary, ListChecks, Globe, LineChart, Sparkles,
  Smartphone, Calculator, Cpu, MessagesSquare,
};

interface Props {
  section: HubSection;
  isComplete: (topicId: string) => boolean;
  onToggleComplete: (topicId: string) => void;
  isBookmarked: (url: string) => boolean;
  onToggleBookmark: (url: string) => void;
}

export const HubSectionView = memo(function HubSectionView({
  section, isComplete, onToggleComplete, isBookmarked, onToggleBookmark,
}: Props) {
  const Icon = ICONS[section.icon] ?? BookOpen;
  const accent = section.accent ?? "#c8ff3d";
  const done = section.topics.filter((t) => isComplete(t.id)).length;
  const total = section.topics.length;

  return (
    <section id={section.id} className="scroll-mt-24">
      <div className="flex items-start gap-4 mb-5">
        <div
          className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border backdrop-blur-xl"
          style={{ background: `${accent}14`, borderColor: `${accent}55`, color: accent }}
        >
          <Icon className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="display text-3xl sm:text-4xl" style={{ color: accent }}>
            {section.title}
          </h2>
          <p className="text-[var(--color-text-faint)] text-sm mt-1">{section.blurb}</p>
        </div>
        <div className="hidden sm:block w-40 shrink-0 pt-1">
          <ProgressBar value={total ? done / total : 0} color={accent} label={`${done}/${total}`} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {section.topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            completed={isComplete(topic.id)}
            onToggleComplete={() => onToggleComplete(topic.id)}
            isBookmarked={isBookmarked}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </div>
    </section>
  );
});
