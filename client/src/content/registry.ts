// ────────────────────────────────────────────────────────────────────────────
//  Content registry — resolves lessons by (domain, id) and computes ordering /
//  prev-next. Each domain is a lazily-imported chunk so the initial bundle stays
//  small no matter how many lessons exist (Vision 3.0, Phase 7 / performance).
//  Loaded domains are cached module-side so a domain is fetched at most once.
// ────────────────────────────────────────────────────────────────────────────
import { DEFAULT_CHECKLIST } from "../data/dsa/roadmap";
import type { Domain, Module, Lesson, ChecklistItem } from "./types";

export const DOMAINS: Domain[] = ["dsa", "web", "ai"];

export const DOMAIN_META: Record<
  Domain,
  { label: string; blurb: string; accent: string }
> = {
  dsa: {
    label: "Data Structures & Algorithms",
    blurb: "Think in patterns. Build the problem-solving core every interview tests.",
    accent: "neon",
  },
  web: {
    label: "Web Development",
    blurb: "From how the web works to shipping real React apps on a Node backend.",
    accent: "blue",
  },
  ai: {
    label: "Artificial Intelligence",
    blurb: "Foundations of ML, deep learning, and building with modern LLMs.",
    accent: "purple",
  },
};

const LOADERS: Record<Domain, () => Promise<{ modules: Module[] }>> = {
  dsa: () => import("./dsa"),
  web: () => import("./web"),
  ai: () => import("./ai"),
};

const cache = new Map<Domain, Module[]>();

/** Fetch (and cache) a domain's modules. */
export async function loadDomain(domain: Domain): Promise<Module[]> {
  const cached = cache.get(domain);
  if (cached) return cached;
  const mod = await LOADERS[domain]();
  const modules = [...mod.modules].sort((a, b) => a.order - b.order);
  cache.set(domain, modules);
  return modules;
}

/** All lessons of a domain in curriculum order (module order, then lesson order). */
export function orderedLessons(modules: Module[]): Lesson[] {
  return modules.flatMap((m) => m.lessons);
}

export interface ResolvedLesson {
  lesson: Lesson;
  module: Module;
  index: number;      // position in the ordered lesson list
  total: number;
  prev: Lesson | null;
  next: Lesson | null;
}

/** Resolve a lesson + its neighbours within an already-loaded domain. */
export function resolveLesson(
  modules: Module[],
  lessonId: string
): ResolvedLesson | null {
  const ordered = orderedLessons(modules);
  const index = ordered.findIndex((l) => l.id === lessonId);
  if (index === -1) return null;
  const lesson = ordered[index];
  const module = modules.find((m) => m.id === lesson.moduleId)!;
  return {
    lesson,
    module,
    index,
    total: ordered.length,
    prev: index > 0 ? ordered[index - 1] : null,
    next: index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}

/** The checklist a lesson renders: its own override, else a domain-appropriate
 *  default. DSA keeps the exact legacy DEFAULT_CHECKLIST (zero regression to
 *  existing completion/readiness-score math). Other domains get a lighter
 *  default that includes a "quiz" step only when the lesson actually has one,
 *  matching the product's Learn → Quiz → Revise anatomy. */
export function checklistForLesson(lesson: Lesson): ChecklistItem[] {
  if (lesson.checklist) return lesson.checklist;
  if (lesson.domain === "dsa") return DEFAULT_CHECKLIST;
  const items: ChecklistItem[] = [
    { id: "theory", label: "Read the lesson" },
    { id: "understood", label: "Understood the concept" },
  ];
  if (lesson.quiz && lesson.quiz.length > 0) items.push({ id: "quiz", label: "Completed the quiz" });
  items.push({ id: "revised", label: "Revised" });
  return items;
}

/** A lesson is complete when every item of its (effective) checklist is checked. */
export function isLessonComplete(
  isChecked: (lessonId: string, itemId: string) => boolean,
  lesson: Lesson
): boolean {
  const items = checklistForLesson(lesson);
  return items.length > 0 && items.every((it) => isChecked(lesson.id, it.id));
}

/** Rough reading-time estimate when an author doesn't set `estMinutes`.
 *  ~200 wpm over the prose fields; min 1. Kept here so authoring stays optional. */
export function estimateMinutes(lesson: Pick<Lesson, "theory" | "example" | "definitions">): number {
  const words =
    (lesson.theory ?? "").split(/\s+/).length +
    (lesson.example?.explanation ?? "").split(/\s+/).length +
    (lesson.definitions ?? []).reduce((n, d) => n + d.meaning.split(/\s+/).length, 0);
  return Math.max(1, Math.round(words / 200));
}
