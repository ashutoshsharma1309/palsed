import { Card } from "../components/ui/Card";
import { ResourceLibraryPage } from "../components/ResourceLibraryPage";
import { ExternalLink } from "lucide-react";

const TOOLS = [
  { name: "Excalidraw", url: "https://excalidraw.com/", desc: "Hand-drawn-style whiteboard. Best for ideation." },
  { name: "draw.io", url: "https://app.diagrams.net/", desc: "Big, free, exports SVG/PNG. Workhorse." },
  { name: "Mermaid Live", url: "https://mermaid.live/", desc: "Diagrams from text. Works in your README." },
  { name: "tldraw", url: "https://www.tldraw.com/", desc: "Snappy, minimal, multiplayer." },
  { name: "Eraser.io", url: "https://www.eraser.io/", desc: "Docs + diagrams in one canvas." },
];

export default function SystemDesign() {
  return (
    <ResourceLibraryPage
      title="SYSTEM DESIGN."
      tagline="Foundational primers, case studies, and the diagram tools you'll actually use in interviews."
      mdPath="/system-design.md"
      accent="#b5d4ff"
      canonical="/system-design"
      metaTitle="System Design — Primers, Case Studies & Diagram Tools"
      extras={
        <Card className="my-6">
          <div className="mono text-xs uppercase tracking-widest text-[var(--color-neon)] mb-3">
            // diagram sandbox
          </div>
          <h2 className="display text-3xl mb-4">SKETCH ON THE FLY.</h2>
          <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TOOLS.map((t) => (
              <a
                key={t.name}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[var(--color-line)] hover:border-[var(--color-neon)] rounded-lg p-4 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold">{t.name}</div>
                  <ExternalLink className="w-3 h-3 text-[var(--color-text-faint)] group-hover:text-[var(--color-neon)]" />
                </div>
                <div className="text-xs text-[var(--color-text-faint)]">{t.desc}</div>
              </a>
            ))}
          </div>
        </Card>
      }
    />
  );
}
