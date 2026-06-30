import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { Card } from "./ui/Card";
import { Chip } from "./ui/Chip";
import { parseResourceMarkdown, ResourceDifficulty, ResourceLink, ResourceType } from "../lib/markdown";
import { Loader } from "./ui/Loader";
import { usePageMeta } from "../hooks/usePageMeta";

interface Props {
  title: string;
  tagline: string;
  mdPath: string;
  extras?: React.ReactNode;
  accent?: string;
  /** Canonical path for SEO, e.g. "/aptitude". */
  canonical?: string;
  /** Optional override for the <title>; defaults to the cleaned-up title. */
  metaTitle?: string;
}

const TYPES: ResourceType[] = ["Questions", "Tutorial", "Practice", "Guide", "Collection", "Book", "Course", "Tool"];
const DIFFS: ResourceDifficulty[] = ["Beginner", "Intermediate", "Advanced", "All Levels"];

export function ResourceLibraryPage({ title, tagline, mdPath, extras, accent = "#c8ff3d", canonical, metaTitle }: Props) {
  usePageMeta({
    title: metaTitle ?? title.replace(/\.$/, ""),
    description: tagline,
    canonical,
  });

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ categories: string[]; links: ResourceLink[] }>({
    categories: [],
    links: [],
  });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | "All">("All");
  const [type, setType] = useState<ResourceType | "All">("All");
  const [diff, setDiff] = useState<ResourceDifficulty | "All">("All");

  useEffect(() => {
    fetch(mdPath)
      .then((r) => r.text())
      .then((t) => setData(parseResourceMarkdown(t)))
      .catch(() => setData({ categories: [], links: [] }))
      .finally(() => setLoading(false));
  }, [mdPath]);

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return data.links.filter((l) => {
      if (cat !== "All" && l.category !== cat) return false;
      if (type !== "All" && l.type !== type) return false;
      if (diff !== "All" && l.difficulty !== diff) return false;
      if (qLower && !l.title.toLowerCase().includes(qLower) && !l.category.toLowerCase().includes(qLower)) return false;
      return true;
    });
  }, [data.links, q, cat, type, diff]);

  const grouped = useMemo(() => {
    const g = new Map<string, ResourceLink[]>();
    filtered.forEach((l) => {
      if (!g.has(l.category)) g.set(l.category, []);
      g.get(l.category)!.push(l);
    });
    return Array.from(g.entries());
  }, [filtered]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <header className="mb-10">
        <h1 className="display text-5xl sm:text-7xl mb-3" style={{ color: accent, textShadow: `0 0 30px ${accent}55` }}>
          {title}
        </h1>
        <p className="text-[var(--color-text-faint)] max-w-2xl text-lg">{tagline}</p>
        <div className="mt-4 mono text-xs text-[var(--color-text-faint)] uppercase tracking-widest">
          {data.links.length} curated resources
        </div>
      </header>

      {extras}

      <Card className="my-8">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-[var(--color-text-faint)]" />
          <input
            className="flex-1 bg-transparent outline-none text-[var(--color-text)] placeholder:text-[var(--color-text-faint)]"
            placeholder="Search resources…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <FilterRow label="Category">
            <Chip tone="neon" active={cat === "All"} onClick={() => setCat("All")}>All</Chip>
            {data.categories.map((c) => (
              <Chip key={c} tone="neon" active={cat === c} onClick={() => setCat(c)}>
                {c}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label="Type">
            <Chip active={type === "All"} onClick={() => setType("All")}>All</Chip>
            {TYPES.map((t) => (
              <Chip key={t} active={type === t} onClick={() => setType(t)}>
                {t}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label="Difficulty">
            <Chip active={diff === "All"} onClick={() => setDiff("All")}>All</Chip>
            {DIFFS.map((d) => (
              <Chip key={d} active={diff === d} onClick={() => setDiff(d)}>
                {d}
              </Chip>
            ))}
          </FilterRow>
        </div>
      </Card>

      {loading ? (
        <Loader label="Loading resources" />
      ) : grouped.length === 0 ? (
        <div className="text-[var(--color-text-faint)] text-center py-20">No resources match these filters.</div>
      ) : (
        <div className="space-y-10">
          {grouped.map(([category, links]) => (
            <section key={category}>
              <h2 className="display text-3xl mb-4">{category}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {links.map((l, i) => (
                  <a
                    key={l.url + i}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-base p-5 hover:border-[var(--color-neon)] transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-neon)] line-clamp-2">
                        {l.title}
                      </span>
                      <ExternalLink className="w-4 h-4 text-[var(--color-text-faint)] group-hover:text-[var(--color-neon)] shrink-0" />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider bg-[var(--color-neon)]/10 text-[var(--color-neon)] px-2 py-0.5 rounded">
                        {l.type}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider bg-white/5 text-[var(--color-text-faint)] px-2 py-0.5 rounded">
                        {l.difficulty}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-1.5 mono">{label}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
