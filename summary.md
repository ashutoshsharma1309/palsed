# PrepPlace — Project Summary

**Tagline:** *Your placement season, organized.*
**What it is:** An all-in-one **placement-preparation operating system for Indian college students** — track recruiters, drill real previous-year questions, practice DSA, and manage every application in one workspace.
**Live:** https://prepnext.vercel.app *(legacy deployment domain; a dedicated PrepPlace domain is planned)*
**Repo:** https://github.com/ashutoshsharma1309/palsed
**Status:** Live in production · early-stage · actively developed

> Note: the root `README.md` still describes the project's earlier identity ("AI adaptive learning platform"). This `summary.md` reflects the **current** product after the pivot to a placement-season workspace.

---

## Contents

- [Who it's for](#who-its-for)
- [By the numbers](#by-the-numbers)
- [What it does](#what-it-does)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Repository layout](#repository-layout)
- [Data model (Prisma)](#data-model-prisma)
- [Accessibility & theming](#accessibility--theming)
- [Security & privacy](#security--privacy)
- [Deployment](#deployment)
- [Branding](#branding)
- [Getting started (local development)](#getting-started-local-development)
- [Roadmap (near-term priorities)](#roadmap-near-term-priorities)
- [Brand history (naming journey)](#brand-history-naming-journey)
- [Status & known follow-ups](#status--known-follow-ups)

---

## Who it's for

- **Primary:** Indian engineering students (2nd–4th year / MTech) preparing for
  campus and off-campus placements and internships.
- **Also useful for:** any college student targeting tech, product, or analytics
  roles who wants recruiter intel, interview prep, and an application tracker in
  one place.

The problem it solves: placement season is run out of scattered WhatsApp groups,
rotting Google Docs, and ad-heavy prep sites. PrepPlace makes it a single,
organized, student-owned workspace.

---

## By the numbers

| Metric | Value |
|---|---|
| Curated recruiters | **85** |
| Verified PYQs | **82+** (and growing) |
| DSA problems | **150** across 18 topics |
| Placement Hub sections | **10** |
| Prisma data models | **~18** |
| Cost to students | **Free** |

---

## What it does

PrepPlace consolidates the chaos of campus placement season — recruiter info scattered across WhatsApp groups, PYQs lost in Drive folders, no clarity on eligibility or timelines — into a single student workspace.

### Core features
- **Recruiter Map / Companies vault** — 85+ curated recruiters with eligibility, rounds, OA platforms, and (verified-only) CTC bands.
- **PYQ Vault** — 82+ real, verified previous-year interview questions with expected approaches, sourced from public archives.
- **DSA Practice Hub** — 150 curated problems across 18 topics, in-platform solutions, complexity analysis, LeetCode integration, and 4-state progress tracking.
- **Applications Tracker** — a kanban board for the placement season (Wishlist → OA → Tech → HR → Offer) with deadlines, notes, and conversion rate.
- **Career Roadmaps** — role-based learning roadmaps (14 software/IT roles) with staged topics, must/good/optional skills, a shared interview-focused DSA module, CS fundamentals, curated courses, level-grouped projects, and localStorage progress tracking.
- **Per-Company Prep Kits** — DSA + PYQ + topic bundles composed per recruiter.
- **OA Mock Tests** — timed, self-graded mock online-assessments with a rubric.
- **Supporting tools** — Resume Roast, Salary insights, Company Compare, Placement Hub (10 curated sections), Certificates (shareable + verifiable), Mastery radar, and Engagement analytics.

#### Key routes

| Route | Page |
|---|---|
| `/` | Landing (public) |
| `/onboarding` | Profile setup (required before any feature) |
| `/dashboard` | Student home |
| `/companies`, `/companies/:slug` | Recruiter map + per-company detail |
| `/pyq`, `/pyq/submit` | PYQ vault + contribution |
| `/dsa`, `/dsa/:slug` | DSA hub + problem |
| `/applications` | Applications kanban tracker |
| `/oa`, `/oa/test/:id`, `/oa/result/:id` | Mock online assessments |
| `/roadmap` | Career roadmaps (role selection + progress) |
| `/placement-hub`, `/resume-roast`, `/salary`, `/compare` | Supporting tools |
| `/certificates`, `/verify-certificate` | Issue + public verification |

## Onboarding & access control
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

## Accessibility & theming

- **Dark + light themes** via CSS custom properties on `[data-theme]`, resolved
  from stored preference or the system `prefers-color-scheme`.
- **Theme-aware UI:** colors are driven by tokens (`--color-text`, `--color-bg`,
  `--severity-*`, …) so text stays legible in both modes; a recent sweep removed
  hardcoded white/black/hex colors that broke contrast.
- **A11y:** ARIA attributes, keyboard navigation, focus states, and a command
  palette (⌘K) for fast navigation.

---

## Security & privacy

- **Auth:** Supabase-issued JWTs are verified server-side; protected API routes
  sit behind a `requireAuth` guard and the SPA behind a `RequireAuth` boundary.
- **Per-user isolation:** data access is scoped to the authenticated user id.
- **Server-side validation:** the profile endpoint trims, length-caps, and
  whitelists inputs (branch + roles) — the client object is never trusted.
- **Secrets:** service-role keys and DB URLs live only in environment variables
  (git-ignored); the public Supabase anon key is the only client-exposed key.

---

## Deployment

- **Hosting:** Vercel — the Vite SPA is served statically and `/api/*` is
  rewritten into a single Express serverless function (`api/index.js`).
- **CI/CD:** push to `main` → Vercel builds (`prisma generate` + `vite build`)
  and deploys automatically.
- **Database & auth:** Supabase (managed Postgres + Google OAuth).
- **Secrets:** configured as environment variables in Vercel / Supabase; only
  `.env.example` files are committed.

---

## Roadmap (near-term priorities)

1. **Custom domain** — move off `prepnext.vercel.app` to a PrepPlace `.in`/`.com`
   (biggest credibility + SEO + email-deliverability win).
2. **Public, indexable artefact pages** — expose `/companies/:slug` and `/pyq`
   to crawlers (SSR/prerender) for long-tail placement search traffic.
3. **Refresh `README.md`** to the placement-OS positioning.
4. **Viral loops** — shareable certificates / offer cards / PYQ contributions.
5. **Light-mode polish** — difficulty-pill contrast pass.

---

## Brand history (naming journey)

The brand went through several names before landing on **PrepPlace**:

| Name | Why dropped |
|---|---|
| PrepNext | Taken on LinkedIn + existing brand collision |
| PrepNxt | Taken on LinkedIn |
| PrepKit | Existing exam-prep brand (high trademark/SEO risk) + clashes with the in-app "Prep Kit" feature |
| **PrepPlace** ✅ | Coined, on-theme (placement), domains broadly available |

Each rename was applied as a guarded, repo-wide migration that preserved the
live deployment URL (`prepnext.vercel.app`) and `localStorage`/session keys to
avoid breaking production or logging users out.

---

## Status & known follow-ups

- **Deployed and live** on Vercel; pushes to `main` auto-deploy.
- **Domain:** still on `prepnext.vercel.app`; a real PrepPlace domain (e.g.
  `.in`) is the top growth priority flagged across the strategy reports.
- **README** needs a refresh to match the current placement-OS positioning.
- **Difficulty pills** (Easy/Medium/Hard) use inline color tints that are
  slightly low-contrast in light mode — candidate for a follow-up theme pass.

---

## Related documents

- [`README.md`](README.md) — original platform readme (being refreshed).
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — how to set up and contribute.
- [`CHANGELOG.md`](CHANGELOG.md) — notable changes over time.
- [`DATABASE_SETUP.md`](DATABASE_SETUP.md) — database/schema reference.
- Strategy/analysis reports: `INVESTOR_MEMO.md`, `CTO_REPORT.md`,
  `GROWTH_REPORT.md`, `MARKETING_MASTERPLAN.md`, `SEO_MASTER_PLAN.md`,
  `PRODUCT_ROADMAP.md`, and more in the repo root.

---

## License

No open-source license file is currently committed, so all rights are reserved
by default. If the project is intended to be open source, add a `LICENSE` file
(e.g. MIT) — until then, treat the code as proprietary.

---

*Maintained by the PrepPlace team. See [`CHANGELOG.md`](CHANGELOG.md) for recent
changes and [`CONTRIBUTING.md`](CONTRIBUTING.md) to get involved.*
