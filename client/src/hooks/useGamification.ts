// Assembles the gamification snapshot from already-persisted stores (checklist
// ticks, solved problems, quiz results, streak) and runs it through the pure
// lib/gamification.ts derivations. Also detects a level-up transition (for a
// one-shot celebration) without maintaining any separate event log — it just
// compares the freshly-computed level to the last level we persisted.
import { useEffect, useMemo, useState } from "react";
import { useLocalStorageState, LS_KEYS } from "./useLocalStorageState";
import { useLearningProgress } from "./useLearningProgress";
import { useDailyStreak } from "./useDailyStreak";
import { QUIZ_STORE_KEY, type QuizStore } from "../lib/quizStore";
import { loadDomain, DOMAINS, isLessonComplete } from "../content/registry";
import {
  totalXp, levelInfo, earnedBadges, BADGES,
  type ActivitySnapshot, type BadgeDef, type LevelInfo,
} from "../lib/gamification";

const LAST_LEVEL_KEY = LS_KEYS.gamificationLevel;

export interface Gamification {
  xp: number;
  level: LevelInfo;
  badges: BadgeDef[];
  allBadges: BadgeDef[];
  lessonsCompleted: number;
  justLeveledUp: boolean;
  acknowledgeLevelUp: () => void;
}

export function useGamification(): Gamification {
  const { store, stats, isChecked } = useLearningProgress();
  const { currentStreak } = useDailyStreak();
  const [quizStore] = useLocalStorageState<QuizStore>(QUIZ_STORE_KEY, {});

  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  useEffect(() => {
    let cancelled = false;
    Promise.all(DOMAINS.map((d) => loadDomain(d))).then((allModules) => {
      if (cancelled) return;
      const lessons = allModules.flat().flatMap((m) => m.lessons);
      const done = lessons.filter((l) => isLessonComplete(isChecked, l)).length;
      setLessonsCompleted(done);
    });
    return () => { cancelled = true; };
    // Re-derive whenever checklist state changes (store.checklist identity changes on toggle).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.checklist]);

  const snapshot: ActivitySnapshot = useMemo(
    () => ({
      checklistTicks: Object.values(store.checklist).filter(Boolean).length,
      solvedProblems: stats.problemsSolved,
      quizCorrect: Object.values(quizStore).filter((r) => r === "correct").length,
      lessonsCompleted,
      currentStreak,
    }),
    [store.checklist, stats.problemsSolved, quizStore, lessonsCompleted, currentStreak]
  );

  const xp = totalXp(snapshot);
  const level = levelInfo(xp);
  const badges = useMemo(() => earnedBadges(snapshot, xp), [snapshot, xp]);

  // `lastLevel` is the highest level we've already celebrated. A fresh signup
  // (or first render before any XP) starts at level 1 with lastLevel 1, so no
  // false celebration fires; a real level-up leaves justLeveledUp true until
  // the consumer calls acknowledgeLevelUp() after showing the celebration.
  const [lastLevel, setLastLevel] = useLocalStorageState<number>(LAST_LEVEL_KEY, 1);
  const justLeveledUp = level.level > lastLevel;
  const acknowledgeLevelUp = () => setLastLevel(level.level);

  return {
    xp,
    level,
    badges,
    allBadges: BADGES,
    lessonsCompleted,
    justLeveledUp,
    acknowledgeLevelUp,
  };
}
