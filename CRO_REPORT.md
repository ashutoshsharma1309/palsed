# CRO REPORT

## 1. Executive Summary

- **The landing page is selling the wrong product.** `index.html` markets "Adaptive AI Learning Universe" while the Landing component pitches a "zero AI calls" Placement Season OS. This contradiction is the single biggest conversion blocker — visitors arriving from organic, Twitter, or LinkedIn unfurls land on copy that doesn't match the meta promise. Fix the positioning to "Placement Season OS for Indian engineering students" everywhere, or stop confusing visitors with two products.
- **You have no pricing page and no monetization surface.** With 18 signups and zero paying users, the absence of `/pricing` isn't a feature — it's the reason no one converts. Even a Notion-style "Free / Pro ₹199/mo / Campus ₹99/mo (.edu.in)" page with no working Stripe yet would force you to make hard positioning decisions and create a CTA destination.
- **CTAs are ambiguous and route to a dead-end.** "Get Started" → `/onboarding` (public) is the standard pattern, but there's no segmentation by year (2nd/3rd/4th), no college targeting, and no "I have a placement next month" urgency hook. PrepInsta and Unstop both segment by year-of-study within 1 click.
- **The vercel.app subdomain is killing trust and SEO simultaneously.** Indian students in placement season do not paste vercel.app URLs into the campus WhatsApp group. Cost to fix: ₹800/year for prepnext.in. ROI: incalculable. Do this within 48 hours.
- **You're a SPA with no SSR, so every per-company, per-PYQ, per-DSA-problem page is invisible to Google.** This means your single biggest organic acquisition channel (long-tail "Razorpay OA questions 2024", "Goldman Sachs SDE intern PYQ") is literally rendering as an empty `<div id="root">` to Googlebot. This is a months-long fix but it's the #1 growth lever.

## 2. Current State

PrepNxt is a hackathon artifact masquerading as a product. The codebase reveals a team that built features faster than positioning: 21 routes, a Recruiter Map with 50 companies, a PYQ vault, DSA tracker with Monaco, kanban, SRS, mastery radar, certificates, engagement analytics, AI tutor threads — and 18 signups. The build-to-distribution ratio is roughly 100:1, which is normal for hackathon code but unsustainable as a business.

The conversion funnel today is:
1. Visitor lands at `prepnext.vercel.app` (already a trust hit)
2. Reads a `<title>` promising "Adaptive AI Learning Universe"
3. Sees a landing page about a "zero-AI placement OS"
4. Confused, scrolls, sees no pricing, no testimonials, no college logos
5. Clicks "Get Started" → forced into Supabase OTP/Google OAuth → `/onboarding`
6. Lands in `/dashboard` with no obvious "what do I do first" path
7. Bounces

There is no pricing page. There is no `/pricing` route in App.tsx. There is no upgrade prompt anywhere. The Certificate model has a `verifyCode` and a public verification page (`/verify-certificate`) — which is actually a brilliant viral loop you're not exploiting. Every certificate verified by a recruiter is a free brand impression. You have no Open Graph image for those verifications.

The `og-image.svg` is generic and likely renders poorly on LinkedIn (LinkedIn dislikes SVG OG images — it often falls back to nothing). Twitter card is `summary_large_image` but pointed at SVG — this also frequently fails to unfurl.

Auth UX has a real problem: the AuthPanel is inline on the Landing page (per the recon). This is good (Stripe-style: signup is on the homepage), but the 6-digit OTP flow creates a 30-90 second delay between intent and first dashboard view. Google OAuth + `/auth/callback` is the better path and should be the default visible button; OTP should be the secondary option.

There's no "social proof above the fold" — no college logos, no "Built by IIT/IIIT students", no "1,247 PYQs verified by students from 47 colleges" counter. Even fake-looking counters (Unstop does this aggressively) beat an empty hero.

## 3. Critical Issues

