import { useEffect, useRef, useState } from "react";
import { Type, Sun } from "lucide-react";
import { useReadingComfort, type TextScale } from "../../hooks/useReadingComfort";

const SCALES: { id: TextScale; label: string; sample: string }[] = [
  { id: "default", label: "Default", sample: "A" },
  { id: "large", label: "Large", sample: "A" },
  { id: "larger", label: "Larger", sample: "A" },
];

/**
 * Reading-comfort popover for the nav. Lets users size up the whole interface
 * and switch on a warm (low-blue-light) tint for long study sessions. Mirrors
 * the ThemeToggle button styling and the Prep dropdown's outside-click pattern.
 */
export function ComfortMenu({ className = "" }: { className?: string }) {
  const { scale, setScale, warm, setWarm } = useReadingComfort();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="theme-toggle"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Reading comfort"
        title="Reading comfort — text size & warm light"
      >
        <Type className="w-4 h-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)] shadow-2xl overflow-hidden z-40 p-3"
        >
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-2">
            Reading comfort
          </div>

          {/* Text size */}
          <div className="text-xs font-semibold mb-1.5 text-[var(--color-text-dim)]">Text size</div>
          <div className="flex items-stretch gap-1 mb-3 rounded-xl bg-[var(--color-bg-soft)] p-1">
            {SCALES.map((s, i) => {
              const active = scale === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setScale(s.id)}
                  className={`flex-1 rounded-lg py-1.5 flex items-center justify-center transition-colors ${
                    active
                      ? "bg-[var(--color-neon)] text-black font-bold"
                      : "text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-[var(--color-card-soft)]"
                  }`}
                  aria-pressed={active}
                  title={s.label}
                >
                  <span style={{ fontSize: 11 + i * 4 }} className="leading-none font-semibold">
                    {s.sample}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Warm light */}
          <button
            onClick={() => setWarm(!warm)}
            role="menuitemcheckbox"
            aria-checked={warm}
            className="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2 bg-[var(--color-bg-soft)] hover:bg-[var(--color-card-soft)] transition-colors"
          >
            <span className="flex items-center gap-2 text-xs font-semibold">
              <Sun className="w-4 h-4 text-[var(--color-neon)]" /> Warm light
            </span>
            <span
              className={`relative inline-block w-9 h-5 rounded-full transition-colors ${
                warm ? "bg-[var(--color-neon)]" : "bg-[var(--color-line)]"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-black transition-transform ${
                  warm ? "translate-x-4" : ""
                }`}
              />
            </span>
          </button>
          <p className="text-[11px] text-[var(--color-text-faint)] mt-2 leading-snug">
            Reduces blue light to ease eye strain on long study sessions.
          </p>
        </div>
      )}
    </div>
  );
}
