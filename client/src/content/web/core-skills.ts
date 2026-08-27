// ── Module 2: Core Skills — CSS, the DOM, async JS, and a first React component.
// Continues web-foundations' voice/depth. Content synthesised from MDN / React
// docs as references only (no copied text).
import type { Module, Lesson } from "../types";

// ── Lesson 5 — CSS: The Box Model ───────────────────────────────────────────
const cssBoxModel: Lesson = {
  id: "css-box-model",
  domain: "web",
  moduleId: "web-core-skills",
  title: "CSS: The Box Model",
  objective:
    "See every element as a box with content, padding, border, and margin — the single idea behind almost all CSS layout bugs and fixes.",
  difficulty: "Beginner",
  estMinutes: 8,
  prerequisites: ["html-semantics"],
  tags: ["css", "box-model", "layout"],
  theory: `CSS controls *appearance*: color, spacing, layout. Almost every layout question — "why is there a gap here", "why did that overflow" — traces back to one idea: **every element is a rectangular box.**

### The four layers

From the inside out, each box has:

1. **Content** — the actual text/image, sized by \`width\`/\`height\`.
2. **Padding** — space *inside* the border, between content and border.
3. **Border** — a visible (or invisible) edge around the padding.
4. **Margin** — space *outside* the border, pushing other elements away.

\`width: 200px\` only sets the **content** box by default — padding and border are added *on top*, so a box with \`width: 200px; padding: 20px; border: 2px\` actually renders **244px** wide. This surprises almost everyone once.

### box-sizing: border-box

Setting \`box-sizing: border-box\` changes the rule so \`width\` includes padding and border — the box you set is the box you get. Most modern CSS resets apply this globally, and it removes an entire category of "why is this wider than I set it" bugs.

### Selecting elements

CSS rules pick elements with **selectors**: \`.class\`, \`#id\`, \`element\`, and combinations. A rule is \`selector { property: value; }\`.`,
  intuition:
    "Picture a framed photo on a wall: the photo is the content, the mat around it is padding, the frame is the border, and the empty wall-space you leave around the frame is the margin.",
  definitions: [
    { term: "Box model", meaning: "The layout model where every element is a box of content + padding + border + margin." },
    { term: "Padding", meaning: "Space inside the border, between content and border." },
    { term: "Margin", meaning: "Space outside the border, between this box and its neighbours." },
    { term: "box-sizing: border-box", meaning: "A setting that makes `width`/`height` include padding and border." },
  ],
  language: "css",
  syntax: `.card {
  width: 200px;
  padding: 20px;
  border: 2px solid #ccc;
  margin: 16px;
  box-sizing: border-box; /* width now INCLUDES padding + border */
}`,
  example: {
    language: "css",
    code: `/* Without border-box: rendered width = 200 + 40 + 4 = 244px */
.a { width: 200px; padding: 20px; border: 2px solid; }

/* With border-box: rendered width = exactly 200px */
.b { width: 200px; padding: 20px; border: 2px solid; box-sizing: border-box; }`,
    explanation:
      "Same declared width, different rendered size — because `box-sizing` changes whether padding/border are added on top of `width` or carved out of it.",
  },
  visual: {
    kind: "mermaid",
    caption: "The box model, outside in.",
    src: `graph TD
    Margin["Margin (outside)"] --> Border["Border"]
    Border --> Padding["Padding"]
    Padding --> Content["Content (width × height)"]`,
  },
  keyConcepts: ["Content/padding/border/margin", "width excludes padding by default", "box-sizing: border-box"],
  commonMistakes: [
    "Setting `width` and being surprised the box is wider than expected (padding/border added on top).",
    "Not applying `box-sizing: border-box` globally, so sizes are inconsistent across the codebase.",
    "Confusing margin (outside, can collapse between elements) with padding (inside, never collapses).",
  ],
  tips: [
    "'Explain the CSS box model' is one of the most common frontend screening questions.",
    "Almost every production CSS reset starts with `* { box-sizing: border-box; }`.",
  ],
  quiz: [
    {
      id: "web5-q1",
      type: "output",
      prompt: "With default `box-sizing`, what is the rendered width of `width: 100px; padding: 10px; border: 5px solid;`?",
      language: "css",
      code: `.box { width: 100px; padding: 10px; border: 5px solid; }`,
      answers: ["130px", "130"],
      explanation: "Padding (10px × 2 sides) + border (5px × 2 sides) are added on top of the 100px content width: 100 + 20 + 10 = 130px.",
    },
    {
      id: "web5-q2",
      type: "mcq",
      prompt: "What does `box-sizing: border-box` change?",
      options: [
        "Margins collapse between siblings",
        "`width`/`height` include padding and border instead of excluding them",
        "The element becomes a flex container",
        "Borders are removed",
      ],
      answerIndex: 1,
      explanation: "`border-box` makes the declared width/height the *total* rendered size, folding padding and border in rather than adding them on top.",
    },
    {
      id: "web5-q3",
      type: "truefalse",
      prompt: "Padding sits outside the border, and margin sits inside it.",
      answer: false,
      explanation: "It's the reverse: padding is inside the border (between border and content), margin is outside the border (between this box and its neighbours).",
    },
  ],
  revision: [
    "Every element is a box: content → padding → border → margin (inside out).",
    "By default, `width` sets only the content box — padding/border add on top.",
    "`box-sizing: border-box` makes `width` the full rendered size — almost always what you want.",
    "Margin is outside the border and can collapse between siblings; padding never collapses.",
  ],
};

