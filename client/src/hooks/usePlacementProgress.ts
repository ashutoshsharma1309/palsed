// Placement Hub progress + bookmarks, persisted in localStorage and reactive
// across components (built on useLocalStorageState's subscriber model).
import { useCallback, useMemo } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { TOTAL_TOPICS, SECTIONS, getTopic } from "../data/placement";

const COMPLETED_KEY = "prepnext.placement.completed.v1";
const BOOKMARKS_KEY = "prepnext.placement.bookmarks.v1";

export function usePlacementProgress() {
  const [completed, setCompleted] = useLocalStorageState<string[]>(COMPLETED_KEY, []);
  const [bookmarks, setBookmarks] = useLocalStorageState<string[]>(BOOKMARKS_KEY, []);

  const completedSet = useMemo(() => new Set(completed), [completed]);
  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks]);

  const isComplete = useCallback((topicId: string) => completedSet.has(topicId), [completedSet]);

  const toggleComplete = useCallback(
    (topicId: string) => {
      setCompleted((prev) =>
        prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
      );
    },
    [setCompleted]
  );

  const isBookmarked = useCallback((url: string) => bookmarkSet.has(url), [bookmarkSet]);

  const toggleBookmark = useCallback(
    (url: string) => {
      setBookmarks((prev) =>
        prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
      );
    },
    [setBookmarks]
  );

  // Per-section completion counts.
  const sectionProgress = useMemo(
    () =>
      SECTIONS.map((s) => {
        const done = s.topics.filter((t) => completedSet.has(t.id)).length;
        return { id: s.id, title: s.title, accent: s.accent, done, total: s.topics.length };
      }),
    [completedSet]
  );

  // Saved resources resolved to { url } list (caller can render).
  const savedResources = useMemo(() => Array.from(bookmarkSet), [bookmarkSet]);

  const completedCount = completedSet.size;
  const completionPct = TOTAL_TOPICS ? completedCount / TOTAL_TOPICS : 0;
  // Placement readiness: weighted toward breadth across sections.
  const sectionsTouched = sectionProgress.filter((s) => s.done > 0).length;
  const readinessScore = Math.round(
    Math.min(100, completionPct * 70 + (sectionsTouched / SECTIONS.length) * 30)
  );

  // Next recommended topics: first incomplete topic from each untouched/low section.
  const recommended = useMemo(() => {
    const out: { topicId: string; topicTitle: string; sectionTitle: string }[] = [];
    for (const s of SECTIONS) {
      const next = s.topics.find((t) => !completedSet.has(t.id));
      if (next) out.push({ topicId: next.id, topicTitle: next.title, sectionTitle: s.title });
      if (out.length >= 4) break;
    }
    return out;
  }, [completedSet]);

  return {
    completed,
    bookmarks,
    isComplete,
    toggleComplete,
    isBookmarked,
    toggleBookmark,
    completedCount,
    completionPct,
    readinessScore,
    sectionProgress,
    savedResources,
    recommended,
    totalTopics: TOTAL_TOPICS,
    getTopic,
  };
}
