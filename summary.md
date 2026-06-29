# PrepPlace — Project Brain (summary.md)

> Permanent technical documentation generated from a full-repository analysis.
> **Facts** are drawn from source. **Inferences** are explicitly marked _(inferred)_.
> Where something can't be determined, it says so rather than inventing it.

---

## 1. Project Overview

| | |
|---|---|
| **Project name** | **PrepPlace** (evolved from PrepNext → PrepNxt → PrepKit → PrepPlace) |
| **One-line** | A placement-season operating system for Indian college students. |
| **Live** | https://prepnext.vercel.app _(legacy deployment domain; PrepPlace domain pending)_ |
| **Repo** | https://github.com/ashutoshsharma1309/palsed |
| **Scale** | ~22,500 lines across `client/` + `server/` |

**Detailed description.** PrepPlace consolidates the chaos of campus placement season — recruiter info scattered across WhatsApp groups, previous-year questions lost in Drive folders, no clarity on eligibility or timelines — into one student workspace: a curated **recruiter map**, a verified **PYQ vault**, a **DSA practice hub**, **per-company prep kits**, an **applications kanban tracker**, **career roadmaps**, a **hackathon guide**, mock **online assessments**, and supporting tools (resume roast, salary insights, company compare, verifiable certificates).

**Problem it solves.** Placement prep for Indian students is fragmented and ad-heavy. PrepPlace makes it a single, organized, student-owned workflow.

**Why it exists.** Built (originally as a hackathon project) around the thesis that the *workflow* of placement season — recruiter intel + applications + PYQs + a calendar — is a stronger, more defensible wedge than yet another generic interview-prep content site.

**Target users.** Primarily Indian engineering students (2nd–4th year / MTech) prepping for campus + off-campus placements and internships; also any college student targeting tech/product/analytics roles.

**Vision / long-term potential _(inferred)_.** Become the default daily-open tool for Indian placement season, then expand to a two-sided platform (students ↔ recruiters/colleges) with a B2B placement-cell dashboard as the recurring-revenue engine.

---

## 2. Executive Summary

PrepPlace is a **web app** (a React single-page app + a small Express API) that helps college students get placed. A student signs in with Google, completes a short profile (college, branch, year, target roles), and lands in a workspace where they can: browse 85+ curated recruiters with eligibility and real CTC, drill 82+ verified past interview questions, practice 150 curated DSA problems, follow role-based career roadmaps, track every job application on a kanban board, take timed mock assessments, and generate shareable certificates. It's **free for students**. What makes it unique vs. PrepInsta/Unstop/GFG: it's a *workflow product* (track *my* placement season) rather than a content dump, with verified, India-specific data. It runs entirely on Vercel (static frontend + serverless API) backed by Supabase Postgres.

---

## 3. Product Understanding

**Core features**
- **Recruiter Map / Companies** — 85+ curated recruiters; eligibility, rounds, OA platforms, verified-only CTC.
- **PYQ Vault** — 82+ verified previous-year questions with expected approaches; student contribution + verification.
- **DSA Practice Hub** — 150 problems across 18 topics; solutions, complexity, LeetCode links, 4-state progress.
- **Applications Tracker** — kanban (Wishlist → OA → Tech → HR → Offer) with deadlines, notes, conversion rate.
- **Career Roadmaps** — 14 software/IT roles; staged topics, skills, shared DSA + CS-fundamentals modules, courses, projects, progress.
- **Hackathon Guide** — 18-section beginner→winning guide (markdown-driven).
- **Per-Company Prep Kits**, **Mock OA tests**, **Resume Roast**, **Salary**, **Compare**, **Certificates** (PDF + QR + verify page), **Mastery radar**, **Engagement** analytics, **Placement Hub** (10 curated sections).

**Primary user workflow**
1. Land on marketing page → Google sign-in.
2. Forced **onboarding** (required: name, college, branch, year, target roles).
3. Dashboard → explore recruiters / PYQs / DSA / roadmaps.
4. Track applications on the kanban as the season progresses.
5. Practice + earn/share certificates.

**Intended experience.** Fast, dark/light-themed, mobile-friendly, keyboard-navigable, "your placement season, organized."

