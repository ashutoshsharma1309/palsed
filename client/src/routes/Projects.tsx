// Projects landing — a grid of build domains (Web, AI/ML, DevOps, …). Each
// domain opens a structured learning path + a Beginner→Advanced project ladder.
// Mirrors the Patterns index: data-driven, progress-aware, consistent tokens.
import { Link } from "react-router-dom";
import { ArrowRight, FolderGit2 } from "lucide-react";
import { Card } from "../components/ui/Card";
import { usePageMeta } from "../hooks/usePageMeta";
import { useLearningProgress } from "../hooks/useLearningProgress";
import { DomainIcon } from "../components/projects/domainIcon";
import { PROJECT_DOMAINS, TOTAL_DOMAINS, TOTAL_PROJECTS } from "../data/projects";

export default function Projects() {
  usePageMeta({
    title: "Projects — build resume-worthy apps across 10 domains",
    description:
      "Structured project-based learning paths across Web, Backend, AI/ML, Data Science, Mobile, Cloud, DevOps, Cybersecurity, Blockchain, and Open Source. Each with beginner→advanced projects, tech stacks, and resume tips.",
    canonical: "/projects",
  });

  const { isChecked } = useLearningProgress();

  // A project counts as "built" when its checklist item is ticked on the
  // domain page; we surface per-domain build progress on each card.
  const builtIn = (domainId: string, projectIds: string[]) =>
    projectIds.filter((pid) => isChecked(domainId, `built:${pid}`)).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <header className="mb-8">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2 flex items-center gap-2">
          <FolderGit2 className="w-4 h-4" /> Build · Portfolio
        </div>
        <h1 className="display text-4xl sm:text-5xl">Projects.</h1>
        <p className="text-[var(--color-text-dim)] mt-3 max-w-2xl">
          Recruiters open your projects before they read your resume. Pick a domain, follow the
          structured path, and ship {TOTAL_PROJECTS}+ resume-worthy projects across {TOTAL_DOMAINS} domains —
          each with an objective, feature list, folder structure, tech stack, and stretch goals.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROJECT_DOMAINS.map((d) => {
          const projectIds = d.projects.map((p) => p.id);
          const built = builtIn(d.id, projectIds);
          return (
            <Link key={d.id} to={`/projects/${d.id}`} className="group">
              <Card className="h-full flex flex-col hover:border-[var(--color-neon)]/40 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-11 h-11 rounded-2xl grid place-items-center shrink-0"
                    style={{ background: `var(--color-${d.accent})`, color: "#0a0a0a" }}
                  >
                    <DomainIcon name={d.icon} className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--color-text-faint)] group-hover:text-[var(--color-neon)] group-hover:translate-x-0.5 transition-all" />
                </div>
                <h2 className="text-lg font-bold leading-tight">{d.title}</h2>
                <p className="text-sm text-[var(--color-text-dim)] mt-1 flex-1">{d.blurb}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--color-line)]">
                  <span className="mono text-[11px] text-[var(--color-text-faint)]">
                    {d.projects.length} projects
                  </span>
                  <span className="mono text-[11px] text-[var(--color-text-faint)]">
                    {built > 0 ? (
                      <span className="text-[var(--color-neon-text)]">{built}/{d.projects.length} built</span>
                    ) : (
                      d.difficulty
                    )}
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
