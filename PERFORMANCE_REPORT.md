# PERFORMANCE REPORT

*PrepNxt — Placement Season Operating System*
*Scope: Core Web Vitals, bundle size, caching, images, DB query patterns, deploy topology*
*Live: https://prepnext.vercel.app*

---

## 1. Executive Summary

- **The 670 KB index chunk is a lie that's also wrong** — Landing.tsx is eager-imported (`import Landing from "./routes/Landing"`) and it pulls `framer-motion`, `lucide-react`, `react-hot-toast`, the entire `COMPANIES` (1,854 LOC) array and `PYQ_SEED` (272 LOC) into the first-paint chunk. Every visitor — including the 99% who never log in — pays for the placement vault before they see the hero. This is the single biggest LCP/INP regression.
- **Runtime-config network gate blocks every API call** — `client/src/lib/api.ts` does `await refreshApiUrl()` (a `fetch("/runtime-config.json", { cache: "no-store" })`) before *every* first request. On Vercel that file is irrelevant (build-time `__API_URL__=""` is correct), but the SPA still pays a serialized round-trip + `no-store` cache miss on every cold load. This is invisible in dev but adds ~80–300 ms to TTFB-of-data on prod.
- **Static-content tables are bundled, not fetched** — `companies.ts` (1,854 lines), `dsa-problems.ts` (242), `pyqs-seed.ts` (272), plus 848 lines of `placement/*.ts` ship as JS in the client. None of it is user-specific; all of it should be JSON in `/public` with a long-cache header, fetched per-route and cached in `localStorage` with a version key. Today a student on 3G in a tier-2 college eats ~120 KB gzipped of recruiter data just to read the landing page.
- **No SSR / no prerender = bot-blind + slow LCP** — Vite SPA behind `<Suspense fallback={Loader}>` means the first paint after HTML is a spinner, not content. Lighthouse mobile LCP is almost certainly >3.5 s. Competitors (InterviewBit, GFG, Unstop) all SSR their company/PYQ pages and outrank you on `"<company> placement questions"` long-tail queries that *should* be PrepNxt's bread and butter.
- **Dead routes are still in the bundle graph** — `Courses.tsx`, `CourseDetail.tsx`, `CourseLesson.tsx`, `CourseQuiz.tsx`, `CourseCreate.tsx`, `Roadmaps.tsx`, `RoadmapDetail.tsx`, `RoadmapCreate.tsx`, `Tutor.tsx` all exist in `/routes`. App.tsx routes them to `<Navigate>` so they never render — but they're still compiled, type-checked, and (if anything else imports their utilities) still tree-walked. Delete them. This is free 60–100 KB.

---

## 2. Current State

PrepNxt is a hackathon SPA shipped to Vercel with a single serverless Express handler (`api/index.js`). The client is Vite 7 + React 19, the chunking config exists (`manualChunks` already splits monaco, mermaid, pdf, markdown, react-vendor), and lazy routes are wired correctly for everything except Landing. That's the good news. The bad news:

**First paint.** Landing is the marketing surface and the auth funnel. It's also the only thing that loads eagerly. It imports `framer-motion` (≈55 KB gz), `react-hot-toast` (≈8 KB gz), `lucide-react` icons (tree-shakes per-icon, OK), and — fatally — the entire `COMPANIES` array just to render `COMPANIES.length.toString()` in a stats row. Same for `PYQ_SEED.length`. A 1,854-line module is parsed and held in memory so we can `.length` it. This is the kind of thing that turns a 95 Lighthouse score into a 62.

**Background + global providers.** `<Background />`, `<CommandPalette />`, `<EngagementProvider>`, `<FocusMode />` mount on every route including `/`. EngagementProvider (195 LOC) sets up timers, route listeners, and writes engagement-day rows. CommandPalette wires global `Cmd+K` listeners and pre-fetches navigation targets. None of this is needed before login. Mounting them inside `RequireAuth` would cut hydration cost on the highest-traffic route (the homepage).

**API plumbing.** Every protected route does `useEffect → fetch` on mount with no client-side cache, no `Cache-Control` discipline on the server, no SWR/React-Query, and no request deduping. Switch tabs in the Cmd+K palette and you re-fetch. The Dashboard alone likely fires 4–6 independent requests serially because each component fetches its own slice.

**Database.** Prisma 7 over Supabase Postgres. No connection pooling config visible in serverless context (Vercel functions cold-start a new PG client per invocation unless using Supabase pooler or Prisma Accelerate). With ~18 signups this is invisible. At 1,000 DAU it's a P0 incident waiting to happen — connection storms on Supabase will hard-fail `/dashboard` for everyone simultaneously.

