// Placement Readiness Score — the headline metric for both students and TPOs.
// A single 0–100 number across the whole journey, a per-dimension breakdown,
// and a "what to improve next" nudge that routes to the weakest area.
import { Link } from "react-router-dom";
import { ArrowRight, Gauge } from "lucide-react";
import { Card } from "../ui/Card";
import { usePlacementReadiness } from "../../hooks/usePlacementReadiness";

const NEXT_LINK: Record<string, { to: string; label: string }> = {
  dsa: { to: "/dsa", label: "Continue the DSA roadmap" },
  patterns: { to: "/patterns", label: "Master more patterns" },
  projects: { to: "/projects", label: "Build a project" },
  oa: { to: "/oa", label: "Take a mock OA" },
  consistency: { to: "/dsa", label: "Study a little today" },
};

export function ReadinessCard() {
  const r = usePlacementReadiness();
  const next = NEXT_LINK[r.weakest.key] ?? NEXT_LINK.dsa;
  // SVG ring geometry
  const radius = 34;
  const circ = 2 * Math.PI * radius;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="w-4 h-4 text-[var(--color-neon)]" />
        <h3 className="mono text-xs uppercase tracking-widest">Placement readiness</h3>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative shrink-0" style={{ width: 84, height: 84 }}>
          <svg width="84" height="84" className="-rotate-90">
            <circle cx="42" cy="42" r={radius} fill="none" stroke="var(--color-line)" strokeWidth="7" />
            <circle
              cx="42" cy="42" r={radius} fill="none"
              stroke={r.bandColor} strokeWidth="7" strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - r.score / 100)}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-2xl font-bold leading-none">{r.score}</div>
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold" style={{ color: r.bandColor }}>{r.band}</div>
          <p className="text-[11px] text-[var(--color-text-faint)] mt-0.5">
            Your overall placement-prep score across learning, practice, and projects.
          </p>
        </div>
      </div>

      {/* Dimension breakdown */}
      <div className="mt-4 space-y-2">
        {r.dimensions.map((d) => (
          <div key={d.key}>
            <div className="flex items-center justify-between text-[11px] mb-0.5">
              <span className="text-[var(--color-text-dim)]">{d.label}</span>
              <span className="mono text-[var(--color-text-faint)]">{d.detail}</span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--color-line)] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.round(d.value * 100)}%`, background: "var(--color-neon)", transition: "width 0.6s ease" }}
              />
            </div>
          </div>
        ))}
      </div>

      <Link
        to={next.to}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-neon-text)] hover:gap-2 transition-all"
      >
        Improve next: {next.label} <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </Card>
  );
}
