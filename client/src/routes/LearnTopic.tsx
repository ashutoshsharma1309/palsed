// Topic lesson page — learning material (left) + a persistent checklist (right),
// with the question bank grouped Easy → Medium → Hard. Fully data-driven from
// data/dsa/roadmap.ts.
import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { usePageMeta } from "../hooks/usePageMeta";
import { LessonView } from "../components/lesson/LessonView";
import { QuestionCard } from "../components/question/QuestionCard";
import { Checklist } from "../components/checklist/Checklist";
import { getTopic, getPhase, TOPICS_ORDERED, type Difficulty, type Question } from "../data/dsa/roadmap";

const ORDER: Difficulty[] = ["Easy", "Medium", "Hard"];

export default function LearnTopic() {
  const { topicId } = useParams();
  const topic = topicId ? getTopic(topicId) : undefined;

  usePageMeta({
    title: topic ? `${topic.name} — DSA Roadmap` : "Topic",
    description: topic?.blurb,
    canonical: topic ? `/learn/${topic.id}` : "/dashboard",
  });

  const grouped = useMemo(() => {
    const g: Record<Difficulty, Question[]> = { Easy: [], Medium: [], Hard: [] };
    topic?.questions.forEach((q) => g[q.difficulty].push(q));
    return g;
  }, [topic]);

  if (!topic) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <h1 className="display text-4xl mb-3">Topic not found.</h1>
        <Link to="/dashboard"><Button variant="outline">Back to roadmap</Button></Link>
      </div>
    );
  }

  const phase = getPhase(topic.phaseId);
  const idx = TOPICS_ORDERED.findIndex((t) => t.id === topic.id);
  const prev = idx > 0 ? TOPICS_ORDERED[idx - 1] : null;
  const next = idx >= 0 && idx < TOPICS_ORDERED.length - 1 ? TOPICS_ORDERED[idx + 1] : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <Link to="/dashboard" className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)] inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Roadmap
      </Link>

      <header className="mb-8">
        {phase && <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">{phase.name}</div>}
        <h1 className="display text-4xl sm:text-5xl">{topic.name}.</h1>
        <p className="text-[var(--color-text-dim)] mt-2 max-w-2xl">{topic.blurb}</p>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
        {/* LEFT — lesson + questions */}
        <div className="min-w-0 space-y-6">
          {topic.lesson && (
            <Card>
              <LessonView lesson={topic.lesson} />
            </Card>
          )}

          <Card>
            <h3 className="display text-2xl mb-4">Practice.</h3>
            {topic.questions.length === 0 ? (
              <p className="text-sm text-[var(--color-text-faint)]">
                Curated problems for this topic are being added. Meanwhile, practice on the{" "}
                <Link to="/dsa" className="text-[var(--color-neon)] hover:underline">DSA hub →</Link>
              </p>
            ) : (
              <div className="space-y-6">
                {ORDER.map((d) =>
                  grouped[d].length ? (
                    <div key={d}>
                      <div className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)] mb-3">{d}</div>
                      <div className="space-y-3">
                        {grouped[d].map((q) => <QuestionCard key={q.id} q={q} />)}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </Card>

          {/* Prev / next topic */}
          <div className="flex items-center justify-between gap-3">
            {prev ? (
              <Link to={`/learn/${prev.id}`}><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /> {prev.name}</Button></Link>
            ) : <span />}
            {next ? (
              <Link to={`/learn/${next.id}`}><Button variant="outline" size="sm">{next.name} <ArrowRight className="w-4 h-4" /></Button></Link>
            ) : <span />}
          </div>
        </div>

        {/* RIGHT — checklist (sticky) */}
        <aside className="lg:sticky lg:top-20">
          <Card>
            <Checklist topicId={topic.id} />
          </Card>
        </aside>
      </div>
    </div>
  );
}
