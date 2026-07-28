// ────────────────────────────────────────────────────────────────────────────
//  Machine Learning Core — module 2 of the AI domain. From fitting a line to a
//  complete scikit-learn workflow: regression, classification, generalisation,
//  metrics, features, unsupervised learning, pipelines. Original prose;
//  scikit-learn / fast.ai docs informed scope only, never text.
// ────────────────────────────────────────────────────────────────────────────
import type { Module, Lesson } from "../types";

// ── Lesson — Linear Regression ──────────────────────────────────────────────
const linearRegression: Lesson = {
  id: "linear-regression",
  domain: "ai",
  moduleId: "ai-ml-core",
  title: "Linear Regression: Your First Learned Model",
  objective:
    "Understand how a model fits a line to data — what the MSE loss measures, how gradient descent walks downhill to minimise it, and how to read the learned weights.",
  difficulty: "Beginner",
  estMinutes: 9,
  prerequisites: ["linear-algebra-intuition"],
  tags: ["linear-regression", "mse", "gradient-descent", "supervised-learning"],
  theory: `Linear regression is where "learning a function from examples" stops being a slogan and becomes something you can watch happen. The model is deliberately humble — a straight line — which makes every part of the machinery visible.

### The model: a line with dials

Predicting house price from size, the model is:

\`price = w × size + b\`

Two numbers to learn: the **weight** \`w\` (how much each extra square metre adds) and the **bias** \`b\` (the baseline when size is 0). With several features it becomes \`y = w₁x₁ + w₂x₂ + ... + b\` — exactly the dot product \`x · w + b\` from the linear algebra lesson. "Training" means: find the dial settings that make predictions match the examples.

### The loss: scoring how wrong we are

To *search* for good dials we need a single number measuring badness. **Mean Squared Error (MSE)** is the workhorse: for each example take (prediction − actual), square it, average over the dataset. Squaring does two jobs — it makes under- and over-shooting equally bad, and it punishes large misses disproportionately (an error of 10 costs 100, an error of 1 costs 1). A loss turns "fit the data" into a concrete goal: *find w and b that minimise MSE*.

### Gradient descent: rolling downhill

Picture the loss as a landscape — one axis per parameter, height = MSE. Somewhere in that landscape is a lowest valley: the best line. **Gradient descent** finds it without ever seeing a map:

1. Start with random \`w\` and \`b\` (a random spot on the landscape).
2. Feel the local slope (the **gradient** — calculus computes it, but *direction of steepest increase* is all it means).
3. Step **opposite** the slope — downhill.
4. Repeat until the ground flattens.

The step size is the **learning rate**. Too small: training crawls. Too large: you leap across the valley and can bounce forever — training diverges. This tune-it-yourself knob is your first **hyperparameter**: a setting *you* choose, unlike parameters the model learns.

The remarkable part: this same loop — predict, measure loss, nudge parameters downhill — trains everything from this two-dial line to billion-parameter neural networks. Learn it here, on a model small enough to see, and you've learned the training loop of all of deep learning.

### Reading the weights

After fitting, the weights *say something*: \`w = 5200\` means "each extra square metre adds about ₹5,200, other features held fixed". Two honest cautions. First, weights are only comparable when features share a scale — a weight on "square metres" and one on "number of rooms" live in different units (the feature-engineering lesson fixes this with scaling). Second, a weight describes *association within this dataset*, not causation — the correlation lesson's warning applies to models too.

### Where the line runs out

A line can only express "more of x → proportionally more of y". Curved or interacting patterns **underfit** a linear model — it's too simple to capture them. That tension between too-simple and too-flexible is the subject of the pivotal lesson two steps ahead.`,
  intuition:
    "Fitting by gradient descent is finding the lowest point of a foggy valley at night with a torch that only shows the slope under your feet: check the tilt, step downhill, repeat. The learning rate is your stride — tiny steps take all night; giant leaps overshoot the bottom and land you on the far wall.",
  definitions: [
    { term: "Weight", meaning: "A learned number scaling one feature's contribution to the prediction." },
    { term: "Bias (intercept)", meaning: "The learned baseline prediction when all features are zero." },
    { term: "MSE", meaning: "Mean Squared Error — average of squared prediction errors; the loss linear regression minimises." },
    { term: "Gradient descent", meaning: "Iteratively stepping parameters opposite the loss's slope to walk downhill." },
    { term: "Learning rate", meaning: "The step size of gradient descent — a hyperparameter you choose, not learn." },
  ],
  language: "python",
  syntax: `from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)     # gradient-free solver, same objective: min MSE
model.predict(X_new)
model.coef_, model.intercept_   # the learned w and b`,
  example: {
    language: "python",
    code: `import numpy as np
from sklearn.linear_model import LinearRegression

# size (sq m) -> price (lakh) for five houses
X = np.array([[50], [60], [80], [100], [120]])
y = np.array([55, 63, 82, 101, 118])

model = LinearRegression()
model.fit(X, y)

print(round(model.coef_[0], 2))       # 0.9
print(round(model.intercept_, 1))     # 10.2
print(model.predict([[90]]).round(1)) # [91.4]`,
    explanation:
      "The fitted line is roughly `price = 0.9 × size + 10.2`: each square metre adds ~0.9 lakh over a ~10-lakh baseline. Prediction is just evaluating that line at size 90. (For a problem this small sklearn solves the MSE minimum directly; gradient descent reaches the same valley step by step.)",
  },
  keyConcepts: [
    "Model = line (dot product + bias); training tunes w and b",
    "MSE turns 'fit the data' into a number to minimise",
    "Gradient descent: feel the slope, step downhill, repeat",
    "Learning rate too big diverges, too small crawls",
    "Weights read as 'change in y per unit of x' — association, not causation",
  ],
  commonMistakes: [
    "Comparing raw weight sizes across unscaled features to judge importance — units differ, so magnitudes aren't comparable.",
    "Cranking the learning rate to 'train faster' and watching the loss explode instead of shrink.",
    "Reading a fitted weight as a causal effect — it's an association within this dataset.",
    "Forcing a line onto obviously curved data and concluding 'ML doesn't work' — that's underfitting, not failure.",
  ],
  tips: [
    "'Explain gradient descent to a non-technical person' is a stock interview task — the foggy-valley story with learning-rate-as-stride covers it in four sentences.",
    "Know *why* errors are squared in MSE: sign-free penalties and disproportionate punishment of large misses. 'Why not absolute error?' is the classic follow-up (squares are smooth to differentiate; absolute error is robust to outliers).",
    "Name the distinction crisply: parameters are learned (w, b); hyperparameters are chosen (learning rate). Interviewers listen for it.",
  ],
  quiz: [
    {
      id: "linreg-q1",
      type: "mcq",
      prompt: "In gradient descent, what does the learning rate control?",
      options: [
        "How many features the model uses",
        "The size of each parameter update step",
        "The number of training examples",
        "The final value of the loss",
      ],
      answerIndex: 1,
      explanation:
        "The gradient gives the direction; the learning rate scales how far you step in it. Too large overshoots the minimum and can diverge; too small makes training painfully slow.",
    },
    {
      id: "linreg-q2",
      type: "output",
      prompt: "Predictions `[3, 5]`, actual values `[1, 5]`. What does this print?",
      language: "python",
      code: `pred   = [3, 5]
actual = [1, 5]
errors = [(p - a) ** 2 for p, a in zip(pred, actual)]
print(sum(errors) / len(errors))`,
      answers: ["2.0", "2"],
      explanation:
        "Squared errors are (3−1)² = 4 and (5−5)² = 0; their mean is 2.0. That's MSE computed by hand — the exact number training tries to shrink.",
    },
    {
      id: "linreg-q3",
      type: "truefalse",
      prompt: "A very large learning rate guarantees gradient descent reaches the minimum faster.",
      answer: false,
      explanation:
        "Past a point, big steps leap over the valley — the loss oscillates or grows and training diverges. Learning rate is a balance, not a throttle.",
    },
    {
      id: "linreg-q4",
      type: "fill",
      prompt: "Settings you choose before training (like the learning rate), rather than values the model learns, are called ____.",
      answers: ["hyperparameters", "a hyperparameter", "hyperparameter"],
      placeholder: "one word",
      explanation:
        "Parameters (w, b) are learned from data; hyperparameters (learning rate, tree depth, k) are chosen by you — typically tuned on a validation set, as the overfitting lesson shows.",
    },
  ],
  revision: [
    "Linear regression predicts with a weighted sum plus bias — a dot product with learned dials.",
    "MSE averages squared errors, punishing large misses hardest; training minimises it.",
    "Gradient descent repeats: measure slope, step downhill by the learning rate.",
    "The same predict → loss → nudge loop trains everything up to deep networks.",
  ],
};

