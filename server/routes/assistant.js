import { Router } from "express";
import { chatComplete, hasOpenAI } from "../openai.js";
import { chatText as groqChat, hasGroq } from "../groq.js";

const r = Router();

// The assistant is deliberately scoped: it only helps with PrepNext and campus
// placement preparation, and declines anything outside that. Keeping the guard
// in the system prompt (plus a short, low-temperature completion) keeps replies
// on-topic and terse.
const SYSTEM_PROMPT = `You are "PrepNext Assistant", the in-app helper for PrepNext — a placement-prep platform for Indian engineering students.

PrepNext covers: DSA practice (150 curated problems, company tags, in-app solutions, complexity, LeetCode links), 26 coding patterns, a Projects module (10 domains), timed Mock OA, a recruiter map (85 companies with eligibility/CTC/rounds), a PYQ vault, verifiable certificates, and a single Placement Readiness Score across the journey (Learn -> Practice -> Build -> Interview -> Placement).

RULES:
- ONLY answer questions about PrepNext's features, campus/off-campus placement preparation, DSA/coding-interview prep, aptitude, core CS, resumes/projects for placements, and how to use this site.
- If a question is unrelated (general chit-chat, other products, coding help unrelated to interview prep, world knowledge, medical/legal/financial advice, etc.), briefly decline: say you can only help with PrepNext and placement prep, then suggest a relevant thing you CAN help with. Do not answer the off-topic part.
- Be concise and practical: a few sentences or a short list. No filler, no preamble, no "as an AI". Do not invent features PrepNext does not have.
- When useful, point to the relevant section (e.g. "open the DSA hub", "check the Readiness card on your dashboard").`;

const MAX_TURNS = 12;         // cap conversation length sent upstream
const MAX_MSG_CHARS = 2000;   // cap a single user message

r.post("/chat", async (req, res, next) => {
  try {
    if (!hasOpenAI() && !hasGroq()) {
      return res.status(503).json({ error: "The assistant isn't configured on this server yet." });
    }

    const body = req.body || {};
    const incoming = Array.isArray(body.messages) ? body.messages : [];

    // Sanitize: keep only user/assistant turns with string content, trim, cap.
    const history = incoming
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-MAX_TURNS)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MSG_CHARS) }));

    if (!history.length || history[history.length - 1].role !== "user") {
      return res.status(400).json({ error: "Send a user message to the assistant." });
    }

    const messages = [{ role: "system", content: SYSTEM_PROMPT }, ...history];

    // Primary: OpenAI (as configured). Fallback: Groq — so the assistant keeps
    // working if the OpenAI key is missing, rate-limited, or over quota.
    let reply;
    let provider = "openai";
    try {
      if (hasOpenAI()) {
        reply = await chatComplete(messages, { temperature: 0.3, maxTokens: 500 });
      } else {
        provider = "groq";
        reply = await groqChat(messages, { temperature: 0.3, maxTokens: 500 });
      }
    } catch (primaryErr) {
      if (hasGroq()) {
        provider = "groq";
        reply = await groqChat(messages, { temperature: 0.3, maxTokens: 500 });
      } else {
        throw primaryErr;
      }
    }

    res.json({ reply, provider });
  } catch (err) {
    next(err);
  }
});

export default r;
