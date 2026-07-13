# PrepNext — Phase 2 Product Evolution Report

**Date:** 2026-06-30
**Scope:** Reorganize navigation, remove obsolete features, add a Projects module, analyze the market, evaluate SaaS readiness, ship high-impact improvements, and audit the product.
**Companion docs:** [`COMPETITOR_ANALYSIS.md`](./COMPETITOR_ANALYSIS.md) · [`SAAS_READINESS.md`](./SAAS_READINESS.md)

> **Mission framing:** turn PrepNext from a DSA-leaning tool into the one platform a student opens daily across the whole journey — **Learn → Practice → Build → Interview → Placement** — without feature bloat.

---

## 1. Executive summary

PrepNext was a strong DSA learning product wearing a "placement OS" label. Phase 2 makes the label true:

- **Rebalanced the product around the placement journey** — navigation, dashboard, and mobile all now reflect Learn → Practice → Build → Interview → Placement instead of DSA-only.
- **Removed dead weight** — Resume Roast, the Applications kanban, and 9 orphaned legacy route files, plus all their references, imports, and storage keys. Smaller, clearer, faster.
- **Shipped the Projects module** — the market's biggest gap. 10 domains, 30 fully-specified resume-grade projects, structured learning paths, progress tracking. Nobody else does this well.
- **Verified end-to-end** — typecheck clean, 31/31 tests pass, production build green, key pages browser-verified in both themes.

Result: a focused, production-grade platform that is genuinely differentiated on **integration, projects, and calm UX**.

---

## 2. Product scorecard

Scores are *post-Phase-2*. Arrows show movement from the Phase-2 starting point.

