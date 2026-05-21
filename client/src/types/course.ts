export type Style = "visual" | "code_first" | "analogy" | "step_by_step";

export interface CheckQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  explanations: {
    visual: { markdown: string; diagram_mermaid?: string };
    code_first: { markdown: string; code_examples: { lang: string; code: string; explanation: string }[] };
    analogy: { markdown: string; analogies: { real_world: string; mapping: string }[] };
    step_by_step: { markdown: string; steps: { title: string; detail: string }[] };
  };
  check_questions: CheckQuestion[];
  estimated_minutes: number;
}

export interface Chapter {
  id: string;
  title: string;
  summary: string;
  mastery_topics: string[];
  lessons: Lesson[];
}

export interface AICourse {
  id: string; // generated client-side
  createdAt: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  estimated_hours: number;
  prerequisites: string[];
  chapters: Chapter[];
  final_quiz_topics: string[];
  certificate_criteria: { passing_score: number };
}

export interface LessonProgress {
  status: "in_progress" | "complete";
  score?: number;
  attempts: number;
  masteryScore?: number;
  lastAt: string;
  msSpent?: number;
  extraExplanations?: Array<{ style: Style; markdown: string; at: string }>;
  preferredStyle?: Style;
}
