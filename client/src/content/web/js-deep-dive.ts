// ── Module 4: JavaScript Deep Dive — the ES6+ toolkit, closures, `this`, the
// event loop, error handling, and browser storage. Continues the foundations
// voice/depth. Synthesised from MDN / javascript.info as references only.
import type { Module, Lesson } from "../types";

// ── Lesson 15 — The ES6+ Toolkit ────────────────────────────────────────────
const es6Toolkit: Lesson = {
  id: "es6-toolkit",
  domain: "web",
  moduleId: "web-js-deep-dive",
  title: "The ES6+ Toolkit",
  objective:
    "Use the modern JavaScript features that fill real codebases — destructuring, spread/rest, optional chaining, modules, and map/filter/reduce fluency.",
  difficulty: "Beginner",
  estMinutes: 10,
  prerequisites: ["js-fundamentals"],
  tags: ["javascript", "es6", "destructuring", "array-methods", "modules"],
  theory: `The fundamentals lesson gave you values, \`const\`/\`let\`, and arrow functions. Modern codebases lean on a further set of ES6+ features so heavily that reading React or Node code without them feels like reading a foreign dialect. This lesson is that dialect.

### Destructuring: unpack, don't dig

**Destructuring** pulls values out of objects and arrays in one step:

\`\`\`js
const user = { name: "Ada", role: "admin" };
const { name, role } = user;            // instead of user.name, user.role
const [first, second] = [10, 20];       // arrays: by position
const { theme = "light" } = settings;   // with a default
\`\`\`

You'll see it constantly in function parameters — \`function Card({ title, body })\` is destructuring the props object right in the signature.

### Spread and rest: three dots, two jobs

The same \`...\` syntax does opposite things depending on position. **Spread** *expands* a collection: \`[...a, ...b]\` merges arrays, \`{ ...user, role: "admin" }\` copies an object with one field changed — the standard immutable-update idiom React state depends on (it's a *shallow* copy: nested objects are still shared). **Rest** *collects*: \`function sum(...nums)\` gathers all arguments into an array; \`const { id, ...rest } = obj\` grabs everything else.

### Template literals, optional chaining, nullish coalescing

Backtick strings interpolate with \`\${expr}\` and span lines. **Optional chaining** \`user?.address?.city\` returns \`undefined\` instead of crashing when a link in the chain is missing — it replaces pyramids of \`user && user.address && …\` guards. **Nullish coalescing** \`??\` supplies a default only for \`null\`/\`undefined\` — unlike \`||\`, which also swallows legitimate values like \`0\` and \`""\`. \`count ?? 10\` keeps a real \`0\`; \`count || 10\` destroys it. That distinction is a favourite interview trap.

### Modules

**\`export\`** shares from a file; **\`import\`** pulls in. Named exports (\`export const helper\`) come in braces — \`import { helper } from "./utils"\` — and a file gets one optional \`default\` export imported without braces. Modules are why modern apps are many small files instead of one giant script.

### map / filter / reduce mastery

The trio you must be fluent in: **\`map\`** transforms every element into a new array (same length), **\`filter\`** keeps elements passing a test (same or shorter), **\`reduce\`** folds everything to a single value — sum, max, an object index. All three return **new** arrays/values without mutating the original, which is exactly the style React and functional codebases demand. Chaining them reads like a sentence: \`orders.filter(o => o.paid).map(o => o.total).reduce((a, b) => a + b, 0)\` — take paid orders, get their totals, sum them.`,
  intuition:
    "ES6+ features are power tools replacing hand tools: destructuring is a multi-bit screwdriver (grab exactly the pieces you need in one motion), spread is a photocopier with an edit tray (copy this object, change one field), and map/filter/reduce is an assembly line — each station transforms, discards, or tallies the items rolling past without anyone touching the original crate.",
  definitions: [
    { term: "Destructuring", meaning: "Unpacking object properties or array positions into variables in one statement." },
    { term: "Spread (...)", meaning: "Expands an array/object into elements or entries — the immutable copy-and-modify idiom." },
    { term: "Rest (...)", meaning: "The same dots collecting 'everything else' into an array or object." },
    { term: "Nullish coalescing (??)", meaning: "Default only when the left side is `null`/`undefined` — keeps `0`, `\"\"`, `false`." },
    { term: "map / filter / reduce", meaning: "Transform each element / keep matching elements / fold to one value — all non-mutating." },
  ],
  language: "js",
  syntax: `const { name, age = 18 } = person;         // object destructure + default
const [head, ...tail] = [1, 2, 3];         // array destructure + rest
const updated = { ...person, age: 30 };    // spread: copy with a change
const city = user?.address?.city ?? "N/A"; // safe access + nullish default

export const double = (n) => n * 2;        // named export
// import { double } from "./math";        // …and its import`,
  example: {
    language: "js",
    code: `const orders = [
  { id: 1, total: 40, paid: true },
  { id: 2, total: 25, paid: false },
  { id: 3, total: 60, paid: true },
];

const revenue = orders
  .filter((o) => o.paid)          // keep paid → [40-order, 60-order]
  .map((o) => o.total)            // transform → [40, 60]
  .reduce((sum, t) => sum + t, 0); // fold      → 100

console.log(revenue);              // 100
console.log(orders.length);        // 3 — original untouched`,
    explanation:
      "Each step returns a new array, so the chain reads like a pipeline and `orders` is never mutated. This filter→map→reduce shape is the single most common data-transformation pattern in interviews and production code alike.",
  },
  keyConcepts: ["Destructuring (incl. in function params)", "Spread copies, rest collects", "?? vs || — the falsy trap", "Named vs default imports", "filter→map→reduce pipelines"],
  commonMistakes: [
    "Using `||` for defaults and silently destroying valid `0`/`\"\"` values — `??` only replaces null/undefined.",
    "Treating spread as a deep copy — `{ ...obj }` is shallow; nested objects are still shared references.",
    "Using `map` when you don't need the returned array (that's `forEach`), or forgetting `map` returns a *new* array entirely.",
    "Forgetting `reduce`'s initial value (`, 0`), which makes the first element the accumulator and breaks on empty arrays.",
  ],
  tips: [
    "'What's the difference between `??` and `||`?' is a standard screen — answer with the `count = 0` example.",
    "Interviewers often ask you to reimplement `map` or `filter` with `reduce` — practise it once; it proves you understand the fold.",
    "In React code reviews, `{ ...state, field: value }` (spread-update) vs direct mutation is one of the first things checked.",
  ],
  quiz: [
    {
      id: "web15-q1",
      type: "output",
      prompt: "What does this log?",
      language: "js",
      code: `const count = 0;\nconsole.log(count || 10);\nconsole.log(count ?? 10);`,
      answers: ["10\n0", "10 0", "10, 0"],
      explanation: "`||` treats `0` as falsy and substitutes 10. `??` only substitutes for `null`/`undefined`, so the legitimate `0` survives. This is exactly why `??` exists.",
    },
    {
      id: "web15-q2",
      type: "mcq",
      prompt: "What does `const { id, ...rest } = { id: 1, a: 2, b: 3 }` put in `rest`?",
      options: ["`{ id: 1 }`", "`{ a: 2, b: 3 }`", "`[2, 3]`", "`{ id: 1, a: 2, b: 3 }`"],
      answerIndex: 1,
      explanation: "Rest in a destructure collects every property *not* explicitly picked — here everything except `id`, as a new object `{ a: 2, b: 3 }`.",
    },
    {
      id: "web15-q3",
      type: "code",
      prompt: "Given `const nums = [1, 2, 3, 4, 5, 6]`, use `filter` and `map` to log an array of the even numbers doubled — expected output: the array `[4, 8, 12]`.",
      starter: "const nums = [1, 2, 3, 4, 5, 6];\n// filter the evens, map to double, console.log the resulting array\n",
      expectedOutput: "[\n  4,\n  8,\n  12\n]",
      explanation: "`nums.filter((n) => n % 2 === 0).map((n) => n * 2)` → `[4, 8, 12]`. Filter first (keep 2, 4, 6), then transform — the pipeline order matters.",
    },
    {
      id: "web15-q4",
      type: "truefalse",
      prompt: "`const copy = { ...original }` creates a deep copy, so mutating `copy.nested.x` leaves `original` untouched.",
      answer: false,
      explanation: "Spread copies one level only. `copy.nested` and `original.nested` are the *same* object, so mutating through either is visible in both. Deep copies need `structuredClone` (covered later in this module).",
    },
  ],
  revision: [
    "Destructuring unpacks objects/arrays — including directly in function parameters.",
    "`...` spreads (expand/copy — shallow!) or rests (collect) depending on position; `{ ...obj, field: v }` is the immutable-update idiom.",
    "`??` defaults only on null/undefined; `||` also swallows `0`, `\"\"`, `false`.",
    "map transforms, filter keeps, reduce folds — all return new values; chain them as pipelines.",
  ],
};

