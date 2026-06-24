# Career Roadmap Module

A role-based learning-roadmap feature added to PrepPlace. Fully additive — it
introduces no changes to existing layouts, auth, or the database, and is built
entirely on the existing design system.

## Entry point

- **Nav:** Prep dropdown → **Roadmap**
- **Route:** `/roadmap` (inside the existing `RequireAuth` boundary)

## What it does

1. User picks a target role (14 software/IT roles).
2. A complete roadmap is generated from data: staged learning timeline, skills,
   DSA, CS fundamentals, courses, projects, and a progress dashboard.

## Architecture

| Concern | File |
|---|---|
| Content (roles, DSA, CS, courses, projects) | `client/src/data/roadmaps.ts` |
| Progress (localStorage, reactive) | `client/src/hooks/useRoadmapProgress.ts` |
| Presentation | `client/src/routes/Roadmap.tsx` |

Content, progress, and presentation are intentionally decoupled. Progress is
keyed by stable **global content id**, so shared items (DSA questions, CS topics)
count across every roadmap that includes them.

## Roles (14)

Frontend · Backend · Full Stack · SDE · DevOps · Cloud · Cybersecurity ·
Data Engineer · ML Engineer · AI Engineer · Mobile · Blockchain · SRE · Game Dev.

Each role defines: 4 stages (Foundations → Core → Intermediate → Advanced),
must/good/optional skills (with description, why-it-matters, difficulty, est.
time), curated courses, and level-grouped projects.

## Shared modules

- **DSA** — 12 categories (Arrays → DP basics), interview-focused (Easy →
  Medium only; no competitive-programming), 5–10 curated questions each with
  difficulty + importance + estimated time.
- **CS Fundamentals** — OS, DBMS, Computer Networks, OOP; each topic carries an
  importance level, interview relevance, and learning resources.

## Progress tracking

- 3-state for topics (Not Started → In Progress → Completed); done/undone for
  DSA questions, CS topics, skills, and projects.
- Persisted in `localStorage` (`prepnext.roadmap.*`) via the same
  `useLocalStorageState` subscriber model the rest of the app uses.
- Dashboard shows overall completion plus per-section bars (Topics, DSA, CS,
  Projects).

## Extending it

Add a role by appending one `Role` object to `ROLES` in `data/roadmaps.ts` — no
UI changes required. The schema is shaped so AI-generated roadmaps can emit the
same `Role` object and slot in unchanged.