| Dimension | Score | Δ | Notes |
|---|---|---|---|
| **UI / UX** | 9.0 / 10 | ▲ | Clean, ad-free, eye-comfort-tuned; journey-oriented IA; consistent design system. |
| **Architecture** | 8.5 / 10 | ▲ | Typed, lazy-routed, data-driven modules; dead code removed; clean separation. |
| **Learning experience** | 8.5 / 10 | ▲ | DSA + patterns + aptitude + **projects** + OA + PYQs, all structured with progress + SRS. |
| **Placement readiness** | 8.0 / 10 | ▲ | Full journey now covered; missing only a unified readiness *score* (roadmap #1). |
| **Performance** | 7.5 / 10 | → | Fast SPA; vendor bundles (pdf/markdown) are the next optimization. |
| **Accessibility** | 8.0 / 10 | → | Focus rings, skip-link, reduced-motion, comfort controls, semantic markup. |
| **Maintainability** | 8.5 / 10 | ▲ | One-file-per-domain data layer; shared components; -15 dead files. |
| **Scalability** | 7.0 / 10 | → | Scales to tens of thousands; needs server-synced progress for analytics. |
| **Business readiness** | 5.5 / 10 | → | Excellent B2C; B2B2C (college) layer is roadmapped, not built. |
| **Production readiness** | 7.0 / 10 | ▲ | Builds/tests/typechecks green; needs error tracking + monitoring + backups. |
| **Overall** | **7.9 / 10** | ▲ | A focused, production-grade B2C product; clear path to B2B2C. |

---

## 3. Files changed

### Deleted (15) — obsolete features & dead code
| File | Why |
|---|---|
| `routes/ResumeRoast.tsx`, `lib/resumeScorer.ts` | Resume Roast removed (out of the learn→place core). |
| `routes/Applications.tsx`, `hooks/useApplications.ts`, `types/application.ts`, `components/UpcomingRounds.tsx` | Applications kanban removed (tracking ≠ prep; not a daily learning driver). |
| `routes/Tutor.tsx`, `Courses.tsx`, `CourseDetail.tsx`, `CourseLesson.tsx`, `CourseQuiz.tsx`, `CourseCreate.tsx`, `Roadmaps.tsx`, `RoadmapDetail.tsx`, `RoadmapCreate.tsx` | Orphaned legacy routes from the pre-pivot AI era — 0 references, only reachable via redirects. |

### Modified (11)
| File | Change |
|---|---|
| `App.tsx` | Removed deleted routes; added `/projects`, `/projects/:domainId`, `/projects/:domainId/:projectId`; repointed `/tutor`→`/dashboard`; added graceful redirects for retired `/resume-roast` and `/applications`. |
| `components/layout/Nav.tsx` | Rebuilt nav: journey-ordered primary (Dashboard · DSA · Patterns · Aptitude · Projects · Mock OA) + a **journey-grouped "Prep" dropdown** (Practice / Interview / Placement); removed Resume Roast & Applications; SRS due-badge preserved. |
| `components/layout/MobileTabBar.tsx` | Added Projects to the bottom tab bar (Home · DSA · Patterns · Projects · Review). |
| `components/CommandPalette.tsx` | Removed Applications command; added Projects, Coding Patterns, and Mock OA commands. |
| `routes/Dashboard.tsx` | Rebalanced from "DSA journey" to "**placement journey**"; added the `JourneyMap`. |
| `routes/CompanyDetail.tsx` | Removed the application-tracking card and `useApplications` integration (and now-unused imports). |
| `routes/Landing.tsx` | Replaced Resume Roast & Application Tracker feature cards with **Projects** & **Coding Patterns**; updated steps, FAQ, and meta copy to the journey narrative. |
| `hooks/useLocalStorageState.ts` | Removed the dead `applications` storage key. |
| `styles/globals.css` | Comment cleanup (eye-strain comfort system was shipped previously). |
| `client/public/sitemap.xml` | Added `/patterns` and `/projects`. |
| `client/public/robots.txt` | Removed stale `Disallow: /applications`. |

### Added (20)
| File | Purpose |
|---|---|
| `data/projects/types.ts` | `ProjectDomain` / `Project` / `ProjectResource` type contract. |
| `data/projects/index.ts` | Registry + helpers (`getDomain`, `getProject`, `projectsByLevel`, totals). |
| `data/projects/{web-development, backend-development, ai-machine-learning, data-science, mobile-development, cloud-computing, devops, cybersecurity, blockchain, open-source}.ts` | 10 domains, 30 fully-specified projects. |
| `routes/Projects.tsx` | Domains grid (landing). |
| `routes/ProjectDomain.tsx` | Domain page: overview, learning path, project ladder, resources, tips, progress. |
| `routes/ProjectDetail.tsx` | Per-project build guide: objective, features, folder structure, tech, stretch goals, future improvements. |
| `components/projects/domainIcon.tsx` | Icon-name → lucide component map. |
| `components/dashboard/JourneyMap.tsx` | The 5-stage placement-journey map on the dashboard. |
| `COMPETITOR_ANALYSIS.md`, `SAAS_READINESS.md`, `PHASE2_REPORT.md` | Strategy deliverables. |

> Note: the reading-comfort system (`hooks/useReadingComfort.ts`, `components/ui/ComfortMenu.tsx`, comfort tokens in `globals.css`) shipped in the prior eye-strain pass and underpins the UI/UX and Accessibility scores above.

---

## 4. Features added

### Projects module (the headline)
**What:** 10 domains (Web, Backend, AI/ML, Data Science, Mobile, Cloud, DevOps, Cybersecurity, Blockchain, Open Source), each with an overview, skills required, recommended learning order, tech stack, curated GitHub + learning resources, and portfolio/resume/interview-relevance guidance. Each domain has a Beginner→Advanced ladder of projects; every project specifies **objective, features, suggested folder structure, recommended technologies, skills shown, stretch goals, and future improvements**. Progress is tracked (learning-path checklist + per-project "built" toggle) via the existing `useLearningProgress` store.

**Why it improves the product:** Resume-worthy projects are the single biggest unmet need in the market — no DSA platform offers structured project paths. It completes the "Build" stage of the journey, gives non-DSA-inclined students a path, and creates a defensible differentiator.

### Balanced placement-journey dashboard
**What:** A `JourneyMap` surfacing all five stages and their modules; hero recast from "DSA journey" to "placement journey."
**Why:** Orients every user to the full platform on day one and fulfills the "balanced dashboard" requirement — the product no longer *looks* DSA-only.

### Journey-oriented navigation
**What:** Primary nav follows the journey; a grouped "Prep" dropdown (Practice / Interview / Placement) organizes the rest without crowding; mobile tab bar and command palette updated.
**Why:** Clear information architecture that maps to how students actually progress, while keeping the bar clean.

### Leaner surface
**What:** Removed two off-mission features and nine dead files plus all references.
**Why:** Less to maintain, faster to grok, and a sharper product story — every remaining surface supports learning or placement.

---

## 5. Competitor analysis — summary

Full detail in [`COMPETITOR_ANALYSIS.md`](./COMPETITOR_ANALYSIS.md). The strongest idea from each:

- **Striver/TUF:** sheet + streak completion psychology; free-but-structured funnel.
- **NeetCode:** the pattern *roadmap graph* and ruthless curation.
- **LeetCode:** company-tagged problems + contest cadence.
- **GeeksforGeeks:** company-wise interview archives + breadth — *but avoid its ad clutter*.
- **HackerRank:** free certifications as resume signal; realistic OA environment.
- **CodeChef/Codeforces:** beginner contests + the addictive rating ladder.
- **InterviewBit:** gamification done right (XP/streaks/leaderboard) + anonymous peer mock interviews.
- **PrepInsta:** company-specific aptitude/OA exam-pattern mapping (TCS NQT etc.) + one low-cost all-access pass.
- **Scaler:** cohort accountability, mentorship, lifetime content access — *but avoid sales pressure & unverifiable claims*.
- **Coding Ninjas:** in-platform TA/doubt support at scale (500+ TAs) as a retention lever — *but avoid billing dark patterns*.
- **Unstop:** hackathon/off-campus opportunity layer, hiring-challenge-as-funnel, and a proven **"for Institutes" TPO motion** (validates the B2B2C path).

**The market gap:** every competitor is a *point solution*; none own the whole journey, none do structured projects, and most have cluttered or sales-heavy UX. **PrepNext's wedge = integration + projects + calm, trustworthy UX.**

---

## 6. Future roadmap — top 10 (ranked)

Not implemented; recommended order. (I = Impact, E = Effort, B = Business value, L = Learning value; ★ = high.)

| # | Improvement | I | E | B | L | Why now |
|---|---|---|---|---|---|---|
| 1 | **Server-synced progress** (persist `useLearningProgress` to Prisma) | ★★★★★ | ★★ | ★★★ | ★★★ | Fixes real defect (progress doesn't follow the student); unlocks analytics. |
| 2 | **Placement Readiness Score** (aggregate DSA+patterns+aptitude+projects+OA) | ★★★★★ | ★★★ | ★★★★ | ★★★★ | One number students chase and TPOs buy. |
| 3 | **Journey-wide gamification** (XP, streaks, rank ladder) | ★★★★ | ★★★ | ★★★ | ★★★ | Retention moat (InterviewBit-style) across the whole product. |
| 4 | **Email/notification digests** (weekly progress, streak nudges) | ★★★★ | ★★ | ★★★ | ★★ | Re-engagement; Notification model already exists. |
| 5 | **Free skill certifications** tied to roadmap completion | ★★★ | ★★★ | ★★★ | ★★★ | Resume signal (HackerRank-style); cert infra exists. |
| 6 | **Company-tagged everything** (PYQs + DSA + OA unified by company) | ★★★★ | ★★★ | ★★★ | ★★★ | Beats paywalled LeetCode tags; India-campus relevant. |
| 7 | **AI mock interview** (lightweight, rubric-based) | ★★★★ | ★★★★ | ★★★ | ★★★★ | Unlocks Scaler's value at no cost. |
| 8 | **College/TPO admin layer** (cohorts, dashboards, reports) | ★★★★★ | ★★★★★ | ★★★★★ | ★★ | The B2B2C business; build against a pilot (see SAAS_READINESS). |
| 9 | **Bundle/route-split heavy vendors** (pdf, markdown) | ★★★ | ★★ | ★★ | ★ | Faster loads; better Core Web Vitals. |
| 10 | **Live opportunity feed** (curated hackathons/off-campus) | ★★★ | ★★★ | ★★★ | ★★ | Completes "Placement"; Unstop-style, integrated. |

---

## 7. Verification

- `tsc --noEmit` — **clean**.
- `vitest run` — **31/31 passing**.
- `vite build` — **green** (~10s).
- Browser-verified (dev server, both themes): new navigation, Projects landing/domain/detail, and the journey dashboard all render correctly and consistently with the design system.
- Reference sweep confirms **no dangling imports/links** to removed features; redirects keep old URLs alive.
