// ── Module 3: Styling & Layout — selectors, flexbox, grid, responsive design,
// accessibility, and utility-first CSS. Continues the foundations voice/depth.
// Content synthesised from MDN / Tailwind docs as references only (no copied text).
import type { Module, Lesson } from "../types";

// ── Lesson 9 — Selectors, Specificity & the Cascade ─────────────────────────
const cssSelectorsSpecificity: Lesson = {
  id: "css-selectors-specificity",
  domain: "web",
  moduleId: "web-styling-layout",
  title: "Selectors, Specificity & the Cascade",
  objective:
    "Predict which CSS rule wins when several target the same element — selectors, combinators, the specificity algorithm, and inheritance.",
  difficulty: "Beginner",
  estMinutes: 8,
  prerequisites: ["css-box-model"],
  tags: ["css", "selectors", "specificity", "cascade"],
  theory: `The box model told you what an element *is*; selectors decide *which* elements a rule applies to. And because several rules usually target the same element, CSS needs a tiebreaker. That tiebreaker — the **cascade** plus **specificity** — is behind almost every "why isn't my style applying?!" moment.

### Selectors: pointing at elements

The three you'll write constantly:

- **Element** — \`p { … }\` targets every \`<p>\`.
- **Class** — \`.card { … }\` targets \`class="card"\`. Reusable; your default choice.
- **ID** — \`#header { … }\` targets \`id="header"\`. Unique per page; heavy-handed for styling.

**Combinators** relate selectors to each other: \`nav a\` (descendant — any \`<a>\` anywhere inside \`<nav>\`), \`nav > a\` (child — direct children only), \`h2 + p\` (adjacent sibling — the \`<p>\` immediately after an \`<h2>\`). Pseudo-classes like \`:hover\` and \`:focus\` match *states* rather than structure.

### Specificity: the tiebreaker

When two rules set the same property on the same element, the browser scores each selector as three numbers — **(IDs, classes, elements)** — and the higher score wins, compared left to right:

- \`p\` → (0,0,1)
- \`.card p\` → (0,1,1)
- \`#sidebar .card p\` → (1,1,1)

An ID beats any number of classes; a class beats any number of elements. Inline \`style="…"\` attributes outrank all selectors, and \`!important\` outranks even that — which is exactly why \`!important\` is a last resort: it breaks the ladder everyone else is climbing.

### The cascade and inheritance

If two rules have **equal** specificity, the one that appears **later** in the stylesheet wins — that's the cascade's source-order rule. Separately, some properties (**inheritance**) flow from parent to child automatically: text properties like \`color\` and \`font-family\` inherit; box properties like \`margin\`, \`padding\`, and \`border\` do not. That's why setting \`font-family\` once on \`body\` styles the whole page, but setting \`border\` on \`body\` doesn't draw a border around every paragraph.

### The debugging workflow

When a style doesn't apply, don't guess — open DevTools, inspect the element, and read the Styles panel. Crossed-out declarations lost to a more specific rule; the winning rule is at the top. Keeping your own selectors *flat* (mostly single classes) keeps specificity low and predictable, which is the real-world fix: you rarely need to win specificity wars if you never start them.`,
  intuition:
    "Specificity is like ID checks at a venue: a passport (ID selector) beats any stack of membership cards (classes), and a membership card beats any number of casual mentions of your name (element selectors). If two people show the same credentials, whoever arrived last (source order) gets the seat.",
  definitions: [
    { term: "Selector", meaning: "The pattern before `{}` that decides which elements a rule styles." },
    { term: "Combinator", meaning: "Syntax relating selectors: descendant (space), child (`>`), adjacent sibling (`+`)." },
    { term: "Specificity", meaning: "The (IDs, classes, elements) score that decides which conflicting rule wins." },
    { term: "Cascade", meaning: "The overall conflict-resolution order: importance, then specificity, then source order." },
    { term: "Inheritance", meaning: "Some properties (mostly text: `color`, `font-*`) flow from parent to child automatically." },
  ],
  language: "css",
  syntax: `/* specificity: (IDs, classes, elements) */
p              { color: gray; }   /* (0,0,1) */
.note          { color: blue; }   /* (0,1,0) */
#intro         { color: green; }  /* (1,0,0) — wins over both */
nav > a:hover  { color: red; }    /* (0,1,2) — child combinator + state */`,
  example: {
    language: "css",
    code: `/* Which color is <p class="note" id="intro">? */
p       { color: gray; }   /* (0,0,1) */
.note   { color: blue; }   /* (0,1,0) beats (0,0,1) */
#intro  { color: green; }  /* (1,0,0) beats (0,1,0) → GREEN wins */

/* Equal specificity? Later rule wins: */
.note { color: blue; }
.note { color: purple; }   /* same (0,1,0), later → PURPLE */`,
    explanation:
      "The browser scores every matching selector, compares (IDs, classes, elements) left to right, and only falls back to source order on a tie. The paragraph is green; in the second pair, purple wins purely by coming later.",
  },
  visual: {
    kind: "mermaid",
    caption: "Who wins a conflict, from strongest to weakest.",
    src: `graph TD
    A["!important"] --> B["Inline style attribute"]
    B --> C["#id selectors (1,0,0)"]
    C --> D[".class / :pseudo-class (0,1,0)"]
    D --> E["element selectors (0,0,1)"]
    E --> F["Tie? Later in source order wins"]`,
  },
  keyConcepts: ["Class selectors as the default tool", "(IDs, classes, elements) scoring", "Source order breaks ties", "Text properties inherit; box properties don't"],
  commonMistakes: [
    "Reaching for `!important` instead of finding (and lowering) the competing selector's specificity.",
    "Writing long descendant chains like `#app .page .card .title` — they're brittle and start specificity wars.",
    "Expecting `margin`/`padding` to inherit like `color` does — box properties never inherit.",
    "Assuming a rule 'later in the file' always wins — source order only matters when specificity is equal.",
  ],
  tips: [
    "'Explain CSS specificity' is a standard frontend screen — answer with the (IDs, classes, elements) triple and a concrete example.",
    "A great follow-up they ask: 'why is `!important` bad?' — it breaks the normal resolution order, so the only counter is another `!important`, and the arms race begins.",
    "In DevTools, crossed-out styles in the inspector show you exactly which rule beat yours.",
  ],
  quiz: [
    {
      id: "web9-q1",
      type: "mcq",
      prompt: "Which selector wins for `<p class=\"note\" id=\"intro\">` if all three set `color`?",
      options: ["`p`", "`.note`", "`#intro`", "Whichever appears last in the file"],
      answerIndex: 2,
      explanation: "`#intro` scores (1,0,0), which beats `.note`'s (0,1,0) and `p`'s (0,0,1). Source order only decides ties.",
    },
    {
      id: "web9-q2",
      type: "output",
      prompt: "Both rules match the same element. What color does it render?",
      language: "css",
      code: `.btn { color: blue; }\n.btn { color: red; }`,
      answers: ["red"],
      explanation: "Both selectors score (0,1,0) — a tie. The cascade's source-order rule applies: the later declaration wins, so the element is red.",
    },
    {
      id: "web9-q3",
      type: "truefalse",
      prompt: "Setting `font-family` on `body` styles all the text inside it, because `font-family` inherits.",
      answer: true,
      explanation: "Text properties (`color`, `font-*`, `line-height`) inherit down the tree. Box properties (`margin`, `padding`, `border`) do not — that's why one `font-family` on `body` is enough.",
    },
    {
      id: "web9-q4",
      type: "fill",
      prompt: "As a specificity triple (IDs,classes,elements), the selector `#nav .link` scores ____.",
      answers: ["1,1,0", "(1,1,0)", "110"],
      placeholder: "e.g. 0,2,1",
      explanation: "One ID (`#nav`) and one class (`.link`): (1,1,0). It would beat any selector made purely of classes and elements.",
    },
  ],
  revision: [
    "Selectors target elements: element, `.class` (your default), `#id`; combinators (space, `>`, `+`) relate them.",
    "Specificity is scored as (IDs, classes, elements), compared left to right; inline styles and `!important` sit above all selectors.",
    "Equal specificity → later rule in source order wins.",
    "Text properties inherit (color, font); box properties don't. Keep selectors flat to avoid specificity wars.",
  ],
};

