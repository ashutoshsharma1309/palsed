// Projects module registry.
// Each domain lives in its own file (mirrors data/placement/*); this file
// aggregates them and exposes lookup + stat helpers used by the route pages.

import type { ProjectDomain, Project, ProjectLevel } from "./types";
import { webDevelopment } from "./web-development";
import { backendDevelopment } from "./backend-development";
import { aiMachineLearning } from "./ai-machine-learning";
import { cybersecurity } from "./cybersecurity";
import { cloudComputing } from "./cloud-computing";
import { devops } from "./devops";
import { mobileDevelopment } from "./mobile-development";
import { blockchain } from "./blockchain";
import { dataScience } from "./data-science";
import { openSource } from "./open-source";

export type { ProjectDomain, Project, ProjectLevel, ProjectResource } from "./types";

/** Display order on the Projects landing grid. */
export const PROJECT_DOMAINS: ProjectDomain[] = [
  webDevelopment,
  backendDevelopment,
  aiMachineLearning,
  dataScience,
  mobileDevelopment,
  cloudComputing,
  devops,
  cybersecurity,
  blockchain,
  openSource,
];

export const LEVEL_ORDER: ProjectLevel[] = ["Beginner", "Intermediate", "Advanced"];

export const getDomain = (id: string): ProjectDomain | undefined =>
  PROJECT_DOMAINS.find((d) => d.id === id);

export function getProject(
  domainId: string,
  projectId: string
): { domain: ProjectDomain; project: Project } | undefined {
  const domain = getDomain(domainId);
  if (!domain) return undefined;
  const project = domain.projects.find((p) => p.id === projectId);
  if (!project) return undefined;
  return { domain, project };
}

/** Group a domain's projects by level, in Beginner→Advanced order. */
export function projectsByLevel(domain: ProjectDomain): { level: ProjectLevel; projects: Project[] }[] {
  return LEVEL_ORDER.map((level) => ({
    level,
    projects: domain.projects.filter((p) => p.level === level),
  })).filter((g) => g.projects.length > 0);
}

export const TOTAL_DOMAINS = PROJECT_DOMAINS.length;
export const TOTAL_PROJECTS = PROJECT_DOMAINS.reduce((n, d) => n + d.projects.length, 0);
