# PrepPlace — AI-Powered Adaptive Learning & Placement Prep Platform

> ℹ️ This README describes the platform's earlier identity. For the **current**
> product overview (PrepPlace as a placement-prep workspace), see
> [`summary.md`](summary.md).

**Live:** https://prepnext.vercel.app

PrepPlace is a full-stack, production-deployed learning platform that generates
personalized study roadmaps and adapts every lesson, hint, and quiz to the
individual learner. It combines an AI adaptive-learning engine with a centralized
**Placement Training Hub** (DSA, web, ML/AI, core CS, aptitude, interviews) and
real user accounts with cloud-synced progress.

---

## Highlights

- **Full-stack TypeScript/Node app** deployed on **Vercel** (static SPA + serverless API) with a managed **PostgreSQL** database on **Supabase**.
- **Email/password authentication** — bcrypt-hashed credentials, JWT sessions, centralized route guards, and per-user data isolation.
- **18-table normalized relational schema** modeled in **Prisma 7** with versioned migrations, seed data, and a generic REST CRUD layer.
- **AI adaptive engine**: per-topic EWMA mastery scoring drives difficulty targeting (~70% success band), multi-style lesson generation, and spaced repetition (SM-2).
- **Placement Training Hub**: 10 sections, a data-driven resource architecture (no resources hardcoded in UI), progress tracking, and instant global search.
- **DSA practice hub**: 150 curated problems across 18 topics with in-platform solutions, complexity analysis, LeetCode integration, and 4-state progress tracking.
- **Performance & UX**: route-based code-splitting / lazy loading, memoized components, glassmorphism UI, framer-motion transitions, fully responsive, accessible (ARIA, keyboard nav).

---

## Architecture

```
React SPA (Vercel static)
   │  fetch /api/*
   ▼
Express app as a Vercel serverless function (api/index.js → server/app.js)
   │  Prisma 7  +  @prisma/adapter-mariadb
   ▼
MySQL (Railway in production · local MySQL in dev)
```

- **Frontend** and **API** are served from one Vercel domain; a rewrite routes `/api/*` into the serverless function.
- **CI/CD**: push to `main` → Vercel builds (`prisma generate` + `vite build`) and deploys automatically.
- **Secrets** (`DATABASE_URL`, `JWT_SECRET`, `GROQ_API_KEY`) live in Vercel/`.env` (git-ignored); only `.env.example` is committed.

---

## Tech stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 7, Tailwind CSS v4, React Router 7, framer-motion, react-markdown, jsPDF + qrcode |
| **Backend** | Node 20, Express 4 (ESM), serverless functions |
| **Database** | MySQL 8/9, Prisma 7 ORM, `@prisma/adapter-mariadb` driver, SQL migrations |
| **Auth** | bcryptjs (password hashing), JSON Web Tokens (sessions) |
| **AI** | Groq API (`openai/gpt-oss-120b`) with strict JSON mode + schema validation + retry |
| **Infra / DevOps** | Vercel (hosting + serverless), Railway (managed MySQL), Git-based CI/CD |

---

## Key features

### Adaptive learning engine
- **Per-topic EWMA mastery** (`α = 0.25`) feeds every recommendation.
- **Difficulty targeting** at ~70% expected success (the "desirable difficulty" band).
- **Multi-style lessons** — Visual / Code-first / Analogy / Step-by-step, switchable per lesson.
- **"I'm stuck"** re-explanation in a different style; **diagnose-on-wrong** micro-lessons.
- **Engagement watchdog** (focus, scroll-depth, tab-switches) triggers timely interventions.
- **SM-2-lite spaced repetition**: missed questions + unsolved problems resurface in `/review`.
- **Adaptive quizzes** and **client-side certificates** (PDF + QR + verifiable URL payload).

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
- Email/password auth with a **full-screen auth experience** and intended-destination redirect.
- **Centralized route protection** — protected pages require login; direct-URL access is guarded.
- **Per-user data isolation** so accounts never share progress on the same device.

---

## Run locally

**Prerequisites:** Node 20+ and a local MySQL instance.

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

## Deploy (Vercel + Railway)

1. Provision a managed **MySQL** on Railway; copy its public connection URL.
2. Apply migrations against it: `cd server && DATABASE_URL="<railway-url>" npx prisma migrate deploy`.
3. In **Vercel → Settings → Environment Variables**, set `DATABASE_URL`, `JWT_SECRET`, `GROQ_API_KEY`.
4. Push to `main` — Vercel builds and deploys automatically.

---

Made by **Ashutosh Sharma** — [www.linkedin.com/in/ashutoshsharma1309](https://www.linkedin.com/in/ashutoshsharma1309)

<!-- deploy-marker: 20260619142718 -->

<!-- vercel-author-fix: 1781880177 -->

<!-- vercel-rebuild-as-owner: 1781884735 -->
