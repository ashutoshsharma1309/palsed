// Contract: returns an AICourse with 4 explanation styles per lesson. JSON-only.

export function coursePrompt({
  topic,
  level = "Beginner",
  sessionMinutes = 30,
  style = "step_by_step",
  weakTopics = [],
  strongTopics = [],
}) {
  const weak = weakTopics.length ? weakTopics.join(", ") : "none recorded";
  const strong = strongTopics.length ? strongTopics.join(", ") : "none recorded";

  return `You are PrepNxt, designing a fully adaptive multi-style course on "${topic}".
Learner profile: level=${level}, daily focus ~${sessionMinutes} min, preferred explanation style=${style}.
Weak topics: ${weak}. Strong topics: ${strong}.

The learner needs MORE reinforcement on weak topics and may SKIP basics they have already mastered.

Return STRICT JSON ONLY in this exact shape:

{
  "title": string,
  "description": string,
  "level": "Beginner"|"Intermediate"|"Advanced",
  "estimated_hours": number,
  "prerequisites": [string],
  "chapters": [
    {
      "id": string,
      "title": string,
      "summary": string,
      "mastery_topics": [string],
      "lessons": [
        {
          "id": string,
          "title": string,
          "difficulty": 1|2|3|4|5,
          "explanations": {
            "visual": {
              "markdown": string,
              "diagram_mermaid": string
            },
            "code_first": {
              "markdown": string,
              "code_examples": [ { "lang": string, "code": string, "explanation": string } ]
            },
            "analogy": {
              "markdown": string,
              "analogies": [ { "real_world": string, "mapping": string } ]
            },
            "step_by_step": {
              "markdown": string,
              "steps": [ { "title": string, "detail": string } ]
            }
          },
          "check_questions": [
            { "question": string, "options": [string,string,string,string], "answerIndex": 0|1|2|3, "explanation": string }
          ],
          "estimated_minutes": number
        }
      ]
    }
  ],
  "final_quiz_topics": [string],
  "certificate_criteria": { "passing_score": number }
}

Rules:
- 3 to 5 chapters, 2 to 4 lessons per chapter.
- EVERY lesson MUST include all 4 explanation styles (visual, code_first, analogy, step_by_step). They must be genuinely different angles on the same content, not paraphrases.
- "diagram_mermaid" should be valid mermaid syntax (flowchart, sequence, or class).
- 2 to 4 check_questions per lesson; answerIndex is 0-indexed; explanation explains why the correct answer is correct.
- "passing_score" between 0.6 and 0.8.
- IDs must be slug-style: lowercase, hyphenated, unique within the course.
- Difficulty (1..5) should increase through the course but adjust for weak topics (lower) and strong topics (higher).
- No prose outside the JSON. No markdown fences.`;
}
