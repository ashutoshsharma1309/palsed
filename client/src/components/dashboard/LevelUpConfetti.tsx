// A brief, tasteful confetti burst for major milestones (level-up) only — per
// the product brief, gamification stays subtle and this is the one moment it's
// allowed to be loud. Self-contained (no new dependency): framer-motion pieces
// that fall + fade, auto-dismiss. Respects prefers-reduced-motion.
import { useEffect, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

const COLORS = ["#c8ff3d", "#7dd3fc", "#c4b5fd", "#fca5a5", "#fde68a"];
const PIECES = 28;

export function LevelUpConfetti({ show, onDone }: { show: boolean; onDone: () => void }) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (!show) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      onDone();
    }, reduce ? 0 : 1800);
    return () => clearTimeout(t);
  }, [show, reduce, onDone]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {visible && (
        <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden" aria-hidden="true">
          {Array.from({ length: PIECES }).map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 0.3;
            const duration = 1.2 + Math.random() * 0.6;
            const color = COLORS[i % COLORS.length];
            const rotate = Math.random() * 360;
            return (
              <motion.span
                key={i}
                initial={{ top: "-5%", left: `${left}%`, opacity: 1, rotate: 0 }}
                animate={{ top: "105%", opacity: [1, 1, 0], rotate }}
                transition={{ duration, delay, ease: "easeIn" }}
                style={{
                  position: "absolute",
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: color,
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
