// Inline lesson quiz engine. Renders a mixed set of question types (MCQ,
// true/false, fill-in-the-blank, predict-the-output, small coding challenge)
// with immediate feedback + explanation after answering. Results persist
// per-user so the checklist/gamification can derive completion. No AI, no
// network — deterministic and offline (the coding challenge runs in the
// existing sandboxed Web-Worker CodeRunner).
import { useMemo, useState } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import { Button } from "../ui/Button";
import { MarkdownView } from "./MarkdownView";
import { CodeRunner } from "../dsa/CodeRunner";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { QUIZ_STORE_KEY, type QuizResult, type QuizStore } from "../../lib/quizStore";
import type { QuizQuestion } from "../../content/types";

type Result = QuizResult;

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

function Feedback({ ok, explanation }: { ok: boolean; explanation: string }) {
  return (
    <div
      className={`mt-3 rounded-xl border p-3 ${
        ok
          ? "border-[var(--diff-easy-text)]/40 bg-[var(--diff-easy-bg)]"
          : "border-[var(--severity-warn-border)] bg-[var(--severity-warn-bg)]"
      }`}
    >
      <div className="flex items-center gap-2 mb-1 text-sm font-semibold">
        {ok ? (
          <span className="inline-flex items-center gap-2 text-[var(--diff-easy-text)]"><Check className="w-4 h-4" /> Correct</span>
        ) : (
          <span className="inline-flex items-center gap-2 text-[var(--severity-warn-text)]"><X className="w-4 h-4" /> Not quite</span>
        )}
      </div>
      <div className="text-[14px] leading-relaxed text-[var(--color-text-dim)]">
        <MarkdownView>{explanation}</MarkdownView>
      </div>
    </div>
  );
}

function QuestionBlock({
  q,
  lessonId,
  record,
}: {
  q: QuizQuestion;
  lessonId: string;
  record: (qid: string, r: Result) => void;
}) {
  const [choice, setChoice] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [answered, setAnswered] = useState<null | boolean>(null); // null = unanswered

  const submit = (ok: boolean) => {
    setAnswered(ok);
    record(q.id, ok ? "correct" : "attempted");
  };

  const reset = () => {
    setAnswered(null);
    setChoice(null);
    setText("");
  };

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)] p-4 sm:p-5">
      <div className="text-[15px] font-medium text-[var(--color-text)] mb-3">
        <MarkdownView>{q.prompt}</MarkdownView>
      </div>

      {/* ── MCQ ── */}
      {q.type === "mcq" && (
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const chosen = choice === i;
            const reveal = answered !== null;
            const isAnswer = i === q.answerIndex;
            const tone = reveal
              ? isAnswer
                ? "border-[var(--diff-easy-text)]/50 bg-[var(--diff-easy-bg)]"
                : chosen
                ? "border-[var(--severity-warn-border)] bg-[var(--severity-warn-bg)]"
                : "border-[var(--color-line)]"
              : chosen
              ? "border-[var(--color-neon)]"
              : "border-[var(--color-line)] hover:border-[var(--color-text-faint)]";
            return (
              <button
                key={i}
                disabled={reveal}
                onClick={() => setChoice(i)}
                className={`w-full text-left rounded-xl border px-3.5 py-2.5 text-[14px] transition-colors ${tone}`}
              >
                {opt}
              </button>
            );
          })}
          {answered === null && (
            <Button size="sm" disabled={choice === null} onClick={() => submit(choice === q.answerIndex)}>
              Check
            </Button>
          )}
        </div>
      )}

      {/* ── True / False ── */}
      {q.type === "truefalse" && answered === null && (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => submit(q.answer === true)}>True</Button>
          <Button size="sm" variant="outline" onClick={() => submit(q.answer === false)}>False</Button>
        </div>
      )}

      {/* ── Fill in the blank ── */}
      {q.type === "fill" && answered === null && (
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={q.placeholder ?? "Your answer"}
            onKeyDown={(e) => e.key === "Enter" && text.trim() && submit(q.answers.some((a) => norm(a) === norm(text)))}
            className="flex-1 rounded-xl border border-[var(--color-line)] bg-[var(--color-input)] px-3.5 py-2.5 text-[14px] outline-none focus:border-[var(--color-neon)]"
          />
          <Button size="sm" disabled={!text.trim()} onClick={() => submit(q.answers.some((a) => norm(a) === norm(text)))}>
            Check
          </Button>
        </div>
      )}

      {/* ── Predict the output ── */}
      {q.type === "output" && (
        <div>
          <MarkdownView>{`\`\`\`${q.language ?? "js"}\n${q.code}\n\`\`\``}</MarkdownView>
          {answered === null && (
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Predicted output"
                onKeyDown={(e) => e.key === "Enter" && text.trim() && submit(q.answers.some((a) => norm(a) === norm(text)))}
                className="flex-1 rounded-xl border border-[var(--color-line)] bg-[var(--color-input)] px-3.5 py-2.5 text-[14px] mono outline-none focus:border-[var(--color-neon)]"
              />
              <Button size="sm" disabled={!text.trim()} onClick={() => submit(q.answers.some((a) => norm(a) === norm(text)))}>
                Check
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── Small coding challenge ── */}
      {q.type === "code" && (
        <div>
          <CodeRunner
            storageKey={`quiz.${lessonId}.${q.id}`}
            starter={q.starter}
            onResult={(out) => {
              const ok = norm(out) === norm(q.expectedOutput);
              submit(ok);
            }}
          />
          {answered === null && (
            <p className="mono text-[11px] text-[var(--color-text-faint)] mt-2">
              Run your code — it's graded automatically against the expected output.
            </p>
          )}
        </div>
      )}

      {answered !== null && <Feedback ok={answered} explanation={q.explanation} />}
      {answered !== null && q.type !== "code" && (
        <button onClick={reset} className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)]">
          <RotateCcw className="w-3 h-3" /> Try again
        </button>
      )}
    </div>
  );
}

export function Quiz({ lessonId, questions }: { lessonId: string; questions: QuizQuestion[] }) {
  const [store, setStore] = useLocalStorageState<QuizStore>(QUIZ_STORE_KEY, {});

  const record = (qid: string, r: Result) => {
    const key = `${lessonId}:${qid}`;
    setStore((prev) => {
      // never downgrade a previously-correct answer
      if (prev[key] === "correct" && r === "attempted") return prev;
      return { ...prev, [key]: r };
    });
  };

  const correct = useMemo(
    () => questions.filter((q) => store[`${lessonId}:${q.id}`] === "correct").length,
    [questions, store, lessonId]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[var(--color-text-faint)]">
          {questions.length} question{questions.length > 1 ? "s" : ""} · answer to reveal the explanation
        </p>
        <span className="mono text-[11px] text-[var(--color-text-faint)]">{correct}/{questions.length} correct</span>
      </div>
      {questions.map((q) => (
        <QuestionBlock key={q.id} q={q} lessonId={lessonId} record={record} />
      ))}
    </div>
  );
}
