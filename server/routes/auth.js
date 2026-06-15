// Email + password authentication backed by the MySQL `User` table.
import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../db.js";
import { signToken, requireAuth, publicUser } from "../auth.js";

const r = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;
const MAX_FIELD = 200;

function normalizeEmail(e) {
  return typeof e === "string" ? e.trim().toLowerCase() : "";
}

// Login throttling: 5 failed attempts per email per 15 min triggers a 15-min lockout.
// Per-process memory; for multi-instance use Redis (see Phase 7 plan).
const FAIL_WINDOW_MS = 15 * 60 * 1000;
const FAIL_LIMIT = 5;
const loginFails = new Map(); // key: email → [{ at }]

function recordFailure(email) {
  const now = Date.now();
  const arr = (loginFails.get(email) || []).filter((x) => now - x.at < FAIL_WINDOW_MS);
  arr.push({ at: now });
  loginFails.set(email, arr);
  return arr.length;
}
function isLockedOut(email) {
  const now = Date.now();
  const arr = (loginFails.get(email) || []).filter((x) => now - x.at < FAIL_WINDOW_MS);
  loginFails.set(email, arr);
  return arr.length >= FAIL_LIMIT;
}
function clearFailures(email) {
  loginFails.delete(email);
}

// POST /api/auth/signup  { email, password, displayName? }
r.post("/signup", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password;
    const displayName = (req.body?.displayName || "").trim();

    if (!EMAIL_RE.test(email) || email.length > MAX_FIELD) return res.status(400).json({ error: "A valid email is required" });
    if (typeof password !== "string" || password.length < MIN_PASSWORD || password.length > MAX_FIELD) {
      return res.status(400).json({ error: `Password must be ${MIN_PASSWORD}-${MAX_FIELD} characters` });
    }
    if (displayName.length > MAX_FIELD) return res.status(400).json({ error: "Display name too long" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "An account with this email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName: displayName || email.split("@")[0],
      },
    });

    const token = signToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login  { email, password }
r.post("/login", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password;
    if (!EMAIL_RE.test(email) || typeof password !== "string" || password.length > MAX_FIELD) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (isLockedOut(email)) {
      res.setHeader("Retry-After", "900");
      return res.status(429).json({ error: "Too many failed attempts. Try again in 15 minutes." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    const ok = user?.passwordHash ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!ok) {
      recordFailure(email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    clearFailures(email);
    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me   (Authorization: Bearer <token>)
r.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.auth.sub } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

export default r;
