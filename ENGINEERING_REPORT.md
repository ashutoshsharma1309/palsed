# SR_ENGINEER REPORT

> **Audit note (June 2026):** The `index.html` `<title>` / OG / Twitter "Adaptive AI Learning Universe" identity mismatch flagged in this report has since been **resolved** — the document head now ships the PrepNext placement-prep positioning. Treat references to that specific mismatch below as historical; other findings may still be open.

## 1. Executive Summary

- **The product is a localStorage demo wearing a Postgres costume.** Applications kanban (`useApplications.ts`), PYQ vault (`usePYQs.ts`), SRS queue (`useSRS.ts`), Mastery (`useMastery.ts`), and Placement Hub progress (`usePlacementProgress.ts`) all persist exclusively to `localStorage` despite full Prisma models (`Application`-equivalent `DsaProblemStatus`, `MasteryEntry`, `SRSItem`, etc.) sitting unused in `server/prisma/schema.prisma`. A user clearing their browser loses everything; switching devices is impossible.
- **`/api/db/*` is an unauthenticated, schema-introspecting CRUD god-mode endpoint.** `server/routes/db/index.js` mounts a generic `crudRouter` for 18 Prisma delegates (`users`, `certificates`, `notifications`, `dsa-attempts`, …) with zero `requireAuth` and zero row-level scoping. Anyone with `curl` can `GET /api/db/users`, `PATCH /api/db/users/:id`, or wipe certificates. This is a P0 breach surface, not a hackathon shortcut.
- **Schema, routes, and bundle still carry the v1 AI-tutor carcass.** Nine routes (`Courses.tsx`, `CourseDetail.tsx`, `CourseLesson.tsx`, `CourseQuiz.tsx`, `CourseCreate.tsx`, `Roadmaps.tsx`, `RoadmapCreate.tsx`, `RoadmapDetail.tsx`, `Tutor.tsx`) ship in the lazy bundle even though `App.tsx` `Navigate`s away from them. Eight Prisma models (`Course`, `Chapter`, `Lesson`, `LessonProgress`, `Roadmap`, `TutorThread`, `TutorMessage`, `Certificate` quiz-bound) still cascade off `User`. The 410-Gone routers in `app.js` are honest about the pivot; the codebase isn't.
- **The API client (`lib/api.ts`) is brittle, unauthenticated by default, and tied to a dev port-discovery dance.** `apiGet/apiPost` never attach the Supabase JWT — every authenticated call is hand-rolled with `fetch(... { headers: { Authorization } })` in components, and the `/runtime-config.json` refresh is meaningless on Vercel where the API is at the same origin. There is no shared `apiFetch` with retry, no typed error class beyond `err.detail`, and no request cancellation.
- **Auth is technically OK but operationally fragile.** `verifySupabaseToken` round-trips Supabase Admin on **every** request (~50–100ms self-confessed in the file header), with no JWT cache. The 60 req/min in-memory rate limiter in `app.js` is per-instance and resets on every Vercel cold start — effectively decorative. Dual JWT/Supabase auth state lingers (`passwordHash` nullable, `routes/auth.js` legacy 410s).

## 2. Current State

PrepNext is in the dangerous middle-state where a hackathon prototype has been re-positioned ("Placement Season OS"), the UI was rewritten to match, but the **persistence and infrastructure layers were never migrated**. The Landing page promises a kanban applications tracker, a PYQ vault, and a mastery radar — and all three exist as functional UIs. None of them write to the database.

Concretely:

- `server/prisma/schema.prisma` has 22 models. The client code paths actually exercise maybe 4: `User`, `DsaProblemStatus`, `DsaBookmark`, `DsaAttempt` (via `routes/Dsa.tsx` / `DsaProblem.tsx`). Everything else is either dead (Courses/Roadmaps/Tutor) or unused-by-client (`MasteryEntry`, `SRSItem`, `EngagementDay`, `Note`, `Notification`, `Certificate`).
- The "Applications kanban" — arguably the killer feature versus Unstop/PrepInsta — lives at `client/src/hooks/useApplications.ts:8` storing to `localStorage.prepnext.applications.v1`. There is no `Application` Prisma model at all. So even if you wired the existing `/api/db` layer in, you'd be writing application data into… nothing.
- The codebase is small (~5,200 LOC of routes, ~440 LOC of server route handlers) which is good — refactoring is feasible. But the file layout still telegraphs the pivot's incompleteness: `routes/Tutor.tsx` is 162 lines of dead code lazy-loaded into the bundle, `data/dsa-solutions.ts` is 210 lines of hand-written solutions in the client bundle, and `data/companies.ts` is **1,854 lines** of recruiter data shipped as JS to every visitor.
- Build/deploy plumbing has multiple cooks: `Procfile`, `railway.json`, `render.yaml`, `vercel.json`, an `/api` directory for Vercel serverless, AND a standalone `server/index.js`. Three of these target dead deploy targets. The `.ports.json` + `runtime-config.json` dance is local-dev ergonomics leaking into production code (`client/src/lib/api.ts:11`).
- 18 real signups, no paid users, no domain — engineering bar should be "ship the database write, then SEO, then paywall" not "refactor the design system."

