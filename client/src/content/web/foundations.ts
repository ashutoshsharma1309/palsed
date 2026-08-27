import type { Module, Lesson } from "../types";

// ── Lesson 1 — How the Web Works ────────────────────────────────────────────
const howTheWebWorks: Lesson = {
  id: "how-the-web-works",
  domain: "web",
  moduleId: "web-foundations",
  title: "How the Web Works",
  objective:
    "Trace exactly what happens between typing a URL and seeing a page — client, server, DNS, and HTTP.",
  difficulty: "Beginner",
  estMinutes: 7,
  tags: ["http", "dns", "client-server", "mental-model"],
  theory: `Every website you use is a conversation between two programs: a **client** (your browser) and a **server** (a computer somewhere that holds the site). The client *asks* for something; the server *responds*. That's it — the whole web is built on this request/response loop.

### What happens when you open a page

1. **You type a URL** like \`https://prepnext.app/dashboard\`.
2. **DNS lookup.** The browser needs the server's numeric address (an *IP address*). It asks the **Domain Name System** — the phone book of the internet — to translate \`prepnext.app\` into something like \`76.76.21.21\`.
3. **A connection opens** to that IP over TCP (and, for \`https\`, a TLS handshake encrypts it).
4. **The browser sends an HTTP request**: "GET me the /dashboard page."
5. **The server responds** with an HTTP response: a status code, some headers, and a body (usually HTML).
6. **The browser renders** the HTML, then fetches whatever that HTML references — CSS, JavaScript, images — each one its *own* request/response.

The key mental model: a web page is not one download. It is **many** small requests, orchestrated by the browser, most of them happening in parallel.

### Why this matters

Almost every web performance and debugging skill traces back to this loop. Slow page? Too many requests, or a slow server response. Broken image? A request that 404'd. "It works on my machine"? The client and server disagreeing about something. Once you can *see* the request/response loop, the browser's Network tab stops being scary and starts being a superpower.`,
  intuition:
    "Ordering at a restaurant: you (client) give an order to the waiter (request), the kitchen (server) makes it, and the waiter brings it back (response). You never enter the kitchen — you only exchange messages.",
  definitions: [
    { term: "Client", meaning: "The program that initiates requests — almost always the web browser." },
    { term: "Server", meaning: "The program that listens for requests and returns responses." },
    { term: "DNS", meaning: "Domain Name System — translates a human domain name into a numeric IP address." },
    { term: "HTTP", meaning: "HyperText Transfer Protocol — the rules for how requests and responses are formatted." },
    { term: "IP address", meaning: "The numeric address that identifies a machine on a network." },
  ],
  language: "bash",
  syntax: `# A raw HTTP request the browser sends (simplified)
GET /dashboard HTTP/1.1
Host: prepnext.app
Accept: text/html`,
  example: {
    language: "bash",
    code: `# You can play the browser's role from a terminal:
curl -i https://prepnext.app/

# -i shows the response *headers* too, e.g.:
#   HTTP/2 200
#   content-type: text/html; charset=utf-8`,
    explanation:
      "`curl` sends one HTTP request and prints the raw response. `200` means success; `content-type` tells the browser the body is HTML so it knows to render it.",
  },
  visual: { kind: "anim", name: "httpRequest", caption: "One request → one response, then the page fetches its assets." },
  keyConcepts: ["Request/response loop", "Client vs server", "DNS resolution", "A page is many requests"],
  commonMistakes: [
    "Thinking a page is a single download — it's dozens of separate requests.",
    "Confusing DNS (name → IP) with the HTTP request that follows it.",
    "Assuming the server runs your JavaScript — by default JS runs on the client.",
  ],
  tips: [
    "In interviews, being able to narrate 'URL → DNS → TCP/TLS → HTTP → render' cleanly signals real fundamentals.",
    "Open DevTools → Network and reload any site: every row is one request/response.",
  ],
  quiz: [
    {
      id: "web1-q1",
      type: "mcq",
      prompt: "What does a DNS lookup do?",
      options: [
        "Encrypts the connection to the server",
        "Translates a domain name into an IP address",
        "Downloads the HTML of the page",
        "Runs the page's JavaScript",
      ],
      answerIndex: 1,
      explanation: "DNS is the internet's phone book: it maps `prepnext.app` to a numeric IP so the browser knows which machine to connect to.",
    },
    {
      id: "web1-q2",
      type: "truefalse",
      prompt: "Loading a typical web page involves exactly one HTTP request.",
      answer: false,
      explanation: "The initial HTML is one request, but it references CSS, JS, images, and fonts — each is its own request. A real page is often dozens.",
    },
    {
      id: "web1-q3",
      type: "fill",
      prompt: "An HTTP response that succeeded returns the status code ____.",
      answers: ["200", "200 OK", "ok"],
      placeholder: "e.g. 404",
      explanation: "`200` (OK) is the standard success status. `404` means not found, `500` a server error.",
    },
  ],
  revision: [
    "The web is a request/response loop between a client (browser) and a server.",
    "DNS turns a domain name into an IP address before any HTTP happens.",
    "One page = many requests (HTML, then CSS/JS/images), mostly in parallel.",
    "Status `200` = success; the `content-type` header tells the browser how to interpret the body.",
  ],
};

