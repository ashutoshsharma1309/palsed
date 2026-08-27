// ────────────────────────────────────────────────────────────────────────────
//  AI Foundations — extension lessons. The toolkit ramp that follows
//  "what-is-machine-learning": Python → NumPy → pandas → visualisation →
//  stats/probability → linear-algebra intuition. Appended to the existing
//  ai-foundations module in ai/index.ts. Original prose; fast.ai / NumPy /
//  pandas / scikit-learn docs informed scope only, never text.
// ────────────────────────────────────────────────────────────────────────────
import type { Lesson } from "../types";

// ── Lesson — Python for AI ──────────────────────────────────────────────────
const pythonForAi: Lesson = {
  id: "python-for-ai",
  domain: "ai",
  moduleId: "ai-foundations",
  title: "Python for AI: The 20% You Actually Use",
  objective:
    "Use the small slice of Python that data work lives on — lists, dicts, comprehensions, functions, and slicing — and understand why Python became the language of AI.",
  difficulty: "Beginner",
  estMinutes: 8,
  prerequisites: ["what-is-machine-learning"],
  tags: ["python", "lists", "dicts", "comprehensions", "slicing"],
  theory: `Python didn't win AI because it's fast — it's one of the *slower* mainstream languages. It won because it's **readable glue**. The heavy number-crunching in NumPy, pandas, and PyTorch happens in compiled C/C++ under the hood; Python is the friendly steering wheel on top. Add a huge scientific ecosystem and notebooks that let you poke at data interactively, and you get the language every ML paper and tutorial speaks.

That means you don't need *all* of Python to do AI. You need a focused 20%, used constantly.

### Lists: ordered collections of examples

A **list** holds items in order — in data work, usually "one item per example":

- \`emails = ["win money now", "meeting at 3pm"]\` — two raw inputs.
- \`labels = [1, 0]\` — their labels, aligned by position.

That positional alignment — \`emails[0]\` goes with \`labels[0]\` — is the shape of every supervised dataset you'll ever touch.

### Dicts: labelled lookups

A **dict** maps keys to values: \`counts = {"free": 3, "money": 2}\`. Dicts are how you'll represent one structured record (\`{"age": 34, "city": "Pune"}\`), count things, and configure models. If lists are the rows of your data, dicts are the *named columns* of a single row.

### Comprehensions: transform a collection in one line

The single most data-flavoured piece of Python syntax:

\`lengths = [len(e) for e in emails]\`

Read it as "*a new list of* \`len(e)\` *for each* \`e\` *in* \`emails\`". Add a condition to filter: \`[e for e in emails if "free" in e]\`. Comprehensions are everywhere in ML code because "apply a transformation to every example" is 90% of data preparation. They're also a warm-up for NumPy, where the same idea becomes a single vectorised operation.

### Functions: name your transformations

A **function** packages a transformation so you can reuse and test it:

\`def clean(text): return text.lower().strip()\`

In ML pipelines, functions are how preprocessing stays consistent — the *same* \`clean\` must run on training data and on tomorrow's live inputs, or your model sees a world it never trained on.

### Slicing: take a window of data

Slicing pulls out a sub-range: \`data[start:stop]\` (stop is *excluded*).

- \`data[:80]\` — the first 80 items (say, a training set).
- \`data[80:]\` — everything after (a test set).
- \`data[-5:]\` — the last five.

That "excluded stop" rule feels pedantic until you notice \`data[:80]\` and \`data[80:]\` split a list with no overlap and no gap — exactly what a train/test split needs. NumPy and pandas reuse this syntax heavily, so fluency here pays off immediately in the next lessons.

### The mindset shift

Coming from general programming, the shift is this: AI-flavoured Python is less about clever algorithms and more about **flowing collections through transformations** — load a list of examples, clean each one, filter some out, slice off a test set. Master that flow in plain Python first, and NumPy will feel like the same ideas with a turbocharger.`,
  intuition:
    "Python is the lab assistant, not the microscope. The precise optics (fast math) live in compiled libraries; Python is the plain-language way you tell the lab what experiment to run — which is why scientists who aren't career programmers adopted it first.",
  definitions: [
    { term: "List", meaning: "An ordered, mutable collection — typically one element per data example." },
    { term: "Dict", meaning: "A key → value mapping, ideal for one structured record or for counting." },
    { term: "Comprehension", meaning: "One-line syntax that builds a new list by transforming (and optionally filtering) another." },
    { term: "Slicing", meaning: "Extracting a sub-range with start:stop indices, where stop is excluded." },
  ],
  language: "python",
  syntax: `items = [3, 1, 4, 1, 5]
squares = [x * x for x in items]     # transform every element
evens   = [x for x in items if x % 2 == 0]  # filter
first_three, rest = items[:3], items[3:]     # slice (stop excluded)`,
  example: {
    language: "python",
    code: `emails = ["WIN money NOW", "meeting at 3pm", "free FREE offer"]
labels = [1, 0, 1]                     # aligned by position

def clean(text):
    return text.lower().strip()

cleaned = [clean(e) for e in emails]
spam    = [e for e, y in zip(cleaned, labels) if y == 1]

print(cleaned[0])      # win money now
print(len(spam))       # 2
print(cleaned[:2])     # ['win money now', 'meeting at 3pm']`,
    explanation:
      "One reusable `clean` function, applied to every example with a comprehension; `zip` walks two aligned lists together to filter the spam; slicing takes the first two cleaned emails. This load → clean → filter → slice flow *is* everyday ML data prep.",
  },
  keyConcepts: [
    "Python = readable glue over fast C libraries",
    "Lists hold examples; position aligns inputs with labels",
    "Comprehensions transform/filter collections in one line",
    "Slicing with an excluded stop makes clean splits",
  ],
  commonMistakes: [
    "Expecting `data[2:5]` to include index 5 — the stop index is always excluded.",
    "Mutating a list while looping over it — build a new list with a comprehension instead.",
    "Copying a list with `b = a` — that's a second name for the *same* list; use `b = a[:]` or `list(a)`.",
    "Writing three-line loops where a comprehension says the same thing in one readable line.",
  ],
  tips: [
    "Interviewers often ask 'why is Python dominant in ML?' — the answer is ecosystem + readability, with speed delegated to C under the hood (NumPy, PyTorch).",
    "If a comprehension needs nested logic or multiple conditions, revert to a plain loop — readability beats cleverness in shared ML code.",
  ],
  quiz: [
    {
      id: "pyai-q1",
      type: "mcq",
      prompt: "Why did Python become the dominant language for AI despite being slow?",
      options: [
        "Python is secretly the fastest language for math",
        "It's readable glue over fast compiled libraries, with a huge scientific ecosystem",
        "It's the only language with machine-learning libraries",
        "Neural networks can only be expressed in Python",
      ],
      answerIndex: 1,
      explanation:
        "The heavy math runs in compiled C/C++ inside NumPy/PyTorch; Python supplies readability, notebooks, and an ecosystem. Other languages have ML libraries, but the community and tooling converged on Python.",
    },
    {
      id: "pyai-q2",
      type: "output",
      prompt: "What does this print?",
      language: "python",
      code: `data = [10, 20, 30, 40, 50]
print(data[1:3])`,
      answers: ["[20, 30]"],
      explanation:
        "Slicing starts at index 1 (value 20) and *excludes* the stop index 3, so only indices 1 and 2 are included: `[20, 30]`.",
    },
    {
      id: "pyai-q3",
      type: "fill",
      prompt: "`[x * 2 for x in nums]` is called a list ____.",
      answers: ["comprehension", "list comprehension"],
      placeholder: "one word",
      explanation:
        "A list comprehension builds a new list by transforming each element of another — the everyday idiom for 'apply this to every example'.",
    },
    {
      id: "pyai-q4",
      type: "truefalse",
      prompt: "`data[:80]` and `data[80:]` overlap at index 80.",
      answer: false,
      explanation:
        "`data[:80]` covers indices 0–79 (stop excluded) and `data[80:]` starts at 80 — no overlap, no gap. That's exactly why this idiom is used for train/test splits.",
    },
  ],
  revision: [
    "Python won AI through readability and ecosystem; speed comes from C libraries underneath.",
    "Lists hold examples in order; matching positions align inputs with labels.",
    "Comprehensions transform and filter collections in one line — the core data-prep idiom.",
    "Slices use start:stop with stop excluded, which makes gap-free, overlap-free splits.",
  ],
};

