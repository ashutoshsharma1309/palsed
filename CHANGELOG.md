# Changelog

Notable changes, most recent first. Dates are approximate.

## Unreleased

- Pending: refresh the rest of `README.md` to fully match the placement-OS
  positioning; difficulty-pill light-mode contrast pass.

## Recent

- **Testing:** added the first automated tests — Vitest unit suite (24 tests)
  covering the DSA learning engine (streak math, progress derivations, roadmap
  data integrity) — plus a GitHub Actions CI workflow gating every push/PR on
  typecheck → test → build.
- **Pivot:** PrepPlace reframed as a DSA Learning OS — learning dashboard,
  curated roadmap, per-topic lessons + C++ question banks, activity-based streak.

- **Feature:** added a **Career Roadmap** module (`/roadmap`, in the Prep nav) —
  14 role-based roadmaps with staged topics, must/good/optional skills, a shared
  interview-focused DSA module, CS fundamentals, curated courses, level-grouped
  projects, and localStorage progress tracking. Fully additive; built on the
  existing design system.
- **Docs:** corrected `README.md` stack references (Supabase Postgres + Google
  auth, `@prisma/adapter-pg`) that still described the old MySQL/Railway +
  email-password setup; expanded `summary.md` (roadmap, deployment, security,
  a11y, brand history, stats, TOC).
- **Docs:** added `summary.md` (current product overview) and `CONTRIBUTING.md`.
- **Theme:** full light/dark contrast sweep — replaced theme-unsafe
  `text-white` / `bg-white` / hardcoded hex colors with theme tokens so no text
  is invisible in either mode.
- **Auth/onboarding:** profile completion is now enforced — signed-in users are
  routed to `/onboarding` and must fill required fields (full name, college,
  branch, year, target roles) before using the app; LinkedIn/GitHub stay
  optional.
- **Branding:** renamed to **PrepPlace** (from PrepNxt; earlier candidates
  PrepNext/PrepKit were dropped for taken handles / trademark risk). Regenerated
  logo, profile picture, and LinkedIn banners.

## Earlier

- Auth simplified to Google-only via Supabase; post-signup profile setup.
- Migrated data layer to Supabase Postgres (Prisma + `@prisma/adapter-pg`).
- Expanded content: 85 curated recruiters, 82+ verified PYQs, 150 DSA problems.
- Pivot from "adaptive AI learning" to a **placement-season operating system**.
