// Shared shape/key for inline-quiz results, so Quiz.tsx (writer) and
// useGamification.ts (reader) never drift on the storage key or result type.
import { LS_KEYS } from "../hooks/useLocalStorageState";

export type QuizResult = "correct" | "attempted";
export type QuizStore = Record<string, QuizResult>;

// Re-exported from LS_KEYS so the key is registered for export/import/wipe and
// the server progress sync (a literal here would silently never sync).
export const QUIZ_STORE_KEY = LS_KEYS.quiz;