// ── Lesson — Classification Basics ──────────────────────────────────────────
const classificationBasics: Lesson = {
  id: "classification-basics",
  domain: "ai",
  moduleId: "ai-ml-core",
  title: "Classification: Boundaries, Neighbors & Trees",
  objective:
    "Understand classification as drawing decision boundaries, and compare three fundamentally different ways to draw them: logistic regression, k-nearest neighbors, and decision trees.",
  difficulty: "Beginner",
  estMinutes: 9,
  prerequisites: ["linear-regression"],
  tags: ["classification", "logistic-regression", "knn", "decision-trees"],
  theory: `Regression predicts a number; **classification** predicts a category — spam or not, churn or stay, which digit. Geometrically, every classifier does one thing: it carves feature space into regions, one per class. The line (or surface) between regions is the **decision boundary**, and the character of each algorithm is *how it draws that boundary*.

### Logistic regression: a straight boundary with confidence

Despite the name, logistic regression is a classifier. It computes the familiar weighted sum \`x · w + b\`, then squashes it through the **sigmoid** function — an S-shaped curve mapping any number into (0, 1) — so the output reads as a probability: "0.93 spam". Predict the class where the probability crosses 0.5; that threshold traces a **straight-line boundary** through feature space.

Strengths: fast, stable, and the probabilities let downstream logic say "only act when > 0.9 confident". The weights remain readable, just like linear regression's. Limit: one straight cut. If the classes interleave in curves or islands, a line can't separate them.

### k-Nearest Neighbors: no model, just memory

**kNN** barely trains at all — it memorises the data. To classify a new point: find the \`k\` closest training points (nearby vectors — the linear algebra lesson's payoff) and take a majority vote. The boundary is implicit and can be *any* wiggly shape the data implies.

The knob \`k\` sets the smoothness: \`k=1\` lets a single noisy point claim territory (a jagged boundary); large \`k\` smooths toward the majority class everywhere. Two practical costs: prediction is slow at scale (it searches the whole training set per query), and distances are only meaningful when features share a scale — a "salary in rupees" axis will drown an "age in years" axis (fixed in the feature-engineering lesson).

### Decision trees: a flowchart of questions

A **decision tree** asks a sequence of yes/no questions — "size > 80? then: locality = urban?" — chosen greedily so each split best separates the classes. Prediction walks the flowchart to a leaf. Boundaries are axis-aligned rectangles: every question slices space parallel to an axis.

Strengths: readable by humans ("why was this rejected?" has a literal answer path), no scaling needed, handles mixed feature types naturally. Weakness: grown deep enough, a tree happily asks absurdly specific questions that memorise the training data — the single most vivid overfitter you'll meet, and the perfect villain for the next lesson.

### Choosing between them

- **Boundary shape:** logistic = straight; kNN = arbitrarily wiggly; tree = rectangles.
- **Explainability:** tree (a path) > logistic (weights) > kNN ("your neighbors voted").
- **Prediction cost:** logistic and tree are fast; kNN pays at query time.
- **Preprocessing:** kNN and logistic want scaled features; trees don't care.

Interviews rarely ask you to derive these models — they ask you to *choose sensibly and justify it*. "I'd baseline with logistic regression, then try a tree if I suspect non-linear structure or need explainability" is a genuinely good answer.`,
  intuition:
    "Three doctors diagnosing the same patient: the logistic doctor computes one weighted score from all symptoms and applies a cutoff; the kNN doctor recalls the k most similar past patients and goes with what they had; the tree doctor runs a fixed triage flowchart — 'fever? then: rash?' Same question, three completely different reasoning styles.",
  definitions: [
    { term: "Decision boundary", meaning: "The surface in feature space where a classifier's predicted class changes." },
    { term: "Sigmoid", meaning: "The S-shaped squash mapping any real number into (0, 1) so it reads as a probability." },
    { term: "kNN", meaning: "Classify by majority vote of the k nearest training points; k controls boundary smoothness." },
    { term: "Decision tree", meaning: "A learned flowchart of feature questions; each leaf holds a predicted class." },
  ],
  language: "python",
  syntax: `from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier

# same API, three different boundary styles
LogisticRegression().fit(X_train, y_train)
KNeighborsClassifier(n_neighbors=5).fit(X_train, y_train)
DecisionTreeClassifier(max_depth=3).fit(X_train, y_train)`,
  example: {
    language: "python",
    code: `import numpy as np
from sklearn.linear_model import LogisticRegression

# [hours_studied, classes_missed] -> passed (1) / failed (0)
X = np.array([[9, 0], [8, 2], [7, 1], [2, 8], [1, 9], [3, 7]])
y = np.array([1, 1, 1, 0, 0, 0])

clf = LogisticRegression().fit(X, y)

print(clf.predict([[6, 3]]))                  # [1]
proba = clf.predict_proba([[6, 3]])[0, 1]
print(round(float(proba), 2))                 # 0.92`,
    explanation:
      "`predict` returns the class; `predict_proba` exposes the sigmoid's confidence — this student passes with probability ~0.92. That probability is the practical edge of logistic regression: a product can act only above a chosen confidence instead of trusting every hard 0/1 call.",
  },
  keyConcepts: [
    "Classification = carving feature space into class regions",
    "Logistic regression: linear score → sigmoid → probability, straight boundary",
    "kNN: vote of the k nearest points; k trades jaggedness for smoothness",
    "Trees: greedy yes/no questions, rectangular regions, human-readable paths",
    "Model choice = boundary shape + explainability + prediction cost",
  ],
  commonMistakes: [
    "Assuming logistic regression is a regression because of its name — it's the go-to baseline classifier.",
    "Running kNN on unscaled features, letting the largest-unit feature dominate every distance.",
    "Letting a decision tree grow unbounded and celebrating its 100% training accuracy — that's memorisation.",
    "Ignoring predicted probabilities and using only hard labels when the product needs confidence levels.",
  ],
  tips: [
    "'Why is logistic regression a classification algorithm?' is a real screen — answer: it models the *probability* of a class via sigmoid, thresholded into a decision.",
    "Comparing two models you'd try on a new tabular problem is a favourite open-ended question: 'logistic baseline first, tree/ensemble next' plus *reasons* beats naming a fancy architecture.",
    "Know one concrete effect of k in kNN: k=1 memorises noise; very large k predicts the majority class everywhere.",
  ],
  quiz: [
    {
      id: "clf-q1",
      type: "mcq",
      prompt: "What does the sigmoid function contribute to logistic regression?",
      options: [
        "It speeds up training",
        "It maps the weighted sum into (0, 1) so it reads as a probability",
        "It selects which features matter",
        "It makes the decision boundary curved",
      ],
      answerIndex: 1,
      explanation:
        "The linear score x·w + b can be any number; the sigmoid squashes it into (0, 1), giving an interpretable probability. The boundary (where p = 0.5) is still a straight line.",
    },
    {
      id: "clf-q2",
      type: "output",
      prompt: "A new point's 5 nearest neighbors have these labels. What does this print?",
      language: "python",
      code: `neighbors = [1, 0, 1, 1, 0]
votes_for_1 = sum(neighbors)
print(1 if votes_for_1 > len(neighbors) / 2 else 0)`,
      answers: ["1"],
      explanation:
        "Three of five neighbors are class 1, so 3 > 2.5 and the majority vote predicts 1. That's the entire kNN prediction rule.",
    },
    {
      id: "clf-q3",
      type: "truefalse",
      prompt: "In kNN, using k=1 generally gives a smoother, more reliable decision boundary than k=15.",
      answer: false,
      explanation:
        "k=1 lets every single training point — including noise — claim its own region, producing a jagged, overfit boundary. Larger k averages over more neighbors and smooths it.",
    },
    {
      id: "clf-q4",
      type: "mcq",
      prompt: "A regulator requires a plain-language explanation for every loan rejection. Which model makes that easiest?",
      options: [
        "A shallow decision tree",
        "kNN with k=50",
        "A deep neural network",
        "None — models can't be explained",
      ],
      answerIndex: 0,
      explanation:
        "A tree rejection is literally a path of readable conditions ('income < X and history < Y'). Logistic weights are interpretable too, but a shallow tree gives the most direct case-by-case story.",
    },
  ],
  revision: [
    "Every classifier carves feature space; the boundary between regions defines its behaviour.",
    "Logistic regression: weighted sum → sigmoid → probability; straight boundary, readable weights.",
    "kNN votes among the k nearest points — flexible boundary, needs scaling, slow at query time.",
    "Trees ask greedy yes/no questions — explainable, scale-free, but memorise if grown deep.",
  ],
};

