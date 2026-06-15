import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Chip } from "../components/ui/Chip";
import { INTERNSHIP_BOARDS, BOARD_CATEGORIES, BoardCategory, BoardTier } from "../data/internship-boards";

const REGIONS = ["India","Global","US","Europe","APAC","Remote-OK"] as const;
const TIERS: BoardTier[] = ["free","freemium","paid"];

const TIER_COLOR: Record<BoardTier, string> = {
  free: "#c8ff3d",
  freemium: "#ffe87a",
  paid: "#ff8a7a",
};

export default function Internships() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<BoardCategory | "All">("All");
  const [region, setRegion] = useState<(typeof REGIONS)[number] | "All">("All");
  const [tier, setTier] = useState<BoardTier | "All">("All");

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return INTERNSHIP_BOARDS.filter((b) => {
      if (cat !== "All" && b.category !== cat) return false;
      if (region !== "All" && !b.region.includes(region)) return false;
      if (tier !== "All" && b.tier !== tier) return false;
      if (qq && ![b.name, b.description, b.focus.join(" "), b.tip || ""].join(" ").toLowerCase().includes(qq)) return false;
      return true;
    });
  }, [q, cat, region, tier]);

  const grouped = useMemo(() => {
    const g = new Map<BoardCategory, typeof INTERNSHIP_BOARDS>();
    filtered.forEach((b) => {
      if (!g.has(b.category)) g.set(b.category, []);
      g.get(b.category)!.push(b);
    });
    // preserve canonical order
    return BOARD_CATEGORIES
      .map((c) => [c, g.get(c)] as const)
      .filter(([, arr]) => arr && arr.length > 0);
  }, [filtered]);

  const totalCount = INTERNSHIP_BOARDS.length;
  const freeCount = INTERNSHIP_BOARDS.filter((b) => b.tier === "free").length;
  const indiaCount = INTERNSHIP_BOARDS.filter((b) => b.region.includes("India")).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <header className="mb-10">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// internships hub</div>
        <h1 className="display text-5xl sm:text-7xl">WHERE TO APPLY.</h1>
        <p className="text-white/60 mt-3 max-w-2xl">
          {totalCount} curated platforms for finding internships and entry-level jobs —
          India boards, global startups, research programs, AI labs, remote-first, hackathons,
          and salary benchmarks. {freeCount} are free.
        </p>
        <div className="flex flex-wrap gap-3 mt-5 text-xs">
          <span className="px-3 py-1 rounded-full bg-[var(--color-neon)]/15 text-[var(--color-neon)] mono">
            {totalCount} platforms
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 text-white/70 mono">
            {indiaCount} India-focused
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 text-white/70 mono">
            {BOARD_CATEGORIES.length} categories
          </span>
        </div>
      </header>

      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-white/40" />
          <input
            className="flex-1 bg-transparent outline-none placeholder-white/30"
            placeholder="Search platforms, tags, descriptions…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <Row label="Category">
            <Chip tone="neon" active={cat === "All"} onClick={() => setCat("All")}>All</Chip>
            {BOARD_CATEGORIES.map((c) => (
              <Chip key={c} tone="neon" active={cat === c} onClick={() => setCat(c)}>{c}</Chip>
            ))}
          </Row>
          <Row label="Region">
            <Chip active={region === "All"} onClick={() => setRegion("All")}>All</Chip>
            {REGIONS.map((r) => (
              <Chip key={r} active={region === r} onClick={() => setRegion(r)}>{r}</Chip>
            ))}
          </Row>
          <Row label="Pricing">
            <Chip active={tier === "All"} onClick={() => setTier("All")}>All</Chip>
            {TIERS.map((t) => (
              <Chip key={t} active={tier === t} onClick={() => setTier(t)}>{t}</Chip>
            ))}
          </Row>
        </div>
      </Card>

      <div className="text-xs text-white/40 mono mb-4">
        Showing {filtered.length} / {totalCount}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-white/40">No platforms match. Try clearing filters.</div>
      ) : (
        <div className="space-y-10">
          {grouped.map(([category, items]) => (
            <section key={category}>
              <h2 className="display text-3xl mb-1">{category}</h2>
              <div className="mono text-xs text-white/40 mb-4">{items!.length} platform{items!.length === 1 ? "" : "s"}</div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items!.map((b, i) => (
                  <a
                    key={category + i + b.name}
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-base p-5 hover:border-[var(--color-neon)] transition-colors group flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="font-bold text-base group-hover:text-[var(--color-neon)]">{b.name}</div>
                      <ExternalLink className="w-3 h-3 text-white/30 group-hover:text-[var(--color-neon)] shrink-0 mt-1" />
                    </div>
                    <div className="text-xs text-white/70 mb-3 flex-1">{b.description}</div>
                    {b.tip && (
                      <div className="text-xs border-l-2 border-[var(--color-neon)]/40 pl-2 mb-3 italic text-white/60">
                        💡 {b.tip}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {b.focus.slice(0, 4).map((f) => (
                        <span key={f} className="text-[10px] mono px-1.5 py-0.5 rounded bg-white/5 text-white/60">#{f}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] mono uppercase tracking-widest">
                      <span style={{ color: TIER_COLOR[b.tier] }}>{b.tier}</span>
                      <span className="text-white/40">·</span>
                      <span className="text-white/60">{b.region.join(" · ")}</span>
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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mono text-[10px] uppercase tracking-widest text-white/40 mb-1.5">{label}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}
