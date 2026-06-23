# PrepPlace — Placement Season Operating System for Indian Students

> ℹ️ This README describes the platform's earlier identity. For the **current**
> product overview (PrepPlace as a placement-prep workspace), see
> [`summary.md`](summary.md).

**Live:** https://prepnext.vercel.app

PrepPlace is a full-stack, production-deployed **placement-preparation operating
system for Indian college students**. It consolidates campus placement season
into one workspace: a curated recruiter map, a verified previous-year-question
(PYQ) vault, a DSA practice hub, per-company prep kits, and a kanban application
tracker — with Google sign-in and cloud-synced, per-user progress.

---

## Highlights

- **Full-stack TypeScript/Node app** deployed on **Vercel** (static SPA + serverless API) with a managed **PostgreSQL** database on **Supabase**.
- **Google authentication** via Supabase Auth — server-verified JWTs, centralized route guards, enforced profile completion, and per-user data isolation.
- **Normalized relational schema** modeled in **Prisma** with versioned migrations, seed data, and a generic REST CRUD layer.
- **Recruiter map + PYQ vault**: 85+ curated recruiters (eligibility, rounds, verified-only CTC) and 82+ verified previous-year questions with expected approaches.
- **Applications tracker**: a placement-season kanban (Wishlist → OA → Tech → HR → Offer) with deadlines, notes, and conversion rate.
- **DSA practice hub**: 150 curated problems across 18 topics with in-platform solutions, complexity analysis, LeetCode integration, and 4-state progress tracking.
- **Performance & UX**: route-based code-splitting / lazy loading, memoized components, glassmorphism UI, framer-motion transitions, fully responsive, accessible (ARIA, keyboard nav).

---

## Architecture

```
React SPA (Vercel static)
   │  fetch /api/*
   ▼
Express app as a Vercel serverless function (api/index.js → server/app.js)
   │  Prisma  +  @prisma/adapter-pg
   ▼
PostgreSQL (Supabase)  +  Supabase Auth (Google)
```

- **Frontend** and **API** are served from one Vercel domain; a rewrite routes `/api/*` into the serverless function.
- **CI/CD**: push to `main` → Vercel builds (`prisma generate` + `vite build`) and deploys automatically.
- **Secrets** (`DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_JWT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `GROQ_API_KEY`, plus client `VITE_SUPABASE_*`) live in Vercel/`.env` (git-ignored); only `.env.example` is committed.

---

## Tech stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 7, Tailwind CSS v4, React Router 7, framer-motion, react-markdown, jsPDF + qrcode |
| **Backend** | Node 20, Express 4 (ESM), serverless functions |
| **Database** | PostgreSQL (Supabase), Prisma ORM, `@prisma/adapter-pg` driver, SQL migrations |
| **Auth** | Supabase Auth (Google OAuth); server-side JWT verification + route guards |
| **AI** | Groq API (`openai/gpt-oss-120b`) with strict JSON mode + schema validation + retry |
| **Infra / DevOps** | Vercel (hosting + serverless), Supabase (managed Postgres + Auth), Git-based CI/CD |

---

## Key features

### Placement workspace
- **Recruiter map** — 85+ curated companies with eligibility, rounds, OA platforms, and verified-only CTC bands.
- **PYQ vault** — 82+ verified previous-year questions with expected approaches; student contribution + verification flow.
- **Applications kanban** — track every company through Wishlist → OA → Tech → HR → Offer with deadlines and conversion rate.
- **Per-company Prep Kits** — DSA + PYQ + topic bundles composed per recruiter.
- **OA mock tests** — timed, self-graded mock assessments with a rubric.
- **Supporting tools** — Resume Roast, Salary insights, Company Compare, mastery radar, and **certificates** (PDF + QR + verifiable URL).

### Placement Training Hub
- 10 sections: Programming Languages, DSA, LeetCode tracks, Web Dev, ML, AI, App Dev, Aptitude, Core CS, Interview Prep.
- **Scalable resource architecture** — all resources typed and stored in data files; UI is fully data-driven.
- **Progress tracking** (completion %, readiness score, recommended-next) and **resource bookmarking**.
- **Instant global search** across every topic and resource.

### DSA practice hub
- **150 hand-curated problems** across 18 topics with company tags, interview-frequency, and source sheets (Blind 75, NeetCode 150, Striver SDE, Grind 75).
- **In-platform solutions**: approach, complexity analysis, and sample code — no leaving the site.
- **LeetCode integration** and **4-state progress** (Not Started / In Progress / Solved / Revision).

### Accounts & data
- Google sign-in (Supabase Auth) with a **single-tap auth experience** and intended-destination redirect.
- **Centralized route protection** — protected pages require login; direct-URL access is guarded.
- **Per-user data isolation** so accounts never share progress on the same device.

---

## Run locally

**Prerequisites:** Node 20+ and a Supabase project (Postgres + Auth) — set the
connection string and keys in `server/.env` / `client/.env`.

```bash
# 1. Install dependencies
npm run install:all

# 2. Configure environment
cp server/.env.example server/.env
#    set GROQ_API_KEY, DATABASE_URL, SHADOW_DATABASE_URL, JWT_SECRET

# 3. Create the database schema
cd server && npm run db:migrate && npm run db:seed && cd ..

# 4. Start dev servers (client + API)
npm run dev
```

See [`DATABASE_SETUP.md`](DATABASE_SETUP.md) for the full database guide (schema,
migrations, backup/restore) and [`PLACEMENT_HUB.md`](PLACEMENT_HUB.md) for the
Placement Hub architecture.

## Deploy (Vercel + Supabase)

1. Create a **Supabase** project; copy the Postgres connection string (pooled).
2. Apply migrations against it: `cd server && DATABASE_URL="<supabase-url>" npx prisma migrate deploy`.
3. In **Vercel → Settings → Environment Variables**, set `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_JWT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `GROQ_API_KEY` (and the `VITE_SUPABASE_*` client keys).
4. Push to `main` — Vercel builds and deploys automatically.

---

Made by **Ashutosh Sharma** — [www.linkedin.com/in/ashutoshsharma1309](https://www.linkedin.com/in/ashutoshsharma1309)

<!-- deploy-marker: 20260619142718 -->

<!-- vercel-author-fix: 1781880177 -->

<!-- vercel-rebuild-as-owner: 1781884735 -->
