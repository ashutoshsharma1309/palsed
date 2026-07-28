// ────────────────────────────────────────────────────────────────────────────
//  PrepNext Content Engine — domain-agnostic lesson schema (Vision 3.0).
//
//  One schema powers every domain (DSA / Web / AI). A lesson is pure data; the
//  UI renders whatever fields are present, so adding a lesson is a data change,
//  never a component change. This is a SUPERSET of the original DSA `Lesson`
//  (src/data/dsa/roadmap.ts) plus the pieces Vision 3.0 needs: per-lesson
//  difficulty, reading time, prerequisites, inline quiz, visual, and a revision
//  recap. `Question` / `ChecklistItem` / `Difficulty` are reused from the DSA
//  roadmap so the practice bank and checklist stay a single source of truth.
// ────────────────────────────────────────────────────────────────────────────
import type { Question, ChecklistItem } from "../data/dsa/roadmap";

export type { Question, ChecklistItem };

export type Domain = "dsa" | "web" | "ai";

/** Lesson-level difficulty (distinct from a practice problem's Easy/Med/Hard). */
export type LessonDifficulty = "Beginner" | "Intermediate" | "Advanced";

/** Languages a lesson's code blocks may use. Drives syntax-highlight fences. */
export type CodeLang =
  | "cpp" | "ts" | "js" | "jsx" | "tsx" | "python"
  | "html" | "css" | "bash" | "json" | "sql" | "text";

// ── Quiz (inline, after the lesson) ─────────────────────────────────────────
export type QuizType = "mcq" | "truefalse" | "fill" | "output" | "code";

interface QuizBase {
  id: string;
  /** Markdown prompt. */
  prompt: string;
  /** Shown after the learner answers (markdown). */
  explanation: string;
}

/** Multiple choice — one correct option. */
export interface MCQQuestion extends QuizBase {
  type: "mcq";
  options: string[];
  answerIndex: number;
}

/** True / False. */
export interface TrueFalseQuestion extends QuizBase {
  type: "truefalse";
  answer: boolean;
}

/** Fill in the blank — free text checked against accepted answers (case- and
 *  whitespace-insensitive). */
export interface FillQuestion extends QuizBase {
  type: "fill";
  answers: string[];
  placeholder?: string;
}

/** Predict-the-output — show code, learner types the expected console output. */
export interface OutputQuestion extends QuizBase {
  type: "output";
  code: string;
  language?: CodeLang;
  /** Accepted outputs (trimmed, case-insensitive match). */
  answers: string[];
}

/** Small coding challenge — learner writes JS, runs it in the sandbox, and we
 *  compare the produced console output to `expectedOutput`. */
export interface CodeQuestion extends QuizBase {
  type: "code";
  starter?: string;
  /** Expected console output (trimmed) that marks the challenge solved. */
  expectedOutput: string;
}

export type QuizQuestion =
  | MCQQuestion | TrueFalseQuestion | FillQuestion | OutputQuestion | CodeQuestion;

// ── Visual (clarify, don't decorate) ────────────────────────────────────────
/** Named lightweight animations rendered by the visuals registry. */
export type AnimName =
  | "arrayTraversal" | "stackPushPop" | "queue" | "linkedList"
  | "treeTraversal" | "graphTraversal"
  | "httpRequest" | "reactRender" | "neuralForward";

export type VisualSpec =
  | { kind: "mermaid"; src: string; caption?: string }
  | { kind: "anim"; name: AnimName; caption?: string };

export interface Definition {
  term: string;
  meaning: string;
}

// ── Lesson ──────────────────────────────────────────────────────────────────
export interface Lesson {
  id: string;                 // stable slug, unique within a domain
  domain: Domain;
  moduleId: string;
  title: string;
  objective: string;
  difficulty: LessonDifficulty;
  /** Estimated reading time in minutes (author-set or engine-estimated). */
  estMinutes: number;
  /** Prerequisite lesson ids (same domain). */
  prerequisites?: string[];
  tags?: string[];

  // Body — every field is optional so any domain composes the same anatomy.
  theory: string;             // markdown
  intuition?: string;         // real-world "why this matters"
  definitions?: Definition[];
  language?: CodeLang;        // default language for syntax/example
  syntax?: string;            // raw code (fenced in `language`)
  example?: { code: string; explanation?: string; language?: CodeLang };
  visual?: VisualSpec;
  complexity?: { time?: string; space?: string; notes?: string };
  keyConcepts?: string[];
  commonMistakes?: string[];
  tips?: string[];            // interview / industry tips
  optimization?: string[];

  quiz?: QuizQuestion[];
  practice?: Question[];      // reuses the DSA roadmap Question type
  revision?: string[];        // concise recap bullets

  checklist?: ChecklistItem[]; // optional override of the default checklist
}

export interface Module {
  id: string;
  domain: Domain;
  title: string;
  summary: string;
  order: number;
  lessons: Lesson[];
}

/** What a domain content file exports. */
export interface DomainContent {
  modules: Module[];
}
