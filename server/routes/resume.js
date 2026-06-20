// POST /api/resume/roast  { resume: string, targetCompany?: string }
//
// Takes a resume (pasted plain text) + optional target company name, returns
// structured critique JSON:
//   { overallScore, headline, strengths[], issues[], rewrites[], skillsToHighlight[] }
//
// We use the existing Groq client (server/groq.js). Auth required so this
// can't be hammered by anonymous callers — Groq has a usage cap.
import { Router } from "express";
import { generateJSON } from "../groq.js";
import { requireAuth } from "../auth.js";

const r = Router();

const MAX_RESUME_CHARS = 20_000;

const PROMPT = (resume, company) => `You are a senior tech recruiter who has reviewed 10,000+ resumes for Indian campus placements.
A student has pasted their resume below. Critique it brutally but constructively.
${company ? `They are specifically targeting: ${company}. Tailor your advice to that company's known hiring bar and known asks.` : "They are targeting top product/SaaS companies (Google, Microsoft, Razorpay, Atlassian-tier) for campus placement."}

Respond ONLY as valid JSON matching this exact schema (no markdown, no prose outside the JSON):
{
  "overallScore": <integer 0-100, harsh but fair>,
  "headline": "<one-line verdict, < 100 chars, no fluff>",
  "strengths": [
    "<specific strength quoting a real phrase from the resume, < 140 chars>",
    ...3 to 5 items
  ],
  "issues": [
    {
      "severity": "blocker" | "major" | "minor",
      "title": "<short label, < 60 chars>",
      "detail": "<concrete explanation tying to the resume content, < 220 chars>",
      "fix": "<one-line action the student should take, < 180 chars>"
    },
    ...5 to 8 issues, ranked by severity
  ],
  "rewrites": [
    {
      "before": "<the exact weak bullet from the resume, < 180 chars>",
      "after": "<rewritten bullet using STAR format with quantified impact, < 220 chars>"
    },
    ...3 to 5 rewrites of the weakest lines
  ],
  "skillsToHighlight": [
    "<a skill they undersold or omitted, given their target>",
    ...3 to 5 items
  ],
  "atsKeywords": [
    "<specific ATS keyword for their target>",
    ...5 to 8 items
  ]
}

Rules:
- Be SPECIFIC. Quote actual phrases. No generic advice like "add more impact".
- For Indian campus students, common weak patterns: vague "Worked on", no metrics, project lists with no scope, missing GitHub link, missing CGPA.
- "rewrites" must use real numbers (latency, users, throughput, %). If unknown, suggest placeholder like "[X]" so they fill in.
- Score harshly: 90+ only for already-FAANG-ready resumes. Most should land 55-75.

RESUME:
"""
${resume}
"""`;

r.post("/roast", requireAuth, async (req, res, next) => {
  try {
    const resume = String(req.body?.resume || "").trim();
    const targetCompany = String(req.body?.targetCompany || "").trim() || null;

    if (resume.length < 100) {
      return res.status(400).json({ error: "Paste at least 100 characters of your resume." });
    }
    if (resume.length > MAX_RESUME_CHARS) {
      return res.status(400).json({ error: `Resume too long. Max ${MAX_RESUME_CHARS} characters.` });
    }

    const json = await generateJSON(PROMPT(resume, targetCompany), {
      temperature: 0.6,
      maxTokens: 4_000,
    });

    if (typeof json?.overallScore !== "number" || !Array.isArray(json?.issues)) {
      return res.status(502).json({ error: "AI returned unexpected shape. Try again." });
    }

    res.json({ ok: true, roast: json, targetCompany });
  } catch (err) {
    console.error("[resume.roast]", err?.message);
    next(err);
  }
});

export default r;
