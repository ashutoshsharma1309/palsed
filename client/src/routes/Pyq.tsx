import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Search, ThumbsUp, ThumbsDown } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Chip } from "../components/ui/Chip";
import { Button } from "../components/ui/Button";
import { usePYQs } from "../hooks/usePYQs";
import { COMPANIES, getCompany } from "../data/companies";
import { PYQRound } from "../data/pyqs-seed";
import { usePageMeta } from "../hooks/usePageMeta";

const ROUNDS: PYQRound[] = ["OA","Tech","HR","Managerial","Group Discussion","Case","Bar Raiser"];
const DIFFS = ["Easy","Medium","Hard"] as const;

export default function Pyq() {
  usePageMeta({
    title: "PYQ Vault — previous year placement questions",
    description: "Crowd-verified previous-year questions by company, round, and year. OA, technical, HR, managerial rounds — all sortable, votable.",
    canonical: "/pyq",
  });

  const { all, votes, vote } = usePYQs();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState("");
  const companyFilter = params.get("company") || "";
  const [round, setRound] = useState<PYQRound | "All">("All");
  const [diff, setDiff] = useState<(typeof DIFFS)[number] | "All">("All");

  const years = useMemo(
    () => Array.from(new Set(all.map((p) => p.year))).sort((a, b) => b - a),
    [all]
  );
  const [year, setYear] = useState<number | "All">("All");

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return all
      .filter((p) => (companyFilter ? p.companySlug === companyFilter : true))
      .filter((p) => (round === "All" ? true : p.round === round))
      .filter((p) => (diff === "All" ? true : p.difficulty === diff))
      .filter((p) => (year === "All" ? true : p.year === year))
      .filter((p) => (qq ? p.question.toLowerCase().includes(qq) || p.topic.toLowerCase().includes(qq) : true))
      .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
  }, [all, q, companyFilter, round, diff, year]);

  const focusedCompany = companyFilter ? getCompany(companyFilter) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// pyq vault</div>
          <h1 className="display text-5xl sm:text-7xl">PYQ VAULT.</h1>
          <p className="text-[var(--color-text-faint)] mt-2 max-w-xl">
            Previous-year questions by company × round × year. Crowd-verified.
            {focusedCompany && (
              <> Filtered to <strong className="text-[var(--color-text)]">{focusedCompany.name}</strong>.
                <button onClick={() => setParams({})} className="ml-2 text-xs text-[var(--color-neon)] underline">clear</button>
              </>
            )}
          </p>
        </div>
        <Link to={`/pyq/submit${companyFilter ? `?company=${companyFilter}` : ""}`}>
          <Button><Plus className="w-4 h-4" /> Contribute</Button>
        </Link>
      </header>

      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-[var(--color-text-faint)]" />
          <input
            className="flex-1 bg-transparent outline-none placeholder:text-[var(--color-text-faint)]"
            placeholder="Search questions, topics…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Row label="Company">
            <Chip tone="neon" active={!companyFilter} onClick={() => setParams({})}>All</Chip>
            {COMPANIES.slice(0, 14).map((c) => (
              <Chip
                key={c.slug}
                tone="neon"
                active={companyFilter === c.slug}
                onClick={() => setParams({ company: c.slug })}
              >
                {c.name}
              </Chip>
            ))}
          </Row>
          <Row label="Round">
            <Chip active={round === "All"} onClick={() => setRound("All")}>All</Chip>
            {ROUNDS.map((r) => <Chip key={r} active={round === r} onClick={() => setRound(r)}>{r}</Chip>)}
          </Row>
          <Row label="Difficulty">
            <Chip active={diff === "All"} onClick={() => setDiff("All")}>All</Chip>
            {DIFFS.map((d) => <Chip key={d} active={diff === d} onClick={() => setDiff(d)}>{d}</Chip>)}
          </Row>
          <Row label="Year">
            <Chip active={year === "All"} onClick={() => setYear("All")}>All</Chip>
            {years.map((y) => <Chip key={y} active={year === y} onClick={() => setYear(y)}>{y}</Chip>)}
          </Row>
        </div>
      </Card>

      <div className="text-xs text-[var(--color-text-faint)] mono mb-4">
        Showing {filtered.length} / {all.length} questions
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-[var(--color-text-faint)]">
          No PYQs match. <Link to="/pyq/submit" className="text-[var(--color-neon)] underline">Submit the first one.</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {filtered.map((p) => {
            const company = getCompany(p.companySlug);
            return (
              <Card key={p.id}>
                <div className="flex items-center justify-between gap-3 mb-2 flex-wrap text-[10px] mono uppercase tracking-widest">
                  <div className="flex items-center gap-2 flex-wrap">
                    {company && (
                      <Link to={`/companies/${company.slug}`} className="text-[var(--color-neon)] hover:underline">
                        {company.name}
                      </Link>
                    )}
                    <span className="text-[var(--color-text-faint)]">·</span>
                    <span className="text-[var(--color-text-faint)]">{p.round}</span>
                    <span className="text-[var(--color-text-faint)]">·</span>
                    <span className="text-[var(--color-text-faint)]">{p.year}</span>
                    <span className="text-[var(--color-text-faint)]">·</span>
                    <span
                      className="px-1.5 py-0.5 rounded"
                      style={{
                        background: p.difficulty === "Easy" ? "#b9f5c822" : p.difficulty === "Medium" ? "#ffe87a22" : "#ff8a7a22",
                        color: p.difficulty === "Easy" ? "#b9f5c8" : p.difficulty === "Medium" ? "#ffe87a" : "#ff8a7a",
                      }}
                    >
                      {p.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => vote(p.id, "up")} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${votes[p.id] === "up" ? "bg-[var(--color-neon)]/20 text-[var(--color-neon)]" : "text-[var(--color-text-faint)] hover:text-[var(--color-text)]"}`}>
                      <ThumbsUp className="w-3 h-3" /> {p.upvotes}
                    </button>
                    <button onClick={() => vote(p.id, "down")} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${votes[p.id] === "down" ? "bg-red-400/20 text-red-300" : "text-[var(--color-text-faint)] hover:text-[var(--color-text)]"}`}>
                      <ThumbsDown className="w-3 h-3" /> {p.downvotes}
                    </button>
                  </div>
                </div>
                <div className="text-sm text-[var(--color-text-faint)] leading-relaxed mb-2">{p.question}</div>
                <div className="mono text-[10px] text-[var(--color-text-faint)]">
                  topic: <span className="text-[var(--color-text-faint)]">{p.topic}</span>
                  {p.status === "verified" && <span className="ml-2 text-[var(--color-neon)]">verified</span>}
                  {p.status === "pending" && <span className="ml-2 text-[var(--severity-warn-text)]">pending review</span>}
                </div>
                {p.expectedApproach && (
                  <details className="mt-2">
                    <summary className="text-xs text-[var(--color-neon)] cursor-pointer">expected approach</summary>
                    <div className="text-xs text-[var(--color-text-dim)] mt-1 mono whitespace-pre-line">{p.expectedApproach}</div>
                  </details>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-1">{label}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}
