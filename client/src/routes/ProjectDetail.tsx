// Individual project build guide — objective, features, folder structure, tech,
// stretch goals, future improvements. Left content + right sticky "build" rail.
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Target,
  ListChecks,
  FolderTree,
  Cpu,
  Rocket,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { usePageMeta } from "../hooks/usePageMeta";
import { useLearningProgress } from "../hooks/useLearningProgress";
import { getDomain, getProject } from "../data/projects";

const LEVEL_TONE: Record<string, string> = {
  Beginner: "diff-easy",
  Intermediate: "diff-medium",
  Advanced: "diff-hard",
};

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-7">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[var(--color-neon)]">{icon}</span>
        <h3 className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)]">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export default function ProjectDetail() {
  const { domainId, projectId } = useParams();
  const found = domainId && projectId ? getProject(domainId, projectId) : undefined;
  const { isChecked, toggleChecklist } = useLearningProgress();

  usePageMeta({
    title: found ? `${found.project.name} — ${found.domain.title} project guide` : "Project",
    description: found?.project.blurb,
    canonical: found ? `/projects/${found.domain.id}/${found.project.id}` : "/projects",
  });

  if (!found) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <h1 className="display text-4xl mb-3">Project not found.</h1>
        <Link to="/projects" className="text-[var(--color-neon-text)] underline">
          Back to projects
        </Link>
      </div>
    );
  }

  const { domain, project } = found;
  const built = isChecked(domain.id, `built:${project.id}`);

  const idx = domain.projects.findIndex((p) => p.id === project.id);
  const prev = idx > 0 ? domain.projects[idx - 1] : null;
  const next = idx >= 0 && idx < domain.projects.length - 1 ? domain.projects[idx + 1] : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="text-xs text-[var(--color-text-faint)] mb-4 flex items-center gap-1.5 flex-wrap">
        <Link to="/projects" className="hover:text-[var(--color-text)]">Projects</Link>
        <span>/</span>
        <Link to={`/projects/${domain.id}`} className="hover:text-[var(--color-text)]">{domain.title}</Link>
      </div>

      <header className="mb-8">
        <div className={`diff-pill ${LEVEL_TONE[project.level]} mb-2`}>{project.level}</div>
        <h1 className="display text-4xl sm:text-5xl">{project.name}.</h1>
        <p className="text-[var(--color-text-dim)] mt-2 max-w-2xl">{project.blurb}</p>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
        {/* LEFT */}
        <div className="min-w-0">
          <Card>
            <Section icon={<Target className="w-4 h-4" />} title="Objective">
              <p className="text-sm leading-relaxed text-[var(--color-text)]">{project.objective}</p>
            </Section>

            <Section icon={<ListChecks className="w-4 h-4" />} title="Core features (MVP)">
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-[var(--color-text-dim)]">
                {project.features.map((f, i) => (<li key={i}>{f}</li>))}
              </ul>
            </Section>

            <Section icon={<FolderTree className="w-4 h-4" />} title="Suggested folder structure">
              <pre className="mono text-[13px] leading-relaxed bg-[var(--color-input-strong)] border border-[var(--color-line)] rounded-xl p-4 overflow-x-auto text-[var(--color-text-dim)]">
                {project.folderStructure}
              </pre>
            </Section>

            <Section icon={<Cpu className="w-4 h-4" />} title="Recommended technologies">
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-card-soft)] border border-[var(--color-line)] text-[var(--color-text-dim)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Section>

            <Section icon={<Rocket className="w-4 h-4" />} title="Stretch goals">
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-[var(--color-text-dim)]">
                {project.stretchGoals.map((s, i) => (<li key={i}>{s}</li>))}
              </ul>
            </Section>

            <Section icon={<TrendingUp className="w-4 h-4" />} title="Future improvements">
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-[var(--color-text-dim)]">
                {project.futureImprovements.map((s, i) => (<li key={i}>{s}</li>))}
              </ul>
            </Section>
          </Card>

          {/* Prev / next */}
          <div className="flex items-center justify-between mt-6 gap-3">
            {prev ? (
              <Link
                to={`/projects/${domain.id}/${prev.id}`}
                className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-dim)] hover:text-[var(--color-neon-text)]"
              >
                <ArrowLeft className="w-4 h-4" /> {prev.name}
              </Link>
            ) : <span />}
            {next ? (
              <Link
                to={`/projects/${domain.id}/${next.id}`}
                className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-dim)] hover:text-[var(--color-neon-text)] text-right"
              >
                {next.name} <ArrowRight className="w-4 h-4" />
              </Link>
            ) : <span />}
          </div>
        </div>

        {/* RIGHT — sticky */}
        <aside className="lg:sticky lg:top-20 space-y-4">
          <Card>
            <button
              onClick={() => toggleChecklist(domain.id, `built:${project.id}`)}
              aria-pressed={built}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                built
                  ? "bg-[var(--color-neon)]/15 text-[var(--color-neon-text)] border border-[var(--color-neon)]/40"
                  : "bg-[var(--color-neon)] text-black hover:brightness-95"
              }`}
            >
              {built ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              {built ? "Built — nice work!" : "Mark as built"}
            </button>

            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center gap-2 text-[var(--color-text-dim)]">
                <Clock className="w-4 h-4 text-[var(--color-text-faint)]" /> {project.estimatedTime}
              </div>
              <div className="flex items-center gap-2 text-[var(--color-text-dim)]">
                <Target className="w-4 h-4 text-[var(--color-text-faint)]" /> {project.level}
              </div>
            </div>
          </Card>

          <Card>
            <h4 className="mono text-xs uppercase tracking-widest mb-3">Skills you'll show</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.skills.map((s) => (
                <span
                  key={s}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--color-card-soft)] border border-[var(--color-line)] text-[var(--color-text-dim)]"
                >
                  {s}
                </span>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
