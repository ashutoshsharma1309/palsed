# SEO REPORT

## 1. Executive Summary

- **Positioning/SEO mismatch is the #1 problem.** `index.html` markets "Adaptive AI Learning Universe" while `Landing.tsx` markets a "zero-AI placement OS for Indian campus students." Google has no idea what PrepNext ranks for, and neither does a recruiter sharing the link on WhatsApp. Every ranking opportunity downstream is blocked until title/description/OG copy is rewritten around `campus placement preparation India`, `PYQ vault`, `company-wise placement prep`.
- **SPA-only architecture is a crawler dead end.** Every route (`/companies/:slug`, `/dsa/:slug`, `/pyq`, `/internships`) is a client-rendered Suspense shell. Googlebot sees the same `<title>` for 50 companies and 150 DSA problems. Prerendering (`vite-plugin-prerender-spa`, `react-snap`, or migrating these high-intent routes to a thin SSR layer on Vercel) is the highest-leverage tech-SEO unlock.
- **There is no `sitemap.xml`, no `robots.txt`, no canonical, no JSON-LD.** All four are table-stakes and all four are missing. The FAQ on Landing is a free FAQPage schema win sitting unused. Companies are a free `ItemList` + `Organization` schema win. DSA problems are a free `LearningResource` schema win.
- **Domain rot kills E-E-A-T before the race starts.** `prepnext.vercel.app` will never outrank `geeksforgeeks.org`, `prepinsta.com`, `interviewbit.com` for any commercial-intent term. A `.com`/`.in` purchase is a prerequisite, not an optimization.
- **Long-tail company-wise + PYQ queries are the only realistic wedge in the first 90 days.** PrepNext cannot beat LeetCode/GFG on `dsa practice` head terms. It *can* rank for `TCS NQT previous year questions 2026`, `Razorpay SDE intern interview questions`, `Zomato campus placement process` — 50 companies x 4 query variations = 200 programmatic pages with near-zero competition from monolith aggregators.

## 2. Current State

PrepNext's SEO posture is best described as accidentally hostile to its own ICP. The product is built for a hyper-specific Indian audience (2nd–4th year engineering students chasing campus placements), but the only crawlable HTML on the site — the static `<head>` block in `client/index.html` — pitches a generic global edtech narrative ("Adaptive AI Learning Universe", "AI tutor", "multi-style lessons"). None of that copy contains the words "placement", "India", "campus", "PYQ", "company", or "off-campus". A student googling `Infosys placement preparation` will never see this site, because the site does not claim to be about that, in markup.

Beyond positioning, the technical SEO foundation is missing entirely. There is no `robots.txt` at the public root, no `sitemap.xml`, no `<link rel="canonical">`, no `<meta name="robots">`, and no structured data of any kind. The `og:image` and `twitter:image` both point to a `/og-image.svg` — Twitter and LinkedIn unfurlers reject SVG; X drops the card entirely. This means every share of a PrepNext link on WhatsApp, X, or LinkedIn renders as a naked URL with no preview, killing organic referral CTR.

The architecture compounds the problem. The codebase is a Vite SPA with React Router 7, where every route lazy-loads through `Suspense`. The `7_EXISTING_SEO_HEAD` is the only HTML Googlebot reliably sees on first paint. Google does execute JS, but with a long render queue and aggressive timeouts, and it does not pass per-route `document.title` mutations to its long-tail ranking systems with anything like the priority of pre-rendered HTML. So `/companies/razorpay`, `/dsa/two-sum`, `/pyq` all collapse into one indexable surface as far as scale ranking is concerned.

There is real content underneath that crawlers cannot reach: 50 curated companies with eligibility, packages, rounds, OA platforms, and tips (`Recruiter Map`); a crowd-sourced PYQ vault with vote-able verified questions; ~150 DSA problems with Monaco editor; spaced-repetition (`SRSItem`), mastery (`MasteryEntry`), engagement analytics, certificates with public verification (`/verify-certificate`). Every one of these is a templated programmatic-SEO goldmine, and not a single one is indexable today.

Three additional drag factors: (1) the domain is `prepnext.vercel.app`, which Google treats as a subdomain of a shared host — zero domain authority will ever accrue; (2) the legacy `Courses`, `Roadmaps`, `Tutor` routes still exist as `<Navigate>` redirects but their schema/JSX bloats the bundle, raising LCP/INP and dragging Core Web Vitals on the only page a crawler currently sees; (3) the `manifest.webmanifest`, `favicon.svg` are present but unverified — the PWA install path is unproven, and Google's mobile-friendly signals depend on it.

