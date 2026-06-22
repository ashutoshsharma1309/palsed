# PrepPlace — Project Summary

**Tagline:** *Your placement season, organized.*
**What it is:** An all-in-one **placement-preparation operating system for Indian college students** — track recruiters, drill real previous-year questions, practice DSA, and manage every application in one workspace.
**Live:** https://prepnext.vercel.app *(legacy deployment domain; a dedicated PrepPlace domain is planned)*
**Repo:** https://github.com/ashutoshsharma1309/palsed

> Note: the root `README.md` still describes the project's earlier identity ("AI adaptive learning platform"). This `summary.md` reflects the **current** product after the pivot to a placement-season workspace.

---

## What it does

PrepPlace consolidates the chaos of campus placement season — recruiter info scattered across WhatsApp groups, PYQs lost in Drive folders, no clarity on eligibility or timelines — into a single student workspace.

### Core features
- **Recruiter Map / Companies vault** — 85+ curated recruiters with eligibility, rounds, OA platforms, and (verified-only) CTC bands.
- **PYQ Vault** — 82+ real, verified previous-year interview questions with expected approaches, sourced from public archives.
- **DSA Practice Hub** — 150 curated problems across 18 topics, in-platform solutions, complexity analysis, LeetCode integration, and 4-state progress tracking.
- **Applications Tracker** — a kanban board for the placement season (Wishlist → OA → Tech → HR → Offer) with deadlines, notes, and conversion rate.
- **Per-Company Prep Kits** — DSA + PYQ + topic bundles composed per recruiter.
- **OA Mock Tests** — timed, self-graded mock online-assessments with a rubric.
- **Supporting tools** — Resume Roast, Salary insights, Company Compare, Placement Hub (10 curated sections), Certificates (shareable + verifiable), Mastery radar, and Engagement analytics.

### Onboarding & access control
- **Google sign-in** (Supabase Auth) — single-tap, no passwords.
- **Profile completion is enforced**: a signed-in user is routed to `/onboarding` and cannot reach any feature until the required fields are filled.
  - **Required:** full name, college, branch, year of study, target roles.
  - **Optional:** LinkedIn, GitHub.

---

## Tech stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 7, Tailwind CSS v4, React Router 7, framer-motion, Monaco editor, Mermaid, react-markdown, jsPDF + qrcode |
| **Backend** | Node 20, Express 4 (ESM), deployed as a Vercel serverless function (`api/index.js` → `server/app.js`) |
| **Database** | PostgreSQL (Supabase) via Prisma ORM with the `@prisma/adapter-pg` driver |
| **Auth** | Supabase Auth (Google OAuth); server-side JWT verification + route guards |
| **AI (selected tools)** | Groq API for prompt-backed features |
| **Infra / DevOps** | Vercel (hosting + serverless), Supabase (DB + Auth), Git-based CI/CD (push to `main` → auto-deploy) |
| **Theming** | Runtime dark/light themes via CSS custom properties (`[data-theme]`), fully theme-aware UI |

---

## Architecture

```
React SPA (Vercel static)
   │  fetch /api/*
   ▼
Express app as a Vercel serverless function (api/index.js → server/app.js)
   │  Prisma + @prisma/adapter-pg
   ▼
PostgreSQL (Supabase)  +  Supabase Auth (Google)
```

- Frontend and API are served from one Vercel domain; a rewrite routes `/api/*` into the serverless function.
- Secrets (`DATABASE_URL`, `SUPABASE_*`, `GROQ_API_KEY`) live in environment variables; only `.env.example` is committed.

---

## Repository layout

```
client/            React + Vite SPA (routes, components, hooks, lib, styles)
server/            Express API, Prisma schema + seed, prompts, routes
api/               Vercel serverless entry that mounts the Express app
linkedin-assets/   Brand kit (logo, banners, launch mockup) — PrepPlace
*.md               Strategy/analysis reports (investor, CTO, growth, SEO, etc.)
summary.md         This file
```

---

## Data model (Prisma)

A normalized relational schema (~18 models) including `User`, `Certificate`,
`DsaProblemStatus` / `DsaAttempt` / `DsaBookmark`, `MasteryEntry`, `SRSItem`,
`EngagementDay` / `EngagementIntervention`, `Note`, and `Notification`, plus
legacy learning models (`Course`, `Chapter`, `Lesson`, `Roadmap`, `Tutor*`)
retained from the platform's earlier identity.

---

## Branding

- **Name:** PrepPlace (evolved from PrepNxt; "PrepNext"/"PrepKit"/"PrepNxt" were
  earlier names dropped due to taken handles / trademark collisions).
- **Identity:** bold "P" mark on neon green (`#c8ff3d`) over near-black; clean,
  modern, premium.
- **Taglines:** *"Your placement season, organized."* (primary) · *"Prep. Place. Placed."* (punch line).
- **Assets:** `linkedin-assets/` holds the profile logo, personal + company-page
  banners, and a product launch mockup.

---

## Getting started (local development)

```bash
# 1. Install dependencies (root + client)
npm run install:all

# 2. Configure environment
#    server/.env  — DATABASE_URL, SUPABASE_URL, SUPABASE_JWT_SECRET,
#                   SUPABASE_SERVICE_ROLE_KEY, GROQ_API_KEY
#    client/.env  — VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
#    (copy from the committed .env.example files)

# 3. Run server + client together (Express writes .ports.json; Vite waits on it)
npm run dev
```

Useful scripts: `npm run build` (production client build), `npm start`
(production server), `npm run db:seed` / `db:migrate` (from `server/`).

---

## Status & known follow-ups

- **Deployed and live** on Vercel; pushes to `main` auto-deploy.
- **Domain:** still on `prepnext.vercel.app`; a real PrepPlace domain (e.g.
  `.in`) is the top growth priority flagged across the strategy reports.
- **README** needs a refresh to match the current placement-OS positioning.
- **Difficulty pills** (Easy/Medium/Hard) use inline color tints that are
  slightly low-contrast in light mode — candidate for a follow-up theme pass.
