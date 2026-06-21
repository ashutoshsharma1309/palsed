# Placement Training Hub — Architecture

A centralized placement-prep ecosystem added to PrepNxt: 10 sections of curated
roadmaps/resources with progress tracking, global search, a homepage promo, a
redesigned hero auth card, and dashboard analytics — all data-driven and
preserving existing functionality.

---

## 1. Folder structure

```
client/src/
├─ data/placement/            # Typed resource data (NO resources hardcoded in UI)
│  ├─ types.ts                # Resource, Topic, HubSection, SearchHit
│  ├─ languages.ts            # Section 1 — Programming Languages
│  ├─ dsa.ts                  # Section 2 — DSA
│  ├─ leetcode.ts             # Section 3 — LeetCode tracks
│  ├─ webdev.ts               # Section 4 — Web Development
│  ├─ ml.ts                   # Section 5 — Machine Learning
│  ├─ ai.ts                   # Section 6 — Artificial Intelligence
│  ├─ appdev.ts               # Section 7 — App Development
│  ├─ aptitude.ts             # Section 8 — Aptitude
│  ├─ coreCs.ts               # Section 9 — Core CS
│  ├─ interview.ts            # Section 10 — Interview Prep
│  └─ index.ts                # SECTIONS registry + search index + helpers
├─ components/placement/
│  ├─ ResourceLink.tsx        # One resource row (type icon + external link + bookmark)
│  ├─ TopicCard.tsx           # Glassmorphism topic card (complete toggle + resources)
│  └─ HubSectionView.tsx      # Section header (icon, accent, progress) + topic grid
├─ components/auth/
│  └─ AuthPanel.tsx           # Tabbed Create Account / Login glassmorphism card
├─ hooks/
│  └─ usePlacementProgress.ts # localStorage progress + bookmarks + analytics
└─ routes/
   └─ PlacementHub.tsx        # /placement-hub page (lazy-loaded)
```

## 2. Routes

| Path             | Component        | Notes                                  |
| ---------------- | ---------------- | -------------------------------------- |
| `/placement-hub` | `PlacementHub`   | Lazy-loaded (own chunk), code-split    |
| `/` (homepage)   | `Landing`        | Two-column hero + auth card + hub promo |

Added to `client/src/App.tsx` (lazy import + `<Route>`) and to the global nav
(`components/layout/Nav.tsx`). No existing routes changed.

## 3. Data models (`data/placement/types.ts`)

```ts
type ResourceType = "roadmap" | "repo" | "video" | "notes" | "practice";

interface Resource {
  title: string;
  type: ResourceType;
  url: string;
  difficulty?: Difficulty;   // Beginner..Advanced / Easy..Hard
  tags?: string[];
}

interface Topic {
  id: string;                // STABLE — used as the progress key
  title: string;
  blurb?: string;
  difficulty?: Difficulty;
  recommended?: number;      // e.g. LeetCode target problem count
  resources: Resource[];
}

interface HubSection {
  id: string;                // also the in-page anchor (#id)
  title: string;
  blurb: string;
  icon: string;              // lucide icon name, mapped in HubSectionView
  accent?: string;
  topics: Topic[];
}
```

## 4. Resource system

- **All resources live in `data/placement/*.ts`** — UI components receive data via
  props and never hardcode URLs (per spec).
- `index.ts` aggregates every section into `SECTIONS`, builds a `SEARCH_INDEX`,
  and exposes `searchTopics(query)`, `getSection(id)`, `getTopic(topicId)`,
  `ALL_TOPIC_IDS`, `TOTAL_TOPICS`.
- **Add a resource**: edit the relevant section file's `topics[].resources`.
- **Add a topic**: append a `Topic` (with a new stable `id`) to a section.
- **Add a section**: create a new file exporting a `HubSection`, then import +
  append it in `index.ts`. The page, search, progress %, and dashboard pick it up
  automatically.
- GitHub repos, coding sheets (Striver, NeetCode, Grind 75, Blind 75), and dev
  roadmaps are modeled as `type: "repo" | "roadmap" | "practice"` resources.

## 5. Progress tracking (`hooks/usePlacementProgress.ts`)

localStorage-backed and reactive across components (built on
`useLocalStorageState`). Keys:

| Key                              | Shape       | Meaning                 |
| -------------------------------- | ----------- | ----------------------- |
| `prepnext.placement.completed.v1`| `string[]`  | completed topic ids     |
| `prepnext.placement.bookmarks.v1`| `string[]`  | bookmarked resource URLs|

Exposes: `isComplete / toggleComplete`, `isBookmarked / toggleBookmark`,
`completedCount`, `completionPct`, `readinessScore` (breadth 30% + depth 70%),
`sectionProgress`, `recommended` (next incomplete topic per section),
`bookmarks`, `totalTopics`.

> Progress is per-browser today (matches the app's existing localStorage model).
> Because the data keys on `Topic.id`, moving it server-side later is a drop-in:
> persist these two arrays against the authenticated user via `/api/db/*`.

## 6. Components

| Component        | Responsibility                                                        |
| ---------------- | -------------------------------------------------------------------- |
| `ResourceLink`   | One resource: type icon, truncated title, external link, bookmark. `memo`. |
| `TopicCard`      | Glass card: title, difficulty badge, recommended count, complete toggle, resource list. `memo`. |
| `HubSectionView` | Section header (icon/accent/progress bar) + responsive topic grid. `memo`. |
| `AuthPanel`      | Tabbed **Create Account** (default) / **Login**; Full Name + Confirm Password; glassmorphism. Uses `useAuth`. |
| `PlacementHub`   | Page: readiness summary, instant global search, section nav, all sections. |

## 7. Dashboard integration

`routes/Dashboard.tsx` gains a **Placement Hub** card showing readiness donut,
topics completed (+ bar), recommended next topics, and saved-resource count, with
a CTA to `/placement-hub`. Streak reuses the existing engagement streak.

## 8. Design, performance, accessibility

- **Design**: glassmorphism (`bg-white/[0.04] backdrop-blur-xl`), neon-green
  accents (`--color-neon`), `display`/`mono` type, responsive grids, hover lifts.
- **Performance**: route is `lazy()` + code-split (own chunk); cards/links are
  `memo`'d; search uses a prebuilt index; progress uses `Set`s via `useMemo`.
- **Accessibility**: semantic `<section>/<article>/<nav>/<ul>`, `role="tablist"`
  + `aria-selected` on auth tabs, `aria-pressed`/`aria-label` on toggles and
  bookmarks, labelled search input, keyboard-navigable links/buttons.

## 9. Preserved functionality

No existing routes, hooks, or data were removed. New `localStorage` keys are
namespaced (`prepnext.placement.*`) and don't collide with existing ones. The
hero keeps all original copy/CTAs; the auth card replaces the old single-form
panel with a tabbed version using the same `useAuth` flow and `/api/auth` backend.