// ── Lesson 16 — Closures & Scope ────────────────────────────────────────────
const closuresScope: Lesson = {
  id: "closures-scope",
  domain: "web",
  moduleId: "web-js-deep-dive",
  title: "Closures & Scope",
  objective:
    "Explain and use closures — functions that remember where they were born — for counters, private state, and memoization, and solve the classic loop-variable trap.",
  difficulty: "Intermediate",
  estMinutes: 9,
  prerequisites: ["es6-toolkit"],
  tags: ["javascript", "closures", "scope", "interview-classics"],
  theory: `Ask ten interviewers for their favourite JavaScript question and "explain closures" appears on most lists. The concept is genuinely simple once framed right — the mystique comes from bad explanations.

### Lexical scope: where, not when

JavaScript resolves variables by **lexical scope**: a function can see variables declared in the scopes *surrounding its definition* — where the code is **written**, not where it's called from. Inner functions see outward: their own variables, then the enclosing function's, then module/global scope. \`let\`/\`const\` are additionally **block-scoped** — they live only inside their nearest \`{ }\`.

### Closures: the backpack

Normally a function's local variables die when it returns. But if an inner function still references them, they survive:

\`\`\`js
function makeCounter() {
  let count = 0;                 // would normally die at return…
  return () => ++count;          // …but this function still needs it
}
const next = makeCounter();
next(); // 1
next(); // 2 — count lives on, invisibly attached to next
\`\`\`

A **closure** is a function bundled with the variables it captured from its birth scope. \`count\` is unreachable from outside — no code can read or reset it except through \`next\` — which makes closures JavaScript's original mechanism for **private state**. Each call to \`makeCounter()\` creates a *fresh* scope, so two counters never share a count.

### What closures buy you

- **Private state** — the counter above; also the "module pattern": a function returns an object of methods that all close over shared hidden variables, exposing an API while the data stays sealed.
- **Memoization** — a function closes over a \`cache\` object, returning stored answers for repeated inputs. The cache persists between calls yet pollutes nothing.
- **Factories** — \`makeAdder(5)\` returns a function that remembers \`5\` forever. Event handlers and React hooks capture values the same way.

### The interview classic: the loop variable

\`\`\`js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));   // logs 3, 3, 3 — not 0, 1, 2
}
\`\`\`

Why: \`var\` creates **one** function-scoped \`i\` shared by all three callbacks. The timeouts run *after* the loop finishes, and all three closures look up the same variable — now \`3\`. The fix is one keyword: \`let i\` gives each iteration its **own** binding, so each closure captures a different \`i\` and it logs 0, 1, 2. The lesson inside the puzzle: closures capture **variables**, not snapshotted values — what matters is which *binding* the function closes over.`,
  intuition:
    "A closure is a function that leaves home carrying a backpack. When `makeCounter` returns, its house (scope) is demolished — but the inner function already packed `count` into its backpack and takes it everywhere. Nobody else can open the backpack; each new `makeCounter()` call sends out a new hiker with a fresh one.",
  definitions: [
    { term: "Lexical scope", meaning: "Variable lookup follows where code is written — inner functions see enclosing scopes." },
    { term: "Closure", meaning: "A function plus the variables it captured from the scope where it was defined." },
    { term: "Block scope", meaning: "`let`/`const` exist only within their nearest `{ }`; `var` ignores blocks and is function-scoped." },
    { term: "Memoization", meaning: "Caching a function's results — typically in a variable the function closes over." },
    { term: "Module pattern", meaning: "Returning an object of methods that share private closed-over state." },
  ],
  language: "js",
  syntax: `function makeCounter() {
  let count = 0;                    // private — only reachable below
  return {
    increment: () => ++count,
    current: () => count,
  };                                // the module pattern in miniature
}
const counter = makeCounter();
counter.increment();                // 1
counter.count;                      // undefined — truly private`,
  example: {
    language: "js",
    code: `// Memoization: a cache that survives calls but leaks nowhere
function memoize(fn) {
  const cache = {};                       // captured by the closure below
  return (n) => {
    if (n in cache) return cache[n];
    console.log("computing", n);
    return (cache[n] = fn(n));
  };
}

const square = memoize((n) => n * n);
console.log(square(4));   // "computing 4" then 16
console.log(square(4));   // 16 — straight from the closure's cache`,
    explanation:
      "`cache` was a local variable of `memoize`, yet it outlives the call because the returned function closed over it. Every memoized function gets its own private cache — closures as invisible, per-instance storage.",
  },
  keyConcepts: ["Scope is decided by where code is written", "Closures keep birth-scope variables alive", "Closures = private state (counter, module pattern)", "var-in-loop logs 3,3,3; let fixes it", "Closures capture bindings, not values"],
  commonMistakes: [
    "Explaining a closure as 'a function inside a function' — the definition is the *captured variables*, not the nesting.",
    "Expecting the var-loop to log 0,1,2 — all callbacks share one `var i`, which is 3 by the time they run.",
    "Assuming closures snapshot values at creation — they hold live references to bindings, seeing later changes.",
    "Accidentally sharing state by creating one closure where you needed a factory call per instance.",
  ],
  tips: [
    "'Explain closures' — give the two-sentence definition, then *immediately* show makeCounter. Concrete beats abstract in interviews.",
    "'What does this log?' with the var/setTimeout loop is the single most common closure question — know the answer (3,3,3) *and* both fixes (`let`, or an IIFE passing `i`).",
    "Follow-up they love: 'how would you make a variable private in JS?' — closures (and the newer `#private` class fields).",
  ],
  quiz: [
    {
      id: "web16-q1",
      type: "output",
      prompt: "The interview classic — what does this log?",
      language: "js",
      code: `for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}`,
      answers: ["3\n3\n3", "3 3 3", "3,3,3", "3, 3, 3"],
      explanation: "`var` makes one shared `i`. The callbacks run after the loop ends, when `i` is 3 — all three closures read the same binding. `let i` would create a fresh binding per iteration and log 0, 1, 2.",
    },
    {
      id: "web16-q2",
      type: "mcq",
      prompt: "Why can no outside code read `count` inside `makeCounter`?",
      options: [
        "JavaScript makes all function variables private by keyword",
        "`count` is deleted after the first call",
        "It exists only in makeCounter's scope; the sole references to it are the returned functions",
        "Because it was declared with `const`",
      ],
      answerIndex: 2,
      explanation: "Lexical scoping means nothing outside `makeCounter` can name `count`; the returned closure is the only surviving doorway to it. That's why closures are JavaScript's private-state mechanism.",
    },
    {
      id: "web16-q3",
      type: "code",
      prompt: "Write `makeCounter()` returning a function that increments and returns a private count. Calling it three times and logging each result should print `1`, `2`, `3` on separate lines.",
      starter: "function makeCounter() {\n  // private count + return an incrementing function\n}\n\nconst next = makeCounter();\nconsole.log(next());\nconsole.log(next());\nconsole.log(next());",
      expectedOutput: "1\n2\n3",
      explanation: "`let count = 0; return () => ++count;` — the returned arrow closes over `count`, which persists between calls and is invisible everywhere else.",
    },
    {
      id: "web16-q4",
      type: "truefalse",
      prompt: "A closure stores a snapshot of a variable's value at the moment the function was created.",
      answer: false,
      explanation: "Closures capture the *binding* (a live reference), not a frozen value — if the variable changes later, the closure sees the new value. That's precisely why the var-loop logs 3,3,3.",
    },
  ],
  revision: [
    "Lexical scope: functions see the variables of the scopes where they were *written*.",
    "A closure = a function + the birth-scope variables it captured; they stay alive as long as the function does.",
    "Uses: private state (counter, module pattern), memoization caches, factories.",
    "var in a loop → one shared binding → 3,3,3; `let` gives each iteration its own. Closures capture bindings, not snapshots.",
  ],
};

