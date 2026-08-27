// Durable sync endpoint for the client's per-user localStorage progress
// (client/src/lib/sync/progressSync.ts). One JSON blob per user, mirroring
// exportUserData()/importUserData() exactly — see the UserProgress model
// comment in schema.prisma for why this is a single flexible blob rather than
// typed tables. GET hydrates on login; PUT is the debounced push on change.
import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../auth.js";

const r = Router();

// Keep well under the global express.json 1mb body limit (app.js) so a
// malformed/huge client blob fails fast with a clear error instead of a
// generic body-parser rejection.
const MAX_BLOB_BYTES = 512 * 1024;

// GET /api/progress → { data, updatedAt } | { data: null, updatedAt: null }
r.get("/", requireAuth, async (req, res, next) => {
  try {
    const row = await prisma.userProgress.findUnique({ where: { userId: req.auth.id } });
    res.json({ data: row?.data ?? null, updatedAt: row?.updatedAt ?? null });
  } catch (err) {
    next(err);
  }
});

// PUT /api/progress { data: Record<string, unknown> } → upserts the blob.
r.put("/", requireAuth, async (req, res, next) => {
  try {
    const { data } = req.body || {};
    if (data === null || typeof data !== "object" || Array.isArray(data)) {
      return res.status(400).json({ error: "Body must be { data: <object> }" });
    }
    if (Buffer.byteLength(JSON.stringify(data)) > MAX_BLOB_BYTES) {
      return res.status(413).json({ error: "Progress payload too large" });
    }
    const row = await prisma.userProgress.upsert({
      where: { userId: req.auth.id },
      create: { userId: req.auth.id, data },
      update: { data },
    });
    res.json({ data: row.data, updatedAt: row.updatedAt });
  } catch (err) {
    next(err);
  }
});

export default r;