// ── Lesson — NumPy Fundamentals ─────────────────────────────────────────────
const numpyFundamentals: Lesson = {
  id: "numpy-fundamentals",
  domain: "ai",
  moduleId: "ai-foundations",
  title: "NumPy: Arrays, Vectorization & Broadcasting",
  objective:
    "Think in ndarrays — replace Python loops with vectorized operations, reason about shapes and axes, and filter data with boolean masks.",
  difficulty: "Beginner",
  estMinutes: 9,
  prerequisites: ["python-for-ai"],
  tags: ["numpy", "ndarray", "vectorization", "broadcasting", "axes"],
  theory: `NumPy's one export that matters is the **ndarray** — an N-dimensional grid of numbers, all the same type, stored in one contiguous block of memory. Every serious ML library (pandas, scikit-learn, PyTorch) is built on this idea. Learn to *think in arrays* and the rest of the stack opens up.

### Why loops are slow — and vectorization isn't

A Python loop over a list pays interpreter overhead on **every element**: check the type, box the number, dispatch the operation. Do that a million times and the bookkeeping dwarfs the math.

A **vectorized** operation like \`a * 2\` hands the whole array to compiled C once. One type check, then a tight machine-code loop over raw memory. The result is routinely 10–100× faster — and, just as important, the code *says what it means*: \`prices * 1.18\` reads like the math it performs.

Rule of thumb: if you're writing \`for\` over numbers, there's probably a NumPy expression that deletes the loop.

### Shapes and axes — the #1 confusion

Every array has a \`.shape\`: a 2-D array of 3 rows and 4 columns has shape \`(3, 4)\`. In ML convention that's **(n_samples, n_features)** — rows are examples, columns are measurements.

**Axes** number the shape's dimensions: axis 0 runs down the rows, axis 1 runs across the columns. The confusing part: \`a.sum(axis=0)\` doesn't mean "sum each row" — it means **collapse axis 0**, summing *down* each column, producing one number per column. The reliable trick: *the axis you pass is the one that disappears from the shape*. \`(3, 4).sum(axis=0) → (4,)\`; \`axis=1 → (3,)\`. Say "collapse", not "along", and the confusion evaporates.

### Broadcasting: mixing shapes on purpose

Broadcasting lets differently-shaped arrays combine by **virtually stretching** the smaller one — no copies made:

- \`a * 2\` — a scalar stretches over everything.
- \`X - X.mean(axis=0)\` — a \`(4,)\` row of column means stretches down all rows of a \`(3, 4)\` matrix, centering each feature.

The rule: compare shapes right-to-left; dimensions are compatible when they're equal or one of them is 1. This is how "scale every feature" or "subtract the mean" is one line with no loop — and it's the mechanism behind most one-liners you'll see in real ML code.

### Boolean masking: filtering without loops

Comparisons on arrays return arrays of \`True\`/\`False\`:

\`mask = ages > 30\` → \`[False, True, True, ...]\`

Index with the mask and you keep only the \`True\` positions: \`ages[mask]\`. Combine conditions with \`&\` and \`|\` (with parentheses — not \`and\`/\`or\`): \`X[(ages > 30) & (income < 50)]\`. Masking is how you'll select rows, drop outliers, and slice datasets by condition — and it's the exact idiom pandas filtering builds on next lesson.

Everything in this lesson compounds: shapes tell you what an operation *can* do, vectorization makes it fast, broadcasting makes it terse, and masks make selection declarative. This is the grammar of numerical Python.`,
  intuition:
    "A Python loop is asking a clerk to fetch a million parcels one trip at a time, filling out paperwork per parcel. Vectorization backs the truck up to the warehouse once — same parcels, one set of paperwork, and the loading dock (compiled C) does the heavy lifting.",
  definitions: [
    { term: "ndarray", meaning: "NumPy's N-dimensional array — same-typed numbers in contiguous memory." },
    { term: "Vectorization", meaning: "Replacing per-element Python loops with whole-array operations executed in compiled code." },
    { term: "Shape", meaning: "The size of each dimension, e.g. (3, 4) = 3 rows × 4 columns; ML convention is (samples, features)." },
    { term: "Broadcasting", meaning: "The rules that let differently-shaped arrays combine by virtually stretching size-1 dimensions." },
    { term: "Boolean mask", meaning: "A True/False array used as an index to keep only rows where the condition holds." },
  ],
  language: "python",
  syntax: `import numpy as np

X = np.array([[1., 2.], [3., 4.], [5., 6.]])  # shape (3, 2)
X * 10                # vectorized: every element, no loop
X.sum(axis=0)         # collapse rows -> one total per column, shape (2,)
X - X.mean(axis=0)    # broadcasting: center each column
X[X[:, 0] > 2]        # boolean mask: rows where feature 0 > 2`,
  example: {
    language: "python",
    code: `import numpy as np

# rows = people, columns = [age, income_k]
X = np.array([[25, 40],
              [32, 60],
              [47, 90]])

print(X.shape)             # (3, 2)
print(X.mean(axis=0))      # [34.66666667 63.33333333]

ages = X[:, 0]             # first column, shape (3,)
mask = ages > 30
print(mask)                # [False  True  True]
print(X[mask])             # [[32 60]
                           #  [47 90]]`,
    explanation:
      "`mean(axis=0)` collapses the row axis — one mean per column (average age, average income). The comparison `ages > 30` runs vectorized over the whole column at once, and indexing with the resulting mask keeps only the matching rows. Zero loops anywhere.",
  },
  keyConcepts: [
    "ndarray: one typed block of memory, any number of dimensions",
    "Vectorized ops move the loop into compiled C",
    "The axis you pass is the axis that disappears",
    "Broadcasting stretches size-1 dims without copying",
    "Boolean masks select rows declaratively",
  ],
  commonMistakes: [
    "Reading `sum(axis=0)` as 'sum each row' — it *collapses* axis 0, giving per-column totals.",
    "Using `and`/`or` between mask arrays — NumPy needs `&`/`|` with parentheses around each condition.",
    "Looping over array elements out of habit when one vectorized expression would do it faster and clearer.",
    "Ignoring `.shape` while debugging — most NumPy errors are shape mismatches you'd spot in one print.",
  ],
  tips: [
    "'Why is NumPy faster than a Python loop?' is a real screening question — the answer is one dispatch into compiled C over contiguous memory versus interpreter overhead per element.",
    "When any array expression confuses you, print `.shape` of every operand first — shapes explain 90% of surprises.",
    "Remember (n_samples, n_features): scikit-learn expects exactly that orientation everywhere.",
  ],
  quiz: [
    {
      id: "np-q1",
      type: "mcq",
      prompt: "`A` has shape `(3, 4)`. What is the shape of `A.sum(axis=0)`?",
      options: ["(3,)", "(4,)", "(3, 4)", "A single number"],
      answerIndex: 1,
      explanation:
        "The axis you pass is the one that disappears: collapsing axis 0 (the 3 rows) leaves one sum per column — shape `(4,)`.",
    },
    {
      id: "np-q2",
      type: "output",
      prompt: "What does this print?",
      language: "python",
      code: `import numpy as np
a = np.array([1, 2, 3])
print(a * 2 + 1)`,
      answers: ["[3 5 7]", "[3, 5, 7]"],
      explanation:
        "Both operations broadcast over the whole array: `[1,2,3] * 2 = [2,4,6]`, then `+ 1` gives `[3 5 7]`. Note NumPy prints arrays without commas.",
    },
    {
      id: "np-q3",
      type: "truefalse",
      prompt: "Broadcasting physically copies the smaller array to match the bigger one's shape before operating.",
      answer: false,
      explanation:
        "Broadcasting is virtual — NumPy *acts as if* the size-1 dimensions were stretched, but no copy is made. That's why it's both terse and memory-cheap.",
    },
    {
      id: "np-q4",
      type: "fill",
      prompt: "Indexing an array with a True/False array to keep matching rows is called boolean ____.",
      answers: ["masking", "mask", "indexing"],
      placeholder: "one word",
      explanation:
        "Boolean masking: `X[ages > 30]` keeps the rows where the mask is True — the loop-free way to filter data.",
    },
  ],
  revision: [
    "ndarrays store same-typed numbers contiguously; that layout is what makes fast math possible.",
    "Vectorize: one whole-array expression replaces a per-element Python loop and its overhead.",
    "Axes: the axis you pass to sum/mean is the one that collapses out of the shape.",
    "Broadcasting stretches compatible shapes virtually; boolean masks filter rows without loops.",
  ],
};

