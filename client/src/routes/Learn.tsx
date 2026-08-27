// Learn home — the entry point to every learning domain (DSA / Web / AI).
// One purpose: pick a domain. Minimal by design (KISS).
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card } from "../components/ui/Card";
import { usePageMeta } from "../hooks/usePageMeta";
import { DOMAINS, DOMAIN_META } from "../content/registry";

const TINT: Record<string, "neon" | "blue" | "purple"> = {
  dsa: "neon",
  web: "blue",
  ai: "purple",
};

export default function Learn() {
  usePageMeta({
    title: "Learn — PrepNext",
    description: "University-quality curricula in DSA, Web Development, and AI. Deep content, minimal interface.",
    canonical: "/learn",
  });

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <header className="mb-10">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon-text)] mb-2">Learn</div>
        <h1 className="display text-4xl sm:text-5xl">Pick a track.</h1>
        <p className="text-[var(--color-text-dim)] mt-2 max-w-2xl">
          Each domain follows the same structured path — theory, examples, visuals, quizzes, and
          practice — so you always know how to make progress.
        </p>
      </header>

      <div className="grid sm:grid-cols-3 gap-5">
        {DOMAINS.map((d) => {
          const meta = DOMAIN_META[d];
          return (
            <Link key={d} to={`/learn/${d}`} className="group">
              <Card tint={TINT[d]} className="h-full flex flex-col">
                <div className="mono text-[11px] uppercase tracking-widest opacity-70 mb-2">{d}</div>
                <h2 className="text-xl font-bold mb-2 leading-tight">{meta.label}</h2>
                <p className="text-sm opacity-80 flex-1">{meta.blurb}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold mt-4">
                  Start learning <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
