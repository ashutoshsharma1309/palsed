// In-app daily-goal nudge — the retention hook. Shows once per day until the
// user completes a lesson item, then disappears. (Email/push reminders need
// backend infra and are a separate follow-up.)
import { X, Flame } from "lucide-react";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { localISO } from "../../lib/streakDates";

const DISMISS_KEY = "prepnext.nudgeDismissed.v1";

export function DailyGoalBanner() {
  const { stats } = useLearningProgress();
  const [dismissed, setDismissed] = useLocalStorageState<string>(DISMISS_KEY, "");
  const today = localISO();

  // Hide once today's goal is met or the user dismissed it today.
  if (stats.todayActive || dismissed === today) return null;

  const atRisk = stats.currentStreak > 0;
  return (
    <div className="rounded-2xl border border-[var(--color-neon)]/40 bg-[var(--color-neon)]/10 px-4 py-3 flex items-center gap-3">
      <Flame className="w-5 h-5 text-[var(--color-neon)] shrink-0" />
      <p className="text-sm text-[var(--color-text)] flex-1">
        {atRisk
          ? <>Your <strong>{stats.currentStreak}-day</strong> streak is at risk — complete one lesson item today to keep it alive. 🔥</>
          : <>Start your streak today — complete just one lesson item to begin. 🔥</>}
      </p>
      <button
        onClick={() => setDismissed(today)}
        aria-label="Dismiss for today"
        className="shrink-0 text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
