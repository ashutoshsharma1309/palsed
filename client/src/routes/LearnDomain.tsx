// /learn/:domain — the module + lesson index for one domain. Doubles as the
// legacy-route dispatcher: a single segment that isn't a known domain (e.g. an
// old /learn/loops DSA deep-link) redirects into the unified engine at
// /learn/dsa/<seg>, so every existing bookmark keeps working.
import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Circle, Clock } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Loader } from "../components/ui/Loader";
import { usePageMeta } from "../hooks/usePageMeta";
import { useLearningProgress } from "../hooks/useLearningProgress";
import { loadDomain, DOMAINS, DOMAIN_META, isLessonComplete } from "../content/registry";
import type { Domain, Module, Lesson, LessonDifficulty } from "../content/types";

const DIFF_CLASS: Record<LessonDifficulty, string> = {
  Beginner: "diff-pill diff-easy",
  Intermediate: "diff-pill diff-medium",
  Advanced: "diff-pill diff-hard",
};

function LessonRow({ lesson }: { lesson: Lesson }) {
  const { isChecked } = useLearningProgress();
  const done = isLessonComplete(isChecked, lesson);
  return (
    <Link
      to={`/learn/${lesson.domain}/${lesson.id}`}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[var(--color-card)] transition-colors"
    >
      {done ? (
        <CheckCircle2 className="w-5 h-5 text-[var(--color-neon)] shrink-0" />
      ) : (
        <Circle className="w-5 h-5 text-[var(--color-text-faint)] shrink-0" />
      )}
      <span className={`flex-1 text-[15px] ${done ? "text-[var(--color-text-faint)]" : "text-[var(--color-text)]"}`}>
        {lesson.title}
      </span>
      <span className={`${DIFF_CLASS[lesson.difficulty]} hidden sm:inline`}>{lesson.difficulty}</span>
      <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[var(--color-text-faint)]">
        <Clock className="w-3.5 h-3.5" />{lesson.estMinutes}m
      </span>
    </Link>
  );
}

export default function LearnDomain() {
  const { domain } = useParams<{ domain: string }>();
  const isDomain = !!domain && (DOMAINS as string[]).includes(domain);
  const [modules, setModules] = useState<Module[] | null>(null);

  useEffect(() => {
    if (!isDomain) return;
    let cancelled = false;
    setModules(null);
    loadDomain(domain as Domain).then((m) => !cancelled && setModules(m));
    return () => { cancelled = true; };
  }, [domain, isDomain]);

  const meta = isDomain ? DOMAIN_META[domain as Domain] : null;
  usePageMeta({
    title: meta ? `${meta.label} — Learn` : "Learn",
    description: meta?.blurb,
    canonical: `/learn/${domain}`,
  });

  // Legacy single-segment DSA topic → redirect into the unified engine.
  if (!isDomain) return <Navigate to={`/learn/dsa/${domain}`} replace />;

  if (!modules) return <div className="py-32"><Loader label="Loading track" /></div>;

  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <Link to="/learn" className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)] inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> All tracks
      </Link>

      <header className="mb-8">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon-text)] mb-2">{domain}</div>
        <h1 className="display text-4xl sm:text-5xl">{meta!.label}.</h1>
        <p className="text-[var(--color-text-dim)] mt-2 max-w-2xl">{meta!.blurb}</p>
        <p className="mono text-xs text-[var(--color-text-faint)] mt-3">
          {modules.length} module{modules.length > 1 ? "s" : ""} · {totalLessons} lesson{totalLessons > 1 ? "s" : ""}
        </p>
      </header>

      <div className="space-y-6">
        {modules.map((m) => (
          <Card key={m.id}>
            <h2 className="text-lg font-bold">{m.title}</h2>
            {m.summary && <p className="text-sm text-[var(--color-text-dim)] mt-1 mb-3">{m.summary}</p>}
            <div className="space-y-0.5">
              {m.lessons.map((l) => <LessonRow key={l.id} lesson={l} />)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