// ── Lesson 17 — `this` & Prototypes ─────────────────────────────────────────
const thisPrototypes: Lesson = {
  id: "this-prototypes",
  domain: "web",
  moduleId: "web-js-deep-dive",
  title: "`this` & Prototypes",
  objective:
    "Decide what `this` is in any code by reading the call site, fix it with bind or arrows, and see the prototype chain that class syntax sugars over.",
  difficulty: "Intermediate",
  estMinutes: 10,
  prerequisites: ["closures-scope"],
  tags: ["javascript", "this", "prototypes", "classes", "bind"],
  theory: `Closures are decided by where a function is *written*. \`this\` is the opposite: it's decided by **how a function is called** — the call site. Confusing those two rules is the root of most \`this\` bugs.

### The call-site rules, in priority order

1. **\`new\` binding** — \`new Widget()\` creates a fresh object and \`this\` is that object.
2. **Explicit binding** — \`fn.call(obj)\` / \`fn.apply(obj)\` invoke immediately with \`this = obj\`; \`fn.bind(obj)\` returns a *new function* permanently locked to \`obj\`.
3. **Implicit binding** — \`user.getName()\`: \`this\` is whatever is **left of the dot** at the call.
4. **Default** — a bare \`fn()\` call: \`this\` is \`undefined\` in strict mode (the global object in sloppy mode).

Read the call site, walk this list top-down, and you can answer any \`this\` puzzle.

### The classic bug: losing \`this\`

\`\`\`js
const user = {
  name: "Ada",
  getName() { return this.name; },
};
user.getName();          // "Ada" — dot rule
const fn = user.getName; // reference copied, dot context GONE
fn();                    // undefined — default rule now applies
\`\`\`

Methods don't carry their object with them — \`this\` is re-decided at every call. This is exactly what happens when you pass a method as a callback (\`setTimeout(user.getName, 100)\`). Fixes: \`user.getName.bind(user)\`, or wrap it — \`() => user.getName()\` — so the dot is present at the real call.

### Arrow functions: no \`this\` of their own

Arrows don't get a \`this\` binding at all — they see the \`this\` of the **enclosing scope**, lexically, like any other closed-over variable. That makes them perfect for callbacks *inside* methods (the arrow inherits the method's \`this\`) and wrong as methods themselves (\`getName: () => this.name\` — there's no enclosing function, so \`this\` is not your object). \`bind\`/\`call\` can't change an arrow's \`this\`.

### Prototypes: the chain behind every object

When you read \`obj.toString\` and \`obj\` doesn't have it, JavaScript walks \`obj\`'s **prototype** — a linked fallback object — then the prototype's prototype, until found or the chain ends at \`null\`. This is how every array shares one \`map\` implementation: methods live once on \`Array.prototype\`, and lookups delegate up the chain.

### class is sugar, not a new model

\`class Dog { bark() {} }\` doesn't introduce Java-style classes — it's syntax over the same machinery: \`bark\` is placed on \`Dog.prototype\`, \`new\` wires each instance's prototype link, \`extends\` chains prototypes, and \`this\` in methods still follows the call-site rules above (which is why React-era code was full of \`this.handleClick = this.handleClick.bind(this)\`). Understanding the sugar is precisely what interviewers probe with "how do classes work under the hood?"`,
  intuition:
    "`this` is like the word 'here' — meaningless in a sentence until you know where the speaker is standing (the call site). Copy the sentence to a new speaker and 'here' silently changes meaning. `bind` staples a GPS pin to the sentence; an arrow function never says 'here' itself — it points at wherever its author was standing.",
  definitions: [
    { term: "Call site", meaning: "The place a function is invoked — the only thing (besides bind/arrows) that determines `this`." },
    { term: "Implicit binding", meaning: "`obj.method()` — `this` is the object left of the dot at the call." },
    { term: "bind", meaning: "Returns a new function with `this` permanently fixed; call/apply invoke immediately with a chosen `this`." },
    { term: "Prototype chain", meaning: "The linked fallback objects walked on property lookup until found or `null`." },
    { term: "class (sugar)", meaning: "Syntax over prototypes: methods go on `ClassName.prototype`; `new` links instances to it." },
  ],
  language: "js",
  syntax: `const user = {
  name: "Ada",
  greet() { return "Hi, " + this.name; },     // this = left of the dot
};

const loose = user.greet;                     // context lost
const fixed = user.greet.bind(user);          // context locked

class Dog {
  constructor(name) { this.name = name; }     // new → this = fresh object
  bark() { return this.name + " woofs"; }     // lives on Dog.prototype
}`,
  example: {
    language: "js",
    code: `const timer = {
  seconds: 0,
  startBroken() {
    setInterval(function () {
      this.seconds++;            // ❌ plain fn: called bare by the timer,
    }, 1000);                    //    so 'this' is NOT timer
  },
  startFixed() {
    setInterval(() => {
      this.seconds++;            // ✅ arrow has no own 'this' — it uses
    }, 1000);                    //    startFixed's this: the timer object
  },
};`,
    explanation:
      "The interval invokes the plain function with no dot, so the default rule applies and `this.seconds` misses the object. The arrow never binds its own `this`; it lexically inherits `startFixed`'s, which the dot-call `timer.startFixed()` set to `timer`. This exact before/after is a staple interview snippet.",
  },
  keyConcepts: ["this is decided at the call site", "Rule priority: new > bind/call > dot > default", "Extracting a method loses this", "Arrows inherit this lexically", "Methods live on prototypes; class is sugar"],
  commonMistakes: [
    "Passing `obj.method` as a callback and expecting `this` to tag along — the dot context is gone at the real call.",
    "Using an arrow function as an object method and wondering why `this` isn't the object — arrows never bind their own.",
    "Believing `bind` mutates the function — it returns a *new* bound function; the original is unchanged.",
    "Thinking `class` copies methods onto each instance — there's one shared method on the prototype, found by chain lookup.",
  ],
  tips: [
    "'What will `this` be here?' — always answer by narrating the call site against the four rules in priority order; that structure alone earns points.",
    "'Difference between call, apply, and bind?' is a perennial: call/apply invoke now (args listed vs arrayed), bind returns a locked function for later.",
    "'How does prototypal inheritance differ from classical?' — objects delegate to live objects at lookup time; nothing is copied at instantiation.",
  ],
  quiz: [
    {
      id: "web17-q1",
      type: "output",
      prompt: "What does this log? (Run as a script, where a bare call's `this` is not `user`.)",
      language: "js",
      code: `const user = {\n  name: "Ada",\n  getName() { return this.name; },\n};\nconst fn = user.getName;\nconsole.log(fn());`,
      answers: ["undefined"],
      explanation: "Copying the method severs the dot context. `fn()` is a bare call — default binding — so `this` isn't `user` and `this.name` is `undefined`. `user.getName.bind(user)` would fix it.",
    },
    {
      id: "web17-q2",
      type: "mcq",
      prompt: "Which correctly locks `this` to `user` for a later call?",
      options: [
        "`user.getName.call(user)`",
        "`user.getName.bind(user)`",
        "`user.getName.apply(user)`",
        "`(() => user.getName).bind(user)`",
      ],
      answerIndex: 1,
      explanation: "`bind` returns a new function with `this` fixed, ready to pass around. `call`/`apply` also set `this` but invoke *immediately* — wrong tool for a callback used later.",
    },
    {
      id: "web17-q3",
      type: "truefalse",
      prompt: "An arrow function's `this` can be changed with `.call()` or `.bind()`.",
      answer: false,
      explanation: "Arrows have no own `this` binding to override — they permanently see the enclosing scope's `this`, and call/apply/bind's `this` argument is simply ignored.",
    },
    {
      id: "web17-q4",
      type: "fill",
      prompt: "When a property isn't found on an object, JavaScript looks it up along the ____ chain.",
      answers: ["prototype", "prototype chain", "proto"],
      placeholder: "the ____ chain",
      explanation: "Lookup delegates to the object's prototype, then its prototype, until found or `null` — which is how one `Array.prototype.map` serves every array ever created.",
    },
  ],
  revision: [
    "`this` is set at the call site: new > explicit (call/apply/bind) > dot > default (undefined in strict mode).",
    "Extracted/passed methods lose their object — fix with `bind` or a wrapper arrow.",
    "Arrow functions have no own `this`; they inherit it lexically and bind/call can't change it.",
    "Property lookup walks the prototype chain; `class` is sugar that puts methods on the prototype and wires `new`.",
  ],
};