This is not a system in disrepair. It's a system that **chose the wrong abstractions early** (localStorage hooks for the moat features) and then layered a real product on top of them. The cost to fix is currently a weekend; in three months it will be two weeks.

## 3. Critical Issues

| # | Issue | Impact | Effort | Priority |
|---|-------|--------|--------|----------|
| 1 | `/api/db/*` is unauthenticated and ungated — anyone can read/modify any user row | **CRITICAL** — data breach + GDPR-style exposure even with 18 users | 1 day | P0 |
| 2 | Applications, PYQs, SRS, Mastery, Placement-Hub all persist to `localStorage` only — no cross-device, no recovery, no analytics surface | Product is fundamentally undemoable beyond a single browser; blocks every paid-tier story | 4–6 days | P0 |
| 3 | No `Application` Prisma model exists despite Applications being the headline feature | Blocks issue #2 fix until schema added + migrated | 0.5 day | P0 |
| 4 | Dead routes (`Courses*.tsx`, `Roadmaps*.tsx`, `Tutor.tsx`, `RoadmapDetail.tsx`) and dead Prisma models (`Course`, `Chapter`, `Lesson`, `LessonProgress`, `Roadmap`, `TutorThread`, `TutorMessage`) ship in bundle + DB | Bundle bloat, schema drift, contributor confusion, larger attack surface | 1 day | P1 |
| 5 | `verifySupabaseToken` (`server/auth.js:26`) hits Supabase Admin on **every** request; no JWT cache | ~50–100ms latency tax on every API call; Supabase rate-limit risk at scale | 0.5 day | P1 |
| 6 | `lib/api.ts` doesn't attach Authorization headers; auth fetches scattered across components | Code duplication; easy to forget auth on a new route; no central error handling | 1 day | P1 |
| 7 | In-memory rate limiter in `app.js` resets per cold start on Vercel | Effectively no rate limit in serverless prod; OTP-send endpoint abusable | 0.5 day | P1 |
| 8 | `data/companies.ts` (1,854 LOC), `dsa-problems.ts` (242), `dsa-solutions.ts` (210), `pyqs-seed.ts` (272), `internship-boards.ts` (245) shipped to every browser as JS | First-paint payload includes content that should be DB-backed + paginated; kills mobile LCP on 4G | 3 days | P1 |
| 9 | SPA with no SSR/prerender; per-route metas, canonical URL, JSON-LD all absent | SEO is broken — competitors (GfG, InterviewBit) own every query already; no Google surface | 2–4 days | P1 |
| 10 | Legacy custom JWT auth (`passwordHash` nullable on `User`) and 410'd `/api/auth/signup` routes still coexist with Supabase | Confuses contributors; one nullable column lurking; deprecation never finished | 0.5 day | P2 |
| 11 | `apiGet`/`apiPost` don't share auth/error handling with the hand-rolled `fetch` calls in `lib/auth.ts` | Two parallel HTTP styles; inconsistent error surfaces | 0.5 day | P2 |
| 12 | `routes/db/index.js` URL-segment `srs: "sRSItem"` reveals Prisma's camel-casing — also no pagination beyond a 500 hard cap | Information disclosure; large-table OOM risk | 0.25 day | P2 |
| 13 | `data/companies.ts` and `pyqs-seed.ts` have no admin/CMS path — every content update requires a deploy | Throttles content velocity; non-engineers can't contribute | 3 days | P2 |
| 14 | `Procfile`, `railway.json`, `render.yaml` are deploy-target debris alongside `vercel.json` + `api/` | Confuses CI, lies in onboarding | 0.1 day | P3 |
| 15 | No tests anywhere — no `vitest`/`jest` config, no `__tests__` directory observed | Every refactor is a coin flip; SRS algorithm and mastery EWMA are math-correctness landmines | 5+ days | P2 (incremental) |

