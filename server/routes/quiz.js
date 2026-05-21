import { Router } from "express";
import { generateJSON, validateShape } from "../groq.js";
import { quizNextPrompt } from "../prompts/quizNext.js";

const r = Router();

r.post("/next", async (req, res, next) => {
  try {
    const { topic, history = [], targetDifficulty = 3 } = req.body || {};
    if (!topic) return res.status(400).json({ error: "topic is required" });
    const diff = Math.max(1, Math.min(5, Math.round(targetDifficulty)));
    const prompt = quizNextPrompt({ topic, history, targetDifficulty: diff });
    const out = await generateJSON(prompt, { temperature: 0.7, maxTokens: 1024 });
    if (!validateShape(out, ["question", "options", "answerIndex", "explanation"])) {
      return res.status(422).json({ error: "Quiz shape invalid", raw: out });
    }
    res.json(out);
  } catch (err) {
    next(err);
  }
});

export default r;
