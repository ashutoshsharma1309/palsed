// Renders a topic's learning material in the standard mentor flow (Task 1):
// Objective → Theory → Definition → Key concepts → Syntax → Example →
// (Visual: future) → Complexity → Common mistakes → Interview notes.
// Pure presentation over a Lesson object; sections render only when present.
import {
  Target, BookOpen, KeyRound, Code2, FlaskConical, Eye, Gauge,
  AlertTriangle, Lightbulb, Quote,
} from "lucide-react";
import { MarkdownView } from "./MarkdownView";
import type { Lesson } from "../../data/dsa/roadmap";

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[var(--color-neon)]">{icon}</span>
        <h4 className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)]">{title}</h4>
      </div>
      {children}
    </section>
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

const codeBlock = (code: string) => `\`\`\`cpp\n${code}\n\`\`\``;

export function LessonView({ lesson }: { lesson: Lesson }) {
  const c = lesson.complexity;
  const hasComplexity = !!(c?.best || c?.average || c?.worst || c?.space || lesson.timeComplexity || lesson.spaceComplexity);

  return (
    <div>
      <Section icon={<Target className="w-4 h-4" />} title="Objective">
        <p className="text-sm text-[var(--color-text)]">{lesson.objective}</p>
      </Section>

      <Section icon={<BookOpen className="w-4 h-4" />} title="Theory">
        <MarkdownView>{lesson.explanation}</MarkdownView>
      </Section>

      {lesson.intuition && (
        <Section icon={<Lightbulb className="w-4 h-4" />} title="Real-world intuition">
          <p className="text-sm text-[var(--color-text-dim)] italic">{lesson.intuition}</p>
        </Section>
      )}

      {lesson.definition && (
        <Section icon={<Quote className="w-4 h-4" />} title="Definition">
          <p className="text-sm text-[var(--color-text)] border-l-2 border-[var(--color-neon)]/40 pl-3">{lesson.definition}</p>
        </Section>
      )}

      {lesson.keyConcepts.length > 0 && (
        <Section icon={<KeyRound className="w-4 h-4" />} title="Key concepts">
          <div className="flex flex-wrap gap-1.5">
            {lesson.keyConcepts.map((k) => (
              <span key={k} className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-neon)]/10 text-[var(--color-neon)]">{k}</span>
            ))}
          </div>
        </Section>
      )}

      {lesson.syntax && (
        <Section icon={<Code2 className="w-4 h-4" />} title="Syntax (C++)">
          <MarkdownView>{codeBlock(lesson.syntax)}</MarkdownView>
        </Section>
      )}

      {lesson.example && (
        <Section icon={<FlaskConical className="w-4 h-4" />} title="Example (C++)">
          <MarkdownView>{codeBlock(lesson.example.code)}</MarkdownView>
          {lesson.example.explanation && (
            <p className="text-[13px] text-[var(--color-text-dim)] mt-2">{lesson.example.explanation}</p>
          )}
        </Section>
      )}

      {/* Visual intuition — future-ready slot (diagrams/animations land here). */}
      <Section icon={<Eye className="w-4 h-4" />} title="Visual intuition">
        <p className="text-[13px] text-[var(--color-text-faint)] italic">Interactive visualizations coming soon.</p>
      </Section>

      {hasComplexity && (
        <Section icon={<Gauge className="w-4 h-4" />} title="Complexity">
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            {c?.best && <Row k="Best" v={c.best} />}
            {c?.average && <Row k="Average" v={c.average} />}
            {c?.worst && <Row k="Worst" v={c.worst} />}
            {!c?.best && !c?.average && !c?.worst && lesson.timeComplexity && <Row k="Time" v={lesson.timeComplexity} />}
            {(c?.space || lesson.spaceComplexity) && <Row k="Space" v={(c?.space ?? lesson.spaceComplexity) as string} />}
          </div>
        </Section>
      )}

      {lesson.commonMistakes.length > 0 && (
        <Section icon={<AlertTriangle className="w-4 h-4" />} title="Common mistakes">
          <Bullets items={lesson.commonMistakes} />
        </Section>
      )}

      {lesson.interviewNotes.length > 0 && (
        <Section icon={<Target className="w-4 h-4" />} title="Interview notes">
          <Bullets items={lesson.interviewNotes} />
        </Section>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[var(--color-text-faint)]">{k}</span>
      <span className="mono text-[var(--color-text)]">{v}</span>
    </div>
  );
}
