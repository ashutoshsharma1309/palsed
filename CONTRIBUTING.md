# Contributing to PrepPlace

Thanks for your interest in improving PrepPlace. This is a small, fast-moving
codebase — keep changes focused and consistent with what's already there.

## Setup

See [`summary.md`](summary.md#getting-started-local-development) for local setup.
Short version: `npm run install:all`, add `server/.env` + `client/.env`, then
`npm run dev`.

## Before you open a PR

- **Type-check & build:** `cd client && npx tsc --noEmit` and `npm run build`.
- **Match the surrounding code** — naming, structure, and comment density.
- **Theme safety:** use CSS variables (`var(--color-*)`), not hardcoded
  `text-white` / hex colors, so UI works in both light and dark mode.
- **Keep commits small and descriptive**, one logical change each.

## Branding

The product name is **PrepPlace**. The `PrepKit` component is a *feature*
(per-company prep kit), not the brand — don't rename it.

## Areas that need help

See the [roadmap in `summary.md`](summary.md#roadmap-near-term-priorities).
