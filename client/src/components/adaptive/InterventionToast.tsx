import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useEngagement } from "./EngagementProvider";
import { Button } from "../ui/Button";

const STUCK_THRESHOLD = 0.4;
const STUCK_WINDOW_MS = 90_000;

export function InterventionToast() {
  const { signal, noteIntervention } = useEngagement();
  const loc = useLocation();
  const [show, setShow] = useState(false);
  const lowSinceRef = useRef<number | null>(null);
  const lastFiredRef = useRef<number>(0);

  // Only fire on lesson pages
  const isLesson = /^\/courses\/[^/]+\/lesson\//.test(loc.pathname) || /^\/dsa\/[^/]+/.test(loc.pathname);

  useEffect(() => {
    if (!isLesson) {
      lowSinceRef.current = null;
      return;
    }
    // Mute interventions during Focus Mode — deep work is sacred
    if ((window as any).__palsed_focus_active) return;
    if (signal < STUCK_THRESHOLD) {
      if (lowSinceRef.current === null) lowSinceRef.current = Date.now();
      const elapsed = Date.now() - lowSinceRef.current;
      const cooldownOver = Date.now() - lastFiredRef.current > 5 * 60 * 1000;
      if (elapsed >= STUCK_WINDOW_MS && cooldownOver && !show) {
        setShow(true);
        lastFiredRef.current = Date.now();
        noteIntervention("show_stuck_prompt");
      }
    } else {
      lowSinceRef.current = null;
    }
  }, [signal, isLesson, show, noteIntervention]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm card-base p-5 border-[var(--color-neon)]/40 neon-glow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="display text-xl neon-text mb-1">STUCK?</div>
          <div className="text-sm text-white/80">
            Your focus looks low. Want me to re-explain this differently?
          </div>
        </div>
        <button
          className="text-white/40 hover:text-white"
          onClick={() => setShow(false)}
        >
          ✕
        </button>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Button
          size="sm"
          fullWidth
          onClick={() => {
            window.dispatchEvent(new CustomEvent("palsed:stuck:switch-style"));
            noteIntervention("switch_style");
            setShow(false);
          }}
        >
          Switch explanation style
        </Button>
        <Button
          size="sm"
          variant="outline"
          fullWidth
          onClick={() => {
            window.dispatchEvent(new CustomEvent("palsed:stuck:shorten"));
            noteIntervention("shorten_lesson");
            setShow(false);
          }}
        >
          Shorten this lesson
        </Button>
        <Button
          size="sm"
          variant="ghost"
          fullWidth
          onClick={() => {
            noteIntervention("break");
            setShow(false);
          }}
        >
          Take a 5-min break
        </Button>
      </div>
    </div>
  );
}