// ── Lesson — Train/Test Splits & Overfitting ────────────────────────────────
const trainTestOverfitting: Lesson = {
  id: "train-test-overfitting",
  domain: "ai",
  moduleId: "ai-ml-core",
  title: "Overfitting & the Train/Val/Test Discipline",
  objective:
    "Master the single most interview-tested idea in ML: why models must be judged on unseen data, how to diagnose overfitting vs underfitting, and how validation sets and cross-validation keep your evaluation honest.",
  difficulty: "Intermediate",
  estMinutes: 10,
  prerequisites: ["classification-basics"],
  tags: ["overfitting", "generalization", "train-test-split", "cross-validation", "bias-variance"],
  theory: `If you retain one lesson from this module, make it this one. More real-world ML failures — and more failed interviews — trace to this topic than any other.

### The exam you've already seen

Score a model on the data it trained on and you're grading a student on the *exact* questions they studied, answers included. A deep decision tree can hit 100% training accuracy by pure memorisation and be useless tomorrow. The only score that matters is on **unseen data** — that's **generalisation**, and every practice in this lesson exists to measure it honestly.

### Overfitting vs underfitting

- **Underfitting** — the model is too simple for the pattern. A straight line through curved data. Symptom: *poor training accuracy* (it can't even fit what it saw). Fix: more capacity, better features, longer training.
- **Overfitting** — the model is so flexible it learns the noise along with the signal. Symptom: the diagnostic gap — *excellent training accuracy, much worse test accuracy* (say 99% vs 71%). Fix: simplify (shallower tree, regularisation), get more data, or stop training earlier.

Always diagnose by **comparing the two scores**. Both low → underfitting. Big gap → overfitting. Both good and close → you're in the healthy zone.

### Bias and variance: the same idea, formal names

**Bias** is error from being too rigid — the model's assumptions can't express the truth (underfitting). **Variance** is error from being too sensitive — retrain on a slightly different sample and the model changes wildly because it's tracking noise (overfitting). Adding capacity lowers bias but raises variance; the art is the sweet spot between them. When an interviewer says "explain the bias-variance tradeoff", they're asking for exactly this — simple-and-stable versus flexible-and-twitchy — not a formula.

### Train, validation, test: three jobs, three sets

Splitting once into train/test has a subtle leak. You'll try many models and hyperparameter settings, keeping whichever scores best on the test set — so you're *tuning on the test set*, and its score quietly inflates. The fix is three sets:

- **Training set** (~60–80%) — fit parameters.
- **Validation set** — compare models and tune hyperparameters. Gets looked at many times, so it slowly loses neutrality.
- **Test set** — locked in a drawer until the very end. Used **once**, for the final honest number.

The principle underneath: *any data that influenced any decision is no longer neutral for evaluation.*

### Cross-validation: when data is scarce

Carving three static sets out of a small dataset wastes precious examples, and a single small validation set gives a noisy score. **k-fold cross-validation** fixes both: split the training data into k folds (commonly 5), train on k−1 and validate on the held-out fold, rotate so every fold validates once, and average the k scores. You get a more stable estimate — plus a spread that tells you how sensitive the model is — at the cost of training k times. Standard practice: cross-validate for model selection, then confirm the final choice once on the untouched test set.

### Two ground rules

Shuffle before splitting (data sorted by date or class gives absurd splits — though for *forecasting*, split by time instead, or you'll train on the future). And never let information from validation or test leak into training decisions — the feature-engineering lesson shows how easily this happens through preprocessing.`,
  intuition:
    "A student who memorises past papers aces every mock exam (training data) and collapses in the real exam hall (unseen data). A student who never studied fails both. The one who learned the *concepts* scores well on each — and the only way to tell the three apart is an exam with questions none of them has seen.",
  definitions: [
    { term: "Generalisation", meaning: "Performance on data the model never saw — the only score that ultimately matters." },
    { term: "Overfitting", meaning: "Learning noise along with signal: excellent training score, much worse unseen-data score." },
    { term: "Underfitting", meaning: "A model too simple to capture the pattern — poor even on its own training data." },
    { term: "Validation set", meaning: "Held-out data for comparing models and tuning hyperparameters, keeping the test set untouched." },
    { term: "k-fold cross-validation", meaning: "Rotate a held-out fold k times and average the scores — stable evaluation from limited data." },
  ],
  language: "python",
  syntax: `from sklearn.model_selection import train_test_split, cross_val_score

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)   # shuffle + hold out 20%

scores = cross_val_score(model, X_train, y_train, cv=5)
scores.mean(), scores.std()                  # stable estimate + spread`,
  example: {
    language: "python",
    code: `from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

X, y = make_classification(n_samples=400, n_features=20,
                           n_informative=4, random_state=0)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3,
                                          random_state=0)

deep    = DecisionTreeClassifier(random_state=0).fit(X_tr, y_tr)
shallow = DecisionTreeClassifier(max_depth=3,
                                 random_state=0).fit(X_tr, y_tr)

print(deep.score(X_tr, y_tr), round(deep.score(X_te, y_te), 2))
# 1.0 0.8
print(round(shallow.score(X_tr, y_tr), 2),
      round(shallow.score(X_te, y_te), 2))
# 0.92 0.87`,
    explanation:
      "The unlimited tree memorises training data perfectly (1.0) yet drops to 0.8 on unseen data — a textbook overfitting gap. Capping depth *lowers* the training score to 0.92 but *raises* the test score to 0.87. A worse-looking model on training data is genuinely better — the whole lesson in four numbers.",
  },
  visual: {
    kind: "mermaid",
    caption: "Each dataset split has exactly one job — and the test set is opened once.",
    src: `flowchart TD
    D[Full dataset - shuffled] --> TR[Training set]
    D --> VA[Validation set]
    D --> TE[Test set - locked away]
    TR -->|fit parameters| M[Candidate models]
    VA -->|compare & tune<br/>hyperparameters| M
    M -->|final model chosen| F[Final model]
    TE -->|evaluated ONCE| F
    F --> R[Honest generalisation estimate]`,
  },
  keyConcepts: [
    "Judge models only on unseen data — training accuracy is not evidence",
    "Underfit: both scores poor; overfit: large train→test gap",
    "Bias = too rigid, variance = too twitchy; capacity trades one for the other",
    "Train fits, validation tunes, test is used once at the end",
    "Cross-validation averages k rotated folds for a stable estimate",
  ],
  commonMistakes: [
    "Reporting training accuracy as model performance — the original sin of ML evaluation.",
    "Tuning hyperparameters against the test set, then reporting that same test score as 'unseen' performance.",
    "Forgetting to shuffle before splitting sorted data — or shuffling *time-series* data, letting the model train on the future.",
    "Reacting to overfitting by training even longer or adding capacity — the gap needs simplification, regularisation, or more data.",
  ],
  tips: [
    "'Explain overfitting' is arguably the most common ML interview question, at every level. Strongest shape: definition (learning noise), the diagnostic (train/test gap, with example numbers), two fixes (simplify/regularise, more data), and the memorising-student analogy.",
    "'Why do you need a validation set *and* a test set?' — because whatever you tune on gets burned; the test set stays honest only if it's opened once.",
    "'What is the bias-variance tradeoff?' — answer in behaviours (too-rigid vs noise-tracking) before any math; follow with how model capacity moves you along it.",
  ],
  quiz: [
    {
      id: "ttv-q1",
      type: "mcq",
      prompt: "A model scores 99% on training data and 68% on test data. What's happening?",
      options: [
        "Underfitting — the model is too simple",
        "Overfitting — it memorised training noise instead of the pattern",
        "Healthy fit — 99% is excellent",
        "The test set must be corrupted",
      ],
      answerIndex: 1,
      explanation:
        "A large train→test gap is the overfitting signature: near-perfect on seen data, weak on unseen. Underfitting would show *both* scores poor. Fixes: simplify/regularise the model or get more data.",
    },
    {
      id: "ttv-q2",
      type: "mcq",
      prompt: "Why keep a validation set separate from the test set?",
      options: [
        "Validation data is lower quality",
        "It makes training faster",
        "Repeatedly tuning against a dataset makes its score optimistic — the test set stays honest only if used once at the end",
        "scikit-learn requires three sets",
      ],
      answerIndex: 2,
      explanation:
        "Every 'keep whichever scores best' decision fits your choices to that dataset a little. Burn the validation set on tuning; open the test set once for the final unbiased number.",
    },
    {
      id: "ttv-q3",
      type: "truefalse",
      prompt: "In 5-fold cross-validation, each fold serves as the validation set exactly once.",
      answer: true,
      explanation:
        "The folds rotate: train on 4, validate on the held-out 1, repeat five times, average. Every example is validated on exactly once, giving a stabler estimate than one small fixed split.",
    },
    {
      id: "ttv-q4",
      type: "fill",
      prompt: "Error from a model being too rigid to capture the pattern is called high ____; error from being so flexible it tracks noise is high variance.",
      answers: ["bias"],
      placeholder: "one word",
      explanation:
        "High bias = underfitting (rigid assumptions), high variance = overfitting (noise-sensitive). Model capacity trades one against the other — the bias-variance tradeoff.",
    },
  ],
  revision: [
    "Training accuracy is not evidence — generalisation to unseen data is the only real score.",
    "Diagnose by comparing scores: both poor = underfit; large train→test gap = overfit.",
    "Bias-variance: rigid-and-stable vs flexible-and-noise-tracking; capacity slides you between them.",
    "Train fits, validation tunes, test is opened once; cross-validate when data is scarce.",
  ],
};

