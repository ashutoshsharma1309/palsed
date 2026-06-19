// Pure Express app factory — no port binding, no filesystem side-effects.
// Reused by server/index.js (standalone) and api/index.js (Vercel serverless).
import express from "express";
import morgan from "morgan";
import compression from "compression";
import { buildCors } from "./cors.js";
import { securityHeaders, validateRequestBody } from "./security.js";

import healthRouter from "./routes/health.js";
import dbRouter from "./routes/db/index.js";
import authRouter from "./routes/auth.js";
import { Router } from "express";

// AI endpoints retired in v2 (Placement Season OS pivot).
// We keep the routes mounted so any cached client still gets a clean 410 Gone
// instead of a confusing 404. Remove these lines entirely once we're sure no
// client is calling them.
const aiGoneRouter = Router();
aiGoneRouter.all("*", (_req, res) =>
  res.status(410).json({
    error: "This endpoint has been retired. PrepNext no longer uses AI generation.",
    upgrade: "Use the Placement Season OS: /api/db, /api/auth.",
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

  // DB CRUD layer — mounted before the strict body validator because legitimate
  // payloads (e.g. a full AI course) are large/deeply nested. Still rate-limited.
  app.use("/api/db", dbRouter);

  app.use("/api/", validateRequestBody);

  app.use("/api/auth", authRouter);
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
