// /auth/callback — single landing for ALL Supabase auth redirects:
//   - Google OAuth completion
//   - Email confirmation links
//   - Password-reset links (?intent=reset)
//
// The supabase-js client (`detectSessionInUrl: true`) parses tokens from the
// URL automatically; we just decide where to send the user next.
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Loader } from "../components/ui/Loader";
import { Background } from "../components/layout/Background";
import { supabase } from "../lib/supabase";
import { updatePassword, fetchAppUser } from "../lib/auth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const intent = params.get("intent"); // "reset" for password-reset flow

  const [status, setStatus] = useState<"loading" | "reset" | "done" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Race three signals — whichever fires first wins:
    //   1. Existing session (already exchanged)
    //   2. onAuthStateChange "SIGNED_IN" event (token detected from URL)
    //   3. 6-second timeout → show error
    const settle = async (msg?: string) => {
      if (cancelled) return;
      if (intent === "reset") {
        const { data } = await supabase.auth.getSession();
        if (!data.session) { setStatus("error"); setError("Reset link expired. Request a new one."); return; }
        setStatus("reset");
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (!data.session) { setStatus("error"); setError(msg || "No active session — sign-in link may have expired."); return; }
      toast.success("You're in!");
      // Route based on profile completion: new users go to /onboarding to
      // fill out college/branch/year; returning users go to /dashboard.
      try {
        const u = await fetchAppUser();
        if (!u?.profileComplete) {
          navigate("/onboarding", { replace: true });
          return;
        }
      } catch {
        // /me failure shouldn't block the redirect — assume returning user.
      }
      navigate("/dashboard", { replace: true });
    };

    // 1) maybe we already have a session
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) await settle();
    })();

    // 2) listen for SIGNED_IN or PASSWORD_RECOVERY
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, _session) => {
      if (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY" || event === "INITIAL_SESSION") {
        await settle();
      }
    });

    // 3) hard timeout — gives us a chance to recover after token exchange
    const t = setTimeout(() => settle("Sign-in took too long. Try again."), 6000);

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
      clearTimeout(t);
    };
  }, [intent, navigate]);

  const doReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword.length < 8) return setError("Password must be at least 8 characters");
    if (newPassword !== confirm) return setError("Passwords do not match");
    setSavingPw(true);
    try {
      await updatePassword(newPassword);
      setStatus("done");
      toast.success("Password updated. You're signed in.");
      setTimeout(() => navigate("/dashboard", { replace: true }), 700);
    } catch (e: any) {
      setError(e?.message || "Couldn't update password");
    } finally { setSavingPw(false); }
  };

  return (
    <>
      <Background />
      <div className="relative z-10 min-h-screen grid place-items-center px-4">
        <Card className="max-w-md w-full">
          {status === "loading" && <Loader label="Finalizing sign-in" />}

          {status === "error" && (
            <div>
              <div className="mono text-xs uppercase tracking-[0.3em] text-[#ff5247] mb-2">· error ·</div>
              <h1 className="display text-3xl mb-2">Couldn't complete sign-in.</h1>
              <p className="text-white/70 text-sm">{error}</p>
              <div className="flex gap-2 mt-5">
                <Button onClick={() => navigate("/", { replace: true })}>Back to home</Button>
              </div>
            </div>
          )}

          {status === "reset" && (
            <form onSubmit={doReset} className="space-y-4">
              <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">· set a new password ·</div>
              <h1 className="display text-3xl">Choose a new password.</h1>
              <Field label="New password">
                <input
                  type="password"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2"
                  minLength={8}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </Field>
              <Field label="Confirm">
                <input
                  type="password"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2"
                  minLength={8}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                />
              </Field>
              {error && <div className="text-[#ff5247] text-sm">{error}</div>}
              <Button type="submit" fullWidth disabled={savingPw}>
                {savingPw ? "Saving…" : "Save & continue"}
              </Button>
            </form>
          )}

          {status === "done" && (
            <div>
              <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">· all set ·</div>
              <h1 className="display text-3xl">Password updated.</h1>
              <p className="text-white/60 mt-2 text-sm">Redirecting…</p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-widest text-white/50 mono mb-1">{label}</div>
      {children}
    </label>
  );
}
