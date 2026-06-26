import { useEffect, useRef, useState } from "react";

let _mermaidPromise: Promise<any> | null = null;
function loadMermaid() {
  if (!_mermaidPromise) {
    _mermaidPromise = import("mermaid").then((m) => {
      m.default.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          primaryColor: "#c8ff3d",
          primaryTextColor: "#0a0a0a",
          primaryBorderColor: "#c8ff3d",
          lineColor: "#c8ff3d",
          secondaryColor: "#1a1a1a",
          tertiaryColor: "#161616",
          background: "#0a0a0a",
          mainBkg: "#161616",
          fontFamily: "Inter, sans-serif",
        },
        // "strict" disables inline scripts/HTML in diagram definitions — XSS
        // hardening in case diagram source is ever influenced by untrusted input.
        securityLevel: "strict",
        fontFamily: "Inter, sans-serif",
      });
      return m.default;
    });
  }
  return _mermaidPromise;
}

let counter = 0;

export function MermaidDiagram({ source }: { source: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSource, setShowSource] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = await loadMermaid();
        const id = `mmd-${++counter}-${Date.now()}`;
        const { svg } = await mermaid.render(id, source);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to render diagram");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [source]);

  return (
    <div className="mt-4 card-base !p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-neon)]">
          // diagram
        </div>
        <button
          className="text-[10px] mono text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
          onClick={() => setShowSource((v) => !v)}
        >
          {showSource ? "hide source" : "view source"}
        </button>
      </div>
      {error ? (
        <div className="text-xs text-red-300 mono">
          Couldn't render: {error}
          <pre className="text-[var(--color-text-faint)] mt-2 whitespace-pre-wrap">{source}</pre>
        </div>
      ) : (
        <div ref={ref} className="overflow-x-auto flex justify-center" />
      )}
      {showSource && (
        <pre className="text-xs text-[var(--color-text-faint)] mono whitespace-pre-wrap mt-3 p-3 bg-[#0a0a0a] rounded-lg">
          {source}
        </pre>
      )}
    </div>
  );
}
