# Authoring content — PrepNext Learning Engine

The learning engine (`client/src/content/`) is domain-agnostic: DSA, Web Development,
and AI all render through the same components (`LessonArticle`, `Quiz`,
`LessonVisual`, `Toc`, checklist, prev/next). **Adding a lesson is a pure data
change — you never touch a component.** This doc is the playbook for adding one.

## Where content lives

```
client/src/content/
  types.ts        # the Lesson / Module / QuizQuestion schema — read this first
  registry.ts      # domain loader, ordering, prev/next resolution
  dsa/index.ts     # adapter over the existing data/dsa/roadmap.ts (don't duplicate)
  web/
    index.ts       # exports modules: Module[] for the domain
    foundations.ts  # one file per module, one `const` per lesson
    core-skills.ts
  ai/index.ts
```

A **domain** (`"dsa" | "web" | "ai"`) is a list of **modules**; a module is a list
of **lessons**. Each domain's `index.ts` is lazy-imported by `registry.ts`, so
a domain's content only downloads when a learner opens it — the bundle stays
small no matter how many lessons you add.

## Adding a new lesson to an existing module

1. Open the module file (e.g. `web/core-skills.ts`).
2. Add a new `const yourLesson: Lesson = { ... }` following the shape in
   `types.ts`. Every field except `id`, `domain`, `moduleId`, `title`,
   `objective`, `difficulty`, `estMinutes`, and `theory` is **optional** — the
   article renderer (`LessonArticle.tsx`) only shows sections whose field is
   present, so you can start thin and fill in depth over time.
3. Push it into the module's `lessons: [...]` array, in the order you want it
   to appear (this also determines prev/next navigation).
4. If it depends on an earlier lesson, set `prerequisites: ["other-lesson-id"]`.
5. Run `cd client && npm run typecheck` — the `Lesson` type will catch a
   missing/misspelled field immediately.

## Adding a brand-new module

Create a new file in the domain folder (e.g. `web/advanced-react.ts`) exporting
a `Module`, then add it to that domain's `index.ts` `modules` array with the
next `order` number.

## Adding a brand-new domain

1. Add the domain id to `Domain` in `types.ts` and to `DOMAINS`/`DOMAIN_META`
   in `registry.ts` (label, blurb, accent color).
2. Create `content/<domain>/index.ts` exporting `modules: Module[]`.
3. Add the lazy loader entry in `registry.ts`'s `LOADERS` map.
4. That's it — `/learn/<domain>`, the unified lesson route, quizzes, visuals,
   the checklist, and gamification all work automatically.

## Lesson anatomy reference

| Field | Purpose | Required? |
|---|---|---|
| `objective` | One sentence: what the learner will be able to do | ✅ |
| `theory` | Markdown prose — the main explanation | ✅ |
| `intuition` | A short real-world analogy | optional |
| `definitions` | Bolded key terms + concise meanings | optional |
| `syntax` / `example` | A code fence + a worked, explained example | optional |
| `visual` | `{ kind: "mermaid", src }` or `{ kind: "anim", name }` | optional |
| `complexity` | Time/space (mainly DSA) | optional |
| `keyConcepts` / `commonMistakes` / `tips` / `optimization` | Bullet lists | optional |
| `quiz` | Inline questions — see below | optional |
| `practice` | DSA-style problems (reuses `data/dsa/roadmap.ts`'s `Question`) | optional |
| `revision` | Concise recap bullets shown at the end | optional |
| `checklist` | Overrides the default checklist for this lesson | optional |

## Writing quizzes

Five question types are supported (`content/types.ts`'s `QuizQuestion` union):

- **`mcq`** — options + `answerIndex`.
- **`truefalse`** — `answer: boolean`.
- **`fill`** — free text, checked against `answers: string[]` (case/whitespace-insensitive).
- **`output`** — show `code`, learner predicts the console output; checked against `answers`.
- **`code`** — a small coding challenge. The learner writes JS in the real
  sandboxed `CodeRunner` (Web Worker, 4s timeout, offline); their `console.log`
  output is compared to `expectedOutput`.

Every question needs an `explanation` (markdown) shown immediately after
answering — write it to teach, not just confirm.

## Writing visuals

Visuals should **clarify a specific mechanism**, never decorate. Two kinds:

- **Mermaid diagrams** — `{ kind: "mermaid", src: "..." }`. Any Mermaid diagram
  type works (flowchart, sequence, state, graph); rendered by the existing
  `MermaidDiagram` component, which already respects light/dark theme.
- **Named animations** — `{ kind: "anim", name: "httpRequest" }`. Implemented
  in `components/lesson/visuals.tsx`'s `REGISTRY`. To add a new one: write a
  small `framer-motion` component that respects `useReducedMotion()`, add it
  to `AnimName` in `types.ts`, and register it in `REGISTRY`. Referencing a
  name with no implementation yet is safe — `LessonVisual` renders nothing
  rather than erroring, so content and animation work can land independently.

## Content policy

Write **original explanations** synthesized from your own understanding of
primary docs (MDN, official framework docs, etc.) — never copy text from any
source. Keep the voice consistent with existing lessons: short paragraphs,
concrete examples, a real-world intuition, and an honest "common mistakes"
section grounded in things learners actually get wrong.

## Verifying new content

```bash
cd client
npm run typecheck   # schema correctness
npm test             # existing suite must stay green
npm run build         # confirms the domain still code-splits cleanly
```

Then open `/learn/<domain>/<lesson-id>` in the running app and read through it —
the TOC, reading-progress bar, quiz, and visual should all render without any
component changes.
