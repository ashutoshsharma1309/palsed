import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Plus, X, Sparkles, IndianRupee, Star, Calendar, MapPin, Lock, ChevronRight } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { COMPANIES, getCompany } from "../data/companies";
import { usePageMeta } from "../hooks/usePageMeta";

// Side-by-side company comparison — pick up to 3 (4th locked behind Pro).
// Highlights deltas visually: better CTC = neon, harder = red, etc.
// URL state: /compare?a=razorpay&b=stripe → shareable links.

const MAX_FREE = 3;

export default function Compare() {
  usePageMeta({
    title: "Compare placement offers — Companies side-by-side",
    description: "Compare any 2-3 recruiters side-by-side: CTC, eligibility, interview rounds, difficulty, hiring window. Pick smarter.",
    canonical: "/compare",
  });

  const [params, setParams] = useSearchParams();
  const initial = ["a", "b", "c", "d"].map((k) => params.get(k)).filter(Boolean) as string[];
  const [slugs, setSlugs] = useState<string[]>(initial.length > 0 ? initial : []);
  const [picker, setPicker] = useState("");

  const companies = useMemo(
    () => slugs.map((s) => getCompany(s)).filter(Boolean) as ReturnType<typeof getCompany>[],
    [slugs]
  );

  const updateUrl = (next: string[]) => {
    const p: Record<string, string> = {};
    next.forEach((s, i) => (p[String.fromCharCode(97 + i)] = s));
    setParams(p);
  };

  const add = (slug: string) => {
    if (!slug || slugs.includes(slug)) return;
    if (slugs.length >= MAX_FREE) return;
    const next = [...slugs, slug];
    setSlugs(next);
    updateUrl(next);
    setPicker("");
  };

  const remove = (slug: string) => {
    const next = slugs.filter((s) => s !== slug);
    setSlugs(next);
    updateUrl(next);
  };

  // Compute the "winner" per metric for highlighting
  const winners = useMemo(() => {
    if (companies.length < 2) return { ctc: null, ease: null, cgpa: null } as any;
    // Only consider verified CTCs when picking the "best" — refuse to crown
    // unverified numbers.
    const verifiedCompanies = companies.filter((c) => c!.verified);
    const bestCtc = verifiedCompanies.length > 0
      ? verifiedCompanies.reduce((acc, c) => (c!.ctcBand.typical > (acc?.ctcBand.typical ?? -1) ? c : acc), verifiedCompanies[0])
      : null;
    const easiest = companies.reduce((acc, c) => (c!.difficulty < (acc?.difficulty ?? 999) ? c : acc), companies[0]);
    const lowestCgpa = companies.reduce(
      (acc, c) => ((c!.eligibility.minCgpa ?? 99) < (acc?.eligibility.minCgpa ?? 99) ? c : acc),
      companies[0]
    );
    return {
      ctc: bestCtc?.slug,
      ease: easiest?.slug,
      cgpa: lowestCgpa?.slug,
    };
  }, [companies]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <header className="mb-6">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// compare</div>
        <h1 className="display text-5xl sm:text-6xl">SIDE-BY-SIDE.</h1>
        <p className="text-[var(--color-text-dim)] mt-2 max-w-2xl">
          Pick 2-3 recruiters. See deltas at a glance — CTC, eligibility, rounds, difficulty,
          hiring window. Best ones highlighted.
        </p>
      </header>

      {/* PICKER */}
      <Card className="mb-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {slugs.map((s) => {
              const c = getCompany(s);
              return (
                <Chip key={s} tone="neon" active>
                  {c?.name || s}
                  <button onClick={() => remove(s)} className="ml-1 -mr-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </Chip>
              );
            })}
            {slugs.length < MAX_FREE && (
              <select
                value={picker}
                onChange={(e) => add(e.target.value)}
                className="bg-[var(--color-card-soft)] border border-[var(--color-line)] rounded-full px-3 py-1.5 text-xs outline-none focus:border-[var(--color-neon)]"
              >
                <option value="">+ Add company</option>
                {COMPANIES.filter((c) => !slugs.includes(c.slug)).map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            )}
          </div>
          <span className="text-[11px] text-[var(--color-text-faint)] mono">
            {slugs.length}/{MAX_FREE} on free · <Link to="/pricing" className="text-[var(--color-neon)] underline">Pro for 6+</Link>
          </span>
        </div>
      </Card>

      {companies.length === 0 ? (
        <Card className="text-center py-16">
          <Sparkles className="w-10 h-10 text-[var(--color-neon)] mx-auto mb-3" />
          <div className="display text-2xl mb-2">Pick 2 companies to start.</div>
          <p className="text-[var(--color-text-dim)] text-sm max-w-md mx-auto">
            Useful when you've got multiple shortlists and need to know which to prioritize for
            prep + which one to negotiate with.
          </p>
        </Card>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0 mb-6">
          <div className="min-w-[680px] sm:min-w-0 grid gap-4 px-4 sm:px-0" style={{ gridTemplateColumns: `repeat(${companies.length}, minmax(0, 1fr))` }}>
            {companies.map((c) => (
              <Card key={c!.id} className="!p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 display text-2xl"
                    style={{ background: c!.brandColor || "#1a1a1a", color: c!.brandColor ? "#fff" : "#c8ff3d" }}
                  >
                    {c!.logoLetter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/companies/${c!.slug}`} className="font-bold truncate block hover:text-[var(--color-neon)]">
                      {c!.name}
                    </Link>
                    <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">{c!.tier}</div>
                  </div>
                </div>

                <Row label="CTC (typical)" highlight={winners.ctc === c!.slug}>
                  {c!.verified ? (
                    <>
                      <IndianRupee className="w-3 h-3" />
                      {c!.ctcBand.typical} LPA
                    </>
                  ) : (
                    <span className="text-[var(--color-text-faint)]">unverified</span>
                  )}
                </Row>
                <Row label="CTC range">
                  {c!.verified
                    ? `₹${c!.ctcBand.min}–${c!.ctcBand.max} LPA`
                    : "—"}
                </Row>
                <Row label="Difficulty" highlight={winners.ease === c!.slug}>
                  {"★".repeat(c!.difficulty)}<span className="text-[var(--color-text-faint)]">{"★".repeat(5 - c!.difficulty)}</span>
                </Row>
                <Row label="Min CGPA" highlight={winners.cgpa === c!.slug}>
                  {c!.eligibility.minCgpa ?? "—"}
                </Row>
                <Row label="Backlogs">{c!.eligibility.backlogPolicy}</Row>
                <Row label="Rounds">{c!.rounds.length} rounds</Row>
                <Row label="OA platforms">
                  <span className="truncate">{c!.oaTools.join(", ")}</span>
                </Row>
                <Row label="Hiring window">
                  <Calendar className="w-3 h-3" />
                  <span className="truncate">{c!.hiringWindow}</span>
                </Row>
                <Row label="Locations">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{c!.indianOffices.slice(0, 2).join(", ")}</span>
                </Row>
                <Row label="Branches">
                  <span className="truncate">{c!.eligibility.allowedBranches.slice(0, 2).join(", ")}</span>
                </Row>

                <Link to={`/companies/${c!.slug}`} className="block mt-4">
                  <Button fullWidth size="sm">View full prep kit →</Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* PRO UPSELL */}
      {companies.length >= 2 && (
        <Card className="border-[var(--color-neon)]/30 mb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[280px]">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-3.5 h-3.5 text-[var(--color-neon)]" />
                <span className="mono text-[10px] uppercase tracking-widest text-[var(--color-neon)]">PrepPlace Pro</span>
              </div>
              <div className="display text-2xl">Compare 6 offers + 5-year takehome projections.</div>
              <p className="text-sm text-[var(--color-text-dim)] mt-1">
                Pro unlocks side-by-side for up to 6 recruiters, RSU vest schedules, city
                cost-of-living adjustments, and AI offer-letter clause review.
              </p>
            </div>
            <Link to="/pricing">
              <Button>
                Go Pro <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

function Row({ label, children, highlight = false }: { label: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between text-xs py-1.5 border-b border-[var(--color-line)] ${highlight ? "bg-[var(--color-neon)]/[0.06] -mx-2 px-2 rounded" : ""}`}>
      <span className="text-[var(--color-text-faint)] mono uppercase text-[10px] tracking-widest">{label}</span>
      <span className={`inline-flex items-center gap-1 truncate ml-2 ${highlight ? "text-[var(--color-neon)] font-bold" : "text-[var(--color-text-dim)]"}`}>
        {children}
      </span>
    </div>
  );
}
