# PrepNext Content Engine — Authoring Guide

This folder is the **scalable content engine** behind PrepNext's learning platform.
Lessons are **pure data**: the UI renders whatever fields are present, so adding a
lesson or a whole domain is a data change — you never touch a React component.

> One schema (`types.ts`) powers every domain (DSA / Web / AI). Every lesson
> follows the same anatomy, so a student always knows how to make progress.

## Folder layout

```
content/
  types.ts          # the Lesson / Module / QuizQuestion / VisualSpec schema
  registry.ts       # lazy per-domain loader + lesson resolution / prev-next
  dsa/index.ts       # DSA — an adapter over the existing data/dsa/roadmap.ts
  web/               # Web Development
    index.ts         #   exports `modules: Module[]`
    foundations.ts   #   one file per module (authored lessons)
  ai/index.ts        # Artificial Intelligence
```

Each domain's `index.ts` **must** `export const modules: Module[]`. Domains are
lazy-imported by `registry.ts`, so a domain's content is a separate JS chunk and
never bloats the initial bundle — this scales to thousands of lessons.

## Add a lesson (the 5-minute path)

1. Open the module file (e.g. `web/foundations.ts`).
2. Copy an existing `Lesson` object and edit the fields.
3. Add it to the module's `lessons: [...]` array (order = curriculum order).
4. Done. It's live at `/learn/<domain>/<lesson-id>` with reading UI, TOC,
   checklist, quiz, and prev/next — no component changes.

### Lesson anatomy (all fields optional except the header ones)

| Field | Purpose |
|---|---|
| `id` | Stable slug, unique within the domain (used in the URL). |
| `title`, `objective` | What the lesson is + what the student will learn. |
| `difficulty` | `Beginner` / `Intermediate` / `Advanced`. |
| `estMinutes` | Reading time (or omit and estimate via `estimateMinutes`). |
| `prerequisites` | Lesson ids shown in the header. |
| `theory` | **Markdown.** The main explanation — What / Why / When / Where. |
| `intuition` | A one-line real-world analogy. |
| `definitions` | `{ term, meaning }[]` — the key vocabulary. |
| `language` + `syntax` + `example` | Language-appropriate code (fenced + highlighted). |
| `visual` | `{ kind: "mermaid", src }` **or** `{ kind: "anim", name }` (see below). |
| `complexity` | `{ time, space, notes }` (mostly DSA). |
| `keyConcepts`, `commonMistakes`, `tips`, `optimization` | Bullet lists. |
| `quiz` | Inline questions — see the 5 types below. |
| `practice` | DSA-style `Question[]` (Easy/Med/Hard). Optional. |
| `revision` | Concise recap bullets. |

## Quiz question types

All are auto-graded with immediate feedback + an `explanation`:

- **`mcq`** — `options: string[]`, `answerIndex`.
- **`truefalse`** — `answer: boolean`.
- **`fill`** — `answers: string[]` (accepted, case/space-insensitive).
- **`output`** — show `code`, learner predicts the console output (`answers`).
- **`code`** — learner writes JS; run in the sandbox; graded against
  `expectedOutput`.

## Visuals

- **Mermaid diagram:** `visual: { kind: "mermaid", src: "graph TD; A-->B" }`.
- **Named animation:** `visual: { kind: "anim", name: "httpRequest" }`. Available
  animations live in `components/lesson/visuals.tsx`
  (`httpRequest`, `neuralForward`, `arrayTraversal`, …). Add a new one there and
  register it by name — it's then usable from any lesson by data alone.

Keep visuals **clarifying, not decorative** — every animation should teach.

## Add a whole domain

1. Create `content/<domain>/index.ts` exporting `modules: Module[]`.
2. Add the domain to `Domain` in `types.ts`, and to `DOMAINS` + `DOMAIN_META` +
   `LOADERS` in `registry.ts`.
3. That's it — `/learn/<domain>` and every lesson route work immediately.

## Content sourcing rule

Synthesise from respected references (MDN, React/Node docs, Striver, NeetCode,
fast.ai, Hugging Face, PyTorch, etc.) **as references only**. Write original
explanations — never copy copyrighted text.