**Caching headers.** `vercel.json` has no `headers` block. That means default Vercel headers for `client/dist/assets/*` (the hashed JS/CSS) — Vercel does set immutable on hashed assets automatically, so this is OK. But `/runtime-config.json`, `/og-image.svg`, `/favicon.svg`, `/aptitude.md`, `/core-cs.md`, `/system-design.md`, `/interview.md` get no explicit policy. The `runtime-config.json` is even fetched with `cache: "no-store"` from JS, which defeats edge caching entirely.

**Images.** `og-image.svg` is 1.6 KB and `favicon.svg` is 383 B — fine. There are no raster images currently. But there's also no plan for company logos (currently text-only on Companies cards). When you add 50 logos, naive `<img src>` will torch LCP unless you AVIF/WebP them + `loading="lazy"` + `decoding="async"` + width/height.

**SPA fallback for crawlers.** Googlebot can JS-render but it deprioritizes the queue. Bing, social unfurlers, and the entire long-tail of recruitment aggregators that *would* crawl `/companies/zomato` cannot. Every per-route OG title/description is missing.

---

## 3. Critical Issues

| # | Issue | Impact | Effort | Priority |
|---|-------|--------|--------|----------|
| 1 | Landing is eager + imports `companies.ts` (1,854 LOC) and `pyqs-seed.ts` for `.length` only | LCP +1.5–2.5 s on mobile, TBT +400 ms, ~120 KB gz parsed before paint | S (1 day) | P0 |
| 2 | `refreshApiUrl()` `await fetch("/runtime-config.json", { cache: "no-store" })` runs before every first API call in prod where it does nothing | TTFB-of-data +80–300 ms, blocks Dashboard data waterfall | S (2 hr) | P0 |
| 3 | No client-side data cache (no SWR/React-Query); every route re-fetches on mount | Wasted RTTs, INP spikes on tab switches, Supabase row reads inflated 5–10× | M (3 days) | P0 |
| 4 | SPA-only with `<Suspense fallback={Loader}>` — no SSR/prerender for `/`, `/companies`, `/companies/:slug`, `/pyq` | LCP >3.5 s mobile, crawlers see spinner, no rich snippets, 0 long-tail SEO | L (1–2 wk) | P0 |
| 5 | Dead routes (`Courses*`, `Roadmaps*`, `Tutor.tsx`) still in `/routes`, still in schema (`Course`, `Roadmap`, `Tutor*` models) | +60–100 KB if any util cross-imports; schema drift; cognitive overhead | S (4 hr) | P1 |
| 6 | No Prisma pooling config for Vercel serverless (no `?pgbouncer=true`, no Accelerate, no Supabase pooler URL) | Cold-start connection storms at scale (>50 concurrent users) | M (1 day) | P1 |
| 7 | Global providers (`EngagementProvider`, `CommandPalette`, `FocusMode`) mount on `/` for logged-out users | Hydration cost on highest-traffic route, wasted timers on landing | S (3 hr) | P1 |
| 8 | No `Cache-Control` strategy in `vercel.json` for `/public/*.md`, `/runtime-config.json`, `/og-image.svg` | Re-fetched on every visit, no edge cache | S (1 hr) | P1 |
| 9 | Static content (companies, PYQ seed, DSA problems) bundled as JS instead of fetched JSON | Bundle bloat, can't update content without redeploy, no incremental SWR | M (2 days) | P1 |
| 10 | `framer-motion` (55 KB gz) used on Landing for hero animations only — could be CSS or `motion/react` lite | -55 KB if removed; or -30 KB with the new `motion/react` slim import | S (4 hr) | P2 |
| 11 | `react-hot-toast` (8 KB gz) imported in Landing for *one* "please log in" toast | Tiny but wrong layer; move toast into RequireAuth flow | XS (30 min) | P2 |
| 12 | No image strategy planned (company logos coming) — no `next/image` equivalent, no AVIF | Future LCP regression when logos ship | M (2 days when needed) | P2 |
| 13 | Monaco editor (~3 MB raw, ~700 KB gz) loads on `/dsa/:slug` with no warm-up; first DSA problem feels broken for 2–4 s | INP on first DSA problem load is hostile | M (1 day) | P2 |
| 14 | `mermaid` (380 KB) ships with `SystemDesign.tsx` and (legacy) `CourseLesson.tsx` | Already chunked, but loaded eagerly on `/system-design` mount instead of on-demand per diagram | S (4 hr) | P2 |
| 15 | No web vitals telemetry (no `web-vitals` lib, no RUM, no Vercel Analytics enabled) | Flying blind — can't prove regressions or wins | S (2 hr) | P1 |

