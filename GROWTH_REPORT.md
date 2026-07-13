# GROWTH REPORT

> **Audit note (June 2026):** The `index.html` `<title>` / OG / Twitter "Adaptive AI Learning Universe" identity mismatch flagged in this report has since been **resolved** — the document head now ships the PrepNext placement-prep positioning. Treat references to that specific mismatch below as historical; other findings may still be open.

## 1. Executive Summary

- **PrepNext has zero viral DNA in the product today.** Every artifact a student creates — their Applications kanban, DSA streak, PYQ contribution, mastery radar, Prep Kit for a company — is locked behind `RequireAuth`. There is no public share surface, no "view-only" link, no OG-image-per-asset, and no referral primitive in the `User` schema. The whole growth strategy must start by exposing crowd-generated artifacts as public, indexable, share-shaped objects.
- **The Companies vault + PYQ vault are the only two true SEO and viral assets** and they are catastrophically underused. 50 companies × (eligibility + packages + rounds + PYQs) is exactly the long-tail query stream Indian students are typing into Google ("Zomato OA questions 2024", "Razorpay eligibility CGPA"). Today these pages are client-rendered SPA shells with no per-route meta, no JSON-LD, no sitemap — so they exist for no one.
- **The single highest-ROI growth loop is "PYQ contribution → public verified page → backlink in WhatsApp group → new signup to contribute their own PYQ."** This is a textbook UGC SEO + virality flywheel (Glassdoor's playbook, AmbitionBox's playbook, PrepInsta's playbook). PrepNext already has the submission UI (`/pyq/submit`) and the verification model — it just doesn't expose the output to the world.
- **Certificates are sitting on a silver-bullet referral mechanic that is being wasted.** The `Certificate` model already has `verifyCode` and a public `/verify-certificate` route. Every LinkedIn post a student makes with a verify link is free distribution — but the verification page has no `og:image` per certificate, no "Get your own" CTA, no referral attribution, and the certificate share flow itself does not exist as a feature.
- **There is no referral, no invite system, no campus-leaderboard, no group/cohort primitive in the schema.** For an Indian campus-placement product, the campus is the unit of virality (everyone in CSE 2026 batch of NIT Trichy shares one WhatsApp group). Adding a `Campus`/`Cohort` model and a `ReferralCode` field on `User` is a one-week effort that unlocks 6 of the 10 loops below.

## 2. Current State

PrepNext is a hackathon-stage product with ~18 signups, zero paid users, no domain, no SEO, no marketing motion, and — most importantly — **no growth surface exposed to the open web**. The `App.tsx` route table has only four public routes: `/`, `/auth/callback`, `/onboarding`, `/verify-certificate`. Every other surface — including the entire Companies vault, PYQ Vault, DSA tracker, and Internships feed which are the assets students would actually share — is gated.

The landing page itself (per the recon) is positioned correctly as a "Placement Season Operating System", but the `<head>` block in `index.html` still markets "Adaptive AI Learning Universe". This is not a minor copy nit — it means every Google preview, every WhatsApp link unfurl, and every Twitter card a student shares pitches a different product than the page they land on. Bounce will be brutal.

The technical state actively works against growth:

- SPA-only with React Suspense, no SSR, no prerender. Crawlers see an empty shell beyond static head tags. So even if a student manually shares `/companies/zomato`, Google indexes nothing useful and WhatsApp shows the same generic OG card as the homepage.
- No `sitemap.xml`, no `robots.txt`, no canonical URLs, no per-route `<title>`/`<meta>`. The Companies vault has 50 high-intent landing pages that effectively do not exist in Google's eyes.
- No JSON-LD despite having a real FAQ on the landing (`FAQPage` schema is free traffic), a real `Organization`, a real `Course`-like structure (DSA problems map cleanly to `LearningResource`).
- The `User` model has no `referralCode`, no `referredBy`, no `campusId`. The schema has `EngagementDay` but no `Invite`, no `Share`, no `PublicProfile`.
- The certificate flow already has `verifyCode` and a public verify route — yet there is no per-certificate OG image, no LinkedIn share button, no auto-generated post copy. This is the single most concentrated example of "we built the hard part and forgot the share button".
- Dead code (Courses, Roadmaps, Tutor routes) is still in the bundle. This is not directly a growth issue but it does bloat the JS payload on first paint — which hurts the only public page (`/`) that growth depends on.

Distribution reality: zero brand, zero domain authority (vercel.app subdomain — Google deranks it, WhatsApp marks it as "suspicious-looking", no email deliverability story), no community presence, no creator partnerships, no campus ambassador program. The product has shipped; growth has not started.

## 3. Critical Issues

| # | Issue | Impact | Effort | Priority |
|---|---|---|---|---|
| 1 | All UGC (PYQs, company prep kits, applications, certificates) is auth-gated — zero shareable surface to the open web | Catastrophic | Medium | P0 |
| 2 | No SSR/prerender for `/companies/:slug` and PYQ pages — the only long-tail SEO assets are invisible to Google | Catastrophic | Medium | P0 |
| 3 | `index.html` head markets "Adaptive AI Learning Universe" while Landing markets "Placement OS" — message-match broken on every share | Critical | Trivial | P0 |
| 4 | No `referralCode` / `referredBy` / `Campus` model in Prisma schema — no referral mechanic exists at all | Critical | Low | P0 |
| 5 | Still on `prepnext.vercel.app` — no custom domain hurts deliverability, share trust, brand, SEO | Critical | Trivial | P0 |
| 6 | Certificates have `verifyCode` + public verify route but no per-cert OG image, no LinkedIn share button, no "Get yours" CTA | High | Low | P1 |
| 7 | No `sitemap.xml`, `robots.txt`, JSON-LD (Organization, WebSite, FAQPage, ItemList for Companies) | High | Low | P1 |
| 8 | No campus/cohort/leaderboard primitive — campus WhatsApp groups are the natural virality channel and the product has no hook for them | High | Medium | P1 |
| 9 | No public PYQ verification page (e.g. `/pyq/zomato/oa-2024/q-12345`) with submitter credit + upvote count + share | High | Medium | P1 |
| 10 | Dead routes (Courses/Roadmaps/Tutor) ship JS to every landing visit, slowing LCP on the only public page that matters | Medium | Low | P2 |
| 11 | No email deliverability infra (no SPF/DKIM/DMARC on a real domain) — referral emails will land in spam | Medium | Low | P2 |
| 12 | No analytics events for share/invite/copy-link actions — flying blind on K-factor | Medium | Low | P2 |

## 4. Recommendations

### 4.1 Ten Concrete PrepNext Growth Loops with CAC Estimates

These are ranked by expected K-factor for the Indian campus placement audience. CAC ranges assume INR, blended across paid + organic for the loop, and assume the loop is built end-to-end (creation surface + share surface + attribution).

**Loop 1 — PYQ Contribute-to-Read Wall (K ≈ 0.8–1.4)**
Mechanic: A student submits one verified PYQ via `/pyq/submit` → unlocks 7 days of full PYQ Vault access → public page `/pyq/:company/:round/:slug` is generated with their handle as "Contributed by" → that page ranks in Google + gets shared in the batch WhatsApp group ("yaar Zomato ka OA 2024 ka question dekh, X ne daala hai"). Every reader needs to either pay or contribute to keep reading. This is exactly Course Hero / Glassdoor's loop adapted for Indian placements.
Implementation: extend `PYQ` (assumed model) with `submitterId`, `verifiedAt`, `slug`, `voteScore`. Add public route. Add `og:image` generated server-side from the question text + company logo. Estimated CAC: **INR 0–8 per signup** at scale (purely organic after first 200 PYQs).

**Loop 2 — Certificate LinkedIn Loop (K ≈ 0.4–0.7)**
Mechanic: Finish a Prep Kit / DSA milestone → auto-issued cert with `verifyCode` → one-tap "Share on LinkedIn" pre-fills post copy ("Just finished PrepNext's Razorpay Prep Kit — 47 PYQs, 23 DSA problems, 3 system design rounds. Verify: prepnext.com/v/ABC123") → public verify page has a "Get your own kit" CTA → recruiter eyeballs + classmate eyeballs both convert.
The `Certificate` model already has `verifyCode`. You need: per-cert OG image (use `og-image-as-a-service` pattern, server-render PNG with student name, kit, score), `?ref=verifyCode` attribution on the verify page CTA. CAC: **INR 5–20 per signup**.

**Loop 3 — Campus Leaderboard Loop (K ≈ 0.5–0.9)**
Mechanic: Add `Campus` model + `User.campusId`. On signup, infer campus from `.edu.in` email or ask. Show "You are #14 in DSA at NIT Trichy 2026 batch" + a public leaderboard at `/campus/nit-trichy/2026`. The leaderboard page is shareable, indexable, and creates a competitive WhatsApp share moment ("bhai I'm #3 now"). Add weekly digest email to campus: "This week at NIT Trichy: 12 new PYQs, 3 offers logged".
This requires a `Campus` table, `Cohort` (campus + year), a leaderboard query, and a public read route. CAC: **INR 3–12 per signup**.

**Loop 4 — Application Tracker "Offer Card" Loop (K ≈ 0.3–0.6)**
Mechanic: When a student moves an application card to the "Offer" column in the kanban, prompt "Share your offer story (anonymous OK)?". Generate a beautiful public card at `/offers/:slug` ("Got an offer from Zomato as SDE-1, prepped 4 months on PrepNext, here's my kit"). This is the AmbitionBox + Glassdoor loop. Each offer card creates a backlink and a WhatsApp moment.
Hook into the kanban transition logic. Add `Offer` model derived from application. CAC: **INR 0–10 per signup** (offer stories are gold — they go viral on LinkedIn).

**Loop 5 — Two-Sided Referral with Streak Shield (K ≈ 0.2–0.4)**
Mechanic: Add `User.referralCode` + `User.referredBy`. Every user gets a code. Inviter gets a "streak shield" (one free skip-day for SRS) per accepted invite + 1 month of paid for 3 invites. Invitee gets 7 days paid. Show this in `/settings` and after every quiz with > 80% score ("Share this with someone in your batch").
Pure referral CAC: **INR 30–80 per signup** (referral programs always have lower K than UGC loops, but they convert better — referred users are higher LTV).

**Loop 6 — "Roast My Resume" Public Tool Loop (K ≈ 0.6–1.0)**
Mechanic: Build a free, no-signup-required tool at `/tools/resume-roast` that takes a PDF resume and returns 5 specific issues + 5 missing keywords for top-50 PrepNext companies. Watermarked output. Public sharable URL of the roast. Tweet-friendly format.
This is Levels.fyi's salary-card playbook. The tool is the bait, the watermark is the distribution, the company keywords are the bridge to your Companies vault. CAC: **INR 2–15 per signup** if it goes viral on Twitter/LinkedIn India.

**Loop 7 — WhatsApp Group Drop Kit (K ≈ 0.3–0.5)**
Mechanic: After every completed Prep Kit or DSA milestone, generate a pre-formatted "WhatsApp drop" — a 4-line message + link with company name + OG card. One-tap copy. The format is calibrated for what gets pasted into batch groups: short, useful, with a link. Track shares via a `Share` event table.
This is the Notion/Substack share-button playbook adapted for India's actual primary channel (WhatsApp, not Twitter). CAC: **INR 5–15 per signup**.

**Loop 8 — Company-Specific "Last Year's OA" Email Wall (K ≈ 0.2–0.4)**
Mechanic: For each of the 50 companies, when a student visits `/companies/:slug`, allow them to "Get last year's OA questions emailed to me" — requires email + campus. This collects email even from non-signups (for retargeting) and the campus signal builds the campus dataset. Send via Loops/Resend. After 24h send a "5 more PYQs from your batch" follow-up.
This is a top-of-funnel email harvesting loop, not a viral loop, but it boosts effective CAC by re-engagement. CAC: **INR 12–30 per signup**.

**Loop 9 — Public Mastery Radar Profile (K ≈ 0.2–0.3)**
Mechanic: Make `/u/:handle` public (opt-in). Show the mastery radar (from `MasteryEntry`), DSA stats, badges, completed kits. Make it LinkedIn-link-worthy — students will paste it under "Open to placements" headlines. Each profile view by a recruiter or classmate is a brand impression.
This is the LeetCode profile + Codeforces profile loop. The trick is the OG image must look like a status symbol. CAC: **INR 10–25 per signup**.

**Loop 10 — Campus Ambassador + Verified Senior Loop (K ≈ paid, then ≈ 0.3)**
Mechanic: Recruit one student per campus (start with top-50 NITs/IITs/BITS/IIITs) as a verified "PrepNext Senior". Give them: free paid plan for life, a verified badge on their public profile, a campus-leaderboard admin role, INR 1000 per 50 verified signups from their campus, and exclusive access to seed company PYQs.
Run via Unstop-style outreach. The senior posts in their campus WhatsApp/Discord. CAC: **INR 40–100 per signup** but very high LTV (whole-campus penetration once a senior is locked in).

### 4.2 Cross-Cutting Recommendations

**Fix the message-match in `client/index.html` today.** The `<title>`, `og:title`, `og:description`, `twitter:title`, `twitter:description`, `meta name="description"`, and `meta name="keywords"` all need to be rewritten to match the Landing's "Placement Season Operating System" positioning. Target keywords: "campus placement prep", "previous year OA questions", "Indian company recruitment", "internship tracker". This is a 15-minute change with outsized impact on every share preview going forward.

**Buy `prepnext.in` or `prepnext.co` today.** `vercel.app` subdomains tank Google rankings, get flagged by Indian campus mail filters (gmail.com → @nitt.edu, @iiit.ac.in often reject unknown senders), and look unfundable. INR 700/yr investment.

**Ship an Express route `/sitemap.xml` and `/robots.txt`** that enumerates the 50 companies, all verified PYQs, all public certificates, all campus pages. This is a 50-line Express handler reading from Prisma. Submit to Google Search Console and Bing Webmaster. Expect indexation within 2 weeks.

**SSR or pre-render the long-tail pages.** Cheapest path: a Vercel cron job that hits each `/companies/:slug` and PYQ page server-side, renders via Puppeteer, and writes static HTML to `/public/static/companies/:slug.html` with proper meta. Rewrite rule serves the static file to bots (User-Agent sniff) and the SPA to humans. This is hacky but ships in a weekend vs. a Next.js migration. Long term: migrate to Next.js App Router (the recon notes Vite + React Router — the Next.js migration is a 2-3 week project but solves SEO permanently).

**Add JSON-LD to the Landing and per-route.** `Organization` on `/`, `FAQPage` on `/` (the recon mentions a real FAQ), `ItemList` of companies on `/companies`, `LearningResource` for each DSA problem, `Course` for each Prep Kit. Free SERP real estate.

**Add `referralCode` (default = nanoid(8)) and `referredBy` (FK to User) to the `User` model.** Migration is trivial. Backfill existing 18 users. Wire up `?ref=CODE` parsing in the Landing → store in localStorage → attach on signup in the Supabase auth flow.

**Kill the dead routes (Courses, Roadmaps, Tutor) from `App.tsx` and `routes/`** to shrink the landing-page JS bundle. The recon explicitly flags this. LCP on `/` directly drives signup conversion.

**Build a `Share` event table** (userId, surface, target, sharedAt). Without it you cannot measure K-factor or attribute loops. Five-column table, written from every share button click. Read into a `/admin/growth` dashboard.

## 5. 30-Day Priorities

1. **Day 1 — Fix `client/index.html` head + buy `prepnext.in`.** Rewrite all meta to "Placement Season Operating System". Point DNS. Update Supabase Auth redirect URLs. Update Google OAuth callback. Deliverable: live on a real `.in` domain with consistent messaging.
2. **Days 2–4 — Add `referralCode`, `referredBy`, and `Campus` to Prisma schema.** Migration, backfill, expose in `/settings`. Add `?ref=` parsing on Landing → localStorage → attach on Supabase signup via `data` user metadata. Deliverable: every signup has a referrer attributed.
3. **Days 5–10 — Ship public PYQ pages with per-page OG images.** New route `/pyq/:company/:round/:slug` (public), rendered server-side via Express + a simple HBS/JSX template. Per-page `og:image` generated via `@vercel/og` or `satori`. Add submitter credit + vote count + "Got more PYQs? Contribute" CTA. Deliverable: at least 100 PYQ public pages indexable by Google.
4. **Days 11–14 — Ship `sitemap.xml`, `robots.txt`, canonical tags, JSON-LD (Organization, WebSite, FAQPage on `/`, ItemList on `/companies`).** Submit to GSC + Bing. Deliverable: 200+ URLs submitted, first impressions visible in GSC.
5. **Days 15–20 — Certificate LinkedIn loop.** Per-cert OG image, one-tap LinkedIn share with pre-filled copy, "Get your own kit" CTA on `/verify-certificate?code=...` with referrer attribution. Deliverable: live on every issued cert.
6. **Days 21–25 — Resume Roast tool at `/tools/resume-roast`** (public, no signup). Upload PDF, parse, return 5 issues + 5 keyword gaps for top-50 PrepNext companies, watermarked shareable URL. Deliverable: live tool with share-URL output.
7. **Days 26–30 — `Share` event table + `/admin/growth` dashboard.** Track copy-link, LinkedIn-share, WhatsApp-share clicks across all surfaces. Compute K-factor weekly. Deliverable: first weekly K-factor number on the books.

## 6. 90-Day Priorities

1. **Days 31–45 — Migrate landing + public routes to Next.js App Router (or commit to the SSR-via-puppeteer hack).** Real SSR for `/companies/:slug`, `/pyq/...`, `/u/:handle`, `/campus/:slug`. Deliverable: 100% of public routes server-rendered with crawlable HTML.
2. **Days 46–55 — Campus leaderboard system.** `Campus`, `Cohort`, leaderboard queries, public `/campus/:slug/:year` page, weekly digest email (via Resend/Loops) to all users in a cohort. Deliverable: 20 campuses live with at least one user, 5 with > 5 users.
3. **Days 56–65 — Two-sided referral with streak shield + 7-day paid for invitee.** Wire into post-quiz, post-Prep-Kit, and `/settings`. Email + WhatsApp share copy templates per campus context. Deliverable: 30% of new signups attributed to a referrer.
4. **Days 66–75 — Campus Ambassador program v1.** Recruit one verified senior per campus (top 50). Verified badge, lifetime paid, INR 1000/50-signup bounty. Slack/Discord cohort for ambassadors. Deliverable: 30 ambassadors signed, 10 active (defined as > 20 signups attributed).
5. **Days 76–85 — Application "Offer Card" public pages.** Hook into kanban → Offer column transition. Generate `/offers/:slug` with anonymized option. LinkedIn-ready OG card. Deliverable: 20+ offer cards published, at least 5 shared on LinkedIn.
6. **Days 86–90 — WhatsApp Drop Kit on every win surface.** Calibrated 4-line copy + link + OG card, one-tap copy. Deliverable: live on Prep Kit completion, DSA milestones, mock interview completion.
7. **Days 86–90 (parallel) — Email infra hardening on `prepnext.in`.** SPF, DKIM, DMARC. Move transactional to Resend, marketing to Loops. Warm up sending domain. Deliverable: > 95% inbox placement on Gmail (largest target since most `.edu.in` are Google Workspace).

## 7. Metrics to Track

**North-Star**
- Weekly Active Placement Users (WAPU): unique users with at least one of (PYQ view, DSA submit, kanban move, Prep Kit open) in the last 7 days. **Target Day 30: 200. Day 90: 2,000.**

**Acquisition**
- Signups/week. **Target D30: 50/wk. D90: 500/wk.**
- Organic % of signups (via GSC + UTM-less landing). **Target D30: 20%. D90: 50%.**
- Referred % of signups (via `referredBy`). **Target D30: 10%. D90: 35%.**
- Google indexed pages. **Target D30: 200. D90: 2,000** (50 companies × ~40 PYQ pages avg).
- Top-3 SERP positions for long-tail queries (e.g. "[Company] OA questions 2024"). **Target D90: 30 queries.**

**Virality (K-factor)**
- Shares per active user per week (from `Share` event table). **Target D30: 0.2. D90: 0.6.**
- K-factor = (invites sent × conversion rate). **Target D30: 0.15. D90: 0.5.**
- Time-to-first-share per new user. **Target D90: < 48 hours median.**

**Activation**
- % of new signups who submit one PYQ or solve one DSA problem in 24h. **Target D30: 30%. D90: 50%.**
- % of new signups who add at least one application to kanban in 7 days. **Target D90: 40%.**

**Loop-specific**
- PYQs submitted per week. **Target D30: 100. D90: 800.**
- Certificates issued per week. **Target D90: 150.**
- LinkedIn shares of certificates per week (tracked via referrer in verify-page hits). **Target D90: 50.**
- Resume Roasts run per week. **Target D90: 500.** Conversion to signup: 8%.
- Campus pages with > 5 active users. **Target D90: 20.**
- Ambassador-attributed signups. **Target D90: 600 cumulative.**

**Retention**
- W1 retention (signup-week + 1). **Target D90: 35%.**
- W4 retention. **Target D90: 18%.**
- Streak-7 users (engagement). **Target D90: 200.**

**Brand / Distribution**
- Domain Rating (Ahrefs/free alt). **Target D90: 15.**
- Referring domains. **Target D90: 50** (campus blogs, college subreddits, Unstop articles, GFG forum threads).
- Branded search volume for "prepnext". **Target D90: 200/mo** (per GSC).

**Anti-metrics (watch for trouble)**
- Bounce rate on `/companies/:slug` from Google. Must drop below 60% within 60 days of SSR ship — otherwise the long-tail pages are not satisfying intent and need richer content (more PYQs per company, salary ranges, interviewer notes).
- Signup → onboarding completion < 70% means the `/onboarding` step is leaking. Worth instrumenting now.
- Supabase Auth email delivery rate. If < 95% on Gmail, switch to a custom SMTP via Resend with the warmed domain — OTP failure is a silent killer for an OTP-first signup flow.
