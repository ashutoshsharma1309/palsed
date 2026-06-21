// Contract: re-explain a lesson in a different style when the learner is stuck.
// Returns { reply: string }

export function tutorRexplainPrompt({ lessonId, originalContent, style }) {
  const styleGuide = {
    visual: "Use spatial/visual descriptions and mermaid diagrams.",
    code_first: "Lead with code, then explain line by line.",
    analogy: "Use a strong everyday analogy and map each part back to the concept.",
    step_by_step: "Break into numbered, atomic steps.",
  };

  return `You are PrepPlace's tutor. The learner is stuck on lesson "${lessonId}".

ORIGINAL EXPLANATION:
${originalContent}

The learner did NOT understand that explanation. Re-explain the SAME concept from scratch in a completely different angle, in ${style} style: ${styleGuide[style] || ""}

Do NOT paraphrase the original — pick a fundamentally different way to teach it. Be encouraging and brief (under 350 words).

Return STRICT JSON ONLY:
{ "reply": string }   // markdown allowed

No prose outside the JSON.`;
}