// ── Lesson 2 — HTTP: Methods, Status Codes & Headers ────────────────────────
const httpBasics: Lesson = {
  id: "http-basics",
  domain: "web",
  moduleId: "web-foundations",
  title: "HTTP: Methods, Status Codes & Headers",
  objective:
    "Read and reason about any HTTP exchange: what the method means, what the status code tells you, and why headers matter.",
  difficulty: "Beginner",
  estMinutes: 8,
  prerequisites: ["how-the-web-works"],
  tags: ["http", "rest", "status-codes", "headers"],
  theory: `HTTP is just **structured text messages**. Once you know the three parts — method, status, and headers — you can read any request or response.

### Methods: the verb

The **method** says what you want to *do* with a resource:

- **GET** — read something (never changes server state).
- **POST** — create something new.
- **PUT / PATCH** — update something that exists (PUT replaces, PATCH edits part).
- **DELETE** — remove something.

GET and POST cover most of what you'll write early on. The important rule: **GET should be safe** — fetching a page must never delete or change data.

### Status codes: the result

The server answers with a three-digit **status code**, grouped by first digit:

- **2xx — success.** \`200 OK\`, \`201 Created\`.
- **3xx — redirect.** "It's over here now."
- **4xx — you (the client) made a mistake.** \`400\` bad request, \`401\` not logged in, \`403\` forbidden, \`404\` not found.
- **5xx — the server broke.** \`500\` internal error.

Memorising the *families* matters more than every code: a 4xx is your bug, a 5xx is theirs.

### Headers: the metadata

**Headers** are key/value pairs that travel with the message but aren't the body. They answer questions like: *What format is this?* (\`Content-Type\`), *Who are you?* (\`Authorization\`), *Can I cache this?* (\`Cache-Control\`). Headers are how authentication, caching, and content negotiation all work.`,
  intuition:
    "Think of an HTTP message as an envelope: the method is what you're asking for, the status is the reply stamp, headers are notes on the envelope, and the body is the letter inside.",
  definitions: [
    { term: "Method", meaning: "The verb of a request (GET, POST, PUT, PATCH, DELETE) describing the intended action." },
    { term: "Status code", meaning: "A three-digit result code; its first digit signals the family (2xx ok, 4xx client error, 5xx server error)." },
    { term: "Header", meaning: "A key/value pair carrying metadata about the request or response." },
    { term: "Idempotent", meaning: "An operation that has the same effect whether run once or many times (GET, PUT, DELETE are; POST is not)." },
  ],
  language: "bash",
  syntax: `# Request line + headers + optional body
POST /api/login HTTP/1.1
Host: prepnext.app
Content-Type: application/json

{"email":"a@b.com","password":"..."}`,
  example: {
    language: "js",
    code: `// The browser's fetch() sends an HTTP request for you:
const res = await fetch("/api/profile", {
  method: "GET",
  headers: { Authorization: "Bearer " + token },
});

if (res.status === 401) {
  // Not logged in — redirect to login
} else if (res.ok) {           // res.ok is true for any 2xx
  const profile = await res.json();
}`,
    explanation:
      "`fetch` builds the HTTP request. We attach an `Authorization` header to prove who we are, then branch on the status: `401` means unauthenticated, `res.ok` covers the whole 2xx success family.",
  },
  visual: {
    kind: "mermaid",
    caption: "The lifecycle of a single authenticated request.",
    src: `sequenceDiagram
    participant B as Browser
    participant S as Server
    B->>S: GET /api/profile (Authorization: Bearer …)
    alt token valid
        S-->>B: 200 OK + JSON
    else missing/expired
        S-->>B: 401 Unauthorized
    end`,
  },
  keyConcepts: ["GET is safe", "Status families (2/3/4/5xx)", "Headers carry metadata", "Idempotency"],
  commonMistakes: [
    "Using GET for actions that change data — GET must be safe and cacheable.",
    "Treating every non-200 as a crash — a 401 or 404 is a normal, expected response.",
    "Putting secrets in the URL (query string) instead of a header or body.",
  ],
  tips: [
    "'What's the difference between 401 and 403?' is a classic screen: 401 = not authenticated, 403 = authenticated but not allowed.",
    "PUT vs PATCH: PUT replaces the whole resource, PATCH updates part of it.",
  ],
  quiz: [
    {
      id: "web2-q1",
      type: "mcq",
      prompt: "A user requests a page but isn't logged in. Which status best fits?",
      options: ["200 OK", "301 Moved Permanently", "401 Unauthorized", "500 Internal Server Error"],
      answerIndex: 2,
      explanation: "`401 Unauthorized` means the request lacks valid authentication. `403` would mean logged in but not permitted.",
    },
    {
      id: "web2-q2",
      type: "truefalse",
      prompt: "It is fine to use a GET request to delete a record.",
      answer: false,
      explanation: "GET must be *safe* — it should never change server state. Deleting uses DELETE (or POST). Search engines and prefetchers issue GETs freely.",
    },
    {
      id: "web2-q3",
      type: "output",
      prompt: "What does this print?",
      language: "js",
      code: `const res = { status: 404, ok: false };\nconsole.log(res.ok ? "loaded" : "not found");`,
      answers: ["not found"],
      explanation: "`res.ok` is `false` for a 404, so the ternary takes the else branch and logs `not found`.",
    },
    {
      id: "web2-q4",
      type: "code",
      prompt: "Write JS that logs the status *family* label for `code = 404` — print `client error`. (2xx→`success`, 4xx→`client error`, 5xx→`server error`.)",
      starter: `const code = 404;\n// log the family label\n`,
      expectedOutput: "client error",
      explanation: "`Math.floor(code / 100)` gives the family digit: 2→success, 4→client error, 5→server error. A lookup or if-chain on that digit works.",
    },
  ],
  revision: [
    "Method = the verb (GET read, POST create, PUT/PATCH update, DELETE remove). GET must be safe.",
    "Status families: 2xx success, 3xx redirect, 4xx your fault, 5xx server's fault.",
    "Headers carry metadata: Content-Type, Authorization, Cache-Control.",
    "401 = not authenticated; 403 = authenticated but forbidden.",
  ],
};

