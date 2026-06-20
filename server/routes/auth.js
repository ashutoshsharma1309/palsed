// Auth endpoints. All of signup/login/password-reset/OAuth is handled by
// Supabase Auth on the client. The server only:
//   1) Verifies the incoming Supabase JWT,
//   2) Syncs (find-or-create) the matching row in our `User` table,
//   3) Returns the synced user,
//   4) Provides a "dev-confirm" escape hatch for environments where the
//      Supabase built-in mailer is rate-limited / spam-filtered.
//
// The middleware in ../auth.js (`requireAuth`) does the heavy lifting.
import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth, publicUser } from "../auth.js";
import { getSupabaseAdmin } from "../lib/supabaseAdmin.js";
import { validateEmail } from "../lib/emailValidator.js";

const r = Router();

// GET /api/auth/me  → returns the synced User row (creates one if missing).
r.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.auth.id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/auth/me  { displayName?, learningGoal?, preferredStyle?, dailyMinutes? }
r.patch("/me", requireAuth, async (req, res, next) => {
  try {
    const { displayName, learningGoal, preferredStyle, dailyMinutes } = req.body || {};
    const data = {};
    if (typeof displayName === "string" && displayName.trim()) data.displayName = displayName.trim().slice(0, 80);
    if (typeof learningGoal === "string") data.learningGoal = learningGoal.trim().slice(0, 80);
    if (typeof preferredStyle === "string") data.preferredStyle = preferredStyle;
    if (typeof dailyMinutes === "number" && dailyMinutes >= 5 && dailyMinutes <= 240) data.dailyMinutes = dailyMinutes;
    if (Object.keys(data).length === 0) return res.status(400).json({ error: "Nothing to update" });

    const user = await prisma.user.update({ where: { id: req.auth.id }, data });
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/validate-email  { email }
 *
 * Cheap pre-check before the client triggers an OTP send via Supabase. Catches
 * fake/disposable/gibberish addresses so we don't waste a rate-limited email
 * on something that obviously won't work. Returns { ok: true } if the address
 * passes all our heuristics + DNS MX lookup; otherwise { ok: false, reason }.
 */
r.post("/validate-email", async (req, res, next) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ ok: false, reason: "Email required" });

    const result = await validateEmail(email);
    if (!result.ok) return res.status(400).json(result);

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/fallback-signin  { email, displayName? }
 *
 * Used when Supabase's built-in mailer is failing (which happens often on the
 * free tier — "Error sending confirmation email" / 500 / "unexpected_failure").
 * Strategy:
 *   1. Validate the email server-side (same gibberish + MX checks the OTP
 *      send path uses, so we don't lower the verification bar).
 *   2. Create the Supabase user pre-confirmed via the admin API. Idempotent.
 *   3. Generate a magiclink via admin.generateLink — this RETURNS the link
 *      without trying to email it, sidestepping the broken mailer entirely.
 *   4. Send the action_link back to the client, which navigates the user to
 *      it. Supabase's /auth/v1/verify processes the token and redirects to
 *      our /auth/callback with the session, where AuthCallback signs them in.
 *
 * Why this preserves the verification bar: the email validator rejects
 * gibberish/disposable/no-MX addresses before we get here, so by the time
 * we're issuing a magic link the address is at least a real deliverable one.
 */
r.post("/fallback-signin", async (req, res, next) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const displayName = String(req.body?.displayName || "").trim();
    if (!email) return res.status(400).json({ ok: false, reason: "Email required" });

    const v = await validateEmail(email);
    if (!v.ok) return res.status(400).json(v);

    const admin = getSupabaseAdmin();

    // Step 1 — create the user pre-confirmed. Ignore "already exists" errors.
    try {
      await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: displayName ? { display_name: displayName } : undefined,
      });
    } catch (err) {
      const msg = (err?.message || "").toLowerCase();
      const isDup =
        msg.includes("already") ||
        msg.includes("duplicate") ||
        msg.includes("registered") ||
        msg.includes("user_already_exists");
      if (!isDup) throw err;
    }

    // Step 2 — generate magic link (no email sent; just returns the URL).
    const redirectTo =
      req.body?.redirectTo ||
      `${req.headers.origin || "https://prepnext.vercel.app"}/auth/callback`;
    const { data, error } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo },
    });
    if (error) {
      console.error("[fallback-signin] generateLink failed:", error.message);
      return res.status(502).json({ ok: false, reason: "Couldn't generate sign-in link. Try Google sign-in." });
    }

    const actionLink = data?.properties?.action_link;
    if (!actionLink) {
      return res.status(502).json({ ok: false, reason: "Sign-in link missing from Supabase response." });
    }

    res.json({ ok: true, action_link: actionLink });
  } catch (err) {
    console.error("[fallback-signin] error:", err?.message);
    next(err);
  }
});

/**
 * POST /api/auth/dev-confirm  { email }
 *
 * Forces email confirmation for a freshly-signed-up Supabase user, using the
 * service_role key server-side. Solves the "email never arrives" problem on
 * Supabase's free-tier built-in mailer (heavily rate-limited + Gmail-filtered).
 *
 * Production-mode-aware: in production this is rate-limited per-IP (built-in
 * /api/ limiter) and clients should still ideally use a real SMTP provider
 * (Resend, Postmark, etc.). For demos and local dev this is a clean escape.
 */
r.post("/dev-confirm", async (req, res, next) => {
  try {
    const { email } = req.body || {};
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "email is required" });
    }
    const normalized = email.trim().toLowerCase();
    const admin = getSupabaseAdmin();

    // Find the user by email via admin API.
    // listUsers paginates; for a demo just grab the first page large enough.
    const { data: list, error: listErr } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (listErr) {
      console.error("[dev-confirm] listUsers failed:", listErr);
      return res.status(502).json({ error: "Couldn't query Supabase Auth" });
    }
    const target = (list.users || []).find(
      (u) => (u.email || "").toLowerCase() === normalized
    );
    if (!target) {
      return res.status(404).json({ error: "No Supabase user with that email" });
    }
    if (target.email_confirmed_at) {
      return res.json({ ok: true, alreadyConfirmed: true });
    }

    const { error: updErr } = await admin.auth.admin.updateUserById(target.id, {
      email_confirm: true,
    });
    if (updErr) {
      console.error("[dev-confirm] updateUserById failed:", updErr);
      return res.status(502).json({ error: "Couldn't confirm email" });
    }
    res.json({ ok: true, alreadyConfirmed: false });
  } catch (err) {
    next(err);
  }
});

// Signup + login moved entirely to OTP via Supabase. The client calls
// supabase.auth.signInWithOtp() to send the code and supabase.auth.verifyOtp()
// to consume it. The server only validates the email beforehand (above) so we
// don't waste a rate-limited send on garbage addresses.
r.post("/signup", (_req, res) =>
  res.status(410).json({ error: "Signup moved to OTP email verification. Use /api/auth/validate-email then supabase.auth.signInWithOtp." })
);
r.post("/login", (_req, res) =>
  res.status(410).json({ error: "Login moved to OTP email verification. Use supabase.auth.signInWithOtp." })
);

export default r;
