import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, Target, X } from "lucide-react";
import { useLocalStorageState, LS_KEYS } from "../../hooks/useLocalStorageState";

const FOCUS_KEY = "palsed.focusmode.v1";

interface FocusState {
  active: boolean;
  mode: "focus" | "break";
  endsAt: number | null;
  cyclesToday: number;
  lastDate: string;
}

const DEFAULT: FocusState = {
  active: false,
  mode: "focus",
  endsAt: null,
  cyclesToday: 0,
  lastDate: new Date().toISOString().slice(0, 10),
};

const FOCUS_MS = 25 * 60 * 1000;
const BREAK_MS = 5 * 60 * 1000;

export function FocusMode() {
  const [state, setState] = useLocalStorageState<FocusState>(FOCUS_KEY, DEFAULT);
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(Date.now());

  // expose globally so InterventionToast can pause itself
  useEffect(() => {
    (window as any).__palsed_focus_active = state.active;
  }, [state.active]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);

  // auto-rotate focus → break → focus
  useEffect(() => {
    if (!state.active || state.endsAt === null) return;
    if (now >= state.endsAt) {
      const nextMode = state.mode === "focus" ? "break" : "focus";
      const today = new Date().toISOString().slice(0, 10);
      try {
        new Audio(
          "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="
        ).play().catch(() => {});
      } catch {}
      setState({
        ...state,
        mode: nextMode,
        endsAt: now + (nextMode === "focus" ? FOCUS_MS : BREAK_MS),
        cyclesToday: state.mode === "focus" ? state.cyclesToday + 1 : state.cyclesToday,
        lastDate: today,
      });
    }
  }, [now, state, setState]);

  const start = () => {
    setState({
      ...state,
      active: true,
      mode: "focus",
      endsAt: Date.now() + FOCUS_MS,
    });
  };
  const pause = () => setState({ ...state, active: false, endsAt: null });
  const reset = () => setState({ ...DEFAULT, cyclesToday: state.cyclesToday });

  const remaining = state.endsAt ? Math.max(0, state.endsAt - now) : 0;
  const mm = Math.floor(remaining / 60000);
  const ss = Math.floor((remaining % 60000) / 1000);
  const display = `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
  const totalMs = state.mode === "focus" ? FOCUS_MS : BREAK_MS;
  const frac = state.endsAt ? 1 - remaining / totalMs : 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed top-16 right-4 z-40 mono text-xs px-3 py-1.5 rounded-full border ${
          state.active
            ? state.mode === "focus"
              ? "bg-[var(--color-neon)] text-black border-[var(--color-neon)] neon-glow"
              : "bg-[var(--color-mint)] text-black border-[var(--color-mint)]"
            : "bg-black/60 backdrop-blur border-white/20 text-white/70 hover:border-[var(--color-neon)]"
        }`}
        title="Focus mode (Pomodoro)"
      >
        <Target className="inline w-3 h-3 mr-1" />
        {state.active ? `${display} ${state.mode}` : "Focus"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="card-base p-8 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-1">
              // focus mode · pomodoro
            </div>
            <h2 className="display text-3xl mb-1">{state.mode === "focus" ? "DEEP WORK." : "BREATHE."}</h2>
            <div className="mono text-xs text-white/40 mb-6">
              {state.mode === "focus" ? "25 min · interventions muted" : "5 min · stretch, water"}
            </div>

            <div className="display text-[100px] leading-none neon-text text-center mono">
              {display}
            </div>

            <div className="my-5 w-full h-2 rounded-full bg-[#1a1a1a] overflow-hidden">
              <div
                className="h-full bg-[var(--color-neon)] transition-all"
                style={{ width: `${frac * 100}%` }}
              />
            </div>

            <div className="text-center text-xs text-white/50 mb-5">
              <span className="mono text-[var(--color-neon)]">{state.cyclesToday}</span> cycles done today
            </div>

            <div className="flex gap-2">
              {state.active ? (
                <button onClick={pause} className="flex-1 py-3 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center gap-2">
                  <Pause className="w-4 h-4" /> Pause
                </button>
              ) : (
                <button onClick={start} className="flex-1 py-3 rounded-full bg-[var(--color-neon)] text-black font-bold flex items-center justify-center gap-2 neon-glow">
                  <Play className="w-4 h-4" /> Start focus
                </button>
              )}
              <button onClick={reset} className="px-4 py-3 rounded-full border border-white/20 hover:border-[var(--color-neon)]">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
