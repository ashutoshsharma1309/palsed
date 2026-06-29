// The placement journey, made visible. The dashboard used to be DSA-only;
// this surfaces the full Learn → Practice → Build → Interview → Placement arc
// so students always know what the platform covers and where to go next.
// Each stage links to its modules; no new data, just orientation.
import { Link } from "react-router-dom";
import {
  BookOpen,
  Dumbbell,
  FolderGit2,
  Mic,
  Trophy,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

type Stage = {
  key: string;
  label: string;
  Icon: LucideIcon;
  accent: string;
  blurb: string;
  links: { to: string; label: string }[];
};

const STAGES: Stage[] = [
  {
    key: "learn",
    label: "Learn",
    Icon: BookOpen,
    accent: "blue",
    blurb: "Build the fundamentals.",
    links: [
      { to: "/dsa", label: "DSA Learning" },
      { to: "/patterns", label: "Patterns" },
      { to: "/core-cs", label: "Core CS" },
      { to: "/aptitude", label: "Aptitude" },
    ],
  },
  {
    key: "practice",
    label: "Practice",
    Icon: Dumbbell,
    accent: "mint",
    blurb: "Apply under pressure.",
    links: [
      { to: "/oa", label: "Mock OA" },
      { to: "/pyq", label: "PYQs" },
      { to: "/review", label: "Spaced Review" },
    ],
  },
  {
    key: "build",
    label: "Build",
    Icon: FolderGit2,
    accent: "yellow",
    blurb: "Ship resume-worthy projects.",
    links: [{ to: "/projects", label: "Projects" }],
  },
  {
    key: "interview",
    label: "Interview",
    Icon: Mic,
    accent: "purple",
    blurb: "Get interview-ready.",
    links: [
      { to: "/interview-resources", label: "Interview Prep" },
      { to: "/system-design", label: "System Design" },
    ],
  },
  {
    key: "placement",
    label: "Placement",
    Icon: Trophy,
    accent: "peach",
    blurb: "Land the offer.",
    links: [
      { to: "/companies", label: "Companies" },
      { to: "/hackathon", label: "Hackathons" },
      { to: "/internships", label: "Internships" },
    ],
  },
];

export function JourneyMap() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="display text-2xl">YOUR PLACEMENT JOURNEY.</h2>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {STAGES.map((s, i) => (
          <div
            key={s.key}
            className="card-base p-4 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-8 h-8 rounded-xl grid place-items-center shrink-0"
                style={{ background: `var(--color-${s.accent})`, color: "#0a0a0a" }}
              >
                <s.Icon className="w-4 h-4" />
              </span>
              <div>
                <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">
                  Step {i + 1}
                </div>
                <div className="font-bold leading-none">{s.label}</div>
              </div>
            </div>
            <p className="text-[11px] text-[var(--color-text-faint)] mb-3">{s.blurb}</p>
            <div className="flex flex-col gap-1 mt-auto">
              {s.links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="group inline-flex items-center justify-between text-sm text-[var(--color-text-dim)] hover:text-[var(--color-neon-text)] rounded-lg px-2 py-1 hover:bg-[var(--color-card-soft)]"
                >
                  {l.label}
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
