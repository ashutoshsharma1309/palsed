// Hackathon Roadmap — a long-form, beginner-friendly guide rendered from
// public/hackathon.md. Reuses the app's existing building blocks (AccordionItem,
// MarkdownView, Loader) and page shell — no new design or styling introduced.
//
// The markdown is split on top-level "## " headings so each of the 18 sections
// becomes a collapsible accordion, matching the expandable pattern used
// elsewhere (DSA, Roadmap).
import { useEffect, useMemo, useState } from "react";
import { Rocket } from "lucide-react";
import { AccordionItem } from "../components/dsa/Accordion";
import { MarkdownView } from "../components/lesson/MarkdownView";
import { Loader } from "../components/ui/Loader";
import { usePageMeta } from "../hooks/usePageMeta";

interface Section {
  title: string;
  body: string;
}

function parseSections(md: string): Section[] {
  // Drop the leading "## " of the first section, then split on each "\n## ".
  const normalized = md.trim().replace(/^##\s+/, "");
  return normalized
    .split(/\n##\s+/)
    .map((chunk) => {
      const nl = chunk.indexOf("\n");
      const title = (nl === -1 ? chunk : chunk.slice(0, nl)).trim();
      const body = (nl === -1 ? "" : chunk.slice(nl + 1)).trim();
      return { title, body };
    })
    .filter((s) => s.title);
}

export default function Hackathon() {
  usePageMeta({
    title: "Hackathon Roadmap",
    description:
      "A practical, beginner-friendly guide that takes you from your first hackathon to confidently competing and winning — finding events, teams, problem statements, building, demoing, and judging.",
    canonical: "/hackathon",
  });

  const [md, setMd] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/hackathon.md")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .then((t) => active && setMd(t))
      .catch(() => active && setError(true));
    return () => {
      active = false;
    };
  }, []);

  const sections = useMemo(() => (md ? parseSections(md) : []), [md]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <header className="mb-8">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-3">
          · hackathon roadmap ·
        </div>
        <h1 className="display text-5xl sm:text-7xl">HACKATHONS.</h1>
        <p className="text-[var(--color-text-faint)] max-w-2xl mt-3 text-lg">
          From your very first hackathon to confidently competing and winning — finding events,
          building a team, picking the right problem, shipping an MVP, and nailing the demo.
        </p>
        {sections.length > 0 && (
          <p className="mono text-[11px] text-[var(--color-text-faint)] mt-3">
            {sections.length} sections · tap any to expand
          </p>
        )}
      </header>

      {error && (
        <div className="text-sm text-[var(--color-text-dim)]">
          Couldn't load the guide. Please refresh.
        </div>
      )}

      {!md && !error && (
        <div className="py-24">
          <Loader label="Loading guide" />
        </div>
      )}

      {sections.length > 0 && (
        <div className="space-y-3">
          {sections.map((s, i) => (
            <AccordionItem
              key={s.title}
              defaultOpen={i === 0}
              icon={<span className="mono text-sm font-bold">{i + 1}</span>}
              title={s.title.replace(/^\d+\.\s*/, "")}
            >
              <MarkdownView>{s.body}</MarkdownView>
            </AccordionItem>
          ))}
        </div>
      )}

      <div className="mt-10 flex items-center gap-2 text-[var(--color-text-faint)] text-sm">
        <Rocket className="w-4 h-4 text-[var(--color-neon)]" />
        Ship one thing that works, practice the demo, and show up — that's how you win.
      </div>
    </div>
  );
}
