import { Router } from "express";
import { generateJSON, validateShape } from "../groq.js";
import { roadmapPrompt } from "../prompts/roadmap.js";

const r = Router();

r.post("/generate", async (req, res, next) => {
  try {
    const { topic, level, style } = req.body || {};
    if (!topic || typeof topic !== "string") {
      return res.status(400).json({ error: "topic is required" });
    }
    const prompt = roadmapPrompt({ topic, level, style });
    const out = await generateJSON(prompt);
    if (!validateShape(out, ["title", "stages", "tools", "certifications", "career_path"])) {
      return res.status(422).json({ error: "Roadmap shape invalid", raw: out });
    }
    res.json(out);
  } catch (err) {
    next(err);
  }
});

export default r;
