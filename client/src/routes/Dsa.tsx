import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, BookmarkCheck, ChevronDown, ChevronUp, ExternalLink, Flame, RotateCw, Search, Shuffle } from "lucide-react";
import toast from "react-hot-toast";
import { useLocalStorageState, LS_KEYS } from "../hooks/useLocalStorageState";
import { PROBLEMS, TOPICS, COMPANY_LIST, SOURCE_LIST, Difficulty, Topic, Source } from "../data/dsa-problems";
import { Card } from "../components/ui/Card";
import { Chip } from "../components/ui/Chip";
import { Donut } from "../components/ui/Donut";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Button } from "../components/ui/Button";
import { AdaptiveRecommender } from "../components/adaptive/AdaptiveRecommender";
import { LeetCodeLogo } from "../components/dsa/LeetCodeLogo";
import { usePageMeta } from "../hooks/usePageMeta";

type Status = "not_started" | "attempted" | "solved";

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
const STATUSES: Status[] = ["not_started", "attempted", "solved"];
const TOP_COMPANIES = COMPANY_LIST.slice(0, 20);

const DIFF_COLOR: Record<Difficulty, string> = {
  Easy: "#b9f5c8",
  Medium: "#ffe87a",
  Hard: "#ff8a7a",
};

export default function Dsa() {
  usePageMeta({
    title: "DSA Practice — company-tagged problem sheets",
    description: "150 hand-curated DSA problems tagged by company and topic. Track progress, bookmark, get spaced-repetition reviews. Free for students.",
    canonical: "/dsa",
  });

  const [statuses, setStatuses] = useLocalStorageState<Record<number, Status>>(LS_KEYS.dsaStatuses, {});
  const [bookmarks, setBookmarks] = useLocalStorageState<number[]>(LS_KEYS.dsaBookmarks, []);
  const [, setAttempts] = useLocalStorageState<Record<number, { count: number; lastAt: string }>>(LS_KEYS.dsaAttempts, {});

  const [q, setQ] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [diffFilter, setDiffFilter] = useState<Set<Difficulty>>(new Set());
  const [topicFilter, setTopicFilter] = useState<Set<Topic>>(new Set());
  const [companyFilter, setCompanyFilter] = useState<Set<string>>(new Set());
  const [sourceFilter, setSourceFilter] = useState<Set<Source>>(new Set());
  const [statusFilter, setStatusFilter] = useState<Set<Status>>(new Set());
  const [bookmarkOnly, setBookmarkOnly] = useState(false);

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return PROBLEMS.filter((p) => {
      if (qLower && !p.title.toLowerCase().includes(qLower)) return false;
      if (diffFilter.size && !diffFilter.has(p.difficulty)) return false;
      if (topicFilter.size && !topicFilter.has(p.topic)) return false;
      if (companyFilter.size && !p.companies.some((c) => companyFilter.has(c))) return false;
      if (sourceFilter.size && !p.sources.some((s) => sourceFilter.has(s))) return false;
      const st = statuses[p.id] ?? "not_started";
      if (statusFilter.size && !statusFilter.has(st)) return false;
      if (bookmarkOnly && !bookmarks.includes(p.id)) return false;
      return true;
    });
  }, [q, diffFilter, topicFilter, companyFilter, sourceFilter, statusFilter, bookmarkOnly, statuses, bookmarks]);

  const counts = useMemo(() => {
    const total = PROBLEMS.length;
    const solved = PROBLEMS.filter((p) => statuses[p.id] === "solved").length;
    const attempted = PROBLEMS.filter((p) => statuses[p.id] === "attempted").length;
    const remaining = total - solved - attempted;

    const byDiff: Record<Difficulty, { solved: number; total: number }> = {
      Easy: { solved: 0, total: 0 },
      Medium: { solved: 0, total: 0 },
      Hard: { solved: 0, total: 0 },
    };
    PROBLEMS.forEach((p) => {
      byDiff[p.difficulty].total += 1;
      if (statuses[p.id] === "solved") byDiff[p.difficulty].solved += 1;
    });

    const byTopic: Array<{ topic: Topic; solved: number; total: number }> = TOPICS.map((t) => ({
      topic: t,
      solved: PROBLEMS.filter((p) => p.topic === t && statuses[p.id] === "solved").length,
      total: PROBLEMS.filter((p) => p.topic === t).length,
    }));

    return { total, solved, attempted, remaining, byDiff, byTopic };
  }, [statuses]);

  const cycleStatus = (id: number) => {
    const cur = statuses[id] ?? "not_started";
    const next: Status = cur === "not_started" ? "attempted" : cur === "attempted" ? "solved" : "not_started";
    setStatuses((prev) => ({ ...prev, [id]: next }));
    // Record attempt timestamps so the adaptive "reinforce" pick can surface.
    if (next === "attempted") {
      setAttempts((a) => ({ ...a, [id]: { count: (a[id]?.count ?? 0) + 1, lastAt: new Date().toISOString() } }));
    }
  };
  const toggleBookmark = (id: number) =>
    setBookmarks((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const reset = () => {
    if (!confirm("Reset all DSA progress?")) return;
    setStatuses({});
    toast.success("Progress reset");
  };

  const randomUnsolved = () => {
    const unsolved = PROBLEMS.filter((p) => statuses[p.id] !== "solved");
    if (!unsolved.length) return toast("All solved 🎉");
    const pick = unsolved[Math.floor(Math.random() * unsolved.length)];
    window.location.href = `/dsa/${pick.slug}`;
  };

  const toggleSet = <T,>(setSet: (f: (s: Set<T>) => Set<T>) => void, val: T) =>
    setSet((s) => {
      const n = new Set(s);
      n.has(val) ? n.delete(val) : n.add(val);
      return n;
    });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// dsa hub</div>
          <h1 className="display text-5xl sm:text-7xl">DSA PRACTICE.</h1>
          <p className="text-[var(--color-text-faint)] mt-2">150 hand-curated problems across 18 topics. Adaptive picks above.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" onClick={randomUnsolved}>
            <Shuffle className="w-4 h-4" /> Random unsolved
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCw className="w-4 h-4" /> Reset progress
          </Button>
        </div>
      </header>

      <AdaptiveRecommender />

      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        <Card>
          <div className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)] mb-2">Completion</div>
          <Donut
            segments={[
              { label: "Solved", value: counts.solved, color: "#c8ff3d" },
              { label: "Attempted", value: counts.attempted, color: "#ffe87a" },
              { label: "Remaining", value: counts.remaining, color: "#333" },
            ]}
            centerValue={`${counts.solved}/${counts.total}`}
            centerLabel="solved"
            size={180}
          />
        </Card>
        <Card>
          <div className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)] mb-4">By difficulty</div>
          <div className="space-y-4">
            {DIFFICULTIES.map((d) => {
              const c = counts.byDiff[d];
              return (
                <div key={d}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{d}</span>
                    <span className="mono text-[var(--color-text-faint)]">{c.solved}/{c.total}</span>
                  </div>
                  <ProgressBar value={c.total ? c.solved / c.total : 0} color={DIFF_COLOR[d]} />
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <div className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)] mb-3">By topic</div>
          <div className="max-h-[200px] overflow-y-auto pr-2 space-y-1.5">
            {counts.byTopic
              .sort((a, b) => (b.solved / Math.max(1, b.total)) - (a.solved / Math.max(1, a.total)))
              .map((r) => (
                <div key={r.topic} className="flex items-center gap-2 text-xs">
                  <div className="w-32 truncate">{r.topic}</div>
                  <div className="flex-1">
                    <ProgressBar value={r.total ? r.solved / r.total : 0} height={5} />
                  </div>
                  <div className="mono text-[var(--color-text-faint)] w-12 text-right">{r.solved}/{r.total}</div>
                </div>
              ))}
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-[var(--color-text-faint)]" />
          <input
            className="flex-1 bg-transparent outline-none placeholder:text-[var(--color-text-faint)]"
            placeholder="Search by title…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            className="text-[var(--color-text-faint)] hover:text-[var(--color-text)] text-xs flex items-center gap-1"
            onClick={() => setShowFilters((v) => !v)}
          >
            Filters {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
        {showFilters && (
          <div className="space-y-3 pt-2 border-t border-[var(--color-line)]">
            <Row label="Difficulty">
              {DIFFICULTIES.map((d) => (
                <Chip key={d} tone="neon" active={diffFilter.has(d)} onClick={() => toggleSet(setDiffFilter, d)}>{d}</Chip>
              ))}
            </Row>
            <Row label="Topic">
              {TOPICS.map((t) => (
                <Chip key={t} active={topicFilter.has(t)} onClick={() => toggleSet(setTopicFilter, t)}>{t}</Chip>
              ))}
            </Row>
            <Row label="Source">
              {SOURCE_LIST.map((s) => (
                <Chip key={s} active={sourceFilter.has(s)} onClick={() => toggleSet(setSourceFilter, s)}>{s}</Chip>
              ))}
            </Row>
            <Row label="Status">
              {STATUSES.map((s) => (
                <Chip key={s} active={statusFilter.has(s)} onClick={() => toggleSet(setStatusFilter, s)}>{s.replace("_", " ")}</Chip>
              ))}
              <Chip tone="warn" active={bookmarkOnly} onClick={() => setBookmarkOnly((v) => !v)}>★ bookmarked</Chip>
            </Row>
            <Row label="Top companies">
              {TOP_COMPANIES.map((c) => (
                <Chip key={c} active={companyFilter.has(c)} onClick={() => toggleSet(setCompanyFilter, c)}>{c}</Chip>
              ))}
            </Row>
          </div>
        )}
      </Card>

      <Card>
        <div className="text-xs text-[var(--color-text-faint)] mb-3 mono">
          Showing {filtered.length} / {PROBLEMS.length} problems
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mono">
              <tr>
                <th className="py-2 pr-3 w-16">Status</th>
                <th className="py-2 pr-3 w-12">★</th>
                <th className="py-2 pr-3 w-16">LC#</th>
                <th className="py-2 pr-3">Title</th>
                <th className="py-2 pr-3 w-16">LeetCode</th>
                <th className="py-2 pr-3">Topic</th>
                <th className="py-2 pr-3 w-24">Difficulty</th>
                <th className="py-2 pr-3 w-20">Freq</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const st: Status = statuses[p.id] ?? "not_started";
                const bm = bookmarks.includes(p.id);
                return (
                  <tr key={p.id} className="border-t border-[var(--color-line)] hover:bg-[var(--color-text)]/5">
                    <td className="py-2 pr-3">
                      <button onClick={() => cycleStatus(p.id)} className="w-7 h-7 rounded border border-[var(--color-line)] flex items-center justify-center hover:border-[var(--color-neon)]">
                        {st === "solved" && <span className="text-[var(--color-neon)]">✓</span>}
                        {st === "attempted" && <span className="text-[var(--severity-warn-text)]">◐</span>}
                      </button>
                    </td>
                    <td className="py-2 pr-3">
                      <button onClick={() => toggleBookmark(p.id)} className="text-[var(--color-neon)]">
                        {bm ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4 text-[var(--color-text-faint)]" />}
                      </button>
                    </td>
                    <td className="py-2 pr-3 mono text-[var(--color-text-faint)] text-xs">{p.leetcodeNumber}</td>
                    <td className="py-2 pr-3">
                      <Link to={`/dsa/${p.slug}`} className="text-[var(--color-text)] hover:text-[var(--color-neon)]">
                        {p.title}
                      </Link>
                    </td>
                    <td className="py-2 pr-3">
                      <a
                        href={`https://leetcode.com/problems/${p.slug}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[var(--color-text-faint)] hover:text-[#ffa116]"
                        title="Open on LeetCode"
                        aria-label={`Open ${p.title} on LeetCode`}
                      >
                        <LeetCodeLogo className="w-4 h-4" />
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="py-2 pr-3 text-xs text-[var(--color-text-faint)]">{p.topic}</td>
                    <td className="py-2 pr-3">
                      <span className="text-xs font-semibold" style={{ color: DIFF_COLOR[p.difficulty] }}>
                        {p.difficulty}
                      </span>
                    </td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: p.frequency }).map((_, i) => (
                          <Flame key={i} className="w-3 h-3 text-[#ff8a4d]" />
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[var(--color-neon)] text-black grid place-items-center neon-glow z-20"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mono mb-1.5">{label}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}