| # | Issue | Impact | Effort | Priority |
|---|-------|--------|--------|----------|
| 1 | `index.html` title/OG/Twitter meta contradicts Landing copy ("Adaptive AI Learning" vs "Placement OS") | High | XS (1hr) | P0 |
| 2 | No `/pricing` page, no monetization surface, no upgrade CTA anywhere | High | M (2 days) | P0 |
| 3 | vercel.app subdomain — kills SEO, trust, shareability | High | XS (2hr) | P0 |
| 4 | SPA with no SSR/prerender — Companies/PYQ/DSA detail pages invisible to Google | High | L (2 weeks) | P0 |
| 5 | No structured data (Organization, FAQPage, BreadcrumbList) despite real FAQ on Landing | High | S (4hr) | P1 |
| 6 | OTP-first auth flow — 30-90s latency between CTA and dashboard | Med | S (4hr) | P1 |
| 7 | No social proof above the fold (college logos, student count, PYQ count) | High | S (1 day) | P1 |
| 8 | Certificate verification page is a viral loop — no OG image, no PrepNxt branding, no "claim your own" CTA | Med | S (1 day) | P1 |
| 9 | No segmentation by year-of-study (2nd/3rd/4th) on landing — generic CTA for very different ICPs | Med | M (3 days) | P1 |
| 10 | Stale routes (Courses/Roadmaps/Tutor) bloat bundle, slow LCP, hurt mobile conversion | Med | S (1 day) | P2 |
| 11 | No urgency mechanic — placement season is the most time-sensitive moment in a CS student's life and the landing page ignores it | High | S (1 day) | P1 |
| 12 | `/onboarding` is public — anyone can land there directly but it's not designed as an entry point | Low | S (4hr) | P2 |
| 13 | No referral mechanic despite a perfect graph (study groups, college batches) | Med | M (1 week) | P2 |
| 14 | No exit-intent or scroll-depth capture for unconverted visitors | Med | S (4hr) | P2 |
| 15 | No analytics on Landing CTA clicks vs scroll depth vs section views | High | S (4hr) | P1 |

## 4. Recommendations

### 4.1 Fix the positioning contradiction in `index.html` TODAY

The `<head>` block from the recon contains:

```html
<title>PrepNxt — Your Adaptive AI Learning Universe</title>
<meta name="description" content="PrepNxt is an AI-powered adaptive learning...">
```

This contradicts every signal on Landing.tsx. Replace immediately with:

```html
<title>PrepNxt — Placement Season OS for Indian Engineering Students</title>
<meta name="description" content="Track 50+ company recruiter pages, 5,000+ PYQs, DSA practice, and your application pipeline in one place. Built for 2nd/3rd/4th-year engineering students preparing for campus placements.">
<meta name="keywords" content="campus placement prep, PYQ vault, recruiter map, DSA tracker, placement tracker, off-campus drives, Indian engineering placements">
```

Update OG and Twitter copy in lockstep. This single change will improve every link unfurl across WhatsApp, LinkedIn, Twitter, and Telegram — the four channels Indian CS students actually use.

### 4.2 Ship a `/pricing` route this week — even before Stripe works

Add to `App.tsx`:

```
<Route path="/pricing" element={<Pricing />} />
```

Three-tier pattern (Notion-style):

- **Free** — Companies vault (top 20 of 50), 50 PYQs/month, 1 application board
- **Pro ₹199/month or ₹999/year** — Everything: all 50 companies, unlimited PYQs, DSA Monaco, SRS, mastery radar, certificates
- **Campus ₹99/month** — Verify with `.edu.in` email via Supabase Auth domain check

The CTA on Free should be "Start free" → Supabase signup. The CTA on Pro should be "Start 14-day trial" → signup, then `/billing` (stub). Even a non-functional Stripe is better than no pricing page — it forces you to commit to a positioning. Stripe's own pricing page is the gold standard here: anchor the middle tier visually, list 5-7 features per tier max, never more.

### 4.3 Buy `prepnext.in` today

₹600-900 on GoDaddy/Hostinger. Configure as Vercel domain in 10 minutes. Update Supabase Auth redirect URLs (`/auth/callback` host). Update CORS in server config. The vercel.app subdomain is currently:
- Triggering "is this a scam?" reactions in WhatsApp groups
- Losing domain authority signal in Google
- Making the certificate verification page (`/verify-certificate`) look unprofessional to recruiters

### 4.4 Add per-route SSR prerendering for SEO-critical pages

You're on Vite + Vercel, so `vite-plugin-ssr` or migration of select routes (Companies, PYQ, DSA detail) to Next.js-style ISR is the lever. Short-term, use `react-snap` or `prerender.io` to pre-render at build time these routes:

- `/` (Landing)
- `/companies` and `/companies/:slug` for all 50 companies
- `/pyq` and individual PYQ pages
- `/dsa/:slug` for top-50 DSA problems by traffic

Each rendered page needs unique `<title>`, `<meta description>`, and JSON-LD `BreadcrumbList`. Use `react-helmet-async` or migrate to a metadata file pattern.

