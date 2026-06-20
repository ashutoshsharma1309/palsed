import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSRS } from "../../hooks/useSRS";
import { useEngagement } from "../adaptive/EngagementProvider";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggle } from "../ui/ThemeToggle";
import { LogoLockup } from "../ui/Logo";

const LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/companies", label: "Companies" },
  { to: "/pyq", label: "PYQ Vault" },
  { to: "/applications", label: "My Apps" },
  { to: "/internships", label: "Internships" },
  { to: "/dsa", label: "DSA" },
  { to: "/placement-hub", label: "Placement Hub" },
  { to: "/review", label: "Review" },
  { to: "/mastery", label: "Mastery" },
  { to: "/system-design", label: "System Design" },
  { to: "/core-cs", label: "Core CS" },
  { to: "/aptitude", label: "Aptitude" },
  { to: "/interview-resources", label: "Interview" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const { dueCount } = useSRS();
  const { streakDays } = useEngagement();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/15 bg-[var(--color-card)] shadow-2xl overflow-hidden z-40">
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="text-xs font-bold truncate">{user.displayName}</div>
                      <div className="text-[10px] text-white/50 mono truncate">{user.email}</div>
                    </div>
                    <Link
                      to="/settings"
                      onClick={() => setMenu(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-white/5"
                    >
                      <User className="w-3.5 h-3.5" /> Settings
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
            <Link
              to="/"
              className="text-xs text-white/60 hover:text-white"
            >
              Sign in
            </Link>
          )}
        </div>

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
          {user && (
            <button
              onClick={handleLogout}
              className="col-span-2 px-3 py-2 text-sm rounded-lg text-red-300 border border-red-500/30 hover:bg-red-500/10 inline-flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" /> Log out ({user.email})
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
