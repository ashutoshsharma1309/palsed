import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Circle, ChevronLeft } from "lucide-react";
import { useLocalStorageState, LS_KEYS } from "../hooks/useLocalStorageState";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";
import type { AICourse, LessonProgress } from "../types/course";

export default function CourseDetail() {
  const { id } = useParams();
  const [courses] = useLocalStorageState<AICourse[]>(LS_KEYS.courses, []);
  const [progress] = useLocalStorageState<Record<string, LessonProgress>>(LS_KEYS.lessons, {});
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl py-32 text-center">
        <h1 className="display text-4xl">Course not found.</h1>
        <Link to="/courses" className="text-[var(--color-neon)] underline mt-4 inline-block">Back to courses</Link>
      </div>
    );
  }

  const totalLessons = course.chapters.reduce((a, ch) => a + ch.lessons.length, 0);
  const completed = course.chapters.reduce(
    (a, ch) => a + ch.lessons.filter((l) => progress[`${course.id}:${l.id}`]?.status === "complete").length,
    0
  );

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <Link to="/courses" className="text-xs text-white/40 hover:text-white inline-flex items-center gap-1 mb-3">
        <ChevronLeft className="w-3 h-3" /> Back to courses
      </Link>
      <div className="mono text-xs text-[var(--color-neon)] uppercase tracking-widest mb-2">
        {course.level} · {course.estimated_hours}h · {totalLessons} lessons
      </div>
      <h1 className="display text-5xl sm:text-6xl mb-3">{course.title}</h1>
      <p className="text-white/70 max-w-3xl mb-6">{course.description}</p>

      <ProgressBar value={totalLessons ? completed / totalLessons : 0} label={`Course progress · ${completed}/${totalLessons}`} />

      {course.prerequisites?.length > 0 && (
        <Card className="mt-6">
          <div className="mono text-xs uppercase tracking-widest text-white/50 mb-2">Prerequisites</div>
          <ul className="list-disc pl-5 text-sm text-white/80 space-y-1">
            {course.prerequisites.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </Card>
      )}

      <div className="mt-8 space-y-6">
        {course.chapters.map((ch, idx) => {
          const chCompleted = ch.lessons.filter((l) => progress[`${course.id}:${l.id}`]?.status === "complete").length;
          return (
            <Card key={ch.id}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="mono text-xs text-[var(--color-neon)]">CHAPTER {idx + 1}</div>
                  <h2 className="display text-2xl mt-1">{ch.title}</h2>
                  <p className="text-sm text-white/60 mt-1">{ch.summary}</p>
                </div>
                <div className="text-right">
                  <div className="mono text-xs text-white/40">{chCompleted}/{ch.lessons.length}</div>
                </div>
              </div>
              <ul className="space-y-2 mt-4">
                {ch.lessons.map((l) => {
                  const done = progress[`${course.id}:${l.id}`]?.status === "complete";
                  return (
                    <li key={l.id}>
                      <Link
                        to={`/courses/${course.id}/lesson/${l.id}`}
                        className="flex items-center justify-between gap-3 p-3 rounded-lg border border-white/5 hover:border-[var(--color-neon)]/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {done ? (
                            <CheckCircle2 className="w-4 h-4 text-[var(--color-neon)] shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-white/20 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">{l.title}</div>
                            <div className="mono text-xs text-white/40">
                              difficulty {l.difficulty}/5 · {l.estimated_minutes}min · {l.check_questions.length} checks
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-white/40 shrink-0">{done ? "Done" : "Start →"}</div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="display text-2xl">FINAL ADAPTIVE QUIZ.</h2>
          <p className="text-sm text-white/60 mt-1">
            Pass at {Math.round((course.certificate_criteria?.passing_score ?? 0.7) * 100)}% to earn a certificate.
          </p>
        </div>
        <Link to={`/courses/${course.id}/quiz`}>
          <Button size="lg">Take the quiz →</Button>
        </Link>
      </Card>
    </div>
  );
}
