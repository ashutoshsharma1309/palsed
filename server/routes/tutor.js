import { Router } from "express";
import { generateJSON, validateShape } from "../groq.js";
import { tutorExplainPrompt } from "../prompts/tutorExplain.js";
import { tutorRexplainPrompt } from "../prompts/tutorRexplain.js";

const r = Router();

r.post("/explain", async (req, res, next) => {
  try {
    const { context = {}, style = "step_by_step", transcript = [] } = req.body || {};
    const prompt = tutorExplainPrompt({ context, style, transcript });
    const out = await generateJSON(prompt, { temperature: 0.6, maxTokens: 4096 });
    if (!validateShape(out, ["reply", "suggestedFollowups"])) {
      return res.status(422).json({ error: "Tutor shape invalid", raw: out });
    }
    res.json(out);
  } catch (err) {
    next(err);
  }
});

r.post("/rexplain", async (req, res, next) => {
  try {
    const { lessonId = "lesson", originalContent = "", style = "analogy" } = req.body || {};
    const prompt = tutorRexplainPrompt({ lessonId, originalContent, style });
    const out = await generateJSON(prompt, { temperature: 0.7, maxTokens: 2048 });
    if (!validateShape(out, ["reply"])) {
      return res.status(422).json({ error: "Rexplain shape invalid", raw: out });
    }
    res.json(out);
  } catch (err) {
    next(err);
  }
});

export default r;
