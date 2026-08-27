# PrepNext — Interview Prep (Questions & Model Answers)

> Q&A bank generated from a deep analysis of THIS codebase. Every answer is
> grounded in real files and real decisions in the repo, so you can defend it
> under follow-up questions. Practice saying answers out loud, not reading them.

---

## Phase 1 — Project Explanation

### Q1. Explain your project.

**Answer:**
PrepNext is a placement-preparation platform for Indian college students — it
takes a student through the entire journey **Learn → Practice → Build →
Interview → Placement** in one product. It has a structured DSA roadmap, 26
coding patterns, a curated problem hub with LeetCode links, 30 structured
projects across 10 domains, timed Mock OAs, a recruiter map with verified CTC
data, a PYQ vault, and an AI Socratic tutor. Everything rolls up into a single
**Placement Readiness Score (0–100)** weighted across DSA (25%), patterns
(20%), projects (20%), Mock OA (20%), and consistency (15%).

Technically it's a React 19 + TypeScript + Vite SPA with Tailwind v4, talking
to an Express 4 API. In production the whole thing runs on **Vercel** — the SPA
is served statically and the Express app runs as a single serverless function
(`api/index.js` wraps `server/app.js`). The database is **PostgreSQL on
Supabase** accessed through **Prisma**, and authentication is **Supabase Auth**
(Google OAuth + email OTP) with server-side JWT verification. The AI tutor uses
**Groq** with strict JSON-mode responses.

### Q2. Who is the user, and what problem does this actually solve?

**Answer:**
A 2nd–4th year Indian engineering student preparing for campus placements.
Today their prep is fragmented: LeetCode for problems, YouTube for concepts,
random Google Sheets for company data, Telegram groups for PYQs. PrepNext
consolidates that into one opinionated journey and — the key differentiator —
gives them a single Readiness Score so they always know *what to do next*. The
"improve next →" nudge routes them to their weakest dimension.

### Q3. Why did you build it as one monolith instead of microservices?

**Answer:**
Deliberate choice. It's a solo project with one bounded domain, low write
volume, and a single deploy target. A monolith (one Express app, one Prisma
schema, one Vercel project) gives me atomic deploys, no network hops between
"services," and zero orchestration overhead. Microservices solve *team-scaling*
problems I don't have. If institutional/TPO features land (multi-tenancy,
cohort dashboards), the first split would be extracting the AI-tutor service
because it has a different scaling and cost profile — but not before.

---

## Phase 2 — Architecture & Design Decisions

### Q4. Why React? Why not Vue or Svelte?

**Answer:**
Three practical reasons: (1) ecosystem depth — React Router 7, framer-motion,
react-markdown, Vercel's analytics all have first-class React support; (2) I'm
targeting SDE interviews where React is the dominant expectation, so building
in it is compounding practice; (3) React 19's concurrent features and
`React.lazy`/`Suspense` fit my route-splitting strategy — I have 40+ lazy
routes in `App.tsx`. Vue would have worked technically; this was an
ecosystem-and-career decision, and I can defend it as such rather than pretend
one framework is objectively superior.

### Q5. Why Express and not Fastify or NestJS?

**Answer:**
The API surface is small — roughly ten live endpoints — so Fastify's raw
throughput advantage would be measurable but irrelevant at my traffic.
Express's middleware ecosystem and Vercel serverless compatibility are proven,
and my app factory pattern (`server/app.js` exports `buildApp()`) means both
the standalone server (`server/index.js`) and the Vercel wrapper
(`api/index.js`) share one app definition. NestJS's DI/decorator structure is
valuable on large teams; for a solo ~10-route API it's ceremony without payoff.
If I were rewriting today at larger scope I'd consider Fastify for schema-based
validation built in.

### Q6. Walk me through the folder structure. Why is it shaped this way?

**Answer:**
Monorepo with `client/` and `server/` as separate packages.

- `client/src/routes/` — one file per page (~40 pages), all lazy-loaded.
- `client/src/components/` — grouped by feature (`dsa/`, `pattern/`,
  `placement/`, `auth/`, `layout/`, `ui/`), not by type. Feature grouping keeps
  related code together as the app grows.
- `client/src/data/` — the content layer: large typed TS files
  (`companies.ts`, `dsa/roadmap.ts`, `patterns/patterns.ts`). The UI is
  data-driven — pages render from these registries, so adding content never
  touches component code.
- `client/src/lib/` — pure, framework-free logic (`salaryMath.ts`, `srs.ts`,
  `mastery.ts`, `streakDates.ts`) — these are unit-tested because they have no
  React dependency.
- `client/src/hooks/` — state hooks; `useAuth.tsx` is the one context provider.
- `server/` — flat: `app.js` (factory), middleware files (`auth.js`,
  `security.js`, `cors.js`), `routes/`, `prompts/`, `prisma/`.

The separation I'm most deliberate about is **data vs. logic vs. presentation**
on the client.

### Q7. How do the client and server talk in development? You have no Vite proxy.

**Answer:**
I use a port-handshake instead of a proxy. The dev server picks a random free
port (30000–60000) and writes it to `.ports.json` and
`client/public/runtime-config.json` (`server/index.js`). Vite waits on that
file (`wait-on file:./.ports.json` in the root dev script), and the client
fetches `/runtime-config.json` at runtime to discover the API base URL
(`lib/api.ts`). In production `__API_URL__` is `""` — same origin, so no CORS
in prod. Tradeoff: it's more moving parts than a `server.proxy` entry in Vite,
but it means zero hardcoded ports and no port-collision friction on shared
machines.

