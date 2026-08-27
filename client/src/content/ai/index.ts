// ────────────────────────────────────────────────────────────────────────────
//  Artificial Intelligence domain — reference curriculum (Python-first).
//  Content synthesised from fast.ai / Hugging Face / PyTorch / OpenAI docs used
//  as references only (no copied text). One full module authored as the third-
//  domain proof that the engine is truly domain-agnostic.
// ────────────────────────────────────────────────────────────────────────────
import type { Module, Lesson } from "../types";
import { FOUNDATIONS_EXTRA } from "./foundations-lessons";
import { mlCore } from "./ml-core";

const whatIsMl: Lesson = {
  id: "what-is-machine-learning",
  domain: "ai",
  moduleId: "ai-foundations",
  title: "What Machine Learning Actually Is",
  objective:
    "Understand the one idea that separates ML from normal programming — learning a function from examples instead of writing the rules by hand.",
  difficulty: "Beginner",
  estMinutes: 6,
  tags: ["ml", "mental-model", "supervised-learning"],
  theory: `In normal programming, **you write the rules**. To detect spam, you'd write \`if\` statements: contains "free money"? flag it. This breaks the moment spammers change their wording.

Machine learning flips this. Instead of writing rules, **you show the computer examples** — thousands of emails labelled "spam" or "not spam" — and an algorithm *learns the rules itself* by finding patterns that separate the two.

### The core idea

An ML model is really just a **function that maps inputs to outputs**, whose internal numbers (**parameters**) are tuned by looking at data:

- **Inputs (features):** the email's words, sender, links.
- **Output (prediction):** spam or not.
- **Training:** repeatedly adjust the parameters so predictions match the known labels.

That's the whole trick. "Learning" means *searching for parameter values that make the model's predictions match reality on the examples we have* — and, crucially, **generalise** to examples it has never seen.

### The three families

- **Supervised learning** — learn from labelled examples (spam/not-spam). Most practical ML.
- **Unsupervised learning** — find structure in *unlabelled* data (grouping similar customers).
- **Reinforcement learning** — learn by trial and error with rewards (game-playing agents).

The skill of ML isn't the maths first — it's framing a messy real problem as "what are my inputs, what's my output, and what examples can teach the mapping?"`,
  intuition:
    "You never taught a child grammar rules before they spoke — they heard thousands of sentences and inferred the patterns. Supervised ML learns the same way: from examples, not rules.",
  definitions: [
    { term: "Model", meaning: "A function from inputs to outputs whose behaviour is set by learned parameters." },
    { term: "Features", meaning: "The input variables the model reads to make a prediction." },
    { term: "Training", meaning: "The process of adjusting parameters so predictions match known labels." },
    { term: "Generalisation", meaning: "How well a model performs on new data it did not see during training." },
  ],
  language: "python",
  syntax: `# The shape of almost every supervised-learning program
model.fit(X_train, y_train)      # learn from examples
predictions = model.predict(X_new)  # apply to unseen inputs`,
  example: {
    language: "python",
    code: `from sklearn.linear_model import LogisticRegression

# X = features (each row is one email), y = labels (1 spam, 0 not)
model = LogisticRegression()
model.fit(X_train, y_train)          # <- learning happens here

# Predict on an email the model never saw
print(model.predict(X_new))          # e.g. [1]  -> spam`,
    explanation:
      "`fit` searches for parameters that separate spam from not-spam in the training data; `predict` then applies that learned function to a brand-new email.",
  },
  visual: { kind: "anim", name: "neuralForward", caption: "Inputs flow forward through weights to produce a prediction." },
  keyConcepts: ["Rules learned, not written", "Model = parameterised function", "Supervised / unsupervised / RL", "Generalisation"],
  commonMistakes: [
    "Reaching for ML when a few `if` statements would solve the problem more reliably.",
    "Judging a model on training data — the real test is unseen data (generalisation).",
    "Collecting data without clear labels for a supervised task.",
  ],
  tips: [
    "Interviewers love: 'When would you NOT use ML?' — when rules are simple, stable, and known.",
    "Framing beats algorithms early on: name your inputs, output, and example source first.",
  ],
  quiz: [
    {
      id: "ai1-q1",
      type: "mcq",
      prompt: "What fundamentally distinguishes machine learning from traditional programming?",
      options: [
        "It runs faster",
        "The rules are learned from data instead of written by hand",
        "It doesn't need any data",
        "It always uses neural networks",
      ],
      answerIndex: 1,
      explanation: "ML learns the mapping from examples; traditional code has the rules written explicitly by a programmer.",
    },
    {
      id: "ai1-q2",
      type: "truefalse",
      prompt: "Evaluating a model only on the data it was trained on is a reliable measure of quality.",
      answer: false,
      explanation: "A model can memorise its training data. The real measure is generalisation — performance on unseen data.",
    },
    {
      id: "ai1-q3",
      type: "fill",
      prompt: "Learning from labelled examples (input → known output) is called ____ learning.",
      answers: ["supervised"],
      placeholder: "one word",
      explanation: "Supervised learning uses labelled examples. Unsupervised finds structure without labels; RL learns from rewards.",
    },
  ],
  revision: [
    "ML learns rules from examples instead of you writing them by hand.",
    "A model is a parameterised function; training tunes the parameters to fit data.",
    "Three families: supervised (labels), unsupervised (structure), reinforcement (rewards).",
    "What matters is generalisation to unseen data, not training-set accuracy.",
  ],
};

export const modules: Module[] = [
  {
    id: "ai-foundations",
    domain: "ai",
    title: "AI Foundations",
    summary: "The core intuition of machine learning before any heavy maths.",
    order: 0,
    lessons: [whatIsMl, ...FOUNDATIONS_EXTRA],
  },
  mlCore,
];
