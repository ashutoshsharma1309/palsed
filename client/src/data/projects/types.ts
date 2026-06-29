// Projects module — data model.
//
// The Projects module turns "build something for your resume" into structured,
// domain-based learning paths. It mirrors the Patterns/Roadmap architecture:
// a strongly-typed data layer (one file per domain) aggregated in index.ts,
// rendered by data-driven route components, with progress tracked through the
// shared useLearningProgress() store.

export type ProjectLevel = "Beginner" | "Intermediate" | "Advanced";

/** A learning/reference link. `kind` drives the little icon shown beside it. */
export interface ProjectResource {
  label: string;
  url: string;
  kind?: "docs" | "course" | "video" | "article" | "repo" | "tool" | "roadmap";
}

/** A single, buildable project with everything a student needs to ship it. */
export interface Project {
  id: string;
  name: string;
  level: ProjectLevel;
  /** One-line teaser for the card. */
  blurb: string;
  /** Rough build time, e.g. "1–2 weekends". */
  estimatedTime: string;
  /** What you're building and why it's resume-worthy. */
  objective: string;
  /** Core features to implement (the MVP scope). */
  features: string[];
  /** A suggested folder structure, rendered verbatim in a code block. */
  folderStructure: string;
  /** Recommended technologies/libraries for this specific project. */
  technologies: string[];
  /** Concrete skills this project demonstrates (used for resume bullets). */
  skills: string[];
  /** "Nice to have" extensions that make the project stand out. */
  stretchGoals: string[];
  /** Where to take it next — shows product thinking in interviews. */
  futureImprovements: string[];
}

/** A domain (Web Dev, AI/ML, …) — an end-to-end learning path + project ladder. */
export interface ProjectDomain {
  id: string;
  title: string;
  /** lucide-react icon name; mapped to a component in the route. */
  icon: string;
  accent: "mint" | "peach" | "yellow" | "blue" | "purple" | "neon";
  /** One-line teaser for the domains grid. */
  blurb: string;
  /** 1–3 paragraphs (markdown) framing the domain + career relevance. */
  overview: string;
  /** Prerequisite skills/knowledge before starting. */
  skillsRequired: string[];
  /** Ordered "learn this, then this" path to follow. */
  learningOrder: string[];
  /** Overall difficulty descriptor, e.g. "Beginner-friendly → Advanced". */
  difficulty: string;
  /** The canonical tech stack for the domain. */
  techStack: string[];
  /** Curated GitHub repos (awesome-lists, references, starters). */
  githubResources: ProjectResource[];
  /** Courses, docs, videos, roadmaps. */
  learningResources: ProjectResource[];
  /** How to present this work in a portfolio. */
  portfolioTips: string[];
  /** How to phrase this work on a resume (impact-first). */
  resumeTips: string[];
  /** Why this domain matters in placement interviews (markdown). */
  interviewRelevance: string;
  /** Beginner → Advanced project ladder. */
  projects: Project[];
}
