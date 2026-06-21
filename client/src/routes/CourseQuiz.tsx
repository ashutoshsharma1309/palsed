import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronLeft, Award } from "lucide-react";
import { useLocalStorageState, LS_KEYS } from "../hooks/useLocalStorageState";
import { useMastery } from "../hooks/useMastery";
import { useSRS } from "../hooks/useSRS";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Loader } from "../components/ui/Loader";
import { ProgressBar } from "../components/ui/ProgressBar";
import { adjustDifficulty, rollingStdev } from "../lib/mastery";
import { apiPost } from "../lib/api";
import { issueCertificate, Certificate } from "../lib/certificate";
import type { AICourse } from "../types/course";
import type { Profile } from "./Onboarding";

const DEFAULT_PROFILE: Profile = {
  displayName: "Learner",
  avatarSeed: "x",
  joinedAt: new Date().toISOString(),
  learningGoal: "Master DSA",
  preferredStyle: "step_by_step",
  dailyMinutes: 30,
};

interface QQ {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  difficulty: number;
}

interface Outcome { correct: boolean; difficulty: number; msSpent: number }

export default function CourseQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courses] = useLocalStorageState<AICourse[]>(LS_KEYS.courses, []);
  const [profile] = useLocalStorageState<Profile>(LS_KEYS.profile, DEFAULT_PROFILE);
  const [certs, setCerts] = useLocalStorageState<Certificate[]>(LS_KEYS.certificates, []);
  const { record: recordMastery } = useMastery();
  const { add: addSRS } = useSRS();

  const course = courses.find((c) => c.id === id);
  const [diff, setDiff] = useState(
    Math.min(3, Math.max(1, Math.ceil(course?.level === "Beginner" ? 2 : course?.level === "Intermediate" ? 3 : 4)))
  );
  const [current, setCurrent] = useState<QQ | null>(null);
  const [loading, setLoading] = useState(true);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [microLesson, setMicroLesson] = useState<{ rootCause: string; microLesson: string; retryHint: string } | null>(null);
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [done, setDone] = useState(false);
  const [issued, setIssued] = useState<Certificate | null>(null);

  const topics = course?.final_quiz_topics?.join(", ") || course?.title || "general";

  const fetchNext = async (currentDiff: number, history: Outcome[]) => {
    setLoading(true);
    setCurrent(null);
    setPicked(null);
    setRevealed(false);
    setMicroLesson(null);
    try {
      const res = await apiPost<QQ>("/api/quiz/next", {
        topic: topics,
        history: history.slice(-6).map((h) => ({
          correct: h.correct,
          difficulty: h.difficulty,
          msSpent: h.msSpent,
        })),
        targetDifficulty: Math.round(currentDiff),
      });
      setCurrent(res);
      setQuestionStart(Date.now());
    } catch (e: any) {
      toast.error("Quiz fetch failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (course) fetchNext(diff, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?.id]);

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl py-32 text-center">
        <h1 className="display text-4xl">Course not found.</h1>
        <Link to="/courses" className="text-[var(--color-neon)] underline mt-3 inline-block">Back</Link>
      </div>
    );
  }

  const answer = async (idx: number) => {
    if (!current || revealed) return;
    setPicked(idx);
    setRevealed(true);
    const correct = idx === current.answerIndex;
    const ms = Date.now() - questionStart;
    const fast = ms < 25_000;
    const o: Outcome = { correct, difficulty: current.difficulty, msSpent: ms };
    setOutcomes((prev) => [...prev, o]);
    course.final_quiz_topics.forEach((t) => recordMastery(t, { correct }));
    // adjust difficulty
    setDiff((d) => adjustDifficulty(d, { correct, fast }));
    if (!correct) {
      addSRS({
        itemId: `quiz-${course.id}-${Date.now()}`,
        kind: "quiz",
        payload: { question: current.question, correct: current.options[current.answerIndex] },
      });
      try {
        const fb = await apiPost<{ rootCause: string; microLesson: string; retryHint: string }>(
          "/api/feedback/diagnose",
          {
            question: current.question,
            userAnswer: current.options[idx],
            correctAnswer: current.options[current.answerIndex],
          }
        );
        setMicroLesson(fb);
      } catch {}
    }
  };

  const advance = () => {
    const newOutcomes = outcomes;
    const stable = newOutcomes.length >= 5 &&
      rollingStdev(newOutcomes.slice(-5).map((o) => o.difficulty), 5) < 0.5;
    if (newOutcomes.length >= 10 || stable) {
      finalize();
    } else {
      fetchNext(diff, newOutcomes);
    }
  };

  const finalize = async () => {
    setDone(true);
    const score = outcomes.filter((o) => o.correct).length / Math.max(1, outcomes.length);
    const pass = (course.certificate_criteria?.passing_score ?? 0.7);
    if (score >= pass) {
      const cert = await issueCertificate({
        courseId: course.id,
        courseTitle: course.title,
        displayName: profile.displayName,
        score,
      });
      setCerts([cert, ...certs]);
      setIssued(cert);
      toast.success("Certificate issued!");
    } else {
      toast(`Score ${Math.round(score * 100)}% — below pass mark ${Math.round(pass * 100)}%`, { icon: "📚" });
    }
  };

  if (done) {
    const score = outcomes.filter((o) => o.correct).length / Math.max(1, outcomes.length);
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="display text-5xl mb-3">QUIZ COMPLETE.</h1>
        <Card>
          <div className="display text-7xl neon-text mb-2">{Math.round(score * 100)}%</div>
          <div className="text-white/60 mb-6">
            {outcomes.filter((o) => o.correct).length}/{outcomes.length} correct ·
            difficulty closed at {diff.toFixed(1)}/5
          </div>
          {issued ? (
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-[var(--color-neon)]" />
                <div className="display text-2xl">Certificate issued.</div>
              </div>
              <Link to="/certificates"><Button fullWidth>View certificate</Button></Link>
            </div>
          ) : (
            <div className="border-t border-white/10 pt-6">
              <div className="text-white/70 mb-3">
                Almost there. PrepPlace added your missed questions to your spaced-repetition queue —
                come back tomorrow for review and re-take.
              </div>
              <Link to="/review"><Button fullWidth variant="outline">Open review queue</Button></Link>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <Link to={`/courses/${course.id}`} className="text-xs text-white/40 hover:text-white inline-flex items-center gap-1 mb-3">
        <ChevronLeft className="w-3 h-3" /> {course.title}
      </Link>
      <div className="mono text-xs text-[var(--color-neon)] uppercase tracking-widest mb-2">
        // adaptive quiz · q{outcomes.length + 1} / ~10 · target diff {diff.toFixed(1)}/5
      </div>
      <h1 className="display text-4xl mb-4">FINAL QUIZ.</h1>

      <ProgressBar value={outcomes.length / 10} label={`Question ${outcomes.length + 1}/10`} />

      <Card className="mt-6">
        {loading || !current ? (
          <Loader label="Generating question" />
        ) : (
          <>
            <div className="mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
              difficulty {current.difficulty}/5
            </div>
            <div className="text-lg font-semibold mb-4">{current.question}</div>
            <div className="space-y-2">
              {current.options.map((opt, oi) => {
                const isAnswer = revealed && oi === current.answerIndex;
                const isPicked = revealed && oi === picked && oi !== current.answerIndex;
                return (
                  <button
                    key={oi}
                    disabled={revealed}
                    onClick={() => answer(oi)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isAnswer
                        ? "border-[var(--color-neon)] bg-[var(--color-neon)]/10"
                        : isPicked
                        ? "border-red-400 bg-red-400/10"
                        : "border-white/10 hover:border-white/30"
                    } disabled:cursor-default`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {revealed && (
              <div className="mt-4 p-4 rounded-lg bg-white/5">
                <div className="font-semibold mb-2">
                  {picked === current.answerIndex ? "✓ Correct" : "✗ Incorrect"}
                </div>
                <div className="text-sm text-white/70">{current.explanation}</div>
              </div>
            )}
            {microLesson && (
              <details className="mt-4 border border-[var(--color-neon)]/30 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-sm text-[var(--color-neon)]">
                  Micro-lesson · why this is tricky
                </summary>
                <div className="mt-3 space-y-2 text-sm text-white/80">
                  <div><strong>Root cause:</strong> {microLesson.rootCause}</div>
                  <div className="markdown-body">{microLesson.microLesson}</div>
                  <div className="text-xs text-white/50 italic">Retry hint: {microLesson.retryHint}</div>
                </div>
              </details>
            )}
            {revealed && (
              <Button className="mt-5" fullWidth onClick={advance}>
                {outcomes.length + 1 >= 10 ? "Finish" : "Next question →"}
              </Button>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
