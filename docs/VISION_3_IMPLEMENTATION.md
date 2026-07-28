# PrepNext Vision 3.0 — Implementation Report

**Goal:** evolve PrepNext from a DSA-only prep site into a premium, multi-domain
technical learning platform students can comfortably use for hours a day —
Notion/Linear/GitHub-Docs in feel, KISS in philosophy, deep in content.

**Verification status:** `typecheck` 0 errors · **49/49 tests pass** ·
production build clean · **driven end-to-end in a real browser** (Chrome, signed-in
account) across all three domains · DB migration applied and sync confirmed
against live Postgres · **zero regression** to existing DSA/placement features.

---

## 1. New architecture

The key insight that shaped everything: **PrepNext was already a data-driven
learning engine.** `data/dsa/roadmap.ts` (Phase → Topic → Lesson + Question[])
rendered by `LessonView`/`LearnTopic` already did objective → theory → syntax →
example → complexity → practice → checklist. Progress (activity streak,
completion %, readiness score, mastery/EWMA, SRS) already existed, per-user
namespaced in localStorage.

So Vision 3.0 is a **generalisation, not a rewrite**: lift the DSA-shaped engine
into a domain-agnostic one, then fill the specific gaps.

```
client/src/content/            ← NEW: the domain-agnostic content engine
  types.ts                       Lesson / Module / QuizQuestion / VisualSpec schema
  registry.ts                    lazy per-domain loader, ordering, prev/next,
                                 checklistForLesson(), isLessonComplete()
  dsa/index.ts                   ADAPTER over existing roadmap.ts (no duplication)
  web/{index,foundations,core-skills}.ts
  ai/index.ts

client/src/routes/
  Learn.tsx                     ← NEW  /learn            (pick a track)
  LearnDomain.tsx               ← NEW  /learn/:domain    (modules + lessons)
                                       + legacy dispatcher (see §8)
  Lesson.tsx                    ← NEW  /learn/:domain/:id (unified reader)

client/src/components/lesson/
  LessonArticle.tsx             ← NEW  renders the full lesson anatomy
  Quiz.tsx                      ← NEW  5-type inline quiz engine
  LessonVisual.tsx / visuals.tsx← NEW  animation registry + mermaid dispatch
  Toc.tsx / ReadingProgress.tsx ← NEW  reading experience
```

**Layering rule:** content is pure data → `registry` resolves it → hooks read
persisted state → components render. Adding a lesson touches **only data**.

---

## 2. Curriculum organisation

| Domain | Modules | Lessons | Language |
|---|---|---|---|
| **Web Development** (reference build) | Web Foundations, Core Skills | **8** | JS/TS, HTML, CSS |
| **AI** | AI Foundations | 1 | Python |
| **DSA** | 13 phases (adapted from existing roadmap) | all existing topics | C++ |

Web curriculum (the depth template): *How the Web Works → HTTP → HTML Semantics
→ JavaScript Fundamentals → CSS Box Model → DOM & Events → Async & fetch → First
React Component*. Deliberately sequenced so lesson 6 (manual DOM syncing pain)
sets up lesson 8 (React removes it) — concept progression, not a topic list.

Content is **original**, synthesised from MDN / React / Node / fast.ai / PyTorch
docs used as references only. No copied text.

---

## 3. Lesson engine

One schema (`content/types.ts`) drives every domain. Every field except
`id/domain/moduleId/title/objective/difficulty/estMinutes/theory` is optional,
and `LessonArticle` renders a section **only if its field exists** — so a lesson
can start thin and deepen over time without touching components.

Anatomy supported: objective · theory (markdown) · real-world intuition · key
definitions · key concepts · syntax · worked example · visual · complexity ·
common mistakes · optimization notes · interview tips · quiz · practice ·
revision summary · checklist · prerequisites · estimated read time · prev/next.

Each section renders as `<section id data-toc-title>`, which is how the TOC
discovers structure generically — no per-lesson config.

---

## 4. Quiz engine

`components/lesson/Quiz.tsx` — **static, content-authored, deterministic,
offline**. No AI, no network (the retired Groq quiz route stays retired; a seam
remains if you ever want adaptive generation).

