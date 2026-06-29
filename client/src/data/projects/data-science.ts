import type { ProjectDomain } from "./types";

export const dataScience: ProjectDomain = {
  id: "data-science",
  title: "Data Science",
  icon: "BarChart3",
  accent: "mint",
  blurb: "Turn raw data into decisions — analysis, visualization, and insight at scale.",
  overview:
    "Data Science for placement isn't about training neural networks — it's about **finding the story in data and communicating it clearly**. Companies hiring analyst and data science roles want to see that you can take a messy real-world dataset, clean it, explore it with statistical rigour, visualize patterns that aren't obvious, and deliver a narrative that drives a decision. A well-crafted EDA notebook or an interactive dashboard tells a recruiter far more than a toy ML model.\n\nIndia's placement landscape has a strong appetite for data roles: analyst positions at product companies (Flipkart, Swiggy, Zepto, CRED, Dream11), data engineering roles at consulting firms, and business intelligence tracks at MNCs all test SQL, pandas, and Python statistics heavily. The projects in this path are designed so that each one is **deployable and shareable** — a live Streamlit dashboard or a well-narrated Jupyter notebook on GitHub is a concrete hiring signal.",
  skillsRequired: [
    "Python basics (lists, dicts, loops, functions, file I/O)",
    "Fundamental statistics (mean, median, variance, distributions, hypothesis testing)",
    "SQL — SELECT, GROUP BY, JOINs, window functions",
    "Basic pandas (DataFrame creation, filtering, groupby, merge)",
    "Familiarity with Jupyter Notebooks or Google Colab",
  ],
  learningOrder: [
    "Python for data work: numpy arrays, pandas Series/DataFrame, reading CSV/JSON",
    "Exploratory Data Analysis (EDA): distribution checks, null handling, outlier detection, correlation",
    "Data visualization with matplotlib and seaborn: histograms, box plots, heatmaps, pair plots",
    "Statistics fundamentals: descriptive stats, probability distributions, confidence intervals, A/B test mechanics",
    "SQL for analysis: aggregations, window functions (RANK, LAG, LEAD), CTEs, subqueries",
    "Interactive dashboards: Streamlit or Plotly Dash — widgets, filters, charts, deployment on Streamlit Cloud",
    "Data pipelines and automation: scheduling scripts, reading from APIs/databases, writing clean ETL functions",
    "Storytelling with data: structuring a notebook as a narrative, choosing the right chart, writing insight captions",
  ],
  difficulty: "Beginner-friendly → Advanced",
  techStack: [
    "Python 3.x",
    "pandas / NumPy",
    "matplotlib / seaborn / Plotly",
    "SQL (PostgreSQL or SQLite)",
    "Streamlit / Plotly Dash",
    "Jupyter Notebook / JupyterLab",
    "Google Colab (free GPU/cloud)",
  ],
  githubResources: [
    {
      label: "Awesome Data Science",
      url: "https://github.com/academic/awesome-datascience",
      kind: "repo",
    },
    {
      label: "Data Science IPython Notebooks (Donne Martin)",
      url: "https://github.com/donnemartin/data-science-ipython-notebooks",
      kind: "repo",
    },
    {
      label: "Pandas exercises",
      url: "https://github.com/guipsamora/pandas_exercises",
      kind: "repo",
    },
    {
      label: "Streamlit example apps",
      url: "https://github.com/streamlit/streamlit",
      kind: "repo",
    },
    {
      label: "Practical Business Python",
      url: "https://github.com/chris1610/pbpython",
      kind: "repo",
    },
  ],
  learningResources: [
    {
      label: "Kaggle Learn — Pandas, Data Viz, SQL",
      url: "https://www.kaggle.com/learn",
      kind: "course",
    },
    {
      label: "freeCodeCamp — Data Analysis with Python",
      url: "https://www.freecodecamp.org/learn/data-analysis-with-python/",
      kind: "course",
    },
    {
      label: "roadmap.sh — Data Analyst roadmap",
      url: "https://roadmap.sh/data-analyst",
      kind: "roadmap",
    },
    {
      label: "Mode Analytics SQL Tutorial",
      url: "https://mode.com/sql-tutorial/",
      kind: "course",
    },
    {
      label: "Streamlit docs — Build your first app",
      url: "https://docs.streamlit.io/get-started",
      kind: "docs",
    },
  ],
  portfolioTips: [
    "Host every notebook on GitHub and enable nbviewer rendering — paste the nbviewer link in your resume so reviewers can read it without cloning anything.",
    "Deploy at least one Streamlit dashboard to Streamlit Community Cloud (free); a live URL beats a static screenshot every time.",
    "Write a narrative README for each project: state the business question, summarize the key finding, and link the live dashboard or rendered notebook.",
    "Pick datasets that have a real-world story (IPL matches, Zomato orders, air quality, COVID trends, stock prices) — the more relatable the domain, the better the conversation in interviews.",
    "Show your cleaning choices: comment on why you dropped/imputed specific values rather than silently deleting rows. It signals data maturity.",
  ],
  resumeTips: [
    "Lead with the insight, not the tool: 'Identified a 22% drop in D7 retention attributable to onboarding funnel drop-off — visualized in an interactive Streamlit dashboard.'",
    "Name the stack (pandas, seaborn, SQL, Streamlit) — ATS systems and screeners keyword-match these explicitly.",
    "Quantify wherever possible: dataset size (rows × columns), number of features engineered, reduction in null rate after cleaning, time saved by automating a report.",
    "Link both the deployed dashboard URL and the GitHub repo directly in the bullet point.",
    "Use action verbs that signal analysis: 'Analyzed', 'Uncovered', 'Quantified', 'Visualized', 'Automated', 'Reported' — not just 'Built' or 'Created'.",
  ],
  interviewRelevance:
    "Data Science and Analyst roles in Indian placements test three things heavily:\n\n**1. SQL rounds** — almost universal at product companies. You'll get questions on GROUP BY + HAVING, multi-table JOINs, window functions (RANK, DENSE_RANK, LAG/LEAD), and writing CTEs. Every project here involves SQL so you'll have a live codebase to reference.\n\n**2. Python/pandas questions** — expect live coding on DataFrame manipulations, groupby aggregations, handling nulls, and merging datasets. Projects that use real messy data (missing values, mixed types, outliers) give you concrete examples to discuss.\n\n**3. Analytical thinking / case rounds** — roles at companies like Meesho, Zepto, Swiggy, or PhonePe often include a take-home case or a metrics discussion: 'DAU dropped 15% on Monday — walk me through how you'd investigate.' The EDA and pipeline projects train exactly this instinct. Being able to say 'In my sales analysis project I saw a similar pattern and here is how I approached it' is a massive differentiator.",
  projects: [
    {
      id: "eda-sales-analysis",
      name: "Retail Sales Exploratory Data Analysis",
      level: "Beginner",
      blurb: "Clean a messy sales dataset, uncover trends, and write a data-driven story.",
      estimatedTime: "1 weekend",
      objective:
        "Take a publicly available retail sales dataset (such as the Superstore dataset on Kaggle), clean it thoroughly, explore it with descriptive statistics and visualizations, and produce a well-narrated Jupyter Notebook that answers concrete business questions: Which product categories drive the most profit? Are there seasonal revenue spikes? Which regions under-perform? This project proves you can do the full EDA cycle — clean, analyze, visualize, conclude — and communicate findings in writing, which is exactly what analyst roles demand.",
      features: [
        "Data loading and initial audit (shape, dtypes, null counts, duplicate detection)",
        "Cleaning pipeline: handle nulls, correct dtypes, remove duplicates, flag/cap outliers",
        "Univariate analysis: distribution plots for key numeric columns, value-counts for categoricals",
        "Bivariate and multivariate analysis: correlation heatmap, group comparisons, time-series revenue trend",
        "At least 5 chart types (histogram, box plot, bar chart, line chart, heatmap) with labeled axes and titles",
        "A written insights section: bullet-point findings with supporting chart references",
        "A conclusion cell summarizing 3 actionable recommendations based on the data",
      ],
      folderStructure: `retail-eda/
├── data/
│   ├── raw/
│   │   └── superstore.csv
│   └── cleaned/
│       └── superstore_clean.csv
├── notebooks/
│   ├── 01_data_cleaning.ipynb
│   └── 02_eda_and_insights.ipynb
├── outputs/
│   └── figures/             # exported chart PNGs
├── requirements.txt
└── README.md`,
      technologies: ["Python 3", "pandas", "NumPy", "matplotlib", "seaborn", "Jupyter Notebook"],
      skills: [
        "Data cleaning and null handling",
        "Descriptive statistics",
        "Exploratory data visualization",
        "Insight narration and storytelling",
        "Reproducible notebook structure",
      ],
      stretchGoals: [
        "Add an interactive Plotly version of your best chart so stakeholders can hover and filter",
        "Perform a statistical significance test (t-test or chi-square) on one of your hypotheses",
        "Export a one-page PDF summary of findings using nbconvert",
      ],
      futureImprovements: [
        "Automate the cleaning pipeline as a reusable Python script so it can be run on updated data monthly",
        "Add a forecasting section using a simple moving average to predict next-quarter revenue",
        "Build a Streamlit dashboard so non-technical stakeholders can explore the data themselves",
      ],
    },
    {
      id: "interactive-dashboard",
      name: "IPL Analytics Interactive Dashboard",
      level: "Intermediate",
      blurb: "A deployed Streamlit dashboard with real cricket data, filters, and multi-view charts.",
      estimatedTime: "1–2 weeks",
      objective:
        "Build and deploy an interactive analytics dashboard using IPL match and ball-by-ball data from Kaggle. The dashboard should let users filter by season, team, and venue, then surface pre-computed insights via Plotly charts — top run-scorers, economy rates by bowler, win percentage by toss decision, team performance trends. Deploying on Streamlit Community Cloud means you get a live URL to share with recruiters. This project demonstrates your ability to translate data into a product — not just a notebook — and tests your SQL and pandas aggregation skills at scale.",
      features: [
        "Sidebar filters: season selector, team multi-select, venue dropdown",
        "KPI cards at the top: total matches, average first-innings score, highest individual score in selection",
        "Top batsmen bar chart (runs, strike rate, boundaries) — sortable by metric",
        "Top bowlers chart (wickets, economy, dot-ball %) — filterable by season",
        "Team win-percentage by match condition (toss won/lost, home/away) as a grouped bar or heatmap",
        "Season trend line chart for average match total runs",
        "All charts built with Plotly Express for hover tooltips and interactivity",
        "Deployed on Streamlit Community Cloud with a public URL",
      ],
      folderStructure: `ipl-dashboard/
├── data/
│   ├── matches.csv
│   └── deliveries.csv
├── scripts/
│   └── preprocess.py        # run once to generate aggregated CSVs
├── data_processed/
│   ├── batsmen_stats.csv
│   ├── bowler_stats.csv
│   └── team_season.csv
├── app/
│   ├── app.py               # main Streamlit entry point
│   ├── pages/
│   │   ├── batting.py
│   │   ├── bowling.py
│   │   └── teams.py
│   └── components/
│       └── kpi_cards.py
├── requirements.txt
└── README.md`,
      technologies: [
        "Python 3",
        "pandas",
        "NumPy",
        "Plotly Express",
        "Streamlit",
        "Streamlit Community Cloud",
      ],
      skills: [
        "Multi-page Streamlit app architecture",
        "Interactive chart design with Plotly",
        "pandas groupby aggregations at scale",
        "Dashboard UX — filter state, layout, KPI design",
        "Cloud deployment and public URL sharing",
      ],
      stretchGoals: [
        "Add a head-to-head comparison page where users pick two teams and see historical win rates",
        "Introduce a SQLite backend so filters run SQL queries instead of in-memory pandas — demonstrate SQL chops",
        "Add a 'Player career trajectory' view showing year-by-year averages for a chosen player",
      ],
      futureImprovements: [
        "Add authentication (Streamlit-authenticator) so only invited users can see private league data",
        "Schedule a weekly data refresh pipeline using GitHub Actions to pull updated CSVs automatically",
        "Migrate charts to a Plotly Dash app for finer layout control and embed into a standalone web page",
      ],
    },
    {
      id: "ab-test-pipeline",
      name: "End-to-End A/B Test Analysis Pipeline",
      level: "Advanced",
      blurb: "Ingest event logs, run a statistically rigorous A/B test, and auto-publish the result report.",
      estimatedTime: "2–3 weeks",
      objective:
        "Build a fully automated data pipeline that ingests raw user-event log data (clicks, conversions, session durations — use a public dataset such as the Udacity A/B Testing dataset or synthesize realistic data), loads it into a local PostgreSQL database, computes experiment metrics via SQL, and then runs a Python statistical analysis (two-sample t-test, z-test for proportions, effect size, power analysis) before auto-generating a written HTML report with charts and a recommendation. This project demonstrates end-to-end data engineering mindset — not just analysis, but a reproducible, automated system — and is precisely the kind of work that separates a junior analyst candidate from a senior one in Indian product company interviews.",
      features: [
        "Ingestion script: reads raw CSV event logs, validates schema, and bulk-inserts into PostgreSQL using psycopg2 or SQLAlchemy",
        "SQL layer: views or queries that compute per-user conversion rate, average revenue per user, and session metrics split by control vs. treatment group",
        "Python statistical tests: two-sample t-test (scipy.stats), z-test for proportions, Cohen's d effect size, and minimum detectable effect / sample-size calculator",
        "Assumption checks: normality test (Shapiro-Wilk on small samples), variance equality (Levene's test), and guardrail metric checks for novelty effect",
        "Automated HTML report: Jinja2 template populated with test results, Plotly charts (distribution comparison, confidence interval visualization), and a plain-English recommendation",
        "CLI entry point: `python run_pipeline.py --config experiment.yaml` — fully parameterized so any experiment config can be plugged in",
        "Makefile or shell script to spin up the database, run ingestion, run analysis, and open the report in one command",
      ],
      folderStructure: `ab-test-pipeline/
├── config/
│   └── experiment.yaml      # metric names, alpha, power, group column
├── data/
│   └── raw/
│       └── events.csv
├── db/
│   ├── schema.sql           # CREATE TABLE statements
│   └── views.sql            # metric aggregation views
├── pipeline/
│   ├── ingest.py            # CSV → PostgreSQL loader
│   ├── extract.py           # SQL → pandas DataFrames
│   ├── stats.py             # t-test, z-test, effect size, power
│   └── report.py            # Jinja2 HTML report generator
├── templates/
│   └── report.html.j2       # Jinja2 HTML template with embedded Plotly
├── outputs/
│   └── reports/             # generated HTML reports (gitignored)
├── tests/
│   ├── test_ingest.py
│   └── test_stats.py
├── Makefile
├── run_pipeline.py          # CLI entry point
├── requirements.txt
└── README.md`,
      technologies: [
        "Python 3",
        "PostgreSQL + psycopg2 / SQLAlchemy",
        "pandas / NumPy",
        "scipy.stats",
        "Plotly",
        "Jinja2",
        "PyYAML",
        "pytest",
      ],
      skills: [
        "ETL pipeline design and implementation",
        "SQL schema design and aggregation views",
        "Statistical hypothesis testing (t-test, z-test, effect size, power)",
        "Automated report generation",
        "Parameterized, reproducible pipelines via config files",
        "Unit testing data functions",
      ],
      stretchGoals: [
        "Schedule the pipeline with Apache Airflow or a GitHub Actions cron job so it re-runs automatically when new data lands",
        "Add a Streamlit front-end that lets a product manager upload a CSV and see the A/B test result without touching the CLI",
        "Extend to a multi-armed bandit simulation to compare frequentist A/B test vs. Bayesian approach on the same dataset",
      ],
      futureImprovements: [
        "Replace the local PostgreSQL with a cloud database (Supabase free tier or Amazon RDS) and deploy the pipeline to a free EC2 or Railway instance",
        "Add data quality checks using Great Expectations or Pandera before the ingestion step to catch schema drift",
        "Persist experiment results in a 'results' table so multiple experiments can be compared in a historical dashboard",
      ],
    },
  ],
};