// ── Lesson — pandas Fundamentals ────────────────────────────────────────────
const pandasFundamentals: Lesson = {
  id: "pandas-fundamentals",
  domain: "ai",
  moduleId: "ai-foundations",
  title: "pandas: DataFrames, Selection & GroupBy",
  objective:
    "Load a dataset into a DataFrame, select exactly the rows and columns you mean with loc/iloc and filters, summarise groups, and handle missing values deliberately.",
  difficulty: "Beginner",
  estMinutes: 9,
  prerequisites: ["numpy-fundamentals"],
  tags: ["pandas", "dataframe", "loc-iloc", "groupby", "missing-values"],
  theory: `NumPy gives you a grid of numbers; real datasets have **named columns of mixed types** — strings, dates, floats, gaps. That's pandas. A **DataFrame** is a table (think spreadsheet with a programmer's API); each column is a **Series** — a labelled 1-D array built on NumPy, so everything you learned about vectorization and masks carries straight over.

### Loading data

Almost every project starts the same way:

\`df = pd.read_csv("emails.csv")\`

Then three reflex calls before *any* analysis: \`df.head()\` (see a few rows), \`df.shape\` (how much data), \`df.info()\` (column types and missing counts). Thirty seconds here catches wrong delimiters, numbers parsed as strings, and columns full of gaps — before they poison your model.

### Selection: loc vs iloc

Two indexers, one distinction worth memorising:

- **\`df.loc[rows, cols]\`** — select by **label**: \`df.loc[3, "amount"]\` (index label 3, column "amount").
- **\`df.iloc[rows, cols]\`** — select by **integer position**: \`df.iloc[0, 2]\` (first row, third column).

The trap: after you filter or shuffle a DataFrame, labels no longer equal positions. \`df.loc[0]\` means "the row *labelled* 0" — which may not exist any more — while \`df.iloc[0]\` always means "the first row". Mixing them up is the classic pandas bug.

### Filtering: boolean masks on tables

Exactly the NumPy idiom, now with column names:

\`df[df["amount"] > 100]\`

Combine conditions with \`&\` / \`|\` and parentheses: \`df[(df["amount"] > 100) & (df["country"] == "IN")]\`. Read it aloud — "rows where amount exceeds 100 *and* country is IN" — and it's self-documenting.

### GroupBy: split → apply → combine

The most powerful line in pandas:

\`df.groupby("country")["amount"].mean()\`

Mentally it runs in three steps: **split** the rows into one group per country, **apply** \`mean\` to each group's amounts, **combine** the results into one labelled Series. Any "average X per Y", "count per category", "max per user" question is a one-liner in this pattern — the same aggregation that would be a loop-plus-dict in plain Python.

### Missing values: decide, don't drift

Real data has holes, which pandas shows as \`NaN\`. First measure: \`df.isna().sum()\` — missing count per column. Then choose deliberately:

- **\`df.dropna()\`** — drop incomplete rows. Fine when few; dangerous when many (you may silently discard a biased slice of your data — maybe the missingness *means* something).
- **\`df["age"].fillna(df["age"].median())\`** — fill with a sensible default. The median resists outliers better than the mean.

There's no universally right answer — the point is that it should be a *decision you made*, not something that happened. Models can't train on NaN, so this step is mandatory, and later (in feature engineering) you'll learn that fill values must be computed from training data only.

Master these five moves — load, inspect, select, group, handle gaps — and you can hold your own in the exploratory phase of any ML project.`,
  intuition:
    "A DataFrame is a spreadsheet that answers to code instead of clicks. Everything you'd do by hand in Excel — filter rows, average a column per category, spot blanks — becomes one reproducible line you can rerun on next week's data unchanged.",
  definitions: [
    { term: "DataFrame", meaning: "A 2-D table of named, possibly mixed-type columns — the standard container for tabular data." },
    { term: "Series", meaning: "One labelled column — a 1-D array with an index, built on NumPy." },
    { term: "loc / iloc", meaning: "Label-based vs integer-position-based selection of rows and columns." },
    { term: "GroupBy", meaning: "Split rows into groups by a key, apply an aggregation per group, combine the results." },
    { term: "NaN", meaning: "pandas' marker for a missing value; models can't train on it, so it must be dropped or filled." },
  ],
  language: "python",
  syntax: `import pandas as pd

df = pd.read_csv("data.csv")
df.head(); df.shape; df.info()          # always inspect first
df.loc[5, "amount"]                     # by label
df.iloc[0, 2]                           # by position
df[(df["amount"] > 100) & (df["country"] == "IN")]
df.groupby("country")["amount"].mean()
df["age"] = df["age"].fillna(df["age"].median())`,
  example: {
    language: "python",
    code: `import pandas as pd

df = pd.DataFrame({
    "country": ["IN", "US", "IN", "US"],
    "amount":  [120,   80,  200, None],
})

print(df.shape)                    # (4, 2)
print(df.isna().sum()["amount"])   # 1

df["amount"] = df["amount"].fillna(df["amount"].median())
big = df[df["amount"] > 100]
print(len(big))                    # 3

print(df.groupby("country")["amount"].mean())
# country
# IN    160.0
# US    100.0
# Name: amount, dtype: float64`,
    explanation:
      "Inspect first (`shape`, missing count), fill the gap with the median (120), *then* filter and aggregate. The filled US row becomes 120, so three rows exceed 100, and groupby averages amounts per country in one line.",
  },
  keyConcepts: [
    "DataFrame = table; Series = one labelled column on NumPy",
    "Inspect before analysing: head / shape / info",
    "loc selects by label, iloc by position — they diverge after filtering",
    "groupby = split → apply → combine",
    "Missing values are handled by decision, not by accident",
  ],
  commonMistakes: [
    "Using `df.loc[0]` after filtering and expecting the first row — labels survive filtering; use `iloc[0]` for position.",
    "Writing `df[df.a > 1 & df.b < 2]` — `&` binds tighter than comparisons, so each condition needs parentheses.",
    "Calling `dropna()` reflexively and silently losing a third of the dataset — count missing values first.",
    "Skipping `df.info()` and discovering three weeks later that 'price' was parsed as a string.",
  ],
  tips: [
    "'What's the difference between loc and iloc?' is a genuine data-role screening question — label vs integer position is the whole answer, plus knowing they diverge after filtering.",
    "Chain your reflexes: every `read_csv` is immediately followed by `head()`, `shape`, `info()` — interviewers notice candidates who inspect before they compute.",
    "For 'average X per Y' questions in take-homes, reach for `groupby` before you reach for a loop.",
  ],
  quiz: [
    {
      id: "pd-q1",
      type: "mcq",
      prompt: "After `df2 = df[df[\"score\"] > 50]`, which expression reliably returns the *first row* of `df2`?",
      options: ["df2.loc[0]", "df2.iloc[0]", "df2[0]", "df2.first"],
      answerIndex: 1,
      explanation:
        "Filtering keeps original index labels, so the row labelled 0 may have been filtered out — `loc[0]` can raise a KeyError. `iloc[0]` always means position 0.",
    },
    {
      id: "pd-q2",
      type: "output",
      prompt: "What does this print?",
      language: "python",
      code: `import pandas as pd
df = pd.DataFrame({"x": [5, 15, 25]})
print(len(df[df["x"] > 10]))`,
      answers: ["2"],
      explanation:
        "The mask `df[\"x\"] > 10` is `[False, True, True]`; indexing keeps the two matching rows, so `len` is 2.",
    },
    {
      id: "pd-q3",
      type: "fill",
      prompt: "The split → apply → combine aggregation pattern is invoked with `df.____(\"country\")`.",
      answers: ["groupby"],
      placeholder: "method name",
      explanation:
        "`groupby` splits rows by key, applies an aggregation per group, and combines the results — the one-liner behind every 'metric per category' question.",
    },
    {
      id: "pd-q4",
      type: "truefalse",
      prompt: "Dropping all rows with any missing value is always the safest way to handle NaNs.",
      answer: false,
      explanation:
        "If missingness is common or non-random, `dropna()` can discard a large, biased slice of the data. Count missing values first, then decide between dropping and filling per column.",
    },
  ],
  revision: [
    "DataFrame = named-column table; each column is a Series built on NumPy.",
    "loc is label-based, iloc is position-based — they give different rows after filtering.",
    "Filter with parenthesised boolean masks; aggregate per category with groupby.",
    "Measure missing values with isna().sum(), then deliberately drop or fill (median is a robust default).",
  ],
};