// ── Lesson 6 — The DOM & Events ─────────────────────────────────────────────
const domEvents: Lesson = {
  id: "dom-events",
  domain: "web",
  moduleId: "web-core-skills",
  title: "The DOM & Events",
  objective:
    "Read and change a live page with JavaScript, and respond to what the user does — the two things that make pages interactive.",
  difficulty: "Beginner",
  estMinutes: 9,
  prerequisites: ["js-fundamentals", "css-box-model"],
  tags: ["dom", "events", "javascript"],
  theory: `When the browser parses your HTML, it builds a live, in-memory tree of objects called the **DOM** (Document Object Model). Crucially, this tree isn't a snapshot — JavaScript can read *and change* it, and the page updates instantly.

### Selecting and changing elements

You find elements with methods like \`document.querySelector\`, then read or write their properties:

\`\`\`js
const title = document.querySelector("h1");
title.textContent = "Updated!";     // changes what's on screen, live
title.classList.add("highlight");   // toggle a CSS class
\`\`\`

This is the whole trick behind every dynamic page: JavaScript mutates the DOM, and the browser re-paints.

### Events: reacting to the user

An **event** fires when something happens — a click, a keypress, a page load. You **listen** for it with \`addEventListener\`, passing a function to run when it fires:

\`\`\`js
button.addEventListener("click", () => {
  console.log("clicked!");
});
\`\`\`

### Why direct DOM manipulation gets messy

Manually finding and mutating elements works, but as an app grows, keeping the DOM in sync with your data by hand becomes error-prone — you have to remember every place the UI needs to update. This exact pain is *why* frameworks like React exist: you describe what the UI should look like for a given piece of data, and the framework handles updating the DOM for you.`,
  intuition:
    "The DOM is like a whiteboard your JavaScript can erase and redraw on live, and an event listener is a sticky note that says 'when someone taps this spot, run this note's instructions.'",
  definitions: [
    { term: "DOM", meaning: "The live, in-memory tree of objects representing the page, which JavaScript can read and mutate." },
    { term: "Event", meaning: "A notification that something happened (click, input, load, etc.)." },
    { term: "Event listener", meaning: "A function registered to run when a specific event fires on an element." },
    { term: "querySelector", meaning: "A method that finds the first element matching a CSS selector." },
  ],
  language: "js",
  syntax: `const el = document.querySelector(".card");
el.textContent = "New text";
el.addEventListener("click", (event) => {
  console.log("clicked", event.target);
});`,
  example: {
    language: "js",
    code: `const button = document.querySelector("#like-btn");
let likes = 0;

button.addEventListener("click", () => {
  likes += 1;
  button.textContent = \`❤️ \${likes}\`;
});`,
    explanation:
      "Each click runs the listener: it bumps the JS variable `likes`, then writes the new count into the button's text — the two steps every interactive widget repeats: update data, then update the DOM to match.",
  },
  keyConcepts: ["The DOM is live and mutable", "querySelector to find elements", "addEventListener to react", "Manual sync doesn't scale"],
  commonMistakes: [
    "Forgetting the DOM only exists after the page (or at least that element) has loaded.",
    "Attaching the same listener repeatedly (e.g. in a loop) instead of once, causing duplicate fires.",
    "Manually keeping many DOM spots in sync with one piece of data and missing one — the root motivation for component frameworks.",
  ],
  tips: [
    "`event.target` is the exact element that triggered the event — essential for handling clicks on dynamic lists.",
    "This lesson is the 'why' behind React's existence — keep it in mind for the next lesson.",
  ],
  quiz: [
    {
      id: "web6-q1",
      type: "mcq",
      prompt: "What does `document.querySelector(\".card\")` return?",
      options: [
        "Every element with class `card`, as an array",
        "The first element matching `.card`, or `null` if none",
        "A string of the element's HTML",
        "A new `.card` element",
      ],
      answerIndex: 1,
      explanation: "`querySelector` returns the first matching element (or `null`). `querySelectorAll` returns all matches as a NodeList.",
    },
    {
      id: "web6-q2",
      type: "truefalse",
      prompt: "Changing `el.textContent` in JavaScript updates what's visible on the page immediately.",
      answer: true,
      explanation: "The DOM is live — mutating a property like `textContent` re-renders that part of the page right away, no reload needed.",
    },
    {
      id: "web6-q3",
      type: "fill",
      prompt: "The method used to register a function to run when an element is clicked is add____.",
      answers: ["EventListener", "addEventListener", "eventlistener"],
      placeholder: "addEvent...",
      explanation: "`element.addEventListener(\"click\", handler)` registers `handler` to run on every click.",
    },
  ],
  revision: [
    "The DOM is a live tree of objects representing the page; JS can read and mutate it directly.",
    "`querySelector` finds elements; property/method calls on them change what's rendered.",
    "`addEventListener(event, handler)` reacts to user interaction.",
    "Manually syncing many DOM spots to your data doesn't scale — this is why frameworks like React exist.",
  ],
};