// ── Lesson 10 — Flexbox ─────────────────────────────────────────────────────
const flexbox: Lesson = {
  id: "flexbox",
  domain: "web",
  moduleId: "web-styling-layout",
  title: "Flexbox: One-Dimensional Layout",
  objective:
    "Lay out a row or column of items — navbars, centered content, card rows — by thinking in main and cross axes.",
  difficulty: "Beginner",
  estMinutes: 9,
  prerequisites: ["css-selectors-specificity"],
  tags: ["css", "flexbox", "layout"],
  theory: `Before flexbox, centering a box vertically was a running joke among developers. Flexbox ended the joke: it's a layout mode built for distributing space along **one dimension** — a row *or* a column — and it powers most navbars, toolbars, and card rows you see.

### The container and its axes

Set \`display: flex\` on a **container**, and its direct children become **flex items** arranged along the **main axis** (horizontal by default; \`flex-direction: column\` makes it vertical). The perpendicular direction is the **cross axis**. Every flexbox property aligns along one of these two axes — internalise that and the property names stop being arbitrary:

- **\`justify-content\`** — distributes items along the **main** axis (\`flex-start\`, \`center\`, \`space-between\`, \`space-around\`).
- **\`align-items\`** — aligns items along the **cross** axis (\`stretch\` by default, \`center\`, \`flex-start\`).
- **\`gap\`** — fixed spacing between items, replacing margin hacks.

The trap: when you switch to \`flex-direction: column\`, the axes swap. \`justify-content\` now moves things vertically. The properties follow the *axis*, not the screen direction.

### How items share space: grow, shrink, basis

Three per-item properties control sizing:

- **\`flex-basis\`** — the starting size before space is distributed.
- **\`flex-grow\`** — how much of the *leftover* space this item takes (0 = none; items with grow 2 take twice the share of items with grow 1).
- **\`flex-shrink\`** — how willingly it shrinks when space runs out.

The shorthand \`flex: 1\` (grow 1, shrink 1, basis 0) is the workhorse: give it to every item and they share space equally; give it to one item in a navbar and it swallows the middle, pushing siblings to the edges.

### The patterns you'll actually build

- **Navbar**: \`display: flex; justify-content: space-between; align-items: center;\` — logo left, links right, everything vertically centered.
- **Perfect centering**: \`display: flex; justify-content: center; align-items: center;\` on the container centers a child both ways — the two-line answer to the old joke.
- **Equal card row**: container with \`gap\`, each card \`flex: 1\`.

Flexbox is one-dimensional by design. The moment you're fighting to align things into *both* rows and columns simultaneously, stop — that's a grid problem, and it's the next lesson.`,
  intuition:
    "Flex items are books on a shelf. justify-content slides the books along the shelf (main axis) — bunched left, centered, spread out. align-items decides how they sit against the shelf height (cross axis) — stretched to fill, or centered. flex-grow is which books inflate to claim leftover shelf space.",
  definitions: [
    { term: "Flex container", meaning: "The element with `display: flex`; its direct children become flex items." },
    { term: "Main axis", meaning: "The direction items flow in — horizontal for `row` (default), vertical for `column`." },
    { term: "Cross axis", meaning: "The axis perpendicular to the main axis." },
    { term: "justify-content / align-items", meaning: "Distribute along the main axis / align along the cross axis." },
    { term: "flex: 1", meaning: "Shorthand for grow 1, shrink 1, basis 0 — 'take an equal share of the space'." },
  ],
  language: "css",
  syntax: `.container {
  display: flex;              /* children become flex items */
  flex-direction: row;        /* main axis: horizontal (default) */
  justify-content: center;    /* main-axis distribution */
  align-items: center;        /* cross-axis alignment */
  gap: 16px;                  /* space between items */
}
.item { flex: 1; }            /* share leftover space equally */`,
  example: {
    language: "css",
    code: `/* A real navbar: logo left, links right, all vertically centered */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

/* Center anything, both axes — the classic */
.hero {
  display: flex;
  justify-content: center;  /* main axis (horizontal) */
  align-items: center;      /* cross axis (vertical) */
  min-height: 100vh;
}`,
    explanation:
      "`space-between` pushes the first and last children to the container's edges — exactly a navbar's shape. The `.hero` pattern is the canonical two-line answer to 'center a div': one property per axis.",
  },
  keyConcepts: ["Main vs cross axis", "justify-content (main) vs align-items (cross)", "grow/shrink/basis and `flex: 1`", "Flexbox is one-dimensional"],
  commonMistakes: [
    "Mixing up `justify-content` and `align-items` — remember: justify = main axis, align = cross axis.",
    "Forgetting the axes swap with `flex-direction: column`, so `justify-content` suddenly moves items vertically.",
    "Adding margins between items instead of `gap`, then fighting the extra margin on the last item.",
    "Expecting `display: flex` to affect grandchildren — only *direct* children become flex items.",
  ],
  tips: [
    "'How do you center a div?' is still asked constantly — `display: flex; justify-content: center; align-items: center;` is the expected modern answer.",
    "'Flexbox vs Grid?' — one dimension vs two. Saying that sentence, then giving a navbar vs page-layout example, is a complete interview answer.",
  ],
  quiz: [
    {
      id: "web10-q1",
      type: "mcq",
      prompt: "Which pair centers a child both horizontally and vertically in a default (`row`) flex container?",
      options: [
        "`text-align: center; vertical-align: middle;`",
        "`justify-content: center; align-items: center;`",
        "`margin: auto 0; float: center;`",
        "`align-content: center; justify-items: center;`",
      ],
      answerIndex: 1,
      explanation: "`justify-content` centers along the main (horizontal) axis, `align-items` along the cross (vertical) axis. The other options are legacy hacks or grid-only properties.",
    },
    {
      id: "web10-q2",
      type: "output",
      prompt: "The container is `flex-direction: column`. Along which screen direction does `justify-content: center` center the items — answer `horizontal` or `vertical`?",
      language: "css",
      code: `.stack {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}`,
      answers: ["vertical", "vertically"],
      explanation: "`justify-content` always works on the *main* axis. With `column`, the main axis runs vertically — so the items are centered vertically. The property follows the axis, not the screen.",
    },
    {
      id: "web10-q3",
      type: "truefalse",
      prompt: "Flexbox is designed to align items in rows and columns at the same time.",
      answer: false,
      explanation: "Flexbox is one-dimensional: a row *or* a column (wrapping creates independent lines, not a true grid). Simultaneous row-and-column control is CSS Grid's job.",
    },
    {
      id: "web10-q4",
      type: "fill",
      prompt: "The flex item property that controls how much *leftover* space an item takes is flex-____.",
      answers: ["grow", "flex-grow"],
      placeholder: "flex-...",
      explanation: "`flex-grow` distributes surplus space proportionally: an item with grow 2 receives twice the extra space of an item with grow 1. `flex: 1` sets it to 1.",
    },
  ],
  revision: [
    "`display: flex` on a container lays direct children along a main axis (row default, column optional).",
    "justify-content = main axis; align-items = cross axis. Axes swap with `flex-direction: column`.",
    "`flex: 1` = grow 1 / shrink 1 / basis 0 — items share leftover space equally; use `gap` for spacing.",
    "Patterns: navbar = `space-between` + `align-items: center`; perfect centering = center + center. Two-dimensional layouts want Grid.",
  ],
};

