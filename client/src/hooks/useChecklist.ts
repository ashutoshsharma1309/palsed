// Per-topic learning checklist — a thin wrapper over the central learning store
// so lesson pages can render + persist a topic's checklist without knowing the
// storage details.
import { useLearningProgress } from "./useLearningProgress";
import { getTopic, checklistFor } from "../data/dsa/roadmap";

export function useChecklist(topicId: string) {
  const { isChecked, toggleChecklist } = useLearningProgress();
  const topic = getTopic(topicId);
  const items = topic ? checklistFor(topic) : [];
  const completedCount = items.filter((it) => isChecked(topicId, it.id)).length;
  return {
    items,
    isChecked: (itemId: string) => isChecked(topicId, itemId),
    toggle: (itemId: string) => toggleChecklist(topicId, itemId),
    completedCount,
    total: items.length,
  };
}
