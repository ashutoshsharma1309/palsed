import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, ExternalLink, ThumbsDown, ThumbsUp, MapPin, IndianRupee, Building2, Sparkles, GraduationCap, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "../components/ui/Card";
import { Chip } from "../components/ui/Chip";
import { Button } from "../components/ui/Button";
import { CompanyTile } from "../components/CompanyTile";
import { getCompany, COMPANIES } from "../data/companies";
import { usePYQs } from "../hooks/usePYQs";
import { useApplications } from "../hooks/useApplications";
import { PrepKit } from "../components/PrepKit";

export default function CompanyDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const c = useMemo(() => (slug ? getCompany(slug) : undefined), [slug]);
  const { all: allPyqs, votes, vote } = usePYQs();
  const { add: addApplication, apps } = useApplications();
  const [appliedRole, setAppliedRole] = useState("");

  // SEO: dynamically update <title> + meta description (good enough for Vercel SSR)
  useEffect(() => {
    if (!c) return;
    document.title = `${c.name} — Placement Prep Kit · Salary · Rounds · PYQs | PrepNext`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute(
      "content",
      `${c.name} campus placement: ₹${c.ctcBand.typical} LPA, ${c.rounds.length} rounds, eligibility, past coding/HR questions, and prep kit. Updated ${c.lastUpdated}.`
    );
  }, [c]);

  if (!c) {
    return (
      <div className="mx-auto max-w-3xl py-32 text-center">
        <h1 className="display text-4xl">Company not found.</h1>
        <Link to="/companies" className="text-[var(--color-neon)] underline mt-3 inline-block">Browse all companies</Link>
      </div>
    );
  }

  const pyqs = allPyqs.filter((p) => p.companySlug === c.slug);
  const related = c.related.map((s) => COMPANIES.find((x) => x.slug === s)).filter(Boolean) as typeof COMPANIES;
  const isTracking = apps.some((a) => a.companySlug === c.slug);

  const trackApplication = () => {
    const role = appliedRole.trim() || c.rolesOffered[0] || "SDE";
    addApplication({ companySlug: c.slug, role, source: "campus" });
    toast.success(`Added ${c.name} to your tracker`);
    setAppliedRole("");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <Link to="/companies" className="text-xs text-white/40 hover:text-white inline-flex items-center gap-1 mb-3">
        <ArrowLeft className="w-3 h-3" /> Recruiter map
      </Link>

      {/* HERO */}
      <div className="grid lg:grid-cols-[1fr_auto] gap-6 mb-8">
        <div className="flex items-start gap-5">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 display text-5xl"
            style={{ background: c.brandColor || "#1a1a1a", color: c.brandColor ? "#fff" : "#c8ff3d" }}
          >
            {c.logoLetter}
          </div>
          <div>
            <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-1">{c.tier}</div>
            <h1 className="display text-4xl sm:text-5xl">{c.name}</h1>
            <div className="text-white/60 mt-1">{c.sector}</div>
            <div className="flex flex-wrap gap-3 text-xs text-white/50 mt-3">
              <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {c.hq}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.indianOffices.join(" · ")}</span>
              <a href={c.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[var(--color-neon)] hover:underline">
                website <ExternalLink className="w-3 h-3" />
              </a>
              {c.careersUrl && (
                <a href={c.careersUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[var(--color-neon)] hover:underline">
                  careers <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        <Card className="lg:min-w-[260px]">
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">Typical CTC</div>
          {c.verified ? (
            <>
              <div className="display text-4xl flex items-baseline gap-1 neon-text">
                <IndianRupee className="w-6 h-6" /> {c.ctcBand.typical}
                <span className="text-base text-[var(--color-text-dim)] ml-1">LPA</span>
              </div>
              <div className="mono text-xs text-[var(--color-text-faint)] mt-1">range ₹{c.ctcBand.min}–{c.ctcBand.max} LPA</div>
            </>
          ) : (
            <>
              <div className="display text-2xl text-[var(--color-text-faint)] mt-1">CTC not verified</div>
              <div className="mono text-xs text-[var(--color-text-faint)] mt-1">We won't show numbers we haven't confirmed with an offer holder.</div>
            </>
          )}
          <div className="mt-3 text-[10px] mono uppercase tracking-widest text-[var(--color-text-faint)]">Difficulty</div>
          <div className="text-2xl mt-0.5">
            {"★".repeat(c.difficulty)}<span className="text-[var(--color-text-faint)]">{"★".repeat(5 - c.difficulty)}</span>
          </div>
        </Card>
      </div>

      {/* TRACK APPLICATION */}
      <Card className="mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1">
          <div className="font-bold text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--color-neon)]" />
            {isTracking ? "Already in your tracker" : "Track this company in your placement season"}
          </div>
          <div className="text-xs text-white/50 mt-0.5">
            Adds to your application kanban with status, deadlines, and notes.
          </div>
        </div>
        <input
          className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm"
          placeholder={`Role (e.g. ${c.rolesOffered[0]})`}
          value={appliedRole}
          onChange={(e) => setAppliedRole(e.target.value)}
        />
        <Button onClick={trackApplication}>+ Track</Button>
      </Card>

      {/* QUICK STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="mono text-[10px] uppercase tracking-widest text-white/40 mb-1">Hiring window</div>
          <div className="text-sm font-semibold flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[var(--color-neon)]" /> {c.hiringWindow}
          </div>
        </Card>
        <Card>
          <div className="mono text-[10px] uppercase tracking-widest text-white/40 mb-1">Roles offered</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {c.rolesOffered.map((r) => (<Chip key={r}>{r}</Chip>))}
          </div>
        </Card>
        <Card>
          <div className="mono text-[10px] uppercase tracking-widest text-white/40 mb-1">Eligibility</div>
          <div className="text-xs space-y-0.5 text-white/80">
            {c.eligibility.minCgpa && <div>CGPA ≥ {c.eligibility.minCgpa}</div>}
            {c.eligibility.minTenthPct && <div>10th ≥ {c.eligibility.minTenthPct}%</div>}
            <div>Branches: {c.eligibility.allowedBranches.join(", ")}</div>
            <div>Backlogs: {c.eligibility.backlogPolicy}</div>
          </div>
        </Card>
        <Card>
          <div className="mono text-[10px] uppercase tracking-widest text-white/40 mb-1">OA platforms</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {c.oaTools.map((t) => (<Chip tone="neon" key={t}>{t}</Chip>))}
          </div>
        </Card>
      </div>

      {/* PER-COMPANY PREP KIT — composes DSA + PYQs + topics into a 4-week plan */}
      <PrepKit company={c} pyqs={pyqs} />

      {/* ROUNDS */}
      <Card className="mb-6">
        <h2 className="display text-2xl mb-4">INTERVIEW ROUNDS.</h2>
        <ol className="space-y-3">
          {c.rounds.map((r, i) => (
            <li key={i} className="flex gap-4 items-start border-l-2 border-[var(--color-neon)]/40 pl-4">
              <div className="display text-2xl text-[var(--color-neon)] w-8 shrink-0">{i + 1}</div>
              <div className="flex-1">
                <div className="font-bold">{r.type} · <span className="font-normal text-white/60">{r.duration}</span></div>
                <div className="text-sm text-white/80 mt-1">{r.format}</div>
                {r.platform && <div className="mono text-[10px] text-white/40 uppercase tracking-widest mt-1">on {r.platform}</div>}
                {r.notes && <div className="text-xs text-white/50 mt-1 italic">{r.notes}</div>}
              </div>
            </li>
          ))}
        </ol>
      </Card>

      {/* TOPICS ASKED */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <h3 className="font-bold mb-3 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-[var(--color-neon)]" /> DSA topics asked</h3>
          <div className="flex flex-wrap gap-1.5">{c.topicsAsked.dsa.map((t) => (<Chip tone="neon" key={t}>{t}</Chip>))}</div>
          {c.topicsAsked.systemDesign && (
            <>
              <h3 className="font-bold mt-4 mb-2">System design</h3>
              <div className="flex flex-wrap gap-1.5">{c.topicsAsked.systemDesign.map((t) => (<Chip key={t}>{t}</Chip>))}</div>
            </>
          )}
        </Card>
        <Card>
          <h3 className="font-bold mb-3">Core CS</h3>
          {c.topicsAsked.coreCs && c.topicsAsked.coreCs.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">{c.topicsAsked.coreCs.map((t) => (<Chip key={t}>{t}</Chip>))}</div>
          ) : (
            <div className="text-xs text-white/40">No core-CS topics reported for this round mix.</div>
          )}
          {c.topicsAsked.behavioral && (
            <>
              <h3 className="font-bold mt-4 mb-2">Behavioral focus</h3>
              <div className="flex flex-wrap gap-1.5">{c.topicsAsked.behavioral.map((t) => (<Chip key={t}>{t}</Chip>))}</div>
            </>
          )}
        </Card>
      </div>

      {/* TIPS */}
      {c.tipsFromOffers.length > 0 && (
        <Card className="mb-6">
          <h3 className="display text-xl mb-3">TIPS FROM PREVIOUS OFFER HOLDERS.</h3>
          <ul className="space-y-2">
            {c.tipsFromOffers.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm text-white/80">
                <span className="text-[var(--color-neon)] shrink-0">→</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* PYQs */}
      <Card className="mb-6">
        <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
          <h2 className="display text-2xl">PREVIOUS-YEAR QUESTIONS.</h2>
          <button
            className="text-xs text-[var(--color-neon)] underline inline-flex items-center gap-1"
            onClick={() => navigate(`/pyq/submit?company=${c.slug}`)}
          >
            <Plus className="w-3 h-3" /> Contribute a question
          </button>
        </div>
        {pyqs.length === 0 ? (
          <div className="text-white/40 text-sm py-8 text-center">
            No questions seeded for {c.name} yet. <Link to={`/pyq/submit?company=${c.slug}`} className="text-[var(--color-neon)] underline">Be the first to add one</Link>.
          </div>
        ) : (
          <div className="space-y-3">
            {pyqs.slice(0, 12).map((p) => (
              <div key={p.id} className="border border-white/10 rounded-xl p-4 hover:border-[var(--color-neon)]/40 transition-colors">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                  <div className="flex items-center gap-2 flex-wrap text-[10px] mono uppercase tracking-widest">
                    <span className="text-[var(--color-neon)]">{p.round}</span>
                    <span className="text-white/50">· {p.year}</span>
                    <span className="text-white/50">· {p.topic}</span>
                    <span
                      className="px-2 py-0.5 rounded"
                      style={{
                        background: p.difficulty === "Easy" ? "#b9f5c822" : p.difficulty === "Medium" ? "#ffe87a22" : "#ff8a7a22",
                        color: p.difficulty === "Easy" ? "#b9f5c8" : p.difficulty === "Medium" ? "#ffe87a" : "#ff8a7a",
                      }}
                    >
                      {p.difficulty}
                    </span>
                    {p.status === "verified" && <span className="text-[var(--color-neon)]">✓ verified</span>}
                    {p.status === "pending" && <span className="text-[#ffe87a]">pending</span>}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button onClick={() => vote(p.id, "up")} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${votes[p.id] === "up" ? "bg-[var(--color-neon)]/20 text-[var(--color-neon)]" : "text-white/40 hover:text-white"}`}>
                      <ThumbsUp className="w-3 h-3" /> {p.upvotes}
                    </button>
                    <button onClick={() => vote(p.id, "down")} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${votes[p.id] === "down" ? "bg-red-400/20 text-red-300" : "text-white/40 hover:text-white"}`}>
                      <ThumbsDown className="w-3 h-3" /> {p.downvotes}
                    </button>
                  </div>
                </div>
                <div className="text-sm text-white whitespace-pre-line">{p.question}</div>
                {p.expectedApproach && (
                  <details className="mt-2">
                    <summary className="text-xs text-[var(--color-neon)] cursor-pointer">expected approach</summary>
                    <div className="text-xs text-white/70 mt-1 mono">{p.expectedApproach}</div>
                  </details>
                )}
              </div>
            ))}
            {pyqs.length > 12 && (
              <Link to={`/pyq?company=${c.slug}`} className="block text-xs text-[var(--color-neon)] underline text-center mt-3">
                See all {pyqs.length} PYQs →
              </Link>
            )}
          </div>
        )}
      </Card>

      {/* RELATED */}
      {related.length > 0 && (
        <div className="mb-6">
          <h2 className="display text-2xl mb-4">SIMILAR RECRUITERS.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.slice(0, 4).map((r) => <CompanyTile key={r.id} c={r} />)}
          </div>
        </div>
      )}
    </div>
  );
}
