import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Flag, Clock, ChevronLeft, ChevronRight, Eye, Send, AlertTriangle, X, FileText, Code2, ExternalLink, Sparkles } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { useOaSessions, getQuestionById, type EnrichedQuestion } from "../hooks/useOaSessions";
import { getCompany } from "../data/companies";

// Active OA test mode. Two-column on desktop:
//   left: problem statement, examples, constraints
//   right: answer pad (Approach / Code tabs) + question palette
// Fullscreen — Nav and Footer are hidden via the global route guard.

type AnswerTab = "approach" | "code";

export default function OaTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { get, updateAnswer, finish } = useOaSessions();
  const session = get(id || "");

  const [idx, setIdx] = useState(0);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [answerTab, setAnswerTab] = useState<AnswerTab>("approach");

  useEffect(() => {
    document.body.classList.add("oa-fullscreen");
    return () => document.body.classList.remove("oa-fullscreen");
  }, []);

  // Resolve all questions once per session
  const questions = useMemo(
    () => (session?.questionIds || []).map((qid) => getQuestionById(qid)).filter(Boolean) as EnrichedQuestion[],
    [session?.questionIds]
  );

  // Timer
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl py-32 text-center">
        <div className="display text-3xl">Session not found.</div>
        <p className="text-[var(--color-text-faint)] text-sm mt-2">
          <a href="/oa" className="text-[var(--color-neon)] underline">Back to OA Practice</a>
        </p>
      </div>
    );
  }

  if (session.finishedAt) {
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

  if (timeOut && !session.finishedAt) {
    setTimeout(() => submit(), 200);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* TOP BAR */}
      <div
        className="sticky top-0 z-30 border-b backdrop-blur-md"
        style={
          urgency === "critical"
            ? { background: "var(--severity-crit-bg)", borderColor: "var(--severity-crit-border)" }
            : urgency === "warn"
            ? { background: "var(--severity-warn-bg)", borderColor: "var(--severity-warn-border)" }
            : { background: "color-mix(in srgb, var(--color-bg) 85%, transparent)", borderColor: "var(--color-line)" }
        }
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm("Quit this test? Progress will be lost.")) navigate("/oa");
              }}
              className="text-[var(--color-text-faint)] hover:text-[var(--color-text)] text-xs flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Quit
            </button>
            <div className="hidden sm:flex items-center gap-1.5">
              <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-dim)]">
                {session.config.companySlug ? company?.name : "Mixed"} · {session.config.difficulty}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock
              className={`w-4 h-4 ${urgency === "critical" ? "animate-pulse" : ""}`}
              style={{
                color:
                  urgency === "critical"
                    ? "var(--severity-crit-text)"
                    : urgency === "warn"
                    ? "var(--severity-warn-text)"
                    : "var(--color-neon)",
              }}
            />
            <span
              className="display text-2xl tabular-nums"
              style={{
                color:
                  urgency === "critical"
                    ? "var(--severity-crit-text)"
                    : urgency === "warn"
                    ? "var(--severity-warn-text)"
                    : "var(--color-neon)",
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

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_200px] gap-5 flex-1">
        {/* PROBLEM PANEL */}
        <div className="min-w-0">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">Question</div>
              <div className="display text-2xl">
                {idx + 1} / {questions.length}
              </div>
              {q.title && (
                <div className="display text-2xl text-[var(--color-text-dim)]">· {q.title}</div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Chip>{q.topic}</Chip>
              <span
                className={`diff-pill ${
                  q.difficulty === "Easy" ? "diff-easy" : q.difficulty === "Medium" ? "diff-medium" : "diff-hard"
                }`}
              >
                {q.difficulty}
              </span>
              {q.timeAllowedMin && (
                <Chip>
                  <Clock className="w-3 h-3" /> ~{q.timeAllowedMin}m
                </Chip>
              )}
              {q.source === "curated" && (
                <Chip tone="neon" active>
                  <Sparkles className="w-3 h-3" /> Curated
                </Chip>
              )}
              <button
                onClick={() => updateAnswer(session.id, q.id, { flagged: !ans.flagged })}
                className={`text-[11px] mono uppercase tracking-widest px-2 py-1 rounded-full inline-flex items-center gap-1 transition-colors ${
                  ans.flagged
                    ? "bg-[var(--color-neon)] text-black"
                    : "text-[var(--color-text-faint)] hover:text-[var(--color-text)] border border-[var(--color-line)]"
                }`}
              >
                <Flag className="w-3 h-3" /> {ans.flagged ? "Flagged" : "Flag"}
              </button>
            </div>
          </div>

          {/* Companies that ask */}
          {q.companies && q.companies.length > 0 && (
            <div className="mb-3 flex items-center gap-2 flex-wrap">
              <span className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">
                Asked by:
              </span>
              {q.companies.slice(0, 6).map((c) => (
                <span key={c} className="text-[10px] mono text-[var(--color-text-dim)] bg-[var(--color-card-soft)] rounded px-1.5 py-0.5">
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* Problem statement */}
          <Card className="mb-4">
            <div className="text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-text)]">
              {renderMarkdownLite(q.problemStatement)}
            </div>
          </Card>

          {/* Examples */}
          {q.examples && q.examples.length > 0 && (
            <div className="mb-4">
              <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-2">
                Examples
              </div>
              <div className="space-y-2">
                {q.examples.map((ex, i) => (
                  <Card key={i} className="!p-3 !bg-[var(--color-card-soft)]">
                    <div className="text-[10px] mono text-[var(--color-neon)] uppercase tracking-widest mb-1">
                      Example {i + 1}
                    </div>
                    <div className="grid sm:grid-cols-[80px_1fr] gap-1 text-xs">
                      <span className="mono text-[var(--color-text-faint)]">Input:</span>
                      <span className="font-mono text-[var(--color-text)] break-words">{ex.input}</span>
                      <span className="mono text-[var(--color-text-faint)]">Output:</span>
                      <span className="font-mono text-[var(--color-neon)] break-words">{ex.output}</span>
                      {ex.explanation && (
                        <>
                          <span className="mono text-[var(--color-text-faint)]">Note:</span>
                          <span className="text-[var(--color-text-dim)] italic">{ex.explanation}</span>
                        </>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Constraints */}
          {q.constraints && q.constraints.length > 0 && (
            <div className="mb-4">
              <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-2">
                Constraints
              </div>
              <div className="flex flex-wrap gap-1.5">
                {q.constraints.map((c, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono text-[var(--color-text-dim)] bg-[var(--color-card-soft)] border border-[var(--color-line)] rounded px-2 py-1"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Peek expected approach */}
          {(q.expectedApproach || q.solution) && (
            <div className="mb-3">
              {!ans.viewedApproach ? (
                <button
                  onClick={() => updateAnswer(session.id, q.id, { viewedApproach: true })}
                  className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)] inline-flex items-center gap-1.5 border border-dashed border-[var(--color-line)] rounded-full px-3 py-1.5"
                >
                  <Eye className="w-3 h-3" />
                  Peek hint (20% score penalty)
                </button>
              ) : (
                <Card className="!bg-[#ffe87a]/[0.04] border border-[#ffe87a]/20">
                  <div className="flex items-start gap-2 text-xs text-[var(--color-text-dim)]">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#ffe87a] mt-0.5 shrink-0" />
                    <div>
                      <div className="mono text-[10px] uppercase tracking-widest text-[#ffe87a] mb-1.5">
                        Hint viewed · 20% penalty applied
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {q.solution?.approach || q.expectedApproach}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* ANSWER PAD */}
        <div className="min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex border border-[var(--color-line)] rounded-full p-0.5 text-[10px] mono uppercase tracking-widest">
              <button
                onClick={() => setAnswerTab("approach")}
                className={`px-3 py-1 rounded-full inline-flex items-center gap-1 transition-colors ${
                  answerTab === "approach" ? "bg-[var(--color-neon)] text-black" : "text-[var(--color-text-faint)]"
                }`}
              >
                <FileText className="w-3 h-3" /> Approach
              </button>
              <button
                onClick={() => setAnswerTab("code")}
                className={`px-3 py-1 rounded-full inline-flex items-center gap-1 transition-colors ${
                  answerTab === "code" ? "bg-[var(--color-neon)] text-black" : "text-[var(--color-text-faint)]"
                }`}
              >
                <Code2 className="w-3 h-3" /> Code
              </button>
            </div>
            <span className="mono text-[10px] text-[var(--color-text-faint)]">
              {ans.notes.length} chars · saved
            </span>
          </div>

          {answerTab === "approach" ? (
            <textarea
              value={ans.notes.split("\n---CODE---\n")[0]}
              onChange={(e) => {
                const codePart = ans.notes.split("\n---CODE---\n")[1] || "";
                updateAnswer(session.id, q.id, {
                  notes: codePart ? `${e.target.value}\n---CODE---\n${codePart}` : e.target.value,
                });
              }}
              rows={16}
              placeholder={`Plan first. Write the steps in plain English.

1. Brute force: O(n²) — for each pair check sum.
2. Better: use hash map, O(n).
3. Edge cases: empty array, single element, negatives.
4. Walk through example: [2,7,11,15] target=9.`}
              className="w-full bg-[var(--color-card-soft)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm leading-relaxed outline-none focus:border-[var(--color-neon)] resize-vertical"
            />
          ) : (
            <textarea
              value={ans.notes.split("\n---CODE---\n")[1] || ""}
              onChange={(e) => {
                const approachPart = ans.notes.split("\n---CODE---\n")[0] || "";
                updateAnswer(session.id, q.id, {
                  notes: `${approachPart}\n---CODE---\n${e.target.value}`,
                });
              }}
              rows={16}
              placeholder={`def solve(nums, target):
    # your code here
    pass`}
              className="w-full bg-[var(--color-input-strong)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-xs font-mono leading-relaxed outline-none focus:border-[var(--color-neon)] resize-vertical"
              spellCheck={false}
            />
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-5">
            <Button
              variant="ghost"
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
              disabled={idx === 0}
              size="sm"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </Button>
            {idx < questions.length - 1 ? (
              <Button onClick={() => setIdx((i) => Math.min(questions.length - 1, i + 1))} size="sm">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={() => setConfirmSubmit(true)} size="sm">
                <Send className="w-4 h-4" /> Submit
              </Button>
            )}
          </div>

          {/* LeetCode link */}
          {q.relatedLeetcode && (
            <a
              href={q.relatedLeetcode.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
            >
              <ExternalLink className="w-3 h-3" />
              LeetCode #{q.relatedLeetcode.number} — practice more after the test
            </a>
          )}
        </div>

        {/* PALETTE */}
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-2">Palette</div>
            <div className="grid grid-cols-3 gap-1.5">
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
                        ? "bg-[var(--color-line)] text-white"
                        : "bg-[var(--color-card-soft)] text-[var(--color-text-faint)] hover:text-[var(--color-text)] border border-[var(--color-line)]"
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

            <div className="mt-4 space-y-1.5 text-[10px] text-[var(--color-text-faint)] mono">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded bg-[var(--color-neon)]"></span> Current
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded bg-[var(--color-line)]"></span> Done
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded border border-[var(--color-neon)] bg-[var(--color-neon)]/10"></span>
                Flagged
              </div>
            </div>

            <Button onClick={() => setConfirmSubmit(true)} fullWidth className="mt-4" size="sm">
              <Send className="w-3.5 h-3.5" /> Submit
            </Button>
          </div>
        </div>
      </div>

      {/* SUBMIT CONFIRM MODAL */}
      {confirmSubmit && (
        <div className="fixed inset-0 z-50 bg-[var(--color-bg)]/85 backdrop-blur-sm grid place-items-center px-4">
          <Card className="max-w-md w-full">
            <h3 className="display text-2xl mb-2">Submit test?</h3>
            <p className="text-sm text-[var(--color-text-dim)] mb-4">
              You'll grade yourself with full solutions visible on the next screen.
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

// Lightweight markdown renderer: bold (**x**) + inline code (`x`) + paragraphs.
// We don't pull in a markdown lib because the problem statements are simple
// and we want to keep bundle size small.
function renderMarkdownLite(text: string): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const segs: React.ReactNode[] = [];
    let buf = "";
    let inCode = false;
    let inBold = false;
    let key = 0;
    for (let j = 0; j < line.length; j++) {
      if (line[j] === "`") {
        if (buf) {
          segs.push(inCode ? <code key={key++} className="font-mono bg-[var(--color-bg-soft)] px-1 py-0.5 rounded text-[0.95em] text-[var(--color-neon)]">{buf}</code> : <span key={key++}>{buf}</span>);
          buf = "";
        }
        inCode = !inCode;
      } else if (line[j] === "*" && line[j + 1] === "*") {
        if (buf) {
          segs.push(inBold ? <strong key={key++}>{buf}</strong> : <span key={key++}>{buf}</span>);
          buf = "";
        }
        inBold = !inBold;
        j++;
      } else {
        buf += line[j];
      }
    }
    if (buf) {
      segs.push(inCode ? <code key={key++} className="font-mono bg-[var(--color-bg-soft)] px-1 py-0.5 rounded text-[0.95em] text-[var(--color-neon)]">{buf}</code> : inBold ? <strong key={key++}>{buf}</strong> : <span key={key++}>{buf}</span>);
    }
    return (
      <div key={i} className={line.trim() === "" ? "h-3" : ""}>
        {segs}
      </div>
    );
  });
}
