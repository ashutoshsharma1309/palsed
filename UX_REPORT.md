# UX_DIRECTOR REPORT

## 1. Executive Summary

- **The product's positioning is fighting itself in three places at once.** `index.html` sells "Adaptive AI Learning Universe," `Landing.tsx` sells "Placement Season Operating System" + "0 AI calls," and `Nav.tsx` shows 13 top-level links that span both stories. A student arriving from Google has no idea whether this is a course platform, a tracker, or a vault. Linear, Notion, Stripe — none of them ever have to ask "what am I actually looking at?" PrepPlace does, every time.
- **Information architecture is the single biggest blocker to retention.** A 13-item flat nav (Dashboard, Companies, PYQ Vault, My Apps, Internships, DSA, Placement Hub, Review, Mastery, System Design, Core CS, Aptitude, Interview) with overlapping concepts (Dashboard vs. Placement Hub vs. Applications; Mastery vs. Review) violates Miller's 7±2 and makes the product feel like a hackathon. There is no primary action, no progressive disclosure, no grouping.
- **The Landing page promises a job-search workflow and the Dashboard delivers a learning analytics console.** `Dashboard.tsx` opens with a Donut, Radar, mastery EWMA, streaks and "preferred style" copy. That's a course-app dashboard, not a placement OS. The user's first authenticated screen should be "the company visiting your campus on Friday and what to do today" — instead it's a chart.
- **The typography system has personality but no rhythm.** Five display fonts (`Anton`, `Bebas Neue`, `Inter`, `Share Tech Mono`, plus a "display" class with `[13vw]` headlines) on Landing, neon color tokens everywhere, mono-tracked uppercase labels on every page — it reads as one note played at full volume. Linear and Stripe earn loud moments by surrounding them with calm. PrepPlace has no calm.
- **Mobile is an afterthought in a market where >85% of Indian undergrads access prep tools on a phone first.** The Landing hero uses `text-[13vw]` (clips on narrow screens), Nav collapses 13 links into a two-column dump, Applications kanban has 8 columns side-by-side, and there is no bottom-tab pattern. Competitors (Unstop, PrepInsta) ship a mobile-first feed. This will quietly cap signup → activation at ~20%.

## 2. Current State

PrepPlace looks and feels like a strong design-systems prototype built by an engineer with taste, surfaced before a product designer had a chance to do an audit. The good news: the visual language (neon-on-black, mono labels, oversized display headlines, the chip + card system in `components/ui/`) is distinctive and immediately recognizable. That is rare and worth protecting.

The bad news: there is no information hierarchy, no clear primary user, and the experience contradicts itself between the marketing surface and the app shell. Concretely:

