import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Chip } from "../components/ui/Chip";
import { CompanyTile } from "../components/CompanyTile";
import { COMPANIES, COMPANY_TIERS, CompanyTier } from "../data/companies";
import { usePageMeta } from "../hooks/usePageMeta";
import { useStudentProfile, checkEligibility } from "../hooks/useStudentProfile";
import { EligibilityBar } from "../components/EligibilityBar";

const SORT_OPTIONS = ["Default", "CTC ↓", "Difficulty ↓", "Difficulty ↑", "A → Z"] as const;
type Sort = typeof SORT_OPTIONS[number];

export default function Companies() {
  usePageMeta({
    title: "Top recruiters for campus placements",
    description: "Browse 75+ recruiters with eligibility, CTC, interview rounds, OA platforms, and topics asked. Curated for Indian engineering students.",
    canonical: "/companies",
  });

  const [q, setQ] = useState("");
  const [tier, setTier] = useState<CompanyTier | "All">("All");
  const [location, setLocation] = useState<string | "All">("All");
  const [sort, setSort] = useState<Sort>("Default");
  const { profile } = useStudentProfile();

  const locations = useMemo(() => {
    const s = new Set<string>();
    COMPANIES.forEach((c) => c.indianOffices.forEach((l) => s.add(l)));
    return Array.from(s).sort();
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    let arr = COMPANIES.filter((c) => {
      if (tier !== "All" && c.tier !== tier) return false;
      if (location !== "All" && !c.indianOffices.includes(location)) return false;
      if (qq && ![c.name, c.sector, c.indianOffices.join(" "), c.rolesOffered.join(" ")].join(" ").toLowerCase().includes(qq)) return false;
      if (profile.filterEnabled && !checkEligibility(profile, c).ok) return false;
      return true;
    });
    switch (sort) {
      case "CTC ↓": arr = [...arr].sort((a, b) => b.ctcBand.typical - a.ctcBand.typical); break;
      case "Difficulty ↓": arr = [...arr].sort((a, b) => b.difficulty - a.difficulty); break;
      case "Difficulty ↑": arr = [...arr].sort((a, b) => a.difficulty - b.difficulty); break;
      case "A → Z": arr = [...arr].sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return arr;
  }, [q, tier, location, sort]);

  const tierCounts = useMemo(() => {
    const m: Record<string, number> = { All: COMPANIES.length };
    COMPANY_TIERS.forEach((t) => (m[t] = COMPANIES.filter((c) => c.tier === t).length));
    return m;
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <header className="mb-8">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// companies</div>
        <h1 className="display text-5xl sm:text-7xl">RECRUITER MAP.</h1>
        <p className="text-[var(--color-text-faint)] mt-2 max-w-2xl">
          50 top recruiters for Indian campus placements — eligibility, hiring windows, packages,
          rounds, topics asked, and tips from previous offer-holders. Click any company for the full
          prep kit + previous-year questions.
        </p>
      </header>

      <EligibilityBar />

      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-[var(--color-text-faint)]" />
          <input
            className="flex-1 bg-transparent outline-none placeholder:text-[var(--color-text-faint)]"
            placeholder="Search by name, sector, location, role…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <Row label="Tier">
            <Chip tone="neon" active={tier === "All"} onClick={() => setTier("All")}>
              All <span className="text-[10px] opacity-60 ml-1">{tierCounts.All}</span>
            </Chip>
            {COMPANY_TIERS.map((t) => (
              <Chip key={t} tone="neon" active={tier === t} onClick={() => setTier(t)}>
                {t} <span className="text-[10px] opacity-60 ml-1">{tierCounts[t]}</span>
              </Chip>
            ))}
          </Row>
          <Row label="Indian office">
            <Chip active={location === "All"} onClick={() => setLocation("All")}>All</Chip>
            {locations.map((l) => (
              <Chip key={l} active={location === l} onClick={() => setLocation(l)}>{l}</Chip>
            ))}
          </Row>
          <Row label="Sort">
            {SORT_OPTIONS.map((s) => (
              <Chip key={s} tone="neon" active={sort === s} onClick={() => setSort(s)}>{s}</Chip>
            ))}
          </Row>
        </div>
      </Card>

      <div className="text-xs text-[var(--color-text-faint)] mono mb-4">
        Showing {filtered.length} / {COMPANIES.length}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-[var(--color-text-faint)]">No companies match. Try clearing filters.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => <CompanyTile key={c.id} c={c} />)}
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-1.5">{label}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}
