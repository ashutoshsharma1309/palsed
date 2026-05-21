import { Router } from "express";
import { generateJSON, validateShape } from "../groq.js";
import { feedbackDiagnosePrompt } from "../prompts/feedbackDiagnose.js";

const r = Router();

r.post("/diagnose", async (req, res, next) => {
  try {
    const { question, userAnswer, correctAnswer } = req.body || {};
    if (!question || !correctAnswer) {
      return res.status(400).json({ error: "question and correctAnswer required" });
    }
    const prompt = feedbackDiagnosePrompt({ question, userAnswer, correctAnswer });
    const out = await generateJSON(prompt, { temperature: 0.6, maxTokens: 1024 });
    if (!validateShape(out, ["rootCause", "microLesson", "retryHint"])) {
      return res.status(422).json({ error: "Feedback shape invalid", raw: out });
    }
    res.json(out);
  } catch (err) {
    next(err);
  }
});

export default r;
