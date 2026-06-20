// Pure Express app factory — no port binding, no filesystem side-effects.
// Reused by server/index.js (standalone) and api/index.js (Vercel serverless).
import express from "express";
import morgan from "morgan";
import compression from "compression";
import { buildCors } from "./cors.js";
import { securityHeaders, validateRequestBody } from "./security.js";

import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import resumeRouter from "./routes/resume.js";
import { prisma } from "./db.js";
import { Router } from "express";

// AI endpoints retired in v2 (Placement Season OS pivot).
const aiGoneRouter = Router();
aiGoneRouter.all("*", (_req, res) =>
  res.status(410).json({
    error: "This endpoint has been retired. PrepNext no longer uses AI generation.",
  })
);

// /api/db/* was a hackathon-era generic CRUD layer that exposed every Prisma
// model to anonymous callers — including the User table with bcrypt hashes.
// The current React client doesn't use these routes (verified via grep). We
// keep ONLY the read-only health endpoint (table counts, no PII) and return
// 410 Gone for everything else so a stale client gets a clean error instead
// of a confusing 404.
const dbGoneRouter = Router();
dbGoneRouter.get("/health", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const userCount = await prisma.user.count();
    res.json({ ok: true, db: "prepnext", users: userCount });
  } catch (e) {
    next(e);
  }
});
dbGoneRouter.all("*", (_req, res) =>
  res.status(410).json({
    error: "Generic CRUD has been retired. Use the typed endpoints under /api/* instead.",
  })
);

export function buildApp() {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1); // honor X-Forwarded-* on Vercel/Render
  app.use(compression());
  app.use(securityHeaders);
  app.use(buildCors());
  app.options("*", buildCors());
  app.use(express.json({ limit: "1mb" }));
  if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

  // In-memory rate limit: 60 req/min per IP per /api route
  const rate = new Map();
  app.use("/api/", (req, res, next) => {
    const key = (req.ip || "anon") + ":" + req.path;
    const now = Date.now();
    const arr = (rate.get(key) || []).filter((t) => now - t < 60_000);
    if (arr.length >= 60) {
      res.setHeader("Retry-After", "60");
      return res.status(429).json({ error: "Too many requests, slow down." });
    }
    arr.push(now);
    rate.set(key, arr);
    next();
  });

  // Legacy /api/db/* — locked down to health-only. See dbGoneRouter above.
  app.use("/api/db", dbGoneRouter);

  app.use("/api/", validateRequestBody);

  app.use("/api/auth", authRouter);
  app.use("/api/resume", resumeRouter);
  app.use("/api/health", healthRouter);

  // Retired AI endpoints — return 410 Gone
  app.use("/api/roadmaps", aiGoneRouter);
  app.use("/api/courses", aiGoneRouter);
  app.use("/api/tutor", aiGoneRouter);
  app.use("/api/quiz", aiGoneRouter);
  app.use("/api/feedback", aiGoneRouter);

  app.use((err, req, res, _next) => {
    // Structured logging: makes prod 500s diagnosable via Vercel logs.
    console.error("[error]", {
      path: req.path,
      method: req.method,
      authId: req.auth?.authId,
      message: err?.message,
      code: err?.code,
      stack: err?.stack?.split("\n").slice(0, 4),
    });
    res.status(err.status || 500).json({
      error: err.message || "Internal error",
      detail: err.detail,
    });
  });

  return app;
}
