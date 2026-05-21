// Contract: returns one MCQ at the target difficulty for adaptive quizzing.

export function quizNextPrompt({ topic, history = [], targetDifficulty = 3 }) {
  const histText = history
    .slice(-6)
    .map((h, i) => `Q${i + 1}: ${h.correct ? "CORRECT" : "WRONG"} (diff ${h.difficulty}, ${h.msSpent}ms)`)
    .join("\n");

  return `You are an adaptive quiz engine. Generate ONE multiple-choice question on "${topic}" at difficulty ${targetDifficulty} (scale 1=trivial..5=expert).

Recent learner history:
${histText || "(no history yet)"}

The question must be genuinely at difficulty ${targetDifficulty}. Difficulty 1-2: definitional. 3: application. 4: tricky edge cases. 5: synthesis or multi-step reasoning.

Return STRICT JSON ONLY:
{
  "question": string,
  "options": [string, string, string, string],
  "answerIndex": 0|1|2|3,
  "explanation": string,
  "difficulty": ${targetDifficulty}
}

No prose outside the JSON.`;
}
