import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, ChevronDown, BookOpen, Settings as SettingsIcon, Calculator, GitCompare, Star, Award, Activity, Building } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useSRS } from "../../hooks/useSRS";
import { useEngagement } from "../adaptive/EngagementProvider";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggle } from "../ui/ThemeToggle";
import { LogoLockup } from "../ui/Logo";

// Primary nav — placement-prep-first. 7 items + 1 dropdown.
// Anything not directly used in the daily placement workflow has been moved
// to the "Prep" dropdown or the avatar menu.
const PRIMARY = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/companies", label: "Companies" },
  { to: "/pyq", label: "PYQs" },
  { to: "/oa", label: "Mock OA" },
  { to: "/applications", label: "My Apps" },
  { to: "/resume-roast", label: "Resume" },
  { to: "/review", label: "Review", badge: "due" as const },
];

// "Prep" dropdown — deeper subject-area study.
const PREP_LINKS = [
  { to: "/dsa", label: "DSA Tracker", desc: "450+ problems, company-tagged" },
  { to: "/system-design", label: "System Design", desc: "URL shortener, chat, etc." },
  { to: "/core-cs", label: "Core CS", desc: "OS · DBMS · Networks" },
  { to: "/aptitude", label: "Aptitude", desc: "Quantitative + verbal" },
  { to: "/interview-resources", label: "Interview Resources", desc: "Books, courses, sheets" },
  { to: "/internships", label: "Internship Feed", desc: "Off-campus drives + boards" },
  { to: "/placement-hub", label: "Placement Hub", desc: "All-in-one timeline" },
];