// ── Lesson — Data Visualization ─────────────────────────────────────────────
const dataVisualization: Lesson = {
  id: "data-visualization",
  domain: "ai",
  moduleId: "ai-foundations",
  title: "Data Visualization: Seeing Before Modeling",
  objective:
    "Use matplotlib's four workhorse plots — histogram, scatter, line, box — to read distributions and relationships, and run a basic EDA workflow before any model touches the data.",
  difficulty: "Beginner",
  estMinutes: 8,
  prerequisites: ["pandas-fundamentals"],
  tags: ["matplotlib", "eda", "histogram", "scatter", "distributions"],
  theory: `Summary statistics lie by omission. A column can have a pleasant mean and standard deviation while hiding two separate clusters, a hard cap, or a handful of absurd outliers — famous constructed datasets share identical stats yet look wildly different when plotted. **Plotting is how you catch what numbers hide**, which is why experienced practitioners visualise *before* they model, not after.

### matplotlib in two lines

The API you'll use 95% of the time is tiny:

\`plt.hist(df["age"], bins=30)\` then \`plt.show()\`

Add \`plt.xlabel\`, \`plt.ylabel\`, \`plt.title\` and you're producing readable plots. Everything fancier (subplots, styles, seaborn) is layered on this core — don't let the library's size intimidate you into skipping the habit.

### The four plots that matter

- **Histogram** — the shape of *one numeric column*. Bars count how many values fall in each bin. Your first question about any feature — "what does this look like?" — is a histogram.
- **Scatter plot** — the relationship between *two numeric columns*, one dot per row. Trends, clusters, and outliers jump out. Plot each feature against the target and you're previewing what a model can learn.
- **Line plot** — *change over an ordered axis*, usually time. Trend, seasonality, and sudden level shifts (often a data-collection change, not reality) are visible instantly.
- **Box plot** — a distribution *compared across categories*: the box spans the middle 50% (median line inside), whiskers cover the typical range, dots beyond them are flagged outliers. "Does amount differ by country?" is one box plot.

### Reading a distribution

When you look at a histogram, check four things:

1. **Shape** — one hump (unimodal)? Two (bimodal — often two mixed populations that may deserve separate treatment)?
2. **Skew** — a long right tail (incomes, prices) drags the mean above the median; heavily skewed features often benefit from a log transform later.
3. **Outliers** — isolated bars far from the mass. Typo, sensor glitch, or genuinely rare event? The answer changes what you do.
4. **Weirdness** — spikes at exactly 0 or 999 (sentinel codes for "missing"), hard cliffs (data capped at a limit). These are data-quality findings, and they're *invisible* in summary stats.

### A minimal EDA workflow

**Exploratory Data Analysis** is the disciplined version of "look before you leap": after loading and inspecting (last lesson), histogram every numeric feature, bar-chart the target's class counts (is it imbalanced?), scatter promising features against the target, and box-plot key features across categories. Twenty minutes of this routinely surfaces the insight — or the data bug — that saves weeks of confused modeling. A model trained on unexamined data inherits every one of its problems silently.`,
  intuition:
    "EDA is the pilot's walk-around before takeoff. You could trust the instrument summary and fly — but a two-minute visual loop around the aircraft catches the dented flap the dashboard will never show you. Plots are the walk-around for data.",
  definitions: [
    { term: "Histogram", meaning: "Bars counting how many values of one numeric column fall into each bin — shows a distribution's shape." },
    { term: "Scatter plot", meaning: "One dot per row for two numeric columns — reveals relationships, clusters, and outliers." },
    { term: "Box plot", meaning: "A compact distribution summary: box = middle 50%, line = median, points beyond whiskers = flagged outliers." },
    { term: "Skew", meaning: "Asymmetry of a distribution; a long right tail pulls the mean above the median." },
    { term: "EDA", meaning: "Exploratory Data Analysis — systematically inspecting and plotting data before modeling." },
  ],
  language: "python",
  syntax: `import matplotlib.pyplot as plt

plt.hist(df["age"], bins=30)          # one column's shape
plt.scatter(df["size"], df["price"])  # relationship between two
plt.plot(dates, sales)                # change over time
df.boxplot(column="amount", by="country")  # distribution per category
plt.xlabel("age"); plt.title("Age distribution"); plt.show()`,
  example: {
    language: "python",
    code: `import pandas as pd

incomes = pd.Series([32, 35, 38, 41, 44, 47, 52, 58, 65, 400])

print(incomes.mean())      # 81.2
print(incomes.median())    # 45.5
print(incomes.max())       # 400

# A histogram of this column would show 9 values clustered
# in the 30-65 range and one lone bar out at 400 - an outlier
# a mean alone would never reveal.`,
    explanation:
      "The mean (81.2) sits *above every typical value* because one outlier (400) drags it up; the median (45.5) stays honest. The histogram makes the cause obvious in one glance — this single skewed-tail pattern explains why plotting beats trusting summary statistics.",
  },
  keyConcepts: [
    "Identical summary stats can hide wildly different data — plot first",
    "Histogram = one column, scatter = two, line = time, box = across categories",
    "Read shape, skew, outliers, and sentinel spikes off every histogram",
    "EDA is a workflow, not decoration: distributions → target balance → relationships",
  ],
  commonMistakes: [
    "Training a model on data nobody plotted — then debugging the data's problems through the model's weird behaviour.",
    "Using too few histogram bins, smoothing away bimodality and spikes; try a few bin counts.",
    "Deleting every outlier on sight — some are typos, some are the fraud cases you were hired to find.",
    "Publishing plots without axis labels; a plot that needs verbal explanation isn't finished.",
  ],
  tips: [
    "'You get a new dataset — what do you do first?' is a standard interview opener. An answer that includes inspecting shapes, plotting distributions, and checking class balance signals real practice.",
    "Say 'right-skewed: the long tail drags the mean above the median' about an income histogram and you've demonstrated distribution literacy in one sentence.",
  ],
  quiz: [
    {
      id: "viz-q1",
      type: "mcq",
      prompt: "You want to see whether house price rises with floor area. Which plot fits best?",
      options: ["Histogram", "Scatter plot", "Box plot", "Pie chart"],
      answerIndex: 1,
      explanation:
        "Two numeric variables, one dot per house — a scatter plot shows the relationship (and its outliers) directly. A histogram shows one variable; a box plot compares a distribution across categories.",
    },
    {
      id: "viz-q2",
      type: "truefalse",
      prompt: "If two datasets share the same mean and standard deviation, their histograms must look about the same.",
      answer: false,
      explanation:
        "Famous constructed examples share identical summary stats yet look completely different plotted — clusters, skew, and outliers are invisible to mean and std. That's the core argument for EDA.",
    },
    {
      id: "viz-q3",
      type: "fill",
      prompt: "In a box plot, the line inside the box marks the ____.",
      answers: ["median"],
      placeholder: "one word",
      explanation:
        "The box spans the middle 50% of values and the inner line is the median; points beyond the whiskers are flagged as potential outliers.",
    },
    {
      id: "viz-q4",
      type: "mcq",
      prompt: "A histogram of 'age' shows a normal-looking hump plus a huge isolated spike at exactly 999. Most likely explanation?",
      options: [
        "Many customers are 999 years old",
        "999 is a sentinel code used for missing ages",
        "The histogram function is broken",
        "The data is perfectly clean",
      ],
      answerIndex: 1,
      explanation:
        "Spikes at suspicious constants (0, -1, 999) usually encode 'missing' from an upstream system. Treat them as missing values — a data-quality find that summary statistics would have hidden inside a distorted mean.",
    },
  ],
  revision: [
    "Plot before modeling — summary statistics can hide clusters, skew, outliers, and sentinel codes.",
    "Four workhorses: histogram (one column), scatter (two), line (time), box (across categories).",
    "Read histograms for shape, skew (tail drags the mean), outliers, and suspicious spikes.",
    "EDA workflow: distributions of every feature → target balance → feature-vs-target relationships.",
  ],
};

