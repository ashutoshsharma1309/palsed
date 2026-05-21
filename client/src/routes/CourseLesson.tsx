import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, Eye, FileCode, MessageSquare, ListOrdered, Sparkles, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useLocalStorageState, LS_KEYS } from "../hooks/useLocalStorageState";
import { useMastery } from "../hooks/useMastery";
import { useSRS } from "../hooks/useSRS";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Loader } from "../components/ui/Loader";
import { MarkdownView } from "../components/lesson/MarkdownView";
import { MermaidDiagram } from "../components/lesson/MermaidDiagram";
import { apiPost } from "../lib/api";
import type { AICourse, LessonProgress, Style } from "../types/course";
import type { Profile } from "./Onboarding";

const DEFAULT_PROFILE: Profile = {
  displayName: "Learner",
  avatarSeed: "x",
  joinedAt: new Date().toISOString(),
  learningGoal: "Master DSA",
  preferredStyle: "step_by_step",
  dailyMinutes: 30,
};

const STYLE_TABS: Array<{ id: Style; label: string; icon: React.ReactNode }> = [
  { id: "visual", label: "Visual", icon: <Eye className="w-4 h-4" /> },
  { id: "code_first", label: "Code-first", icon: <FileCode className="w-4 h-4" /> },
  { id: "analogy", label: "Analogy", icon: <MessageSquare className="w-4 h-4" /> },
  { id: "step_by_step", label: "Step-by-step", icon: <ListOrdered className="w-4 h-4" /> },
];

function nextBestStyle(cur: Style): Style {
  const order: Style[] = ["analogy", "step_by_step", "visual", "code_first"];
  const idx = order.indexOf(cur);
  return order[(idx + 1) % order.length];
}

