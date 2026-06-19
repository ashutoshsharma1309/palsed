import cors from "cors";

const LOCAL_RE = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i;

export function buildCors() {
  const allowAll = process.env.CORS_ALLOW_ALL === "1";
  const allowList = (process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // curl / server-to-server
      if (allowAll) return cb(null, true);
      if (LOCAL_RE.test(origin)) return cb(null, true);
      if (allowList.includes(origin)) return cb(null, true);
      console.warn(`[cors] rejected origin: ${origin}`);
      return cb(null, false);
    },
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Accept",
      "Authorization",       // bearer token (Supabase JWT)
      "X-Requested-With",
      "X-Client-Info",       // sent by supabase-js
      "apikey",              // sent by supabase-js for direct Supabase calls
    ],
    exposedHeaders: ["Retry-After"],
    maxAge: 86400, // cache preflight 24h
  });
}