Example for `/companies/razorpay`:
```html
<title>Razorpay Campus Placement Guide 2025 — OA Pattern, Rounds, CTC, PYQs | PrepNxt</title>
<meta name="description" content="Razorpay SDE-1 campus drive: 4 rounds, ₹28-32 LPA, OA on HackerEarth, 3 DSA + 1 SQL. 47 verified PYQs from 2023-2024 drives.">
```

This single move could 10x organic traffic in 90 days given the zero-competition long-tail nature of "razorpay OA 2024" queries.

### 4.5 Add structured data — FAQPage is the lowest-hanging fruit

The Landing already has a FAQ section. Add `application/ld+json` with `FAQPage` schema in the head. This earns rich snippet placement in Google SERPs — InterviewBit dominates Indian SEO for this exact reason. Also add `Organization` (with logo, sameAs to Twitter/LinkedIn) and `WebSite` with `SearchAction` for sitelinks search box.

### 4.6 Restructure the AuthPanel CTAs

Currently OTP and Google OAuth likely have equal visual weight. Make Google OAuth the primary button (90% of Indian CS students have Gmail), OTP the "Use email instead" link below. This single change should compress signup time from ~60s to ~8s. Reference: Notion's signup uses Google as primary, email as secondary link.

Also: the `/auth/callback` 6-second timeout is too long for slow connections. Add a "still working..." state at 3s and a "try again" CTA at 6s, not a silent timeout.

### 4.7 Build the certificate viral loop

The `Certificate` model has `verifyCode` and there's a public `/verify-certificate` route. Today this is a passive viral loop. Make it active:

- Auto-generate a sharable LinkedIn post template when a certificate is issued ("I just completed PrepNxt's Razorpay Prep Kit — verify: prepnext.in/v/abc123")
- Verification page must have its own OG image with the student's name + course (use `@vercel/og` or generate at issue time with `html2canvas`/`jspdf` which you already have)
- Verification page must have a "Get your own placement-ready certificate" CTA → `/pricing`
- Add "Powered by PrepNxt" badge to the PDF

Stripe does this with their `payments.stripe.com` pages — every receipt is a soft brand impression. Yours can be too.

### 4.8 Segment by year-of-study on Landing

Single CTA "Get Started" treats a 2nd-year (6 months out from internship season) the same as a 4th-year (panic mode, placement next week). Add three pills above the CTA:

- "I'm in 2nd year" → onboarding flow emphasizes long-term DSA + internship prep
- "I'm in 3rd year" → emphasizes internship + early placement
- "I'm in 4th year" → emphasizes placement panic-mode (PYQs, recruiter map, mock interviews)

Each lands on a customized `/onboarding?year=3` with different copy. This is HubSpot-style ICP segmentation and it works.

### 4.9 Add urgency without being scummy

Placement season runs roughly July-December for most colleges. Add a top banner: "Placement season starts in 47 days — set up your tracker." Pull dates from actual `PlacementCalendar` data. This is honest urgency, not fake countdown timers.

### 4.10 Delete stale code

Per the recon: `Courses/CourseDetail/CourseLesson/CourseQuiz/CourseCreate/Roadmaps/RoadmapCreate/RoadmapDetail/Tutor.tsx` are still in `/routes` and bloating the bundle. The corresponding Prisma models (Course, Chapter, Lesson, Roadmap, TutorThread, TutorMessage) should be deprecated. Each KB shaved off the main bundle improves mobile LCP, and Indian campus WiFi is often the bottleneck.

### 4.11 Instrument Landing analytics

You can't optimize what you don't measure. Add PostHog (free tier, 1M events/mo) or Plausible. Track:
- Hero CTA click rate
- Scroll depth to FAQ
- Time on page before signup
- AuthPanel open → completion rate
- Google vs OTP selection ratio

Without this, every recommendation in this report is theoretical.

### 4.12 Build the referral loop

You have a perfect graph for virality: students study in groups. Add `/refer` — give 1 month Pro for each referred signup. Track via UTM. Notion's referral page is the model: simple, single-link, instant copy-to-clipboard.

## 5. 30-Day Priorities

1. **Day 1-2: Fix positioning** — Update `index.html` title/description/OG/Twitter to match Landing copy. Deliverable: PR merged, link unfurls tested on WhatsApp/LinkedIn/Twitter.

2. **Day 1-3: Buy prepnext.in and ship it** — Domain purchased, Vercel configured, Supabase Auth redirect URLs updated, CORS updated, certificate verification tested on new domain. Deliverable: prepnext.in live, vercel.app 301s.

