// Legacy "learning profile" type — display name, learning goal, preferred lesson
// style, and a daily-minutes target. Used by the older Dashboard/Settings screens
// and the legacy course/tutor routes.
//
// Extracted here because the current placement-focused Onboarding screen no longer
// defines this type; the files above previously imported it from "./Onboarding",
// which broke after that rewrite. Pointing them at this stable module fixes the
// type imports without touching runtime behavior.
export type LessonStyle = "visual" | "code_first" | "analogy" | "step_by_step";

export interface Profile {
  displayName: string;
  avatarSeed: string;
  joinedAt: string;
  learningGoal: string;
  preferredStyle: LessonStyle;
  dailyMinutes: number;
}
