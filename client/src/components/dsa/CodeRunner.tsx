import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Square, RotateCcw, TerminalSquare } from "lucide-react";
import { Button } from "../ui/Button";

// Self-contained JavaScript playground. Runs the user's code inside a sandboxed
// Web Worker (created from an inline blob — no network, no external services) so
// it works fully offline and can't touch the page. Execution is hard-capped by a
// timeout that terminates the worker, so an infinite loop can never hang the tab.

const STORAGE_PREFIX = "prepnext.dsa.playground.";
const RUN_TIMEOUT_MS = 4000;

// Worker body as a string. It overrides console.* to stream lines back to the
// main thread, evals the user code, and reports completion/errors.
const WORKER_SRC = `
self.onmessage = (e) => {
  const send = (stream, args) => {
    try {
      const text = args.map((a) => {
        if (typeof a === "string") return a;
        try { return JSON.stringify(a, null, 2); } catch { return String(a); }
      }).join(" ");
      self.postMessage({ type: "log", stream, text });
    } catch (_) {}
  };
  const console = {
    log: (...a) => send("log", a),
    info: (...a) => send("log", a),
    warn: (...a) => send("warn", a),
    error: (...a) => send("error", a),
    debug: (...a) => send("log", a),
    table: (...a) => send("log", a),
  };
  const started = Date.now();
  try {
    const result = (function () {
      "use strict";
      return eval(e.data.code);
    })();
    if (result !== undefined) send("log", ["⟶ " + (typeof result === "object" ? JSON.stringify(result) : String(result))]);
    self.postMessage({ type: "done", ms: Date.now() - started });
  } catch (err) {
    self.postMessage({ type: "error", text: (err && err.stack) ? String(err.stack) : String(err) });
  }
};
`;

type Line = { stream: "log" | "warn" | "error"; text: string };

const STREAM_COLOR: Record<Line["stream"], string> = {
  log: "var(--color-text-dim)",
  warn: "var(--severity-warn-text)",
  error: "var(--severity-crit-text)",
};

export function CodeRunner({ storageKey, starter }: { storageKey: string; starter?: string }) {
  const key = STORAGE_PREFIX + storageKey;
  const defaultCode =
    starter ??
    `// Scratchpad — write JavaScript, hit Run (Ctrl/Cmd+Enter).\n// console.log to print; the last expression's value is shown too.\n\nfunction twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));`;

  const [code, setCode] = useState<string>(() => {
    try {
      return localStorage.getItem(key) ?? defaultCode;
    } catch {
      return defaultCode;
    }
  });
  const [lines, setLines] = useState<Line[]>([]);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist code (debounced-ish: on every change is fine for a small textarea).
  useEffect(() => {
    try {
      localStorage.setItem(key, code);
    } catch {
      /* quota — ignore */
    }
  }, [key, code]);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const stop = useCallback(() => {
    cleanup();
    setRunning(false);
    setLines((l) => [...l, { stream: "warn", text: "■ Stopped." }]);
  }, [cleanup]);

  const run = useCallback(() => {
    cleanup();
    setLines([]);
    setElapsed(null);
    setRunning(true);

    let worker: Worker;
    try {
      const blob = new Blob([WORKER_SRC], { type: "application/javascript" });
      worker = new Worker(URL.createObjectURL(blob));
    } catch (e) {
      setLines([{ stream: "error", text: "Could not start the sandbox in this browser." }]);
      setRunning(false);
      return;
    }
    workerRef.current = worker;

    worker.onmessage = (ev: MessageEvent) => {
      const msg = ev.data;
      if (msg.type === "log") {
        setLines((l) => [...l, { stream: msg.stream, text: msg.text }]);
      } else if (msg.type === "done") {
        setElapsed(msg.ms);
        setRunning(false);
        cleanup();
      } else if (msg.type === "error") {
        setLines((l) => [...l, { stream: "error", text: msg.text }]);
        setRunning(false);
        cleanup();
      }
    };
    worker.onerror = (ev) => {
      setLines((l) => [...l, { stream: "error", text: ev.message || "Runtime error" }]);
      setRunning(false);
      cleanup();
    };

    worker.postMessage({ code });

    timerRef.current = setTimeout(() => {
      setLines((l) => [...l, { stream: "error", text: `⏱ Timed out after ${RUN_TIMEOUT_MS / 1000}s (possible infinite loop).` }]);
      stop();
    }, RUN_TIMEOUT_MS);
  }, [code, cleanup, stop]);

  const reset = useCallback(() => {
    setCode(defaultCode);
    setLines([]);
    setElapsed(null);
  }, [defaultCode]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      run();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <TerminalSquare className="w-4 h-4 text-[var(--color-neon)]" />
        <div className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)]">
          Code playground · JavaScript
        </div>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        rows={12}
        className="w-full mono text-[13px] leading-relaxed rounded-lg border border-[var(--color-line)] bg-[var(--color-card-soft)] p-3 outline-none focus:border-[var(--color-neon)] resize-y text-[var(--color-text)]"
        aria-label="JavaScript code editor"
      />

      <div className="flex items-center gap-2 mt-3">
        {running ? (
          <Button size="sm" variant="danger" onClick={stop}>
            <Square className="w-4 h-4" /> Stop
          </Button>
        ) : (
          <Button size="sm" onClick={run}>
            <Play className="w-4 h-4" /> Run
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={reset}>
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
        <span className="mono text-[10px] text-[var(--color-text-faint)] ml-auto">
          {running ? "running…" : elapsed !== null ? `done in ${elapsed}ms` : "⌘/Ctrl + ⏎ to run"}
        </span>
      </div>

      <div className="mt-3 rounded-lg border border-[var(--color-line)] bg-black/40 p-3 min-h-[64px] max-h-[240px] overflow-auto">
        {lines.length === 0 ? (
          <div className="mono text-[12px] text-[var(--color-text-faint)] italic">
            Output appears here. Runs in a sandboxed worker — safe and offline.
          </div>
        ) : (
          <pre className="mono text-[12px] whitespace-pre-wrap break-words">
            {lines.map((l, i) => (
              <div key={i} style={{ color: STREAM_COLOR[l.stream] }}>
                {l.text}
              </div>
            ))}
          </pre>
        )}
      </div>
    </div>
  );
}
