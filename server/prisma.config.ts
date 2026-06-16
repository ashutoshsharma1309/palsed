import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma 7 no longer auto-loads .env — load it ourselves.
// Resolve relative to this config file so it works from any cwd.
dotenv.config({ path: path.join(process.cwd(), ".env") });

// On Supabase we use two URLs:
//   DATABASE_URL → pooled (PgBouncer, port 6543). Used by Prisma at runtime.
//   DIRECT_URL   → direct (port 5432). Used by `prisma migrate` because
//                  PgBouncer's transaction mode can't run DDL.
//
// If DIRECT_URL is not set (local dev where you're hitting a non-pooled URL),
// we fall back to DATABASE_URL so `prisma migrate dev` still works.
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
  migrations: {
    seed: "node prisma/seed.js",
  },
});
