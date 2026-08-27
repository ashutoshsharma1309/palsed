// ────────────────────────────────────────────────────────────────────────────
//  DSA domain — an ADAPTER over the existing curated roadmap (data/dsa/roadmap.ts).
//  We do NOT duplicate content: each roadmap Phase becomes a Module and each
//  Topic becomes a Lesson in the unified engine, so DSA gets the Vision 3.0
//  reading experience (TOC, reading theme, gamification) for free while the
//  legacy /learn/:topicId route keeps working unchanged (zero regression).
// ────────────────────────────────────────────────────────────────────────────
import { PHASES, TOPICS_ORDERED, getPhase } from "../../data/dsa/roadmap";
import type { Topic, Lesson as DsaLesson } from "../../data/dsa/roadmap";
import type { Lesson, Module, LessonDifficulty, Definition, VisualSpec } from "../types";

// Purpose-built animations for the topics where seeing the mechanism beats
// reading about it. Pure data — the visuals registry renders them.
const TOPIC_VISUALS: Record<string, VisualSpec> = {
  arrays: { kind: "anim", name: "arrayTraversal", caption: "O(1) jumps by index; a scan visits each cell once." },
  stack: { kind: "anim", name: "stackPushPop", caption: "Push and pop touch only the top — last in, first out." },
  queue: { kind: "anim", name: "queue", caption: "Enqueue at the back, dequeue from the front — first in, first out." },
  "linked-list": { kind: "anim", name: "linkedList", caption: "No indexing — reach a node by walking the pointers." },
  trees: { kind: "anim", name: "treeTraversal", caption: "Level-order (BFS) visits the tree one level at a time." },
  bst: { kind: "anim", name: "treeTraversal", caption: "The same traversal machinery — but ordering makes search O(h)." },
  graphs: { kind: "anim", name: "graphTraversal", caption: "BFS expands outward in waves — one edge farther per ring." },
};

// Phase index → lesson difficulty band (fundamentals → advanced).
function difficultyForPhase(phaseId: string): LessonDifficulty {
  const idx = PHASES.findIndex((p) => p.id === phaseId);
  if (idx <= 3) return "Beginner";      // p1–p4
  if (idx <= 8) return "Intermediate";  // p5–p9
  return "Advanced";                    // p10+
}

function estMinutes(l?: DsaLesson): number {
  if (!l) return 4;
  const words = (l.explanation ?? "").split(/\s+/).length;
  return Math.max(3, Math.round(words / 180) + 3);
}

function definitionsOf(topic: Topic): Definition[] | undefined {
  return topic.lesson?.definition
    ? [{ term: topic.name, meaning: topic.lesson.definition }]
    : undefined;
}

function topicToLesson(topic: Topic): Lesson {
  const l = topic.lesson;
  const c = l?.complexity;
  return {
    id: topic.id,
    domain: "dsa",
    moduleId: topic.phaseId,
    title: topic.name,
    objective: l?.objective ?? topic.blurb,
    difficulty: difficultyForPhase(topic.phaseId),
    estMinutes: estMinutes(l),
    theory: l?.explanation ?? topic.blurb,
    intuition: l?.intuition,
    definitions: definitionsOf(topic),
    language: "cpp",
    syntax: l?.syntax,
    example: l?.example,
    visual: TOPIC_VISUALS[topic.id],
    complexity: c
      ? {
          time: [c.best, c.average, c.worst].filter(Boolean).join(" / ") || l?.timeComplexity,
          space: c.space ?? l?.spaceComplexity,
        }
      : l?.timeComplexity || l?.spaceComplexity
      ? { time: l?.timeComplexity, space: l?.spaceComplexity }
      : undefined,
    keyConcepts: l?.keyConcepts,
    commonMistakes: l?.commonMistakes,
    tips: l?.interviewNotes,
    practice: topic.questions,
    checklist: topic.checklist,
  };
}

export const modules: Module[] = PHASES.map((phase, i) => {
  const lessons = phase.topicIds
    .map((id) => TOPICS_ORDERED.find((t) => t.id === id))
    .filter((t): t is Topic => Boolean(t))
    .map(topicToLesson);
  const p = getPhase(phase.id);
  return {
    id: phase.id,
    domain: "dsa" as const,
    title: p?.name ?? phase.name,
    summary: p?.summary ?? "",
    order: i,
    lessons,
  };
}).filter((m) => m.lessons.length > 0);
