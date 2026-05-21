import { Router } from "express";
import { generateJSON, validateShape } from "../groq.js";
import { coursePrompt } from "../prompts/course.js";

const r = Router();

r.post("/generate", async (req, res, next) => {
  try {
    const { topic, level, sessionMinutes, style, weakTopics, strongTopics } = req.body || {};
    if (!topic || typeof topic !== "string") {
      return res.status(400).json({ error: "topic is required" });
    }
    const prompt = coursePrompt({
      topic,
      level: level || "Beginner",
      sessionMinutes: sessionMinutes || 30,
      style: style || "step_by_step",
      weakTopics: Array.isArray(weakTopics) ? weakTopics : [],
      strongTopics: Array.isArray(strongTopics) ? strongTopics : [],
    });
    const out = await generateJSON(prompt);
    if (!validateShape(out, ["title", "chapters", "level", "final_quiz_topics"])) {
      return res.status(422).json({ error: "Course shape invalid", raw: out });
    }
    res.json(out);
  } catch (err) {
    next(err);
  }
});

export default r;
