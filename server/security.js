// Helmet-equivalent security middleware. No deps.

export function securityHeaders(req, res, next) {
  // Force HTTPS for one year incl. preload
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  // Disallow framing → clickjacking defense
  res.setHeader("X-Frame-Options", "DENY");
  // MIME-sniffing defense
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Send minimal referrer
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  // Cross-origin isolation hardening
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  // Disable features by default
  res.setHeader("Permissions-Policy", [
    "camera=()",
    "geolocation=()",
    "payment=()",
    "usb=()",
    "interest-cohort=()",
    "microphone=(self)" // voice input on tutor
  ].join(", "));
  // CSP — allow self + Google Fonts + jsdelivr (highlight.js styles)
  if (req.path === "/" || req.path.endsWith(".html") || req.headers.accept?.includes("text/html")) {
    res.setHeader("Content-Security-Policy", [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net",
      "img-src 'self' data: blob: https:",
      "connect-src 'self'",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "));
  }
  next();
}

// Stricter request size + simple shape sanitization for /api
const MAX_STRING = 4000;
export function validateRequestBody(req, res, next) {
  if (!req.body || typeof req.body !== "object") return next();
  try {
    const walk = (v, depth = 0) => {
      if (depth > 6) throw new Error("Payload too deeply nested");
      if (typeof v === "string" && v.length > MAX_STRING) throw new Error("String field too long");
      if (Array.isArray(v)) {
        if (v.length > 200) throw new Error("Array too large");
        v.forEach((x) => walk(x, depth + 1));
      } else if (v && typeof v === "object") {
        const keys = Object.keys(v);
        if (keys.length > 60) throw new Error("Object has too many fields");
        for (const k of keys) walk(v[k], depth + 1);
      }
    };
    walk(req.body);
    next();
  } catch (e) {
    res.status(413).json({ error: e.message });
  }
}
