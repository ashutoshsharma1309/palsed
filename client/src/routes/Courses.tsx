import { Link } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useLocalStorageState, LS_KEYS } from "../hooks/useLocalStorageState";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";
import type { AICourse, LessonProgress } from "../types/course";

export default function Courses() {
  const [courses, setCourses] = useLocalStorageState<AICourse[]>(LS_KEYS.courses, []);
  const [progress] = useLocalStorageState<Record<string, LessonProgress>>(LS_KEYS.lessons, {});

  const remove = (id: string) => {
    if (!confirm("Delete this course? Your lesson progress for it stays.")) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
    toast.success("Deleted");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// ai-generated courses</div>
          <h1 className="display text-5xl sm:text-7xl">COURSES.</h1>
          <p className="text-white/60 mt-2">Multi-style, adaptive courses. Each lesson has 4 explanation angles.</p>
        </div>
        <Link to="/courses/create">
          <Button size="lg"><Plus className="w-4 h-4" /> Generate a new course</Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <Card className="text-center py-20">
          <div className="display text-4xl mb-3">NO COURSES YET.</div>
          <p className="text-white/60 mb-5">Generate one tailored to your weak topics.</p>
          <Link to="/courses/create"><Button>Generate first course</Button></Link>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c) => {
            const totalLessons = c.chapters.reduce((a, ch) => a + ch.lessons.length, 0);
            const completed = c.chapters.reduce(
              (a, ch) => a + ch.lessons.filter((l) => progress[`${c.id}:${l.id}`]?.status === "complete").length,
              0
            );
            const frac = totalLessons ? completed / totalLessons : 0;
            return (
              <Card key={c.id} className="relative group">
                <button
                  className="absolute top-4 right-4 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => remove(c.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="mono text-xs text-[var(--color-neon)] uppercase tracking-widest mb-2">
                  {c.level} · {c.estimated_hours}h
                </div>
                <h3 className="display text-2xl mb-2 leading-tight">{c.title}</h3>
                <p className="text-sm text-white/60 mb-4 line-clamp-3">{c.description}</p>
                <ProgressBar value={frac} label={`${completed}/${totalLessons} lessons`} />
                <Link to={`/courses/${c.id}`} className="block mt-4">
                  <Button fullWidth size="sm">Open</Button>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