---

## 4. Business Perspective

> Largely _(inferred)_; the repo also contains extensive strategy docs (INVESTOR_MEMO, GROWTH_REPORT, etc.) that informed this.

- **Business model:** Freemium for students + **B2B SaaS** for college Training-&-Placement (T&P) cells (the real revenue path — student tracking, drive management, placement analytics; ₹50k–2L/yr per college per the internal memos).
- **Customers:** students (free, top-of-funnel), colleges/TPOs (paying), later recruiters (candidate-pool marketplace).
- **Revenue opportunities:** premium student tier (AI mock interviews, full test series), B2B dashboards, recruiter listings, affiliates.
- **Competitive advantages:** verified India-specific data, a workflow product (stickiness via the kanban), potential UGC/SEO moat from crowd-sourced interview experiences.
- **Market positioning:** "Placement Season OS" vs. content sites (PrepInsta/GFG) and event marketplaces (Unstop).
- **Assumptions:** monetization is not yet built; user counts are small/early (internal docs cite ~18 signups).

---

## 5. Architecture

**High-level**

```
                         ┌──────────────────────────────┐
        Browser  ───────▶│  React SPA (Vite build)      │   served statically by
                         │  client/dist on Vercel CDN   │   Vercel (no SSR)
                         └───────────────┬──────────────┘
                                         │ fetch /api/*
                                         ▼
                         ┌──────────────────────────────┐
                         │  Express app (ESM)            │   one Vercel serverless
                         │  api/index.js → server/app.js │   function
                         └───────────────┬──────────────┘
                                         │ Prisma + @prisma/adapter-pg
                                         ▼
                         ┌──────────────────────────────┐
                         │  Supabase PostgreSQL          │
                         │  + Supabase Auth (Google)     │
                         └──────────────────────────────┘
```

**Request flow.** Browser loads the static SPA → `useAuth` reads the Supabase session from localStorage → API calls go to `/api/*` (rewritten by `vercel.json` to the serverless function) with a `Bearer <supabase-jwt>` → Express verifies the JWT via Supabase admin → Prisma reads/writes Postgres.

**Data flow nuance _(important, inferred from code)_.** Many features persist to **localStorage** (`prepnext.*` keys) on the client, *not* the database — applications, PYQ progress, OA sessions, mastery, SRS, roadmap/placement progress, theme, student profile. Only auth + the synced `User`/profile go through the API/DB. This is a known architecture gap (client-side source of truth).

**External integrations.** Supabase (DB + Auth), Vercel (host + Analytics + Speed Insights), Google OAuth. Groq SDK is present but its AI endpoints are **retired** (return 410).

---

## 6. Folder-by-Folder Breakdown

| Folder | Purpose |
|---|---|
| `client/` | The React SPA (Vite). All UI, routing, state, content data. |
| `client/src/routes/` | 42 route components (page-level). Many are **dead legacy** (Course*/Roadmaps*/Tutor*) redirected away in `App.tsx`. |
| `client/src/components/` | Reusable UI: `ui/` primitives (Card, Button, Chip, ProgressBar, Donut, Logo…), `layout/` (Nav, Footer, MobileTabBar), `placement/`, `dsa/`, `lesson/`, `adaptive/`, CommandPalette, ErrorBoundary. |
| `client/src/hooks/` | 13 hooks: `useAuth`, `useApplications`, `usePYQs`, `useOaSessions`, `useMastery`, `useSRS`, `useStudentProfile`, `useRoadmapProgress`, `usePlacementProgress`, `useLocalStorageState`, `usePageMeta`, `useTheme`, `useVoiceInput`. |
| `client/src/lib/` | Pure logic: `api` (API base URL), `auth`, `certificate` (PDF/QR), `markdown`, `mastery`, `resumeScorer`, `salaryMath`, `srs`, `supabase` (client). |
| `client/src/data/` | Content data: `companies` (85), `pyqs-seed` (82), `dsa-problems` (150), `dsa-solutions`, `oa-questions`, `internship-boards`, `roadmaps` (14 roles + DSA/CS modules), `placement/` (10 sections). |
| `client/src/types/` | Shared TS types (e.g., `profile.ts`). |
| `client/src/styles/` | `globals.css` — theme tokens (`[data-theme]`), `.markdown-body`, focus + accessibility rules. |
| `client/public/` | Static assets + markdown content (`hackathon.md`, `aptitude.md`, `core-cs.md`, `interview.md`, `system-design.md`), icons, manifest, `robots.txt`, `sitemap.xml`, og images. |
| `server/` | Express API. `app.js` (app factory + middleware), `index.js` (standalone entry), `auth.js` (JWT verify), `cors.js`, `security.js`, `db.js` (Prisma), `groq.js` (dead), `lib/`, `prompts/` (dead), `routes/`, `prisma/`. |
| `api/` | `index.js` — Vercel serverless adapter that mounts `server/app.js`. |
| `linkedin-assets/` | Brand kit (logo, banners, launch mockup). |
| `*.md` (root) | Strategy/analysis reports + README/CHANGELOG/CONTRIBUTING/ROADMAP_FEATURE + this file. |

