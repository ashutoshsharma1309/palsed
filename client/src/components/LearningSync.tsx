// Mounts the learning-progress sync app-wide (renders nothing).
import { useLearningSync } from "../hooks/useLearningSync";

export function LearningSync() {
  useLearningSync();
  return null;
}