---

## Phase 3 — Authentication

### Q8. Explain your authentication flow end-to-end.

**Answer:**
1. **Client:** Supabase Auth via `supabase-js` singleton (`lib/supabase.ts`)
   with `persistSession` + `autoRefreshToken`. Two login methods: Google OAuth
   and email OTP (`signInWithOtp`/`verifyOtp`). All flows funnel through
   `/auth/callback` (`AuthCallback.tsx`).
2. **State:** one `<AuthProvider>` (`hooks/useAuth.tsx`) owns everything — a
   single `onAuthStateChange` subscription and a single deduped
   `/api/auth/me` fetch. `isAuthenticated` keys off token presence only.
3. **Server:** `requireAuth` middleware (`server/auth.js`) verifies the bearer
   token by calling `supabaseAdmin.auth.getUser(token)`, then find-or-creates a
   mirror `User` row in my Postgres keyed on `authId`, with P2002
   unique-constraint race handling.
4. **Route protection:** a `<RequireAuth>` layout route gates every page except
   `/`, `/verify-certificate`, and `/auth/callback`, and additionally forces
   `/onboarding` until `profileComplete` is true.

### Q9. Why do you verify the JWT with a Supabase API call instead of `jwt.verify` locally? Isn't that slower?

**Answer:**
Yes — it costs ~50–100ms per request versus microseconds for a local verify.
I chose it deliberately: Supabase is migrating projects to **ES256 with JWKS
key rotation**, and a local `jwt.verify` pinned to a static HS256 secret breaks
silently on rotation. `getUser()` also confirms the session hasn't been
revoked — a locally-valid JWT can belong to a signed-out or banned user. The
optimization path if latency mattered: fetch the JWKS, verify locally, cache
keys, and accept the revocation window — a classic security-vs-latency
tradeoff I can articulate but didn't need yet.

### Q10. What was the "/me storm" bug and how did you fix it?

**Answer:**
This is my best war story. Originally `useAuth()` was a plain hook — its own
state, its own `onAuthStateChange` subscription, its own `/api/auth/me` fetch.
Six components called it, so a protected page mounted multiple independent
copies, and every auth event (`INITIAL_SESSION`, `SIGNED_IN`,
`TOKEN_REFRESHED`) triggered a re-fetch in each copy. On login: **8–12
concurrent duplicate `/me` calls**, each causing a server-side Supabase
`getUser()` round-trip plus a User upsert racing on the unique constraint —
users saw a slow, flaky "finishing sign-in."

Fix (documented at the top of `useAuth.tsx`):
- Converted to a **single Context provider** — one subscription, one state.
- **In-flight dedup** (`inflightRef`): while a `/me` fetch is in flight, every
  caller shares the same promise.
- `TOKEN_REFRESHED` no longer re-fetches `/me` — a rotated JWT doesn't change
  the user row.
- Server side: catch Prisma `P2002` on the racing `user.create` and fall back
  to `findUnique`.

Lessons: shared state belongs in one owner; and idempotency on the server
saves you when the client misbehaves anyway.

### Q11. What's the difference between authentication and authorization in your app?

**Answer:**
Authentication = proving who you are: the Supabase JWT verified in
`requireAuth`. Authorization = what you can access: every DB query is scoped
by the authenticated `userId` from the middleware — per-user isolation, no
cross-user reads. I also have a profile-completeness gate (a form of
state-based authorization: incomplete profiles can only reach `/onboarding`).
I don't have roles yet; the TPO/admin dashboard on the roadmap will need an
RBAC layer (`role` column + middleware check).

### Q12. Explain your open-redirect protection.

**Answer:**
`safeRedirectTo()` in `server/routes/auth.js`: a client-supplied `redirectTo`
is honored only if it parses as a URL whose **origin is on an allow-list** and
whose **path is exactly `/auth/callback`**. Otherwise we fall back to the
default. Without this, an attacker could craft a login link that bounces a
freshly-authenticated user to a phishing domain with tokens in the fragment.

### Q13. Where do you store the token on the client, and what are the XSS implications?

**Answer:**
Supabase stores the session in `localStorage` (custom key
`prepnext.supabase.auth.v1`). Honest tradeoff: localStorage is readable by any
JS on the page, so an XSS hole means token theft. Mitigations: React escapes
output by default, I sanitize/limit all inputs server-side
(`validateRequestBody`), and I ship a CSP. The stricter alternative is
httpOnly cookies — immune to JS theft but requiring CSRF defenses; Supabase's
SSR cookie flow exists and would be the upgrade path if this moved to Next.js.
Knowing *why* each option exists matters more than which one I picked.

---

## Phase 4 — Database

### Q14. Walk me through your database schema.

**Answer:**
PostgreSQL on Supabase, ~20 models via Prisma. The core:

- **User** — the hub. `authId` (unique, maps to Supabase Auth UUID), `email`
  unique, profile fields (`fullName`, `branch`, `cgpa`, `targetRoles[]`,
  `profileComplete`).
- **Course → Chapter → Lesson** — nested content tree; deep AI-generated
  payloads (`explanations` in 4 learning styles, `checkQuestions`) stay as
  `jsonb`, while structure around them is normalized with FKs.
- **LessonProgress** — `@@unique([userId, lessonExternalId])` so progress
  writes are natural upserts.