Net: the site is technically online, occasionally shared, has 18 signups, and is in practical terms invisible to search.

## 3. Critical Issues

| # | Issue | Impact | Effort | Priority |
|---|-------|--------|--------|----------|
| 1 | `index.html` title/description/OG copy markets "Adaptive AI Learning" while product is a placement OS — zero keyword match with ICP queries | Catastrophic | XS (1 hr) | P0 |
| 2 | No `sitemap.xml` / `robots.txt` — crawlers have no map of the 50 company + 150 DSA + PYQ pages | Critical | S (4 hr) | P0 |
| 3 | SPA with no SSR/prerender — `/companies/:slug`, `/dsa/:slug`, `/pyq/*` are invisible to scaled ranking | Critical | M (3 days) | P0 |
| 4 | `prepnext.vercel.app` subdomain — no domain authority accrual possible | Critical | XS (buy domain) | P0 |
| 5 | `og-image.svg` (SVG) — Twitter/LinkedIn unfurl breaks, killing share CTR | High | XS (export PNG) | P0 |
| 6 | No JSON-LD anywhere — missing `Organization`, `WebSite` with `SearchAction`, `FAQPage` (FAQ exists in `Landing.tsx`), `ItemList` for companies, `LearningResource` for DSA | High | S (1 day) | P1 |
| 7 | No `<link rel="canonical">` — duplicate-content risk once filters/sort params hit `/companies` and `/pyq` | High | XS | P1 |
| 8 | Per-route metadata missing — `react-helmet-async` or `vite-plugin-react-pages` not installed | High | S | P1 |
| 9 | Dead routes (`/courses`, `/roadmaps`, `/tutor`) bloat bundle, hurting LCP/INP on Landing — Google's only ranking surface today | Medium | S (delete) | P1 |
| 10 | No internal linking strategy — Landing does not link to `/companies`, `/pyq`, `/internships` with anchor text crawlers can use | Medium | XS | P1 |
| 11 | `font.googleapis.com` and `cdn.jsdelivr.net` external CSS in `<head>` blocks LCP; highlight.js stylesheet loaded site-wide | Medium | S | P2 |
| 12 | No `hreflang="en-IN"` — Google does not know the geo-target is India | Medium | XS | P2 |
| 13 | `meta name="keywords"` still present (ignored by Google, ranked by nobody) and contains wrong keywords | Low | XS | P2 |
| 14 | No Google Search Console, no Bing Webmaster, no IndexNow ping on PYQ submit | High | S | P2 |
| 15 | Public `/verify-certificate` page has no schema (`EducationalOccupationalCredential`) — wasted brand-search surface | Low | S | P3 |

## 4. Recommendations

### 4.1 Rewrite the static head before anything else

`client/index.html` is the single highest-leverage file in the repo. Replace the entire metadata block with India-targeted, placement-targeted copy. Concretely:

- `<title>`: `PrepNext — Campus Placement Prep for Indian Engineering Students | PYQs, Company Vault, DSA Tracker`
- `<meta name="description">`: `PrepNext is the placement season OS for Indian engineering students. 50-company recruiter vault (TCS, Infosys, Razorpay, Zomato, Swiggy), verified PYQs, DSA tracker, application kanban, and mock interviews. Free during beta.`
- Remove `<meta name="keywords">` entirely — it is a 2008 signal.
- Add `<meta name="robots" content="index,follow,max-image-preview:large">`.
- Add `<link rel="canonical" href="https://prepnext.com/">` (post-domain purchase).
- Add `<meta http-equiv="content-language" content="en-IN">` + `<html lang="en-IN">`.
- Replace `og:image` and `twitter:image` with a real 1200x630 PNG. Generate via a Vercel OG function (`@vercel/og`) so every route can have a dynamic card — `/companies/razorpay` should unfurl with "Razorpay Placement Prep — PrepNext".

### 4.2 Ship a static `robots.txt` and a dynamic `sitemap.xml`

Add `client/public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /applications
Disallow: /settings
Disallow: /review
Disallow: /engagement
Disallow: /onboarding
Disallow: /auth/

Sitemap: https://prepnext.com/sitemap.xml
```

Generate `sitemap.xml` server-side via an Express route at `server/routes/sitemap.js`. It must read `Company`, `PYQ` (verified only), and the static DSA problem list from Prisma. Index split: `sitemap-index.xml` -> `sitemap-companies.xml`, `sitemap-pyq.xml`, `sitemap-dsa.xml`, `sitemap-static.xml`. Re-ping Google + IndexNow on new PYQ verification (hook into the existing PYQ submit flow).

### 4.3 Prerender the high-intent public routes