// ── Lesson 7 — Async JavaScript & Fetch ─────────────────────────────────────
const asyncFetch: Lesson = {
  id: "async-fetch",
  domain: "web",
  moduleId: "web-core-skills",
  title: "Async JavaScript & fetch",
  objective:
    "Load real data from a server without freezing the page — Promises, async/await, and the fetch API.",
  difficulty: "Intermediate",
  estMinutes: 9,
  prerequisites: ["dom-events", "http-basics"],
  tags: ["async", "promises", "fetch", "javascript"],
  theory: `A network request can take hundreds of milliseconds. If JavaScript stopped and waited, the whole page would freeze — no scrolling, no clicking, nothing. So JavaScript is **asynchronous**: slow operations run in the background while the rest of the page stays responsive.

### Promises: a placeholder for a future value

A **Promise** represents a value that isn't ready yet but will be (or will fail). It has three states: *pending*, *fulfilled*, or *rejected*.

### async/await: promises that read like normal code

Writing \`.then()\` chains works but gets hard to read. **\`async\`/\`await\`** is sugar over the same mechanism, letting asynchronous code read top-to-bottom like synchronous code:

\`\`\`js
async function loadProfile() {
  const res = await fetch("/api/profile");   // pauses THIS function only — not the page
  const data = await res.json();
  return data;
}
\`\`\`

The page never actually freezes — \`await\` only pauses the surrounding \`async\` function; everything else keeps running.

### fetch: making the request

\`fetch(url)\` sends an HTTP request and returns a Promise that resolves to a Response. You typically \`await\` it, check \`res.ok\`, then \`await res.json()\` to parse the body.

### Always handle failure

Networks fail. Wrap awaited calls in \`try/catch\` so a dropped connection shows an error state instead of crashing silently.`,
  intuition:
    "Ordering food for delivery: you don't stand frozen at the door until it arrives (that would be synchronous/blocking) — you keep doing other things, and a notification (the Promise resolving) tells you when it's ready.",
  definitions: [
    { term: "Asynchronous", meaning: "Code that doesn't block execution while waiting — the rest of the program keeps running." },
    { term: "Promise", meaning: "An object representing a value that will be available later (fulfilled) or fail (rejected)." },
    { term: "async / await", meaning: "Syntax that lets asynchronous code, built on Promises, read like synchronous code." },
    { term: "fetch", meaning: "The browser API for making HTTP requests, returning a Promise of a Response." },
  ],
  language: "js",
  syntax: `async function loadUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } catch (err) {
    console.error("Failed to load user:", err);
    return null;
  }
}`,
  example: {
    language: "js",
    code: `async function loadTodos() {
  const res = await fetch("/api/todos");
  const todos = await res.json();
  console.log(\`Loaded \${todos.length} todos\`);
  return todos;
}

loadTodos();
console.log("This logs BEFORE the todos — fetch doesn't block!");`,
    explanation:
      "The second `console.log` runs immediately, before the fetch resolves — proof that `await` only pauses `loadTodos()`, not the rest of the script. This is the essence of non-blocking async code.",
  },
  visual: {
    kind: "mermaid",
    caption: "A Promise's lifecycle.",
    src: `stateDiagram-v2
    [*] --> Pending
    Pending --> Fulfilled: request succeeds
    Pending --> Rejected: request fails
    Fulfilled --> [*]
    Rejected --> [*]`,
  },
  keyConcepts: ["Non-blocking execution", "Promise states", "await pauses the function, not the page", "Always try/catch network calls"],
  commonMistakes: [
    "Forgetting `await` and getting a Promise object instead of the actual data.",
    "Not checking `res.ok` — `fetch` does NOT reject on HTTP error statuses like 404/500, only on network failure.",
    "Skipping `try/catch`, so a dropped connection crashes instead of showing an error state.",
  ],
  tips: [
    "'Does fetch reject on a 404?' — no. You must check `res.ok` or `res.status` yourself.",
    "async/await and `.then()` chains are the same underlying mechanism — async/await is just easier to read.",
  ],
  quiz: [
    {
      id: "web7-q1",
      type: "truefalse",
      prompt: "`fetch` rejects (throws) automatically when the server responds with a 404.",
      answer: false,
      explanation: "`fetch` only rejects on network failure. A 404 is still a valid HTTP response — you must check `res.ok`/`res.status` yourself.",
    },
    {
      id: "web7-q2",
      type: "mcq",
      prompt: "What does `await` do inside an `async` function?",
      options: [
        "Freezes the entire browser tab until the Promise resolves",
        "Pauses only that function until the Promise settles, letting everything else keep running",
        "Cancels the Promise",
        "Converts the function to run synchronously everywhere",
      ],
      answerIndex: 1,
      explanation: "`await` pauses execution of the surrounding async function only — the rest of the page (UI, other scripts) stays fully responsive.",
    },
    {
      id: "web7-q3",
      type: "code",
      prompt: "Write an `async` function `loadNum()` that awaits `Promise.resolve(21)`, doubles it, and logs `42`.",
      starter: `async function loadNum() {\n  // await Promise.resolve(21), double it, console.log it\n}\nloadNum();`,
      expectedOutput: "42",
      explanation: "`const n = await Promise.resolve(21); console.log(n * 2);` — awaiting an already-resolved Promise still works the same way.",
    },
  ],
  revision: [
    "JS is asynchronous so slow operations (like network requests) don't freeze the page.",
    "A Promise is pending → fulfilled or rejected.",
    "`await` pauses only the enclosing async function, not the whole page.",
    "`fetch` doesn't reject on HTTP error codes — always check `res.ok`, and wrap awaits in `try/catch`.",
  ],
};