// ── Lesson 3 — HTML: Structure & Semantics ──────────────────────────────────
const htmlSemantics: Lesson = {
  id: "html-semantics",
  domain: "web",
  moduleId: "web-foundations",
  title: "HTML: Structure & Semantics",
  objective:
    "Write HTML that describes meaning, not just appearance — the foundation of accessible, well-structured pages.",
  difficulty: "Beginner",
  estMinutes: 7,
  prerequisites: ["how-the-web-works"],
  tags: ["html", "semantics", "accessibility"],
  theory: `HTML is the **skeleton** of every web page. Its job isn't to make things pretty (that's CSS) — it's to describe *what each piece of content means*. This is called **semantic HTML**, and it's one of the highest-leverage habits a web developer can build.

### Elements describe meaning

A page is a tree of **elements**, each written as a tag:

- \`<h1>\`–\`<h6>\` — headings, in order of importance.
- \`<p>\` — a paragraph.
- \`<a href>\` — a link to another page.
- \`<button>\` — something you click to *do* an action.
- \`<img alt>\` — an image, with alt text describing it.

### Semantic vs "div soup"

You *could* build an entire page out of \`<div>\` and \`<span>\`. It would look fine — and be quietly broken. Screen readers, search engines, and keyboard users all rely on the *meaning* of elements. A \`<button>\` is focusable and clickable with the keyboard for free; a \`<div onclick>\` is not.

**Rule of thumb:** reach for the element that *means* what you want. Navigation goes in \`<nav>\`, the main content in \`<main>\`, a self-contained article in \`<article>\`. Use \`<div>\` only when no semantic element fits.

### Why it pays off

Semantic markup gives you accessibility, SEO, and maintainability essentially for free — three things teams otherwise spend real effort retrofitting.`,
  intuition:
    "Semantic HTML is like labelling boxes when you move house. The boxes still hold the same stuff, but now anyone — including a blind helper (a screen reader) — knows what's inside without opening them.",
  definitions: [
    { term: "Element", meaning: "A building block of a page, written with tags, e.g. `<p>…</p>`." },
    { term: "Semantic HTML", meaning: "Using elements that describe the meaning of content rather than its appearance." },
    { term: "Attribute", meaning: "Extra info on an element, written as `name=\"value\"` (e.g. `href`, `alt`)." },
    { term: "Accessibility (a11y)", meaning: "Designing so people using assistive tech (like screen readers) can use your site." },
  ],
  language: "html",
  syntax: `<article>
  <h1>Page title</h1>
  <p>A paragraph with a <a href="/next">link</a>.</p>
  <button type="button">Do something</button>
</article>`,
  example: {
    language: "html",
    code: `<!-- ❌ Non-semantic: works visually, broken for a11y/SEO -->
<div class="title">Recipes</div>
<div class="link" onclick="go()">Open</div>

<!-- ✅ Semantic: meaning is built in -->
<h1>Recipes</h1>
<a href="/recipes">Open</a>`,
    explanation:
      "The semantic version gives you a real heading (screen readers can jump to it) and a real link (keyboard-focusable, right-click to open in a new tab) — with less code.",
  },
  visual: {
    kind: "mermaid",
    caption: "An HTML document is a tree of elements (the DOM).",
    src: `graph TD
    html --> head
    html --> body
    body --> header
    body --> main
    main --> article
    article --> h1
    article --> p
    body --> footer`,
  },
  keyConcepts: ["Elements & attributes", "Semantic vs non-semantic", "The document tree (DOM)", "Accessibility by default"],
  commonMistakes: [
    "Using `<div>`/`<span>` for everything ('div soup') instead of meaningful elements.",
    "Skipping heading levels (jumping `<h1>` straight to `<h4>`).",
    "Making a clickable `<div>` instead of a `<button>` or `<a>` — losing keyboard access.",
    "Forgetting `alt` text on images.",
  ],
  tips: [
    "'Why is semantic HTML important?' → accessibility, SEO, and maintainability, essentially for free.",
    "One `<h1>` per page is the safe convention; use `<h2>`–`<h6>` to nest sections.",
  ],
  quiz: [
    {
      id: "web3-q1",
      type: "mcq",
      prompt: "Which element should wrap a site's primary navigation links?",
      options: ["`<div>`", "`<nav>`", "`<section>`", "`<span>`"],
      answerIndex: 1,
      explanation: "`<nav>` semantically marks a navigation region, which assistive tech can announce and let users skip to.",
    },
    {
      id: "web3-q2",
      type: "truefalse",
      prompt: "A clickable `<div onclick>` is keyboard-accessible by default, just like a `<button>`.",
      answer: false,
      explanation: "A plain `<div>` isn't focusable or activatable by keyboard. A `<button>` gives you focus, Enter/Space activation, and screen-reader semantics for free.",
    },
    {
      id: "web3-q3",
      type: "fill",
      prompt: "The attribute that provides a text description of an image is ____.",
      answers: ["alt", "alt attribute", "alt text"],
      placeholder: "attribute name",
      explanation: "`alt` text describes an image for screen-reader users and shows if the image fails to load.",
    },
  ],
  revision: [
    "HTML describes *meaning*; CSS handles appearance.",
    "Prefer semantic elements (`<nav>`, `<main>`, `<article>`, `<button>`) over generic `<div>`s.",
    "Semantic markup buys accessibility + SEO + maintainability for free.",
    "A page is a tree of elements — the DOM.",
  ],
};

