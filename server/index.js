import express from "express";
import morgan from "morgan";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname0 = path.dirname(fileURLToPath(import.meta.url));
// Load env from server/.env regardless of cwd
dotenv.config({ path: path.join(__dirname0, ".env") });

import { buildCors } from "./cors.js";

import roadmapsRouter from "./routes/roadmaps.js";
import coursesRouter from "./routes/courses.js";
import tutorRouter from "./routes/tutor.js";
import quizRouter from "./routes/quiz.js";
import feedbackRouter from "./routes/feedback.js";
import healthRouter from "./routes/health.js";

const __dirname = __dirname0;
const REPO_ROOT = path.resolve(__dirname, "..");
const PORTS_FILE = path.join(REPO_ROOT, ".ports.json");
const RUNTIME_CONFIG = path.join(REPO_ROOT, "client", "public", "runtime-config.json");
const CLIENT_DIST = path.join(REPO_ROOT, "client", "dist");

const IS_PROD = process.env.NODE_ENV === "production" || !!process.env.PORT;
const PORT_MIN = 30000;
const PORT_MAX = 60000;
const MAX_RETRIES = 20;

function randomPort() {
  return Math.floor(Math.random() * (PORT_MAX - PORT_MIN + 1)) + PORT_MIN;
}

function tryListen(app, port) {
  return new Promise((resolve, reject) => {
    const srv = app
      .listen(port, "0.0.0.0")
      .once("listening", () => resolve(srv))
      .once("error", (err) => reject(err));
  });
}

async function bindPort(app) {
  if (process.env.PORT) {
    const port = Number(process.env.PORT);
    const srv = await tryListen(app, port);
    return { srv, port };
  }
  for (let i = 0; i < MAX_RETRIES; i++) {
    const port = randomPort();
    try {
      const srv = await tryListen(app, port);
      return { srv, port };
    } catch (err) {
      if (err.code !== "EADDRINUSE") throw err;
    }
  }
  throw new Error(`Could not find a free port after ${MAX_RETRIES} tries`);
}

function writeLocalConfig(port) {
  if (IS_PROD) return `http://localhost:${port}`;
  const url = `http://localhost:${port}`;
  const payload = {
    server: port,
    serverUrl: url,
    pid: process.pid,
    startedAt: new Date().toISOString(),
  };
  try { fs.writeFileSync(PORTS_FILE, JSON.stringify(payload, null, 2) + "\n"); } catch {}
  try {
    fs.mkdirSync(path.dirname(RUNTIME_CONFIG), { recursive: true });
    fs.writeFileSync(
      RUNTIME_CONFIG,
      JSON.stringify({ apiUrl: url, startedAt: payload.startedAt }, null, 2) + "\n"
    );
  } catch {}
  return url;
}

function cleanup() {
  try { fs.unlinkSync(PORTS_FILE); } catch {}
  process.exit(0);
}

async function main() {
  const app = express();
  app.disable("x-powered-by");
  app.use(buildCors());
  app.options("*", buildCors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  // Lightweight in-memory rate limit (no Redis): 60 req/min per IP per /api route
  const rate = new Map();
  app.use("/api/", (req, res, next) => {
    const key = req.ip + ":" + req.path;
    const now = Date.now();
    const arr = (rate.get(key) || []).filter((t) => now - t < 60_000);
    if (arr.length >= 60) {
      return res.status(429).json({ error: "Too many requests, slow down." });
    }
    arr.push(now);
    rate.set(key, arr);
    // basic safety headers
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    next();
  });

  app.use("/api/health", healthRouter);
  app.use("/api/roadmaps", roadmapsRouter);
  app.use("/api/courses", coursesRouter);
  app.use("/api/tutor", tutorRouter);
  app.use("/api/quiz", quizRouter);
  app.use("/api/feedback", feedbackRouter);

  // In production: serve the built client + SPA fallback (same-origin, so /api works without CORS).
  if (IS_PROD && fs.existsSync(CLIENT_DIST)) {
    // runtime-config: same-origin in prod — must come BEFORE express.static
    app.get("/runtime-config.json", (_req, res) => {
      res.json({ apiUrl: "", startedAt: new Date().toISOString() });
    });
    app.use(express.static(CLIENT_DIST, { maxAge: "1h", etag: true }));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api/")) return next();
      res.sendFile(path.join(CLIENT_DIST, "index.html"));
    });
  }

  app.use((err, req, res, _next) => {
    console.error("[error]", err);
    res.status(err.status || 500).json({
      error: err.message || "Internal error",
      detail: err.detail,
    });
  });

  const { port } = await bindPort(app);
  writeLocalConfig(port);
  console.log("\n" + "═".repeat(56));
  console.log(`  🟢 PalsEd server on http://localhost:${port}`);
  console.log(`     mode: ${IS_PROD ? "production (serving client too)" : "development"}`);
  console.log("═".repeat(56) + "\n");

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("exit", () => {
    try { fs.unlinkSync(PORTS_FILE); } catch {}
  });
}

main().catch((err) => {
  console.error("Boot failed:", err);
  process.exit(1);
});
