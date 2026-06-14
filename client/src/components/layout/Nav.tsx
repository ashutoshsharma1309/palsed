import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useSRS } from "../../hooks/useSRS";
import { useEngagement } from "../adaptive/EngagementProvider";

const LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/dsa", label: "DSA" },
  { to: "/courses", label: "Courses" },
  { to: "/roadmaps", label: "Roadmaps" },
  { to: "/tutor", label: "Tutor" },
  { to: "/review", label: "Review" },
  { to: "/mastery", label: "Mastery" },
  { to: "/system-design", label: "System Design" },
  { to: "/core-cs", label: "Core CS" },
  { to: "/aptitude", label: "Aptitude" },
  { to: "/interview-resources", label: "Interview" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const { dueCount } = useSRS();
  const { streakDays } = useEngagement();

  return (
    <nav className="sticky top-0 z-30 backdrop-blur-md bg-black/60 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between h-14">
        <Link
          to="/"
          className="display text-2xl tracking-tight neon-text shrink-0"
        >
          PREPNEXT
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                  isActive
                    ? "text-[var(--color-neon)] bg-[var(--color-neon)]/10"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {l.label}
              {l.to === "/review" && dueCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center bg-[var(--color-neon)] text-black text-[10px] font-bold rounded-full px-1.5 py-0.5 mono">
                  {dueCount}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {streakDays > 0 && (
            <div className="mono text-[11px] text-[var(--color-neon)] uppercase tracking-widest">
              🔥 {streakDays}d
            </div>
          )}
          <Link
            to="/settings"
            className="text-xs text-white/60 hover:text-white"
          >
            Settings
          </Link>
        </div>

        <button
          className="lg:hidden text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 bg-black/95 px-4 py-3 grid grid-cols-2 gap-2">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 text-sm rounded-lg ${
                  isActive ? "text-[var(--color-neon)] bg-[var(--color-neon)]/10" : "text-white/80"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/settings"
            onClick={() => setOpen(false)}
            className="px-3 py-2 text-sm rounded-lg text-white/60"
          >
            Settings
          </NavLink>
        </div>
      )}
    </nav>
  );
}
