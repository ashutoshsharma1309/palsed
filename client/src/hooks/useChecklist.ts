// Generic learning checklist — a thin wrapper over the central learning store so
// any lesson surface (roadmap topic OR pattern) can render + persist a checklist
// without knowing the storage details. Completing an item stamps learning
// activity (extends the streak). Keyed by `${id}:${itemId}`.
import { useLearningProgress } from "./useLearningProgress";
import type { ChecklistItem } from "../data/dsa/roadmap";

export function useChecklist(id: string, items: ChecklistItem[]) {
  const { isChecked, toggleChecklist } = useLearningProgress();
  const completedCount = items.filter((it) => isChecked(id, it.id)).length;
  return {
    items,
    isChecked: (itemId: string) => isChecked(id, itemId),
    toggle: (itemId: string) => toggleChecklist(id, itemId),
    completedCount,
    total: items.length,
  };
}