---

## 7. File-Level Summary (key files)

| File | Purpose / I-O |
|---|---|
| `client/src/App.tsx` | Route table + layout shell + auth gating; lazy-loads all routes. |
| `client/src/components/auth/RequireAuth.tsx` | Guard: redirects unauthenticated → `/`, and authenticated-but-incomplete → `/onboarding`. |
| `client/src/hooks/useAuth.ts` | Supabase session state; `isAuthenticated`, `user`, login/logout/refetch. |
| `client/src/lib/supabase.ts` | Supabase browser client (Google OAuth, session in localStorage). |
| `client/src/data/roadmaps.ts` | 14 roles + shared DSA (12 categories) + CS-fundamentals (OS/DBMS/CN/OOP); pure data. |
| `client/src/routes/Roadmap.tsx` / `Hackathon.tsx` | Data-driven content pages (accordions + markdown). |
| `server/app.js` | Express factory: compression, `securityHeaders`, CORS, JSON limit (1MB), in-memory rate limit, route mounting, central error handler. |
| `server/routes/auth.js` | `GET/PATCH /me`, `PUT /profile`, `validate-email`, `fallback-signin`, `dev-confirm` (prod-guarded), `signup`/`login` (410). |
| `server/auth.js` | Verifies Supabase JWT (`admin.auth.getUser`), `requireAuth`, `publicUser`. |
| `server/security.js` | Helmet-equivalent headers + payload-shape validator. |
| `server/db.js` | Prisma client via `@prisma/adapter-pg` (Supabase Postgres). |
| `vercel.json` | Build/output, `/api/*` rewrite, **security headers + asset caching**. |

---

## 8. Technology Stack