- **MasteryEntry** — EWMA score per topic, `@@unique([userId, topic])`.
- **SRSItem** — SM-2-lite spaced repetition (`easeFactor`, `interval`, `reps`,
  `dueAt`) with `@@index([userId, dueAt])` — the exact index the "what's due
  today" query needs.
- **DsaProblemStatus / DsaBookmark / DsaAttempt** — practice tracker, each
  `@@unique([userId, problemId])`.
- **Certificate** — `verifyCode @unique` for public verification.
- **TutorThread → TutorMessage**, **EngagementDay**, **Note**, **Notification**.

Every child table has `@@index([userId])` and `onDelete: Cascade` — deleting a
user cleans up everything.

### Q15. Why JSON columns inside a relational schema? Isn't that denormalized?

**Answer:**
Selectively, yes. The rule I applied: **normalize what you query and join;
JSON what you only read whole.** Lesson `explanations` is a 4-style blob the
UI always renders in full — I never filter "WHERE explanation style = visual"
in SQL, so splitting it into rows buys nothing and costs joins. Structure I
*do* query (user→course→chapter→lesson relations, progress rows, mastery per
topic) is fully relational with FKs and indexes. Postgres `jsonb` also stays
indexable via GIN if I ever need it.

### Q16. Explain your indexing strategy. How did you decide what to index?

**Answer:**
I indexed to match access patterns, not defensively:
- Every table's dominant query is "all X for this user" → `@@index([userId])`
  everywhere.
- Compound indexes where the real query is narrower:
  `[userId, courseExternalId]` on LessonProgress (progress for one course),
  `[userId, dueAt]` on SRSItem (due reviews), `[userId, readAt]` on
  Notification (unread), `[userId, refKey]` on Note.
- Unique constraints double as indexes and enforce idempotency:
  `[userId, problemId]`, `[userId, topic]`, `[userId, lessonExternalId]`.

Cost side: every index slows writes and takes space, so I didn't index columns
I never filter on. If a query got slow I'd confirm with `EXPLAIN ANALYZE`
before adding anything.

### Q17. Honest question: how much of this schema does your live code actually use?

**Answer (be honest — they may have read the code):**
Right now, mostly the `User` table. The learning progress currently lives in
**localStorage** on the client (a `useLearningProgress` store feeds the
Readiness Score), which was a deliberate v2 simplification: it made the app
feel instant and cut server cost to near-zero while I validated the product.
The schema encodes where the product is going — server-synced progress is the
next roadmap milestone (and the sync is easy because every progress table
already has the right unique keys for upserts). The tradeoff I accepted:
progress is device-local and lost on cache clear. I'd rather admit that
tradeoff than pretend the DB does more than it does — and I know exactly how
to close the gap.

### Q18. You migrated MySQL → Postgres. What actually changes?

