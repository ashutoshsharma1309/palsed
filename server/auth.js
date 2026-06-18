// Supabase Auth JWT verification + user-sync middleware.
//
// Architecture:
//   1. Client sends Authorization: Bearer <supabase-jwt>
//   2. We verify the JWT signature using SUPABASE_JWT_SECRET (HS256)
//   3. We then ensure a matching row exists in our `User` table, keyed by
//      authId = JWT.sub. If not, create one (first login after signup or
//      Google OAuth gets persisted to our app database).
//   4. req.auth = { id: <internal User.id>, authId, email, emailVerified }
//      is attached for downstream handlers (Prisma queries, etc).
//
// Why not call Supabase REST for every request?  Because verifying the JWT
// locally with the shared secret is fast (no network) and Supabase already
// guarantees the signature was issued by it. We hit Supabase only once per
// new user (the sync insert into our `User` table).

import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { prisma } from "./db.js";

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

if (!SUPABASE_JWT_SECRET) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("SUPABASE_JWT_SECRET is required in production. See server/.env.example");
  }
  console.warn("[auth] SUPABASE_JWT_SECRET missing — JWT verification will fail for any request");
}

/** Verify a Supabase JWT and return decoded claims. Throws on invalid/expired tokens. */
export function verifySupabaseToken(token) {
  if (!SUPABASE_JWT_SECRET) throw new Error("SUPABASE_JWT_SECRET not configured");
  // Supabase uses HS256 with the JWT secret.
  return jwt.verify(token, SUPABASE_JWT_SECRET, { algorithms: ["HS256"] });
}

/**
 * Express middleware: requires a valid Authorization: Bearer <jwt>.
 * After verification, ensures a User row exists locally and attaches req.auth.
 */
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing bearer token" });

    let claims;
    try {
      claims = verifySupabaseToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const authId = claims.sub;
    const email = claims.email || claims.user_metadata?.email || "";
    const emailConfirmed = !!claims.email_confirmed_at || !!claims.user_metadata?.email_verified;
    const displayName =
      claims.user_metadata?.display_name ||
      claims.user_metadata?.full_name ||
      claims.user_metadata?.name ||
      (email ? email.split("@")[0] : "Learner");

    if (!authId) return res.status(401).json({ error: "Token missing subject" });

    // Find-or-create the local User row.
    let user = await prisma.user.findUnique({ where: { authId } });
    if (!user && email) {
      // Maybe a User row was created earlier (e.g. legacy signup) with the same email
      // but no authId yet. Adopt it.
      const byEmail = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      if (byEmail) {
        user = await prisma.user.update({
          where: { id: byEmail.id },
          data: { authId, displayName: byEmail.displayName || displayName },
        });
      }
    }
    if (!user) {
      user = await prisma.user.create({
        data: {
          authId,
          email: (email || `${authId}@noemail.local`).toLowerCase(),
          displayName,
        },
      });
    }

    req.auth = {
      id: user.id,
      authId,
      email: user.email,
      emailVerified: emailConfirmed,
    };
    next();
  } catch (err) {
    next(err);
  }
}

/** Strip sensitive fields before returning a user to the client. */
export function publicUser(u) {
  if (!u) return null;
  const { passwordHash, ...safe } = u;
  return safe;
}

/** Deterministic per-process hash helper (used by audit-style logs if needed). */
export function hashOpaque(input) {
  return crypto.createHash("sha256").update(String(input)).digest("hex").slice(0, 32);
}