// ── Lesson 18 — The Event Loop ──────────────────────────────────────────────
const eventLoop: Lesson = {
  id: "event-loop",
  domain: "web",
  moduleId: "web-js-deep-dive",
  title: "The Event Loop",
  objective:
    "Predict the exact order of logs in any sync/setTimeout/promise mix — the call stack, task queue, and microtask queue that run all JavaScript.",
  difficulty: "Intermediate",
  estMinutes: 10,
  prerequisites: ["async-fetch"],
  tags: ["javascript", "event-loop", "microtasks", "promises", "interview-classics"],
  theory: `The async lesson showed *that* \`fetch\` doesn't block. This lesson shows *how* — the machinery interviewers probe with "what does this log?" puzzles. JavaScript runs on **one thread**: one call stack, one thing at a time. Everything concurrent about it is scheduling.

### The three pieces

- **Call stack** — where functions execute. A script runs to completion; nothing can interrupt a running function.
- **Task queue** (macrotasks) — callbacks waiting their turn: \`setTimeout\`/\`setInterval\` callbacks, DOM events, etc. When a timer fires, the browser doesn't run your callback — it *queues* it.
- **Microtask queue** — a second, higher-priority queue: promise \`.then\`/\`.catch\` callbacks and code after \`await\`.

The **event loop** is the coordinator: *when the call stack is empty, drain the entire microtask queue, then run one task, then drain microtasks again* — forever.

### The rule that answers every puzzle

**Sync code first, then all microtasks, then tasks.** Work through the classic:

\`\`\`js
console.log("start");
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("promise"));
console.log("end");
// start, end, promise, timeout
\`\`\`

The two plain logs run on the stack. The timeout callback goes to the task queue, the \`.then\` to the microtask queue. Stack empties → microtasks drain first (\`promise\`) → then one task (\`timeout\`). \`setTimeout(fn, 0)\` never means "now" — it means "as a task, after the current script *and all microtasks*." (The delay is also a minimum, not a guarantee — the callback waits for the stack regardless.)

Note \`Promise.resolve().then(...)\`: creating a promise runs its executor synchronously; only the *reaction* is a microtask. And \`await\` is this same machinery — everything after an \`await\` resumes as a microtask, which is why async/await puzzles reduce to the same rule.

### Why your UI freezes

Rendering is scheduled between tasks on the same thread. A 3-second synchronous loop means no clicks, no paints, no scrolling — the stack never empties, so the loop never turns. That's why heavy sync work is the freeze culprit, and why long jobs get chunked (or moved to a Web Worker). A subtler trap: microtasks that queue more microtasks starve the task queue *and rendering* forever — priority cuts both ways.

### Interview reality

Event-loop output prediction is arguably the most common senior-filter JS question. The winning technique is mechanical, not intuitive: label every line **sync / microtask / task**, then replay the loop's rule. Do that on the quiz below.`,
  intuition:
    "A single barista (the call stack) never abandons a drink mid-pour. Between drinks, they always serve the VIP line (microtasks) until it's empty before taking one order from the regular line (tasks). setTimeout(0) just means 'join the regular line now' — and if VIPs keep arriving, the regular line waits forever.",
  definitions: [
    { term: "Call stack", meaning: "Where functions run, one at a time; a function on the stack cannot be interrupted." },
    { term: "Task (macrotask) queue", meaning: "Queued callbacks — setTimeout, DOM events; one runs per loop turn." },
    { term: "Microtask queue", meaning: "Promise reactions and post-await code; drained *completely* before the next task." },
    { term: "Event loop", meaning: "The scheduler: stack empty → drain microtasks → run one task → repeat." },
    { term: "setTimeout(fn, 0)", meaning: "'Queue fn as a task' — it runs after the current script and all pending microtasks." },
  ],
  language: "js",
  syntax: `console.log("1: sync");                          // stack, now
setTimeout(() => console.log("4: task"), 0);      // task queue
Promise.resolve().then(() => console.log("3: microtask"));
console.log("2: sync");                          // stack, now
// order: 1, 2, 3, 4 — sync → microtasks → tasks`,
  example: {
    language: "js",
    code: `async function main() {
  console.log("A");                 // sync — stack
  await null;                       // pause: the rest becomes a microtask
  console.log("C");                 // microtask
}

console.log("start");               // 1 sync
setTimeout(() => console.log("D")); // task queue
main();                             // logs "A" synchronously (2)
console.log("B");                   // 3 sync
// stack empty → microtasks: "C" → then tasks: "D"
// start, A, B, C, D`,
    explanation:
      "`main()` runs synchronously up to the `await`, then yields — the remainder is queued as a microtask. So the sync logs finish (`start, A, B`), microtasks drain (`C`), and only then does the task run (`D`). Labelling each line sync/microtask/task makes any such puzzle mechanical.",
  },
  visual: {
    kind: "mermaid",
    caption: "One turn of the event loop: microtasks always drain before the next task.",
    src: `flowchart TD
    S["Run script / current task\n(call stack until empty)"] --> M{"Microtask queue\nempty?"}
    M -- no --> R["Run ALL microtasks\n(.then callbacks, post-await code)"]
    R --> M
    M -- yes --> P["Browser may render a frame"]
    P --> T{"Task queue\nempty?"}
    T -- no --> O["Run ONE task\n(setTimeout callback, event handler)"]
    O --> M
    T -- yes --> W["Wait for work"] --> T`,
  },
  keyConcepts: ["One thread, one call stack", "Microtasks (promises/await) beat tasks (setTimeout)", "The loop: stack → drain microtasks → one task", "setTimeout(0) = 'queue me', not 'now'", "Sync work blocks rendering"],
  commonMistakes: [
    "Expecting `setTimeout(fn, 0)` to run before pending promise callbacks — microtasks always drain first.",
    "Thinking `await` blocks the thread — it suspends only that function; the rest resumes as a microtask.",
    "Assuming the executor in `new Promise(fn)` is async — it runs synchronously; only reactions are microtasks.",
    "Blaming the network for a frozen UI when a long *synchronous* loop is monopolising the stack.",
  ],
  tips: [
    "'What's the output?' event-loop puzzles: annotate every line sync / microtask / task, then replay the loop rule. Interviewers reward the narration as much as the answer.",
    "'Difference between microtasks and macrotasks?' — the crisp answer: all pending microtasks run after every task, before rendering and the next task.",
    "Know one sentence on the freeze question: 'rendering shares the thread and runs between tasks, so long sync work blocks paint.'",
  ],
  quiz: [
    {
      id: "web18-q1",
      type: "output",
      prompt: "The canonical puzzle — what's the exact log order?",
      language: "js",
      code: `console.log("start");\nsetTimeout(() => console.log("timeout"), 0);\nPromise.resolve().then(() => console.log("promise"));\nconsole.log("end");`,
      answers: ["start\nend\npromise\ntimeout", "start end promise timeout", "start, end, promise, timeout"],
      explanation: "Sync lines run first (start, end). The stack empties → microtasks drain (promise) → then the task queue gets its turn (timeout). Microtasks always beat setTimeout, even at 0ms.",
    },
    {
      id: "web18-q2",
      type: "output",
      prompt: "Two microtasks vs one task — predict the order.",
      language: "js",
      code: `setTimeout(() => console.log("task"), 0);\nPromise.resolve()\n  .then(() => console.log("micro 1"))\n  .then(() => console.log("micro 2"));\nconsole.log("sync");`,
      answers: ["sync\nmicro 1\nmicro 2\ntask", "sync micro 1 micro 2 task", "sync, micro 1, micro 2, task"],
      explanation: "The microtask queue is drained *completely* before any task — including microtasks queued by other microtasks (`micro 2` is enqueued while `micro 1` runs). Only then does the setTimeout callback run.",
    },
    {
      id: "web18-q3",
      type: "output",
      prompt: "async/await is the same machinery — what's the order?",
      language: "js",
      code: `async function run() {\n  console.log("A");\n  await null;\n  console.log("B");\n}\nrun();\nconsole.log("C");`,
      answers: ["A\nC\nB", "A C B", "A, C, B"],
      explanation: "`run()` executes synchronously until the `await`, logging A. The rest of the function is queued as a microtask, so the script continues (C) before the microtask resumes (B).",
    },
    {
      id: "web18-q4",
      type: "mcq",
      prompt: "Why does a 3-second synchronous loop freeze the page?",
      options: [
        "setTimeout callbacks run in parallel and collide with it",
        "The call stack never empties, so the event loop can't run rendering or any queued callbacks",
        "Promises pause the browser while pending",
        "The browser throttles JavaScript after 1 second",
      ],
      answerIndex: 1,
      explanation: "Everything — clicks, timers, and paints — waits for the stack to empty. A long synchronous computation monopolises the single thread, so the loop never turns and the UI can't update.",
    },
  ],
  revision: [
    "One thread: call stack runs code; tasks (setTimeout, events) and microtasks (promise reactions, post-await) wait in queues.",
    "Loop rule: stack empties → drain ALL microtasks → render opportunity → run ONE task → repeat.",
    "setTimeout(fn, 0) queues a task; pending microtasks always run before it.",
    "await suspends only its function (rest = microtask); long sync work blocks rendering — chunk it or use a Worker.",
  ],
};