---

## 4. Recommendations

### 4.1 Fix Landing first paint (P0, 1 day)

`client/src/routes/Landing.tsx` currently does:

```ts
import { COMPANIES } from "../data/companies";   // 1,854 LOC
import { PYQ_SEED } from "../data/pyqs-seed";    // 272 LOC
```

…and uses both only for `.length` in the `STATS` array. Replace with hardcoded constants:

```ts
const STATS = [
  { v: "50", l: "Curated recruiters" },
  { v: "200+", l: "PYQs (and growing)" },
  { v: "150", l: "DSA problems" },
  { v: "0", l: "AI calls · zero ops cost" },
];
```

Update these numbers at build time via a `scripts/landing-stats.ts` that reads the data files and writes a `landing-stats.json` consumed by Vite `define`. Result: ~120 KB gz removed from first paint, Landing chunk drops from ~250 KB to ~70 KB.

Then: replace `framer-motion` on Landing with CSS `@keyframes` + `view-transition-name`. The hero fade-in and feature card stagger do not need a JS animation library. Save another 55 KB gz. If you absolutely must keep motion, switch to `motion/react` (the new Motion package) which has a lighter import surface.

### 4.2 Kill the runtime-config gate in production (P0, 2 hr)

In `client/src/lib/api.ts`, guard the refresh:

```ts
const IS_PROD = import.meta.env.PROD;
export async function refreshApiUrl(): Promise<string> {
  if (IS_PROD) { _refreshedOnce = true; return _apiUrl; }
  // ... existing dev logic
}
```

Or better: move the runtime-config dance behind a `import.meta.env.DEV` check at module load, eliminating both the `fetch` and the `ensureFresh()` await on every prod API call. This unblocks parallel Dashboard fetches.

### 4.3 Add SWR or TanStack Query (P0, 3 days)

Every protected route does `useEffect(() => { fetch(...) }, [])`. Wrap fetches in TanStack Query with:

- `staleTime: 60_000` for company/PYQ/DSA-problem reads (these change daily, not per-request)
- `staleTime: 0, gcTime: 300_000` for user-specific data (applications, mastery)
- `placeholderData: keepPreviousData` on Companies list filtering

Co-locate query keys in `client/src/lib/queries.ts`. Switching from `/dashboard` → `/applications` → `/dashboard` should fire **zero** extra requests within 60 s. Today it fires the full Dashboard fan-out twice.

### 4.4 Pre-render the marketing + content surface (P0, 1–2 weeks)

The cheapest path that matches your stack: **vite-plugin-ssg** or **react-snap**. Routes to prerender at build time:

- `/` (Landing)
- `/companies` (the index of 50)
- `/companies/:slug` × 50 (eligibility, packages, tips — all static, all SEO-critical)
- `/pyq` (index)
- `/verify-certificate`

Companies detail pages are pure functions of `COMPANIES` data — zero personalization. Prerendering them means InterviewBit-style ranking for `"zomato sde placement questions"`. Vercel will serve them as static HTML at the edge. LCP drops to <1 s, SEO surface explodes from 4 indexed pages to 60+.

If vite-plugin-ssg is too much surgery, the migration to **Next.js 15 App Router** is the strategic move (your CTO report likely already says this). React 19 + RSC + per-route `metadata` would solve 4 problems at once: SSR, code-splitting, image optimization, and per-route OG tags.

### 4.5 Delete dead routes and schema (P1, 4 hr)

`grep -L "Courses\|Roadmaps\|Tutor" client/src/routes/*.tsx` — confirm nothing imports them. Then:

```
rm client/src/routes/{Courses,CourseDetail,CourseLesson,CourseQuiz,CourseCreate,Roadmaps,RoadmapDetail,RoadmapCreate,Tutor}.tsx
```

In `prisma/schema.prisma`, drop `Course`, `Chapter`, `Lesson`, `LessonProgress`, `Roadmap`, `TutorThread`, `TutorMessage` if confirmed unused. Run `prisma migrate dev --create-only` and review. Schema drift is its own performance tax — every Prisma client init reads metadata for these unused tables.

### 4.6 Supabase pooler URL (P1, 1 day)

