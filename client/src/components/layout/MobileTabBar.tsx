import { NavLink } from "react-router-dom";
import { LayoutDashboard, Code2, Layers, FolderGit2, Repeat, type LucideIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useSRS } from "../../hooks/useSRS";

// Fixed bottom-tab bar shown only on small viewports for logged-in users.
// Mirrors the iOS/Android pattern students expect — anchors for the daily habit
// across the journey: Dashboard → DSA → Patterns → Projects → Review (SRS).
type Tab = { to: string; label: string; Icon: LucideIcon; badge?: "due" };
const TABS: Tab[] = [
  { to: "/dashboard", label: "Home", Icon: LayoutDashboard },
  { to: "/dsa", label: "DSA", Icon: Code2 },
  { to: "/patterns", label: "Patterns", Icon: Layers },
  { to: "/projects", label: "Projects", Icon: FolderGit2 },
  { to: "/review", label: "Review", Icon: Repeat, badge: "due" },
];

export function MobileTabBar() {
  const { isAuthenticated } = useAuth();
  const { dueCount } = useSRS();

  if (!isAuthenticated) return null;

  return (
    <nav
      aria-label="Primary navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--color-line)] bg-[var(--color-bg)]/85 backdrop-blur-xl"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0px)" }}
    >
      <div className="grid grid-cols-5 h-14">
        {TABS.map(({ to, label, Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                isActive ? "text-[var(--color-neon)]" : "text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.4]" : "stroke-[1.8]"}`} />
                <span>{label}</span>
                {badge === "due" && dueCount > 0 && (
                  <span className="absolute top-1 right-[calc(50%-22px)] inline-flex items-center justify-center bg-[var(--color-neon)] text-black text-[9px] font-bold rounded-full px-1 min-w-[15px] h-[15px] mono">
                    {dueCount > 99 ? "99+" : dueCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
