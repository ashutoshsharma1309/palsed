// Placement Hub — typed resource architecture.
// All resources live in data files (this folder); UI components never hardcode them.

export type ResourceType = "roadmap" | "repo" | "video" | "notes" | "practice";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Easy" | "Medium" | "Hard" | "All Levels";

export interface Resource {
  title: string;
  type: ResourceType;
  url: string;
  difficulty?: Difficulty;
  tags?: string[];
}

export interface Topic {
  /** Stable unique id used for progress tracking — never change once shipped. */
  id: string;
  title: string;
  blurb?: string;
  difficulty?: Difficulty;
  /** Optional target problem/practice count (e.g. LeetCode tracks). */
  recommended?: number;
  resources: Resource[];
}

export interface HubSection {
  /** Stable unique id, also used as the in-page anchor. */
  id: string;
  title: string;
  blurb: string;
  /** lucide-react icon name; mapped to a component in the UI layer. */
  icon: string;
  accent?: string;
  topics: Topic[];
}

/** Flattened item used by the global search index. */
export interface SearchHit {
  sectionId: string;
  sectionTitle: string;
  topicId: string;
  topicTitle: string;
  difficulty?: Difficulty;
  resourceCount: number;
  haystack: string; // lowercased searchable text
}
