import { useState } from "react";
import { Sparkles, FileText, Loader2, AlertTriangle, CheckCircle2, Wand2, Target, RotateCcw } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { COMPANIES } from "../data/companies";
import { usePageMeta } from "../hooks/usePageMeta";
import { scoreResume, type ResumeScore } from "../lib/resumeScorer";

// Resume Roast — paste resume → AI critique (Groq via server proxy).
// Server enforces auth + length limits; client UI handles state machine:
//   idle → loading → result | error
//
// Highly shareable: once a result is back, a "Share my score" button copies a
// canned brag line ("I scored 73/100 on PrepPlace Resume Roast — try yours")
// that can virally pull in friends.

// Reuse the ResumeScore shape from the scorer.
type Issue = ResumeScore["issues"][number];
type Roast = ResumeScore;

const SEVERITY_TONE: Record<Issue["severity"], { bg: string; fg: string; border: string; label: string }> = {
  blocker: { bg: "#ff5247", fg: "#ff8a7a", border: "#ff5247", label: "BLOCKER" },
  major: { bg: "#ffe87a", fg: "#ffe87a", border: "#ffe87a", label: "MAJOR" },
  minor: { bg: "#9ca3af", fg: "#cbd5e1", border: "#9ca3af", label: "MINOR" },
};