The SPA model is fine for `/dashboard` and friends. It is fatal for `/`, `/companies`, `/companies/:slug`, `/pyq`, `/internships`, `/dsa`, `/dsa/:slug`, `/verify-certificate`. Three options ranked by realism for a hackathon team:

1. **Best**: Migrate the public surface to Next.js App Router on Vercel. Keep the Express ESM API on `api/*`. This is the cleanest long-term answer and gives you per-route `generateMetadata`, ISR for company pages, and built-in `sitemap.ts`/`robots.ts` APIs.
2. **Pragmatic**: Add `vite-plugin-prerender` (or `react-snap`) to the existing Vite build. Configure to crawl `/`, all 50 `/companies/:slug` routes from a static manifest, and all DSA slugs. Output static HTML per route, served by Vercel before the SPA hydrates. Lowest risk path to ranking.
3. **Minimum viable**: Install `react-helmet-async`, wrap `App.tsx`, set per-route `<Helmet>` titles/descriptions, and rely on Google's JS rendering. Will get you the brand-search wins but not the long-tail wins.

Pick (2) for the next 30 days, plan (1) for Q1.

### 4.4 Buy a real domain immediately

`prepnext.com` if available, otherwise `prepnext.in` or `getprepnext.com`. `.vercel.app` will never outrank `prepinsta.com`. Configure 301 from the Vercel preview domain to the canonical, and update `supabase.auth.redirectTo`, the `AuthCallback` allow-list, and CORS in the Express server.

### 4.5 Programmatic SEO: the only winnable wedge

PrepNext cannot beat GeeksforGeeks on `binary search`. It can beat them on `Razorpay SDE intern interview questions 2026` because the page does not exist on GFG. The `Company` model already has eligibility, packages, rounds, OA platforms, and tips. For each company, generate four crawlable surfaces:

- `/companies/:slug` — overview (intent: navigational + "company X placement process")
- `/companies/:slug/pyq` — filtered PYQ vault (intent: "company X previous year questions")
- `/companies/:slug/process` — interview rounds + OA platform (intent: "company X interview rounds")
- `/companies/:slug/prep-kit` — DSA + sysdesign + behavioral bundle (intent: "how to prepare for company X")

50 companies x 4 templates = 200 indexable URLs with near-zero direct competition.

### 4.6 50 high-intent Indian placement-prep keywords mapped to routes

| # | Keyword | Target Page |
|---|---------|-------------|
| 1 | campus placement preparation | `/` |
| 2 | placement preparation app for engineering students | `/` |
| 3 | placement season planner | `/` |
| 4 | how to prepare for campus placements in 6 months | `/` (blog later) |
| 5 | best placement preparation platform india | `/` |
| 6 | off campus drive tracker | `/applications` (public landing variant) |
| 7 | company wise placement preparation | `/companies` |
| 8 | top 50 companies for campus placements | `/companies` |
| 9 | yc companies hiring indian students | `/companies?filter=yc` |
| 10 | startup placements india | `/companies?filter=startup` |
| 11 | TCS NQT previous year questions | `/companies/tcs/pyq` |
| 12 | Infosys placement preparation | `/companies/infosys` |
| 13 | Wipro elite placement process | `/companies/wipro/process` |
| 14 | Razorpay SDE intern interview questions | `/companies/razorpay/pyq` |
| 15 | Zomato campus placement process | `/companies/zomato/process` |
| 16 | Swiggy SDE 1 interview questions | `/companies/swiggy/pyq` |
| 17 | Flipkart GRiD eligibility | `/companies/flipkart` |
| 18 | Amazon SDE intern OA questions | `/companies/amazon/pyq` |
| 19 | Microsoft engage interview rounds | `/companies/microsoft/process` |
| 20 | Google STEP interview prep | `/companies/google/prep-kit` |
| 21 | Adobe MDSR interview questions | `/companies/adobe/pyq` |
| 22 | Goldman Sachs codeathon questions | `/companies/goldman-sachs/pyq` |
| 23 | JP Morgan code for good questions | `/companies/jp-morgan/pyq` |
| 24 | Cisco placement OA pattern | `/companies/cisco/process` |
| 25 | Salesforce campus prep kit | `/companies/salesforce/prep-kit` |
| 26 | Cred SDE intern interview | `/companies/cred/pyq` |
| 27 | Zerodha placement process | `/companies/zerodha/process` |
| 28 | Atlassian internship interview | `/companies/atlassian/pyq` |
| 29 | Uber India placement | `/companies/uber/process` |
| 30 | Walmart SDE OA | `/companies/walmart/pyq` |
| 31 | previous year placement questions | `/pyq` |
| 32 | crowdsourced placement questions india | `/pyq` |
| 33 | verified PYQ vault | `/pyq` |
| 34 | submit placement questions | `/pyq/submit` |
| 35 | dsa sheet for placements india | `/dsa` |
| 36 | 150 dsa questions for placements | `/dsa` |
| 37 | dsa tracker with spaced repetition | `/dsa` |
| 38 | system design for campus placements | `/system-design` |
| 39 | low level design for SDE 1 interview | `/system-design` |
| 40 | core cs interview preparation | `/core-cs` |
| 41 | operating systems interview questions | `/core-cs` |
| 42 | DBMS interview questions for placements | `/core-cs` |
| 43 | computer networks placement questions | `/core-cs` |
| 44 | aptitude test for placements | `/aptitude` |
| 45 | quantitative aptitude for TCS NQT | `/aptitude` |
| 46 | summer internship 2026 india engineering | `/internships` |
| 47 | off campus internship drive | `/internships` |
| 48 | mock interview platform for placements | `/interview-resources` |
| 49 | placement application tracker kanban | `/applications` (logged-out marketing variant) |
| 50 | verify placement certificate prepnext | `/verify-certificate` |