// ── Lesson — Statistics & Probability Essentials ────────────────────────────
const statsProbability: Lesson = {
  id: "stats-probability-essentials",
  domain: "ai",
  moduleId: "ai-foundations",
  title: "Stats & Probability: The Minimum That Matters",
  objective:
    "Summarise data with the right statistic, reason about the normal distribution, apply core probability rules including Bayes' insight about base rates, and never confuse correlation with causation.",
  difficulty: "Beginner",
  estMinutes: 9,
  prerequisites: ["data-visualization"],
  tags: ["statistics", "probability", "bayes", "distributions", "correlation"],
  theory: `Machine learning is applied statistics with better marketing. You don't need a degree's worth — you need a handful of ideas used constantly, and the judgment to know which one a situation calls for.

### Centre and spread

- **Mean** — the balance point: sum divided by count. Uses every value, which is its strength *and* its weakness: one billionaire in the room drags the mean income into fantasy.
- **Median** — the middle value when sorted. Robust: that billionaire barely moves it. For skewed data (incomes, prices, response times), the median is usually the honest summary — you saw this exact effect in the last lesson's example.
- **Standard deviation (std)** — the typical distance of values from the mean. Small std: values huddle near the mean. Large std: they sprawl. Two datasets can share a mean and live completely different lives; std is the first number that tells you.

### The normal distribution

The bell curve appears everywhere because summing many small independent influences tends toward it (heights, measurement noise). For a roughly normal distribution, one rule earns its keep: about **68%** of values fall within 1 std of the mean, **95%** within 2, **99.7%** within 3. So a value 3+ standard deviations out is rare enough to investigate — that's the logic behind simple outlier detection, and the reason "how many stds from the mean?" (a z-score) is a universal ruler. But *check the histogram first*: incomes and prices are not normal, and the rule misleads on skewed data.

### Probability rules

Probability measures uncertainty from 0 (impossible) to 1 (certain). Three working rules:

- **Not-rule:** P(not A) = 1 − P(A). Often the easy route: P(at least one spam in 10 emails) = 1 − P(none are).
- **Or-rule** (mutually exclusive events): P(A or B) = P(A) + P(B).
- **And-rule** (independent events): P(A and B) = P(A) × P(B). *Independence is an assumption* — verify it before multiplying. Words in an email aren't independent, which is exactly the naive assumption "naive Bayes" makes (and gets away with surprisingly often).

### Conditional probability and Bayes' insight

**P(A | B)** — the probability of A *given* B is known — is the notation ML lives in: a spam classifier literally estimates P(spam | words).

The crucial trap: **P(A | B) ≠ P(B | A)**. A disease test that's 99% accurate does *not* mean a positive result implies 99% chance of disease. If only 1 in 1,000 people have the disease, then among 1,000 tested people you expect ~1 true positive and ~10 false positives — a positive result means roughly a 9% chance of disease. That's **Bayes' theorem** as intuition: *evidence updates your prior belief, but rare things stay fairly rare even after a positive test*. Base-rate neglect is one of the most common statistical errors in industry, and it will reappear when we study precision on imbalanced classes.

### Correlation ≠ causation

**Correlation** (−1 to +1) measures how strongly two variables move together *linearly*. It does not say one causes the other: ice-cream sales correlate with drowning deaths because summer drives both (a **confounder**). Models exploit correlation freely for prediction — that's fine — but the moment someone reads "feature X predicts churn" as "changing X will reduce churn", they've crossed from prediction into causation, and correlation alone cannot carry them there. Also: correlation near 0 only rules out *linear* relationships — a perfect U-shape scores ~0. Plot it.`,
  intuition:
    "Probability is a courtroom, and Bayes is the judge: the prior is how plausible the suspect was before any evidence, and each piece of evidence updates — but doesn't replace — that prior. A dramatic clue against a wildly implausible suspect still leaves them fairly implausible. Tests don't overrule base rates; they revise them.",
  definitions: [
    { term: "Median", meaning: "The middle value when sorted — robust to outliers, honest on skewed data." },
    { term: "Standard deviation", meaning: "Typical distance of values from the mean; the everyday measure of spread." },
    { term: "Conditional probability", meaning: "P(A | B): the probability of A once B is known — the form every classifier estimates." },
    { term: "Base rate", meaning: "How common something is before any evidence — the prior that Bayes says you must not ignore." },
    { term: "Confounder", meaning: "A hidden third variable driving two others, creating correlation without causation." },
  ],
  language: "python",
  syntax: `import numpy as np

x = np.array([12, 15, 14, 16, 13, 95])   # note the outlier
np.mean(x); np.median(x); np.std(x)
z = (x - x.mean()) / x.std()             # z-scores: stds from the mean
np.corrcoef(a, b)[0, 1]                  # correlation in [-1, 1]`,
  example: {
    language: "python",
    code: `# Bayes intuition by counting: disease hits 1 in 1000,
# test is 99% sensitive with a 1% false-positive rate.
population = 100_000
sick       = population // 1000          # 100 people
healthy    = population - sick           # 99,900

true_pos  = round(sick * 0.99)           # 99
false_pos = round(healthy * 0.01)        # 999

p_sick_given_pos = true_pos / (true_pos + false_pos)
print(true_pos, false_pos)               # 99 999
print(round(p_sick_given_pos, 3))        # 0.09`,
    explanation:
      "No formula needed — just count. False positives (999) swamp true positives (99) because healthy people vastly outnumber sick ones, so a positive result means only ~9% chance of disease. This 'count the population' trick makes any Bayes problem concrete, and it's the same arithmetic behind precision on imbalanced data.",
  },
  keyConcepts: [
    "Median for skewed data; mean is outlier-sensitive",
    "Std measures spread; 68–95–99.7 within 1–2–3 stds when roughly normal",
    "P(A | B) ≠ P(B | A): base rates dominate rare events",
    "Independence is an assumption you must justify before multiplying",
    "Correlation measures linear co-movement, never causation",
  ],
  commonMistakes: [
    "Reporting mean income (or mean latency) on skewed data — the median is the honest summary.",
    "Reading a 99%-accurate test as '99% chance you have it' — base-rate neglect, the classic Bayes trap.",
    "Multiplying probabilities of events that aren't independent, silently overstating confidence.",
    "Declaring 'no relationship' from correlation ≈ 0 — a U-shaped relationship scores near zero; plot it.",
  ],
  tips: [
    "'Mean vs median — when does each mislead?' is a favourite analytics screen; answer with the skew/outlier story and you're done in two sentences.",
    "For any conditional-probability interview question, convert to counts over an imaginary population of 100,000 — it collapses Bayes into arithmetic under pressure.",
    "'Give an example of correlation without causation' — have one confounder story ready (ice cream and drowning, both driven by summer).",
  ],
  quiz: [
    {
      id: "stats-q1",
      type: "output",
      prompt: "What does this print?",
      language: "python",
      code: `import numpy as np
x = np.array([2, 4, 6, 100])
print(np.median(x))`,
      answers: ["5.0", "5"],
      explanation:
        "With an even count, the median averages the two middle values: (4 + 6) / 2 = 5.0. The outlier 100 doesn't move it — while the mean would be 28.",
    },
    {
      id: "stats-q2",
      type: "mcq",
      prompt: "A disease affects 1 in 1,000 people. A test catches 99% of cases but has a 1% false-positive rate. Someone tests positive. Roughly what's the chance they're actually sick?",
      options: ["~99%", "~50%", "~9%", "~1%"],
      answerIndex: 2,
      explanation:
        "Per 100,000 people: ~99 true positives vs ~999 false positives, so 99 / 1098 ≈ 9%. The rarity of the disease (the base rate) dominates the test's accuracy — the essence of Bayes.",
    },
    {
      id: "stats-q3",
      type: "truefalse",
      prompt: "A strong correlation between two variables is good evidence that one causes the other.",
      answer: false,
      explanation:
        "Correlation only measures co-movement. A confounder can drive both (summer → ice cream sales *and* drownings), or the causation may run the other way. Prediction can use correlation; causal claims need more.",
    },
    {
      id: "stats-q4",
      type: "fill",
      prompt: "For a roughly normal distribution, about ____% of values fall within 2 standard deviations of the mean.",
      answers: ["95"],
      placeholder: "a number",
      explanation:
        "The 68–95–99.7 rule: ~68% within 1 std, ~95% within 2, ~99.7% within 3. It's the basis of z-score outlier checks — valid only when the data is roughly normal.",
    },
  ],
  revision: [
    "Mean balances all values but bends to outliers; median resists them — prefer it for skewed data.",
    "Std measures spread; for roughly normal data, ~68/95/99.7% of values sit within 1/2/3 stds.",
    "Bayes: a positive test updates the base rate, it doesn't replace it — count a population to see it.",
    "Correlation measures linear co-movement only; confounders manufacture correlation without causation.",
  ],
};

