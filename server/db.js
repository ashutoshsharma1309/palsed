// Single shared Prisma client (avoids exhausting connections on hot-reload).
// Prisma 7 uses the Rust-free "client" engine, which connects through a driver
// adapter — here the official MariaDB adapter (wire-compatible with MySQL,
// and it supports MySQL 8/9's caching_sha2_password auth).
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const globalForPrisma = globalThis;

function createClient() {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL, {
    // caching_sha2_password over a plaintext localhost socket needs the
    // server's public key; allow the driver to fetch it.
    allowPublicKeyRetrieval: true,
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
  });
}

export const prisma = globalForPrisma.__prepnextPrisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prepnextPrisma = prisma;
}