### 4.7 Structured data plan

Add JSON-LD as `<script type="application/ld+json">` per route. Concretely:

- **Site-wide (`index.html`)**: `Organization` (logo, sameAs to X/LinkedIn/Discord) + `WebSite` with `SearchAction` pointing at `/companies?q={query}`.
- **`/`**: `FAQPage` — the FAQ already exists in `Landing.tsx`, parse the strings into JSON-LD at build time.
- **`/companies`**: `ItemList` enumerating all 50 companies.
- **`/companies/:slug`**: `Organization` (the recruiter) + `JobPosting` if any active drives exist + `FAQPage` (eligibility, package, rounds).
- **`/dsa`**: `ItemList` of problems.
- **`/dsa/:slug`**: `LearningResource` + `Question` schema (LeetCode does this and ranks; copy the pattern).
- **`/pyq`**: `Dataset` (crowd-sourced corpus) — surprisingly indexable.
- **`/verify-certificate`**: `EducationalOccupationalCredential`.
- **Breadcrumbs everywhere** via `BreadcrumbList`.

### 4.8 Delete dead code

Per the codebase recon: `Courses/CourseDetail/CourseLesson/CourseQuiz/CourseCreate/Roadmaps/RoadmapCreate/RoadmapDetail/Tutor.tsx` are unreachable but ship in the bundle. Delete them, delete the Prisma `Course`/`Roadmap`/`TutorThread`/`TutorMessage` models (after a migration that drops the tables), and drop the redirects. Smaller bundle = faster LCP = better Core Web Vitals = better ranking on the only page Google currently sees.

### 4.9 Fix the Open Graph image pipeline

Build a `@vercel/og` route at `api/og/route.ts` that accepts `?title=&subtitle=` and returns a 1200x630 PNG. Set `og:image` per route. For `/companies/razorpay`, the card should read "Razorpay Placement Prep — Process, PYQs, Salary". This single change typically lifts referral CTR 2–4x.

### 4.10 Internal linking

`Landing.tsx` currently has an auth CTA and feature blocks. Add a footer with crawlable `<a href>` (not `<button onClick={navigate}>`) links to `/companies`, `/companies/tcs`, `/companies/infosys`, `/pyq`, `/dsa`, `/internships`, `/aptitude`, `/verify-certificate`. Crawlers follow `<a href>`, not `useNavigate`.

## 5. 30-Day Priorities

