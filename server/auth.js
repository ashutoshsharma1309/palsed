// Supabase Auth JWT verification + user-sync middleware.
//
// Architecture:
//   1. Client sends Authorization: Bearer <supabase-jwt>
//   2. We verify the JWT by calling Supabase's admin getUser(token) endpoint
//      (works for HS256 legacy secrets AND ES256 asymmetric tokens that newer
//      Supabase projects use — JWKS-based, key rotation friendly).
//   3. We then ensure a matching row exists in our `User` table, keyed by
//      authId = JWT.sub. If not, create one.
//   4. req.auth = { id: <internal User.id>, authId, email, emailVerified }
//      is attached for downstream handlers.
//
// Why call Supabase to verify instead of jwt.verify locally?
//   - Newer Supabase projects use ES256 asymmetric JWTs with a `kid` and a
//     JWKS rotation. Hardcoded HS256 verification breaks the moment they
//     migrate. Server-side getUser() works regardless of alg + rotates with
//     key changes automatically.
//   - The HTTP cost is ~50-100ms which is acceptable. If you need lower
//     latency later, cache the (token -> user) mapping with the JWT exp.

import crypto from "node:crypto";
import { prisma } from "./db.js";
import { getSupabaseAdmin } from "./lib/supabaseAdmin.js";

/** Resolve a Supabase JWT to its claims by asking Supabase. Throws on invalid. */
export async function verifySupabaseToken(token) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data?.user) {
    const e = new Error(error?.message || "Invalid or expired token");
    e.status = 401;
    throw e;
  }
  return data.user;
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

    let supaUser;
    try {
      supaUser = await verifySupabaseToken(token);
    } catch (e) {
      return res.status(401).json({ error: e.message || "Invalid or expired token" });
    }

    const authId = supaUser.id;
    const email = (supaUser.email || "").toLowerCase();
    const emailConfirmed = !!supaUser.email_confirmed_at || !!supaUser.user_metadata?.email_verified;
    const displayName =
      supaUser.user_metadata?.display_name ||
      supaUser.user_metadata?.full_name ||
      supaUser.user_metadata?.name ||
      (email ? email.split("@")[0] : "Learner");

    if (!authId) return res.status(401).json({ error: "Token missing subject" });

    // Find-or-create the local User row, race-condition safe.
    // The browser makes concurrent /api/auth/me calls on first login (one from
    // useAuth mount + one from onAuthStateChange), so two requests can both
    // see "no row" and both try to insert. We catch the unique constraint
    // violation (P2002) and re-fetch in that case.
    const findOrCreate = async () => {
      const existing = await prisma.user.findUnique({ where: { authId } });
      if (existing) return existing;

      if (email) {
        // Legacy row exists with same email but no authId yet → adopt it.
        const byEmail = await prisma.user.findUnique({ where: { email } });
        if (byEmail) {
          return await prisma.user.update({
            where: { id: byEmail.id },
            data: { authId, displayName: byEmail.displayName || displayName },
          });
        }
      }

      try {
        return await prisma.user.create({
          data: {
            authId,
            email: email || `${authId}@noemail.local`,
            displayName,
          },
        });
      } catch (e) {
        // Concurrent request beat us to insert — re-fetch by authId.
        if (e?.code === "P2002") {
          const winner = await prisma.user.findUnique({ where: { authId } });
          if (winner) return winner;
        }
        throw e;
      }
    };

    const user = await findOrCreate();
    if (!user) {
      console.error("[auth] User row missing after find-or-create for", authId);
      return res.status(500).json({ error: "Couldn't sync user" });
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

export function hashOpaque(input) {
  return crypto.createHash("sha256").update(String(input)).digest("hex").slice(0, 32);
}
