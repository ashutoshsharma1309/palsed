// ────────────────────────────────────────────────────────────────────────────
//  Gamification — pure, derived-from-state (no React, no storage). XP, levels
//  and badges are computed from what the learner has actually DONE (checklist
//  items, solved practice, correct quiz answers, streak) — never from logging
//  in. Keeping it pure makes it unit-testable and keeps hooks/components thin,
//  matching services/progressService.ts.
// ────────────────────────────────────────────────────────────────────────────

/** XP awarded per learning action. Tuned so a solid lesson (~7 checklist ticks
 *  + a few quiz answers) is a satisfying, not trivial, chunk of a level. */
export const XP = {
  checklistItem: 10,
  solvedProblem: 15,
  quizCorrect: 12,
} as const;

export interface ActivitySnapshot {
  checklistTicks: number;   // total checklist items ticked (any domain)
  solvedProblems: number;   // DSA practice problems solved
  quizCorrect: number;      // correct inline-quiz answers
  lessonsCompleted: number; // lessons with their full checklist done
  currentStreak: number;    // consecutive active-learning days
}

export function totalXp(a: ActivitySnapshot): number {
  return (
    a.checklistTicks * XP.checklistItem +
    a.solvedProblems * XP.solvedProblem +
    a.quizCorrect * XP.quizCorrect
  );
}

/** Cumulative XP required to *reach* a level (level 1 = 0 XP). Gentle then
 *  steeper: L2=100, L3=300, L4=600, L5=1000, L6=1500 … */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return 50 * (level - 1) * level;
}

export interface LevelInfo {
  level: number;
  xp: number;
  levelFloor: number;   // XP at the start of this level
  levelCeil: number;    // XP needed for the next level
  intoLevel: number;    // XP earned within the current level
  span: number;         // XP width of the current level
  progress: number;     // 0..1 toward the next level
}

export function levelInfo(xp: number): LevelInfo {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  const levelFloor = xpForLevel(level);
  const levelCeil = xpForLevel(level + 1);
  const span = levelCeil - levelFloor;
  const intoLevel = xp - levelFloor;
  return {
    level,
    xp,
    levelFloor,
    levelCeil,
    intoLevel,
    span,
    progress: span > 0 ? intoLevel / span : 0,
  };
}

export interface BadgeDef {
  id: string;
  label: string;
  desc: string;
  /** Emoji icon — kept as data so no icon import is needed per badge. */
  icon: string;
  earned: (a: ActivitySnapshot, xp: number) => boolean;
}

export const BADGES: BadgeDef[] = [
  { id: "first-steps", label: "First Steps", desc: "Complete your first learning action", icon: "🌱", earned: (a) => a.checklistTicks + a.quizCorrect + a.solvedProblems >= 1 },
  { id: "lesson-one", label: "Lesson One", desc: "Finish a full lesson", icon: "📘", earned: (a) => a.lessonsCompleted >= 1 },
  { id: "consistent", label: "Getting Consistent", desc: "Reach a 3-day streak", icon: "📅", earned: (a) => a.currentStreak >= 3 },
  { id: "on-fire", label: "On Fire", desc: "Reach a 7-day streak", icon: "🔥", earned: (a) => a.currentStreak >= 7 },
  { id: "quiz-whiz", label: "Quiz Whiz", desc: "Answer 10 quiz questions correctly", icon: "🧠", earned: (a) => a.quizCorrect >= 10 },
  { id: "problem-solver", label: "Problem Solver", desc: "Solve 10 practice problems", icon: "⚔️", earned: (a) => a.solvedProblems >= 10 },
  { id: "scholar", label: "Scholar", desc: "Complete 5 lessons", icon: "🎓", earned: (a) => a.lessonsCompleted >= 5 },
  { id: "centurion", label: "Centurion", desc: "Earn 1,000 XP", icon: "💯", earned: (_a, xp) => xp >= 1000 },
];

export function earnedBadges(a: ActivitySnapshot, xp: number): BadgeDef[] {
  return BADGES.filter((b) => b.earned(a, xp));
}
