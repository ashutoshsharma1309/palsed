// Auth endpoints. All of signup/login/password-reset/OAuth is handled by
// Supabase Auth on the client. The server only:
//   1) Verifies the incoming Supabase JWT,
//   2) Syncs (find-or-create) the matching row in our `User` table,
//   3) Returns the synced user.
//
// The middleware in ../auth.js (`requireAuth`) does the heavy lifting.
import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth, publicUser } from "../auth.js";

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
// Lets the user edit their profile.
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

// Legacy endpoints — return 410 Gone so any cached client calling them gets a clear error.
r.post("/signup", (_req, res) =>
  res.status(410).json({
    error: "Signup has moved to Supabase Auth. Use the client signup flow.",
  })
);
r.post("/login", (_req, res) =>
  res.status(410).json({
    error: "Login has moved to Supabase Auth. Use the client login flow.",
  })
);

export default r;
