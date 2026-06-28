// Renders a topic's learning material — concise and practical (Task 4): objective,
// explanation, key concepts, interview notes, common mistakes, complexity, and
// real-world intuition. Pure presentation over a Lesson object.
import { Target, KeyRound, MessageSquareWarning, AlertTriangle, Lightbulb, Gauge } from "lucide-react";
import { MarkdownView } from "./MarkdownView";
import type { Lesson } from "../../data/dsa/roadmap";

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[var(--color-neon)]">{icon}</span>
        <h4 className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)]">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((s, i) => (
        <li key={i} className="text-sm text-[var(--color-text-dim)] flex gap-2">
          <span className="text-[var(--color-neon)] shrink-0">·</span>
          <span>{s}</span>
        </li>
      ))}
    </ul>
  );
}

export function LessonView({ lesson }: { lesson: Lesson }) {
  return (
    <div>
      <Section icon={<Target className="w-4 h-4" />} title="Objective">
        <p className="text-sm text-[var(--color-text)]">{lesson.objective}</p>
      </Section>

      <Section icon={<MessageSquareWarning className="w-4 h-4" />} title="Explanation">
        <MarkdownView>{lesson.explanation}</MarkdownView>
      </Section>

      {lesson.intuition && (
        <Section icon={<Lightbulb className="w-4 h-4" />} title="Real-world intuition">
          <p className="text-sm text-[var(--color-text-dim)] italic">{lesson.intuition}</p>
        </Section>
      )}

      {lesson.keyConcepts.length > 0 && (
        <Section icon={<KeyRound className="w-4 h-4" />} title="Key concepts">
          <div className="flex flex-wrap gap-1.5">
            {lesson.keyConcepts.map((c) => (
              <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-neon)]/10 text-[var(--color-neon)]">{c}</span>
            ))}
          </div>
        </Section>
      )}

      {lesson.interviewNotes.length > 0 && (
        <Section icon={<Target className="w-4 h-4" />} title="Interview notes">
          <Bullets items={lesson.interviewNotes} />
        </Section>
      )}

      {lesson.commonMistakes.length > 0 && (
        <Section icon={<AlertTriangle className="w-4 h-4" />} title="Common mistakes">
          <Bullets items={lesson.commonMistakes} />
        </Section>
      )}

      {(lesson.timeComplexity || lesson.spaceComplexity) && (
        <Section icon={<Gauge className="w-4 h-4" />} title="Complexity">
          <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-dim)]">
            {lesson.timeComplexity && <span>⏱ Time: <span className="mono text-[var(--color-text)]">{lesson.timeComplexity}</span></span>}
            {lesson.spaceComplexity && <span>💾 Space: <span className="mono text-[var(--color-text)]">{lesson.spaceComplexity}</span></span>}
          </div>
        </Section>
      )}
    </div>
  );
}
