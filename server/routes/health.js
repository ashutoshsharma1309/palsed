import { Router } from "express";
import { MODEL } from "../groq.js";

const r = Router();
r.get("/", (_req, res) => {
  res.json({ ok: true, model: MODEL, version: "1.0.0" });
});
export default r;
