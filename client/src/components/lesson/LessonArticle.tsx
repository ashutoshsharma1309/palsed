// Renders a content-engine Lesson (any domain) as a comfortable long-form
// article. Every major section is an anchored <section data-toc-title> so the
// Table of Contents can discover and scroll-spy them generically. Sections
// render only when their field is present. Pure presentation.
import {
  Target, BookOpen, KeyRound, Code2, FlaskConical, Gauge,
  AlertTriangle, Lightbulb, Quote, Sparkles, Rocket, RefreshCw,
} from "lucide-react";
import { MarkdownView } from "./MarkdownView";
import { LessonVisual } from "./LessonVisual";
import { Quiz } from "./Quiz";
import { QuestionCard } from "../question/QuestionCard";
import type { Lesson, CodeLang } from "../../content/types";
import type { Difficulty } from "../../data/dsa/roadmap";

const PRACTICE_ORDER: Difficulty[] = ["Easy", "Medium", "Hard"];

function fence(code: string, lang: CodeLang = "text") {
  return `\`\`\`${lang}\n${code}\n\`\`\``;
}

function Section({
  id, icon, title, children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} data-toc-title={title} className="scroll-mt-24 mb-10">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[var(--color-neon-text)]">{icon}</span>
        <h2 className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((s, i) => (
        <li key={i} className="text-[15px] leading-relaxed text-[var(--color-text-dim)] flex gap-2.5">
          <span className="text-[var(--color-neon-text)] shrink-0 mt-0.5">·</span>
          <span>{s}</span>
        </li>
      ))}
    </ul>
  );
}

export function LessonArticle({ lesson }: { lesson: Lesson }) {
  const lang = lesson.language ?? "text";
  const c = lesson.complexity;

  return (
    <article className="reading-surface">
      <Section id="sec-objective" icon={<Target className="w-4 h-4" />} title="Objective">
        <p className="text-lg leading-relaxed text-[var(--color-text)]">{lesson.objective}</p>
      </Section>

      <Section id="sec-theory" icon={<BookOpen className="w-4 h-4" />} title="Theory">
        <MarkdownView>{lesson.theory}</MarkdownView>
      </Section>

      {lesson.intuition && (
        <Section id="sec-intuition" icon={<Lightbulb className="w-4 h-4" />} title="Real-world intuition">
          <p className="text-[15px] leading-relaxed text-[var(--color-text-dim)] italic border-l-2 border-[var(--color-neon-text)]/40 pl-4">
            {lesson.intuition}
          </p>
        </Section>
      )}

      {lesson.definitions && lesson.definitions.length > 0 && (
        <Section id="sec-definitions" icon={<Quote className="w-4 h-4" />} title="Key definitions">
          <dl className="space-y-3">
            {lesson.definitions.map((d) => (
              <div key={d.term} className="border-l-2 border-[var(--color-line)] pl-4">
                <dt className="font-semibold text-[var(--color-text)]">{d.term}</dt>
                <dd className="text-[15px] leading-relaxed text-[var(--color-text-dim)]">{d.meaning}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {lesson.keyConcepts && lesson.keyConcepts.length > 0 && (
        <Section id="sec-concepts" icon={<KeyRound className="w-4 h-4" />} title="Key concepts">
          <div className="flex flex-wrap gap-2">
            {lesson.keyConcepts.map((k) => (
              <span key={k} className="text-xs px-3 py-1 rounded-full bg-[var(--color-neon)]/10 text-[var(--color-neon-text)]">{k}</span>
            ))}
          </div>
        </Section>
      )}

      {lesson.syntax && (
        <Section id="sec-syntax" icon={<Code2 className="w-4 h-4" />} title="Syntax">
          <MarkdownView>{fence(lesson.syntax, lang)}</MarkdownView>
        </Section>
      )}

      {lesson.example && (
        <Section id="sec-example" icon={<FlaskConical className="w-4 h-4" />} title="Example">
          <MarkdownView>{fence(lesson.example.code, lesson.example.language ?? lang)}</MarkdownView>
          {lesson.example.explanation && (
            <div className="text-[15px] leading-relaxed text-[var(--color-text-dim)] mt-3">
              <MarkdownView>{lesson.example.explanation}</MarkdownView>
            </div>
          )}
        </Section>
      )}

      {lesson.visual && (
        <Section id="sec-visual" icon={<Sparkles className="w-4 h-4" />} title="Visual intuition">
          <LessonVisual spec={lesson.visual} />
        </Section>
      )}

      {c && (c.time || c.space || c.notes) && (
        <Section id="sec-complexity" icon={<Gauge className="w-4 h-4" />} title="Complexity">
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-[15px]">
            {c.time && <Row k="Time" v={c.time} />}
            {c.space && <Row k="Space" v={c.space} />}
          </div>
          {c.notes && <p className="text-[13px] text-[var(--color-text-faint)] mt-2">{c.notes}</p>}
        </Section>
      )}

      {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
        <Section id="sec-mistakes" icon={<AlertTriangle className="w-4 h-4" />} title="Common mistakes">
          <Bullets items={lesson.commonMistakes} />
        </Section>
      )}

      {lesson.optimization && lesson.optimization.length > 0 && (
        <Section id="sec-optimization" icon={<Rocket className="w-4 h-4" />} title="Optimization notes">
          <Bullets items={lesson.optimization} />
        </Section>
      )}

      {lesson.tips && lesson.tips.length > 0 && (
        <Section id="sec-tips" icon={<Target className="w-4 h-4" />} title="Interview & industry tips">
          <Bullets items={lesson.tips} />
        </Section>
      )}

      {lesson.quiz && lesson.quiz.length > 0 && (
        <Section id="sec-quiz" icon={<Sparkles className="w-4 h-4" />} title="Check your understanding">
          <Quiz lessonId={lesson.id} questions={lesson.quiz} />
        </Section>
      )}

      {lesson.practice && lesson.practice.length > 0 && (
        <Section id="sec-practice" icon={<FlaskConical className="w-4 h-4" />} title="Practice">
          <div className="space-y-6">
            {PRACTICE_ORDER.map((d) => {
              const items = lesson.practice!.filter((q) => q.difficulty === d);
              if (!items.length) return null;
              return (
                <div key={d}>
                  <div className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)] mb-3">{d}</div>
                  <div className="space-y-3">
                    {items.map((q) => <QuestionCard key={q.id} q={q} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {lesson.revision && lesson.revision.length > 0 && (
        <Section id="sec-revision" icon={<RefreshCw className="w-4 h-4" />} title="Revision summary">
          <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-5">
            <Bullets items={lesson.revision} />
          </div>
        </Section>
      )}
    </article>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--color-line)] py-1.5">
      <span className="text-[var(--color-text-faint)]">{k}</span>
      <span className="mono text-[var(--color-text)]">{v}</span>
    </div>
  );
}