// ── Lesson — Evaluation Metrics ─────────────────────────────────────────────
const evaluationMetrics: Lesson = {
  id: "evaluation-metrics",
  domain: "ai",
  moduleId: "ai-ml-core",
  title: "Evaluation Metrics: When Accuracy Lies",
  objective:
    "Read a confusion matrix fluently, choose between precision and recall based on which error costs more, and know what F1 and ROC-AUC summarise — so you never trust a misleading accuracy score again.",
  difficulty: "Intermediate",
  estMinutes: 10,
  prerequisites: ["train-test-overfitting"],
  tags: ["metrics", "precision-recall", "confusion-matrix", "roc-auc", "class-imbalance"],
  theory: `You now know to evaluate on unseen data. The next trap is evaluating with the wrong *number*.

### The 99% accurate model that does nothing

Fraud is 1% of transactions. A "model" that predicts **"not fraud" for everything** scores 99% accuracy — while catching zero fraud. This is **class imbalance**, and it's the norm, not the exception: fraud, disease, churn, defects are all rare. Whenever classes are imbalanced, accuracy mostly measures the imbalance, not the model. (Notice the echo of the Bayes lesson: base rates dominate.)

### The confusion matrix: all four outcomes

For a binary problem there are exactly four outcomes, and every serious metric is built from their counts:

- **True Positive (TP)** — predicted positive, was positive. Caught it.
- **False Positive (FP)** — predicted positive, was negative. False alarm.
- **False Negative (FN)** — predicted negative, was positive. Missed it.
- **True Negative (TN)** — predicted negative, was negative. Correct pass.

The 2×2 grid of these counts is the **confusion matrix**. Read it before any headline metric — it shows *which way* your model fails, which a single number never can.

### Precision and recall: two questions about positives

- **Precision = TP / (TP + FP)** — *of everything I flagged, how much was real?* High precision = few false alarms.
- **Recall = TP / (TP + FN)** — *of everything real, how much did I catch?* High recall = few misses.

They pull against each other through the decision threshold. Flag more aggressively (lower the probability cutoff) and you catch more (recall ↑) but raise false alarms (precision ↓). Flag conservatively and precision rises while recall falls. **Which error costs more is a product question, not a math question:**

- Cancer screening: a miss can be fatal, a false alarm costs a follow-up test → favour **recall**.
- Spam filtering: deleting a real email is worse than letting one spam through → favour **precision**.

### F1: one number, when you must

The **F1 score** is the *harmonic* mean of precision and recall. Unlike an average, the harmonic mean collapses toward the weaker value — precision 1.0 with recall 0.01 gives F1 ≈ 0.02, not a comforting 0.5. Use it to compare models in one number when both error types matter; prefer reporting precision and recall separately when they don't cost the same.

### ROC-AUC: threshold-free ranking quality

Metrics above depend on a chosen threshold. **ROC-AUC** asks instead: across *all* thresholds, how well does the model *rank* positives above negatives? AUC is the probability that a random positive example gets a higher score than a random negative one. 1.0 = perfect ranking, 0.5 = coin flip. It's ideal for comparing models before committing to a threshold — but on extreme imbalance it can still look rosy, so pair it with precision-focused views.

### Choosing, in practice

Balanced classes and equal error costs: accuracy is fine. Imbalanced: start from the confusion matrix; report precision *and* recall; decide the threshold from error costs; use F1 for one-number comparisons and AUC for threshold-free ones. The one-sentence summary interviewers want: **the metric must reflect the cost of each kind of mistake.**`,
  intuition:
    "A security guard reviews 1,000 people, 10 of them intruders. Precision asks: of everyone he stopped, how many were real intruders? Recall asks: of the 10 intruders, how many did he stop? Waving everyone through scores 99% 'accuracy' — and both of the questions that matter score zero.",
  definitions: [
    { term: "Confusion matrix", meaning: "The 2×2 grid of TP / FP / FN / TN counts — the raw truth every metric summarises." },
    { term: "Precision", meaning: "TP / (TP + FP): of everything flagged positive, the fraction that really was." },
    { term: "Recall", meaning: "TP / (TP + FN): of everything truly positive, the fraction the model caught." },
    { term: "F1 score", meaning: "Harmonic mean of precision and recall — punishes whichever is weaker." },
    { term: "ROC-AUC", meaning: "Probability a random positive is scored above a random negative — ranking quality across all thresholds." },
  ],
  language: "python",
  syntax: `from sklearn.metrics import (confusion_matrix, precision_score,
                             recall_score, f1_score, roc_auc_score)

confusion_matrix(y_true, y_pred)        # [[TN, FP], [FN, TP]]
precision_score(y_true, y_pred)         # flagged -> how many real?
recall_score(y_true, y_pred)            # real -> how many caught?
f1_score(y_true, y_pred)
roc_auc_score(y_true, y_scores)         # needs scores, not labels`,
  example: {
    language: "python",
    code: `# Fraud detector on 1000 transactions (10 actually fraud):
# it flags 8 transactions; 5 are truly fraud.
TP, FP = 5, 3
FN, TN = 5, 987

accuracy  = (TP + TN) / 1000
precision = TP / (TP + FP)
recall    = TP / (TP + FN)
f1 = 2 * precision * recall / (precision + recall)

print(accuracy)             # 0.992
print(precision, recall)    # 0.625 0.5
print(round(f1, 3))         # 0.556`,
    explanation:
      "Accuracy says 99.2% — dazzling. The honest story: when it flags fraud it's right 62.5% of the time (precision), and it misses half of all real fraud (recall 0.5). F1 lands near the weaker of the two. Same model, wildly different verdicts — which is precisely why metric choice matters.",
  },
  visual: {
    kind: "mermaid",
    caption: "The four outcomes, and which metric reads which cells.",
    src: `flowchart TD
    P[Model says POSITIVE] -->|actually positive| TP[TP - caught]
    P -->|actually negative| FP[FP - false alarm]
    N[Model says NEGATIVE] -->|actually positive| FN[FN - missed]
    N -->|actually negative| TN[TN - correct pass]
    TP --> PR["Precision = TP / (TP + FP)"]
    FP --> PR
    TP --> RC["Recall = TP / (TP + FN)"]
    FN --> RC`,
  },
  keyConcepts: [
    "On imbalanced classes, accuracy mostly measures the imbalance",
    "Confusion matrix first: it shows which way the model fails",
    "Precision = trust in flags; recall = coverage of reality",
    "The threshold trades them; error costs decide the direction",
    "F1 collapses to the weaker of the pair; AUC scores ranking across thresholds",
  ],
  commonMistakes: [
    "Celebrating 99% accuracy on a 1%-positive problem — the do-nothing baseline already scores 99%.",
    "Optimising recall in isolation — predict positive for everything and recall hits 1.0 while precision collapses.",
    "Taking the arithmetic mean of precision and recall instead of the harmonic (F1) — it hides a catastrophic weakness.",
    "Feeding hard 0/1 predictions to `roc_auc_score` — AUC needs the model's *scores* to evaluate ranking.",
  ],
  tips: [
    "'Precision vs recall — explain and give a use case for favouring each' is a top-three ML interview question. Anchor: precision = 'of flagged, how many real' (spam), recall = 'of real, how many caught' (cancer screening).",
    "'When would accuracy mislead you?' — answer with the imbalance story and the 99% do-nothing fraud model; concrete numbers make it land.",
    "Asked to evaluate a classifier in an interview, say 'first I'd check class balance, then look at the confusion matrix' *before* naming any metric — that ordering signals experience.",
  ],
  quiz: [
    {
      id: "met-q1",
      type: "mcq",
      prompt: "On a dataset where 1% of examples are positive, a model predicting 'negative' for everything achieves:",
      options: [
        "99% accuracy, recall 0",
        "1% accuracy, recall 1.0",
        "99% accuracy, recall 1.0",
        "50% accuracy, recall 0.5",
      ],
      answerIndex: 0,
      explanation:
        "It's correct on the 99% negatives (accuracy 0.99) while catching zero positives (recall 0). The canonical demonstration that accuracy can flatter a useless model.",
    },
    {
      id: "met-q2",
      type: "output",
      prompt: "What does this print?",
      language: "python",
      code: `TP, FP, FN = 8, 2, 4
precision = TP / (TP + FP)
recall    = TP / (TP + FN)
print(precision, round(recall, 2))`,
      answers: ["0.8 0.67"],
      explanation:
        "Precision = 8/10 = 0.8 (of 10 flags, 8 real); recall = 8/12 ≈ 0.67 (of 12 actual positives, 8 caught). Note the different denominators — that's the entire distinction.",
    },
    {
      id: "met-q3",
      type: "mcq",
      prompt: "For a cancer screening test, which error is usually most important to minimise?",
      options: [
        "False positives — favour precision",
        "False negatives — favour recall",
        "True negatives",
        "Neither; accuracy covers it",
      ],
      answerIndex: 1,
      explanation:
        "A false negative is a missed cancer — potentially fatal; a false positive costs a follow-up test. Screening therefore favours recall, accepting more false alarms to miss fewer cases.",
    },
    {
      id: "met-q4",
      type: "truefalse",
      prompt: "An ROC-AUC of 0.5 means the model ranks positives above negatives no better than random guessing.",
      answer: true,
      explanation:
        "AUC is the probability a random positive outscores a random negative — 0.5 is coin-flip ranking, 1.0 is perfect separation. It evaluates ranking across all thresholds, not one fixed cutoff.",
    },
  ],
  revision: [
    "Imbalanced classes make accuracy nearly meaningless — check the base rate first.",
    "Confusion matrix = TP/FP/FN/TN; read it before any single-number metric.",
    "Precision: of flagged, how many real. Recall: of real, how many caught. The threshold trades them.",
    "F1 = harmonic mean (punishes the weaker); AUC = threshold-free ranking quality; costs pick the metric.",
  ],
};

