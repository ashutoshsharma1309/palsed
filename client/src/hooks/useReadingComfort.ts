import { useCallback, useEffect, useState } from "react";

// Reading-comfort preferences for long (3–4h) study sessions:
//   • textScale — scales the root font size so every rem-based size + spacing
//     grows together (the same thing the OS "larger text" setting does).
//   • warm — a low-blue-light tint (f.lux / Night-Shift style) that warms the
//     bright surfaces where most eye-tiring blue light comes from.
// Both persist to localStorage and are applied to <html> before React paints
// (see main.tsx) so there's no flash of the wrong setting on reload.

export type TextScale = "default" | "large" | "larger";

const SCALE_KEY = "prepnext.comfort.scale.v1";
const WARM_KEY = "prepnext.comfort.warm.v1";

const SCALE_PX: Record<TextScale, string> = {
  default: "16px",
  large: "17.5px",
  larger: "19px",
};

function readScale(): TextScale {
  try {
    const v = localStorage.getItem(SCALE_KEY);
    if (v === "default" || v === "large" || v === "larger") return v;
  } catch {}
  return "default";
}

function readWarm(): boolean {
  try {
    return localStorage.getItem(WARM_KEY) === "1";
  } catch {
    return false;
  }
}

/** Apply both prefs to the document. Safe to call before React mounts. */
export function applyComfort(scale: TextScale, warm: boolean): void {
  const root = document.documentElement;
  root.setAttribute("data-text-scale", scale);
  root.style.fontSize = SCALE_PX[scale];
  root.setAttribute("data-warm", warm ? "on" : "off");
}

export function resolveInitialComfort(): { scale: TextScale; warm: boolean } {
  return { scale: readScale(), warm: readWarm() };
}

export function useReadingComfort() {
  const [scale, setScaleState] = useState<TextScale>(readScale);
  const [warm, setWarmState] = useState<boolean>(readWarm);

  const setScale = useCallback(
    (next: TextScale) => {
      setScaleState(next);
      applyComfort(next, warm);
      try { localStorage.setItem(SCALE_KEY, next); } catch {}
    },
    [warm]
  );

  const setWarm = useCallback(
    (next: boolean) => {
      setWarmState(next);
      applyComfort(scale, next);
      try { localStorage.setItem(WARM_KEY, next ? "1" : "0"); } catch {}
    },
    [scale]
  );

  const toggleWarm = useCallback(() => setWarm(!warm), [warm, setWarm]);

  // Keep settings in sync across tabs.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SCALE_KEY) {
        const s = readScale();
        setScaleState(s);
        applyComfort(s, readWarm());
      } else if (e.key === WARM_KEY) {
        const w = readWarm();
        setWarmState(w);
        applyComfort(readScale(), w);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { scale, setScale, warm, setWarm, toggleWarm };
}
