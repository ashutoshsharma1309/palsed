# Changelog

Notable changes, most recent first. Dates are approximate.

## Recent

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