// ── Lesson 4 — JavaScript Fundamentals ──────────────────────────────────────
const jsFundamentals: Lesson = {
  id: "js-fundamentals",
  domain: "web",
  moduleId: "web-foundations",
  title: "JavaScript Fundamentals",
  objective:
    "Understand the core JavaScript building blocks — values, variables, functions — and the type behaviour that trips everyone up.",
  difficulty: "Beginner",
  estMinutes: 9,
  prerequisites: ["html-semantics"],
  tags: ["javascript", "variables", "functions", "types"],
  theory: `JavaScript is the language that makes pages *do* things — respond to clicks, fetch data, update the screen. Almost everything in modern web (React, Node) is JavaScript, so these fundamentals pay off everywhere.

### Values and types

Every value has a **type**. The ones you'll use constantly:

- **string** — text: \`"hello"\`
- **number** — \`42\`, \`3.14\` (no separate int/float)
- **boolean** — \`true\` / \`false\`
- **null** / **undefined** — "no value" (intentional vs not-yet-set)
- **object** / **array** — structured data: \`{ name: "Ada" }\`, \`[1, 2, 3]\`

### Variables: prefer const

Declare values with **\`const\`** (can't be reassigned) or **\`let\`** (can). **Default to \`const\`** and only switch to \`let\` when you truly need to reassign. Avoid the old \`var\` — its scoping rules cause bugs.

### Functions

A **function** packages reusable logic. The modern short form is the **arrow function**:

\`\`\`js
const double = (n) => n * 2;
\`\`\`

### The gotcha: == vs ===

JavaScript has two equality operators. **\`==\`** converts types before comparing (so \`0 == ""\` is \`true\` — surprising and bug-prone). **\`===\`** compares without converting. **Always use \`===\`.** This single habit prevents a whole category of bugs.`,
  intuition:
    "Think of `const`/`let` as labelled jars. `const` jars are sealed once filled; `let` jars you can empty and refill. Reaching for `let` only when you'll actually refill keeps your code easy to reason about.",
  definitions: [
    { term: "Type", meaning: "The kind of a value: string, number, boolean, null, undefined, object, or array." },
    { term: "const / let", meaning: "Ways to declare variables; `const` can't be reassigned, `let` can." },
    { term: "Function", meaning: "A reusable block of logic that takes inputs and returns an output." },
    { term: "Strict equality (===)", meaning: "Compares value and type without conversion — the safe equality operator." },
  ],
  language: "js",
  syntax: `const name = "Ada";          // string, sealed
let count = 0;               // number, reassignable
count = count + 1;

const greet = (who) => \`Hi, \${who}!\`;  // arrow function`,
  example: {
    language: "js",
    code: `const prices = [10, 25, 5];

// sum with a function
const total = prices.reduce((acc, p) => acc + p, 0);
console.log(total);          // 40

// the equality gotcha
console.log(0 == "");        // true  (== converts types 😬)
console.log(0 === "");       // false (=== is safe ✅)`,
    explanation:
      "`reduce` folds the array into one value. The last two lines show why `===` matters: `==` type-converts and gives a surprising `true`, while `===` correctly reports the values are different.",
  },
  keyConcepts: ["Values & types", "const by default", "Arrow functions", "Always use ==="],
  commonMistakes: [
    "Using `==` instead of `===` and hitting surprising type coercion.",
    "Reaching for `let`/`var` when `const` would do — reassignable state is harder to track.",
    "Confusing `null` (intentional empty) with `undefined` (never set).",
    "Forgetting arrays and objects are compared by reference, not value.",
  ],
  tips: [
    "'Difference between == and ===?' is one of the most common JS screening questions — know it cold.",
    "`const` doesn't make objects immutable — you can still mutate their contents; it only blocks reassigning the variable.",
  ],
  quiz: [
    {
      id: "web4-q1",
      type: "output",
      prompt: "What does this log?",
      language: "js",
      code: `const nums = [1, 2, 3];\nconsole.log(nums.map((n) => n * n));`,
      answers: ["[1, 4, 9]", "[1,4,9]", "1,4,9"],
      explanation: "`map` returns a new array applying the function to each element: 1²=1, 2²=4, 3²=9.",
    },
    {
      id: "web4-q2",
      type: "mcq",
      prompt: "Which comparison is safest and recommended?",
      options: ["`0 == \"\"`", "`0 === \"\"`", "It doesn't matter", "Use `=` for comparison"],
      answerIndex: 1,
      explanation: "`===` compares without type conversion. `==` coerces types and produces surprising results; `=` is assignment, not comparison.",
    },
    {
      id: "web4-q3",
      type: "code",
      prompt: "Write JS that logs the sum of `[4, 8, 15, 16, 23, 42]`. (Expected: `108`.)",
      starter: `const nums = [4, 8, 15, 16, 23, 42];\n// log the sum\n`,
      expectedOutput: "108",
      explanation: "`nums.reduce((a, b) => a + b, 0)` folds the array to its sum, 108. A `for` loop accumulating into a variable works too.",
    },
    {
      id: "web4-q4",
      type: "truefalse",
      prompt: "`const obj = {}; obj.x = 1;` throws an error because `obj` is const.",
      answer: false,
      explanation: "`const` blocks *reassigning* the variable, not mutating the object it points to. Adding `obj.x` is fine; `obj = {}` again would throw.",
    },
  ],
  revision: [
    "Core types: string, number, boolean, null, undefined, object, array.",
    "Declare with `const` by default; use `let` only when you must reassign; avoid `var`.",
    "Arrow functions `(x) => …` are the modern short form.",
    "Always use `===` — `==` coerces types and causes bugs. `const` seals the binding, not the object.",
  ],
};

export const foundations: Module = {
  id: "web-foundations",
  domain: "web",
  title: "Web Foundations",
  summary: "The mental model everything builds on: how the web works, HTTP, HTML structure, and JavaScript.",
  order: 0,
  lessons: [howTheWebWorks, httpBasics, htmlSemantics, jsFundamentals],
};
