// Contract: diagnose a wrong answer and produce a micro-lesson + retry hint.

export function feedbackDiagnosePrompt({ question, userAnswer, correctAnswer }) {
  return `You are PrepPlace's diagnostic tutor. The learner answered incorrectly.

QUESTION: ${question}
LEARNER'S ANSWER: ${userAnswer}
CORRECT ANSWER: ${correctAnswer}

Diagnose the misconception. Then write a tiny micro-lesson (under 120 words) that fixes the specific gap, and a one-sentence retry hint.

Return STRICT JSON ONLY:
{
  "rootCause": string,     // 1-2 sentences naming the misconception
  "microLesson": string,   // <120 words, markdown allowed
  "retryHint": string      // single sentence
}

No prose outside the JSON.`;
}