- **Landing** (`routes/Landing.tsx`) leads with "Your placement season" — a job-tracker pitch — but the `<title>` and OG card still say "Adaptive AI Learning Universe." Link previews on WhatsApp (where 90% of campus referrals will happen) will show the wrong story.
- **Dashboard** (`routes/Dashboard.tsx`) opens with `DASHBOARD.` in 7xl Bebas Neue, then four metric tiles, then a `MasteryEntry` radar — all derived from local-storage hooks (`useLocalStorageState`, `useMastery`). Most data is empty for a new user, so first-run is a wall of zeros and a "0% conversion" stat. There is no empty-state design.
- **Navigation** (`components/layout/Nav.tsx`) lists 13 routes in a sticky pill bar. There is no IA — Dashboard, Placement Hub, Applications, Review, Mastery, Engagement, and Internships could all reasonably be the same page. The user has to learn the product's internal model to navigate.
- **Routes still shipping that are dead** (`Courses.tsx`, `Roadmaps.tsx`, `Tutor.tsx`, `CourseLesson.tsx`, etc.) bloat the bundle and confuse anyone reading the file tree. `App.tsx` redirects `/courses` and `/roadmaps`, but the components, the Prisma models (`Course`, `Chapter`, `Lesson`, `Roadmap`, `TutorThread`), and the seed data are still alive.
- **The dual auth stack** (legacy JWT + Supabase) means two failure modes during onboarding — and onboarding is where every Indian student funnel leaks. There is no single canonical "create account → first value" path.
- **Accessibility** is not actively considered. Neon-green (#A6FF3D-ish) on near-black backgrounds passes contrast at large sizes but fails at small body sizes (most "// placement season" labels). Focus rings rely on browser defaults. No skip link. The hamburger toggle has `aria-label` but the menu itself is just a 2-col grid with no `role="menu"`.
- **Mobile** is functional but not designed. The `applications` kanban with 8 columns horizontally on a 360px phone is not usable. Companies grid is fine. PYQ submission flow has no save-draft on a flaky 3G connection — a real failure mode in tier-2 colleges.

## 3. Critical Issues

| # | Issue | Impact | Effort | Priority |
|---|-------|--------|--------|----------|
| 1 | Brand promise contradicts itself across `index.html` <title>/OG, `Landing.tsx` hero, and Nav IA — "AI learning" vs "zero AI placement OS" | HIGH — kills SEO clarity, link previews, and word-of-mouth pitch | LOW (1 day) | P0 |
| 2 | 13-item flat nav (`Nav.tsx` LINKS array) with no grouping or primary action | HIGH — blocks orientation, makes mobile unusable | MED (1 week) | P0 |
| 3 | First-run Dashboard shows empty zeros, learning-app metrics (Radar, Donut, Mastery) instead of placement-season urgency | HIGH — primary activation moment fails | MED (1 week) | P0 |
| 4 | Applications kanban (`Applications.tsx`) uses 8-column layout (`KANBAN_COLS`) that does not survive <1024px | HIGH for mobile (the actual target audience) | MED | P0 |
| 5 | No empty states designed across PYQ Vault, Internships, Mastery, Engagement — new users see "0 / undefined" | HIGH — confirms "this is a hackathon" perception | MED | P1 |
| 6 | Typography: 5 font families loaded, `text-[13vw]` headline, neon color token used as both accent and body emphasis | MED — feels chaotic, undermines trust | LOW (2 days) | P1 |
| 7 | Accessibility: contrast on `// label` micro-copy, no focus-visible styles in `Button.tsx`, no skip-link, kanban not keyboard-navigable | MED — also tanks Lighthouse score for SEO | MED | P1 |
| 8 | Dead routes shipping (`Courses`, `Roadmaps`, `Tutor`, `CourseLesson`, etc.) — bundle bloat + cognitive load for contributors | MED — slows iteration, hurts LCP on mobile | LOW (1 day) | P1 |
| 9 | No per-route metadata: PYQ pages, company pages, DSA problems all share one `<title>` — invisible to Google | HIGH for SEO (a stated gap) | MED | P1 |
| 10 | Onboarding (`routes/Onboarding.tsx`) is public + optional + asks for "learning goal" and "preferred style" — irrelevant to a placement OS | MED — leaks new signups | LOW | P2 |
| 11 | Command palette (`CommandPalette.tsx`) is a power-user feature but no discoverability hint anywhere (no `⌘K` chip in Nav like Linear/Notion) | LOW | LOW | P2 |
| 12 | No design tokens file — `--color-neon`, `--color-card` declared ad hoc; no spacing/typography scale codified | MED long-term, LOW short-term | MED | P2 |

## 4. Recommendations

### 4.1 Pick one story. Ship it everywhere.

Rip the "AI Learning Universe" copy out of `index.html`, `<meta name="description">`, OG, Twitter card, and any Tutor/Courses references. The product is **"The placement-season OS for Indian engineering students."** That's the headline. That's the OG. That's the Nav. Every surface — `Landing.tsx` hero, sub-head, footer, `Dashboard.tsx` H1, README — uses the same nine-word definition. This is what Linear does relentlessly ("the issue tracking tool you'll enjoy using") and what PrepPlace currently does not.

### 4.2 Collapse the 13-item nav into 5.

Reorganize `components/layout/Nav.tsx` `LINKS` array around the user's actual mental model:

1. **Home** (Dashboard, but rebuilt — see 4.3)
2. **Companies** (Recruiter map + PYQ Vault as a tab inside the company detail page — they belong together; there is no reason to maintain `/pyq` as a sibling of `/companies` when every PYQ has a `companySlug`)
3. **Pipeline** (Applications kanban + Calendar + Internships — these are one workflow)
4. **Practice** (DSA + System Design + Core CS + Aptitude + Review — they are all the same intent: "I have time to study, give me something")
5. **Me** (Mastery, Engagement, Certificates, Settings — profile-shaped things in a dropdown, not in the top bar)

This is the Notion approach: 5 sidebar items, infinite depth. Stripe Dashboard does the same — 5–6 top-level rails. Hide `/review` behind a notification badge in the avatar, not a top-level link.

### 4.3 Rebuild the Dashboard around urgency, not analytics.

Replace the Donut/Radar opener in `Dashboard.tsx` with a **"This week"** card structure:

- **Hero**: "3 companies visiting your campus in the next 14 days." Each with a logo, deadline countdown, and a one-tap "Open prep kit" button — directly leveraging `usePlacementProgress` and `useApplications.upcoming`.
- **Then**: "Today's queue" — 5 PYQs / 1 DSA problem / 1 SRS card. Pre-computed. No empty state — for a brand-new user, seed it from the first company they bookmarked during onboarding.
- **Then, and only then**: the analytics (Mastery radar, streak, conversion rate). These are the *consequence* of doing the work, not the work itself. Stripe's dashboard does this perfectly: payment volume first, MRR breakdowns second.

The current `<Stat2>` tile pattern is fine — keep it, just demote it.

### 4.4 Redesign Applications for mobile-first.

The 8-column kanban (`KANBAN_COLS` in `Applications.tsx`) is desktop ergonomics applied to a phone use-case. Options, ranked:

- **Best**: a vertical card list grouped by status, with status as a chip and a swipe-to-advance gesture (like Things 3 or Linear mobile). The kanban becomes a desktop-only `lg:` view.
- **Cheap**: collapse Tech1/Tech2/Tech3 into one "Interviews" column with a stage chip. Reduces 8 columns to 6, which fits a tablet.
- **Tactical**: add horizontal snap-scroll on mobile with column dots — better than current overflow but still wrong for the form factor.

### 4.5 Build a typography & color rhythm.

The current display stack uses `Anton`, `Bebas Neue`, `Inter`, `Share Tech Mono` — drop to two: one display (pick Bebas Neue; it's the loudest and most distinctive) and Inter. Drop `Anton`. The mono is fine for labels but limit it to one role: micro-labels above section headers (the `// placement season` pattern). Currently mono is used for labels, stats, percentages, and chips simultaneously.

For color, neon-green is the brand. Use it for **one** thing per screen — the primary action, or the primary status, never both. Currently `Dashboard.tsx` uses `text-[var(--color-neon)]` 11 times in 318 lines. Apple's HIG does this surgically: blue is for one tappable thing per screen. Compare with Linear, where purple appears 1–2 times per view.

Codify this. Create `client/src/styles/tokens.css` with: 4 type sizes (display-xl, display, body, micro), 3 surfaces (`bg-app`, `bg-card`, `bg-elevated`), 1 accent (`accent-neon`), 1 spacing scale (4/8/12/16/24/32/48). Refactor `Card.tsx`, `Button.tsx`, `Chip.tsx` to consume tokens only.

### 4.6 Empty states are screens, not afterthoughts.

PYQ Vault, Internships, Mastery, Engagement, Applications, and Review all render numerical zeros on first run. Design real empty states with: an illustration or a glyph, one sentence of context, one CTA. Notion's empty states are the gold standard — every database starts with "Drag a template here or create your first row." PrepPlace should do this for: "Track your first application," "Bookmark a company to start your prep kit," "Submit a PYQ and earn a verified badge."

### 4.7 Per-route SEO + prerender.

Vite SPA + no SSR is killing discoverability. Add `react-helmet-async` and emit a unique `<title>` and `<meta description>` per route. For `/companies/:slug`, the title should be "Google placement process at Indian colleges — eligibility, package, rounds | PrepPlace" — exactly the long-tail query a 3rd-year would Google. Pair this with `vite-ssg` or `@vitejs/plugin-react` + a prerender pass for the top 50 company pages + Landing. This is the single highest-ROI SEO move and it's a 2-day job.

### 4.8 Onboarding: cut everything that isn't placement-shaped.

Drop "learning goal," "preferred style," "daily minutes" from `Onboarding.tsx`. Replace with: "Which year are you in?" (2nd/3rd/4th) + "Which companies are visiting your campus?" (multi-select from `COMPANIES`) + "Target role?" (SDE/Data/Product). Use those three answers to seed the kanban and the Dashboard "This week" card. Activation jumps from "saw the dashboard" to "saw 3 cards with their actual target companies." That's the Linear "create your first issue during signup" move.

### 4.9 Surface the command palette.

Linear, Notion, Vercel, Stripe, Raycast — every product-led tool shows `⌘K` somewhere in the chrome. Add a small `⌘K Search` button in the Nav (between the streak and the avatar) that opens `CommandPalette.tsx`. Bonus: on mobile, replace it with a magnifying glass that opens the same palette. This single change makes the product feel 2x more serious.

### 4.10 Delete dead code now.

Remove `Courses.tsx`, `CourseDetail.tsx`, `CourseLesson.tsx`, `CourseQuiz.tsx`, `CourseCreate.tsx`, `Roadmaps.tsx`, `RoadmapCreate.tsx`, `RoadmapDetail.tsx`, `Tutor.tsx` from `client/src/routes/`. Remove the redirects in `App.tsx`. Drop the `Course`, `Chapter`, `Lesson`, `Roadmap`, `TutorThread`, `TutorMessage` models from `prisma/schema.prisma` after one migration. This is a 1-day cleanup that removes ~30% of the surface area new contributors and Claude tools have to reason about.

## 5. 30-Day Priorities

1. **Unify the positioning (Day 1–2).** Rewrite `index.html` `<title>`, meta description, OG, Twitter, and `Landing.tsx` hero to one nine-word definition. Replace `/og-image.svg` with a render that matches the new pitch. Deliverable: a PR diff covering the 6 surfaces.
2. **Collapse the nav (Day 3–7).** Reduce `Nav.tsx` LINKS from 13 to 5 grouped categories. Move `/pyq` under the company-detail page as a tab. Move `/review` into a notification badge on the avatar. Deliverable: new Nav.tsx + a single redirect file for old URLs.
3. **Rebuild Dashboard top-fold (Week 2).** Replace the H1 + 4 stat tiles + Mastery radar with a "This week" hero card driven by `useApplications().upcoming` and the user's bookmarked companies. Deliverable: redesigned `Dashboard.tsx` plus 3 first-run seed states.
4. **Onboarding rewrite (Week 2).** Replace `Onboarding.tsx` with year + target-companies + target-role flow. Wire to local state and Supabase. Deliverable: new 3-step Onboarding screen with skip-to-app at any point.
5. **Per-route SEO (Week 3).** Install `react-helmet-async`, write a `<Seo>` component, set unique titles/descriptions for Landing, Companies (50 detail pages), PYQ Vault. Generate sitemap.xml from the routes table. Deliverable: 60+ uniquely-titled URLs.
6. **Mobile Applications view (Week 3).** Ship a vertical-list mobile view of the kanban; preserve desktop kanban behind `lg:`. Deliverable: re-flowed `Applications.tsx`.
7. **Empty states pass (Week 4).** Design + implement empty states for PYQ Vault, Internships, Applications, Mastery, Engagement. Deliverable: 5 redesigned components, all with single CTA + glyph + one-sentence copy.

## 6. 90-Day Priorities

1. **Design tokens + Storybook.** Codify color, spacing, type scale in `tokens.css`. Add Storybook for `components/ui/` so design changes can be reviewed without running the full app.
2. **SSR or prerender the top 50 company pages + Landing.** Move from SPA to `vite-ssg` or equivalent. This compounds the SEO work from month 1.
3. **Accessibility audit + fixes.** Run axe on every route, fix contrast on `// label` micro-copy, add `focus-visible` rings in `Button.tsx` / `Chip.tsx`, add a skip-link, make the kanban keyboard-navigable, add `role="menu"` semantics to the avatar dropdown. Target Lighthouse a11y >= 95 on all primary routes.
4. **Mobile bottom-tab shell.** Build a 5-icon bottom nav (Home, Companies, Pipeline, Practice, Me) that replaces the hamburger on phones. The hamburger pattern has zero discoverability on mobile and is a known funnel-killer.
5. **Delete legacy auth + dead courses code.** Decommission custom JWT auth, drop `passwordHash` from `User`, remove Tutor/Course/Roadmap models. This is a hygiene play that pays back in every future iteration.
6. **Notification system upgrade.** The existing `Notification` model is unused in the UI. Wire the avatar badge to: new PYQs for bookmarked companies, applications with rounds in <72h, SRS items due. This is the loop that pulls users back daily — without it, retention will not survive past placement season.
7. **Design a public PYQ page.** PYQs are the SEO unlock. A page like `/pyq/google/oa/2024` should be public, indexable, server-rendered, with a soft paywall ("create a free account to see the rest") after 2 visible questions — this is the Glassdoor / LeetCode discuss play applied to Indian placements.

## 7. Metrics to Track

| KPI | Current (est.) | 30-day target | 90-day target |
|---|---|---|---|
| Signup → activation (added ≥1 application or bookmarked ≥1 company within 24h) | ~25% | 50% | 65% |
| D1 retention | <20% | 35% | 50% |
| D7 retention | <10% | 20% | 35% |
| Mobile session completion rate (time-on-site > 60s on mobile) | unknown | 60% | 75% |
| Public PYQ pages indexed by Google | 0 | 250 | 1,500 |
| Organic search sessions / week | ~0 | 100 | 1,000 |
| WhatsApp link-preview CTR (track via UTM on shared landing URL) | unknown | 8% | 15% |
| Lighthouse a11y on `/`, `/companies`, `/dashboard` | unknown (likely 70s) | 85 | 95 |
| Lighthouse performance on mobile `/companies/:slug` | unknown | 80 | 90 |
| Time-to-first-value (signup → first PYQ viewed) | unknown, likely >3min | <90s | <45s |
| Applications-tracked per active user (week 1) | <1 | 3 | 6 |
| Companies bookmarked per active user (week 1) | <2 | 5 | 10 |
| Conversion: Landing visit → signup | unknown, likely 2–4% | 8% | 12% |

Track these in `EngagementDay` (already exists) — extend `routes` JSON to include the activation events. Build a single `/admin/metrics` page (gated to `tarinagarwal@gmail.com`) that reads them. Without instrumentation, every recommendation above is a guess; with it, the next 90 days become a science experiment instead of a vibes-driven rebuild.

The single highest-leverage thing PrepPlace can do this quarter is **stop being three products in one URL**. Pick the placement-OS story, name it everywhere, and design the first 90 seconds of the experience to deliver on that promise. Everything else in this report is a consequence of that one decision.
