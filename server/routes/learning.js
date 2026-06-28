// DSA Learning OS — per-user progress backup.
//
// GET  /api/learning/progress → the saved progress blob (or null)
// PUT  /api/learning/progress → save the progress blob
//
// The client keeps localStorage as the working store and best-effort syncs here,
// so a fresh device can restore. Requires the `User.learningProgress` Json column
// (run `prisma migrate` to add it) — until then these handlers just error and the
// client silently falls back to localStorage.
import { Router } from "express";
import { requireAuth } from "../auth.js";
import { prisma } from "../db.js";

const r = Router();

r.get("/progress", requireAuth, async (req, res, next) => {
  try {
    const u = await prisma.user.findUnique({
      where: { id: req.auth.id },
      select: { learningProgress: true },
    });
    res.json({ progress: u?.learningProgress ?? null });
  } catch (e) {
    next(e);
  }
});

r.put("/progress", requireAuth, async (req, res, next) => {
  try {
    const progress = req.body?.progress;
    if (typeof progress !== "object" || progress === null || Array.isArray(progress)) {
      return res.status(400).json({ error: "Body must be { progress: {...} }." });
    }
    await prisma.user.update({
      where: { id: req.auth.id },
      data: { learningProgress: progress },
    });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default r;
