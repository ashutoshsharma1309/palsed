import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn, UserPlus, LogOut, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";

type Tab = "signup" | "login";

const inputCls =
  "w-full mt-1 bg-white/[0.03] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[var(--color-neon)] focus:bg-white/[0.06] transition-colors";
const labelCls = "text-[11px] uppercase tracking-widest text-white/50 mono";

// Glassmorphism shell shared by all states.
const shell =
  "w-full max-w-md rounded-3xl border border-white/12 bg-white/[0.05] backdrop-blur-2xl p-6 sm:p-7 shadow-[0_8px_50px_rgba(0,0,0,0.45)] ring-1 ring-[var(--color-neon)]/10";

interface AuthPanelProps {
  /** Where to send the user after a successful login/signup (overrides router state). */
  redirectTo?: string;
  /** Which tab to open with. Defaults to "signup" (new users are primary). */
  defaultTab?: Tab;
}

export function AuthPanel({ redirectTo, defaultTab = "signup" }: AuthPanelProps = {}) {
  const { isAuthenticated, user, login, signup, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Where to land after auth: explicit prop → router redirect state → dashboard.
  const dest = redirectTo || (location.state as { from?: string } | null)?.from || "/dashboard";

  const [tab, setTab] = useState<Tab>(defaultTab);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated && user) {
    return (
      <div className={shell}>
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">· signed in ·</div>
        <div className="display text-2xl">Welcome back, {user.displayName}.</div>
        <div className="text-white/50 text-sm mt-1">{user.email}</div>
        <div className="flex flex-wrap gap-3 mt-6">
          <Button onClick={() => navigate("/dashboard")}>
            Go to dashboard <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" onClick={logout}>
            <LogOut className="w-4 h-4" /> Log out
          </Button>
        </div>
      </div>
    );
  }

  const switchTab = (t: Tab) => {
    setTab(t);
    setError(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (tab === "signup") {
      if (password.length < 8) return setError("Password must be at least 8 characters");
      if (password !== confirm) return setError("Passwords do not match");
    }
    setBusy(true);
    try {
      if (tab === "signup") await signup(email, password, fullName);
      else await login(email, password);
      navigate(dest, { replace: true });
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={shell}>
      {/* Tabs */}
      <div role="tablist" aria-label="Authentication" className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-black/30 border border-white/10 mb-6">
        {([["signup", "Create Account"], ["login", "Login"]] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => switchTab(t)}
            className={`py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === t
                ? "bg-[var(--color-neon)] text-black shadow-[0_0_18px_rgba(200,255,61,0.45)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {tab === "signup" && (
          <div>
            <label className={labelCls} htmlFor="auth-name">Full Name</label>
            <input id="auth-name" className={inputCls} value={fullName}
              onChange={(e) => setFullName(e.target.value)} placeholder="Your name" autoComplete="name" />
          </div>
        )}
        <div>
          <label className={labelCls} htmlFor="auth-email">Email</label>
          <input id="auth-email" className={inputCls} type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
        </div>
        <div>
          <label className={labelCls} htmlFor="auth-password">Password</label>
          <input id="auth-password" className={inputCls} type="password" required minLength={8} value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={tab === "signup" ? "At least 8 characters" : "Your password"}
            autoComplete={tab === "login" ? "current-password" : "new-password"} />
        </div>
        {tab === "signup" && (
          <div>
            <label className={labelCls} htmlFor="auth-confirm">Confirm Password</label>
            <input id="auth-confirm" className={inputCls} type="password" required minLength={8} value={confirm}
              onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" autoComplete="new-password" />
          </div>
        )}

        {error && <div className="text-[#ff5247] text-sm" role="alert">{error}</div>}

        <Button type="submit" fullWidth disabled={busy}>
          {busy ? "Please wait…" : tab === "signup" ? (
            <><UserPlus className="w-4 h-4" /> Create Account</>
          ) : (
            <><LogIn className="w-4 h-4" /> Login</>
          )}
        </Button>
      </form>

      <p className="text-xs text-white/45 mt-5 text-center">
        {tab === "signup" ? "Already have an account?" : "New to PrepNext?"}{" "}
        <button type="button" className="text-[var(--color-neon)] underline"
          onClick={() => switchTab(tab === "signup" ? "login" : "signup")}>
          {tab === "signup" ? "Login" : "Create one"}
        </button>
      </p>
    </div>
  );
}
