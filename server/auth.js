// Auth helpers: JWT sign/verify + Bearer-token middleware.
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

// HARD FAIL in production if JWT_SECRET is missing — never silently use a fallback.
// In dev, use a per-process random secret so tokens don't survive a restart.
const SECRET = (() => {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 16) {
    return process.env.JWT_SECRET;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set (>=16 chars) in production");
  }
  console.warn("[auth] JWT_SECRET missing — using ephemeral dev secret");
  return crypto.randomBytes(48).toString("hex");
})();
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

// Express middleware: requires a valid `Authorization: Bearer <token>`.
// Populates req.auth = { sub, email }.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing bearer token" });
  try {
    req.auth = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Strip sensitive fields before returning a user to the client.
export function publicUser(u) {
  if (!u) return null;
  const { passwordHash, ...safe } = u;
  return safe;
}
