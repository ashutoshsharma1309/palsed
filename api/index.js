// Vercel serverless entry — wraps the Express app as a default-export handler.
import { buildApp } from "../server/app.js";

const app = buildApp();

export default function handler(req, res) {
  return app(req, res);
}
