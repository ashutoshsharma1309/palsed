// Unified lesson page for every domain (DSA / Web / AI) at
// /learn/:domain/:topicId. Renders the content-engine lesson as a comfortable
// article with a sticky table of contents + checklist, a reading-progress bar,
// an immersive reading mode, and prev/next navigation. Legacy /learn/:topicId
// (DSA) is unaffected — this is additive.
import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Maximize2, Minimize2, Lock } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Loader } from "../components/ui/Loader";
import { usePageMeta } from "../hooks/usePageMeta";
import { LessonArticle } from "../components/lesson/LessonArticle";
import { Toc } from "../components/lesson/Toc";
import { ReadingProgress } from "../components/lesson/ReadingProgress";
import { Checklist } from "../components/checklist/Checklist";
import { useLessonContent } from "../hooks/useLessonContent";
import { DOMAINS, DOMAIN_META, checklistForLesson } from "../content/registry";
import type { Domain, LessonDifficulty } from "../content/types";

const DIFF_CLASS: Record<LessonDifficulty, string> = {
  Beginner: "diff-pill diff-easy",
  Intermediate: "diff-pill diff-medium",
  Advanced: "diff-pill diff-hard",
};

function useImmersive(): [boolean, () => void] {
  const [on, setOn] = useState(false);
  useEffect(() => {
    document.body.classList.toggle("reading-immersive", on);
    return () => document.body.classList.remove("reading-immersive");
  }, [on]);
  return [on, () => setOn((v) => !v)];
}

export default function Lesson() {
  const { domain, topicId } = useParams<{ domain: string; topicId: string }>();
  const isDomain = !!domain && (DOMAINS as string[]).includes(domain);
  const state = useLessonContent(isDomain ? (domain as Domain) : undefined, topicId);
  const [immersive, toggleImmersive] = useImmersive();

  const lesson = state.data?.lesson;
  usePageMeta({
    title: lesson ? `${lesson.title} — ${DOMAIN_META[lesson.domain].label}` : "Lesson",
    description: lesson?.objective,
    canonical: domain && topicId ? `/learn/${domain}/${topicId}` : "/dashboard",
  });

  if (!isDomain) return <Navigate to="/dashboard" replace />;

  if (state.status === "loading") {
    return <div className="py-32"><Loader label="Loading lesson" /></div>;
  }

  if (state.status === "not-found" || !state.data) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <h1 className="display text-4xl mb-3">Lesson not found.</h1>
        <Link to="/dashboard"><Button variant="outline">Back to dashboard</Button></Link>
      </div>
    );
  }

  const { lesson: L, module, prev, next, index, total } = state.data;
  const meta = DOMAIN_META[L.domain];
  const checklist = checklistForLesson(L);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <ReadingProgress />

      <div className="flex items-center justify-between gap-3 mb-4">
        <Link to={`/learn/${L.domain}`} className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)] inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> {meta.label}
        </Link>
        {/* Right-padded so it never sits under the floating Pomodoro "Focus"
            button (components/adaptive/FocusMode). Named "Immersive" to stay
            distinct from that timer feature. */}
        <button
          onClick={toggleImmersive}
          className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)] inline-flex items-center gap-1.5 mr-24 sm:mr-28"
          aria-pressed={immersive}
        >
          {immersive
            ? <><Minimize2 className="w-3.5 h-3.5" /> Exit immersive</>
            : <><Maximize2 className="w-3.5 h-3.5" /> Immersive</>}
        </button>
      </div>

      <header className="mb-8">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon-text)] mb-2">{module.title}</div>
        <h1 className="display text-4xl sm:text-5xl">{L.title}.</h1>
        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
          <span className={DIFF_CLASS[L.difficulty]}>{L.difficulty}</span>
          <span className="inline-flex items-center gap-1 text-[var(--color-text-faint)]">
            <Clock className="w-3.5 h-3.5" /> {L.estMinutes} min read
          </span>
          <span className="text-[var(--color-text-faint)]">Lesson {index + 1} of {total}</span>
        </div>
        {L.prerequisites && L.prerequisites.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-[var(--color-text-faint)]">
            <Lock className="w-3.5 h-3.5" /> Prerequisites:
            {L.prerequisites.map((pid) => (
              <Link key={pid} to={`/learn/${L.domain}/${pid}`} className="text-[var(--color-neon-text)] hover:underline">{pid}</Link>
            ))}
          </div>
        )}
      </header>

      <div className={immersive ? "max-w-3xl mx-auto" : "grid lg:grid-cols-[minmax(0,1fr)_260px] gap-8 items-start"}>
        <div className="min-w-0">
          <Card>
            <LessonArticle lesson={L} />
          </Card>

          <div className="flex items-center justify-between gap-3 mt-6">
            {prev ? (
              <Link to={`/learn/${L.domain}/${prev.id}`}><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /> {prev.title}</Button></Link>
            ) : <span />}
            {next ? (
              <Link to={`/learn/${L.domain}/${next.id}`}><Button variant="outline" size="sm">{next.title} <ArrowRight className="w-4 h-4" /></Button></Link>
            ) : <span />}
          </div>
        </div>

        {!immersive && (
          <aside className="lg:sticky lg:top-20 space-y-4 order-first lg:order-none">
            <Card><Toc lessonId={L.id} /></Card>
            <Card><Checklist id={L.id} items={checklist} /></Card>
          </aside>
        )}
      </div>
    </div>
  );
}