// ── Lesson — Feature Engineering ────────────────────────────────────────────
const featureEngineering: Lesson = {
  id: "feature-engineering",
  domain: "ai",
  moduleId: "ai-ml-core",
  title: "Feature Engineering & the Leakage Trap",
  objective:
    "Prepare features the way models need them — scaled numerics, encoded categoricals — while avoiding data leakage, the silent bug that makes offline scores a lie.",
  difficulty: "Intermediate",
  estMinutes: 9,
  prerequisites: ["evaluation-metrics"],
  tags: ["feature-engineering", "scaling", "encoding", "data-leakage"],
  theory: `A mediocre model on great features routinely beats a great model on raw ones. Feature engineering is where that edge comes from — and where ML's most dangerous silent bug lives.

### Scaling: putting features on one ruler

Raw features live on wildly different scales: age spans 18–70, salary spans thousands to millions. Distance-based models (kNN, k-means) and gradient-descent-trained models (linear, logistic, neural nets) implicitly assume comparable scales — otherwise the big-unit feature dominates every distance and gradient. Two standard fixes:

- **Standardisation** (\`StandardScaler\`) — subtract the mean, divide by std, so each feature has mean 0, std 1. The default choice; those are z-scores from the stats lesson.
- **Min-max normalisation** (\`MinMaxScaler\`) — rescale into [0, 1]. Intuitive, but a single outlier squashes everyone else into a corner.

Tree-based models split on one feature at a time and don't care about scale — one reason trees are so pleasant on messy tabular data.

### Encoding: numbers for categories

Models eat numbers, so \`city = "Delhi"\` must become numeric:

- **One-hot encoding** — one 0/1 column per category. The default for *nominal* categories (no order), because it invents no relationships.
- **Label encoding** — map categories to integers (Delhi=0, Mumbai=1, Pune=2). Dangerous for nominal data: the model now believes Pune > Mumbai > Delhi and that averaging Delhi and Pune gives Mumbai. Reserve it for genuinely *ordinal* categories (small < medium < large).

One-hot's cost is width: a 10,000-value column becomes 10,000 columns. High-cardinality features need other tricks (grouping rare values, target encoding — with care, since naive target encoding is itself a leakage machine).

### Leakage: the silent killer

**Data leakage** is when information unavailable at real prediction time sneaks into training. The model looks brilliant offline and collapses in production — with no error message anywhere. Two families:

- **Target leakage** — a feature secretly encodes the answer. Classic: predicting hospital readmission with a "discharge_medication" column recorded *after* the outcome; or a "refund_issued" flag when predicting fraud. The tell: an offline score too good to be true.
- **Split leakage** — preprocessing computed on *all* the data before splitting. Fit a scaler on the full dataset and the test rows' means and stds have already influenced training — your test set is no longer unseen. Subtler versions: filling missing values or selecting features using full-dataset statistics.

The iron rule: **fit every preprocessing step on training data only, then apply it to validation and test.** In sklearn terms — \`fit_transform\` on train, \`transform\` (never fit) on everything else. The next lesson's Pipelines make this automatic instead of a memory test.

### Feature selection: less can be more

More features mean more dimensions to overfit in; irrelevant columns are pure variance fuel (recall the bias-variance lesson). Cheap first passes: drop zero-variance columns; of two near-duplicate correlated features, keep one; use tree-based importance scores as a *rough* guide. The honest test of any feature's worth is cross-validated performance with versus without it — measured, not assumed. When two feature sets tie, prefer the smaller: simpler, faster, easier to explain.`,
  intuition:
    "Leakage is studying from a leaked answer key. Your practice scores are perfect — and they measure your access to the key, not your understanding. Exam day (production), the key is gone, and so is the performance. Worst of all, nothing warns you: the offline numbers genuinely were that good.",
  definitions: [
    { term: "Standardisation", meaning: "Rescale a feature to mean 0, std 1 — the default scaler for distance- and gradient-based models." },
    { term: "One-hot encoding", meaning: "One binary column per category; encodes nominal categories without inventing an order." },
    { term: "Label encoding", meaning: "Categories as integers — implies an order, so it's only safe for ordinal data." },
    { term: "Data leakage", meaning: "Information unavailable at prediction time influencing training — inflates offline scores, fails silently in production." },
    { term: "fit vs transform", meaning: "fit learns preprocessing statistics (train only); transform applies them (everywhere)." },
  ],
  language: "python",
  syntax: `from sklearn.preprocessing import StandardScaler, OneHotEncoder

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)  # learn mean/std on TRAIN only
X_test_s  = scaler.transform(X_test)       # apply — never fit — on test

enc = OneHotEncoder(handle_unknown="ignore")
city_cols = enc.fit_transform(train[["city"]])`,
  example: {
    language: "python",
    code: `import numpy as np
from sklearn.preprocessing import StandardScaler

X_train = np.array([[20.], [30.], [40.]])
X_test  = np.array([[80.]])

scaler = StandardScaler().fit(X_train)   # mean=30, std~8.16 from TRAIN
print(scaler.transform(X_test).round(2))   # [[6.12]]

leaky = StandardScaler().fit(np.vstack([X_train, X_test]))
print(leaky.transform(X_test).round(2))    # [[1.66]]`,
    explanation:
      "Scaled honestly with train-only statistics, the test point 80 sits 6.12 stds out — correctly flagged as far outside anything training saw. Fit the scaler on all the data and the same point looks like a mild 1.66 — the test point's own value diluted the statistics that judge it. Same data, same model downstream, quietly different answers: that's split leakage.",
  },
  keyConcepts: [
    "Scale features for distance- and gradient-based models; trees don't care",
    "One-hot for nominal categories; integer codes only when order is real",
    "Target leakage: a feature that encodes the answer; too-good scores are the tell",
    "Split leakage: preprocessing fit on data it should never have seen",
    "fit_transform on train, transform on test — no exceptions",
  ],
  commonMistakes: [
    "Calling `fit_transform` on the test set — quietly refitting the scaler on data that must stay unseen.",
    "Label-encoding nominal categories and letting the model rank cities numerically.",
    "Treating a suspiciously perfect offline score as success instead of auditing features for leakage.",
    "Scaling the whole dataset before `train_test_split` — leakage committed in the very first notebook cell.",
  ],
  tips: [
    "'What is data leakage? Give an example' is a standard mid-level interview probe — bring both flavours: a target-leaking feature (recorded after the outcome) and preprocessing fit before the split.",
    "'Why scale features?' — name *which* models need it (kNN, k-means, linear/logistic/NN) and which don't (trees), not just 'it helps'.",
    "In take-homes, an AUC near 1.0 on messy real-world data is a leakage alarm, not a victory lap — say so out loud and interviewers will trust you more.",
  ],
  quiz: [
    {
      id: "feat-q1",
      type: "mcq",
      prompt: "You scale the full dataset, then split into train and test. What went wrong?",
      options: [
        "Nothing — scaling order doesn't matter",
        "The scaler learned test-set statistics, so the test set is no longer truly unseen",
        "Scaling only works after splitting for mathematical reasons",
        "The test set became too small",
      ],
      answerIndex: 1,
      explanation:
        "The test rows' values shaped the mean/std used to transform training data — information flowed from 'unseen' data into training. Fit the scaler on train only, then transform test with those statistics.",
    },
    {
      id: "feat-q2",
      type: "mcq",
      prompt: "Encoding `city` (Delhi, Mumbai, Pune — no natural order) as 0, 1, 2 for a linear model is risky because:",
      options: [
        "Linear models cannot use integers",
        "It creates too many columns",
        "It invents an order and spacing the categories don't have",
        "It leaks the target",
      ],
      answerIndex: 2,
      explanation:
        "Integer codes tell the model Pune (2) is 'twice' Mumbai (1) and that the categories lie on a line. One-hot encoding gives each city its own independent column and invents no such structure.",
    },
    {
      id: "feat-q3",
      type: "truefalse",
      prompt: "Data leakage usually reveals itself with an error message during training.",
      answer: false,
      explanation:
        "Leakage is silent — that's what makes it the killer. Training succeeds and offline metrics look *great*; the failure only appears in production when the leaked information no longer exists. Suspiciously high scores are the main early warning.",
    },
    {
      id: "feat-q4",
      type: "fill",
      prompt: "On the test set you must call the scaler's ____ method — never fit.",
      answers: ["transform"],
      placeholder: "method name",
      explanation:
        "`fit` learns statistics and belongs to training data alone; `transform` applies the already-learned statistics. `fit_transform` on test data silently refits — the classic split-leakage bug.",
    },
  ],
  revision: [
    "Standardise features for kNN/k-means and gradient-trained models; trees are scale-free.",
    "One-hot nominal categories; integer-encode only true ordinals.",
    "Leakage = future or target information in training; great offline, dead in production, no error raised.",
    "fit preprocessing on train only, transform elsewhere; fewer, better features beat many noisy ones.",
  ],
};