// ── Lesson 19 — Error Handling ──────────────────────────────────────────────
const jsErrorHandling: Lesson = {
  id: "js-error-handling",
  domain: "web",
  moduleId: "web-js-deep-dive",
  title: "Error Handling in JavaScript",
  objective:
    "Throw, catch, and design errors deliberately — try/catch/finally, Error types, async failures with await, custom errors, and when to catch vs let it propagate.",
  difficulty: "Intermediate",
  estMinutes: 9,
  prerequisites: ["event-loop"],
  tags: ["javascript", "errors", "try-catch", "async", "robustness"],
  theory: `Production code is mostly the unhappy path: networks drop, JSON is malformed, users type the impossible. The difference between a robust app and a fragile one is rarely the features — it's what happens when something **throws**.

### throw, try, catch, finally

\`throw\` raises an exception, which unwinds the call stack — leaping out of functions — until a \`try/catch\` intercepts it; if none does, the script (or that async chain) dies with an "uncaught" error.

\`\`\`js
try {
  const data = JSON.parse(input);   // throws SyntaxError on bad JSON
} catch (err) {
  console.error("Invalid input:", err.message);
} finally {
  spinner.hide();                    // runs on success AND failure
}
\`\`\`

\`finally\` runs no matter which path was taken — even if \`catch\` re-throws or the block \`return\`s — making it the home for cleanup: hiding spinners, closing connections, releasing locks.

### Throw Errors, and read their types

Always throw \`new Error("message")\` (or a subclass), never a bare string — Error objects carry a **stack trace** and a \`.name\`, which is the difference between debugging in minutes and hours. The built-in types are diagnostic labels you'll meet daily: **TypeError** (using a value wrong — \`undefined is not a function\`), **RangeError** (a number out of range), **SyntaxError** (unparseable code or JSON). For your own domains, **custom errors** subclass Error — \`class ValidationError extends Error\` — so callers can react by *kind* with \`instanceof\` instead of parsing message strings.

### Async errors: same syntax, one giant trap

A rejected promise is an error travelling through the microtask world. With \`await\`, normal \`try/catch\` works — the rejection surfaces as a throw at the \`await\` line. Without \`await\`, you need \`.catch(handler)\` on the chain. The classic trap:

\`\`\`js
try {
  fetchUser();          // ❌ no await — the promise escapes the try
} catch (err) { /* never runs for the fetch failure */ }
\`\`\`

By the time the promise rejects, the \`try\` block has long since exited (the event-loop lesson explains exactly why: the rejection is a later microtask). **A try/catch only covers a promise if you \`await\` it inside the block.** Unhandled rejections log a console warning and, in Node, can kill the process. And remember from the fetch lesson: \`fetch\` doesn't reject on HTTP 404/500 — check \`res.ok\` and \`throw\` yourself.

### Catch late, catch meaningfully

The most common design mistake is catching *everywhere*. Catch an error only where you can **do something about it** — retry, show UI, substitute a fallback. Otherwise let it **propagate** to a boundary that can (a route handler, a React error boundary, a top-level handler). Deep utility code that catches-and-logs, then returns \`undefined\`, doesn't handle errors — it *hides* them, and the crash resurfaces two files away with no stack trace pointing home. Never swallow silently: an empty \`catch {}\` is a bug with extra steps.`,
  intuition:
    "An exception is a fire alarm, and try/catch blocks are the building's floors. The alarm rings upward (up the call stack) until it reaches a floor with a fire warden who can actually act — evacuate, extinguish, call for help. A warden on every floor who silences the alarm and does nothing (empty catch) doesn't make the building safe; it makes the eventual fire untraceable. `finally` is the door that must be locked whether or not there was a fire.",
  definitions: [
    { term: "throw", meaning: "Raise an exception, unwinding the stack until a catch intercepts it." },
    { term: "finally", meaning: "A block that runs after try/catch on every path — success, failure, even early return." },
    { term: "Error types", meaning: "Diagnostic subclasses: TypeError (wrong value use), RangeError, SyntaxError…" },
    { term: "Custom error", meaning: "Your own `class X extends Error`, letting callers branch with `instanceof`." },
    { term: "Unhandled rejection", meaning: "A rejected promise nobody awaits or .catch-es — a warning in browsers, potentially fatal in Node." },
  ],
  language: "js",
  syntax: `class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

async function load() {
  try {
    const res = await fetch("/api/data");        // await INSIDE the try
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (err) {
    if (err instanceof ValidationError) showFieldError(err.field);
    else throw err;                               // can't handle → propagate
  } finally {
    hideSpinner();                                // every path
  }
}`,
  example: {
    language: "js",
    code: `function parseAge(input) {
  const age = Number(input);
  if (Number.isNaN(age)) throw new TypeError("not a number: " + input);
  if (age < 0 || age > 150) throw new RangeError("impossible age: " + age);
  return age;
}

try {
  console.log(parseAge("42"));     // 42
  console.log(parseAge("abc"));    // throws — jumps to catch
  console.log("never reached");
} catch (err) {
  console.log(err.name + ": " + err.message);  // TypeError: not a number: abc
} finally {
  console.log("done");             // runs regardless
}`,
    explanation:
      "The throw abandons the rest of the try block instantly — the third log never runs. The catch reads `err.name` to tell error kinds apart, and `finally` runs whether we succeeded or exploded: the standard anatomy of defensive code.",
  },
  keyConcepts: ["throw unwinds the stack to the nearest catch", "finally = cleanup on every path", "Throw Error objects, branch with instanceof", "try/catch covers a promise only if awaited inside", "Catch where you can act; otherwise propagate"],
  commonMistakes: [
    "Forgetting `await` inside try — the promise escapes and the catch never sees the rejection.",
    "Throwing strings (`throw \"oops\"`) — no stack trace, no `.name`, nothing for instanceof to check.",
    "Empty or log-only `catch {}` blocks that swallow failures, letting the app limp on in a corrupt state.",
    "Assuming `fetch` rejects on a 404 — it resolves; you must check `res.ok` and throw yourself.",
  ],
  tips: [
    "'Will this catch block catch the fetch error?' (with a missing await) is a very common interview snippet — the answer hinges on the event-loop lesson: the rejection is a later microtask.",
    "'When would you create a custom error class?' — when callers need to react differently by kind: instanceof beats string-matching messages.",
    "A senior-sounding one-liner for design questions: 'throw early, catch late' — validate and throw at the source, handle at the boundary that owns the response.",
  ],
  quiz: [
    {
      id: "web19-q1",
      type: "output",
      prompt: "What is the exact log order?",
      language: "js",
      code: `function boom() { throw new Error("bad"); }\ntry {\n  console.log("before");\n  boom();\n  console.log("after");\n} catch (err) {\n  console.log("caught " + err.message);\n} finally {\n  console.log("finally");\n}`,
      answers: ["before\ncaught bad\nfinally", "before caught bad finally", "before, caught bad, finally"],
      explanation: "The throw abandons the try block ('after' never runs), control jumps to catch, and finally runs last on every path — the full lifecycle in four lines.",
    },
    {
      id: "web19-q2",
      type: "mcq",
      prompt: "Why does this catch block MISS the failure?\n```js\ntry {\n  fetchData(); // returns a promise that rejects\n} catch (err) {\n  handle(err);\n}\n```",
      options: [
        "fetch errors can never be caught",
        "The promise rejects as a later microtask, after the try block has already exited — only `await fetchData()` inside the try would connect them",
        "catch only handles TypeErrors",
        "The syntax is invalid",
      ],
      answerIndex: 1,
      explanation: "Without `await`, the try block finishes synchronously; the rejection happens later on the microtask queue with no try/catch on the stack. Awaiting inside the block re-surfaces the rejection as a throw at that line.",
    },
    {
      id: "web19-q3",
      type: "code",
      prompt: "`risky()` below throws. Call it inside try/catch and log `caught: ` followed by the error's message — expected output: `caught: boom`.",
      starter: "function risky() {\n  throw new Error(\"boom\");\n}\n\n// call risky() in a try/catch and log \"caught: \" + the message\n",
      expectedOutput: "caught: boom",
      explanation: "`try { risky(); } catch (err) { console.log(\"caught: \" + err.message); }` — the Error object's `.message` carries the text passed to the constructor.",
    },
    {
      id: "web19-q4",
      type: "truefalse",
      prompt: "Good practice is to wrap every function body in try/catch so errors can never propagate.",
      answer: false,
      explanation: "Catching everywhere hides failures and destroys the stack's story. Catch only where you can meaningfully respond (retry, show UI, fallback); let everything else propagate to a boundary designed to handle it.",
    },
  ],
  revision: [
    "throw unwinds the stack to the nearest catch; uncaught errors kill the script/chain. finally always runs — use it for cleanup.",
    "Throw `new Error(...)` (or subclasses) — never strings; branch on kinds with `instanceof` custom errors.",
    "Async: try/catch works with `await`ed promises only; un-awaited rejections escape as later microtasks. fetch needs a manual `res.ok` check.",
    "Throw early, catch late: handle where you can act, propagate otherwise, and never swallow errors silently.",
  ],
};