export default function CourseLesson() {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const [courses] = useLocalStorageState<AICourse[]>(LS_KEYS.courses, []);
  const [profile] = useLocalStorageState<Profile>(LS_KEYS.profile, DEFAULT_PROFILE);
  const [progress, setProgress] = useLocalStorageState<Record<string, LessonProgress>>(LS_KEYS.lessons, {});
  const { record: recordMastery } = useMastery();
  const { add: addSRS } = useSRS();

  const course = courses.find((c) => c.id === id);
  const lessonContext = useMemo(() => {
    if (!course) return null;
    for (let i = 0; i < course.chapters.length; i++) {
      const ch = course.chapters[i];
      const li = ch.lessons.findIndex((l) => l.id === lessonId);
      if (li !== -1) {
        const lesson = ch.lessons[li];
        const flat = course.chapters.flatMap((c) => c.lessons.map((l) => ({ chId: c.id, lId: l.id })));
        const flatIdx = flat.findIndex((f) => f.lId === lessonId);
        return {
          chapter: ch,
          lesson,
          chapterIdx: i,
          lessonIdx: li,
          prev: flat[flatIdx - 1],
          next: flat[flatIdx + 1],
        };
      }
    }
    return null;
  }, [course, lessonId]);

  const progressKey = `${id}:${lessonId}`;
  const stored = progress[progressKey];

  const [style, setStyle] = useState<Style>(stored?.preferredStyle ?? profile.preferredStyle);
  const [stuckLoading, setStuckLoading] = useState(false);
  const [stuckResult, setStuckResult] = useState<{ style: Style; reply: string } | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [tStart] = useState(Date.now());

  // Listen for global "switch style" event from InterventionToast
  useEffect(() => {
    const onSwitch = () => {
      const next = nextBestStyle(style);
      setStyle(next);
      toast(`Switched to ${next.replace("_", " ")} style`);
      triggerStuck(next);
    };
    const onShorten = () => {
      toast("Marking lesson complete and moving on");
      complete(0.5);
    };
    window.addEventListener("palsed:stuck:switch-style", onSwitch);
    window.addEventListener("palsed:stuck:shorten", onShorten);
    return () => {
      window.removeEventListener("palsed:stuck:switch-style", onSwitch);
      window.removeEventListener("palsed:stuck:shorten", onShorten);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style]);

  useEffect(() => {
    setProgress((prev) => ({
      ...prev,
      [progressKey]: {
        status: prev[progressKey]?.status ?? "in_progress",
        attempts: (prev[progressKey]?.attempts ?? 0) + 1,
        score: prev[progressKey]?.score,
        masteryScore: prev[progressKey]?.masteryScore,
        lastAt: new Date().toISOString(),
        msSpent: prev[progressKey]?.msSpent ?? 0,
        extraExplanations: prev[progressKey]?.extraExplanations,
        preferredStyle: style,
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressKey]);

  if (!course || !lessonContext) {
    return (
      <div className="mx-auto max-w-3xl py-32 text-center">
        <h1 className="display text-4xl">Lesson not found.</h1>
        <Link to="/courses" className="text-[var(--color-neon)] underline mt-3 inline-block">Back to courses</Link>
      </div>
    );
  }

  const { lesson, chapter, prev, next } = lessonContext;
  const exp = lesson.explanations[style];

  const triggerStuck = async (targetStyle: Style) => {
    setStuckLoading(true);
    setStuckResult(null);
    try {
      const original = lesson.explanations[style].markdown;
      const res = await apiPost<{ reply: string }>("/api/tutor/rexplain", {
        lessonId: lesson.id,
        originalContent: original,
        style: targetStyle,
      });
      setStuckResult({ style: targetStyle, reply: res.reply });
      setProgress((prev) => ({
        ...prev,
        [progressKey]: {
          ...prev[progressKey]!,
          extraExplanations: [
            ...(prev[progressKey]?.extraExplanations ?? []),
            { style: targetStyle, markdown: res.reply, at: new Date().toISOString() },
          ],
        },
      }));
    } catch (e: any) {
      toast.error("Re-explanation failed: " + e.message);
    } finally {
      setStuckLoading(false);
    }
  };

  const answer = (qIdx: number, choice: number) => {
    if (revealed[qIdx]) return;
    setAnswers((a) => ({ ...a, [qIdx]: choice }));
    setRevealed((r) => ({ ...r, [qIdx]: true }));
    const correct = choice === lesson.check_questions[qIdx].answerIndex;
    chapter.mastery_topics.forEach((t) => recordMastery(t, { correct }));
    if (!correct) {
      addSRS({
        itemId: `course-${course.id}-${lesson.id}-q${qIdx}`,
        kind: "concept",
        payload: {
          question: lesson.check_questions[qIdx].question,
          correct: lesson.check_questions[qIdx].options[lesson.check_questions[qIdx].answerIndex],
        },
      });
    }
  };

  const complete = (score = 1) => {
    const elapsed = Date.now() - tStart;
    setProgress((prev) => ({
      ...prev,
      [progressKey]: {
        ...prev[progressKey]!,
        status: "complete",
        score,
        lastAt: new Date().toISOString(),
        msSpent: (prev[progressKey]?.msSpent ?? 0) + elapsed,
      },
    }));
    toast.success("Lesson complete");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <Link to={`/courses/${course.id}`} className="text-xs text-white/40 hover:text-white inline-flex items-center gap-1 mb-3">
        <ChevronLeft className="w-3 h-3" /> {course.title}
      </Link>
      <div className="mono text-xs text-[var(--color-neon)] uppercase tracking-widest mb-2">
        chapter {lessonContext.chapterIdx + 1} · lesson {lessonContext.lessonIdx + 1} · difficulty {lesson.difficulty}/5
      </div>
      <h1 className="display text-4xl sm:text-5xl mb-6">{lesson.title}</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {STYLE_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setStyle(t.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              style === t.id
                ? "bg-[var(--color-neon)] text-black"
                : "border border-white/20 text-white/70 hover:border-[var(--color-neon)]"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={() => triggerStuck(nextBestStyle(style))}
          disabled={stuckLoading}
          className="ml-auto"
        >
          <AlertCircle className="w-4 h-4" /> {stuckLoading ? "Re-explaining…" : "I'm stuck"}
        </Button>
      </div>

      <Card className="mb-6">
        <MarkdownView>{exp.markdown}</MarkdownView>

        {style === "visual" && exp && (exp as any).diagram_mermaid && (
          <MermaidDiagram source={(exp as any).diagram_mermaid} />
        )}

        {style === "code_first" && (exp as any).code_examples?.map((ex: any, i: number) => (
          <div key={i} className="mt-4">
            <div className="text-xs text-white/50 mono mb-1">{ex.lang}</div>
            <pre className="bg-[#0d0d0d] p-3 rounded-lg overflow-x-auto"><code className={`language-${ex.lang} hljs`}>{ex.code}</code></pre>
            <div className="text-sm text-white/70 mt-2">{ex.explanation}</div>
          </div>
        ))}

        {style === "analogy" && (exp as any).analogies?.map((a: any, i: number) => (
          <div key={i} className="mt-4 border-l-2 border-[var(--color-neon)] pl-4">
            <div className="text-xs uppercase tracking-widest text-[var(--color-neon)] mono mb-1">Real-world</div>
            <div className="text-white">{a.real_world}</div>
            <div className="text-xs uppercase tracking-widest text-white/50 mono mt-2 mb-1">Mapping</div>
            <div className="text-white/80 text-sm">{a.mapping}</div>
          </div>
        ))}

        {style === "step_by_step" && (exp as any).steps?.map((s: any, i: number) => (
          <div key={i} className="mt-4 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[var(--color-neon)] text-black flex items-center justify-center font-bold text-xs shrink-0">
              {i + 1}
            </div>
            <div>
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm text-white/70 mt-0.5">{s.detail}</div>
            </div>
          </div>
        ))}
      </Card>

      {stuckLoading && <Loader label="Re-explaining" />}

      {stuckResult && (
        <Card className="mb-6 border-[var(--color-neon)]/40">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[var(--color-neon)]" />
            <div className="mono text-xs uppercase tracking-widest text-[var(--color-neon)]">
              Fresh take · {stuckResult.style.replace("_", " ")}
            </div>
          </div>
          <MarkdownView>{stuckResult.reply}</MarkdownView>
        </Card>
      )}

      {lesson.check_questions.length > 0 && (
        <Card className="mb-6">
          <h3 className="display text-2xl mb-4">CHECK YOUR UNDERSTANDING.</h3>
          <div className="space-y-6">
            {lesson.check_questions.map((q, qi) => (
              <div key={qi}>
                <div className="font-semibold mb-3">{qi + 1}. {q.question}</div>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const isAnswer = revealed[qi] && oi === q.answerIndex;
                    const isWrong = revealed[qi] && oi === answers[qi] && oi !== q.answerIndex;
                    return (
                      <button
                        key={oi}
                        onClick={() => answer(qi, oi)}
                        disabled={revealed[qi]}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          isAnswer
                            ? "border-[var(--color-neon)] bg-[var(--color-neon)]/10"
                            : isWrong
                            ? "border-red-400 bg-red-400/10"
                            : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border ${isAnswer ? "bg-[var(--color-neon)] text-black border-transparent" : "border-white/30"} flex items-center justify-center text-[10px]`}>
                            {isAnswer && <Check className="w-3 h-3" />}
                          </div>
                          <span className="text-sm">{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {revealed[qi] && (
                  <div className="mt-3 text-sm text-white/70 p-3 rounded-lg bg-white/5">
                    <strong>{answers[qi] === q.answerIndex ? "Correct!" : "Not quite —"}</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2">
          {prev && (
            <Link to={`/courses/${course.id}/lesson/${prev.lId}`}>
              <Button variant="ghost"><ChevronLeft className="w-4 h-4" /> Prev</Button>
            </Link>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => complete(1)}>
            <Check className="w-4 h-4" /> Mark complete
          </Button>
          {next ? (
            <Link to={`/courses/${course.id}/lesson/${next.lId}`}>
              <Button>Next <ChevronRight className="w-4 h-4" /></Button>
            </Link>
          ) : (
            <Link to={`/courses/${course.id}/quiz`}>
              <Button>Take final quiz →</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