In Vercel env vars, set `DATABASE_URL` to the Supabase **transaction pooler** URL (port 6543 with `?pgbouncer=true&connection_limit=1`) and `DIRECT_URL` to the direct connection (port 5432) for migrations. Prisma 7 supports this split. Without it, every cold start opens a fresh PG connection — at 100 concurrent invocations you'll exhaust Supabase free-tier connections (default 60).

### 4.7 Don't mount logged-in chrome on `/` (P1, 3 hr)

Move `<EngagementProvider>`, `<CommandPalette>`, and `<FocusMode>` *inside* `<RequireAuth>` in App.tsx. Logged-out visitors on `/` shouldn't run engagement timers or palette key listeners. Cuts Landing JS execution ~30 ms on mid-tier Android.

### 4.8 Cache-Control discipline (P1, 1 hr)

Add to `vercel.json`:

```json
"headers": [
  { "source": "/runtime-config.json", "headers": [
    { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
  ]},
  { "source": "/(.*)\\.(svg|png|webp|avif|ico)", "headers": [
    { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
  ]},
  { "source": "/(.*)\\.md", "headers": [
    { "key": "Cache-Control", "value": "public, max-age=3600, stale-while-revalidate=86400" }
  ]}
]
```

And remove the `cache: "no-store"` from `refreshApiUrl()`.

### 4.9 Move static content to fetched JSON (P1, 2 days)

`client/src/data/companies.ts` becomes `client/public/data/companies.v1.json`. Fetch on `/companies` mount via TanStack Query with `staleTime: Infinity` and a version key (`companies.v2.json` invalidates the cache on next deploy). LocalStorage backs it. Bundle drops ~60 KB gz. Content updates ship without rebuilding the client.

Do the same for `pyqs-seed.ts`, `dsa-problems.ts`, `dsa-solutions.ts`, and `placement/*.ts`. Total bundle saved: ~150 KB gz.

### 4.10 Monaco lazy boundary (P2, 1 day)

`DsaProblem.tsx` should render the problem statement + examples *first*, then mount `<MonacoEditor>` behind a `<Suspense>` boundary with a `<textarea>` fallback. First Contentful Paint on `/dsa/:slug` drops from ~3 s to ~600 ms. Power users on flaky 4G see the problem instantly and can read while the editor loads.

### 4.11 Web vitals telemetry (P1, 2 hr)

```ts
import { onCLS, onINP, onLCP } from "web-vitals/attribution";
onLCP(m => fetch("/api/vitals", { method: "POST", body: JSON.stringify(m), keepalive: true }));
```

Pipe to a single `EngagementDay`-style table or just `console.log` for now and enable Vercel Speed Insights ($10/mo, 1-click). You cannot improve what you don't measure, and Lighthouse is a lab proxy, not RUM.

### 4.12 Competitor benchmark

- **InterviewBit** `/coding-interview-questions/uber/` — SSR'd HTML, LCP ~1.2 s, ranks for thousands of company queries. This is the table-stakes baseline.
- **GeeksforGeeks** `/company/google/` — heavier (ads), but indexes everything. Wins on volume.
- **Unstop** — SPA but with SSR shell + aggressive prefetching.

PrepNxt's content is *better* than all three for the 50 startups you've curated. The reason you don't rank is purely technical (SPA, no per-route metadata, no SSR). Fix the rendering pipeline and the content already wins.

---

## 5. 30-Day Priorities

1. **Strip Landing first-paint cost** — Replace `COMPANIES.length` / `PYQ_SEED.length` with build-time constants, swap `framer-motion` for CSS animations on Landing only. Deliverable: Lighthouse mobile LCP ≤2.0 s on `/`, Landing chunk ≤80 KB gz.
2. **Kill runtime-config in prod** — Gate `refreshApiUrl` behind `import.meta.env.DEV`. Deliverable: Dashboard first-byte-of-data ≤200 ms p75 on Vercel.
3. **Adopt TanStack Query** — Wrap all `useEffect → fetch` calls, set sane `staleTime`s, add a global `<QueryClientProvider>`. Deliverable: zero duplicate requests within 60 s tab-switch sessions; documented in `client/src/lib/queries.ts`.
4. **Delete dead routes + Prisma models** — Remove Courses/Roadmaps/Tutor route files; drop unused models in a single migration. Deliverable: `git diff --stat` shows ≥9 files deleted, schema diff applied, `npm run build` clean.
5. **Supabase pooler URL + Prisma split** — Set `DATABASE_URL` (pooler:6543) and `DIRECT_URL` (5432) on Vercel. Deliverable: Vercel function logs show stable connection count under synthetic load test (k6, 50 RPS for 2 min).
6. **`Cache-Control` headers in `vercel.json`** — SVG/icon immutable, MD with SWR, runtime-config with must-revalidate. Deliverable: Chrome DevTools Network shows 304s on second visit for all static assets.
7. **Wire `web-vitals` + Vercel Speed Insights** — Real-user LCP/INP/CLS streaming to a dashboard. Deliverable: 7 days of RUM data, baseline numbers in the team channel.