3. **Day 3-7: Ship `/pricing`** — Three-tier page (Free / Pro ₹199 / Campus ₹99), even with stub Stripe. Deliverable: `/pricing` route live, CTA tracked, Stripe checkout returns "Coming soon — join waitlist" form that captures emails.

4. **Day 5-10: Add PostHog + instrument funnel** — Hero CTA click, AuthPanel open, signup completion, dashboard first-action. Deliverable: funnel dashboard with 7-day baseline numbers.

5. **Day 7-14: Restructure AuthPanel** — Google OAuth primary, OTP secondary. Add "still working" state to `/auth/callback`. Deliverable: signup time-to-dashboard halved.

6. **Day 10-20: Add structured data + sitemap.xml + robots.txt** — FAQPage, Organization, WebSite JSON-LD. Submit sitemap to Google Search Console. Deliverable: rich snippets eligible, Search Console verified.

7. **Day 20-30: Year-of-study segmentation + social proof above fold** — 3 ICP pills, college logos (even just "Students from IIT, NIT, IIIT, VIT, BITS"), live PYQ counter pulled from DB. Deliverable: A/B test running against current Landing.

## 6. 90-Day Priorities

1. **Per-route SSR/prerender for SEO surfaces** — Companies, PYQ, DSA detail pages prerendered with unique meta + structured data. Target: 100+ pages indexed by Google.

2. **Stripe live + first paying customer** — Real checkout, real subscription, real receipts. Target: 10 paying users at ₹199/mo by day 90.

3. **Certificate viral loop fully active** — Per-certificate OG images via `@vercel/og`, LinkedIn share template, "claim your own" CTA on verification page. Target: 30% of certificate issues result in a LinkedIn share.

4. **Referral program live** — `/refer` page, unique codes, 1 month Pro per referral. Target: 25% of new signups attributed to referral by day 90.

5. **Delete stale code (Courses/Roadmaps/Tutor)** — Reduce bundle, deprecate Prisma models, write migration. Target: main bundle <300KB gzipped.

6. **Content SEO play** — 50 long-form pages: "Razorpay SDE Interview Guide 2025", "Top 30 Goldman Sachs PYQs", "Flipkart Campus Placement Process". Use the recruiter map data + PYQ vault as raw material. Target: 1,000 organic visits/day.

7. **Campus ambassador program** — 20 ambassadors at top engineering colleges, each gets free Pro + commission. Distribution model that maps to your ICP. Target: 500 signups via campus channel.

## 7. Metrics to Track

| Metric | Current (estimated) | 30-day target | 90-day target |
|--------|---------------------|---------------|---------------|
| Landing → AuthPanel open rate | Unknown | 15% | 25% |
| AuthPanel open → signup completion | ~30% (guess) | 50% | 65% |
| Signup → dashboard first action | Unknown | 70% | 85% |
| Signup → day-7 retention | Unknown | 25% | 40% |
| Signup → first PYQ submitted/voted | Unknown | 15% | 30% |
| Free → Pro conversion | 0% | 0% (no Stripe) | 3% |
| Total signups | 18 | 100 | 1,000 |
| Paying users | 0 | 0 | 10 |
| MRR | ₹0 | ₹0 | ₹2,000 |
| Organic search clicks/mo (GSC) | ~0 | 50 | 5,000 |
| Pages indexed by Google | ~1 | 10 | 200 |
| Certificate verifications/mo | Unknown | 20 | 200 |
| LinkedIn shares of certificates | 0 | 5 | 50 |
| Domain rating (Ahrefs) | 0 | 5 | 15 |
| Lighthouse mobile performance (Landing) | Unknown | 85 | 95 |
| Time-to-first-meaningful-CTA | Unknown | <2s | <1s |
| WhatsApp/LinkedIn unfurl success rate | ~50% (SVG OG breaks) | 100% | 100% |
| Signups from `.edu.in` emails | Unknown | 30% | 50% |
| Referral-attributed signups | 0% | 5% | 25% |
| Hero CTA click-through rate | Unknown | 8% | 12% |
| Bounce rate on Landing | Unknown | <60% | <45% |

The single most important number to obsess over for the next 30 days is **AuthPanel open rate × signup completion rate**. Everything else is downstream. If 100 visitors hit Landing and 0 reach `/dashboard`, no feature in the codebase matters. Build the funnel measurement first, then optimize relentlessly.