// ── Lesson 20 — Browser APIs & Storage ──────────────────────────────────────
const browserApisStorage: Lesson = {
  id: "browser-apis-storage",
  domain: "web",
  moduleId: "web-js-deep-dive",
  title: "Browser APIs & Storage",
  objective:
    "Persist and move data in the browser — localStorage vs sessionStorage vs cookies, JSON's real behaviour, URL/history APIs, timers, and structuredClone.",
  difficulty: "Intermediate",
  estMinutes: 10,
  prerequisites: ["js-error-handling"],
  tags: ["javascript", "localstorage", "cookies", "json", "browser-apis"],
  theory: `Everything so far vanished on refresh. Real apps remember — your theme, your draft, your login. The browser offers several places to put data, and choosing the wrong one is both a common bug *and* a favourite interview probe.

### localStorage and sessionStorage

Both expose the same tiny API — \`setItem(key, value)\`, \`getItem(key)\`, \`removeItem(key)\`, \`clear()\` — and both are **per-origin** (scoped to protocol + domain + port, invisible to other sites). The difference is lifetime: **localStorage** persists until explicitly cleared, surviving restarts; **sessionStorage** dies with the tab.

The catch everyone hits: both store **strings only**. Store an object directly and you get \`"[object Object]"\` back. The idiom is JSON both ways:

\`\`\`js
localStorage.setItem("prefs", JSON.stringify({ theme: "dark" }));
const prefs = JSON.parse(localStorage.getItem("prefs") ?? "{}");
\`\`\`

(That \`?? "{}"\` guards the first visit, when \`getItem\` returns \`null\` — and \`JSON.parse\` *throws* on garbage, so persisted-data reads belong in the try/catch habits from last lesson.)

### JSON's real behaviour

\`JSON.stringify\`/\`parse\` round-trip plain data faithfully, but JSON is a *data* format, not a JavaScript snapshot: **functions and \`undefined\` are dropped** (object properties holding them simply vanish), **Dates become strings** and stay strings after parsing, and circular references throw. The old \`JSON.parse(JSON.stringify(obj))\` deep-copy trick inherits every one of those losses — the modern, correct tool is **\`structuredClone(obj)\`**, which deep-copies Dates, Maps, Sets, and cycles (though still not functions).

### Cookies: the one the server sees

Cookies are small (~4KB) strings **automatically attached to every HTTP request** to their site — that's their defining feature and their cost. Web storage never leaves the browser; cookies exist precisely *because* the server needs them (sessions, auth). Crucially, a cookie marked **\`HttpOnly\`** (set by the server) is invisible to JavaScript entirely.

That powers the classic interview question: **"Where do you store an auth token?"** localStorage is convenient but readable by any script that runs on your page — a single XSS vulnerability exfiltrates every user's token. The defensible answer: session/auth tokens belong in **HttpOnly cookies** (JS can't steal what JS can't read), with localStorage reserved for non-sensitive state like themes and drafts. Say "XSS" in the answer — that's the word being fished for.

### URLs, history, timers

**\`URLSearchParams\`** reads and builds query strings without string-mangling: \`new URLSearchParams(location.search).get("page")\`. The **history API** (\`pushState\`) changes the address bar without reloading — the machinery under every client-side router you'll use. And the timers from the event-loop lesson have one production rule worth stating: every \`setInterval\` you start, you must \`clearInterval\` when its component/page goes away, or callbacks pile up firing into nothing — a classic memory leak in SPAs.`,
  intuition:
    "Browser storage is where you keep things for a trip. localStorage is your home closet — stuff stays until you clear it out. sessionStorage is a hotel-room drawer — emptied when you check out (close the tab). Cookies are the stamps in your passport: tiny, and shown automatically at every border crossing (each HTTP request) — which is why secrets go in the tamper-proof page (HttpOnly) that even you can't peel out.",
  definitions: [
    { term: "localStorage", meaning: "Per-origin, string-only key/value store that persists until cleared." },
    { term: "sessionStorage", meaning: "Same API, but scoped to the tab — cleared when it closes." },
    { term: "Cookie", meaning: "A small string auto-sent to the server with every request; `HttpOnly` hides it from JavaScript." },
    { term: "structuredClone", meaning: "The built-in deep copy — handles Dates, Maps, Sets, cycles; unlike the JSON trick." },
    { term: "URLSearchParams", meaning: "The API for reading/building query strings without manual parsing." },
  ],
  language: "js",
  syntax: `// storage is strings-only → JSON both directions
localStorage.setItem("prefs", JSON.stringify({ theme: "dark", size: 14 }));
const prefs = JSON.parse(localStorage.getItem("prefs") ?? "{}");

const params = new URLSearchParams("?page=2&sort=name");
params.get("page");                    // "2" (always a string)

const id = setInterval(poll, 5000);
clearInterval(id);                     // ALWAYS pair them`,
  example: {
    language: "js",
    code: `// What JSON keeps — and silently drops
const state = {
  theme: "dark",
  visits: 3,
  greet: () => "hi",        // function
  lastSeen: undefined,       // undefined
};

const saved = JSON.stringify(state);
console.log(saved);          // {"theme":"dark","visits":3}
                             // greet and lastSeen just vanished

// Deep copy, done right vs the old trick
const original = { when: new Date(), tags: ["a"] };
const viaJson = JSON.parse(JSON.stringify(original));
const proper = structuredClone(original);
console.log(viaJson.when instanceof Date);   // false — became a string
console.log(proper.when instanceof Date);    // true`,
    explanation:
      "JSON serialises *data*, so functions and `undefined` disappear without error, and Dates degrade to strings on the round trip. `structuredClone` is the real deep copy. Knowing exactly what the JSON trick loses is a surprisingly effective interview differentiator.",
  },
  keyConcepts: ["localStorage persists, sessionStorage is per-tab, both per-origin and string-only", "JSON drops functions/undefined; Dates become strings", "structuredClone for real deep copies", "Cookies ride every request; HttpOnly hides them from JS", "Auth tokens: HttpOnly cookie beats localStorage (XSS)"],
  commonMistakes: [
    "Storing objects without `JSON.stringify` and reading back `\"[object Object]\"`.",
    "Not guarding reads — `getItem` returns `null` on first visit, and `JSON.parse` throws on corrupt data.",
    "Keeping auth tokens in localStorage 'because it's easy' — any XSS on the page can read and exfiltrate them.",
    "Starting `setInterval`s and never clearing them — leaked timers keep firing after the UI they served is gone.",
  ],
  tips: [
    "'Where would you store a JWT/auth token and why?' is a top-tier frontend interview question — answer HttpOnly cookie, and name XSS as the reason localStorage fails.",
    "'localStorage vs sessionStorage vs cookies?' — structure it as lifetime (forever / tab / expiry) + who sees it (JS only / JS only / every request + server).",
    "'How do you deep-copy an object?' — say structuredClone first, then show you know why the JSON trick is lossy (Dates, undefined, functions, cycles).",
  ],
  quiz: [
    {
      id: "web20-q1",
      type: "output",
      prompt: "What does this log?",
      language: "js",
      code: `const user = { name: "Ada", greet: () => "hi", age: undefined };\nconsole.log(JSON.stringify(user));`,
      answers: ['{"name":"Ada"}'],
      explanation: "JSON is a data format: function-valued and undefined-valued properties are silently omitted from the output. Only `name` survives — no error, no warning.",
    },
    {
      id: "web20-q2",
      type: "mcq",
      prompt: "Why is an HttpOnly cookie safer than localStorage for an auth token?",
      options: [
        "Cookies are encrypted automatically",
        "JavaScript cannot read HttpOnly cookies, so an XSS attack can't exfiltrate the token",
        "localStorage is shared between all websites",
        "Cookies can store more data",
      ],
      answerIndex: 1,
      explanation: "Any script that runs on your page — including injected XSS — can read localStorage. An HttpOnly cookie is invisible to JavaScript yet still rides along on requests, so the server gets it and attackers don't.",
    },
    {
      id: "web20-q3",
      type: "truefalse",
      prompt: "Data in sessionStorage survives closing the tab and reopening the site tomorrow.",
      answer: false,
      explanation: "sessionStorage is scoped to the tab's session — closing the tab clears it. That persistence is exactly what localStorage is for.",
    },
    {
      id: "web20-q4",
      type: "fill",
      prompt: "The modern built-in for a true deep copy (handling Dates, Maps, and cycles) is ____.",
      answers: ["structuredClone", "structuredclone", "structuredClone()"],
      placeholder: "function name",
      explanation: "`structuredClone(obj)` deep-copies where `JSON.parse(JSON.stringify(obj))` is lossy — it preserves Dates as Dates, handles Maps/Sets, and doesn't throw on circular references (functions still aren't cloneable).",
    },
  ],
  revision: [
    "localStorage persists until cleared; sessionStorage dies with the tab; both are per-origin, string-only → JSON.stringify/parse (guard `null` and bad JSON).",
    "JSON drops functions and undefined, turns Dates into strings; structuredClone is the real deep copy.",
    "Cookies auto-attach to every request; HttpOnly makes them unreadable to JS — which is why auth tokens go there, not localStorage (XSS).",
    "URLSearchParams for query strings; history.pushState powers client-side routing; always clearInterval what you setInterval.",
  ],
};

export const jsDeepDive: Module = {
  id: "web-js-deep-dive",
  domain: "web",
  title: "JavaScript Deep Dive",
  summary:
    "The JavaScript that interviews are made of: closures, this, the event loop, and the ES6+ toolkit.",
  order: 3,
  lessons: [
    es6Toolkit,
    closuresScope,
    thisPrototypes,
    eventLoop,
    jsErrorHandling,
    browserApisStorage,
  ],
};