## 4. Recommendations

### Fix #1 immediately — gate `/api/db`

`server/routes/db/index.js` mounts `crudRouter(delegate)` for every model without auth. Two options, in order of preference:

1. **Delete it.** It exists because the v1 "AI generates full course" flow needed deep nested writes. Today the only legitimate caller is the dead `/courses/full` endpoint at line 47. Move the 4 tables clients actually need (`DsaProblemStatus`, `DsaBookmark`, `DsaAttempt`, plus the new `Application`/`PYQ` models below) to **purpose-built routes** that scope every query by `req.auth.id`. The factory pattern in `crud.js` is a security antipattern when the model has a `userId` column.
2. **If you must keep it**, add `router.use(requireAuth)` at the top of `server/routes/db/index.js` and inject `{ where: { userId: req.auth.id } }` into every `findMany`/`findUnique`/`update`/`delete` in `crud.js`. This requires per-delegate config because not all models are user-scoped.

### Migrate Applications to Postgres (the moat-feature fix)

1. Add to `schema.prisma`:
   ```prisma
   model Application {
     id          String   @id @default(cuid())
     userId      String
     companySlug String
     role        String
     status      String   // wishlist|oa|tech|hr|offer|rejected
     notes       String?
     timeline    Json     // { status, at, text }[]
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
     user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
     @@index([userId, status])
   }
   ```
2. Create `server/routes/applications.js` with `GET /`, `POST /`, `PATCH /:id`, `DELETE /:id`, all behind `requireAuth`, all scoping by `req.auth.id`.
3. Rewrite `hooks/useApplications.ts` to fetch on mount and write-through to the API. Keep `localStorage` as a **cache**, not the source of truth — use stale-while-revalidate so the kanban stays snappy.
4. Add a one-time migration on `/dashboard` mount: if `localStorage.prepnext.applications.v1` exists, POST it to the new endpoint and clear it. The 18 existing users won't lose their hand-entered rows.

Repeat for `usePYQs` (add `PYQSubmission` model — currently `routes/PyqSubmit.tsx` collects crowd-sourced PYQs that vanish on browser clear), `useSRS` (the `SRSItem` model **already exists** — just wire it), `useMastery` (`MasteryEntry` already exists), `usePlacementProgress` (add a simple `PlacementBookmark`/`PlacementCompletion` model or reuse `Note`).

### Centralize the API client

Replace `lib/api.ts` with a single `apiFetch<T>(path, opts)` that:

- Pulls the current Supabase access token via `supabase.auth.getSession()` and attaches `Authorization: Bearer …`.
- Refreshes on 401 once via `supabase.auth.refreshSession()`, retries, then bubbles up.
- Throws a typed `ApiError extends Error` with `.status`, `.detail`, `.code` — the current "throw `new Error(`HTTP ${r.status}`)`" in `apiGet` loses the JSON body entirely.
- Deletes the `runtime-config.json` dance on production builds (gate it behind `import.meta.env.DEV`). On Vercel the API is same-origin; the runtime config is overhead and an open redirect-shaped target.
- Then refactor `lib/auth.ts` to use it. Right now `lib/auth.ts:49,67,137,202` each hand-roll a `fetch(`${base}/api/auth/...`)` with different error handling.

### Cache Supabase JWT verification

`server/auth.js:26-35` documents that it round-trips Supabase Admin for every request "because ES256 + JWKS rotation." Fine — but **cache the verified user keyed by token, with TTL = `min(60s, exp - now)`** in a module-scope `Map`. On Vercel each lambda instance handles dozens of requests before recycling; you'll cut p50 by ~70ms with 30 lines of code. Cap the map at 1,000 entries with LRU.

### Delete the AI carcass

