import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, ChevronDown, BookOpen, Settings as SettingsIcon, Calculator, GitCompare, Award, Activity, Building } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useSRS } from "../../hooks/useSRS";
import { useDailyStreak } from "../../hooks/useDailyStreak";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggle } from "../ui/ThemeToggle";
import { ComfortMenu } from "../ui/ComfortMenu";
import { LogoLockup } from "../ui/Logo";

// Primary nav — follows the placement journey: Learn → Practice → Build → OA.
// The always-visible bar holds the daily-driver modules; everything else lives
// one click deeper in the journey-grouped "Prep" dropdown or the avatar menu.
const PRIMARY = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/learn", label: "Learn" },
  { to: "/dsa", label: "DSA" },
  { to: "/patterns", label: "Patterns" },
  { to: "/aptitude", label: "Aptitude" },
  { to: "/projects", label: "Projects" },
  { to: "/oa", label: "Mock OA" },
];

// "Prep" dropdown — the rest of the journey, grouped by stage so it reads as a
// deliberate map rather than a flat list. Review carries the SRS "due" badge.
const PREP_GROUPS: {
  label: string;
  links: { to: string; label: string; desc: string; badge?: "due" }[];
}[] = [
  {
    label: "Practice",
    links: [
      { to: "/pyq", label: "PYQs", desc: "Previous-year questions" },
      { to: "/review", label: "Review", desc: "Spaced-repetition recall", badge: "due" },
    ],
  },
  {
    label: "Interview",
    links: [
      { to: "/interview-resources", label: "Interview Prep", desc: "Books, sheets, guides" },
      { to: "/system-design", label: "System Design", desc: "URL shortener, chat, etc." },
      { to: "/core-cs", label: "Core CS", desc: "OS · DBMS · Networks" },
    ],
  },
  {
    label: "Placement",
    links: [
      { to: "/hackathon", label: "Hackathon Guide", desc: "First hackathon → winning" },
      { to: "/companies", label: "Companies", desc: "Recruiter map" },
      { to: "/internships", label: "Internships", desc: "Off-campus drives" },
      { to: "/placement-hub", label: "Placement Hub", desc: "All-in-one timeline" },
    ],
  },
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
  const { currentStreak } = useDailyStreak();
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
    <nav data-app-chrome className="sticky top-0 z-30 backdrop-blur-md bg-[var(--color-bg)]/85 border-b border-[var(--color-line)]">
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
                    : "text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-[var(--color-card-soft)]"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          {/* Prep dropdown — grouped by journey stage */}
          <div className="relative" ref={prepRef}>
            <button
              onClick={() => setPrepOpen((v) => !v)}
              className={`relative px-3 py-1.5 text-xs font-semibold rounded-full inline-flex items-center gap-1 transition-colors ${
                prepOpen ? "bg-[var(--color-bg-soft)] text-[var(--color-text)]" : "text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-[var(--color-card-soft)]"
              }`}
              aria-haspopup="menu"
              aria-expanded={prepOpen}
            >
              <BookOpen className="w-3 h-3" /> Prep <ChevronDown className={`w-3 h-3 transition-transform ${prepOpen ? "rotate-180" : ""}`} />
              {/* due-recall nudge (Review lives in this dropdown now) */}
              {dueCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[var(--color-neon)]" aria-hidden />
              )}
            </button>
            {prepOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)] shadow-2xl overflow-hidden z-40 py-1.5">
                {PREP_GROUPS.map((group) => (
                  <div key={group.label} className="py-1">
                    <div className="px-4 py-1 mono text-[9px] uppercase tracking-widest text-[var(--color-text-faint)]">
                      {group.label}
                    </div>
                    {group.links.map((p) => (
                      <NavLink
                        key={p.to}
                        to={p.to}
                        onClick={() => setPrepOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-2 hover:bg-[var(--color-card-soft)] ${isActive ? "bg-[var(--color-neon)]/[0.06]" : ""}`
                        }
                      >
                        <div className="text-sm font-semibold flex items-center gap-2">
                          {p.label}
                          {p.badge === "due" && dueCount > 0 && (
                            <span className="inline-flex items-center justify-center bg-[var(--color-neon)] text-black text-[10px] font-bold rounded-full px-1.5 mono">
                              {dueCount}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[var(--color-text-faint)]">{p.desc}</div>
                      </NavLink>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP RIGHT — streak + theme + avatar */}
        <div className="hidden lg:flex items-center gap-3 relative">
          {currentStreak > 0 && (
            <div className="mono text-[11px] text-[var(--color-neon)] uppercase tracking-widest">
              🔥 {currentStreak}d
            </div>
          )}
          <ComfortMenu />
          <ThemeToggle />
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenu((v) => !v)}
                className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-[var(--color-line)] hover:border-[var(--color-neon)] text-xs"
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
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)] shadow-2xl overflow-hidden z-40">
                    <div className="px-4 py-3 border-b border-[var(--color-line)]">
                      <div className="text-xs font-bold truncate">{user.displayName}</div>
                      <div className="text-[10px] text-[var(--color-text-faint)] mono truncate">{user.email}</div>
                    </div>

                    <div className="px-4 py-1.5 mono text-[9px] uppercase tracking-widest text-[var(--color-text-faint)] border-t border-[var(--color-line)]">
                      Tools
                    </div>
                    {TOOLS.map((t) => (
                      <Link
                        key={t.to}
                        to={t.to}
                        onClick={() => setMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-[var(--color-card-soft)]"
                      >
                        <t.Icon className="w-3.5 h-3.5 text-[var(--color-text-dim)]" /> {t.label}
                      </Link>
                    ))}

                    <Link
                      to="/settings"
                      onClick={() => setMenu(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-[var(--color-card-soft)] border-t border-[var(--color-line)]"
                    >
                      <SettingsIcon className="w-3.5 h-3.5" /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-left text-red-300 hover:bg-red-500/10 border-t border-[var(--color-line)]"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/" className="text-xs text-[var(--color-text-dim)] hover:text-[var(--color-text)]">Sign in</Link>
          )}
        </div>

        {/* MOBILE TRIGGERS */}
        <div className="lg:hidden flex items-center gap-2">
          <ComfortMenu />
          <ThemeToggle />
          <button
            className="text-[var(--color-text)]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="lg:hidden border-t border-[var(--color-line)] bg-[var(--color-bg)]/95 px-4 py-3 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          {/* Primary */}
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-1.5">Primary</div>
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {PRIMARY.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm rounded-lg ${
                    isActive ? "text-[var(--color-neon)] bg-[var(--color-neon)]/10" : "text-[var(--color-text-dim)]"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Prep — grouped by journey stage */}
          {PREP_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-1.5">{group.label}</div>
              <div className="grid grid-cols-2 gap-1.5 mb-4">
                {group.links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `px-3 py-2 text-sm rounded-lg ${
                        isActive ? "text-[var(--color-neon)] bg-[var(--color-neon)]/10" : "text-[var(--color-text-dim)]"
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
            </div>
          ))}

          {/* Tools */}
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-1.5">Tools</div>
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {TOOLS.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm rounded-lg inline-flex items-center gap-1.5 ${
                    isActive ? "text-[var(--color-neon)] bg-[var(--color-neon)]/10" : "text-[var(--color-text-dim)]"
                  }`
                }
              >
                <t.Icon className="w-3.5 h-3.5" /> {t.label}
              </NavLink>
            ))}
          </div>

          {/* Account */}
          <div className="border-t border-[var(--color-line)] pt-3 grid gap-1.5">
            <NavLink to="/settings" onClick={() => setOpen(false)} className="px-3 py-2 text-sm rounded-lg text-[var(--color-text-dim)]">
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
