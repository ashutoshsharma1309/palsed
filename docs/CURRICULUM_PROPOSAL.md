# PrepNext Curriculum Evolution — Phase 2 Proposal
## Curriculum Review & Expansion (Audit → Research → Recommendations)

> **Status: P0 IMPLEMENTED & VERIFIED** (approved 2026-07-28) — DSA Tier-A deep
> topics, Web M3+M4, AI M1-completion+M2, five new animations. P1/P2/P3 remain
> proposals. Audit numbers below describe the state *before* P0.

---

## 1. Curriculum Audit — what actually exists today

### 1.1 Inventory (measured)

| System | File(s) | Scale | Depth |
|---|---|---|---|
| **DSA Roadmap** | `data/dsa/roadmap.ts` | 13 phases · **32 topics** | **14 deep** (full lesson + practice) · **18 stubs** (1-paragraph, 0 practice) |
| DSA practice bank | same | **46 questions** with C++ solutions | concentrated in the 14 deep topics |
| **Coding Patterns** | `data/patterns/patterns.ts` | **26 patterns**, 5 categories | strong: definition/why/recognition/when-not/example/interview notes + **43 solved questions** |
| **Web (engine)** | `content/web/` | 2 modules · **8 lessons** | full anatomy: quiz, visuals, revision |
| **AI (engine)** | `content/ai/` | 1 module · **1 lesson** | full anatomy |
| **Projects** | `data/projects/` | **10 domains**, fully-specced projects (features, folder structure, tech, skills, stretch goals) | strong — already the "build" layer |
| **Mock OA** | `data/oa-questions.ts` | 1,550-line question bank | working OA simulator |
| Aptitude / Core CS / System Design / Interview | `data/placement/*` | external link-lists | thin (pointers, not lessons) |

### 1.2 Per-domain audit verdicts

**DSA — ordering ✅, depth ❌ in the middle.**
The 13-phase order (fundamentals → arrays/strings → recursion → search/sort →
linear structures → hashing → trees → graphs → greedy/bits → DP → advanced → interview)
matches the consensus of Striver A2Z / NeetCode / USACO ordering. The problem is
**where the stubs fall**: `hashing, stack, queue, trees, bst, heap, trie, graphs,
greedy, bit-manipulation, backtracking, advanced-dp, segment-tree, fenwick, dsu,
advanced-graph, interview-revision, mock-interview` — i.e. **the exact band where
interviews live** (phases 6–12) has one paragraph and zero practice per topic,
while phase 1 fundamentals are the deepest content. A student following the
roadmap linearly falls off a cliff at phase 6.
Also: the 14 deep lessons predate the Vision 3.0 schema — **none has a quiz,
revision block, or visual**, though the engine now renders all three.
Missing topics vs. the checklist in the brief: **STL/language toolkit** (no
lesson anywhere), **2D arrays/matrices**, **sorting algorithms in depth** (one
combined searching-sorting lesson), **string algorithms** (KMP/Z/rolling hash),
**math for CP** (GCD/modular/primes beyond basic-math), **intervals** (pattern
exists; no roadmap coverage). Deque is mentioned inside the queue stub — adequate.
Two Pointer / Sliding Window / Prefix Sum correctly live in Patterns, but
**roadmap topics don't cross-link to their matching patterns** — two systems, no bridge.