// ── Lesson 11 — CSS Grid ────────────────────────────────────────────────────
const cssGrid: Lesson = {
  id: "css-grid",
  domain: "web",
  moduleId: "web-styling-layout",
  title: "CSS Grid: Two-Dimensional Layout",
  objective:
    "Build page-level layouts with rows AND columns — template tracks, fr units, named areas, and auto-fit for responsive grids without media queries.",
  difficulty: "Beginner",
  estMinutes: 9,
  prerequisites: ["flexbox"],
  tags: ["css", "grid", "layout"],
  theory: `Flexbox distributes items along one line. **CSS Grid** controls rows *and* columns at once — you define the skeleton on the container, then place items into it. It's the tool for whole-page layouts (header/sidebar/main/footer), photo galleries, and dashboards.

### Defining the tracks

\`display: grid\` plus **\`grid-template-columns\`** defines the column tracks:

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  gap: 16px;
}
\`\`\`

That's three columns: a fixed 200px, then two flexible ones. The **\`fr\` unit** means "a fraction of the remaining space" — \`1fr 1fr\` splits leftovers equally; \`2fr 1fr\` gives the first twice as much. \`repeat(3, 1fr)\` is shorthand for three equal columns. Rows work the same via \`grid-template-rows\`, but usually you let rows size themselves from content. Children fill cells automatically, left to right, wrapping to new rows — no per-item CSS needed for a basic grid.

### Named areas: layout you can read

**\`grid-template-areas\`** lets you *draw* the layout as text:

\`\`\`css
grid-template-areas:
  "header header"
  "sidebar main"
  "footer footer";
\`\`\`

Each child sets \`grid-area: header\` (etc.) and snaps into place. The stylesheet becomes a picture of the page — and rearranging the layout for mobile means rewriting the picture, not the components.

### Responsive grids without media queries

The most useful single line in Grid:

\`\`\`css
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
\`\`\`

Translation: "make as many columns as fit, each at least 250px, sharing extra space equally." Shrink the window and the grid re-flows from 4 columns to 3 to 2 to 1 — a fully responsive card gallery with zero media queries.

### Grid or flexbox?

The honest rule: **content-out vs layout-in**. Flexbox lets content determine the layout — items take the space they need along one line (navbars, button rows, tag lists). Grid imposes a structure the content fits *into* — you decide the tracks first (page shells, galleries, forms with aligned labels). They're teammates, not rivals: a typical page uses Grid for the shell and flexbox inside each region.`,
  intuition:
    "Flexbox is arranging books on a single shelf; Grid is designing the whole bookcase — you decide how many shelves and columns exist and how wide each is, then slot things into the compartments. Named areas are the pencil sketch of the bookcase you drew before building it.",
  definitions: [
    { term: "Grid track", meaning: "A row or column of the grid, defined by `grid-template-rows/columns`." },
    { term: "fr unit", meaning: "A fraction of the remaining free space — `1fr 2fr` splits leftovers 1:2." },
    { term: "grid-template-areas", meaning: "An ASCII picture of the layout; items place themselves with `grid-area`." },
    { term: "auto-fit + minmax()", meaning: "Create as many columns as fit, each between a min and max size — responsive without media queries." },
  ],
  language: "css",
  syntax: `.layout {
  display: grid;
  grid-template-columns: 200px 1fr;   /* fixed sidebar + flexible main */
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  gap: 16px;
}
.sidebar { grid-area: sidebar; }
.header  { grid-area: header; }
.main    { grid-area: main; }`,
  example: {
    language: "css",
    code: `/* Responsive card gallery — no media queries needed */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

/* 1000px wide container → 3 columns (3 × 250 fits, 4 × 250 doesn't;
   the 3 columns then stretch to share the extra space).
   Narrow phone → 1 full-width column. Same one rule. */`,
    explanation:
      "`auto-fit` keeps adding columns while each can stay ≥250px; `minmax(250px, 1fr)` then lets the columns that fit stretch equally. The grid re-flows itself at every width — the pattern interviewers love to see instead of a stack of media queries.",
  },
  visual: {
    kind: "mermaid",
    caption: "Choosing between flexbox and grid.",
    src: `graph TD
    A["Laying out items?"] --> B{"One dimension\n(a row OR a column)?"}
    B -- yes --> C["Flexbox — content decides sizes\n(navbar, button row, tags)"]
    B -- no --> D{"Rows AND columns\nmust align?"}
    D -- yes --> E["Grid — you define tracks first\n(page shell, gallery, dashboard)"]
    D -- "it's both" --> F["Grid for the shell,\nflexbox inside each region"]`,
  },
  keyConcepts: ["Tracks via grid-template-columns", "fr = share of leftover space", "Named template areas", "auto-fit + minmax for query-free responsiveness", "Grid = layout-in, flex = content-out"],
  commonMistakes: [
    "Using `px` for every track instead of `fr`, producing rigid grids that overflow small screens.",
    "Forcing flexbox (with wrap and width hacks) to do a 2-D layout that Grid expresses in one rule.",
    "Confusing `auto-fit` with `auto-fill` — `auto-fill` keeps empty ghost tracks; `auto-fit` collapses them so real items stretch.",
    "Forgetting `gap` works in Grid too, and spacing cells with margins instead.",
  ],
  tips: [
    "'When would you use Grid vs Flexbox?' — answer with the dimension rule plus one example each; mentioning 'Grid for the page shell, flex inside components' shows production experience.",
    "`repeat(auto-fit, minmax(250px, 1fr))` is worth memorising verbatim — it turns a whole class of responsive-layout interview tasks into one line.",
  ],
  quiz: [
    {
      id: "web11-q1",
      type: "mcq",
      prompt: "What does `1fr` mean in `grid-template-columns: 200px 1fr`?",
      options: [
        "Exactly 1% of the container width",
        "One fraction of the space remaining after fixed tracks are placed",
        "The width of one child element",
        "A fixed 1-pixel column",
      ],
      answerIndex: 1,
      explanation: "`fr` distributes *leftover* space after fixed sizes: here the second column takes everything remaining beyond the 200px first column (and any gaps).",
    },
    {
      id: "web11-q2",
      type: "output",
      prompt: "How many columns does this grid have? Answer with a number.",
      language: "css",
      code: `.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}`,
      answers: ["3", "three"],
      explanation: "`repeat(3, 1fr)` expands to `1fr 1fr 1fr` — three equal-width columns sharing the container's space.",
    },
    {
      id: "web11-q3",
      type: "truefalse",
      prompt: "CSS Grid makes flexbox obsolete — new projects should use Grid for everything.",
      answer: false,
      explanation: "They solve different problems: Grid imposes a two-dimensional structure; flexbox lets content flow along one axis. Real pages use Grid for the shell and flexbox inside components.",
    },
    {
      id: "web11-q4",
      type: "fill",
      prompt: "The container property that lets you sketch the layout as text rows like `\"sidebar main\"` is grid-template-____.",
      answers: ["areas", "grid-template-areas"],
      placeholder: "grid-template-...",
      explanation: "`grid-template-areas` names regions in an ASCII picture; children opt in with `grid-area: <name>` — layouts you can literally read.",
    },
  ],
  revision: [
    "Grid is two-dimensional: define column/row tracks on the container, children fill the cells.",
    "`fr` shares leftover space; `repeat(3, 1fr)` = three equal columns; `gap` spaces cells.",
    "`grid-template-areas` + `grid-area` make the stylesheet a readable picture of the layout.",
    "`repeat(auto-fit, minmax(250px, 1fr))` = responsive gallery without media queries. Rule of thumb: Grid for the shell, flexbox inside regions.",
  ],
};

