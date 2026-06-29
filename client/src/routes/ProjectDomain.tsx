// Project domain page — the structured learning path for one domain plus its
// Beginner→Advanced project ladder. Mirrors PatternDetail's layout: left
// content column + right sticky progress sidebar. Fully data-driven.
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  Github,
  Wrench,
  Award,
  FileText,
  Target,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { MarkdownView } from "../components/lesson/MarkdownView";
import { usePageMeta } from "../hooks/usePageMeta";
import { useLearningProgress } from "../hooks/useLearningProgress";
import { DomainIcon } from "../components/projects/domainIcon";
import {
  getDomain,
  projectsByLevel,
  PROJECT_DOMAINS,
  type ProjectResource,
} from "../data/projects";

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

function ResourceLink({ r }: { r: ProjectResource }) {
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-[var(--color-text-dim)] hover:text-[var(--color-neon-text)] py-1.5"
    >
      <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60" />
      <span className="underline-offset-2 group-hover:underline">{r.label}</span>
    </a>
  );
}

export default function ProjectDomain() {
  const { domainId } = useParams();
  const domain = domainId ? getDomain(domainId) : undefined;
  const { isChecked, toggleChecklist } = useLearningProgress();

  usePageMeta({
    title: domain ? `${domain.title} Projects — learning path & ideas` : "Projects",
    description: domain?.blurb,
    canonical: domain ? `/projects/${domain.id}` : "/projects",
  });

  const groups = useMemo(() => (domain ? projectsByLevel(domain) : []), [domain]);

  if (!domain) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <h1 className="display text-4xl mb-3">Domain not found.</h1>
        <Link to="/projects" className="text-[var(--color-neon-text)] underline">
          Back to projects
        </Link>
      </div>
    );
  }

  const idx = PROJECT_DOMAINS.findIndex((d) => d.id === domain.id);
  const next = idx >= 0 && idx < PROJECT_DOMAINS.length - 1 ? PROJECT_DOMAINS[idx + 1] : null;

  const projectIds = domain.projects.map((p) => p.id);
  const builtCount = projectIds.filter((pid) => isChecked(domain.id, `built:${pid}`)).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <Link
        to="/projects"
        className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)] inline-flex items-center gap-1 mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Projects
      </Link>

      <header className="mb-8 flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-2xl grid place-items-center shrink-0"
          style={{ background: `var(--color-${domain.accent})`, color: "#0a0a0a" }}
        >
          <DomainIcon name={domain.icon} className="w-7 h-7" />
        </div>
        <div>
          <h1 className="display text-4xl sm:text-5xl">{domain.title}.</h1>
          <p className="text-[var(--color-text-dim)] mt-2 max-w-2xl">{domain.blurb}</p>
          <div className="mono text-[11px] uppercase tracking-widest text-[var(--color-text-faint)] mt-2">
            {domain.difficulty} · {domain.projects.length} projects
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
        {/* LEFT */}
        <div className="min-w-0">
          <Card className="mb-6">
            <Section icon={<BookOpen className="w-4 h-4" />} title="Overview">
              <MarkdownView>{domain.overview}</MarkdownView>
            </Section>

            <Section icon={<Wrench className="w-4 h-4" />} title="Recommended learning order">
              <ol className="space-y-1.5">
                {domain.learningOrder.map((step, i) => {
                  const key = `learn:${i}`;
                  const done = isChecked(domain.id, key);
                  return (
                    <li key={key}>
                      <button
                        onClick={() => toggleChecklist(domain.id, key)}
                        className="w-full flex items-start gap-3 text-left rounded-lg px-2 py-1.5 hover:bg-[var(--color-card-soft)]"
                        aria-pressed={done}
                      >
                        {done ? (
                          <CheckCircle2 className="w-4 h-4 text-[var(--color-neon)] shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-[var(--color-text-faint)] shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${done ? "line-through text-[var(--color-text-faint)]" : "text-[var(--color-text-dim)]"}`}>
                          {step}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </Section>

            <Section icon={<Target className="w-4 h-4" />} title="Tech stack">
              <div className="flex flex-wrap gap-2">
                {domain.techStack.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-card-soft)] border border-[var(--color-line)] text-[var(--color-text-dim)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Section>
          </Card>

          {/* PROJECT LADDER */}
          <div className="mb-6">
            <h2 className="display text-2xl mb-4">Project ladder.</h2>
            <div className="space-y-6">
              {groups.map((g) => (
                <div key={g.level}>
                  <div className={`diff-pill ${LEVEL_TONE[g.level]} mb-3`}>{g.level}</div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {g.projects.map((p) => {
                      const built = isChecked(domain.id, `built:${p.id}`);
                      return (
                        <Card key={p.id} className="flex flex-col group hover:border-[var(--color-neon)]/40 transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <Link to={`/projects/${domain.id}/${p.id}`} className="min-w-0">
                              <h3 className="font-bold leading-tight group-hover:text-[var(--color-neon-text)]">{p.name}</h3>
                            </Link>
                            <button
                              onClick={() => toggleChecklist(domain.id, `built:${p.id}`)}
                              aria-pressed={built}
                              aria-label={built ? "Mark as not built" : "Mark as built"}
                              title={built ? "Built" : "Mark as built"}
                              className="shrink-0"
                            >
                              {built ? (
                                <CheckCircle2 className="w-5 h-5 text-[var(--color-neon)]" />
                              ) : (
                                <Circle className="w-5 h-5 text-[var(--color-text-faint)] hover:text-[var(--color-text-dim)]" />
                              )}
                            </button>
                          </div>
                          <p className="text-sm text-[var(--color-text-dim)] mt-1 flex-1">{p.blurb}</p>
                          <Link
                            to={`/projects/${domain.id}/${p.id}`}
                            className="mt-3 inline-flex items-center gap-1 text-xs text-[var(--color-neon-text)] font-semibold"
                          >
                            Open build guide <ArrowRight className="w-3 h-3" />
                          </Link>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RESOURCES */}
          <Card className="mb-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <Section icon={<Github className="w-4 h-4" />} title="GitHub resources">
                <div className="-my-1">
                  {domain.githubResources.map((r) => (
                    <ResourceLink key={r.url} r={r} />
                  ))}
                </div>
              </Section>
              <Section icon={<BookOpen className="w-4 h-4" />} title="Learning resources">
                <div className="-my-1">
                  {domain.learningResources.map((r) => (
                    <ResourceLink key={r.url} r={r} />
                  ))}
                </div>
              </Section>
            </div>
          </Card>

          {/* TIPS */}
          <Card className="mb-6">
            <Section icon={<Award className="w-4 h-4" />} title="Portfolio tips">
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-[var(--color-text-dim)]">
                {domain.portfolioTips.map((t, i) => (<li key={i}>{t}</li>))}
              </ul>
            </Section>
            <Section icon={<FileText className="w-4 h-4" />} title="Resume tips">
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-[var(--color-text-dim)]">
                {domain.resumeTips.map((t, i) => (<li key={i}>{t}</li>))}
              </ul>
            </Section>
            <Section icon={<Target className="w-4 h-4" />} title="Interview relevance">
              <MarkdownView>{domain.interviewRelevance}</MarkdownView>
            </Section>
          </Card>

          {next && (
            <Link
              to={`/projects/${next.id}`}
              className="inline-flex items-center gap-2 text-sm text-[var(--color-text-dim)] hover:text-[var(--color-neon-text)]"
            >
              Next domain: {next.title} <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* RIGHT — sticky */}
        <aside className="lg:sticky lg:top-20 space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h4 className="mono text-xs uppercase tracking-widest">Build progress</h4>
              <span className="mono text-[11px]">{builtCount}/{domain.projects.length}</span>
            </div>
            <ProgressBar value={domain.projects.length ? builtCount / domain.projects.length : 0} />
            <p className="text-[11px] text-[var(--color-text-faint)] mt-3">
              Tick a project once you've shipped & deployed it.
            </p>
          </Card>

          <Card>
            <h4 className="mono text-xs uppercase tracking-widest mb-3">Skills you'll need</h4>
            <ul className="space-y-1.5 text-sm text-[var(--color-text-dim)]">
              {domain.skillsRequired.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[var(--color-neon)] mt-1">·</span> {s}
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