// ── Lesson 8 — Your First React Component ───────────────────────────────────
const introReact: Lesson = {
  id: "intro-react-component",
  domain: "web",
  moduleId: "web-core-skills",
  title: "Your First React Component & State",
  objective:
    "Build a small interactive React component and understand the one idea that defines the framework: UI as a function of state.",
  difficulty: "Intermediate",
  estMinutes: 10,
  prerequisites: ["async-fetch"],
  tags: ["react", "components", "state", "jsx"],
  theory: `The DOM lesson showed the pain of manually syncing many spots on the page to your data. **React** solves this with one core idea: **UI = a function of state.** You describe what the UI *should* look like for the current data, and React figures out how to update the real DOM to match — you never call \`document.querySelector\` yourself.

### Components

A **component** is a JavaScript function that returns UI (written in **JSX**, HTML-like syntax inside JS):

\`\`\`jsx
function Greeting() {
  return <h1>Hello!</h1>;
}
\`\`\`

Components compose: a page is a tree of components, just like HTML is a tree of elements.

### State: data that changes over time

**State** is data a component tracks that can change and cause it to re-render. You declare it with the \`useState\` **hook**:

\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

\`count\` is the current value; \`setCount\` is the *only* correct way to change it. Calling \`setCount\` tells React "this data changed — re-run this component and update the DOM to match."

### The mental shift

You never say "find the button and change its text" (imperative — the old DOM way). You say "when \`count\` is 3, the button's text is 3" (**declarative**) — and let React handle the DOM work. This is the single biggest mental shift from Lesson 6, and the reason React (and frameworks like it) exist.`,
  intuition:
    "Like a spreadsheet: you don't manually recompute every cell that depends on B2 when B2 changes — you just declare `=B2*2` once, and the spreadsheet keeps everything in sync automatically. `useState` + JSX is that same idea, applied to UI.",
  definitions: [
    { term: "Component", meaning: "A function that returns UI (JSX); the basic building block of a React app." },
    { term: "JSX", meaning: "HTML-like syntax that compiles to JavaScript, used to describe UI inside components." },
    { term: "State", meaning: "Data a component owns that can change over time and trigger a re-render." },
    { term: "useState", meaning: "The React hook that declares a piece of state and a function to update it." },
    { term: "Declarative UI", meaning: "Describing what the UI should look like for given data, instead of manually mutating the DOM." },
  ],
  language: "jsx",
  syntax: `function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`,
  example: {
    language: "jsx",
    code: `import { useState } from "react";

function LikeButton() {
  const [likes, setLikes] = useState(0);

  return (
    <button onClick={() => setLikes(likes + 1)}>
      ❤️ {likes}
    </button>
  );
}`,
    explanation:
      "Compare this to the DOM-events lesson's like button: no `querySelector`, no manual `textContent` write. `setLikes` updates the state; React re-renders the button with the new number automatically.",
  },
  visual: { kind: "anim", name: "reactRender", caption: "State changes → component re-runs → React updates only what changed in the DOM." },
  keyConcepts: ["UI = f(state)", "Components are functions returning JSX", "useState for changing data", "Declarative, not imperative"],
  commonMistakes: [
    "Mutating state directly (`count = count + 1`) instead of calling the setter (`setCount`) — React won't know to re-render.",
    "Trying to read the updated state value immediately after calling the setter in the same line — updates are scheduled, not instant.",
    "Reaching for `document.querySelector` inside a component instead of trusting state + JSX to describe the UI.",
  ],
  tips: [
    "'What is state, and why not just use a normal variable?' — a normal variable change doesn't trigger a re-render; `useState`'s setter does.",
    "This lesson closes the loop from Lesson 6: the DOM-manipulation pain is *exactly* what components + state remove.",
  ],
  quiz: [
    {
      id: "web8-q1",
      type: "mcq",
      prompt: "What is the correct way to update a piece of React state?",
      options: [
        "Reassign the state variable directly, e.g. `count = count + 1`",
        "Call its setter function, e.g. `setCount(count + 1)`",
        "Use `document.querySelector` to change the DOM directly",
        "Mutate it inside a `for` loop",
      ],
      answerIndex: 1,
      explanation: "Only calling the setter (`setCount`) tells React the value changed, which schedules a re-render. Direct reassignment does nothing visible.",
    },
    {
      id: "web8-q2",
      type: "truefalse",
      prompt: "A React component decides how to update the DOM manually, the same way the DOM-events lesson did.",
      answer: false,
      explanation: "That's the whole point of React: you describe the UI declaratively from state, and React handles the DOM updates for you.",
    },
    {
      id: "web8-q3",
      type: "fill",
      prompt: "The hook used to declare a piece of state in a function component is use____.",
      answers: ["State", "useState"],
      placeholder: "use...",
      explanation: "`useState(initialValue)` returns `[value, setValue]` — the current state and the function to update it.",
    },
  ],
  revision: [
    "React's core idea: UI is a function of state — describe what it should look like, not how to update the DOM.",
    "A component is a function returning JSX; components compose into a tree.",
    "`useState` declares state; its setter is the only correct way to change it and trigger a re-render.",
    "This removes the manual DOM-syncing pain from the previous lesson.",
  ],
};

export const coreSkills: Module = {
  id: "web-core-skills",
  domain: "web",
  title: "Core Skills",
  summary: "Style with CSS, make pages interactive with the DOM, load real data asynchronously, then build your first React component.",
  order: 1,
  lessons: [cssBoxModel, domEvents, asyncFetch, introReact],
};
