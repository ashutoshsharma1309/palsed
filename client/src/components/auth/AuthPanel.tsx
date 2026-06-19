import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, ArrowRight, Mail, KeyRound, ArrowLeft } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { validateEmail, sendOtp, verifyOtpCode, loginGoogle } from "../../lib/auth";

const inputCls =
  "w-full mt-1 bg-white/[0.03] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[var(--color-neon)] focus:bg-white/[0.06] transition-colors";
const labelCls = "text-[11px] uppercase tracking-widest text-white/50 mono";

const shell =
  "w-full max-w-md rounded-3xl border border-white/12 bg-white/[0.05] backdrop-blur-2xl p-6 sm:p-7 shadow-[0_8px_50px_rgba(0,0,0,0.45)] ring-1 ring-[var(--color-neon)]/10";

interface AuthPanelProps {
  redirectTo?: string;
}

type Phase = "enterEmail" | "enterCode";

const RESEND_COOLDOWN_S = 45;

export function AuthPanel({ redirectTo }: AuthPanelProps = {}) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dest = redirectTo || (location.state as { from?: string } | null)?.from || "/dashboard";

  const [phase, setPhase] = useState<Phase>("enterEmail");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  // Resend cooldown ticker
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  // Auto-redirect once the session lands AFTER a successful OTP verify.
  // Tracked locally so we don't redirect users who land on the landing page
  // while still authenticated (e.g. clicking the PrepNext logo) — they get
  // the "Signed in" card with a Log out button instead.
  const [didVerify, setDidVerify] = useState(false);
  useEffect(() => {
    if (isAuthenticated && didVerify) {
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, didVerify, dest, navigate]);

  // Auto-focus the code input when we switch to that phase
  const codeRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (phase === "enterCode") setTimeout(() => codeRef.current?.focus(), 80);
  }, [phase]);

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

  // ─── Step 1: enter email ──────────────────────────────────────────────
  const onSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setInfo(null);
    const cleaned = email.trim().toLowerCase();
    if (!cleaned) return setError("Enter your email.");

    setBusy(true);
    try {
      // 1) Server-side check (gibberish/disposable/no-MX) — saves rate-limit slots.
      const v = await validateEmail(cleaned);
      if (!v.ok) {
        setError(v.reason || "That email isn't accepted.");
        return;
      }

      // 2) Tell Supabase to email a 6-digit code.
      await sendOtp(cleaned, fullName.trim() || undefined);

      setPhase("enterCode");
      setInfo("Code sent. Check your inbox + spam folder.");
      setResendIn(RESEND_COOLDOWN_S);
    } catch (err: any) {
      setError(err?.message || "Couldn't send code.");
    } finally {
      setBusy(false);
    }
  };

  // ─── Step 2: enter code ───────────────────────────────────────────────
  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setInfo(null);
    const cleaned = code.replace(/\s+/g, "");
    if (!/^\d{6}$/.test(cleaned)) return setError("Enter the 6-digit code.");

    setBusy(true);
    try {
      await verifyOtpCode(email.trim().toLowerCase(), cleaned);
      setDidVerify(true); // arm the auto-redirect for this flow only
      // The auth state change will trigger navigation via the effect above.
    } catch (err: any) {
      setError(err?.message || "Verification failed.");
    } finally {
      setBusy(false);
    }
  };

  const onResend = async () => {
    if (resendIn > 0) return;
    setError(null); setInfo(null); setBusy(true);
    try {
      await sendOtp(email.trim().toLowerCase(), fullName.trim() || undefined);
      setInfo("New code sent.");
      setResendIn(RESEND_COOLDOWN_S);
    } catch (err: any) {
      setError(err?.message || "Couldn't resend.");
    } finally { setBusy(false); }
  };

  const onGoogle = async () => {
    setError(null); setGoogleBusy(true);
    try { await loginGoogle(); }
    catch (err: any) { setError(err?.message || "Google sign-in failed"); setGoogleBusy(false); }
  };

  // ─── Code-entry view ──────────────────────────────────────────────────
  if (phase === "enterCode") {
    return (
      <div className={shell}>
        <button
          type="button"
          className="text-[10px] uppercase tracking-widest text-white/50 hover:text-white inline-flex items-center gap-1 mb-3"
          onClick={() => { setPhase("enterEmail"); setCode(""); setError(null); setInfo(null); }}
        >
          <ArrowLeft className="w-3 h-3" /> Change email
        </button>
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">· verify ·</div>
        <div className="display text-2xl">Check your email.</div>
        <p className="text-white/70 text-sm mt-3">
          We sent a 6-digit code to <strong className="text-white">{email}</strong>. Enter it below to finish signing in.
        </p>

        <form onSubmit={onVerify} className="space-y-4 mt-5">
          <div>
            <label className={labelCls} htmlFor="otp-code">Verification code</label>
            <input
              id="otp-code"
              ref={codeRef}
              className={`${inputCls} text-center text-2xl tracking-[0.5em] mono`}
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="······"
            />
          </div>

          {error && <div className="text-[#ff5247] text-sm" role="alert">{error}</div>}
          {info && <div className="text-[var(--color-neon-text)] text-xs">{info}</div>}

          <Button type="submit" fullWidth disabled={busy || code.length !== 6}>
            {busy ? "Verifying…" : <><KeyRound className="w-4 h-4" /> Verify & sign in</>}
          </Button>
        </form>

        <div className="flex items-center justify-between mt-5">
          <button
            type="button"
            disabled={resendIn > 0 || busy}
            onClick={onResend}
            className="text-xs text-white/55 hover:text-white disabled:opacity-50"
          >
            {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
          </button>
          <span className="text-[10px] text-white/40 mono">code expires in 60 min</span>
        </div>
      </div>
    );
  }

  // ─── Email-entry view (default) ───────────────────────────────────────
  return (
    <div className={shell}>
      <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">· sign in ·</div>
      <div className="display text-2xl">Verify your email.</div>
      <p className="text-white/60 text-sm mt-1">
        We'll send you a 6-digit code — no password to remember.
      </p>

      {/* Google */}
      <button
        type="button"
        onClick={onGoogle}
        disabled={googleBusy}
        className="mt-5 w-full inline-flex items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] px-3.5 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
      >
        <GoogleLogo />
        {googleBusy ? "Redirecting to Google…" : "Continue with Google"}
      </button>

      <div className="flex items-center gap-3 my-5">
        <div className="h-px flex-1 bg-white/10" />
        <div className="mono text-[10px] uppercase tracking-widest text-white/40">or with email</div>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* Email form */}
      <form onSubmit={onSendCode} className="space-y-4">
        <div>
          <label className={labelCls} htmlFor="auth-name">Full Name <span className="text-white/30">(new users)</span></label>
          <input
            id="auth-name"
            className={inputCls}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Optional — your name"
            autoComplete="name"
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            className={inputCls}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@gmail.com"
            autoComplete="email"
          />
        </div>

        {error && <div className="text-[#ff5247] text-sm" role="alert">{error}</div>}

        <Button type="submit" fullWidth disabled={busy}>
          {busy ? "Sending…" : <><Mail className="w-4 h-4" /> Send verification code</>}
        </Button>

        <p className="text-[11px] text-white/40 text-center leading-relaxed">
          We use a 6-digit code instead of passwords. New users: your account is created on first verify.
        </p>
      </form>
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