// Tools available via the avatar dropdown — these are useful but not part of
// the daily placement-prep flow, so they live one click deeper.
const TOOLS = [
  { to: "/salary", label: "Salary Calculator", Icon: Calculator },
  { to: "/compare", label: "Compare Companies", Icon: GitCompare },
  { to: "/mastery", label: "Mastery Tracker", Icon: Award },
  { to: "/engagement", label: "Engagement", Icon: Activity },
  { to: "/certificates", label: "Certificates", Icon: Building },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [prepOpen, setPrepOpen] = useState(false);
  const { dueCount } = useSRS();
  const { streakDays } = useEngagement();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdowns on route change (handled via Link's natural unmount of menu via key)
  const prepRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!prepOpen) return;
    const handler = (e: MouseEvent) => {
      if (prepRef.current && !prepRef.current.contains(e.target as Node)) setPrepOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [prepOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setMenu(false);
      setOpen(false);
      toast.success("Logged out");
      navigate("/", { replace: true });
    } catch (e: any) {
      toast.error(e?.message || "Couldn't log out");
    }
  };

  return (
    <nav className="sticky top-0 z-30 backdrop-blur-md bg-black/60 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between h-14">
        <Link to="/" className="shrink-0 neon-text" aria-label="PrepNext home">
          <LogoLockup wordmarkClass="display text-2xl tracking-tight" markSize={26} />
        </Link>

        {/* DESKTOP PRIMARY */}
        <div className="hidden lg:flex items-center gap-1">
          {PRIMARY.map((l) => (
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
              {l.badge === "due" && dueCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center bg-[var(--color-neon)] text-black text-[10px] font-bold rounded-full px-1.5 py-0.5 mono">
                  {dueCount}
                </span>
              )}
            </NavLink>
          ))}

          {/* Prep dropdown */}
          <div className="relative" ref={prepRef}>
            <button
              onClick={() => setPrepOpen((v) => !v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full inline-flex items-center gap-1 transition-colors ${
                prepOpen ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
              aria-haspopup="menu"
              aria-expanded={prepOpen}
            >
              <BookOpen className="w-3 h-3" /> Prep <ChevronDown className={`w-3 h-3 transition-transform ${prepOpen ? "rotate-180" : ""}`} />
            </button>
            {prepOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-white/15 bg-[var(--color-card)] shadow-2xl overflow-hidden z-40 py-1">
                {PREP_LINKS.map((p) => (
                  <NavLink
                    key={p.to}
                    to={p.to}
                    onClick={() => setPrepOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 hover:bg-white/5 ${isActive ? "bg-[var(--color-neon)]/[0.06]" : ""}`
                    }
                  >
                    <div className="text-sm font-semibold">{p.label}</div>
                    <div className="text-[11px] text-white/55">{p.desc}</div>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP RIGHT — streak + theme + avatar */}
        <div className="hidden lg:flex items-center gap-3 relative">
          {streakDays > 0 && (
            <div className="mono text-[11px] text-[var(--color-neon)] uppercase tracking-widest">
              🔥 {streakDays}d
            </div>
          )}
          <ThemeToggle />
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenu((v) => !v)}
                className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-white/15 hover:border-[var(--color-neon)] text-xs"
                aria-haspopup="menu"
                aria-expanded={menu}
              >
                <div className="w-5 h-5 rounded-full bg-[var(--color-neon)] text-black flex items-center justify-center text-[10px] font-bold mono shrink-0">
                  {(user.displayName || user.email || "?").slice(0, 1).toUpperCase()}
                </div>
                <span className="hidden xl:inline max-w-[120px] truncate">{user.displayName || user.email}</span>
              </button>
              {menu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/15 bg-[var(--color-card)] shadow-2xl overflow-hidden z-40">
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="text-xs font-bold truncate">{user.displayName}</div>
                      <div className="text-[10px] text-white/50 mono truncate">{user.email}</div>
                    </div>

                    <Link
                      to="/pricing"
                      onClick={() => setMenu(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-white/5"
                    >
                      <Star className="w-3.5 h-3.5 text-[var(--color-neon)]" /> Upgrade to Pro
                    </Link>

                    <div className="px-4 py-1.5 mono text-[9px] uppercase tracking-widest text-white/40 border-t border-white/10">
                      Tools
                    </div>
                    {TOOLS.map((t) => (
                      <Link
                        key={t.to}
                        to={t.to}
                        onClick={() => setMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-white/5"
                      >
                        <t.Icon className="w-3.5 h-3.5 text-white/60" /> {t.label}
                      </Link>
                    ))}

                    <Link
                      to="/settings"
                      onClick={() => setMenu(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-white/5 border-t border-white/10"
                    >
                      <SettingsIcon className="w-3.5 h-3.5" /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-left text-red-300 hover:bg-red-500/10 border-t border-white/10"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/" className="text-xs text-white/60 hover:text-white">Sign in</Link>
          )}
        </div>

        {/* MOBILE TRIGGERS */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="lg:hidden border-t border-white/10 bg-black/95 px-4 py-3 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          {/* Primary */}
          <div className="mono text-[10px] uppercase tracking-widest text-white/40 mb-1.5">Primary</div>
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {PRIMARY.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm rounded-lg ${
                    isActive ? "text-[var(--color-neon)] bg-[var(--color-neon)]/10" : "text-white/85"
                  }`
                }
              >
                {l.label}
                {l.badge === "due" && dueCount > 0 && (
                  <span className="ml-1.5 mono text-[10px] text-[var(--color-neon)]">·{dueCount}</span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Prep */}
          <div className="mono text-[10px] uppercase tracking-widest text-white/40 mb-1.5">Prep library</div>
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {PREP_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm rounded-lg ${
                    isActive ? "text-[var(--color-neon)] bg-[var(--color-neon)]/10" : "text-white/75"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Tools */}
          <div className="mono text-[10px] uppercase tracking-widest text-white/40 mb-1.5">Tools</div>
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {TOOLS.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm rounded-lg inline-flex items-center gap-1.5 ${
                    isActive ? "text-[var(--color-neon)] bg-[var(--color-neon)]/10" : "text-white/65"
                  }`
                }
              >
                <t.Icon className="w-3.5 h-3.5" /> {t.label}
              </NavLink>
            ))}
          </div>

          {/* Account */}
          <div className="border-t border-white/10 pt-3 grid gap-1.5">
            <NavLink to="/settings" onClick={() => setOpen(false)} className="px-3 py-2 text-sm rounded-lg text-white/60">
              Settings
            </NavLink>
            {user && (
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm rounded-lg text-red-300 border border-red-500/30 hover:bg-red-500/10 inline-flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" /> Log out ({user.email})
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
