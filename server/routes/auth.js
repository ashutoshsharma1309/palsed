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

/**
 * POST /api/auth/signup  { email, password, displayName }
 *
 * Server-side signup using the Supabase Admin API. This bypasses Supabase's
 * public /auth/v1/signup endpoint entirely, which means:
 *   - No confirmation email is sent (`email_confirm: true` marks it verified).
 *   - Not subject to Supabase's free-tier email rate limit
 *     ("over_email_send_rate_limit" error that blocks the public endpoint).
 *   - Works regardless of the "Confirm email" toggle in the dashboard.
 *
 * The client then signs in via supabase.auth.signInWithPassword() to get a
 * session. We deliberately don't return tokens here — keep tokens client-side.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PW = 8;
const MAX_FIELD = 200;

r.post("/signup", async (req, res, next) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = req.body?.password;
    const displayName = String(req.body?.displayName || "").trim() || email.split("@")[0];

    if (!EMAIL_RE.test(email) || email.length > MAX_FIELD) {
      return res.status(400).json({ error: "A valid email is required" });
    }
    if (typeof password !== "string" || password.length < MIN_PW || password.length > MAX_FIELD) {
      return res.status(400).json({ error: `Password must be ${MIN_PW}-${MAX_FIELD} characters` });
    }
    if (displayName.length > MAX_FIELD) {
      return res.status(400).json({ error: "Display name too long" });
    }

    const admin = getSupabaseAdmin();

    // Create the user pre-confirmed — no email sent, no rate limit.
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: displayName },
    });

    if (error) {
      // Supabase admin returns 422 on duplicate; map to a friendly 409.
      const msg = (error.message || "").toLowerCase();
      if (
        msg.includes("already") ||
        msg.includes("duplicate") ||
        msg.includes("user_already_exists") ||
        msg.includes("registered")
      ) {
        return res.status(409).json({ error: "An account with this email already exists" });
      }
      console.error("[signup] admin.createUser failed:", error);
      return res.status(502).json({ error: error.message || "Couldn't create account" });
    }

    res.status(201).json({
      ok: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        displayName,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Legacy login endpoint — login goes through Supabase JS client directly.
r.post("/login", (_req, res) =>
  res.status(410).json({ error: "Login moved to Supabase Auth. Use the client login flow." })
);

export default r;