// ── Lesson 12 — Responsive Design ───────────────────────────────────────────
const responsiveDesign: Lesson = {
  id: "responsive-design",
  domain: "web",
  moduleId: "web-styling-layout",
  title: "Responsive Design",
  objective:
    "Build one page that works from a phone to a desktop — mobile-first media queries, fluid units, clamp(), and responsive images.",
  difficulty: "Intermediate",
  estMinutes: 9,
  prerequisites: ["css-grid"],
  tags: ["css", "responsive", "media-queries", "mobile-first"],
  theory: `More than half of web traffic is phones, yet most developers build on a 27-inch monitor. Responsive design is the discipline that closes that gap: **one codebase, every screen size**. It rests on three tools — media queries, fluid units, and flexible media — plus one strategic decision about direction.

### Mobile-first: the direction decision

You can write desktop styles and *shrink* them with \`max-width\` queries, or write mobile styles and *enhance* them with \`min-width\` queries. **Mobile-first** (the second) wins in practice: the base CSS is the simple single-column version, and complexity is *added* as space appears:

\`\`\`css
.cards { display: grid; grid-template-columns: 1fr; }      /* phones: base */
@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(3, 1fr); }         /* tablets and up */
}
\`\`\`

Small screens — usually the slowest devices — also get the least CSS to process. A **media query** applies rules only when a condition holds; \`min-width\` breakpoints are the everyday case. Choose breakpoints where *your layout* breaks, not from a list of device names.

### One tag you must not forget

Without \`<meta name="viewport" content="width=device-width, initial-scale=1">\` in your \`<head>\`, phones render the page at a fake desktop width (~980px) and shrink it — every media query then misfires. If a site looks "zoomed out" on a phone, check this tag first.

### Fluid units: sizes that adapt by themselves

Pixels are fixed; fluid units flex:

- **\`rem\`** — relative to the root font size (16px default). Users who raise their browser font size see everything scale — an accessibility win \`px\` denies them.
- **\`%\`** — relative to the parent; the backbone of fluid widths.
- **\`vw\` / \`vh\`** — 1% of the viewport width/height.
- **\`clamp(min, preferred, max)\`** — the modern star: \`font-size: clamp(1rem, 2.5vw, 1.75rem)\` scales with the viewport but never below 1rem or above 1.75rem. Fluid typography in one line, no queries.

### Media that behaves

\`img { max-width: 100%; height: auto; }\` stops images from overflowing their containers — the classic broken-layout culprit. For serious performance, \`srcset\` lets the browser download a phone-sized image on phones instead of a 2MB desktop hero.

The mindset shift: stop designing *pages at fixed sizes* and start designing *rules that hold at any size*. Grid's \`auto-fit\` from last lesson, \`clamp()\`, and percentages do most of the work; media queries handle the few places where the layout genuinely restructures.`,
  intuition:
    "Responsive design is water, not ice: an ice sculpture (fixed-pixel layout) only fits the container it was carved for, while water (fluid units + flexible grids) takes the shape of any glass instantly. Media queries are the few deliberate 'pour it into a different glass' moments.",
  definitions: [
    { term: "Media query", meaning: "A CSS block that applies only when a condition holds, e.g. `@media (min-width: 768px)`." },
    { term: "Mobile-first", meaning: "Base styles target small screens; `min-width` queries layer on enhancements." },
    { term: "rem", meaning: "A unit relative to the root font size — respects the user's font-size settings." },
    { term: "clamp()", meaning: "`clamp(min, preferred, max)` — a fluid value locked between two bounds." },
    { term: "Viewport meta tag", meaning: "The `<head>` tag that makes phones report their real width instead of faking a desktop." },
  ],
  language: "css",
  syntax: `/* Mobile-first: base = small screens, queries add complexity */
.container { padding: 1rem; }

@media (min-width: 768px) {
  .container { padding: 2rem; }
}

h1 { font-size: clamp(1.5rem, 4vw, 2.5rem); }  /* fluid, bounded */
img { max-width: 100%; height: auto; }          /* never overflow */`,
  example: {
    language: "css",
    code: `/* One card list, three honest layouts */
.cards {
  display: grid;
  grid-template-columns: 1fr;   /* phones: single column */
  gap: 1rem;
}
@media (min-width: 640px) {
  .cards { grid-template-columns: repeat(2, 1fr); }  /* tablet: 2-up */
}
@media (min-width: 1024px) {
  .cards { grid-template-columns: repeat(4, 1fr); }  /* desktop: 4-up */
}`,
    explanation:
      "The base rule is the phone layout — no query needed. Each `min-width` step *adds* columns as room appears. Reading top to bottom tells the layout's whole story: 1 → 2 → 4 columns.",
  },
  keyConcepts: ["Mobile-first with min-width queries", "The viewport meta tag", "rem over px for scalability", "clamp() for fluid, bounded values", "max-width: 100% on media"],
  commonMistakes: [
    "Forgetting the viewport meta tag, then wondering why media queries 'don't work' on phones.",
    "Writing desktop-first `max-width` overrides everywhere, so mobile gets the most complex, most-overridden CSS.",
    "Picking breakpoints from device names ('iPhone width') instead of where the actual layout breaks.",
    "Hardcoding `px` font sizes, which ignore the user's browser font-size preference — `rem` respects it.",
  ],
  tips: [
    "'Walk me through making this design responsive' is a standard frontend interview task — narrating 'mobile-first base, min-width enhancements, fluid units, flexible images' is the expected structure.",
    "'What's the difference between px, em, and rem?' comes up constantly: px is fixed, em scales with the *parent's* font size (compounds), rem with the *root* (predictable).",
    "Test by resizing DevTools' responsive mode continuously, not just at 3 preset widths — fluid bugs live *between* breakpoints.",
  ],
  quiz: [
    {
      id: "web12-q1",
      type: "mcq",
      prompt: "In a mobile-first stylesheet, what are the un-queried base styles for?",
      options: [
        "Desktop screens, scaled down by queries",
        "The smallest screens; `min-width` queries add complexity upward",
        "Print layouts",
        "Browsers that don't support CSS",
      ],
      answerIndex: 1,
      explanation: "Mobile-first means the default rules serve small screens, and `@media (min-width: …)` blocks layer on multi-column complexity as space grows — simplest CSS goes to the weakest devices.",
    },
    {
      id: "web12-q2",
      type: "output",
      prompt: "On a very wide desktop viewport (where `4vw` computes to about `3rem`), what font-size does this resolve to?",
      language: "css",
      code: `h1 { font-size: clamp(1.5rem, 4vw, 2.5rem); }`,
      answers: ["2.5rem", "2.5 rem", "40px"],
      explanation: "`clamp(min, preferred, max)` uses the preferred value only while it stays between the bounds. Here `4vw` (≈3rem) exceeds the 2.5rem maximum, so the value is clamped to `2.5rem`.",
    },
    {
      id: "web12-q3",
      type: "fill",
      prompt: "The `<meta name=\"____\">` tag makes phones report their true width so media queries behave.",
      answers: ["viewport"],
      placeholder: "meta name",
      explanation: "`<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">` stops phones from pretending to be ~980px-wide desktops; without it, responsive CSS misfires.",
    },
    {
      id: "web12-q4",
      type: "truefalse",
      prompt: "Sizing text in `rem` respects a user's browser font-size setting, while `px` ignores it.",
      answer: true,
      explanation: "`rem` is relative to the root font size, which users can raise for readability — everything in rem scales along. Hardcoded `px` text stays stubbornly small: an accessibility failure.",
    },
  ],
  revision: [
    "Mobile-first: base styles = smallest screens; `@media (min-width: …)` adds layout complexity upward.",
    "The viewport meta tag is mandatory — without it phones fake a desktop width.",
    "Prefer fluid units: rem (root-relative, accessible), %, vw; `clamp(min, pref, max)` gives bounded fluidity in one line.",
    "`img { max-width: 100%; height: auto; }` prevents overflow; breakpoints go where the layout breaks, not at device names.",
  ],
};

// ── Lesson 13 — Web Accessibility ───────────────────────────────────────────
const webAccessibility: Lesson = {
  id: "web-accessibility",
  domain: "web",
  moduleId: "web-styling-layout",
  title: "Web Accessibility (a11y)",
  objective:
    "Ship interfaces that work with a keyboard and a screen reader — landmarks, focus, labels, contrast, and when NOT to reach for ARIA.",
  difficulty: "Intermediate",
  estMinutes: 10,
  prerequisites: ["html-semantics"],
  tags: ["accessibility", "a11y", "aria", "html"],
  theory: `Roughly one in six people has a disability that affects how they use the web — permanent (blindness), temporary (a broken wrist), or situational (bright sunlight, a sleeping baby on one arm). Accessibility (**a11y**) is engineering for all of them, and it's increasingly a legal requirement, not a nice-to-have. The good news from the semantics lesson still holds: *most accessibility is free if you use HTML properly.*

### Landmarks and structure

Screen-reader users don't read pages top to bottom — they *jump*: between landmarks (\`<header>\`, \`<nav>\`, \`<main>\`, \`<footer>\`), between headings, between links. Semantic landmarks and a sane heading hierarchy (one \`<h1>\`, no skipped levels) are the navigation system. A div-soup page offers them a featureless wall.

### Keyboard: the first test

Many users never touch a mouse — motor impairments, power users, screen-reader users. The test costs nothing: put your mouse away and Tab through your page. Can you reach every control? Can you *see* where you are (the **focus indicator** — never \`outline: none\` without a visible replacement)? Does Enter/Space activate things? Native \`<button>\`, \`<a>\`, and \`<input>\` pass automatically; a \`<div onClick>\` fails every part.

**Focus management** matters when the page changes around the user: opening a modal should move focus into it and *trap* Tab inside; closing it should return focus to the button that opened it. Forget this, and a keyboard user is left focused on something invisible.

### ARIA — and when not to use it

**ARIA** attributes (\`role\`, \`aria-label\`, \`aria-expanded\`…) let you describe custom widgets to assistive tech. But the **first rule of ARIA is: don't use ARIA** if a native element does the job. \`<button>\` beats \`<div role="button" tabindex="0">\` plus hand-written key handlers — the native element ships the behaviour, not just the label. ARIA describes; it never *adds* behaviour. Legitimate uses: \`aria-label\` for icon-only buttons, \`aria-expanded\` on disclosure toggles, \`aria-live\` for announcing dynamic updates. Wrong ARIA is worse than none — it makes confident, false promises to the screen reader.

### Forms, labels, contrast

Every input needs a real \`<label for>\` / \`id\` pair: screen readers announce it, and clicking the label focuses the field — placeholder text is *not* a label (it vanishes on typing). Text needs a contrast ratio of at least **4.5:1** against its background (WCAG AA); light-gray-on-white aesthetics routinely fail. DevTools' color picker shows the ratio.

### How this shows up in interviews

A11y questions are now standard frontend screens: "How would you make this dropdown accessible?", "What's wrong with a clickable div?", "How do you test accessibility?" Strong answer shape: semantic HTML first, keyboard test, focus management, ARIA only for the gaps — then automated checks (Lighthouse/axe) as a safety net, not the strategy.`,
  intuition:
    "A building with only stairs at the entrance excludes wheelchair users, delivery workers with trolleys, and parents with prams — a ramp serves them all. Semantic HTML and keyboard support are the web's ramp: built for those who need it, better for everyone (the ramp is also why *you* can navigate your own app when your trackpad dies).",
  definitions: [
    { term: "a11y", meaning: "Numeronym for 'accessibility' — 11 letters between a and y." },
    { term: "Landmark", meaning: "A semantic region (`<nav>`, `<main>`, `<header>`, `<footer>`) screen readers can jump between." },
    { term: "Focus indicator", meaning: "The visible outline showing which element receives keyboard input — never remove it without a replacement." },
    { term: "ARIA", meaning: "Attributes that *describe* custom widgets to assistive tech; they add semantics, never behaviour." },
    { term: "Contrast ratio", meaning: "Luminance ratio between text and background — WCAG AA requires ≥ 4.5:1 for body text." },
  ],
  language: "html",
  syntax: `<!-- A properly labelled, keyboard-friendly form field -->
<label for="email">Email address</label>
<input id="email" type="email" autocomplete="email" />

<!-- Icon-only button: ARIA fills the genuine gap -->
<button type="button" aria-label="Close dialog">✕</button>`,
  example: {
    language: "html",
    code: `<!-- ❌ Looks like a button, is a hole in the page for keyboards -->
<div class="btn" onclick="save()">Save</div>

<!-- 😐 ARIA patch: role + tabindex + you must hand-write key handlers -->
<div class="btn" role="button" tabindex="0" onclick="save()">Save</div>

<!-- ✅ The native element: focus, Enter/Space, semantics — all free -->
<button type="button" class="btn" onclick="save()">Save</button>`,
    explanation:
      "The first div is invisible to keyboards and screen readers. The ARIA patch *announces* a button but still needs custom keydown handlers to act like one. The real `<button>` ships all of it — the first rule of ARIA in one comparison.",
  },
  keyConcepts: ["Landmarks + headings are screen-reader navigation", "The Tab-through-your-page test", "Focus management in modals", "First rule of ARIA: prefer native elements", "Labels via for/id; contrast ≥ 4.5:1"],
  commonMistakes: [
    "`outline: none` on focus for aesthetics, leaving keyboard users navigating blind — style the outline, don't delete it.",
    "Using placeholder text as the only label — it disappears on input and many screen readers don't treat it as a label.",
    "Bolting `role=\"button\"` onto divs instead of using `<button>` — ARIA adds the announcement but none of the behaviour.",
    "Opening a modal without moving focus into it, so the keyboard user is still 'behind' the overlay tabbing through invisible content.",
  ],
  tips: [
    "'How would you make this component accessible?' — structure your answer: native element first, keyboard test, focus management, ARIA last for what's left.",
    "'401 for accessibility': the clickable-div question is the a11y screen — know exactly what `<div onclick>` loses (focus, key activation, semantics).",
    "Run Lighthouse's accessibility audit on anything you build — but say in interviews that automated tools catch only ~30–40% of issues; the keyboard test catches the rest.",
  ],
  quiz: [
    {
      id: "web13-q1",
      type: "mcq",
      prompt: "What is the 'first rule of ARIA'?",
      options: [
        "Every interactive element needs a `role` attribute",
        "Prefer a native HTML element over ARIA on a generic element when one exists",
        "ARIA attributes must always be in English",
        "Use `aria-label` on every element",
      ],
      answerIndex: 1,
      explanation: "If a native element (`<button>`, `<a>`, `<input>`) provides the semantics and behaviour, use it. ARIA only *describes* — it never adds focusability or key handling, so `<div role=\"button\">` is a promise you must fulfil by hand.",
    },
    {
      id: "web13-q2",
      type: "truefalse",
      prompt: "Adding `aria-label=\"Save\"` to a `<div onclick>` makes it keyboard-accessible.",
      answer: false,
      explanation: "`aria-label` only changes what's *announced*. The div still can't receive Tab focus or respond to Enter/Space — you'd need `tabindex=\"0\"`, `role=\"button\"`, and keydown handlers. Or just use `<button>`.",
    },
    {
      id: "web13-q3",
      type: "fill",
      prompt: "WCAG AA requires body text to have a contrast ratio of at least ____:1 against its background.",
      answers: ["4.5", "4.5:1"],
      placeholder: "e.g. 3",
      explanation: "4.5:1 is the AA minimum for normal-size text (3:1 for large text). Fashionable light-gray-on-white palettes frequently fail it — DevTools' color picker shows you the ratio.",
    },
    {
      id: "web13-q4",
      type: "mcq",
      prompt: "A modal dialog opens. Where should keyboard focus go?",
      options: [
        "Stay wherever it was, behind the overlay",
        "Into the modal, with Tab trapped inside until it closes",
        "To the browser's address bar",
        "Focus should be disabled while a modal is open",
      ],
      answerIndex: 1,
      explanation: "Move focus into the dialog (typically its first control or heading), trap Tab within it, and on close return focus to the element that opened it. Otherwise keyboard users keep tabbing through the invisible page behind the overlay.",
    },
  ],
  revision: [
    "Screen readers navigate by landmarks and headings — semantic structure IS the navigation.",
    "The zero-cost audit: unplug the mouse and Tab through the page; keep a visible focus indicator.",
    "First rule of ARIA: use the native element. ARIA describes; it never adds behaviour.",
    "Real `<label for>` on every input; contrast ≥ 4.5:1; modals must move, trap, and return focus.",
  ],
};

// ── Lesson 14 — Tailwind & Utility-First CSS ────────────────────────────────
const tailwindUtilityCss: Lesson = {
  id: "tailwind-utility-css",
  domain: "web",
  moduleId: "web-styling-layout",
  title: "Tailwind & Utility-First CSS",
  objective:
    "Translate the CSS you now know into utility classes — the utility-first mental model, responsive and state variants, and an honest take on when it wins.",
  difficulty: "Intermediate",
  estMinutes: 8,
  prerequisites: ["responsive-design"],
  tags: ["tailwind", "css", "utilities", "workflow"],
  theory: `Everything so far separated structure (HTML) from style (CSS files). **Utility-first CSS** — with **Tailwind** as the dominant tool — deliberately collapses that separation: instead of inventing a class name and styling it elsewhere, you compose tiny single-purpose classes directly in the markup. It's not a replacement for knowing CSS; it's a *faster keyboard* for the CSS you already know.

### The mental model shift

Traditional flow: name a thing (\`.pricing-card\`), switch to the stylesheet, write its rules, switch back. Utility flow: say what you mean, inline:

\`\`\`html
<div class="flex items-center gap-4 p-6 rounded-lg shadow">
\`\`\`

Every utility maps 1:1 to CSS you've learned: \`flex\` → \`display: flex\`, \`items-center\` → \`align-items: center\`, \`p-6\` → \`padding: 1.5rem\`, \`grid-cols-3\` → \`grid-template-columns: repeat(3, 1fr)\`. This is why the previous five lessons weren't optional: **Tailwind assumes you know what these properties do.** A developer who doesn't understand flexbox will produce the same broken layouts in Tailwind, just faster.

### Variants: responsive and state, inline

Prefixes scope any utility to a condition:

- **Responsive:** \`md:flex\` applies \`display: flex\` at the \`md\` breakpoint **and up** — Tailwind is mobile-first, exactly like the last lesson. \`grid-cols-1 md:grid-cols-3\` *is* the mobile-first card grid you wrote with media queries, in six words.
- **State:** \`hover:bg-blue-600\`, \`focus:ring-2\`, \`disabled:opacity-50\` — pseudo-classes without leaving the markup.

### The real trade-offs

Why teams adopt it: styles are **colocated** (see a component, see its styling — nothing to hunt for, nothing orphaned when you delete it); the **design-token scale** (\`p-4\`, \`text-lg\`, a fixed color palette) keeps spacing and colors consistent across a team by default; and there's **no naming tax** — no BEM debates, no dead classes accumulating.

Where it's honestly worse: long class strings read noisily; genuinely complex CSS (keyframe animations, elaborate selectors, one-off \`clamp()\` math) still belongs in real CSS; and repetition is managed by **extracting components** (a React \`<Button>\` used everywhere), *not* by copy-pasting the same 12 utilities into 40 files — in component frameworks, the component is the reusable unit, so the "repeated classes" problem largely dissolves.

The takeaway: utilities change *where* CSS knowledge is applied, not *whether* you need it. In interviews, being able to argue both sides — colocation and consistency versus readability and separation-of-concerns — beats cheerleading either camp.`,
  intuition:
    "Traditional CSS is cooking from hand-written recipes you keep in a separate binder; Tailwind is a well-organised spice rack with pre-measured jars. You assemble dishes faster and every dish tastes consistent — but the rack is useless to someone who never learned to cook, and some dishes still need a recipe.",
  definitions: [
    { term: "Utility class", meaning: "A tiny single-purpose class mapping to one CSS declaration, e.g. `p-4` → `padding: 1rem`." },
    { term: "Utility-first", meaning: "Composing design from utilities in markup instead of authoring named semantic classes." },
    { term: "Variant prefix", meaning: "A condition scoping a utility: `md:` (breakpoint and up), `hover:`, `focus:`, `dark:`." },
    { term: "Design tokens", meaning: "The constrained scale of spacings/colors/sizes utilities draw from, keeping a codebase consistent." },
  ],
  language: "html",
  syntax: `<!-- utilities compose left to right; variants scope them -->
<button
  class="px-4 py-2 rounded-lg bg-blue-600 text-white
         hover:bg-blue-700 focus:ring-2 disabled:opacity-50"
>
  Save
</button>`,
  example: {
    language: "html",
    code: `<!-- The responsive card grid from the last two lessons, Tailwind-style -->
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
  <div class="rounded-lg p-6 shadow">Card</div>
  <!-- … -->
</div>

<!-- Reads as: mobile-first 1 column; ≥md 2 columns; ≥lg 4 columns.
     Identical CSS to the media-query version you already wrote. -->`,
    explanation:
      "`grid-cols-1` is the unprefixed (mobile) base; `md:` and `lg:` are min-width media queries in disguise. If you can narrate this line back into raw CSS — and after the responsive lesson you can — you understand Tailwind.",
  },
  keyConcepts: ["Utilities map 1:1 to CSS you know", "Mobile-first variant prefixes (md: = that breakpoint and up)", "State variants (hover:, focus:)", "Reuse via components, not repeated class strings", "Know both sides of the trade-off"],
  commonMistakes: [
    "Learning Tailwind *instead of* CSS — then being unable to debug why a layout breaks, because the utility names were memorised without the model behind them.",
    "Reading `md:flex` as 'only on medium screens' — variants apply at that breakpoint *and up* (mobile-first), not at it exclusively.",
    "Copy-pasting the same long class string across many files instead of extracting a component.",
    "Fighting the token scale with arbitrary values (`p-[13px]`) everywhere — at that point the consistency benefit is gone.",
  ],
  tips: [
    "'Tailwind vs regular CSS — what do you prefer?' is a real interview question; the strong answer weighs colocation + consistency against readability + separation, then says 'utilities for product UI, real CSS for complex one-offs'.",
    "Interviewers probe whether you know what's *underneath*: be ready to expand `items-center`, `p-4`, or `md:grid-cols-3` into the exact CSS they compile to.",
  ],
  quiz: [
    {
      id: "web14-q1",
      type: "mcq",
      prompt: "What does the class `md:flex` do?",
      options: [
        "Applies `display: flex` only between the md and lg breakpoints",
        "Applies `display: flex` at the md breakpoint and every width above it",
        "Applies `display: flex` only below the md breakpoint",
        "Makes the element flexible in the middle of the page",
      ],
      answerIndex: 1,
      explanation: "Tailwind variants are mobile-first `min-width` media queries: `md:flex` turns on at md and stays on for all larger widths. The unprefixed class is the mobile base.",
    },
    {
      id: "web14-q2",
      type: "truefalse",
      prompt: "Using Tailwind well means you no longer need to understand flexbox, grid, or the box model.",
      answer: false,
      explanation: "Utilities are 1:1 shorthand for those exact properties — `items-center` IS `align-items: center`. Without the underlying model you can't predict what a class does or debug a broken layout.",
    },
    {
      id: "web14-q3",
      type: "fill",
      prompt: "In Tailwind, repeating the same 12-class string across 40 files is solved by extracting a ____, not by copy-paste.",
      answers: ["component", "components", "react component"],
      placeholder: "a ______",
      explanation: "In component frameworks the component (e.g. a shared `<Button>`) is the reuse unit — the class string lives once, inside it. That's the idiomatic answer to 'isn't Tailwind repetitive?'.",
    },
    {
      id: "web14-q4",
      type: "output",
      prompt: "Which single CSS declaration does the utility `items-center` compile to? (Write it as `property: value`.)",
      language: "html",
      code: `<div class="flex items-center">…</div>`,
      answers: ["align-items: center", "align-items:center"],
      explanation: "`items-center` maps directly to `align-items: center` — cross-axis centering from the flexbox lesson. Every Tailwind utility has exactly this kind of 1:1 mapping.",
    },
  ],
  revision: [
    "Utility-first = composing single-purpose classes in markup; each maps 1:1 to CSS you already know.",
    "Variants scope utilities: `md:` = that breakpoint and up (mobile-first), `hover:`/`focus:` = states.",
    "Wins: colocation, token-driven consistency, no naming tax. Costs: noisy markup; complex CSS still wants real stylesheets.",
    "Manage repetition by extracting components, not copy-pasting class strings. Tailwind is applied CSS knowledge, not a substitute for it.",
  ],
};

export const stylingLayout: Module = {
  id: "web-styling-layout",
  domain: "web",
  title: "Styling & Layout",
  summary:
    "Make it look right everywhere: modern CSS layout, responsive design, and accessibility that interviewers actually check.",
  order: 2,
  lessons: [
    cssSelectorsSpecificity,
    flexbox,
    cssGrid,
    responsiveDesign,
    webAccessibility,
    tailwindUtilityCss,
  ],
};
