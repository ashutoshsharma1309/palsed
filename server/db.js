// Single shared Prisma client over Supabase Postgres.
//
// Why no Supabase JS SDK? This is a server-side Express app that owns its own
// JWT auth and uses Prisma's typed delegate API everywhere. Adding the
// supabase-js layer would force RLS-aware query rewrites and lose type safety
// for zero benefit. We use Supabase strictly as a managed Postgres provider.
//
// Why a driver adapter (@prisma/adapter-pg)?
// Prisma 7 requires either a driver adapter OR Accelerate to connect to a
// database; raw URLs are not allowed in the PrismaClient constructor anymore.
// We use the official `pg`-backed adapter — same pattern the previous MariaDB
// build used, just swapped for Postgres. Works fine on Vercel Node serverless.
//
// Connection routing:
//   DATABASE_URL → Supabase transaction pooler (port 6543, `?pgbouncer=true`)
//                  Used for every runtime query from serverless functions.
//   DIRECT_URL   → Supabase direct connection (port 5432).
//                  Read by Prisma for `migrate` / `db push` (PgBouncer in
//                  transaction mode doesn't support those).
//
// Connection pooling on Vercel:
//   - The Supabase pooler URL already multiplexes through PgBouncer; each
//     lambda just needs `connection_limit=1`. We keep `pg`'s pool tiny so we
//     don't exhaust the Supabase budget under bursty load.
//   - `globalForPrisma` caches the client in dev to survive hot reloads.

import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const globalForPrisma = globalThis;

function createClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Set it to the Supabase pooled connection " +
        "string (port 6543, with `?pgbouncer=true&connection_limit=1`). " +
        "See server/.env.example."
    );
  }
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    max: 3, // per-instance pool ceiling; Supabase pooler does the heavy lifting
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
  });
}

export const prisma = globalForPrisma.__prepnxtPrisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prepnxtPrisma = prisma;
}
