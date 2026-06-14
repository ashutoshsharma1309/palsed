import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const REPO_ROOT = path.resolve(__dirname, "..");
const PORTS_FILE = path.join(REPO_ROOT, ".ports.json");
const RUNTIME_CONFIG = path.join(REPO_ROOT, "client", "public", "runtime-config.json");
const CLIENT_DIST = path.join(REPO_ROOT, "client", "dist");

const IS_PROD = process.env.NODE_ENV === "production" || !!process.env.PORT;
const PORT_MIN = 30000;
const PORT_MAX = 60000;
const MAX_RETRIES = 20;

const { buildApp } = await import("./app.js");

function randomPort() {
  return Math.floor(Math.random() * (PORT_MAX - PORT_MIN + 1)) + PORT_MIN;
}
function tryListen(app, port) {
  return new Promise((resolve, reject) => {
    const srv = app.listen(port, "0.0.0.0").once("listening", () => resolve(srv)).once("error", reject);
  });
}
async function bindPort(app) {
  if (process.env.PORT) {
    const port = Number(process.env.PORT);
    const srv = await tryListen(app, port);
    return { srv, port };
  }
  for (let i = 0; i < MAX_RETRIES; i++) {
    try { const srv = await tryListen(app, randomPort()); return { srv, port: srv.address().port }; }
    catch (err) { if (err.code !== "EADDRINUSE") throw err; }
  }
  throw new Error(`Could not find a free port`);
}
function writeLocalConfig(port) {
  if (IS_PROD) return;
  const url = `http://localhost:${port}`;
  try { fs.writeFileSync(PORTS_FILE, JSON.stringify({ server: port, serverUrl: url, pid: process.pid, startedAt: new Date().toISOString() }, null, 2) + "\n"); } catch {}
  try {
    fs.mkdirSync(path.dirname(RUNTIME_CONFIG), { recursive: true });
    fs.writeFileSync(RUNTIME_CONFIG, JSON.stringify({ apiUrl: url, startedAt: new Date().toISOString() }, null, 2) + "\n");
  } catch {}
}
function cleanup() { try { fs.unlinkSync(PORTS_FILE); } catch {} process.exit(0); }

const app = buildApp();

// Standalone-only: serve built client + SPA fallback (Vercel handles this itself)
if (IS_PROD && fs.existsSync(CLIENT_DIST)) {
  app.get("/runtime-config.json", (_req, res) => res.json({ apiUrl: "", startedAt: new Date().toISOString() }));
  app.use(express.static(CLIENT_DIST, { maxAge: "1h", etag: true }));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(CLIENT_DIST, "index.html"));
  });
}

const { port } = await bindPort(app);
writeLocalConfig(port);
console.log("\n" + "═".repeat(56));
console.log(`  🟢 PrepNext server on http://localhost:${port}`);
console.log(`     mode: ${IS_PROD ? "production (serving client too)" : "development"}`);
console.log("═".repeat(56) + "\n");
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("exit", () => { try { fs.unlinkSync(PORTS_FILE); } catch {} });
