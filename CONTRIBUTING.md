# Contributing to PrepPlace

Thanks for your interest in improving PrepPlace. This is a small, fast-moving
codebase — keep changes focused and consistent with what's already there.

## Setup

See [`summary.md`](summary.md#getting-started-local-development) for local setup.
Short version: `npm run install:all`, add `server/.env` + `client/.env`, then
`npm run dev`.

## Before you open a PR

- **Type-check, test & build:** `cd client && npm run typecheck && npm test && npm run build` (CI runs the same three on every PR).
- **Match the surrounding code** — naming, structure, and comment density.
- **Theme safety:** use CSS variables (`var(--color-*)`), not hardcoded
  `text-white` / hex colors, so UI works in both light and dark mode.
- **Keep commits small and descriptive**, one logical change each.

## Commit message style

- Use an imperative, scoped subject: `area: what changed`
  (e.g. `summary.md: add deployment section`, `auth: enforce profile completion`).
- Keep the subject under ~72 characters; add a body for context when useful.

## Branding

The product name is **PrepPlace**. The `PrepKit` component is a *feature*
(per-company prep kit), not the brand — don't rename it.

## Reporting issues

Open a GitHub issue with: what you expected, what happened, steps to reproduce,
and your browser/OS. For UI bugs, note which **theme** (light/dark) and attach a
screenshot if possible.

## Areas that need help

See the [roadmap in `summary.md`](summary.md#roadmap-near-term-priorities).