---

## 6. 90-Day Priorities

1. **Prerender marketing + companies surface** — Either vite-plugin-ssg (tactical) or migrate to Next.js 15 App Router (strategic). Prerender `/`, `/companies`, `/companies/:slug` × 50, `/pyq`. Deliverable: `view-source:` on `/companies/zomato` shows fully rendered HTML with unique title/OG tags.
2. **Move static content to fetched JSON** — Companies, PYQ seed, DSA problems, placement data all out of the JS bundle. Versioned URLs + localStorage cache. Deliverable: gzipped initial bundle <250 KB for any route except `/dsa/:slug`.
3. **Monaco lazy split + idle prefetch** — `<Suspense>` boundary in DsaProblem, prefetch monaco chunk on Dsa list hover. Deliverable: `/dsa/:slug` LCP ≤1.5 s on Moto G4 throttling.
4. **Image pipeline for company logos** — Source SVG/PNG → AVIF + WebP at 32/64/128 via a build script, `<picture>` element with width/height, `loading="lazy"` below the fold. Deliverable: 50 logos served at <2 KB median.
5. **DB query audit + indexes** — Run `pg_stat_statements` on Supabase, identify top 10 slowest. Add indexes for `EngagementDay(userId, date)`, `SRSItem(userId, dueAt)`, `DsaProblemStatus(userId, problemId)`, `Application(userId, stage)`. Deliverable: p95 Dashboard query ≤80 ms.
6. **Edge caching for read-only API** — `/api/companies`, `/api/pyq` (public-ish) move to `Cache-Control: s-maxage=300, stale-while-revalidate=3600` and served via Vercel Edge. Deliverable: Vercel function invocation count on these routes drops ≥80%.
7. **Service worker for offline-first DSA tracker** — Workbox precache for problem statements + solutions; sync attempts on reconnect. Deliverable: `/dsa` and any cached problem usable on airplane mode; PWA installability score 100.

---

## 7. Metrics to Track

| Metric | Tool | Today (estimated) | 30-day target | 90-day target |
|---|---|---|---|---|
| Lighthouse mobile Performance | PageSpeed Insights | 55–65 | ≥85 | ≥95 |
| LCP p75 (real users, mobile) | web-vitals + Speed Insights | unknown (~3.5 s) | ≤2.5 s | ≤1.8 s |
| INP p75 | web-vitals | unknown | ≤200 ms | ≤120 ms |
| CLS p75 | web-vitals | unknown | ≤0.1 | ≤0.05 |
| Initial JS (gzipped, `/`) | Vite build report | ~250 KB | ≤120 KB | ≤80 KB |
| Initial JS (gzipped, `/dashboard`) | Vite build report | ~350 KB | ≤200 KB | ≤150 KB |
| Total chunks served on first visit | DevTools | ~8 | ≤5 | ≤4 |
| `/api/*` p95 latency | Vercel function logs | unknown | ≤300 ms | ≤150 ms |
| Supabase connection count (peak) | Supabase dashboard | uncapped | <30 | <40 under 200 RPS |
| Time-to-Interactive `/dsa/:slug` | Lighthouse | ~4 s (monaco) | ≤2.5 s | ≤1.5 s |
| Indexed pages (Google Search Console) | GSC | ~4 | ≥30 | ≥100 |
| Duplicate-request rate per session | Custom RUM | unknown (high) | <5% | <1% |
| Bundle "unused JS" (Lighthouse audit) | Lighthouse | likely >40% | <20% | <10% |
| Build time | Vercel | unknown | <90 s | <60 s |

---

**Bottom line.** PrepNxt doesn't have a performance problem — it has a *deferred decisions* problem. Every quick win in this report is one or two file edits. The structural wins (SSR/prerender, Next migration, content-as-data) are 1–2 week investments that unlock 10× SEO and a real Lighthouse 95+. Do the P0 list this week. The 670 KB chunk will be ≤300 KB before next Friday.