// ── Lesson — Unsupervised Learning ──────────────────────────────────────────
const unsupervisedLearning: Lesson = {
  id: "unsupervised-learning",
  domain: "ai",
  moduleId: "ai-ml-core",
  title: "Unsupervised Learning: Clusters & Compression",
  objective:
    "Find structure in unlabelled data — run and reason about k-means, pick k sensibly, know when hierarchical clustering fits better, and use PCA to compress dimensions.",
  difficulty: "Intermediate",
  estMinutes: 9,
  prerequisites: ["feature-engineering"],
  tags: ["unsupervised", "k-means", "clustering", "pca", "dimensionality-reduction"],
  theory: `Everything so far assumed labels. But most of the world's data has none — customer behaviour, sensor logs, raw text. **Unsupervised learning** finds structure without answers, and two tools cover most practical needs: clustering (find the groups) and dimensionality reduction (compress the features).

### k-means: the two-step dance

**k-means** partitions data into k clusters with an algorithm simple enough to hand-trace:

1. Place k **centroids** (initially random-ish).
2. **Assign** every point to its nearest centroid — nearest by distance, which is why the scaling lesson applies with full force.
3. **Update** each centroid to the mean of its assigned points.
4. Repeat 2–3 until assignments stop changing.

Each step can only reduce the total within-cluster distance, so it always converges — though possibly to a *local* optimum that depends on the starting centroids. Practical mitigation: run several restarts and keep the best (sklearn's \`n_init\` does this for you). Two built-in assumptions worth knowing: k-means prefers roughly round, similar-sized clusters, and every point must join *some* cluster — outliers get conscripted rather than excluded.

### Choosing k: the elbow and beyond

k is your choice, and there's no label to check it against. The **elbow method**: run k-means for k = 1, 2, 3, …, plot the total within-cluster distance (inertia) against k, and look for the bend where adding clusters stops paying — inertia *always* falls as k grows (more centroids are always nearer), so you want the point of diminishing returns, not the minimum. The elbow is often ambiguous; **silhouette scores** (how much closer each point is to its own cluster than the next-best one) give a more principled vote. And frankly, domain sense counts: if marketing can act on four customer segments, k=4 beats a statistically prettier k=11.

### Hierarchical clustering: a tree of merges

Instead of fixing k up front, **agglomerative (hierarchical) clustering** starts with every point as its own cluster and repeatedly merges the two closest, producing a merge tree — a **dendrogram**. Cut the tree at any height to get any number of clusters, and the tree itself shows structure at every scale (sub-groups inside groups — think taxonomies). Cost: roughly quadratic in the number of points, so it suits thousands, not millions.

### PCA: fewer dimensions, most of the story

**Principal Component Analysis** attacks a different problem: too many features. It finds new axes — ordered by how much variance each captures — and keeps the top few. Correlated features collapse together (height in cm and inches become essentially one axis), and it's routine for 50 features to compress to 10 while retaining 95% of the variance. Uses: 2-D visualisation of high-dimensional data, speeding up downstream models, and noise reduction. Costs: components are *mixtures* of original features, so interpretability suffers; and since PCA is variance-hunting, unscaled features rig the vote — scale first. One more caution: maximum-variance directions aren't guaranteed to be the class-separating ones.

### When unsupervised helps

Three honest use cases: **exploration** (segment customers before anyone defines segments — EDA's modeling cousin), **preprocessing** (PCA-compress features; use a cluster id as a new feature for a supervised model), and **anomaly detection** (points far from every centroid deserve a look). Without labels there's no single 'correct' clustering — evaluation blends internal scores with whether the groups mean something to a human. That fuzziness is honest: unsupervised learning generates hypotheses; supervised learning tests them.`,
  intuition:
    "k-means is opening food stalls across a city: place k stalls roughly at random, every resident walks to their nearest stall (assignment), then each stall relocates to the centre of its actual crowd (update). A few rounds of walking and relocating and the stalls settle into the city's natural neighbourhoods — no one ever told the algorithm where the neighbourhoods were.",
  definitions: [
    { term: "Centroid", meaning: "The mean point of a cluster — k-means alternates assigning points to centroids and re-centering them." },
    { term: "Inertia", meaning: "Total within-cluster squared distance; always falls as k grows, hence the elbow heuristic." },
    { term: "Dendrogram", meaning: "Hierarchical clustering's merge tree — cut at any height for any number of clusters." },
    { term: "PCA", meaning: "Re-axes data by variance captured, letting you keep few components that preserve most information." },
    { term: "Silhouette score", meaning: "How much closer a point is to its own cluster than to the next-best — a label-free clustering quality check." },
  ],
  language: "python",
  syntax: `from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

km = KMeans(n_clusters=4, n_init=10, random_state=0).fit(X_scaled)
km.labels_          # cluster id per point
km.inertia_         # within-cluster distance (for the elbow plot)

pca = PCA(n_components=2)
X_2d = pca.fit_transform(X_scaled)
pca.explained_variance_ratio_   # variance captured per component`,
  example: {
    language: "python",
    code: `import numpy as np
from sklearn.cluster import KMeans

# two obvious blobs: around (0, 0) and around (10, 10)
X = np.array([[0, 0], [1, 0], [0, 1],
              [10, 10], [11, 10], [10, 11]])

km = KMeans(n_clusters=2, n_init=10, random_state=0).fit(X)

print(km.labels_)                   # [1 1 1 0 0 0]
print(km.cluster_centers_.round(2))
# [[10.33 10.33]
#  [ 0.33  0.33]]`,
    explanation:
      "With no labels provided, k-means recovers the two blobs and places each centroid at its cluster's mean — (0.33, 0.33) and (10.33, 10.33). Which blob gets id 0 vs 1 is arbitrary and can differ between runs: cluster ids are group markers, not meanings — *you* interpret what each group is.",
  },
  visual: {
    kind: "mermaid",
    caption: "The k-means loop: assign, update, repeat until stable.",
    src: `flowchart TD
    S[Place k centroids] --> A[Assign each point to
its nearest centroid]
    A --> U[Move each centroid to the
mean of its points]
    U --> C{Assignments changed?}
    C -->|yes| A
    C -->|no| D[Converged - clusters final]`,
  },
  keyConcepts: [
    "Unsupervised = structure without labels: clustering and compression",
    "k-means alternates assign/update; converges, but to a local optimum — restart",
    "Pick k via elbow + silhouette + domain sense, not inertia alone",
    "Hierarchical builds a dendrogram — all granularities, quadratic cost",
    "PCA keeps the top-variance axes; scale first, expect less interpretability",
  ],
  commonMistakes: [
    "Clustering unscaled features, so the largest-unit feature single-handedly defines distance.",
    "Choosing k by minimising inertia — it always falls as k grows; look for the elbow instead.",
    "Reading cluster ids as stable or meaningful — they're arbitrary group markers that can permute between runs.",
    "Running PCA on unscaled data, letting the biggest-variance raw feature dominate the components.",
  ],
  tips: [
    "'Explain k-means to me' is common enough to rehearse: the two-step loop, convergence to a local optimum, restarts, and the round-cluster assumption is a complete answer.",
    "'How do you choose k?' — name the elbow, add silhouette, finish with domain actionability; three lenses beats one heuristic.",
    "'When would you use PCA?' — visualisation, speed, and noise reduction, with the caveats: scale first, and components trade away interpretability.",
  ],
  quiz: [
    {
      id: "unsup-q1",
      type: "mcq",
      prompt: "The two alternating steps of the k-means loop are:",
      options: [
        "Split data, then vote",
        "Assign points to nearest centroid, then move each centroid to its points' mean",
        "Sort points, then divide into k equal groups",
        "Compute gradients, then step downhill",
      ],
      answerIndex: 1,
      explanation:
        "Assign (nearest centroid) then update (centroid = cluster mean), repeated until assignments stabilise. Each step reduces within-cluster distance, guaranteeing convergence — though only to a local optimum.",
    },
    {
      id: "unsup-q2",
      type: "truefalse",
      prompt: "Since inertia always decreases as k increases, you should pick the k with the lowest inertia.",
      answer: false,
      explanation:
        "At k = n (every point its own cluster) inertia hits zero — uselessly. More centroids are always nearer, so you seek the elbow where added clusters stop paying, plus silhouette and domain judgment.",
    },
    {
      id: "unsup-q3",
      type: "fill",
      prompt: "Hierarchical clustering's tree of merges — cut it at any height to choose the number of clusters — is called a ____.",
      answers: ["dendrogram"],
      placeholder: "one word",
      explanation:
        "The dendrogram records every merge; cutting it at a height yields a clustering at that granularity, so you defer the choice of k instead of fixing it up front.",
    },
    {
      id: "unsup-q4",
      type: "mcq",
      prompt: "You have 50 correlated features and want a 2-D plot to eyeball structure. The standard first tool is:",
      options: ["k-means with k=2", "A deeper decision tree", "PCA down to 2 components", "One-hot encoding"],
      answerIndex: 2,
      explanation:
        "PCA projects onto the two highest-variance axes — with correlated features, a couple of components often preserve most of the story. k-means groups points; it doesn't reduce dimensions.",
    },
  ],
  revision: [
    "Clustering finds groups, dimensionality reduction compresses features — both label-free.",
    "k-means: assign to nearest centroid, re-center, repeat; scale features and use restarts.",
    "Choose k with the elbow plus silhouette plus domain sense; hierarchical gives all scales via the dendrogram.",
    "PCA keeps top-variance components — scale first; great for viz and speed, costs interpretability.",
  ],
};