**Web — quality ✅, coverage ❌ (~15% of a placement path).**
The 8 lessons are the right *first* 8 and correctly sequenced (the DOM-pain →
React-payoff arc is genuinely good pedagogy). But against the roadmap in the
brief (and Full Stack Open / Odin / roadmap.sh scope), everything after "first
React component" is missing: CSS layout systems, responsive design, a11y,
ES6+ depth, closures/`this`/event loop (the #1 JS interview band), TypeScript,
Git, npm/build tools, React beyond `useState`, routing, forms, state management,
Next.js, Node/Express for real, SQL, MongoDB, ORMs, auth/JWT, caching/Redis,
Docker, deployment, CI/CD, testing, security, performance, system-design
fundamentals, machine-coding prep. The placement hub's webdev link-list papers
over this by outsourcing to roadmap.sh/FSO — fine as references, but it is not
*PrepNext's* curriculum.

**AI — a seed, not a curriculum (~5% coverage).**
One excellent lesson ("What ML Actually Is"). Everything else — Python/NumPy/
Pandas, stats, classical ML, scikit-learn, deep learning, transformers, LLMs,
prompt engineering, embeddings/vector DBs, RAG, agents, deployment, responsible
AI — exists only as external links in `placement/ai.ts`/`ml.ts`. Given 2026
hiring data (AI/ML fresher demand up ~40–50%, GenAI-feature skills expected of
generalist SWEs), this is the **largest gap relative to market value**.

**Cross-cutting audit findings.**
1. **Practice asymmetry:** DSA+Patterns have 89 solved problems; Web/AI have
   hands-on work only via inline quizzes (the `Solution` type is C++-only —
   known debt from the Vision 3.0 report).
2. **Visuals underused:** 3 animations + 2 mermaid diagrams exist across 9
   engine lessons; the animation registry supports 9 named animations, 6 unimplemented.
3. **Projects are strong but orphaned from lessons** — no module says "you can
   now build X" even though matching specced projects already exist in 10 domains.
4. **Aptitude/Core-CS/System-Design are link farms** — acceptable for v1, but
   OAs weight aptitude heavily at service companies; nothing native exists.

### 1.3 Current scores (0–100, honest)

| Dimension | DSA | Web | AI | Overall |
|---|---:|---:|---:|---:|
| Coverage vs. placement-ready target | 62 | 22 | 8 | **31** |
| Content quality (what exists) | 78 | 90 | 90 | 84 |
| Sequencing / learning flow | 85 | 88 | 80 | 85 |
| Interview readiness | 58 | 30 | 10 | 33 |
| Project readiness (lesson→build bridge) | 40 | 45 | 20 | 35 |
| Industry relevance of what exists | 85 | 90 | 85 | 87 |

**Read:** the platform's *engine and pedagogy* are excellent; the *coverage* is
the bottleneck. This proposal is therefore ~90% content authoring, ~10% small
data-model additions.

---

## 2. Research basis

Scope and ordering below are synthesized (not copied) from: **official docs**
(MDN, React, Next.js, Node, Express, TypeScript, Tailwind, PyTorch, Hugging
Face, LangChain, OpenAI, Docker, Git) and **established curricula** (Striver
A2Z, NeetCode roadmap, CP-Algorithms, USACO Guide, CSES, fast.ai, Hugging Face
LLM course, Full Stack Open, The Odin Project, roadmap.sh) — the same reference
set already cited inside `patterns.ts`. 2026 market validation from current
hiring-trend reporting: AI-in-hiring is now standard (~87% of companies use AI
in assessment), AI/ML fresher hiring grew 40–50% in early 2026, and generalist
SWE fresher expectations now include GenAI-feature literacy
([AccioJob 2026 trends](https://acciojob.com/blogs/latest/indian-tech-hiring-trends-2026-what-job-seekers-must-know-to-stay-employable),
[Karat 2026 interview trends](https://karat.com/engineering-interview-trends-2026/)).
Community pain-points (JS deep-dives, machine-coding rounds, system-design
basics for freshers) consistent with interview-prep discussions.

---

## 3. DSA — expansion plan (respects current flow)

**No reordering. No deletions.** Three workstreams:

### 3.1 Deepen the 18 stubs → full lessons (the core fix)
Each gets the full anatomy (theory ~1.5–2k words, intuition, definitions, C++
syntax+example, complexity, mistakes, tips, **quiz, revision**) plus **5–8
practice questions** with C++ solutions + LeetCode links. Priority by interview
frequency:

| Tier | Topics | Rationale |
|---|---|---|
| **A (do first)** | hashing · trees · stack · graphs · heap · bst | highest ask-rate at product companies |
| **B** | queue/deque · greedy · backtracking · bit-manipulation · advanced-dp | second band + OA staples |
| **C** | trie · dsu · advanced-graph · segment-tree · fenwick | senior-band / CP differentiators |
| **D** | interview-revision · mock-interview | rewrite as *actionable playbooks* (checklist-driven), not topic lessons |

### 3.2 New lessons (8) — fill checklist gaps without disturbing phases
| New topic | Phase | Why |
|---|---|---|
| **C++ STL Toolkit** (vector/map/set/pq/algorithms) | p1 (after functions) | explicitly required; students currently meet STL implicitly in solutions |
| **2D Arrays & Matrices** | p2 | matrix traversal/rotation is an OA staple |
| **Sorting Algorithms in Depth** (merge/quick/counting + stability) | p5 | current lesson compresses search+sort into one |
| **Complexity Analysis II** (amortized, recurrence, space tricks) | p5 | interviewers probe beyond big-O basics |
| **String Algorithms** (KMP, Z, rolling hash) | p12 | CP + Google/Uber-band interviews |
| **Math for CP** (GCD, modular arithmetic, primes, combinatorics) | p12 | CSES/CF prerequisite; OA math questions |
| **Intervals** (merge/insert/meeting rooms) | p2 or p10 | classic band missing from both systems' roadmaps |
| **Matrix/Grid Graphs** (islands, flood fill) | p9 | the single most common graph-interview shape |

### 3.3 Upgrades to existing deep topics
- Add **quiz (3–4 q) + revision + one visual** to each of the 14 deep lessons
  (engine already renders them; `arrayTraversal` animation already exists for arrays).
- **Cross-link roadmap ↔ patterns**: add `relatedPatterns?: string[]` to `Topic`
  and `relatedTopics?: string[]` to `Pattern` (pure data + one link row in the UI).
- Patterns: raise thin banks (9 patterns have 1 question) to ≥3 each (+~15 questions).

**DSA net:** 18 stub→full rewrites + 8 new lessons + 14 upgrades + ~120 new
practice questions ⇒ roadmap goes 46 → ~170 questions, every phase interview-deep.

---

## 4. Web Development — full engineering roadmap

Keep Modules 1–2 untouched (they're the correct on-ramp). Add six modules,
sequenced so each unlocks the next. **JS/TS throughout** (engine default).

| # | Module | Lessons (proposed) | Count |
|---|---|---|---|
| 3 | **Styling & Layout** | CSS selectors & specificity · Flexbox · Grid · Responsive design & media queries · Accessibility in practice · Tailwind & utility CSS | 6 |
| 4 | **JavaScript Deep Dive** *(the interview module)* | ES6+ toolkit (destructuring/spread/modules) · Closures & scope · `this` & prototypes · The event loop (microtasks/macrotasks) · Error handling · Browser APIs & storage | 6 |
| 5 | **TypeScript & Tooling** | TS fundamentals · Narrowing & generics · Git & GitHub workflow · npm, package.json & build tools (Vite) | 4 |
| 6 | **React in Depth** | Thinking in components & props · useState/useEffect properly · Lists, keys & conditional rendering · Forms (controlled/uncontrolled) · React Router · Data fetching patterns · Context & state management · Performance (memo, lazy, keys) | 8 |
| 7 | **Backend Engineering** | Node.js runtime & modules · Express: routes/middleware/errors · REST API design · SQL fundamentals (Postgres) · MongoDB & when NoSQL · ORMs (Prisma) · Auth: sessions vs JWT · Validation, uploads & caching (Redis) | 8 |
| 8 | **Ship & Scale** *(placement differentiator)* | Testing (unit/integration, Vitest/Jest) · Docker fundamentals · Deployment (Vercel/Render/VPS) · CI/CD with GitHub Actions · Web security essentials (OWASP for freshers) · Performance & Core Web Vitals · System design fundamentals I (client-server, LB, caching, DB scaling) · Machine-coding round playbook | 8 |

**Web net:** 8 → **48 lessons** across 8 modules. Next.js gets a dedicated
mini-module later (P2) rather than bloating M6 — React mastery first is the
consensus ordering (FSO/Odin/React docs).

---

## 5. AI — complete learning journey

Beginner→placement path, **Python throughout**, honest about math (intuition-first,
formal only where interviews require it).

| # | Module | Lessons (proposed) | Count |
|---|---|---|---|
| 1 | **AI Foundations** *(extends existing module)* | *(existing: What ML Is)* · Python for AI crash course · NumPy · Pandas · Data visualization · Statistics & probability essentials · Linear algebra intuition (vectors/matrices/dot products) | +6 |
| 2 | **Machine Learning Core** | Regression (fit a line, loss) · Classification (logistic, trees, kNN) · Train/test & overfitting · Evaluation metrics (why accuracy lies) · Feature engineering · Unsupervised (clustering, PCA) · The scikit-learn workflow | 7 |
| 3 | **Deep Learning** | Neural networks from intuition · How training works (backprop conceptually) · PyTorch fundamentals · CNNs & vision · Sequences & RNNs (why they lost) · Regularization & tuning | 6 |
| 4 | **Transformers & LLMs** *(the 2026-market module)* | Attention & the transformer · Embeddings · Prompt engineering that works · Using LLM APIs · Vector databases · RAG end-to-end · Fine-tuning vs RAG vs prompting · Agents & LangChain | 8 |
| 5 | **Applied AI Engineering** | Serving models (FastAPI) · MLOps & monitoring intro · Responsible AI & evaluation · AI system design (design a RAG product) · Shipping AI features in products | 5 |
| 6 | **AI Interview Prep** | ML theory rapid-fire (playbook) · Case/design rounds · Telling your project story | 3 |

**AI net:** 1 → **36 lessons** across 6 modules. Existing `neuralForward`
animation slots into M3; new visuals: attention flow, RAG pipeline (mermaid).

---

## 6. Lesson-quality review (existing 9 engine lessons)

Rubric: objective/difficulty/time/prereqs/theory/example/visual/quiz/practice/revision/checklist.

| Lesson | Verdict | Recommended improvement |
|---|---|---|
| How the Web Works | ✅ complete | — |
| HTTP | ✅ complete (reference standard) | — |
| HTML Semantics | ✅ | none urgent |
| JS Fundamentals | ✅ | add prereq link to `http-basics`? (currently html-semantics — fine) |
| CSS Box Model | good | **add `boxModel` animation** (visual is mermaid; a margin/padding/border animation teaches better) |
| DOM & Events | good | **add `domEvents` animation** (no visual today; the "live tree" concept is visual by nature) |
| Async & fetch | ✅ (mermaid state diagram) | — |
| Intro React | ✅ (`reactRender` anim) | — |
| What ML Is | ✅ | — |

Systemic recommendations: (a) implement the 6 declared-but-unbuilt animation
names before authoring lessons that want them (`stackPushPop`, `queue`,
`linkedList`, `treeTraversal`, `graphTraversal` — all needed by DSA Tier A/B
anyway); (b) every new lesson ships with quiz ≥3 questions incl. ≥1
code/output type where the language allows; (c) `estMinutes` honesty check
against the registry's estimator during review.

---

## 7. Project integration (bridge lessons → the existing Projects module)

The 10-domain Projects system already has fully-specced projects — the missing
piece is **module→project pointers**. Proposal: add an optional
`capstone?: { domainId: string; projectId: string; note: string }` to `Module`
(one field, renders as a card at module end). Mapping:

| Module completed | Capstone (existing project domain) | Difficulty | Duration | Interview relevance | Portfolio value |
|---|---|---|---|---|---|
| DSA p5 (search/sort) | Mini problem-set sprints (Patterns) + first timed **Mock OA** | Easy–Med | 1 wk | OA readiness | low |
| DSA p11 (DP) | Contest simulation (CSES/CF ladder via OA module) | Med–Hard | ongoing | coding rounds | med |
| Web M3 | Portfolio website (web-development domain) | Beginner | 1–2 weekends | resume screen | **high** |
| Web M6 | Task manager w/ auth (web-development) | Intermediate | 2–3 wks | machine-coding round | high |
| Web M7 | E-commerce backend or Chat app (backend-development) | Intermediate+ | 3–4 wks | system+API design Qs | **high** |
| Web M8 | Deploy + CI/CD an existing project (devops domain) | Intermediate | 1 wk | DevOps talking points | med |
| AI M2 | Spam detector / classifier (ai-machine-learning) | Beginner | 1 wk | ML fundamentals Qs | med |
| AI M3 | Image classifier (ai-machine-learning) | Intermediate | 2 wks | DL fundamentals | med |
| AI M4 | **RAG application** + AI agent (ai-machine-learning) | Intermediate+ | 2–3 wks | the 2026 differentiator | **very high** |
| AI M5 | Resume analyzer (ships an AI feature end-to-end) | Advanced | 2–3 wks | product-thinking Qs | high |

Each mapping's prerequisites = the module itself; skills-practiced already
enumerated in the existing `Project.skills` field. Recommend adding
`interviewRelevance: string` to the `Project` type (one field, pure data).

---

## 8. Placement-readiness review

| Round type | Covered by | Gap after this proposal |
|---|---|---|
| Online Assessment | Mock OA (1,550-line bank) + DSA/patterns practice | add aptitude **native lessons** (currently links only) — flagged P2 |
| DSA coding rounds | Roadmap (deepened) + Patterns + LeetCode links | none structural |
| Machine coding | **new** Web M8 playbook + Task-manager capstone | none |
| Technical/theory interview | quizzes + tips fields + Core-CS links | Core CS (OS/DBMS/CN) stays external — candidate for a 4th domain later |
| System design (fresher level) | **new** Web M8 · AI M5 design lessons | deeper native SD track = future domain |
| Behavioral/HR | interview-resources links | native "behavioral playbook" lesson — P2, cheap, high value |
| AI-assisted assessments (2026 norm) | OA simulator + timed practice | consider AI-proctoring-style timed modes later (product, not curriculum) |
| Service-company mass hiring | aptitude + basics + communication | aptitude gap (above) |
| Product-company / off-campus | full proposal scope | — |

---

## 9. Final recommendations & sequencing

### Scores after full implementation (projected)
Coverage **31 → ~85** · Interview readiness **33 → ~85** · Project readiness
**35 → ~80** · Learning flow stays ~85 (ordering already right).

### Priority plan (each batch independently shippable, pure-data-first)

| Priority | Batch | Size | Impact | Difficulty |
|---|---|---|---|---|
| **P0-a** | DSA stub Tier A (hashing/trees/stack/graphs/heap/bst) + their animations | 6 lessons, ~40 questions | highest — fixes the interview cliff | M (content-heavy) |
| **P0-b** | Web M4 JavaScript Deep Dive + M3 Styling & Layout | 12 lessons | #1 web-interview band + visible-skill layer | M |
| **P0-c** | AI M1 completion + M2 ML Core | 13 lessons | opens the highest-growth track | M |
| **P1-a** | DSA Tier B stubs + 8 new DSA lessons + deep-topic quizzes | ~22 items | completes DSA | M |
| **P1-b** | Web M6 React + M7 Backend | 16 lessons | machine-coding + full-stack readiness | L |
| **P1-c** | AI M3 Deep Learning + M4 LLMs/RAG | 14 lessons | 2026 differentiator | L |
| **P2** | Web M8 Ship & Scale · AI M5–M6 · DSA Tier C/D · capstone field + mappings · pattern bank top-up · roadmap↔pattern cross-links · behavioral playbook · TS mini-module for Next.js | ~30 items | polish → "most comprehensive" claim | M |
| **P3 (backlog)** | Native aptitude lessons · Core CS as 4th domain · language-keyed `Solution` (unlocks Web/AI practice banks — from Vision 3.0 debt) · Next.js module | — | platform expansion | M–L |

**Engine changes required: only three tiny, additive data-model fields**
(`Module.capstone?`, `Topic.relatedPatterns?`, `Project.interviewRelevance?`) —
everything else is pure content, exactly as the architecture intended. KISS,
modularity, and SaaS scalability are untouched.

### Grand totals if fully approved
~**130 new lessons** (DSA 26 new/rewritten + 14 upgraded · Web 40 · AI 35),
~**135 new practice questions**, 6 new animations, 3 data fields.
Suggested cadence: P0 ≈ one sprint each (a/b/c parallelizable), P1 two sprints, P2 one.

---

*Awaiting approval. On approval, implementation starts with P0 (recommended: all
three P0 batches, since they're independent) following `docs/CONTENT_AUTHORING.md`,
with `typecheck + tests + build` gates per batch and no changes to existing lesson text.*