// ── Lesson — Linear Algebra Intuition ───────────────────────────────────────
const linearAlgebraIntuition: Lesson = {
  id: "linear-algebra-intuition",
  domain: "ai",
  moduleId: "ai-foundations",
  title: "Linear Algebra Without Tears",
  objective:
    "Build the three geometric intuitions ML runs on — vectors as data points, dot products as similarity, matrices as transformations applied to whole batches — and see why 'ML is matrix multiplication' is barely an exaggeration.",
  difficulty: "Beginner",
  estMinutes: 8,
  prerequisites: ["stats-probability-essentials"],
  tags: ["linear-algebra", "vectors", "dot-product", "matrices"],
  theory: `Linear algebra has a reputation as ML's scariest prerequisite. Here's the secret: for practical ML you need surprisingly little of it — three intuitions, held firmly, unlock nearly everything you'll meet.

### Intuition 1: a vector is a data point

Forget arrows for a moment. In ML, a **vector** is simply *one example written as a list of numbers*: a customer as \`[age, income, visits] = [34, 62, 8]\` is a vector — one point in 3-dimensional "customer space". Every feature adds a dimension; a 100-feature dataset lives in 100-dimensional space. You can't picture that, and you don't need to: the payoff is that **similar examples are nearby points**. "Find customers like this one" becomes "find nearby vectors" — a geometry problem — and that single reframing powers kNN, clustering, and the embedding search behind modern recommendation and retrieval systems.

### Intuition 2: the dot product measures alignment

The **dot product** multiplies two vectors element-by-element and sums:

\`[1, 2] · [3, 4] = 1×3 + 2×4 = 11\`

Geometrically it scores *alignment*: large and positive when vectors point the same way, near zero when unrelated (perpendicular), negative when opposed. Normalise for length and you get **cosine similarity** — the standard "how alike are these two things?" score for documents and embeddings.

The dot product is also **the atom of prediction**. A linear model's output is literally \`features · weights\` — each feature multiplied by how much the model cares about it, summed. When you meet neural networks, every neuron computes exactly this: a dot product, plus a bias, through a nonlinearity. Attention in transformers? Dot products between query and key vectors. One operation, everywhere.

### Intuition 3: a matrix is a transformation — and a batch

A **matrix** is a grid of numbers with two useful readings:

- **As data:** each row is one example-vector. A dataset of 1,000 customers × 3 features is a (1000, 3) matrix — the \`X\` you've been passing around since NumPy.
- **As a transformation:** multiplying by a matrix *moves points* — rotating, stretching, projecting space. A model's weight matrix is a learned transformation that relocates inputs so the answer becomes easy to read off (e.g. spam and not-spam land on opposite sides of a line).

Matrix multiplication's shape rule: \`(n, k) @ (k, m) → (n, m)\` — inner dimensions must match, and each output cell is a dot product between a row of the left matrix and a column of the right.

### Why ML *is* matrix multiplication

Now compose the intuitions. Want to run a linear model on 1,000 customers? Don't loop — multiply: \`X @ w\` computes 1,000 dot products in one operation, one prediction per row. A neural network layer is \`X @ W\` with a (features, neurons) weight matrix — *every example against every neuron* in a single multiplication. Stack layers and a full network forward pass is essentially a chain of matrix multiplications. This is why GPUs — machines built to multiply matrices very fast — became the engine of the AI era, and why the vectorization habit from the NumPy lesson wasn't a style preference but the fundamental shape of the field: **data as matrices, models as transformations, learning as tuning the transformation**.`,
  intuition:
    "Think of a matrix as a machine that relocates every point in space at once — stretch here, rotate there. Training a model is adjusting that machine's dials (its numbers) until, after the move, the answer is trivial to read off: spam on the left, not-spam on the right. Prediction is running new points through the settled machine.",
  definitions: [
    { term: "Vector", meaning: "One example as an ordered list of numbers — a point in feature space." },
    { term: "Dot product", meaning: "Element-wise multiply then sum; scores how aligned two vectors are, and computes a linear prediction." },
    { term: "Cosine similarity", meaning: "The dot product of length-normalised vectors — the standard 'how alike?' score for embeddings." },
    { term: "Matrix", meaning: "A number grid: rows-as-examples (data) or a learned transformation of space (model weights)." },
    { term: "Matrix multiplication", meaning: "(n, k) @ (k, m) → (n, m); every output cell is a row·column dot product." },
  ],
  language: "python",
  syntax: `import numpy as np

v = np.array([1, 2]); w = np.array([3, 4])
v @ w                    # dot product: 1*3 + 2*4 = 11

X = np.random.rand(1000, 3)   # 1000 examples, 3 features
weights = np.array([0.5, 1.2, -0.3])
X @ weights              # 1000 predictions in ONE operation`,
  example: {
    language: "python",
    code: `import numpy as np

# 3 customers x 2 features: [monthly_visits, avg_spend]
X = np.array([[10, 200],
              [ 2,  30],
              [ 8, 150]])

w = np.array([2.0, 0.1])   # learned weights: visits matter 2x/unit

scores = X @ w             # one dot product per row
print(scores)              # [40.  7. 31.]
print(X.shape, "->", scores.shape)   # (3, 2) -> (3,)`,
    explanation:
      "`X @ w` computes `2*visits + 0.1*spend` for all three customers in one multiplication — row 0 gives 2×10 + 0.1×200 = 40. Shapes tell the story: (3, 2) @ (2,) → (3,) — one score per example. Scale this to a million rows and a thousand neurons and it's still one line — that's a neural network layer.",
  },
  keyConcepts: [
    "A vector is one example; similar examples are nearby points",
    "Dot product = alignment score = the atom of every linear prediction",
    "A matrix is both a batch of examples and a transformation of space",
    "X @ w predicts for every row at once — layers are matrix multiplications",
    "Shape rule: (n, k) @ (k, m) → (n, m), inner dims must match",
  ],
  commonMistakes: [
    "Trying to visualise 100-dimensional space instead of trusting the algebra — 'nearby means similar' is all the geometry you need.",
    "Using `*` (element-wise) when you mean `@` (matrix multiply) in NumPy — different operations, sometimes silently 'working' via broadcasting.",
    "Ignoring the shape rule and hitting 'shapes not aligned' errors — check inner dimensions match before multiplying.",
    "Comparing raw dot products between vectors of very different lengths — normalise (cosine similarity) when only direction should matter.",
  ],
  tips: [
    "'What does a dot product represent?' comes up in ML interviews — answer 'an alignment/similarity score, and the core of a linear prediction' and connect it to cosine similarity for bonus depth.",
    "'Why do GPUs matter for ML?' — because forward and backward passes are chains of matrix multiplications, which GPUs parallelise massively.",
    "When any ML code confuses you, annotate every array with its shape — (samples, features) @ (features, outputs) reads like a sentence.",
  ],
  quiz: [
    {
      id: "linalg-q1",
      type: "output",
      prompt: "What does this print?",
      language: "python",
      code: `import numpy as np
a = np.array([1, 2])
b = np.array([3, 4])
print(a @ b)`,
      answers: ["11"],
      explanation:
        "The dot product multiplies element-wise then sums: 1×3 + 2×4 = 11. Positive and fairly large here — the vectors point in broadly the same direction.",
    },
    {
      id: "linalg-q2",
      type: "mcq",
      prompt: "`X` has shape (500, 20) — 500 examples, 20 features. To get one prediction per example from `X @ w`, what shape must `w` have?",
      options: ["(500,)", "(20,)", "(500, 20)", "(1, 500)"],
      answerIndex: 1,
      explanation:
        "The inner dimensions must match: (500, 20) @ (20,) → (500,) — one dot product per row, i.e. one prediction per example. A (500,)-shaped `w` would fail: 20 ≠ 500.",
    },
    {
      id: "linalg-q3",
      type: "truefalse",
      prompt: "A dot product near zero means the two vectors are strongly opposed.",
      answer: false,
      explanation:
        "Near zero means roughly *perpendicular* — unrelated directions. Strong opposition gives a large *negative* dot product; strong alignment gives a large positive one.",
    },
    {
      id: "linalg-q4",
      type: "fill",
      prompt: "The dot product of two length-normalised vectors is called ____ similarity.",
      answers: ["cosine"],
      placeholder: "one word",
      explanation:
        "Cosine similarity removes length so only direction matters — the standard way to score how alike two embeddings or documents are.",
    },
  ],
  revision: [
    "A vector is one example as numbers; 'similar' means 'nearby' in feature space.",
    "Dot product = element-wise multiply and sum — an alignment score and the core of linear prediction.",
    "A matrix is a batch of examples (rows) or a learned transformation of space (weights).",
    "X @ w predicts for every example at once; neural layers chain such multiplications — hence GPUs.",
  ],
};

/** Six lessons appended to the ai-foundations module after
 *  "what-is-machine-learning". */
export const FOUNDATIONS_EXTRA: Lesson[] = [
  pythonForAi,
  numpyFundamentals,
  pandasFundamentals,
  dataVisualization,
  statsProbability,
  linearAlgebraIntuition,
];
