import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn, UserPlus, LogOut, ArrowRight, Mail, KeyRound } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { requestPasswordReset, resendConfirmation, devConfirmEmail } from "../../lib/auth";

type Tab = "signup" | "login";

const inputCls =
  "w-full mt-1 bg-white/[0.03] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[var(--color-neon)] focus:bg-white/[0.06] transition-colors";
const labelCls = "text-[11px] uppercase tracking-widest text-white/50 mono";

const shell =
  "w-full max-w-md rounded-3xl border border-white/12 bg-white/[0.05] backdrop-blur-2xl p-6 sm:p-7 shadow-[0_8px_50px_rgba(0,0,0,0.45)] ring-1 ring-[var(--color-neon)]/10";

interface AuthPanelProps {
  redirectTo?: string;
  defaultTab?: Tab;
}

export function AuthPanel({ redirectTo, defaultTab = "signup" }: AuthPanelProps = {}) {
  const { isAuthenticated, user, login, signup, google, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dest = redirectTo || (location.state as { from?: string } | null)?.from || "/dashboard";

  const [tab, setTab] = useState<Tab>(defaultTab);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // After signup, we may need to show a "check your email" state instead of redirecting.
  const [needsVerification, setNeedsVerification] = useState<string | null>(null);

  // Forgot-password sub-flow
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotBusy, setForgotBusy] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // ─── Signed-in state ──────────────────────────────────────────────────
  if (isAuthenticated && user) {
    return (
      <div className={shell}>
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">· signed in ·</div>
        <div className="display text-2xl">Welcome back, {user.displayName}.</div>
        <div className="text-white/50 text-sm mt-1">{user.email}</div>
        <div className="flex flex-wrap gap-3 mt-6">
          <Button onClick={() => navigate(dest, { replace: true })}>
            Go to dashboard <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" onClick={logout}>
            <LogOut className="w-4 h-4" /> Log out
          </Button>
        </div>
      </div>
    );
  }

  // ─── Post-signup: confirm-your-email state ────────────────────────────
  if (needsVerification) {
    return (
      <div className={shell}>
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">· almost there ·</div>
        <div className="display text-2xl">Verify to continue.</div>
        <p className="text-white/70 text-sm mt-3">
          We sent a confirmation link to <strong className="text-white">{needsVerification}</strong>. If you didn't
          receive it, you can skip ahead — we'll confirm your email automatically.
        </p>
        <div className="flex flex-wrap gap-2 mt-5">
          <Button
            disabled={busy}
            onClick={async () => {
              setError(null); setInfo(null); setBusy(true);
              try {
                const ok = await devConfirmEmail(needsVerification);
                if (!ok) throw new Error("Couldn't auto-confirm — try the resend link.");
                await login(needsVerification, password);
                navigate(dest, { replace: true });
              } catch (e: any) {
                setError(e?.message || "Couldn't sign you in.");
              } finally { setBusy(false); }
            }}
          >
            <KeyRound className="w-4 h-4" /> {busy ? "Signing in…" : "Skip — sign me in now"}
          </Button>
          <Button
            variant="outline"
            disabled={busy}
            onClick={async () => {
              setError(null); setInfo(null);
              try {
                await resendConfirmation(needsVerification);
                setInfo("Sent! Check your inbox + spam folder.");
              } catch (e: any) { setError(e?.message || "Couldn't resend."); }
            }}
          >
            <Mail className="w-4 h-4" /> Resend email
          </Button>
          <Button
            variant="ghost"
            onClick={() => { setNeedsVerification(null); setTab("login"); }}
          >
            Back to login
          </Button>
        </div>
        {info && <div className="text-[var(--color-neon-text)] text-xs mt-4">{info}</div>}
        {error && <div className="text-[#ff5247] text-xs mt-4">{error}</div>}
      </div>
    );
  }

  // ─── Forgot password sub-state ────────────────────────────────────────
  if (forgotOpen) {
    return (
      <div className={shell}>
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">· reset password ·</div>
        <div className="display text-2xl">Reset your password.</div>
        {forgotSent ? (
          <p className="text-white/70 text-sm mt-3">
            If an account exists for <strong className="text-white">{forgotEmail}</strong> you'll get a reset link
            in a minute. Check your inbox + spam.
          </p>
        ) : (
          <form
            className="space-y-4 mt-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setForgotBusy(true);
              try {
                await requestPasswordReset(forgotEmail);
                setForgotSent(true);
              } catch (e: any) { setError(e?.message || "Couldn't send reset email."); }
              finally { setForgotBusy(false); }
            }}
          >
            <div>
              <label className={labelCls} htmlFor="forgot-email">Email</label>
              <input
                id="forgot-email"
                className={inputCls}
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            {error && <div className="text-[#ff5247] text-sm">{error}</div>}
            <Button type="submit" fullWidth disabled={forgotBusy}>
              {forgotBusy ? "Sending…" : <><Mail className="w-4 h-4" /> Send reset link</>}
            </Button>
          </form>
        )}
        <button
          type="button"
          className="mt-5 text-xs text-white/55 hover:text-white"
          onClick={() => { setForgotOpen(false); setForgotSent(false); setError(null); }}
        >
          ← Back to sign in
        </button>
      </div>
    );
  }

  const switchTab = (t: Tab) => { setTab(t); setError(null); setInfo(null); };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (tab === "signup") {
      if (password.length < 8) return setError("Password must be at least 8 characters");
      if (password !== confirm) return setError("Passwords do not match");
      if (!fullName.trim()) return setError("Please enter your name");
    }
    setBusy(true);
    try {
      if (tab === "signup") {
        const u = await signup(email, password, fullName);
        if (u && !u.id) {
          // Email confirmation required — show the verify state instead of redirecting
          setNeedsVerification(email);
          return;
        }
      } else {
        await login(email, password);
      }
      navigate(dest, { replace: true });
    } catch (err: any) {
      const msg = err?.message || "Something went wrong";
      // Email-not-confirmed → auto-confirm via server, then retry login.
      if (/email not confirmed|email is not verified|confirm/i.test(msg)) {
        const ok = await devConfirmEmail(email);
        if (ok) {
          try {
            await login(email, password);
            navigate(dest, { replace: true });
            return;
          } catch (e: any) {
            setError(e?.message || "Couldn't sign in after confirming.");
          }
        } else {
          setError(
            "Couldn't confirm your email. Try the 'Resend' button or sign up again."
          );
        }
      } else if (/invalid login credentials/i.test(msg)) {
        setError("Wrong email or password.");
      } else if (/user already registered/i.test(msg)) {
        setError("That email already has an account. Switch to Login.");
      } else if (/rate limit|too many requests/i.test(msg)) {
        setError("Too many attempts — wait a minute and try again.");
      } else setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setError(null);
    setGoogleBusy(true);
    try { await google(); }
    catch (err: any) { setError(err?.message || "Google sign-in failed"); setGoogleBusy(false); }
    // page redirects — no need to clear busy on success
  };

  // ─── Main sign-up / log-in form ───────────────────────────────────────
  return (
    <div className={shell}>
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

      {/* Google OAuth — primary CTA at the top of either tab */}
      <button
        type="button"
        onClick={onGoogle}
        disabled={googleBusy}
        className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] px-3.5 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
      >
        <GoogleLogo />
        {googleBusy ? "Redirecting to Google…" : tab === "signup" ? "Continue with Google" : "Sign in with Google"}
      </button>

      <div className="flex items-center gap-3 my-5">
        <div className="h-px flex-1 bg-white/10" />
        <div className="mono text-[10px] uppercase tracking-widest text-white/40">or with email</div>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {tab === "signup" && (
          <div>
            <label className={labelCls} htmlFor="auth-name">Full Name</label>
            <input id="auth-name" className={inputCls} value={fullName}
              onChange={(e) => setFullName(e.target.value)} placeholder="Your name" autoComplete="name" required />
          </div>
        )}
        <div>
          <label className={labelCls} htmlFor="auth-email">Email</label>
          <input id="auth-email" className={inputCls} type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className={labelCls} htmlFor="auth-password">Password</label>
            {tab === "login" && (
              <button type="button" className="text-[10px] uppercase tracking-widest text-white/45 hover:text-[var(--color-neon-text)]"
                onClick={() => { setForgotOpen(true); setForgotEmail(email); }}>
                Forgot?
              </button>
            )}
          </div>
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

        {tab === "signup" && (
          <p className="text-[11px] text-white/40 text-center leading-relaxed">
            We'll email you a confirmation link before activating your account.
          </p>
        )}
      </form>

      <p className="text-xs text-white/45 mt-5 text-center">
        {tab === "signup" ? "Already have an account?" : "New to PrepNext?"}{" "}
        <button type="button" className="text-[var(--color-neon-text)] underline"
          onClick={() => switchTab(tab === "signup" ? "login" : "signup")}>
          {tab === "signup" ? "Login" : "Create one"}
        </button>
      </p>
    </div>
  );
}

// Google "G" glyph (official colors)
function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.7 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.6-5.6C34.9 6 29.7 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.8 1.1 7.9 3l5.6-5.6C34.9 6 29.7 4 24 4 16 4 9.1 8.5 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.6 0 10.7-2.1 14.5-5.6l-6.7-5.5C29.5 34.7 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9 39.4 16 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.7 5.5C41 35.5 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  );
}