export default function ResumeRoast() {
  usePageMeta({
    title: "Resume Roast — instant feedback for placement-ready CVs",
    description: "Paste your resume, get a brutal but actionable critique using FAANG recruiter heuristics. Tailored to the company you're targeting. Free, instant, runs in your browser.",
    canonical: "/resume-roast",
  });

  const [resume, setResume] = useState("");
  const [targetCompany, setTargetCompany] = useState<string>("");
  const [state, setState] = useState<"idle" | "loading" | "result" | "error">("idle");
  const [roast, setRoast] = useState<Roast | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const handleRoast = () => {
    setErrMsg(null);
    if (resume.trim().length < 100) {
      setErrMsg("Paste at least 100 characters of your resume — we need something to work with.");
      return;
    }
    setState("loading");
    // Run the scorer locally (no API). Defer with setTimeout so the "loading"
    // state actually paints — gives users a sense the analysis happened.
    setTimeout(() => {
      try {
        const result = scoreResume(resume.trim(), targetCompany || undefined);
        setRoast(result);
        setState("result");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e: any) {
        setErrMsg(e?.message || "Couldn't score resume.");
        setState("error");
      }
    }, 600);
  };

  const reset = () => {
    setRoast(null);
    setState("idle");
    setErrMsg(null);
  };

  const shareBrag = async () => {
    if (!roast) return;
    const text = `I scored ${roast.overallScore}/100 on PrepPlace Resume Roast 🔥\n${roast.headline}\n\nTry yours: https://prepnext.vercel.app/resume-roast`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My PrepPlace Resume Roast", text });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Brag copied to clipboard!");
      }
    } catch {/* user cancelled */}
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <header className="mb-8">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// resume roast</div>
        <h1 className="display text-5xl sm:text-6xl">ROAST MY RESUME.</h1>
        <p className="text-[var(--color-text-dim)] mt-2 max-w-2xl">
          Paste your resume, optionally pick the company you're targeting, and get a brutal but
          actionable critique — score, fixable issues, bullet rewrites, ATS keywords. Tailored to
          Indian campus placement standards. Runs locally in your browser; nothing is uploaded.
        </p>
      </header>

      {state !== "result" && (
        <Card className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">Target company (optional)</label>
              <select
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="w-full mt-1 bg-[var(--color-card-soft)] border border-[var(--color-line)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-neon)]"
              >
                <option value="">— Generic (top product/SaaS) —</option>
                {COMPANIES.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              {targetCompany && (
                <p className="text-[11px] text-[var(--color-neon)]/90 mt-1.5">
                  Critique will be tailored to {targetCompany}'s known hiring bar + asked topics.
                </p>
              )}
            </div>

            <div>
              <label className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">
                Resume text · {resume.length} / 20,000 chars
              </label>
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your resume as plain text. Don't worry about formatting — sections, bullets, headings… just paste everything. The AI will figure it out."
                rows={14}
                className="w-full mt-1 bg-[var(--color-card-soft)] border border-[var(--color-line)] rounded-lg px-3.5 py-2.5 text-sm font-mono leading-relaxed outline-none focus:border-[var(--color-neon)] resize-vertical"
                maxLength={20_000}
              />
              <p className="text-[11px] text-[var(--color-text-faint)] mt-1">
                Don't have it as text? Open your PDF, Cmd+A → Cmd+C → paste here.
              </p>
            </div>

            {errMsg && (
              <div className="text-[var(--severity-crit-text)] text-sm flex items-center gap-2" role="alert">
                <AlertTriangle className="w-4 h-4" /> {errMsg}
              </div>
            )}

            <Button onClick={handleRoast} disabled={state === "loading"} fullWidth>
              {state === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing…
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" /> Roast my resume
                </>
              )}
            </Button>

            <div className="text-[11px] text-[var(--color-text-faint)] text-center">
              Runs 100% in your browser. Resume text never leaves your device.
            </div>
          </div>
        </Card>
      )}

      {state === "result" && roast && (
        <>
          {/* SCORE HEADER */}
          <Card className="mb-6 border-[var(--color-neon)]/40">
            <div className="grid sm:grid-cols-[auto_1fr_auto] items-center gap-5">
              <div className="text-center">
                <div className="display text-7xl neon-text leading-none">{roast.overallScore}</div>
                <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mt-1">/ 100</div>
              </div>
              <div>
                <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-neon)] mb-1">· verdict ·</div>
                <div className="display text-2xl">{roast.headline}</div>
                {targetCompany && (
                  <div className="text-xs text-[var(--color-text-faint)] mt-1">
                    Tailored for {targetCompany}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={shareBrag} variant="ghost">
                  <Sparkles className="w-4 h-4" /> Share score
                </Button>
                <Button onClick={reset} variant="ghost">
                  <RotateCcw className="w-4 h-4" /> Try another
                </Button>
              </div>
            </div>
          </Card>

          {/* STRENGTHS */}
          {roast.strengths.length > 0 && (
            <Card className="mb-4">
              <h3 className="font-bold text-sm flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-neon)]" />
                What's working
              </h3>
              <ul className="space-y-2">
                {roast.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-[var(--color-text-dim)] flex items-start gap-2">
                    <span className="text-[var(--color-neon)] shrink-0">→</span> {s}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* ISSUES */}
          <Card className="mb-4">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-[var(--severity-crit-text)]" />
              Issues ({roast.issues.length})
            </h3>
            <div className="space-y-3">
              {roast.issues.map((iss, i) => {
                const tone = SEVERITY_TONE[iss.severity];
                return (
                  <div
                    key={i}
                    className="border-l-2 pl-3 py-1"
                    style={{ borderColor: tone.border }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded"
                        style={{ background: `${tone.bg}22`, color: tone.fg }}
                      >
                        {tone.label}
                      </span>
                      <span className="font-bold text-sm">{iss.title}</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-dim)] mb-1">{iss.detail}</p>
                    <p className="text-xs text-[var(--color-neon)]/85">
                      <strong>Fix:</strong> {iss.fix}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* REWRITES */}
          {roast.rewrites.length > 0 && (
            <Card className="mb-4">
              <h3 className="font-bold text-sm flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-[var(--color-neon)]" />
                Bullet rewrites
              </h3>
              <div className="space-y-4">
                {roast.rewrites.map((rw, i) => (
                  <div key={i} className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div className="border border-[var(--color-line)] rounded-lg p-3">
                      <div className="mono text-[10px] uppercase tracking-widest text-[var(--severity-crit-text)] mb-1">Before</div>
                      <div className="text-[var(--color-text-dim)]">{rw.before}</div>
                    </div>
                    <div className="border border-[var(--color-neon)]/30 rounded-lg p-3 bg-[var(--color-neon)]/[0.04]">
                      <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-neon)] mb-1">After</div>
                      <div className="text-[var(--color-text)]">{rw.after}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* SKILLS + ATS */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Card>
              <h3 className="font-bold text-sm flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-[var(--color-neon)]" />
                Skills to highlight
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {roast.skillsToHighlight.map((s, i) => (
                  <Chip tone="neon" key={i}>{s}</Chip>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="font-bold text-sm mb-3">ATS keywords for {targetCompany || "your targets"}</h3>
              <div className="flex flex-wrap gap-1.5">
                {roast.atsKeywords.map((k, i) => (
                  <Chip key={i}>{k}</Chip>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
