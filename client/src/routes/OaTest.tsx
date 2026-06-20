import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Flag, Clock, ChevronLeft, ChevronRight, Eye, Send, AlertTriangle, X } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { useOaSessions } from "../hooks/useOaSessions";
import { PYQ_SEED } from "../data/pyqs-seed";
import { getCompany } from "../data/companies";

// Active OA test mode. Full-bleed; hides the nav chrome via a body class.
// Timer runs from session.startedAt — survives refresh.

export default function OaTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { get, updateAnswer, finish } = useOaSessions();
  const session = get(id || "");

  const [idx, setIdx] = useState(0);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  // Hide Nav + Footer for the duration of the test — fullscreen-feel.
  useEffect(() => {
    document.body.classList.add("oa-fullscreen");
    return () => document.body.classList.remove("oa-fullscreen");
  }, []);

  // Build a stable list of questions in order
  const questions = useMemo(() => {
    if (!session) return [];
    const map = new Map(PYQ_SEED.map((q) => [q.id, q]));
    return session.questionIds.map((qid) => map.get(qid)).filter(Boolean) as typeof PYQ_SEED;
  }, [session]);

  // Timer: derived from startedAt + durationMin
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl py-32 text-center">
        <div className="display text-3xl">Session not found.</div>
        <p className="text-white/55 text-sm mt-2">
          <a href="/oa" className="text-[var(--color-neon)] underline">Back to OA Practice</a>
        </p>
      </div>
    );
  }

  if (session.finishedAt) {
    // Auto-redirect to results if user lands here after finishing
    navigate(`/oa/result/${session.id}`, { replace: true });
    return null;
  }

  const totalMs = session.config.durationMin * 60_000;
  const elapsedMs = now - new Date(session.startedAt).getTime();
  const remainingMs = Math.max(0, totalMs - elapsedMs);
  const remainingSec = Math.floor(remainingMs / 1000);
  const mm = Math.floor(remainingSec / 60);
  const ss = remainingSec % 60;
  const timeOut = remainingMs <= 0;
  const urgency: "fine" | "warn" | "critical" = remainingSec < 60 ? "critical" : remainingSec < 300 ? "warn" : "fine";

  const q = questions[idx];
  const ans = session.answers[q.id];
  const company = getCompany(q.companySlug);

  const submit = () => {
    finish(session.id);
    navigate(`/oa/result/${session.id}`, { replace: true });
  };

  // Auto-submit on time-out
  if (timeOut && !session.finishedAt) {
    setTimeout(() => submit(), 200);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* TOP BAR */}
      <div
        className={`sticky top-0 z-30 border-b backdrop-blur-md ${
          urgency === "critical"
            ? "bg-[#ff5247]/15 border-[#ff5247]/40"
            : urgency === "warn"
            ? "bg-[#ffe87a]/10 border-[#ffe87a]/30"
            : "bg-black/70 border-white/10"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm("Quit this test? Progress will be lost.")) {
                  navigate("/oa");
                }
              }}
              className="text-white/55 hover:text-white text-xs flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Quit
            </button>
            <div className="mono text-xs uppercase tracking-widest text-white/60">
              {session.config.companySlug ? company?.name : "Mixed"} · {session.config.difficulty}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock
              className={`w-4 h-4 ${
                urgency === "critical"
                  ? "text-[#ff8a7a] animate-pulse"
                  : urgency === "warn"
                  ? "text-[#ffe87a]"
                  : "text-[var(--color-neon)]"
              }`}
            />
            <span
              className="display text-2xl tabular-nums"
              style={{
                color: urgency === "critical" ? "#ff8a7a" : urgency === "warn" ? "#ffe87a" : "var(--color-neon)",
              }}
            >
              {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
            </span>
          </div>

          <Button size="sm" onClick={() => setConfirmSubmit(true)}>
            <Send className="w-3.5 h-3.5" /> Submit
          </Button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 grid lg:grid-cols-[1fr_240px] gap-6 flex-1">
        {/* QUESTION + ANSWER PAD */}
        <div>
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="mono text-[10px] uppercase tracking-widest text-white/45">Question</div>
              <div className="display text-2xl">{idx + 1} / {questions.length}</div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Chip>{q.topic}</Chip>
              <Chip
                style={{
                  background:
                    q.difficulty === "Easy"
                      ? "#b9f5c822"
                      : q.difficulty === "Medium"
                      ? "#ffe87a22"
                      : "#ff8a7a22",
                  color:
                    q.difficulty === "Easy"
                      ? "#b9f5c8"
                      : q.difficulty === "Medium"
                      ? "#ffe87a"
                      : "#ff8a7a",
                } as any}
              >
                {q.difficulty}
              </Chip>
              <button
                onClick={() => updateAnswer(session.id, q.id, { flagged: !ans.flagged })}
                className={`text-[11px] mono uppercase tracking-widest px-2 py-1 rounded-full inline-flex items-center gap-1 transition-colors ${
                  ans.flagged ? "bg-[var(--color-neon)] text-black" : "text-white/55 hover:text-white border border-white/15"
                }`}
              >
                <Flag className="w-3 h-3" /> {ans.flagged ? "Flagged" : "Flag"}
              </button>
            </div>
          </div>

          <Card className="mb-4">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-white/95">{q.question}</pre>
          </Card>

          <div className="mb-3 flex items-center justify-between">
            <label className="mono text-[10px] uppercase tracking-widest text-white/50">Your approach / pseudocode</label>
            <span className="mono text-[10px] text-white/40">{ans.notes.length} chars · saved locally</span>
          </div>
          <textarea
            value={ans.notes}
            onChange={(e) => updateAnswer(session.id, q.id, { notes: e.target.value })}
            rows={10}
            placeholder="Brute force → optimal. Write the algorithm in words, then code if time permits. Time complexity?"
            className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-3 text-sm font-mono leading-relaxed outline-none focus:border-[var(--color-neon)] resize-vertical"
          />

          {/* Peek expected approach */}
          {q.expectedApproach && (
            <div className="mt-3">
              {!ans.viewedApproach ? (
                <button
                  onClick={() => updateAnswer(session.id, q.id, { viewedApproach: true })}
                  className="text-xs text-white/55 hover:text-white inline-flex items-center gap-1.5 border border-dashed border-white/20 rounded-full px-3 py-1.5"
                >
                  <Eye className="w-3 h-3" />
                  Peek expected approach (20% score penalty)
                </button>
              ) : (
                <Card className="!bg-white/[0.04]">
                  <div className="flex items-start gap-2 text-xs text-white/80">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#ffe87a] mt-0.5 shrink-0" />
                    <div>
                      <div className="mono text-[10px] uppercase tracking-widest text-[#ffe87a] mb-1">Hint viewed · 20% penalty applied to this question</div>
                      <div className="whitespace-pre-wrap leading-relaxed">{q.expectedApproach}</div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-5">
            <Button
              variant="ghost"
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
              disabled={idx === 0}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            {idx < questions.length - 1 ? (
              <Button onClick={() => setIdx((i) => Math.min(questions.length - 1, i + 1))}>
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={() => setConfirmSubmit(true)}>
                <Send className="w-4 h-4" /> Submit test
              </Button>
            )}
          </div>
        </div>

        {/* QUESTION PALETTE (sidebar) */}
        <div>
          <div className="sticky top-20">
            <div className="mono text-[10px] uppercase tracking-widest text-white/50 mb-2">Question palette</div>
            <div className="grid grid-cols-5 lg:grid-cols-4 gap-1.5">
              {questions.map((qq, i) => {
                const a = session.answers[qq.id];
                const isCurrent = i === idx;
                const answered = a.notes.trim().length > 30;
                const flagged = a.flagged;
                return (
                  <button
                    key={qq.id}
                    onClick={() => setIdx(i)}
                    aria-label={`Jump to question ${i + 1}`}
                    className={`relative aspect-square rounded-lg text-sm font-bold mono ${
                      isCurrent
                        ? "bg-[var(--color-neon)] text-black"
                        : flagged
                        ? "border border-[var(--color-neon)] text-[var(--color-neon)] bg-[var(--color-neon)]/10"
                        : answered
                        ? "bg-white/15 text-white"
                        : "bg-white/5 text-white/40 hover:text-white border border-white/10"
                    }`}
                  >
                    {i + 1}
                    {flagged && (
                      <Flag className="w-2.5 h-2.5 absolute top-1 right-1 text-[var(--color-neon)]" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 space-y-1.5 text-[11px] text-white/55 mono">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded bg-[var(--color-neon)]"></span> Current
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded bg-white/15"></span> Attempted
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded border border-[var(--color-neon)] bg-[var(--color-neon)]/10"></span> Flagged
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded bg-white/5 border border-white/10"></span> Untouched
              </div>
            </div>

            <Button
              onClick={() => setConfirmSubmit(true)}
              fullWidth
              className="mt-5"
            >
              <Send className="w-3.5 h-3.5" /> Submit early
            </Button>
          </div>
        </div>
      </div>

      {/* SUBMIT CONFIRM MODAL */}
      {confirmSubmit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm grid place-items-center px-4">
          <Card className="max-w-md w-full">
            <h3 className="display text-2xl mb-2">Submit test?</h3>
            <p className="text-sm text-white/65 mb-4">
              You'll grade yourself on the next screen. Once submitted, the timer stops.
            </p>
            <div className="flex items-center gap-3">
              <Button onClick={submit} fullWidth>
                <Send className="w-4 h-4" /> Submit
              </Button>
              <Button variant="ghost" onClick={() => setConfirmSubmit(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
