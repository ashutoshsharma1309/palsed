import { useMemo } from "react";
import { useLearningProgress } from "./useLearningProgress";
import { useOaSessions } from "./useOaSessions";
import { PATTERNS_ORDERED, PATTERN_CHECKLIST, TOTAL_PATTERNS } from "../data/patterns/patterns";
import { PROJECT_DOMAINS, TOTAL_PROJECTS } from "../data/projects";

// Placement Readiness Score — the one number a student chases and a TPO reports.
// It aggregates the whole journey (Learn → Practice → Build) into 0–100 from
// signals already tracked locally, so it works with zero backend changes.
//
// Dimensions (each 0..1), weighted:
//   DSA roadmap completion        25%
//   Coding patterns mastered      20%
//   Projects built                20%
//   Mock OA performance           20%
//   Consistency (weekly activity) 15%

export interface ReadinessDimension {
  key: string;
  label: string;
  value: number;   // 0..1
  weight: number;  // 0..1
  detail: string;  // human-readable progress, e.g. "8/20 patterns"
}

export interface PlacementReadiness {
  score: number;             // 0..100
  band: string;              // qualitative label
  bandColor: string;         // CSS var for the band
  dimensions: ReadinessDimension[];
  weakest: ReadinessDimension; // lowest-weighted-gap → "what to improve next"
}

function band(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Placement-ready", color: "var(--color-neon)" };
  if (score >= 60) return { label: "Interview-ready", color: "var(--color-mint)" };
  if (score >= 35) return { label: "Building up", color: "var(--color-yellow)" };
  return { label: "Getting started", color: "var(--color-peach)" };
}

export function usePlacementReadiness(): PlacementReadiness {
  const { stats, isChecked } = useLearningProgress();
  const { sessions } = useOaSessions();

  return useMemo(() => {
    // DSA roadmap
    const dsa = clamp01(stats.completionPct);

    // Patterns — a pattern counts when its whole checklist is ticked
    const patternsDone = PATTERNS_ORDERED.filter((p) =>
      PATTERN_CHECKLIST.every((it) => isChecked(p.id, it.id))
    ).length;
    const patterns = TOTAL_PATTERNS ? patternsDone / TOTAL_PATTERNS : 0;

    // Projects — count "built" toggles across all domains
    let built = 0;
    for (const d of PROJECT_DOMAINS) {
      for (const p of d.projects) if (isChecked(d.id, `built:${p.id}`)) built++;
    }
    const projects = TOTAL_PROJECTS ? built / TOTAL_PROJECTS : 0;

    // Mock OA — average score of finished attempts, scaled by attempts (≥3 = full credit)
    const finished = sessions.filter((s) => s.finishedAt && s.resultStats);
    const avgScore = finished.length
      ? finished.reduce((n, s) => n + (s.resultStats?.score ?? 0), 0) / finished.length / 100
      : 0;
    const oa = clamp01(avgScore * Math.min(1, finished.length / 3));

    // Consistency — distinct active days in the last 7 (5+ = full credit)
    const consistency = clamp01(stats.weekActiveDays / 5);

    const dimensions: ReadinessDimension[] = [
      { key: "dsa", label: "DSA roadmap", value: dsa, weight: 0.25, detail: `${stats.topicsCompleted}/${stats.totalTopics} topics` },
      { key: "patterns", label: "Coding patterns", value: patterns, weight: 0.2, detail: `${patternsDone}/${TOTAL_PATTERNS} patterns` },
      { key: "projects", label: "Projects built", value: projects, weight: 0.2, detail: `${built}/${TOTAL_PROJECTS} projects` },
      { key: "oa", label: "Mock OA", value: oa, weight: 0.2, detail: finished.length ? `${finished.length} taken · ${Math.round(avgScore * 100)}% avg` : "none taken" },
      { key: "consistency", label: "Consistency", value: consistency, weight: 0.15, detail: `${stats.weekActiveDays}/7 days this week` },
    ];

    const score = Math.round(dimensions.reduce((n, d) => n + d.value * d.weight, 0) * 100);
    const b = band(score);

    // "Improve next" = the dimension contributing the biggest weighted gap.
    const weakest = [...dimensions].sort(
      (a, c) => (1 - a.value) * a.weight - (1 - c.value) * c.weight
    )[dimensions.length - 1];

    return { score, band: b.label, bandColor: b.color, dimensions, weakest };
  }, [stats, isChecked, sessions]);
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n || 0));
}