| Type | Checking |
|---|---|
| `mcq` | option index |
| `truefalse` | boolean |
| `fill` | accepted answers, case/whitespace-insensitive |
| `output` | predict console output vs accepted answers |
| `code` | learner writes JS, runs in the **existing sandboxed Web-Worker `CodeRunner`**, output compared to `expectedOutput` |

Immediate feedback + explanation on answer; "try again" for non-code types;
results persist per-user and never downgrade a correct answer.

**Reuse over rebuild:** the code challenge required only a small
backward-compatible `onResult` callback on `CodeRunner` — no second sandbox.

---

## 5. Animation system

`components/lesson/visuals.tsx` — a name-keyed registry of small
`framer-motion` components, **all reduced-motion aware**. Lessons reference them
as pure data (`visual: { kind: "anim", name: "httpRequest" }`).

Built: `httpRequest` (request/response loop), `neuralForward` (forward pass),
`arrayTraversal` (index scan). Mermaid diagrams are the other kind
(`{ kind: "mermaid", src }`), rendering through the previously-orphaned themed
`MermaidDiagram` component — now wired up and confirmed rendering real SVG.

Referencing an unimplemented animation name renders nothing rather than
erroring, so content and animation work can land independently.

---

## 6. Content management strategy

Authored as **structured TypeScript** (type-safe; a typo fails `tsc`, not
production). Each domain is a **lazily-imported chunk** — content downloads only
when a learner opens that track, so the curriculum can grow to thousands of
lessons without touching initial bundle size.

Full playbook: **[`docs/CONTENT_AUTHORING.md`](./CONTENT_AUTHORING.md)** — how to
add a lesson, a module, or an entire new domain (a new domain is ~4 lines of
registry wiring; routes/quizzes/visuals/progress then work automatically).

---

## 7. Progress tracking & gamification

**Offline-first, derived-from-state.** No event log to drift or double-count —
XP/levels/badges are pure functions of what's already persisted (`lib/gamification.ts`,
unit-tested).

- **XP:** checklist tick 10 · correct quiz 12 · solved problem 15
- **Levels:** `xpForLevel(n) = 50·(n-1)·n` (gentle → steeper)
- **Badges:** 8 achievement rules
- **Heatmap:** 14-week GitHub-style activity grid
- **Streak:** driven by *real learning activity*, never by logging in

**Streak reconciliation (bug fixed):** two conflicting definitions existed —
`EngagementProvider.tickStreak` (time-on-site ≥60s/day, UTC dates) and
`streakDates.ts` (activity-based, local dates). The Nav badge used the
time-on-site one, so idling on a page grew your streak. Nav now uses the single
activity-based source; the duplicate is no longer consumed.

**Server persistence.** localStorage stays the source of truth the app reads and
writes (nothing above the sync layer changed); it is mirrored to Postgres so
progress survives a cleared browser or a new device.

- `server/routes/progress.js` — `GET/PUT /api/progress`, `requireAuth`, 512 KB cap
- `UserProgress` Prisma model — one JSON blob per user, FK-cascaded
- Migration `20260719140000_add_user_progress` — **applied to the live Supabase DB
  and recorded in `_prisma_migrations`**
- `hooks/useProgressSync.ts` — hydrate-once on sign-in (never clobbers local
  progress with an empty server row), debounced push, push on tab-hide

---

## 8. Files

**New (18):** `content/{types,registry,registry.test}.ts` ·
`content/dsa/index.ts` · `content/web/{index,foundations,core-skills}.ts` ·
`content/ai/index.ts` · `routes/{Learn,LearnDomain,Lesson}.tsx` ·
`components/lesson/{LessonArticle,Quiz,LessonVisual,visuals,Toc,ReadingProgress}.tsx` ·
`components/dashboard/{GamificationCard,LevelUpConfetti}.tsx` ·
`hooks/{useLessonContent,useGamification,useProgressSync}.ts` ·
`lib/{quizStore,gamification.test}.ts` · `lib/sync/progressSync.ts` ·
`server/routes/progress.js` · migration SQL · `docs/CONTENT_AUTHORING.md`

**Modified (10):** `App.tsx` (routes + sync mount) · `Nav.tsx` (Learn entry,
streak source, `data-app-chrome`) · `Footer.tsx`/`MobileTabBar.tsx`
(`data-app-chrome`) · `styles/globals.css` (reading surface + immersive) ·
`dsa/CodeRunner.tsx` (`onResult`) · `hooks/useLocalStorageState.ts` (**sync-bug
fix**, §10) · `useLearningProgress.ts`/`useDailyStreak.ts` (key centralisation) ·
`Dashboard.tsx` (gamification card) · `server/app.js` · `server/prisma/schema.prisma`

