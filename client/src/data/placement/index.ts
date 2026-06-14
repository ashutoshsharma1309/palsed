// Placement Hub data registry. Add new sections by importing + appending here.
import type { HubSection, SearchHit, Topic } from "./types";
import { languages } from "./languages";
import { dsa } from "./dsa";
import { leetcode } from "./leetcode";
import { webdev } from "./webdev";
import { ml } from "./ml";
import { ai } from "./ai";
import { appdev } from "./appdev";
import { aptitude } from "./aptitude";
import { coreCs } from "./coreCs";
import { interview } from "./interview";

export * from "./types";

export const SECTIONS: HubSection[] = [
  languages,
  dsa,
  leetcode,
  webdev,
  ml,
  ai,
  appdev,
  aptitude,
  coreCs,
  interview,
];

/** Every topic id across all sections — the universe for progress %. */
export const ALL_TOPIC_IDS: string[] = SECTIONS.flatMap((s) => s.topics.map((t) => t.id));

export const TOTAL_TOPICS = ALL_TOPIC_IDS.length;

/** Pre-built search index (built once at module load). */
export const SEARCH_INDEX: SearchHit[] = SECTIONS.flatMap((s) =>
  s.topics.map((t) => ({
    sectionId: s.id,
    sectionTitle: s.title,
    topicId: t.id,
    topicTitle: t.title,
    difficulty: t.difficulty,
    resourceCount: t.resources.length,
    haystack: [
      s.title,
      t.title,
      t.blurb ?? "",
      t.difficulty ?? "",
      ...t.resources.flatMap((r) => [r.title, r.type, ...(r.tags ?? [])]),
    ]
      .join(" ")
      .toLowerCase(),
  }))
);

export function searchTopics(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return SEARCH_INDEX.filter((hit) => terms.every((term) => hit.haystack.includes(term)));
}

export function getSection(id: string): HubSection | undefined {
  return SECTIONS.find((s) => s.id === id);
}

export function getTopic(topicId: string): { section: HubSection; topic: Topic } | undefined {
  for (const section of SECTIONS) {
    const topic = section.topics.find((t) => t.id === topicId);
    if (topic) return { section, topic };
  }
  return undefined;
}
