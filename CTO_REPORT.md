# CTO REPORT

## 1. Executive Summary

- **The product identity is fractured at the HTML level.** `index.html` still ships an "Adaptive AI Learning Universe" `<title>`, OG, and Twitter card while the Landing page markets a "zero-AI-runtime Placement Season OS" — every Google result, every WhatsApp unfurl, and every LinkedIn share currently sells a product that no longer exists. This is the cheapest, highest-leverage fix in the entire codebase and it costs ~30 minutes.
- **Auth is a dual-stack time bomb.** `routes/auth.js` (legacy bcrypt + JWT), `passwordHash` nullable on `User`, and the new Supabase Auth flow are coexisting with no deprecation path. At ~18 users this is harmless; at 10k it becomes the single biggest source of "I can't log in" support tickets and a real security audit failure (two parallel session-issuing systems, one of which you don't actively maintain).
- **Vercel + Supabase Postgres will break before 10k DAU — but not where you think.** The first wall is not request volume; it's Prisma cold-start connection storms on serverless functions hitting Supabase's Supavisor pooler. The `EngagementDay` per-day-active-ms writes + `DsaAttempt` inserts on every code run will exhaust pooled connections long before the read endpoints do.
- **SPA-only rendering is a growth ceiling, not a technical bug.** Indian placement-prep search intent ("DSA sheet TCS", "Goldman Sachs OA questions 2024", "Wipro NLTH PYQ") is *exactly* the long-tail SEO that Unstop, PrepInsta, and GFG own. Without per-route SSR/prerender for `/companies/:slug`, `/dsa/:slug`, and PYQ pages, you cannot compete on organic — and organic is the only viable CAC channel for a free-tier student product.
- **Technical debt is concentrated, not diffuse.** Roughly 8 dead route files (Courses, Roadmaps, Tutor, CourseLesson, etc.) plus 4 stale Prisma models (`Course`, `Chapter`, `Lesson`, `Roadmap`, `TutorThread`, `TutorMessage`) account for the majority of bundle bloat and schema drift. One focused 2-day pruning sprint clears it.

## 2. Current State

PrepNxt is a well-scoped hackathon build that has cleanly identified a real wedge — Indian campus placement-season workflow vs. generic interview prep — but the codebase still carries the skin of its previous identity ("adaptive AI learning") in three places that matter: the HTML head, the Prisma schema (`Course`/`Lesson`/`Roadmap`/`Tutor*` models), and the `/courses`, `/roadmaps`, `/tutor` route stubs in `App.tsx`. The pivot has happened in the marketing copy on Landing but not in the artifacts crawlers, contributors, and the database see.

The architecture itself is sound for the current stage. Vite + React 19 + TS, Express ESM, Prisma 7 on Supabase Postgres, deployed to Vercel — this is a defensible 2026 stack and there is no need to rewrite anything. The dev ergonomics (random-port server writing `.ports.json` + `runtime-config.json`) are clever for local but brittle for Vercel — there is no reason runtime config should be a file fetch in production, it should be a build-time `import.meta.env` constant. This is a latent footgun: if the file 404s, the whole client white-screens before auth even loads.

The Supabase Auth migration (commits 86b8c8f → 6f19bc3) is the right move and was executed competently — event-based `SIGNED_IN`/`PASSWORD_RECOVERY` detection, 6s timeout in `AuthCallback`, CORS expanded for `X-Client-Info` and `apikey`. But the legacy `routes/auth.js` and `passwordHash` column are still live. Until those are removed, you have two systems that can issue sessions, and the local `User.authId` ↔ Supabase UUID sync runs on every first request, which means a Supabase outage = total app outage even for already-logged-in users. There is no fallback, no cached session, no degraded read-only mode.

Data model–wise, the placement-focused tables (`DsaProblemStatus`, `DsaAttempt`, `DsaBookmark`, `MasteryEntry`, `SRSItem`, `EngagementDay`, `Certificate`) are well-designed and reflect a clear product thesis. The dead models (`Course`, `Chapter`, `Lesson`, `Roadmap`, `TutorThread`, `TutorMessage`, `LessonProgress`) are not just clutter — they're a security review liability, because every model in `schema.prisma` implies an attack surface someone has to reason about. RLS posture on Supabase is unclear from the recon; if Prisma is bypassing RLS via service-role (which it almost certainly is, since Prisma 7 with pg adapter is operating at the connection level), then the entire authorization model lives in Express middleware, with zero defense-in-depth. At 18 users this is fine. At 10k it's the single thing that will end up on Hacker News.

SEO is effectively zero. No canonical URLs, no `robots.txt`/`sitemap.xml`, no JSON-LD despite a real FAQ on Landing, no per-route metadata for the 50 company pages, ~150 DSA problems, or PYQ pages. The product has genuinely SEO-attractive content (long-tail "company + round + year" queries) and ships it behind a client-only Suspense shell. This is the largest unforced error in the codebase.

## 3. Critical Issues

| # | Issue | Impact | Effort | Priority |
|---|-------|--------|--------|----------|
| 1 | `index.html` title/OG/Twitter still says "Adaptive AI Learning Universe" — every search result & link unfurl sells the wrong product | Critical (kills brand + SEO) | 30 min | P0 |
| 2 | Dual auth stacks (`routes/auth.js` legacy JWT + Supabase Auth) with no deprecation plan; `User.passwordHash` nullable | High (security audit failure, support load) | 1 week | P0 |
| 3 | SPA-only rendering — `/companies/:slug`, `/dsa/:slug`, `/pyq/*` are invisible to Google. Crawlers see empty `<head>` shell | Critical (kills organic CAC) | 2-3 weeks | P0 |
| 4 | No sitemap, robots.txt, JSON-LD, canonical URLs despite real FAQ + 50 company pages | High (table-stakes SEO) | 3 days | P1 |
| 5 | Vercel serverless + Prisma + Supabase pooler — connection storm risk on cold start, especially with `EngagementDay` write-heavy endpoints | High (breaks at ~2-5k DAU) | 1 week | P1 |
| 6 | No RLS on Supabase (Prisma uses service-role); all authz in Express middleware. Single bug = full data leak | Critical (one bug from breach) | 2-3 weeks | P1 |
| 7 | Dead routes (`Courses*`, `Roadmaps*`, `Tutor.tsx`) + stale Prisma models (`Course`, `Chapter`, `Lesson`, `Roadmap`, `TutorThread`, `TutorMessage`) shipped in bundle | Medium (bundle bloat, contributor confusion) | 2 days | P1 |
| 8 | `runtime-config.json` fetch in client is a single point of failure — 404 = full white-screen | Medium | 2 hours | P1 |
| 9 | No `vercel.app` → custom domain migration → kills trust, kills SEO authority, kills email deliverability for Supabase magic links | High (perception + SEO) | 1 day | P0 |
| 10 | No rate limiting on `/pyq/submit`, AI tutor (Groq), or auth endpoints — spam + cost runaway | High at 1k+ DAU | 3 days | P1 |
| 11 | No structured logging, no error tracking (Sentry), no APM. You will not know when it breaks | High | 2 days | P1 |
| 12 | Monaco editor + jspdf + html2canvas + mermaid all eagerly bundled — Landing TTI is heavy for a public marketing page | Medium (SEO + bounce) | 1 day | P2 |
| 13 | `DsaAttempt` table grows unboundedly with every code run — no archival, no partitioning. At 100k users this is a Postgres performance problem | Medium (12-month horizon) | 1 week | P2 |
| 14 | No background job system. SRS due-date recalc, mastery EWMA updates, and certificate generation all run in request path | Medium (latency creep) | 1 week | P2 |
| 15 | No CSP, no Permissions-Policy, no HSTS headers configured in `vercel.json` | Medium (security review fail) | 4 hours | P2 |

## 4. Recommendations

### 4.1 Fix the identity crisis at the HTML layer (this week)

Rewrite `index.html` `<title>`, meta description, OG, and Twitter card to match the Landing pitch. Suggested copy:

```
<title>PrepNxt — Placement Season OS for Indian Engineering Students</title>
<meta name="description" content="Track 50+ recruiters, crack PYQs, manage your application kanban, and ship 150+ DSA problems. The placement workflow tool campus students actually use." />
```

Add `<meta name="robots" content="index,follow">`, canonical URL, and JSON-LD `Organization` + `WebSite` + `FAQPage` blocks (the FAQPage one is free — you already have FAQ content on Landing). This costs nothing and is the single highest-ROI change in the report.

### 4.2 Kill the legacy auth stack on a hard deadline

The plan:
1. Email all ~18 existing users with `passwordHash IS NOT NULL` a forced-reset link via Supabase.
2. Delete `routes/auth.js` and all imports.
3. Migration: `ALTER TABLE "User" DROP COLUMN "passwordHash"`.
4. Remove `bcryptjs` and `jsonwebtoken` from `package.json`.

Do this *before* you have 100 paying users. With 18, the migration email goes to 18 inboxes and you owe nobody an apology. At 1000 it's a coordination nightmare.

### 4.3 SSR/prerender the SEO-critical routes

Do not migrate the whole app to Next.js — that's a 6-week distraction. Instead:

- Add `vite-plugin-prerender` or `react-snap` for **build-time prerender** of the 50 `/companies/:slug` pages and the top ~50 DSA problem pages. These are read-mostly, low-cardinality, high-search-intent.
- Per-route metadata via `react-helmet-async` or `@unhead/react`. Each company page should have a unique `<title>` like "Goldman Sachs Campus Placement Guide 2026 — Eligibility, Rounds, PYQs | PrepNxt".
- For dynamic PYQ pages, defer to phase 2 — but ensure the prerendered company page links *down* into the PYQs so crawlers can discover them via the SPA after JS executes.

This is how PrepInsta and GFG own these SERPs. There is no other way in.

### 4.4 Buy the domain this week

`prepnxt.in` or `prepnxt.co.in` if available, `prepnxt.app` as fallback. Three concrete reasons beyond "looks better":
1. Supabase magic-link emails from `*.vercel.app` get junked far more aggressively. Your auth conversion is literally lower today because of this.
2. SEO authority compounds against the root domain; every day on `vercel.app` you are building Vercel's authority, not yours.
3. Indian campus users equate `.vercel.app` URLs with "side project" — kills trust at the first impression.

### 4.5 Lock down Supabase with RLS even if Prisma uses service-role

Defense in depth. Even though Prisma 7 with the pg adapter connects with service-role and bypasses RLS, enable RLS on every user-scoped table (`DsaProblemStatus`, `DsaAttempt`, `SRSItem`, `MasteryEntry`, `EngagementDay`, `Certificate`, `Note`, `Notification`). Add policies like `auth.uid()::text = "authId"`. Then create a *separate* read-only Supabase client used for any future client-direct queries (e.g., realtime leaderboards). When you inevitably bolt on a Supabase Realtime feature in 6 months, RLS is already in place.

### 4.6 Connection pooling — switch all Prisma traffic to Supavisor transaction mode

For Vercel serverless functions, the `DATABASE_URL` must point at Supavisor's port 6543 (transaction pooler), not 5432. Verify in `prisma/schema.prisma` and Vercel env. Add `?pgbouncer=true&connection_limit=1` to the URL. Without this, every cold start opens a new connection, and Supabase's free tier caps at 60 — you will hit that wall at ~500 concurrent users hammering `DsaAttempt` writes.

### 4.7 Prune the dead code in one focused PR

Delete in a single commit:
- `routes/Courses.tsx`, `CourseDetail.tsx`, `CourseLesson.tsx`, `CourseQuiz.tsx`, `CourseCreate.tsx`
- `routes/Roadmaps.tsx`, `RoadmapCreate.tsx`, `RoadmapDetail.tsx`
- `routes/Tutor.tsx`
- The `<Navigate>` stubs in `App.tsx` for `/courses`, `/roadmaps`, `/tutor`
- Prisma models: `Course`, `Chapter`, `Lesson`, `LessonProgress`, `Roadmap`, `TutorThread`, `TutorMessage` (only after verifying zero rows or backing them up).

Estimated bundle savings: 15-25% based on Monaco, mermaid, and tutor-related imports likely chained off these.

### 4.8 Move `runtime-config.json` to build-time env vars

In production, the Vercel build should bake `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_API_BASE` into `import.meta.env`. Keep the `runtime-config.json` fetch only for local dev where the port is random. Currently a single broken deploy to Vercel that misses the file = total client outage.

### 4.9 Add Sentry + Vercel Analytics + structured logging

Sentry frontend SDK + a server-side Sentry init in `server/index.js`. Pino for structured server logs (replace morgan). Vercel Analytics for web vitals. Cost: ~$0 at current scale, ~$30/mo at 10k DAU. Without this you are flying blind.

### 4.10 Rate-limit the three dangerous endpoints

- `/pyq/submit` — abuse vector for spam content.
- AI tutor (Groq) — direct cost runaway, $ per call.
- `/auth/*` legacy + Supabase — credential stuffing.

Use `@upstash/ratelimit` with Upstash Redis (Vercel-native, free tier covers current scale). 10 req/min per IP for PYQ submit, 30 req/hour per user for tutor, 5 req/min per IP for auth.

## 5. 30-Day Priorities

1. **HTML metadata + JSON-LD rewrite** — `index.html` reflects placement-OS positioning, FAQPage JSON-LD ships, `robots.txt` and `sitemap.xml` added. Deliverable: PR merged, Google Search Console reindex requested.
2. **Custom domain live** — `prepnxt.in` (or chosen) purchased, Vercel + Supabase configured, magic-link emails sending from `noreply@prepnxt.in`. Deliverable: `prepnext.vercel.app` permanently 301s to the custom domain.
3. **Legacy auth fully decommissioned** — `routes/auth.js` deleted, `passwordHash` column dropped via Prisma migration, bcryptjs + jsonwebtoken removed from dependencies. Deliverable: single auth path through Supabase.
4. **Dead code purge** — Courses/Roadmaps/Tutor routes + Prisma models removed. Deliverable: PR with measurable bundle size delta (target ≥15% Landing JS shrink).
5. **Sentry + structured logging live** — frontend + server SDKs configured, Pino in `server/index.js`, source maps uploading. Deliverable: dashboard with 7 days of clean traffic, alerting set up for >1% error rate.
6. **Rate limiting on auth + PYQ submit + Groq tutor** — Upstash Redis wired into Express middleware. Deliverable: load test showing 429s above thresholds.
7. **Supavisor transaction-mode pooling verified** — `DATABASE_URL` audited, `pgbouncer=true&connection_limit=1` confirmed, smoke test under simulated cold-start load. Deliverable: documented in `README.md` ops section.

## 6. 90-Day Priorities

1. **SSG/prerender for `/companies/:slug` (×50) and top DSA problems (×50)** — vite-plugin-prerender configured, per-route `<title>`/meta/canonical via `@unhead/react`, internal linking from prerendered pages to PYQs and related companies. Deliverable: Google indexing >80 distinct PrepNxt URLs, measurable organic impressions in GSC.
2. **RLS on every user-scoped table** — policies written, tested against service-role bypass, dual-client (service-role for Express, anon for future client-direct) pattern documented. Deliverable: `supabase/migrations/*_enable_rls.sql` merged, automated test suite asserting unauthorized reads fail.
3. **Background job system** — pick one: Vercel Cron + Upstash QStash *or* a tiny `pg-boss` worker on a Render/Fly service. Move SRS due-date recalc, mastery EWMA batch jobs, and certificate PDF generation off the request path. Deliverable: p95 latency on `/review` and `/mastery` drops by ≥30%.
4. **CSP, HSTS, Permissions-Policy in `vercel.json`** — strict CSP with nonce, HSTS preload-eligible, Permissions-Policy denying camera/mic/geolocation. Deliverable: A+ on securityheaders.com, Mozilla Observatory ≥A.
5. **DsaAttempt archival strategy** — monthly partition or cold-storage rollup of attempts older than 90 days to a `DsaAttemptArchive` table. Deliverable: written runbook, partition trigger in place before table exceeds 5M rows.
6. **OG image generation per company / per DSA problem** — Vercel OG (`@vercel/og`) edge function. Each `/companies/:slug` and `/dsa/:slug` gets a unique unfurl. Deliverable: WhatsApp/LinkedIn share previews show contextual cards, not the static Landing OG.
7. **Bundle splitting for marketing vs app shell** — Landing should not ship Monaco, mermaid, jspdf, or html2canvas. Configure Vite manual chunks; lazy-load Monaco only on `/dsa/:slug` mount. Deliverable: Landing LCP <2s on Moto G4 emulation in Lighthouse.

## 7. Metrics to Track

**Reliability & performance**
- Server p50 latency: <150ms; p95: <500ms; p99: <1.5s.
- Frontend LCP on Landing (4G Moto G4): <2.5s; current state unknown — measure baseline week 1.
- Error rate (Sentry): <0.5% of sessions affected.
- Supabase connection pool utilization: <60% sustained; alerts at 80%.

**Growth & SEO**
- Indexed URLs in Google Search Console: 50 by day 60, 200 by day 90.
- Organic impressions / week: baseline by week 4, 10x by week 12.
- Custom-domain DA (Moz/Ahrefs): track as vanity but track it.
- Magic-link email deliverability rate: >97% post-domain move (track via Supabase Auth logs).

**Auth & abuse**
- % users on Supabase Auth (vs. legacy): 100% by day 30.
- Failed auth attempts / hour: alert above 100 (credential stuffing signal).
- Rate-limit hits on `/pyq/submit` and `/tutor/*`: <2% of total traffic (above means thresholds wrong).

**Product engagement that proves placement-OS thesis**
- Weekly active placement-tracker users (any kanban move in last 7 days): target 40% of signups by day 90.
- PYQ submissions / week: target 20 by day 30, 100 by day 90 (proves crowdsourcing flywheel).
- DSA problems with ≥1 attempt: 100/150 by day 60 (proves content depth is being used).
- Per-user DsaAttempt rows / week: 5+ for active cohort (proves stickiness).

**Cost guardrails**
- Groq tutor spend / week: hard cap at $20 until paid tier ships, alert at 50%.
- Supabase egress: track weekly; switch to Pro tier ($25/mo) before hitting free-tier compute quota — likely around 500 DAU.
- Vercel function invocations / day: track for serverless cost escalation; consider Edge runtime for read-mostly company/DSA endpoints once SSG is live.

**Honest reality check at each scale tier**

- **1k DAU**: dual-stack auth and SPA-only rendering are the bottleneck. Fix in 30-day plan.
- **10k DAU**: Prisma/Supavisor connection storm + lack of background jobs = visible latency. Fix in 90-day plan.
- **100k DAU**: `DsaAttempt` table size, lack of read replicas, single-region Vercel + Supabase = international latency. Plan for it; do not build for it now.
- **1M DAU**: at this point PrepNxt is acquisition-bait or a serious infra rewrite into multi-region Postgres with proper CDC. This is not a 2026 problem.

The fastest path from 18 users to 10k is not infra — it is **identity + SEO + trust**: fix the HTML, buy the domain, prerender the company pages. That is where the next 90 days of CTO attention belong.