**Answer:**
Practically for this app: JSON columns become native `jsonb` (binary,
indexable — better than MySQL's JSON), array types like `targetRoles
String[]` become real Postgres arrays instead of a join table or CSV hack,
and I moved to Supabase's pooled connections (PgBouncer) which matters on
serverless — each Vercel invocation can't afford its own direct connection.
Prisma abstracted most of the SQL differences; the migration history is
archived in `migrations.mysql-archive/` and the Postgres baseline lives in
`migrations.reference.sql`.

### Q19. What is a transaction and where would you need one here?

**Answer:**
A transaction makes a group of statements atomic — all commit or all roll
back. Concrete future need in my app: issuing a certificate. That's two
writes — create the `Certificate` row and mark the final quiz
`LessonProgress` complete. If the second fails after the first commits, a user
holds a certificate for an unfinished course. In Prisma:
`prisma.$transaction([...])` or the interactive form for read-then-write
logic. Today my only concurrent-write hotspot is the user find-or-create, and
I handle that with the unique constraint + P2002 catch — the DB constraint is
itself the atomicity guarantee there.

---

## Phase 5 — API & Backend

### Q20. Describe your API surface and middleware chain.

**Answer:**
Middleware order in `server/app.js` (order is load-bearing):
`compression` → security headers → CORS → `express.json({limit:"1mb"})` →
request logging (morgan, dev) → rate limiter → `validateRequestBody` → routes
→ error handler.

Live endpoints: `/api/health`, `/api/db/health` (public);
`/api/auth/me` GET/PATCH, `/api/auth/profile` PUT (JWT-protected);
`/api/auth/validate-email`, `/api/auth/fallback-signin` (public, pre-auth);
`/api/tutor/explain` and `/api/tutor/rexplain` (the Groq-backed tutor).
Retired v1 surfaces (`/api/courses`, `/api/roadmaps`, `/api/quiz`,
`/api/feedback`, generic `/api/db/*` CRUD) return **410 Gone** — 410 rather
than 404 signals "existed, intentionally removed" to old clients and caches.

### Q21. Explain your rate limiting. What's its weakness?

**Answer:**
Hand-rolled in-memory limiter: a `Map` keyed by IP+path, 60 requests/minute,
returns 429 with `Retry-After`. Two weaknesses I'll name before you do:
(1) it's **per-instance** — on Vercel serverless each invocation may be a
fresh instance, so the map is empty and the limit is largely decorative in
prod; (2) the map grows unboundedly without eviction. The correct fix is
external shared state — **Upstash Redis** with a sliding-window or
token-bucket script — or Vercel's WAF rate rules. I kept the in-memory one as
defense-in-depth for the standalone deploy where it does work.

### Q22. Explain your error handling strategy.

**Answer:**
A single terminal error handler in `app.js`: logs structured context (path,
method, authId, error code, truncated stack) to the console (which Vercel
captures), and splits by intent — deliberate 4xx errors keep their messages;
anything 5xx returns a generic "Internal error" in production so internals
(stack traces, Prisma errors, table names) never leak to clients. Async route
handlers catch and forward to `next(err)`. On the client, the auth layer
specifically does **not** log a user out on a transient `/me` failure — the
token stands, they can retry — because a network blip shouldn't destroy a
session.

### Q23. Explain CORS as configured in your app.

**Answer:**
CORS is the browser relaxing the same-origin policy based on server headers.
Mine (`server/cors.js`): an allow-list from `CLIENT_ORIGIN`, plus a localhost
regex for dev, `credentials: false` (I use bearer tokens, not cookies, so no
credentialed requests needed — which also sidesteps most CSRF risk). Key
subtlety: in production on Vercel the SPA and API share one origin, so CORS
never even triggers — it only matters for the standalone/Render deploy. I'll
also flag my own smell: `render.yaml` sets `CORS_ALLOW_ALL=1`, which loosens
that deploy — acceptable for a demo target, not for the primary one.

### Q24. Why is CSRF not a big concern for your API?

**Answer:**
CSRF exploits the browser auto-attaching credentials (cookies) to cross-site
requests. My API authenticates via an `Authorization: Bearer` header that the
client attaches explicitly in JS — a cross-site form or image tag can't set
that header. Combined with `credentials: false` in CORS, the classic CSRF
vector doesn't apply. If I moved tokens into httpOnly cookies (the XSS-hardened
option), I'd inherit CSRF and need SameSite=Lax/Strict plus a token check —
that's the seesaw between the two attack classes.

### Q25. Explain the AI tutor endpoint end-to-end.

**Answer:**
From `DsaProblem.tsx`, "Ask tutor" POSTs to `/api/tutor/explain` with the
problem context and the student's question. Server-side (`routes/tutor.js` +
`prompts/tutorExplain.js`): the prompt instructs a **Socratic** style — guide,
don't hand over the answer — adapted to the user's learning style
(visual / code-first / analogy / step-by-step). It calls Groq
(`openai/gpt-oss-120b`) via `generateJSON()` in strict JSON mode
(`response_format: json_object`), validates the shape (`{reply,
suggestedFollowups[]}`) and returns 422 on malformed output, with one retry at
temperature 0.3 on parse failure. If `GROQ_API_KEY` isn't configured the route
returns 503 — the feature degrades, the app doesn't crash. Known gap I'd fix
first: the tutor routes lack `requireAuth`, so anonymous callers can burn my
Groq quota — auth + per-user quota is the fix.

### Q26. Why JSON mode instead of streaming for the LLM?

**Answer:**
Because I need **validated structure**, not prose. The client renders
`reply` + clickable `suggestedFollowups` — streaming free-text would mean
parsing a partial JSON stream and losing shape validation. The cost is
perceived latency (nothing renders until the full response). The upgrade path:
stream the `reply` field as tokens for perceived speed and send followups in a
trailing structured frame — more plumbing, better UX; not worth it at current
usage.

---

## Phase 6 — Frontend

### Q27. Explain your code-splitting and bundle strategy.

**Answer:**
Two layers. **Route-level:** everything except the Landing page — 40 routes —
is `React.lazy` + `Suspense`, so first paint ships only the landing bundle.
**Vendor-level:** manual chunks in `vite.config.ts` isolate heavy libraries —
`vendor-mermaid`, `vendor-pdf` (jsPDF + html2canvas), `vendor-markdown`,
`vendor-react` — so a user who never generates a certificate PDF never
downloads jsPDF, and a change to my app code doesn't invalidate the cached
React chunk (they hash independently). Assets get immutable long-cache headers
in `vercel.json`.

### Q28. Explain memoization in React and where you use it.

**Answer:**
Memoization caches a computation against its dependencies. Three tools:
`useMemo` (cache a value), `useCallback` (cache a function identity),
`React.memo` (skip re-render on equal props). Concrete use in `useAuth.tsx`:
the context `value` is `useMemo`'d — without it, every provider render creates
a fresh object and **every consumer of the context re-renders**, which for an
auth context means the whole app. The callbacks (`login`, `logout`, `refetch`)
are `useCallback`'d so the memoized value doesn't churn. I also use refs
deliberately: `userRef` lets the long-lived auth subscription read fresh state
without being torn down and re-subscribed on each change. Anti-pattern I
avoid: memoizing everything by reflex — each memo has bookkeeping cost and
only pays off when the child render or recomputation is expensive.

### Q29. Explain closures — you rely on one in useAuth.

**Answer:**
A closure is a function retaining access to its defining scope after that
scope has exited. The load-bearing one in my code: the `onAuthStateChange`
callback closes over `userRef` and `loadUser`. That's exactly why `userRef` is
a **ref** and not state — if the callback closed over a `user` state variable,
it would capture a **stale** value from the render it was created in (the
classic stale-closure bug), and re-subscribing on every user change would
churn the Supabase listener. The ref is a stable box; the closure captures the
box, and reads `.current` fresh at call time.

### Q30. Explain the event loop, and where it bit you or you leaned on it.

**Answer:**
JS is single-threaded with an event loop: the call stack runs to completion,
then the loop drains the **microtask queue** (promise callbacks) fully before
taking the next **macrotask** (setTimeout, I/O). Two places it matters in my
code: (1) the in-flight dedup in `loadUser` works because promise `.then`
chains are microtasks — every caller during the in-flight window gets the same
promise, and `inflightRef` is cleared in `finally` before any new macrotask
can start a duplicate; (2) `AuthCallback.tsx` races Supabase's session
processing against a 6-second `setTimeout` fallback — a macrotask — with a
latch so only one side wins. On the server, the same single thread means a
slow synchronous loop blocks every request — one reason heavy work (LLM calls)
is all awaited I/O, never CPU crunching.

### Q31. Why no Redux / Zustand / React Query?

**Answer:**
I ask "what state do I actually have?" Server-cache state is basically one
object — the authed user — which lives in one context with dedup; React
Query's cache/invalidation machinery for one endpoint is overkill. Global
client state is auth plus per-feature progress, which is feature-local
localStorage hooks — no cross-cutting store needed. Redux earns its complexity
when many distant components mutate shared state; my mutations are local.
The honest inflection point: when server-synced progress lands, `/api/progress`
becomes real server state with caching, optimistic updates, and invalidation —
and **that's** the day React Query enters the codebase, not before.

### Q32. Explain accessibility in your app.

**Answer:**
Concrete measures: semantic landmarks and heading hierarchy; a **skip-link**
to main content for keyboard users; ARIA labels on icon-only buttons; full
keyboard navigability (focus styles not suppressed); form inputs with real
`<label>`s; and a type scale tuned for long reading sessions with sufficient
contrast. Route changes in an SPA need focus management — moving focus to the
new page's heading — which is a known gap I'd tackle with a focus-reset on
route transition. Testing: keyboard-only walkthrough and Lighthouse/axe passes,
not just visual checks.

### Q33. Explain how Vite differs from Webpack.

**Answer:**
Dev: Webpack bundles everything up front; Vite serves source as **native ES
modules**, transforming on demand with esbuild, so cold start is near-instant
regardless of app size and HMR stays fast. Prod: Vite uses Rollup under the
hood — my manual vendor chunks are Rollup `manualChunks` config. Vite also
gives typed env handling (`import.meta.env.VITE_*` — only prefixed vars reach
the client, which is a security feature) and compile-time defines — I inject
`__API_URL__` that way.

---

## Phase 7 — Security

### Q34. What security measures does your app have?

**Answer:**
Layered:
- **Headers** (`server/security.js`, hand-rolled helmet-equivalent): HSTS with
  1-year preload, `X-Frame-Options: DENY` (clickjacking), `nosniff`, COOP/CORP
  `same-origin`, granular Permissions-Policy, and a CSP on HTML responses.
- **Input hardening:** `express.json` capped at 1 MB; `validateRequestBody`
  recursively rejects payloads beyond depth 6 / 4000-char strings / 200-item
  arrays / 60-key objects → 413. Onboarding fields validated against
  allow-lists (`VALID_BRANCHES`, `VALID_ROLES`) — never trusted enums from the
  client.
- **Auth:** server-verified tokens on every protected route; open-redirect
  guard; `/dev-confirm` hard-disabled in prod (404, avoiding user enumeration).
- **Secrets:** service-role key lives only server-side (`supabaseAdmin.js`);
  the client sees only the anon key, which is designed to be public;
  `x-powered-by` off; `.env` gitignored with thorough `.env.example`s.
- **Email abuse defense:** a 250-line zero-dependency validator (disposable
  domains, gibberish heuristics, DNS MX check with cache) gating OTP sends.

### Q35. What are your app's real vulnerabilities right now? (They love this question.)

**Answer (candor scores points):**
1. **Unauthenticated tutor endpoints** — anonymous callers can burn Groq
   quota; the rate limiter that should catch them is per-instance and
   therefore weak on serverless. Fix: `requireAuth` + per-user quota in
   shared storage.
2. **Rate limiting is decorative in prod** (in-memory on serverless). Fix:
   Upstash Redis sliding window.
3. **CSP allows `unsafe-inline`/`unsafe-eval`** — needed by current tooling
   but it blunts XSS protection; nonce-based CSP is the fix.
4. **`CORS_ALLOW_ALL=1` on the Render deploy target.**
5. **Tokens in localStorage** — XSS-theft surface, mitigated but real.

Naming your own weaknesses with fixes beats an interviewer discovering them.

### Q36. Explain XSS and how your stack defends against it.

**Answer:**
XSS = attacker-controlled script executing in another user's page context —
stealing tokens, forging actions. Defenses in my stack: React escapes all
interpolated text by default (the big one); I never use
`dangerouslySetInnerHTML` with user input — markdown from the LLM is rendered
through react-markdown which builds a sanitized element tree rather than
injecting HTML; server-side input limits reduce stored-XSS payload room; CSP
as the last line. The residual risk is the localStorage token if any XSS
lands — which is why CSP tightening is on my list.

---

## Phase 8 — DevOps & Deployment

### Q37. Explain your production deployment.

**Answer:**
Vercel, one project: the Vite build output is served from the static edge/CDN,
and `/api/*` rewrites (in `vercel.json`) into a single serverless function —
`api/index.js`, a nine-line wrapper that imports `buildApp()` and hands
`(req, res)` to Express. `maxDuration` 60s for the LLM calls. Security headers
and immutable asset caching are declared in `vercel.json`. Database is
Supabase Postgres via **pooled connections** — critical on serverless, where
many short-lived instances would exhaust direct Postgres connections;
PgBouncer multiplexes them. CI/CD is git-driven: push to `main` → GitHub
Actions runs typecheck + vitest + prod build; Vercel builds
(`prisma generate` + `vite build`) and deploys; every PR gets a preview
deployment. Migrations run via `prisma migrate deploy` against the direct
(non-pooled) URL.

### Q38. What are the constraints of serverless, and how does your code handle them?

**Answer:**
- **No durable memory between invocations** → my in-memory rate limiter is
  ineffective there (known issue); anything stateful must live in Postgres or
  Redis.
- **Cold starts** → keep the function lean; Prisma client is a singleton
  (`server/db.js`) so warm invocations reuse the connection.
- **Connection limits** → pooled Supabase URL, as above.
- **Execution ceiling** → 60s cap sized for Groq calls.
- **No local filesystem persistence** → fine; I write nothing to disk in prod
  (the `.ports.json` handshake is dev-only, gated by `IS_PROD`).

### Q39. There's no Dockerfile in this repo. Why, and could you write one?

**Answer:**
Deliberate: Vercel builds from source and Render/Railway use buildpacks
(`render.yaml`, `railway.json`, `Procfile` are all present), so a Dockerfile
would be a third build definition to keep in sync with zero current consumer.
But yes — sketch: multi-stage build. Stage 1 `node:20-alpine`, install and
`vite build` the client; stage 2, install server production deps +
`prisma generate`; final stage copies server + `client/dist`, runs as non-root,
`EXPOSE`s the port, `CMD ["node", "server/index.js"]` — which already knows how
to serve the built client with an SPA fallback. Compose file would add a
Postgres service and wire `DATABASE_URL`.

### Q40. Explain your CI pipeline and its gaps.

**Answer:**
`.github/workflows/ci.yml` on push/PR to main: client typecheck (`tsc`),
`vitest run`, and a production build — so type errors, logic regressions in the
pure modules, and build breakage all block merge. Gaps I'd close in order:
(1) a server job — even just booting `buildApp()` and hitting `/api/health`
with supertest; (2) lint step; (3) a smoke e2e (Playwright: login → dashboard)
on preview deployments. I kept CI honest to what tests exist rather than a
green pipeline that tests nothing.

### Q41. Explain environment variable handling across your stack.

**Answer:**
Server: `DATABASE_URL`/`DIRECT_URL` (pooled vs direct — pooled for runtime,
direct for migrations), `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (the
dangerous one — server-only), `GROQ_API_KEY`, `CLIENT_ORIGIN`, `NODE_ENV`.
Client: only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — Vite only
exposes `VITE_`-prefixed vars to the bundle, so a server secret can't leak into
client code by accident. `lib/supabase.ts` throws loudly at startup if they're
missing — fail fast beats mysterious runtime nulls. `.env` files are
gitignored; `.env.example` documents every var; production values live in
Vercel's env settings, not in the repo.

---

## Phase 9 — Debugging Scenarios (how to answer)

> Format the interviewer wants: **reproduce → localize → hypothesize → verify
> → fix → prevent.** Never jump to a fix.

### Q42. "Users report they can't log in. Walk me through your debugging."

**Answer:**
1. **Scope it:** all users or some? Google OAuth, OTP, or both? New logins or
   existing sessions? Which browser/device? That partitions the fault space.
2. **Check my own telemetry:** Vercel function logs — is `/api/auth/me`
   erroring? My error handler logs path/method/authId/code, so a spike is
   visible. Check Supabase status page — if their auth service is down, it's
   an incident-communication problem, not a code problem.
3. **Trace one failing login** through the funnel: does the Supabase redirect
   return to `/auth/callback` with tokens? Does `onAuthStateChange` fire
   `SIGNED_IN`? Does `/me` return 200? Each step has an owner — Supabase
   config, callback handling, or my server.
4. **Classic culprits in this app specifically:** OAuth redirect URL not
   whitelisted in Supabase for a new domain; expired/rotated JWT secret
   (`getUser` starts failing → all `/me` 401); free-tier email rate limits
   blocking OTP sends — which is exactly why `/fallback-signin` exists.
5. **Fix + prevent:** whatever it was — add an alert on 401-rate from `/me`,
   and an e2e login smoke test on preview deploys.

### Q43. "This API suddenly returns 500."

**Answer:**
Read the logs first — my error handler prints the code and truncated stack.
Frequent suspects here: Prisma `P1001` (can't reach DB → Supabase outage or
connection-pool exhaustion on a traffic spike), a Groq timeout bubbling out of
the tutor route, or a malformed LLM response failing shape validation (that
should 422, so a 500 there means my validation missed a case). Reproduce with
the exact payload from the log, write a failing test, fix, and make the error
handler classify that failure class properly so next time it's a clean 4xx/503
with a helpful message rather than a 500.

### Q44. "You have an infinite re-render. How do you find it?"

**Answer:**
React DevTools Profiler to see *which* component loops, then look for the
usual causes: `setState` called unconditionally during render; a `useEffect`
that sets state included in its own dependency array with a fresh-identity
dependency (object/array/function recreated each render); context value
recreated every render. My codebase has the defenses baked in precisely
because of this class: the auth context value is `useMemo`'d, callbacks are
stable, and the subscription reads through a ref. Fix pattern: stabilize the
identity (`useMemo`/`useCallback`) or move the value out of the dependency
into a ref.

### Q45. "Race condition — two requests create the same user twice."

**Answer:**
That's not hypothetical here — it's the /me storm. Two concurrent `/me` calls
both `findUnique` (miss) then both `create`. My layered fix: (1) client dedup
so concurrency doesn't happen in the common case; (2) DB unique constraint on
`authId` so the race is *impossible* to corrupt data; (3) server catches
`P2002` and reads the winner's row. The principle: client-side prevention is
an optimization; the **database constraint is the only real guarantee**.
Check-then-act over a network is always a race — make the act idempotent.

### Q46. "Database timeout in production."

**Answer:**
First distinguish **connection** timeout from **query** timeout. On
serverless the classic is pool exhaustion: a traffic spike spawns N function
instances, each wanting connections. Verify in Supabase's dashboard
(connection count) — that's why I use the pooled PgBouncer URL. If it's a slow
query instead: get the query from logs, `EXPLAIN ANALYZE`, check whether it's
using the indexes (my compound indexes exist for exactly the hot paths). Fixes
in order of cheapness: index, query shape, caching layer, then read replicas
— never jump to the expensive fix first.

---

## Phase 10 — System Design (internship level)

### Q47. Design a URL shortener.

**Answer:**
- **API:** `POST /shorten {longUrl} → {code}`; `GET /:code → 301/302`.
- **Code generation:** base62-encode an auto-increment ID (or a
  Snowflake-style ID for multi-node) — 7 chars ≈ 3.5 trillion codes. Avoid
  hashing the URL alone (collisions, and same-URL-different-owner issues).
- **Storage:** one table `(code PK, long_url, owner, created_at, expires_at)`.
  Reads dominate 100:1 → cache hot codes in Redis; DB is source of truth.
- **Redirect choice:** 302 if you want click analytics on every hit; 301 lets
  browsers cache and skips your server (and your analytics) on repeats.
- **Scale-out:** stateless app servers behind a load balancer; Redis cache;
  partition by code prefix if the table gets huge; rate-limit creation.
- **Extras if asked:** custom aliases (uniqueness check), expiry (TTL sweeper
  or lazy-delete on read), abuse (malware URL blocklist).

### Q48. Design a notification system (relevant — your schema has one).

**Answer:**
My `Notification` model is already the read side: `(userId, title, body, type,
readAt)` with `@@index([userId, readAt])` for the unread-badge query. Full
design: **producers** (events like "streak about to break") publish to a
**queue** (start with Postgres LISTEN/NOTIFY or a jobs table; graduate to
SQS/RabbitMQ) so notification creation never blocks the hot path; a **worker**
consumes, applies user preferences/dedup ("max 1 nudge per day"), writes the
row, and pushes over the chosen **channel** — in-app (poll or WebSocket/SSE),
email, push. Delivery is at-least-once, so the write must be idempotent
(unique key on `(userId, event, day)`). Badge count = `WHERE readAt IS NULL`,
which my index serves.

### Q49. Design the server-synced progress feature you have on your roadmap.

**Answer (this one shows you know YOUR system):**
Goal: move progress from localStorage to the cloud without regressing the
instant feel. Design: **local-first with background sync.** Writes hit
localStorage synchronously (UI stays instant — effectively optimistic
updates), and a sync layer queues mutations to `PUT /api/progress` batches.
Server upserts against the tables that already have the right keys
(`[userId, problemId]`, `[userId, lessonExternalId]`). Conflict policy:
last-write-wins per key is fine for booleans like "solved"; for counters
(msSpent) merge by summing deltas rather than overwriting. On login on a new
device: pull server state, merge into local (union of solved sets). Offline is
free — the queue drains on reconnect. This is why the schema was built ahead
of the feature: the unique constraints make every sync write an idempotent
upsert.

---

## Phase 11 — DSA Quick Answers (internship level)

### Q50. Two Sum — approach and complexity.

**Answer:** One pass with a hashmap: for each `x`, check if `target − x` was
seen; else store `x → index`. O(n) time, O(n) space. Brute force is O(n²);
sorting + two pointers is O(n log n) but loses original indices.

### Q51. When do you use sliding window vs two pointers?

**Answer:** Sliding window = contiguous subarray/substring problems where a
window's validity changes monotonically as it grows/shrinks (longest substring
without repeats, min window containing chars): expand right, shrink left while
invalid — O(n). Two pointers = usually a sorted array or two sequences,
pointers move toward each other or in tandem (pair sum in sorted array, merge,
container with most water). Window tracks a *range's contents*; two pointers
track *positions*.

### Q52. Explain time complexity of hashmap operations — and when it degrades.

**Answer:** Average O(1) insert/lookup/delete via hashing to buckets. Degrades
to O(n) when many keys collide — adversarial inputs or a bad hash function
(Java mitigates with red-black trees in hot buckets → O(log n)). Also
amortized cost: resizing/rehashing is O(n) occasionally, O(1) amortized. If an
interviewer pushes: hashmaps trade memory and cache-locality for speed; for
small n, a sorted array + binary search can win in practice.

### Q53. BFS vs DFS — when each?

**Answer:** BFS (queue) explores level by level → shortest path in unweighted
graphs, "minimum steps" problems, level-order traversal. DFS
(stack/recursion) goes deep → cycle detection, topological sort, connected
components, backtracking/exhaustive search. Both O(V+E). Space: BFS can hold a
whole level (wide graphs hurt); DFS holds a path (deep graphs hurt, recursion
can overflow — convert to explicit stack).

---

## Phase 12 — HR Round

### Q54. Tell me about yourself.

**Answer template (60–90s):**
"I'm a [year] [branch] student who learns by shipping. My main project is
PrepNext — a placement-prep platform live on Vercel with real users' problems
in mind: React 19/TypeScript frontend, Express + Prisma + Postgres backend,
Supabase auth, and an AI tutor. Building it end-to-end taught me things
tutorials don't — I debugged a production login-storm race condition,
migrated MySQL to Postgres, and made real security tradeoffs. I'm strongest in
full-stack JavaScript and I'm looking for an internship where I can work on
production systems with engineers who'll push my standards up."

### Q55. What was your biggest technical challenge?

**Answer:**
The login storm. Symptom: slow, flaky "finishing sign-in." Root cause wasn't
one bug but an architecture flaw — auth state duplicated across six hook
instances, each independently re-fetching on every auth event, multiplying
into 8–12 concurrent `/me` calls that then raced a DB unique constraint
server-side. I fixed it at three layers (single context provider, in-flight
request dedup, P2002-safe upsert) and documented the incident in the code
itself. What it taught me: performance bugs are often architecture bugs, and
the fix that matters is the one at the layer that makes the failure
*impossible*, not just unlikely.

### Q56. Tell me about a time you made a wrong decision. (Biggest failure)

**Answer:**
V1 of this product was "AI generates everything" — courses, roadmaps, quizzes,
all LLM-generated per user. I built the whole pipeline (the prompt files are
still in the repo) and then had to admit it was wrong: generation was slow,
quality was inconsistent, and students actually wanted *curated, trustworthy*
content, not infinite generated content. I killed the feature — retired the
endpoints with proper 410s — and pivoted to hand-curated data with AI kept
only where it adds real value (the Socratic tutor). Killing three months of
work was hard; shipping the wrong thing longer would have been worse. I now
validate the content model before building the pipeline.

### Q57. Why should we hire you as an intern?

**Answer:**
Because I already operate like a junior engineer, not a student. I've shipped
and maintained a production system: real auth with real edge cases, a real
database with a migration history, a real incident I debugged from symptom to
root cause to prevention, and documented tradeoffs in code. I say "I don't
know, here's how I'd find out" instead of bluffing — you can verify that from
how I've marked known weaknesses in my own codebase. And I'm cheap to onboard:
I've already learned the lesson that reading the existing code beats rewriting
it.

### Q58. What's your biggest weakness?

**Answer (pick the honest, growable one):**
Testing discipline. My repo has good unit tests for pure logic
(`salaryMath`, `streakDates`, `progressService`) but zero server tests and no
e2e — I test-drove features manually because I was moving fast solo. I know
the cost: my login-storm bug would have been caught by one integration test.
I've started closing it (CI runs vitest on every push) and an internship with
enforced review/test culture is exactly the environment that fixes this
habit permanently.

---

## Rapid-fire: one-liners you must not fumble

| Question | One-liner |
|---|---|
| JWT structure? | header.payload.signature, base64url; signature proves integrity, payload is readable — never put secrets in it. |
| Access vs refresh token? | Short-lived access token for requests; long-lived refresh token exchanges for new access tokens — Supabase rotates mine hourly via `autoRefreshToken`. |
| 401 vs 403? | 401 = not authenticated (no/bad token); 403 = authenticated but not allowed. |
| PUT vs PATCH? | PUT replaces the resource (idempotent by definition); PATCH partially updates. My profile save is PUT; prefs update is PATCH. |
| Index tradeoff? | Faster reads, slower writes, more storage — index the queries you actually run. |
| SQL vs NoSQL? | Relations + integrity + ad-hoc queries → SQL; flexible schema + horizontal write scale → NoSQL. My data is relational (user→progress→content). |
| Optimistic update? | Update UI immediately, sync in background, roll back on failure — my localStorage-first progress is effectively this. |
| SSR vs CSR? | SSR renders HTML on server (faster first paint, SEO); CSR renders in browser (richer app-feel after load). PrepNext is CSR; landing page SEO would be the reason to add SSR. |
| Debounce vs throttle? | Debounce fires after quiet period (search input); throttle fires at most once per interval (scroll handler). |
| Cookie vs localStorage for tokens? | httpOnly cookie: XSS-safe, CSRF-exposed. localStorage: CSRF-safe, XSS-exposed. Pick your defenses accordingly. |
| What's a cold start? | First invocation of a fresh serverless instance — pay init cost (require, DB client). Mitigate: small bundles, singletons, warm-up. |
| 410 vs 404? | 404 = not found (maybe never existed); 410 = existed, intentionally gone — I use it for retired v1 endpoints. |

---

## How to use this file

1. **Don't memorize — rehearse.** Read a question, answer out loud from
   memory, then compare. The structure (decision → reason → tradeoff →
   what-I'd-do-next) matters more than exact words.
2. **Every answer has a follow-up.** For each answer here, ask yourself "and
   what if the interviewer pushes one level deeper?" — the file gives you the
   first level; the code gives you the second. Re-read the actual files cited.
3. **Own the weaknesses first.** The strongest moments in an interview are
   Q17, Q35, Q56, Q58 — where you name the flaw before they do, with a fix.
