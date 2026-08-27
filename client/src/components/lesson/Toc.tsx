// Table of contents with scroll-spy. Discovers lesson sections generically by
// scanning for [data-toc-title] elements (set by LessonArticle), so it works
// for any domain/lesson with zero per-lesson config. Highlights the section
// currently in view via IntersectionObserver.
import { useEffect, useState } from "react";

interface Entry {
  id: string;
  title: string;
}

export function Toc({ lessonId }: { lessonId: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-toc-title]"));
    const found = nodes
      .filter((n) => n.id)
      .map((n) => ({ id: n.id, title: n.dataset.tocTitle ?? n.id }));
    setEntries(found);
    if (found.length) setActive(found[0].id);

    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (obs) => {
        const visible = obs
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [lessonId]);

  if (entries.length < 2) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <div className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)] mb-3">On this page</div>
      <ul className="space-y-1 border-l border-[var(--color-line)]">
        {entries.map((e) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              className={`block -ml-px border-l-2 pl-3 py-1 transition-colors ${
                active === e.id
                  ? "border-[var(--color-neon-text)] text-[var(--color-text)]"
                  : "border-transparent text-[var(--color-text-faint)] hover:text-[var(--color-text-dim)]"
              }`}
            >
              {e.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