| Category | Tech |
|---|---|
| **Languages** | TypeScript (client), JavaScript ESM (server) |
| **Frontend framework** | React 19, React Router 7 |
| **Build/tooling** | Vite 7, `@vitejs/plugin-react`, TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`) |
| **UI libs** | framer-motion, lucide-react, react-hot-toast, react-markdown + remark-gfm + rehype-highlight, mermaid |
| **Client features** | jspdf + html2canvas + qrcode (certificates) |
| **Backend** | Node 20, Express 4 (ESM), morgan, compression, cors, dotenv |
| **ORM / DB** | Prisma 7 + `@prisma/adapter-pg` + `pg`; **PostgreSQL (Supabase)** |
| **Auth** | Supabase Auth (Google OAuth); server-side JWT verification |
| **AI SDK** | `groq-sdk` — **present but unused** (AI endpoints retired) |
| **Hosting** | Vercel (static SPA + serverless function) |
| **Monitoring** | `@vercel/analytics`, `@vercel/speed-insights` |
| **Caching** | In-memory rate-limit map (per-lambda); immutable CDN caching for hashed assets |
| **Package manager** | npm (workspaces-style: root + `client/` + `server/`) |
| **Testing** | **None detected** |
| **CI/CD** | Vercel git-based deploy; **no GitHub Actions** |
| **Message queues / vector DB** | **None** |
| **Dead deploy configs** | `Procfile`, `railway.json`, `render.yaml` (alt platforms, unused) |

---

## 9. Features Inventory

| Feature | Status |
|---|---|
| Google sign-in (Supabase) + enforced onboarding | ✅ Completed |
| Recruiter Map / Companies + detail | ✅ Completed |
| PYQ Vault + submission/verification | ✅ Completed |
| DSA Hub (150 problems) + solutions | ✅ Completed |
| Applications kanban tracker | 🟡 Partial — **localStorage only, no DB persistence** |
| Career Roadmaps (14 roles) | ✅ Completed (6 roles richer, 8 lighter) |
| Hackathon Guide | ✅ Completed |
| Mock OA tests + result | ✅ Completed |
| Resume Roast / Salary / Compare | ✅ Completed |
| Certificates (PDF/QR/verify) | ✅ Completed |
| Mastery radar / SRS review / Engagement | 🟡 Partial — localStorage-backed |
| Dark/light theming + a11y (focus, skip link) | ✅ Completed |
| Pricing page | 🟡 Prototype (no billing integration) |
| Monetization / payments | 🔲 Planned _(inferred)_ |
| B2B college dashboard | 🔲 Planned _(inferred)_ |
| AI tutor / adaptive lessons / course gen | ⛔ Retired (legacy, 410) |

---

## 10. API Documentation

Base: `/api`. Auth: `Authorization: Bearer <supabase JWT>` (verified server-side). Errors: JSON `{ error }`; 5xx generic in production; rate limit 429 (`Retry-After`).

| Method | Path | Purpose | Auth |
|---|---|---|---|
| GET | `/api/auth/me` | Get/create synced User row | ✅ |
| PATCH | `/api/auth/me` | Update profile fields | ✅ |
| PUT | `/api/auth/profile` | Save onboarding profile (validated: name, college, branch, year, ≥1 role) | ✅ |
| POST | `/api/auth/validate-email` | Pre-check email (gibberish + MX) | ❌ |
| POST | `/api/auth/fallback-signin` | Magic-link when Supabase mailer fails (open-redirect-guarded) | ❌ |
| POST | `/api/auth/dev-confirm` | Dev escape hatch (**404 in production**) | ❌ |
| POST | `/api/auth/signup`, `/login` | **410 Gone** (moved to Supabase OTP) | — |
| GET | `/api/health` | Service health | ❌ |
| GET | `/api/db/health` | DB connectivity + user count | ❌ |
| ALL | `/api/db/*` (other) | **410 Gone** (generic CRUD retired) | — |
| ALL | `/api/roadmaps`,`/courses`,`/tutor`,`/quiz`,`/feedback` | **410 Gone** (AI retired) | — |

---

## 11. Database Documentation

**Engine:** PostgreSQL (Supabase), via Prisma 7 + `@prisma/adapter-pg`. **18 models.**

**Active (placement product):** `User`, `DsaProblemStatus`, `DsaAttempt`, `DsaBookmark`, `MasteryEntry`, `SRSItem`, `Certificate`, `EngagementDay`, `EngagementIntervention`, `Note`, `Notification`.

**Dead (legacy AI-learning identity — flagged for removal):** `Course`, `Chapter`, `Lesson`, `LessonProgress`, `Roadmap`, `TutorThread`, `TutorMessage`.

**Relationships _(inferred)_:** `User` 1—N to most user-scoped tables (DSA status/attempts/bookmarks, mastery, SRS, certificates, engagement, notes, notifications) keyed by the Supabase auth id. Legacy `Course → Chapter → Lesson → LessonProgress` and `TutorThread → TutorMessage`.

**Caveat:** several product features (applications, PYQ progress, OA sessions) are **not** in the schema — they live in client localStorage. Migrating these to Postgres is the top data-layer TODO.

`DATABASE_SETUP.md` documents a legacy local-MySQL setup and is out of date (banner added).

---

## 12. AI Components

**Current state: effectively none at runtime.** The product explicitly pivoted to "zero AI calls at runtime." Remnants exist but are **retired**:
- `groq-sdk` dependency + `server/groq.js` — unused.
- `server/prompts/` (`course`, `roadmap`, `tutorExplain`, `tutorRexplain`, `quizNext`, `feedbackDiagnose`) — for the old adaptive-learning engine.
- `/api/roadmaps|courses|tutor|quiz|feedback` → **410 Gone**.
- `useVoiceInput` (Web Speech API) remains for voice input UI.

No embeddings, vector DB, RAG, fine-tuning, or agents. _(Future AI — e.g., AI mock interviewer — is on the roadmap, not built.)_

---

## 13. Authentication & Security

**Auth:** Supabase Auth (Google OAuth). Session JWT stored in localStorage by `supabase-js`; sent as Bearer token; **verified server-side** via `admin.auth.getUser`. Legacy bcrypt/JWT removed. Onboarding completion enforced by `RequireAuth`.

**Hardening (present):**
- Secrets only in env (`.env` git-ignored; **never committed** — verified). `.env.example` committed.
- CORS allowlist (`CLIENT_ORIGIN`), credentials:false.
- `securityHeaders` (HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, COOP/CORP, Permissions-Policy, CSP) on API; **+ headers in `vercel.json`** for the static SPA.
- 1MB body limit; payload depth/size validator; in-memory rate limit (60/min/IP/path).
- `/api/db` mass-CRUD locked to health-only; AI endpoints 410.
- Open-redirect guard on `fallback-signin`; `dev-confirm` 404s in prod; error handler hides internals; Mermaid `securityLevel: strict`.

**Remaining risks _(from the security audit)_:** CSP still allows `unsafe-inline`/`unsafe-eval`; rate-limit is per-lambda (needs Redis/Upstash + per-user); client `dompurify` (critical, via jspdf — fix is breaking jspdf v4); Prisma likely bypasses Supabase RLS (authZ lives in Express middleware only).

---

## 14. Code Quality Assessment

| Dimension | Notes |
|---|---|
| Architecture | Clean client/server split; pure data layer; reusable primitives. **But** localStorage-as-source-of-truth for core features is a real liability. |
| Maintainability | Good — small focused files, consistent patterns, `tsc` clean (0 errors). |
| Scalability | Serverless + Supabase is fine early; in-memory rate-limit + per-request JWT verify + no DB persistence for key features will bite at scale. |
| Readability | Strong — descriptive comments, consistent naming, theme tokens. |
| Technical debt | Significant **dead code** (9 legacy routes, 7 dead models, retired AI prompts/SDK, 3 unused deploy configs). |
| Modularity / reuse | High (UI primitives, hooks, data-driven content pages). |
| Tests | **None** — the biggest quality gap. |

**Overall: 7 / 10.** Well-organized, typed, and recently security-hardened, with a coherent product. Held back by the localStorage-persistence gap, accumulated dead code, and the complete absence of tests/CI.

---

## 15. Startup Readiness

**Strengths:** real wedge (placement workflow), shipped + deployed, broad feature set, verified India-specific data, clean stack, security-hardened.

**Weaknesses / missing:** no monetization, no DB persistence for the flagship kanban, no tests/CI, no custom domain, small user base, no analytics-driven retention loops, no B2B dashboard.

**Risks:** localStorage data loss undermines the "track my season" promise; incumbents (Unstop/PrepInsta) own distribution; single-founder bus factor.

**Build next:** (1) move applications/PYQ/progress to Postgres; (2) custom domain + public indexable pages (SEO); (3) B2B TPO dashboard MVP; (4) tests + CI.

---

## 16. Current Development Status

- **Overall completion _(inferred)_: ~70%** of a v1 student product; **~10%** of a fundable business (no revenue/B2B/retention).
- **Completed:** auth/onboarding, recruiter/PYQ/DSA/roadmap/hackathon content, certificates, theming, security baseline.
- **Missing:** DB persistence for core features, payments, B2B, tests, distribution.
- **Known TODOs (from code + reports):** delete dead models/routes/deploy-configs; move localStorage → Postgres; tighten CSP; distributed rate limiting; jspdf v4; README already refreshed.

---

## 17. Suggested Roadmap

| Phase | Focus | Priority |
|---|---|---|
| **Phase 1 — Foundation** | Move applications/PYQ/progress to Postgres; add tests + CI; delete dead code; custom domain. | 🔴 Critical |
| **Phase 2 — Distribution** | Public indexable `/companies`/`/pyq` pages (SSR/prerender); crowd-sourced **interview experiences** (UGC/SEO moat); drive calendar + WhatsApp/email reminders; Chrome extension for one-click job capture. | 🟠 High |
| **Phase 3 — Revenue** | Freemium premium tier (AI mock interviews, full test series); **B2B TPO dashboard**; payments. | 🟠 High |
| **Phase 4 — Scale** | Redis/Upstash rate-limit + caching; recruiter-side marketplace; analytics-driven retention; mobile app. | 🟡 Medium |

---

## 18. Known Issues

- **Dead code:** routes `Courses`, `CourseCreate`, `CourseDetail`, `CourseLesson`, `CourseQuiz`, `Roadmaps`, `RoadmapCreate`, `RoadmapDetail`, `Tutor`; models `Course/Chapter/Lesson/LessonProgress/Roadmap/TutorThread/TutorMessage`; `server/prompts/*`, `server/groq.js`, `groq-sdk` dep; route files `courses.js/roadmaps.js/tutor.js/quiz.js/feedback.js` (unmounted).
- **Unused config:** `Procfile`, `railway.json`, `render.yaml` (live deploy is Vercel).
- **Incomplete implementation:** flagship features persist to localStorage, not the DB (data loss on browser change; breaks the core promise).
- **Potential bugs/risks:** per-lambda rate limit resets on cold start; `dompurify` critical vuln via jspdf; no RLS defense-in-depth.
- **Missing docs/tests:** zero automated tests; `DATABASE_SETUP.md` was stale (banner added); `PrepNext-Presentation.pdf` references the old name.
- **Naming drift:** live URL + localStorage keys still use the `prepnext.*` namespace (intentionally preserved to avoid breakage).

---

## 19. Developer Notes

- **Run locally:** `npm run install:all`, add `server/.env` + `client/.env` (copy from `.env.example`), then `npm run dev` (server writes `.ports.json`; Vite waits on it).
- **Build:** `npm run build` (client). **Typecheck:** `cd client && npx tsc --noEmit` (currently 0 errors — keep it that way).
- **Theme safety:** use CSS variables (`var(--color-*)`), never hardcoded `text-white`/hex, so UI works in both themes.
- **Brand:** the product is **PrepPlace**; the in-app `PrepKit` is a *feature* (per-company prep kit), not the brand — don't rename.
- **Adding content pages:** follow `Roadmap.tsx`/`Hackathon.tsx` (data/markdown-driven) — no UI redesign needed.
- **Don't** add new persistence to localStorage for new features; prefer the API/DB.
- **Deps:** keep `npm audit` clean on the server runtime path.

---

## 20. Project Timeline (Inferred)

> _All inferred_ from code, comments, dead models, retired endpoints, docs, and recent commit history.

1. **Initial idea:** an **AI-powered adaptive-learning platform** (Courses/Lessons/Roadmaps/AI Tutor, Groq-backed) — see the dead models, prompts, and `groq-sdk`.
2. **Pivot:** to a **Placement Season OS** for Indian students — Companies/PYQ/DSA/Applications added; AI endpoints retired (410); marketing copy + landing rewritten.
3. **Auth migration:** email/password (bcrypt + JWT) → **Supabase Google OAuth**; legacy auth deps removed.
4. **DB migration:** MySQL/Railway → **Supabase Postgres** (Prisma adapter-pg).
5. **Rebrands:** PrepNext → PrepNxt → (PrepKit, reverted) → **PrepPlace**, each as a guarded repo-wide migration preserving the live URL + storage keys.
6. **Recent (committed):** profile-completion enforcement; full light/dark theme-contrast fix; high-contrast logo badge; Career Roadmap module (14 roles); Hackathon module; production **security hardening** (open-redirect, headers, CSP, vuln fixes); typecheck-error cleanup; docs (summary/changelog/contributing).
7. **Current direction:** harden + document for production/custom-domain deployment; groundwork for monetization + B2B.

---

## 21. Future Vision

- **Features:** crowd-sourced verified interview experiences (the moat); AI mock interviewer (voice); drive calendar + reminders; Chrome extension; study planner; offer cards.
- **Scaling:** Postgres-backed everything; Redis/Upstash caching + rate-limit; SSR/prerender for SEO; edge functions.
- **Enterprise:** college/TPO dashboards (placement analytics, eligibility, drive management); white-label per college.
- **Open-source:** the DSA/CS/roadmap content datasets could be community-maintained.
- **Commercial:** student premium + B2B SaaS + recruiter marketplace.

---

## 22. Quick Reference

| | |
|---|---|
| **Project name** | PrepPlace |
| **Purpose** | Placement-season operating system for Indian college students |
| **Main stack** | React 19 + TS + Vite + Tailwind v4 · Express (ESM) · Prisma + Supabase Postgres · Vercel |
| **Entry points** | Client: `client/src/main.tsx` → `App.tsx`. Server: `api/index.js` → `server/app.js` (Vercel); `server/index.js` (standalone) |
| **Important dirs** | `client/src/{routes,components,hooks,lib,data}`, `server/{routes,prisma}`, `api/` |
| **Core modules** | Companies, PYQ Vault, DSA Hub, Applications kanban, Roadmaps, Hackathon, Certificates |
| **Database** | Supabase PostgreSQL (Prisma, 18 models; ~7 legacy/dead) |
| **Authentication** | Supabase Auth (Google OAuth), server-verified JWT |
| **Deployment** | Vercel (static SPA + serverless API); live at prepnext.vercel.app |
| **AI components** | None active (Groq remnants retired; voice input remains) |
| **Tests / CI** | Vitest unit tests (learning engine: streak, progress, roadmap) + GitHub Actions CI (typecheck · test · build) |
| **Current status** | ~70% v1 student product; security-hardened; not yet monetized |
| **Next priority** | Move localStorage features → Postgres; add tests/CI; custom domain |

---

## Addendum — Structured DSA Learning (2026-06)

PrepPlace has been re-centered as a **structured DSA learning platform**: learn the
concept first, solve problems second. Key architecture:

**Standard lesson template.** Every roadmap topic renders one mentor flow —
*Objective → Theory → Intuition → Definition → Key concepts → Syntax (C++) →
Example → Visual (future-ready) → Complexity (best/avg/worst/space) → Common
mistakes → Interview notes*. Content is pure typed data in
`client/src/data/dsa/roadmap.ts` (never hardcoded in components);
`LessonView` renders only the sections a topic provides, so topics upgrade
gracefully. All foundational + core topics now carry definition, syntax, and a
worked C++ example.

**Patterns module** (`client/src/data/patterns/patterns.ts`). A standalone
learning module — separate from the roadmap — teaching the recurring *shapes* of
DSA/CP: **24 patterns across 7 categories** (Foundations, Arrays & Strings,
Recursion & Backtracking, Optimization, Stacks & Queues, Trees & Graphs,
Advanced). Each pattern has definition · why useful · recognition clues · when /
when-NOT to use · worked C++ · interview notes · graded practice problems.
Synthesized in our own words (Striver A2Z / NeetCode / CP-Algorithms / USACO /
CSES informed scope only). Routes: `/patterns`, `/patterns/:patternId`; surfaced
in desktop nav + the mobile tab bar.

**Checklist & streak.** A generic `Checklist` (id + items) persists per-user
checklist state for both topics and patterns via the central learning store
(localStorage `prepnext.dsaLearning.v1`). The streak is **activity-based**:
completing any checklist item or solving a problem stamps today into `activeDays`
— merely logging in does nothing.

**Payments removed.** All monetization (Pricing page/route, plan hook, Pro
upsell, Salary/Compare upsells) was removed; PrepPlace presents as a free
learning platform. No learning content was ever gated, so the architecture stays
payment-ready for the future.

**Tests.** Data-integrity suites for both `roadmap` and `patterns` (unique ids,
non-empty C++ solutions, valid difficulties, category coverage) on top of the
streak/progress logic — 31 tests, gated by GitHub Actions CI.

---

*Generated by full-repository analysis. Facts from source; assumptions marked “inferred.” Keep this file updated as the project evolves — it is the project's long-term memory.*