// ── Lesson — The scikit-learn Workflow ──────────────────────────────────────
const sklearnWorkflow: Lesson = {
  id: "sklearn-workflow",
  domain: "ai",
  moduleId: "ai-ml-core",
  title: "The scikit-learn Workflow: End to End",
  objective:
    "Assemble everything in this module into one leak-proof scikit-learn pipeline — fit/transform/predict, cross-validated evaluation, honest test scoring, and saving the trained model.",
  difficulty: "Intermediate",
  estMinutes: 10,
  prerequisites: ["unsupervised-learning"],
  tags: ["scikit-learn", "pipeline", "workflow", "capstone", "model-persistence"],
  theory: `This capstone is where seven lessons of pieces click into one repeatable workflow — the same skeleton behind most production tabular ML.

### One API to rule them all

scikit-learn's design bet is uniformity. Every component speaks the same three verbs:

- **\`fit(X, y)\`** — learn from training data (model weights, or a scaler's means).
- **\`predict(X)\`** — produce outputs (models).
- **\`transform(X)\`** — reshape data (scalers, encoders, PCA).

Because a LogisticRegression, a StandardScaler, and a PCA are interchangeable parts with a shared interface, swapping models is a one-line change and components snap together — which is exactly what pipelines exploit.

### Pipelines: leakage-proofing as architecture

The feature-engineering lesson left you a memory test: fit the scaler on train only, transform test, never refit. A **Pipeline** turns that discipline into structure:

\`pipe = Pipeline([("scaler", StandardScaler()), ("clf", LogisticRegression())])\`

Now \`pipe.fit(X_train, y_train)\` fits the scaler on training data and trains the classifier on the scaled result; \`pipe.predict(X_test)\` *transforms* test data with training statistics — refitting is structurally impossible. Better still, cross-validating the pipeline re-fits preprocessing inside every fold, which is the *only* correct way to cross-validate preprocessed data. One object also means one thing to save, and no way for production preprocessing to drift out of sync with what training did.

### The end-to-end shape: spam detection

Here's the full workflow on the problem this domain opened with — and a strong candidate for your first portfolio project:

1. **Frame it.** Inputs: email text. Output: spam / not spam. Supervised classification.
2. **Load and explore.** pandas + EDA: how many emails? What's the class balance? (It's imbalanced — accuracy is already disqualified; that's your metrics lesson talking.)
3. **Split first.** Hold out a test set *before* any preprocessing decisions — the overfitting lesson's iron rule.
4. **Build the pipeline.** Vectorise text into word-count features (\`CountVectorizer\` — text's version of encoding), then a classifier. All inside one Pipeline, so nothing leaks.
5. **Cross-validate and tune.** Compare candidate models and hyperparameters by k-fold CV score — say F1, given the imbalance — on the training portion only.
6. **Final evaluation.** Fit the chosen pipeline on all training data; score **once** on the untouched test set; read the confusion matrix, precision, and recall — not just one number.
7. **Ship it.** Persist the fitted pipeline with \`joblib.dump\`; a serving process loads it and calls \`predict\` on new emails — preprocessing included, because the pipeline *is* the model.

### Saving models: the fitted object is the artifact

Training is expensive; prediction shouldn't be. \`joblib.dump(pipe, "spam_model.joblib")\` writes the fitted pipeline — learned weights *and* preprocessing statistics — to disk; \`joblib.load\` revives it for instant predictions. Two production notes: load pickled models only from sources you trust (unpickling can execute code), and record the library versions you trained with — a model saved under one sklearn version may not load under another.

### The workflow is the skill

Interviews and real projects rarely reward exotic models. They reward exactly this loop — frame, explore, split, pipeline, cross-validate, evaluate honestly, ship — executed without leaks. Master the skeleton; every future model, up to and including neural networks, is a new part snapped into the same frame.`,
  intuition:
    "A pipeline is a sealed restaurant kitchen: recipe decided up front, every dish (data batch) passes through the same prep stations in the same order, and no ingredient from the dining room (test data) can wander back in and season the stock. Shipping the model means shipping the whole kitchen — not a photo of the menu.",
  definitions: [
    { term: "Estimator", meaning: "Any sklearn object with fit — models, scalers, encoders all share the interface." },
    { term: "Pipeline", meaning: "A chain of transforms ending in a model, fit and applied as one unit — leakage-proof by construction." },
    { term: "CountVectorizer", meaning: "Turns raw text into word-count feature columns — the encoding step for text." },
    { term: "joblib", meaning: "The standard tool for saving and loading fitted sklearn objects to and from disk." },
  ],
  language: "python",
  syntax: `from sklearn.pipeline import Pipeline
from sklearn.model_selection import cross_val_score
import joblib

pipe = Pipeline([("scaler", StandardScaler()),
                 ("clf", LogisticRegression())])
cross_val_score(pipe, X_train, y_train, cv=5, scoring="f1")
pipe.fit(X_train, y_train)          # preprocessing + model, one call
joblib.dump(pipe, "model.joblib")    # ship the whole pipeline`,
  example: {
    language: "python",
    code: `from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression

X_train = ["win free money now", "meeting moved to 3pm",
           "free offer claim now", "notes from the standup"]
y_train = [1, 0, 1, 0]

pipe = Pipeline([
    ("vec", CountVectorizer()),
    ("clf", LogisticRegression()),
])
pipe.fit(X_train, y_train)

print(pipe.predict(["claim your free money"]))   # [1]
print(pipe.predict(["standup notes attached"]))  # [0]`,
    explanation:
      "One object goes from raw text to prediction: the vectoriser learns the training vocabulary inside `fit`, and `predict` reuses it on new emails automatically. This is a miniature of the full spam project — swap in a real labelled dataset, add a train/test split, cross-validate with F1, and you have a portfolio piece.",
  },
  keyConcepts: [
    "Three verbs everywhere: fit learns, transform reshapes, predict outputs",
    "Pipelines make train-only preprocessing structurally guaranteed",
    "Cross-validate the whole pipeline so preprocessing refits per fold",
    "Frame → explore → split → pipeline → CV → one test score → ship",
    "joblib persists the fitted pipeline — preprocessing and model as one artifact",
  ],
  commonMistakes: [
    "Preprocessing outside the pipeline and cross-validating only the model — the CV scores are quietly leaked.",
    "Peeking at the test set repeatedly during development — it stops being a test set (the overfitting lesson's core sin).",
    "Saving only the classifier and rebuilding preprocessing by hand in the serving code — the two drift apart in production.",
    "Reporting one headline number for an imbalanced problem instead of the confusion matrix with precision and recall.",
  ],
  tips: [
    "'Walk me through how you'd build a spam classifier end-to-end' is a stock interview task — narrate the seven steps (frame, explore, split, pipeline, cross-validate, evaluate, ship) and you'll cover framing, leakage, and metrics in one answer.",
    "'Why use a Pipeline?' has a crisp answer: it makes leakage structurally impossible and makes cross-validation of preprocessing correct — say both halves.",
    "Build the spam detector for real: a public spam dataset, this exact skeleton, F1 + confusion matrix reported honestly. One finished, leak-free project beats five half-tuned notebooks in a portfolio.",
  ],
  quiz: [
    {
      id: "skl-q1",
      type: "mcq",
      prompt: "Inside `Pipeline([(\"scaler\", ...), (\"clf\", ...)]).predict(X_test)`, what does the scaler step do?",
      options: [
        "Refits on X_test, then transforms it",
        "Transforms X_test using statistics learned during fit on training data",
        "Skips scaling at predict time",
        "Raises an error — pipelines can't scale at predict time",
      ],
      answerIndex: 1,
      explanation:
        "The pipeline only ever *transforms* at predict time, using the means/stds captured when it was fit on training data. That's the leakage-proofing: refitting on test data is structurally impossible.",
    },
    {
      id: "skl-q2",
      type: "output",
      prompt: "What does this print?",
      language: "python",
      code: `steps = ["load", "split", "fit", "evaluate", "ship"]
print(steps[2])`,
      answers: ["fit"],
      explanation:
        "Indexing starts at 0, so `steps[2]` is the third element — \"fit\". Load and split come before it; evaluate and ship after — the compressed shape of the workflow this lesson assembles.",
    },
    {
      id: "skl-q3",
      type: "truefalse",
      prompt: "When cross-validating a model on scaled data, it's fine to scale the full training set once before the CV loop.",
      answer: false,
      explanation:
        "Each CV fold's validation part must be unseen — pre-scaling lets every fold's statistics include its own validation rows. Cross-validate the *pipeline* so the scaler refits inside each fold on that fold's training portion only.",
    },
    {
      id: "skl-q4",
      type: "fill",
      prompt: "The standard library call to save a fitted sklearn pipeline to disk is ____.dump(pipe, \"model.joblib\").",
      answers: ["joblib"],
      placeholder: "library name",
      explanation:
        "`joblib.dump` persists the fitted pipeline — preprocessing statistics and model weights together — and `joblib.load` revives it for serving. Ship the pipeline, not just the classifier.",
    },
  ],
  revision: [
    "fit / transform / predict is the whole sklearn API — every component is a swappable part.",
    "Pipelines chain preprocessing and model into one object, making leakage structurally impossible.",
    "Workflow: frame → explore → split first → pipeline → cross-validate → one honest test score → ship.",
    "Persist the fitted pipeline with joblib; version-match sklearn and only load trusted files.",
  ],
};

export const mlCore: Module = {
  id: "ai-ml-core",
  domain: "ai",
  title: "Machine Learning Core",
  summary:
    "From fitting a line to a full scikit-learn workflow — the fundamentals every ML interview tests.",
  order: 1,
  lessons: [
    linearRegression,
    classificationBasics,
    trainTestOverfitting,
    evaluationMetrics,
    featureEngineering,
    unsupervisedLearning,
    sklearnWorkflow,
  ],
};
