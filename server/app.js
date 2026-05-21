// Pure Express app factory — no port binding, no filesystem side-effects.
// Reused by server/index.js (standalone) and api/index.js (Vercel serverless).
import express from "express";
import morgan from "morgan";
import { buildCors } from "./cors.js";

import roadmapsRouter from "./routes/roadmaps.js";
import coursesRouter from "./routes/courses.js";
import tutorRouter from "./routes/tutor.js";
import quizRouter from "./routes/quiz.js";
import feedbackRouter from "./routes/feedback.js";
import healthRouter from "./routes/health.js";

export function buildApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(buildCors());
  app.options("*", buildCors());
  app.use(express.json({ limit: "1mb" }));
  if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

  // Lightweight in-memory rate limit (per-instance): 60 req/min per IP per /api route
  const rate = new Map();
  app.use("/api/", (req, res, next) => {
    const key = (req.ip || "anon") + ":" + req.path;
    const now = Date.now();
    const arr = (rate.get(key) || []).filter((t) => now - t < 60_000);
    if (arr.length >= 60) {
      return res.status(429).json({ error: "Too many requests, slow down." });
    }
    arr.push(now);
    rate.set(key, arr);
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

  app.use((err, req, res, _next) => {
    console.error("[error]", err);
    res.status(err.status || 500).json({
      error: err.message || "Internal error",
      detail: err.detail,
    });
  });

  return app;
}