**Deleted (1):** `routes/LearnTopic.tsx` — fully superseded by the unified
reader; verified zero remaining references.

**Reused, not rebuilt:** `MarkdownView`, `MermaidDiagram`, `Checklist`/
`useChecklist`/`useLearningProgress`, `QuestionCard`, `CodeRunner`,
`streakDates.ts`, `useLocalStorageState`, `Card`/`Button`/`ProgressBar`.

**No new dependencies.**

---

## 9. Performance

- **Per-domain lazy chunks** — a track's content loads on demand; curriculum
  growth doesn't inflate first paint.
- **Route-level code splitting** — the three new routes are `lazy()` like the rest.
- **Mermaid stays lazy** (~160 KB gzip) — loaded only by lessons that use a diagram.
- **rAF-throttled, passive** scroll listener for the reading-progress bar.
- **IntersectionObserver** scroll-spy (no scroll-position polling).
- **Debounced sync** with a dirty check — identical snapshots are never re-pushed.
- Reduced-motion respected across every animation.

---

## 10. Bugs found and fixed during verification

Driving the real app surfaced two defects that static checks could not:

1. **Progress sync silently dropped all learning data.** `exportUserData()`
   iterates `LS_KEYS`, but `prepnext.dsaLearning.v1` (the central checklist/
   solved/streak store) and `prepnext.quiz.v1` were never registered there.
   The first sync reached Postgres carrying *only* engagement telemetry — every
   learner's real progress would have been lost on a new device, silently.
   Fixed by registering the keys and pointing the literals at `LS_KEYS` so they
   can't drift again. Re-verified: all three stores now persist.
2. **`Focus read` collided with the floating Pomodoro `Focus` button** — visually
   overlapping and semantically confusing. Renamed to **Immersive** and offset.

---

## 11. Remaining technical debt

- **Content volume is the real backlog.** The engine, quiz engine, visuals, and
  authoring guide are done; AI has 1 lesson and Web has 8. Scaling is now pure
  content work — deliberately so.
- **Web/AI practice banks.** The reused `Question.Solution` type requires a
  `cpp` field (DSA-shaped), so Web/AI lessons drive hands-on work through the
  inline quiz (incl. code challenges) instead. Generalising `Solution` to a
  language-keyed map would unlock Easy/Med/Hard practice for all domains.
- **`EngagementProvider.tickStreak`** is now unused by the Nav but still
  computed; safe to delete with its `streakDays` context field.
- **Sync is last-write-wins.** Fine for one active device; two devices editing
  concurrently could clobber. Per-collection merge or timestamps would fix it.
- **No component/E2E tests in CI.** Unit tests cover pure logic (49); this pass
  was verified by real browser driving, which isn't yet automated.
- Pre-existing repo-wide Tailwind v4 `suggestCanonicalClasses` lint warnings
  (`bg-[var(--x)]` → `bg-(--x)`) — untouched, a mechanical codemod.

---

## 12. Roadmap

**Next (highest leverage first)**
1. **Scale Web + AI content** to full curricula using the authoring guide.
2. **Generalise `Solution`** to language-keyed, unlocking practice banks everywhere.
3. **Per-lesson notes** — the `Note` Prisma model already exists and is unused.
4. **Playwright E2E** for the flows verified manually here.

**Then**
5. **Spaced repetition across domains** — `SRSItem` exists; auto-enqueue lessons
   at completion so revision becomes systematic.
6. **Adaptive quizzes** — the Quiz seam accepts generated questions; re-enable a
   model behind the retired route if wanted.
7. **Search across lessons** — the registry already has every lesson in memory.

**SaaS direction (Phase 8 of the brief)**
The engine is deliberately role-agnostic: content is data, progress is per-user
and server-backed, and the reader is a pure function of a `Lesson`. Teacher /
college / mentor / recruiter roles become **new views over the same engine** plus
a `role` on `User` and cohort grouping — no learning-engine changes required.
The `UserProgress` blob would split into queryable tables at that point, since
cohort analytics needs server-side aggregation.