Stop lazy-loading dead routes from `App.tsx:17-39`. Remove `Courses.tsx`, `CourseDetail.tsx`, `CourseLesson.tsx`, `CourseQuiz.tsx`, `CourseCreate.tsx`, `Roadmaps.tsx`, `RoadmapCreate.tsx`, `RoadmapDetail.tsx`, `Tutor.tsx`. Remove the `Navigate` redirects too — anyone hitting `/courses` in 2026 is a bot. Then write a Prisma migration that drops `Course`, `Chapter`, `Lesson`, `LessonProgress`, `Roadmap`, `TutorThread`, `TutorMessage`. Keep `Certificate` (PYQ vault uses verifyCode) but unbind it from `courseExternalId`. Same pass: delete `server/routes/courses.js`, `roadmaps.js`, `tutor.js`, `quiz.js`, `feedback.js`, the `aiGoneRouter` block in `app.js`, the `groq.js` file, and `groq-sdk` from `server/package.json`.

### Lift heavy content out of the bundle

`data/companies.ts` at 1,854 LOC is the single largest blob in the client. Move it into a `Company` Prisma model + seed script + `/api/companies` endpoint with pagination and a server-side `where: { tier: ... }` filter. Cache the list on the client with a `Cache-Control: public, s-maxage=3600` so Vercel's edge serves it. Same treatment for `internship-boards.ts` (245 LOC, low-churn) and `pyqs-seed.ts` (272 LOC, should be crowd-sourced anyway).

Once content is server-side, **add an admin route** behind a `role: "admin"` boolean on `User` so you can add a new company without a deploy. This is the precondition for content velocity matching Unstop/PrepInsta.

### Fix the rate limiter

The `rate.Map` in `app.js:38-50` is per-instance memory. On Vercel each cold start gets a fresh empty map. Move to either (a) Upstash Redis with `@upstash/ratelimit` (15-min setup, fits free tier), or (b) Supabase Postgres-based with a `RateLimit` table and a per-IP+endpoint hash. Apply tighter limits to `/api/auth/dev-confirm` and `/api/auth/validate-email` specifically — those are the abuse vectors.

### SEO foundation

This is in CONTENT_STRATEGIST / GROWTH territory but engineering blocks it. Two engineering deliverables:

1. **Per-route metadata** via `react-helmet-async` (or migrate to Next.js — see below). Right now every route inherits the SPA `<head>` from `index.html`, which still pitches "Adaptive AI Learning Universe" — contradicts the Landing page copy entirely.
2. **Prerender 100 high-intent pages**: 50 `/companies/:slug` + 30 `/dsa/:slug` + 20 `/pyq?company=X`. Vite + `vite-plugin-ssg` or migrate to Next.js App Router. Static HTML for these pages buys you the same Google surface as InterviewBit's company hubs.

Honest take: **migrate the client to Next.js 15**. The stack is already Vercel + React 19 + TypeScript; the migration is ~3 days for this size of codebase and unlocks SSR/ISR for SEO + per-route metadata + the App Router's parallel data loading. The current Vite + `/api` Express hybrid is the worst of both worlds.

## 5. 30-Day Priorities

1. **P0 — Lock down `/api/db`.** Either delete the generic router or gate it with `requireAuth` + per-row `userId` scoping. *Deliverable*: `server/routes/db/*` either gone or audited; PR includes a `curl` reproduction of the current breach and the patched 401.
2. **P0 — Migrate Applications kanban to Postgres.** Add `Application` model, `/api/applications` routes with auth + scoping, rewrite `useApplications.ts` with SWR-style cache, ship localStorage→DB one-time migration. *Deliverable*: A user can switch from Chrome to Safari and see their applications.
3. **P0 — Wire SRS + Mastery to existing Prisma models.** `SRSItem` and `MasteryEntry` are already in the schema. Build `/api/srs` and `/api/mastery` routes, refactor `useSRS.ts` and `useMastery.ts`. *Deliverable*: Review queue survives browser clear.
4. **P1 — Delete the AI carcass.** Remove 9 dead routes from `App.tsx`, drop 7 Prisma models in a single migration, remove `groq-sdk`, delete `server/routes/{courses,roadmaps,tutor,quiz,feedback}.js` and the `aiGoneRouter`. *Deliverable*: `git rm` PR, bundle-size delta posted, schema diff in the PR body.
5. **P1 — Centralize API client + cache JWT verification.** New `lib/apiFetch.ts` attaches auth, retries on 401, throws typed errors. Server-side `verifySupabaseToken` cache. *Deliverable*: All `fetch(`${base}/api/...`)` call sites in `lib/auth.ts` and the route components migrated; p50 API latency measured before/after.
6. **P1 — Replace the in-memory rate limiter** with Upstash Redis. Tighter limits on `dev-confirm` and `validate-email`. *Deliverable*: A `wrk` run showing 429s at the configured threshold across cold starts.
7. **P1 — Per-route `<title>` and `<meta description>`** via `react-helmet-async`. At minimum: Landing, `/companies/:slug`, `/dsa/:slug`, `/pyq`. Fix the contradictory "Adaptive AI" copy in `index.html`. *Deliverable*: View-source on 4 routes shows distinct, intent-matched metadata.

