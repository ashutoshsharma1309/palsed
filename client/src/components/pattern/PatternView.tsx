// Renders a coding Pattern in the standard structure (Task 2):
// Definition → Why useful → Recognition clues → When to use → When NOT to use →
// (Visual: future) → Example → Interview notes. Pure presentation.
import { Quote, Sparkles, Code2, Search, Check, Ban, Target } from "lucide-react";
import { MarkdownView } from "../lesson/MarkdownView";
import type { Pattern } from "../../data/patterns/patterns";

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

function Bullets({ items, tone = "neutral" }: { items: string[]; tone?: "neutral" | "good" | "bad" }) {
  const dot = tone === "good" ? "text-[var(--color-neon)]" : tone === "bad" ? "text-[var(--severity-warn-text,#f59e0b)]" : "text-[var(--color-neon)]";
  const mark = tone === "good" ? "✓" : tone === "bad" ? "✕" : "·";
  return (
    <ul className="space-y-1.5">
      {items.map((s, i) => (
        <li key={i} className="text-sm text-[var(--color-text-dim)] flex gap-2">
          <span className={`${dot} shrink-0`}>{mark}</span>
          <span>{s}</span>
        </li>
      ))}
    </ul>
  );
}

export function PatternView({ pattern: p }: { pattern: Pattern }) {
  return (
    <div>
      <Section icon={<Quote className="w-4 h-4" />} title="Definition">
        <p className="text-sm text-[var(--color-text)] border-l-2 border-[var(--color-neon)]/40 pl-3">{p.definition}</p>
      </Section>

      <Section icon={<Sparkles className="w-4 h-4" />} title="Why it's useful">
        <p className="text-sm text-[var(--color-text-dim)]">{p.why}</p>
      </Section>

      <Section icon={<Search className="w-4 h-4" />} title="Recognition clues">
        <Bullets items={p.recognitionClues} />
      </Section>

      <div className="grid sm:grid-cols-2 gap-x-6">
        <Section icon={<Check className="w-4 h-4" />} title="When to use">
          <Bullets items={p.whenToUse} tone="good" />
        </Section>
        <Section icon={<Ban className="w-4 h-4" />} title="When NOT to use">
          <Bullets items={p.whenNotToUse} tone="bad" />
        </Section>
      </div>

      <Section icon={<Code2 className="w-4 h-4" />} title="Example (C++)">
        <MarkdownView>{`\`\`\`cpp\n${p.example.code}\n\`\`\``}</MarkdownView>
        {p.example.explanation && (
          <p className="text-[13px] text-[var(--color-text-dim)] mt-2">{p.example.explanation}</p>
        )}
      </Section>

      {p.interviewNotes.length > 0 && (
        <Section icon={<Target className="w-4 h-4" />} title="Interview notes">
          <Bullets items={p.interviewNotes} />
        </Section>
      )}
    </div>
  );
}