1. **Day 1–2: Rewrite `client/index.html` head.** Title, description, OG, Twitter, canonical, robots, lang=en-IN. Export `og-image.png` (1200x630) and drop the SVG. Deliverable: PR merged, validated in [Open Graph debugger](https://www.opengraph.xyz/) and Twitter card validator.
2. **Day 3–5: Buy `prepnext.com` (or `.in`), point at Vercel, update Supabase redirect URLs, update CORS, 301 the `.vercel.app` host.** Deliverable: HTTPS canonical domain live, all Supabase OAuth flows green.
3. **Day 6–10: Ship `robots.txt` + dynamic `sitemap.xml` via Express route reading Prisma `Company` + verified `PYQ`.** Deliverable: `prepnext.com/sitemap.xml` returns valid XML with 200+ URLs; submit to Google Search Console + Bing.
4. **Day 11–18: Add `react-helmet-async`, set per-route `<Helmet>` titles/descriptions for `/companies/:slug`, `/dsa/:slug`, `/pyq`.** Deliverable: 50 unique titles indexed within 4 weeks.
5. **Day 19–24: Add JSON-LD: `Organization` + `WebSite` site-wide, `FAQPage` on Landing, `ItemList` on `/companies`, `BreadcrumbList` everywhere.** Deliverable: zero errors in [Rich Results Test](https://search.google.com/test/rich-results) for all four templates.
6. **Day 25–28: Build `@vercel/og` dynamic OG image route; wire per-route `og:image` URLs.** Deliverable: every public route produces a unique unfurl card.
7. **Day 29–30: Delete `Courses/Roadmaps/Tutor` routes + Prisma models + corresponding migration.** Deliverable: bundle size drop measured; Lighthouse LCP on `/` improves by >300ms.

## 6. 90-Day Priorities

1. **Prerender (or migrate) the public surface.** Either `vite-plugin-prerender` for `/`, `/companies`, all `/companies/:slug`, `/pyq`, `/dsa`, `/dsa/:slug`, or a clean Next.js App Router migration of the public marketing/SEO routes while keeping the authed product as Vite. Deliverable: 200+ statically-served HTML routes with unique content.
2. **Ship 200 programmatic company pages** (`/companies/:slug/{pyq,process,prep-kit}`). Deliverable: 4 templates x 50 companies indexed; track impressions per template in GSC.
3. **Publish 12 high-intent long-form articles** on `prepnext.com/blog`: "TCS NQT 2026 Pattern", "How Razorpay Hires SDE Interns", "Off-Campus Placement Roadmap for 2026 Batch", etc. Internal-link aggressively to `/companies/:slug` and `/pyq`. Deliverable: 12 posts, each 1500+ words, each targeting one keyword from section 4.6.
4. **Open the PYQ vault to logged-out reading** (gate only submission/voting behind auth). Deliverable: `/pyq` and `/companies/:slug/pyq` return HTML content, not an auth wall. This is currently the single biggest indexable-content unlock.
5. **Core Web Vitals pass.** Self-host the Google Fonts subset (`Inter` only on Landing; `Anton`/`Bebas`/`Share Tech Mono` async loaded), drop the highlight.js stylesheet from Landing (move to DSA route only), preload the hero image. Deliverable: Landing LCP <2.0s on Moto G Power, INP <200ms, CLS <0.05.
6. **Backlink campaign for E-E-A-T.** Partner with 10 college placement cells + 10 coding clubs (IIIT, NIT, BITS, IIIT-H, IIITH, IIT campus tech societies); offer free PrepNext access in exchange for a footer link on their placement portal. Deliverable: 20 referring root domains from `.ac.in` / `.edu.in` — these are extremely high-quality signals for Indian education SEO.
7. **Launch IndexNow + Google Indexing API hooks.** Every verified PYQ submission and every new Company write triggers an instant ping. Deliverable: TTFI (time to first index) <24h on new PYQs.

## 7. Metrics to Track

| KPI | Today | 30-Day Target | 90-Day Target |
|-----|-------|---------------|---------------|
| Indexed URLs (GSC) | <5 | 250 | 600 |
| Organic impressions / month | ~0 | 5,000 | 50,000 |
| Organic clicks / month | ~0 | 200 | 3,000 |
| Branded "prepnext" search impressions | 0 | 500 | 5,000 |
| Referring root domains (Ahrefs/GSC links) | <5 | 15 | 40 |
| `.ac.in` / `.edu.in` referring domains | 0 | 3 | 15 |
| Landing LCP (mobile, p75) | unknown — likely >3s | <2.5s | <2.0s |
| Landing INP (p75) | unknown | <300ms | <200ms |
| Landing CLS | unknown | <0.1 | <0.05 |
| Rich-result-eligible pages | 0 | 60 | 250 |
| Avg position for "TCS NQT previous year questions" | unranked | top 100 | top 30 |
| Avg position for "campus placement preparation app" | unranked | top 100 | top 20 |
| Avg position for "[company] placement process" (across 20 tracked companies) | unranked | top 80 | top 20 |
| OG unfurl CTR on WhatsApp/X share (UTM-tagged) | unmeasured | baseline | +50% from PNG OG cards |
| Signups attributed to organic search | ~0 | 50 | 500 |
| Time-to-index for new PYQ | never | <72h | <24h via IndexNow |

The single number that matters at 90 days: **organic clicks/month from non-branded queries.** If that number is below 1,000, the programmatic + prerender bet has failed and the strategy needs to pivot toward a content-led approach (blog + YouTube) before paid acquisition becomes the only growth lever.