## 6. 90-Day Priorities

1. **Migrate to Next.js 15 App Router** with same Vercel deploy. Keep Express routes as Route Handlers (`app/api/.../route.ts`) or fold them into Server Actions. *Deliverable*: SSR'd `/companies/:slug` pages indexable; LCP < 1.5s on 4G.
2. **Ship a `Company` admin CMS.** Add `role: "admin"` to `User`, build `/admin/companies` UI, migrate `data/companies.ts` to DB seed. *Deliverable*: A non-engineer can add a new company without a deploy.
3. **Crowdsourced PYQ pipeline.** Add `PYQSubmission` model with `status: pending|verified|rejected`, vote table, moderation queue at `/admin/pyq`. Hook into `PyqSubmit.tsx` which currently writes to localStorage. *Deliverable*: 200+ verified PYQs in DB; submission → verify cycle < 24h.
4. **Test harness.** Add Vitest. Cover the SRS algorithm (`lib/srs.ts`), mastery EWMA (`lib/mastery.ts`), and auth middleware (`server/auth.js`'s find-or-create race path — the comment at line 67 admits this is concurrency-sensitive but there's no test). *Deliverable*: 60%+ line coverage on `lib/` + `server/`.
5. **Finish the auth deprecation.** Drop `passwordHash` from `User`, delete the 410'd `/api/auth/signup` and `/api/auth/login` stubs in `routes/auth.js`, remove `bcryptjs` + `jsonwebtoken` from `server/package.json`. *Deliverable*: Schema migration + dep removal in a single PR.
6. **Observability.** Stand up Sentry (client + server) and a structured logger (pino) replacing the `console.error` block in `app.js:68-77`. Wire `req.auth.authId` into all logs for user-correlated debugging. *Deliverable*: First production error surfaces in Sentry within a week of merge.
7. **Custom domain + SEO foundation.** prep-next.com or similar, root domain on Vercel, sitemap.xml generated from `Company` + `DsaProblem` + `PYQ` tables, robots.txt, `Organization` + `WebSite` + `FAQPage` JSON-LD on Landing. *Deliverable*: Google Search Console verified, 50+ pages indexed.

## 7. Metrics to Track

| KPI | Current | 30-day target | 90-day target |
|---|---|---|---|
| API p50 latency (`/api/auth/me`) | unmeasured, ~120ms est. | < 60ms (JWT cache) | < 40ms |
| API p95 latency (any auth route) | unmeasured | < 250ms | < 150ms |
| Cold-start time (Vercel function) | unmeasured | < 800ms | < 500ms |
| Client bundle size (initial JS, gzipped) | unmeasured, estimate ~300KB+ from companies.ts alone | < 180KB | < 120KB |
| Largest Contentful Paint (Landing, mobile 4G) | unmeasured | < 2.5s | < 1.5s |
| Lighthouse SEO score | likely 60–75 (no canonical, no per-route meta) | 90+ | 95+ |
| Indexed pages in Google | 1 (root) | 5 (Landing + auth + verify) | 100+ (company hubs + DSA + PYQ) |
| Unauthenticated endpoints exposing user data | 18 (`/api/db/*`) | **0** | 0 |
| Routes persisting via localStorage only | 5 (Applications, PYQ, SRS, Mastery, PlacementHub) | **0** | 0 |
| Test coverage (lib/ + server/) | 0% | 30% | 60% |
| Dead routes in bundle | 9 | 0 | 0 |
| Dead Prisma models | 7 | 0 | 0 |
| Active users with cross-device sessions | likely 0 / 18 | > 50% of MAU | > 80% of MAU |
| Time to add a new company (no code) | impossible (deploy required) | impossible | < 2 minutes via CMS |
| Sentry error rate (errors / 1000 requests) | no tracking | < 5 | < 1 |
| Auth verification cache hit rate (server-side) | n/a | > 80% | > 95% |
