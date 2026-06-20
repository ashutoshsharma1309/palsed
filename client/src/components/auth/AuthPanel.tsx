import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { loginGoogle } from "../../lib/auth";

const shell =
  "w-full max-w-md rounded-3xl border border-[var(--color-line)] bg-[var(--color-card-soft)] backdrop-blur-2xl p-6 sm:p-7 shadow-[0_8px_50px_rgba(0,0,0,0.45)] ring-1 ring-[var(--color-neon)]/10";

interface AuthPanelProps {
  redirectTo?: string;
}

// Auth surface — Google OAuth only.
//
// We dropped the email-OTP flow entirely: Supabase's free-tier mailer is
// unreliable (intermittent 500 "Error sending confirmation email"), and even
// with a server-side magic-link fallback the UX was messier than a one-tap
// Google sign-in. Cuts a class of bugs + no email infra to maintain.
//
// After Google sign-in lands, AuthCallback bounces:
//   - profileComplete === false  → /onboarding (collect college/branch/year)
//   - profileComplete === true   → /dashboard (intended destination)
export function AuthPanel({ redirectTo }: AuthPanelProps = {}) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dest = redirectTo || (location.state as { from?: string } | null)?.from || "/dashboard";

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [didAuth, setDidAuth] = useState(false);
  useEffect(() => {
    if (isAuthenticated && didAuth) {
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, didAuth, dest, navigate]);

  // Signed-in state: show a welcome-back card with log-out.
  if (isAuthenticated && user) {
    return (
      <div className={shell}>
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">· signed in ·</div>
        <div className="display text-2xl">Welcome back, {user.displayName}.</div>
        <div className="text-[var(--color-text-faint)] text-sm mt-1">{user.email}</div>
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

  const onGoogle = async () => {
    setError(null);
    setBusy(true);
    setDidAuth(true);
    try {
      await loginGoogle();
      // Redirect is handled by Supabase's OAuth flow → /auth/callback
    } catch (err: any) {
      setError(err?.message || "Google sign-in failed");
      setBusy(false);
      setDidAuth(false);
    }
  };

  return (
    <div className={shell}>
      <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">· sign in ·</div>
      <div className="display text-2xl">One tap.</div>
      <p className="text-[var(--color-text-dim)] text-sm mt-2">
        We sign you in with your Google account so you don't manage another password. New users
        finish a short profile after sign-in.
      </p>

      <button
        type="button"
        onClick={onGoogle}
        disabled={busy}
        className="mt-6 w-full inline-flex items-center justify-center gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-input)] hover:bg-[var(--color-input-strong)] px-3.5 py-3 text-sm font-medium text-[var(--color-text)] transition-colors disabled:opacity-50"
      >
        {busy ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecting to Google…
          </>
        ) : (
          <>
            <GoogleLogo />
            Continue with Google
          </>
        )}
      </button>

      {error && (
        <div className="mt-3 text-[#ff5247] text-sm" role="alert">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-2 text-[11px] text-[var(--color-text-faint)] leading-relaxed">
        <div className="flex items-start gap-2">
          <span className="text-[var(--color-neon)]">·</span>
          <span>30-second setup. No card, no questionnaire.</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[var(--color-neon)]">·</span>
          <span>We only read your name + email from Google. Never your contacts or Drive.</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[var(--color-neon)]">·</span>
          <span>Free forever for the basics. Upgrade anytime.</span>
        </div>
      </div>
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
