import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, LogOut, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useAuth } from "../../hooks/useAuth";

const inputCls =
  "w-full mt-1 bg-transparent border-b-2 border-white/20 focus:border-[var(--color-neon)] outline-none text-base py-2";

export function AuthPanel() {
  const { isAuthenticated, user, login, signup, logout } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated && user) {
    return (
      <Card className="p-6 w-full max-w-md">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">
          · signed in ·
        </div>
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
      </Card>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        await signup(email, password, displayName);
      } else {
        await login(email, password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="p-6 w-full max-w-md">
      <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">
        · {mode === "login" ? "sign in" : "create account"} ·
      </div>
      <div className="display text-2xl mb-4">
        {mode === "login" ? "Welcome back." : "Join PrepNext."}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label className="text-xs uppercase tracking-widest text-white/50 mono">Name</label>
            <input
              className={inputCls}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>
        )}
        <div>
          <label className="text-xs uppercase tracking-widest text-white/50 mono">Email</label>
          <input
            className={inputCls}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-white/50 mono">Password</label>
          <input
            className={inputCls}
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>

        {error && <div className="text-[#ff5247] text-sm">{error}</div>}

        <Button type="submit" fullWidth disabled={busy}>
          {busy ? (
            "Please wait…"
          ) : mode === "login" ? (
            <>
              <LogIn className="w-4 h-4" /> Sign in
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Create account
            </>
          )}
        </Button>
      </form>

      <div className="text-sm text-white/50 mt-5 text-center">
        {mode === "login" ? "New to PrepNext?" : "Already have an account?"}{" "}
        <button
          type="button"
          className="text-[var(--color-neon)] underline"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
          }}
        >
          {mode === "login" ? "Create an account" : "Sign in"}
        </button>
      </div>
    </Card>
  );
}
