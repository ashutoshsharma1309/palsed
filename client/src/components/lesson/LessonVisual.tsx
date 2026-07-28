// Renders a lesson's visual spec: either a Mermaid diagram or a named
// animation from the visuals registry. Falls back gracefully when a named
// animation isn't implemented yet, so authoring a `visual` never breaks a page.
import { MermaidDiagram } from "./MermaidDiagram";
import { getAnimation } from "./visuals";
import type { VisualSpec } from "../../content/types";

export function LessonVisual({ spec }: { spec: VisualSpec }) {
  let body: React.ReactNode = null;

  if (spec.kind === "mermaid") {
    body = <MermaidDiagram source={spec.src} />;
  } else {
    const Anim = getAnimation(spec.name);
    body = Anim ? <Anim /> : null;
  }

  if (!body) return null;

  return (
    <figure className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-soft)] overflow-hidden">
      <div className="p-2">{body}</div>
      {spec.caption && (
        <figcaption className="px-4 py-2 border-t border-[var(--color-line)] text-[12px] text-[var(--color-text-faint)] text-center">
          {spec.caption}
        </figcaption>
      )}
    </figure>
  );
}
