import type { ProjectDomain } from "./types";

export const aiMachineLearning: ProjectDomain = {
  id: "ai-machine-learning",
  title: "AI / Machine Learning",
  icon: "BrainCircuit",
  accent: "purple",
  blurb: "Build models that learn — from tabular ML to NLP, CV, and RAG-powered LLM apps.",
  overview:
    "AI and Machine Learning have moved from research labs to every product roadmap. Indian placement cycles increasingly test ML fundamentals in technical rounds, and companies from Flipkart to startups building on LLMs want engineers who understand the full pipeline: data wrangling, feature engineering, model training, evaluation, and — critically — **deployment**. A Jupyter notebook alone is never enough; a deployed API or Streamlit app that a recruiter can interact with is what separates strong candidates.\n\nThis path takes you from classical ML on tabular data (the bedrock that still dominates data-science roles) through applied NLP/CV using transfer learning, to the frontier: building **RAG (Retrieval-Augmented Generation) applications** on top of large language models. Each project is scoped to produce something demoable, reproducible, and metric-backed — the three qualities that make ML projects interview-ready.",
  skillsRequired: [
    "Python fundamentals (functions, list comprehensions, file I/O, classes)",
    "NumPy and Pandas for data manipulation",
    "Basic statistics (mean, variance, distributions, correlation)",
    "Comfort with Jupyter Notebooks or VS Code",
    "Git & GitHub for version control",
    "Basic command line usage (virtual environments, pip)",
  ],
  learningOrder: [
    "Python for data science: NumPy, Pandas, Matplotlib/Seaborn — data loading, cleaning, EDA",
    "Core ML concepts: supervised vs. unsupervised, bias-variance, train/val/test splits, cross-validation",
    "Scikit-learn: preprocessing, pipelines, classification/regression models, evaluation metrics",
    "Model selection & tuning: GridSearchCV, feature importance, regularisation, overfitting strategies",
    "Deep learning foundations: neural network basics, PyTorch or Keras, training loops, GPU basics",
    "Transfer learning & fine-tuning: pre-trained models for NLP (BERT/DistilBERT) and CV (ResNet/EfficientNet)",
    "LLM ecosystem: OpenAI/Hugging Face APIs, embeddings, vector databases (FAISS, Chroma), LangChain/LlamaIndex",
    "Deployment: FastAPI or Flask for ML APIs, Streamlit for demos, Docker, and hosting on Hugging Face Spaces or Render",
  ],
  difficulty: "Intermediate → Advanced (Python + stats required)",
  techStack: [
    "Python 3.11+",
    "NumPy / Pandas / Matplotlib / Seaborn",
    "Scikit-learn",
    "PyTorch / Hugging Face Transformers",
    "FastAPI / Streamlit",
    "LangChain / LlamaIndex",
    "FAISS / ChromaDB",
    "Docker / Hugging Face Spaces / Render",
  ],
  githubResources: [
    {
      label: "Awesome Machine Learning",
      url: "https://github.com/josephmisiti/awesome-machine-learning",
      kind: "repo",
    },
    {
      label: "Made With ML (MLOps & production ML)",
      url: "https://github.com/GokuMohandas/Made-With-ML",
      kind: "repo",
    },
    {
      label: "LangChain (LLM application framework)",
      url: "https://github.com/langchain-ai/langchain",
      kind: "repo",
    },
    {
      label: "Hugging Face Transformers",
      url: "https://github.com/huggingface/transformers",
      kind: "repo",
    },
    {
      label: "Scikit-learn (examples & source)",
      url: "https://github.com/scikit-learn/scikit-learn",
      kind: "repo",
    },
  ],
  learningResources: [
    {
      label: "fast.ai — Practical Deep Learning for Coders",
      url: "https://course.fast.ai/",
      kind: "course",
    },
    {
      label: "Andrew Ng — Machine Learning Specialization (Coursera)",
      url: "https://www.coursera.org/specializations/machine-learning-introduction",
      kind: "course",
    },
    {
      label: "Hugging Face NLP Course (free)",
      url: "https://huggingface.co/learn/nlp-course/",
      kind: "docs",
    },
    {
      label: "Kaggle Learn — ML micro-courses",
      url: "https://www.kaggle.com/learn",
      kind: "course",
    },
    {
      label: "roadmap.sh — AI & Data Scientist",
      url: "https://roadmap.sh/ai-data-scientist",
      kind: "roadmap",
    },
  ],
  portfolioTips: [
    "Every project must be deployed and demoable — a Streamlit app on Hugging Face Spaces or a FastAPI on Render is free and immediately shareable.",
    "Always report evaluation metrics (accuracy, F1, RMSE, etc.) in the README; include a confusion matrix or sample predictions screenshot.",
    "Pin library versions in requirements.txt or environment.yml so anyone can reproduce your results exactly.",
    "Add a short section to the README explaining the problem framing, dataset choice, and why you selected your model architecture.",
    "Record a short Loom/GIF walkthrough of the live demo and embed it at the top of the README for quick reviewer impact.",
  ],
  resumeTips: [
    "Lead with the metric: 'Trained a sentiment classifier achieving 91% F1 on the IMDB dataset, deployed as a REST API'.",
    "Name the full stack (PyTorch, Hugging Face, FastAPI, Docker) — recruiters and ATS systems keyword-match these.",
    "Quantify data scale: '50 000-row dataset', '1 M tokens', '10 k documents indexed' — it signals production awareness.",
    "Link both the live demo and the GitHub repo in the bullet; make it one click to verify the claim.",
    "Mention reproducibility: 'experiments tracked with MLflow / Weights & Biases, model card included'.",
  ],
  interviewRelevance:
    "ML projects unlock a wide swathe of placement interview questions. **SDE rounds** use them as context for system design: 'How would you serve this model at 10 k QPS?' or 'How do you retrain when data drifts?'. **Data science rounds** probe your metric choices, class-imbalance handling, and feature-engineering decisions. **LLM/GenAI startup rounds** increasingly ask how RAG differs from fine-tuning and when you'd choose each.\n\nIn Indian product-company interviews (Google, Microsoft, Flipkart, Swiggy, etc.) showing a deployed, metric-backed project is a strong differentiator — most candidates have notebooks, not demos. Expect follow-ups on **bias-variance trade-off, precision vs. recall trade-offs, embedding similarity search, and vector database indexing** once you list these projects on your resume.",
  projects: [
    {
      id: "tabular-ml-pipeline",
      name: "End-to-End ML Pipeline on Tabular Data",
      level: "Beginner",
      blurb: "EDA → feature engineering → model training → evaluation → Streamlit demo, all in one reproducible repo.",
      estimatedTime: "1–2 weekends",
      objective:
        "Build a complete, reproducible machine-learning pipeline on a real-world tabular dataset — the kind used in Kaggle competitions and data-science hiring challenges. Pick a dataset with genuine prediction value (e.g., house price prediction, loan default, churn, or crop yield). Go from raw CSV to a deployed Streamlit app where someone can enter inputs and get a live prediction. This proves you understand the full ML workflow, not just model.fit().",
      features: [
        "Exploratory Data Analysis (EDA) notebook with distribution plots, correlation heatmap, and missing-value analysis",
        "Preprocessing pipeline using scikit-learn Pipeline + ColumnTransformer (imputation, encoding, scaling)",
        "Comparison of at least 3 models (e.g., Logistic Regression / Linear Regression, Random Forest, XGBoost) with cross-validated metrics",
        "Hyperparameter tuning via GridSearchCV or Optuna, with best-model selection justified by validation score",
        "Evaluation report: classification (confusion matrix, precision, recall, F1, ROC-AUC) or regression (RMSE, MAE, R²)",
        "Streamlit app deployed on Hugging Face Spaces that accepts user input and returns a prediction with confidence",
      ],
      folderStructure: `tabular-ml-pipeline/
├── data/
│   ├── raw/                    # original downloaded CSV (git-ignored if large)
│   └── processed/              # cleaned, feature-engineered CSV
├── notebooks/
│   ├── 01_eda.ipynb
│   ├── 02_preprocessing.ipynb
│   └── 03_modelling.ipynb
├── src/
│   ├── preprocess.py           # reusable Pipeline builder
│   ├── train.py                # training script (CLI-runnable)
│   └── evaluate.py             # metrics + charts
├── models/
│   └── best_model.pkl          # serialised with joblib
├── app/
│   └── streamlit_app.py        # loads model, accepts input, returns prediction
├── requirements.txt
├── README.md
└── .gitignore`,
      technologies: [
        "Python 3.11",
        "Pandas / NumPy",
        "Scikit-learn",
        "XGBoost / LightGBM",
        "Matplotlib / Seaborn",
        "Streamlit",
        "Hugging Face Spaces (deployment)",
        "joblib (model serialisation)",
      ],
      skills: [
        "Exploratory data analysis and visualisation",
        "Feature engineering and scikit-learn Pipelines",
        "Model comparison and cross-validation",
        "Hyperparameter tuning",
        "Evaluation metric selection and interpretation",
        "Streamlit app development and deployment",
      ],
      stretchGoals: [
        "Track experiments with MLflow or Weights & Biases, log metrics and artefacts for every run",
        "Add SHAP value plots to the Streamlit app so users can see which features drove each prediction",
        "Write a model card (model performance, data source, limitations, intended use) in the README following Hugging Face conventions",
      ],
      futureImprovements: [
        "Replace the static model file with a scheduled retraining script that pulls fresh data monthly",
        "Add data-drift monitoring (Evidently AI) to alert when production inputs diverge from training distribution",
        "Package the pipeline as a Docker image and deploy to a cloud run service for a production-grade API",
      ],
    },
    {
      id: "nlp-sentiment-api",
      name: "NLP Sentiment Analysis Service",
      level: "Intermediate",
      blurb: "Fine-tune a pre-trained transformer, wrap it in a FastAPI, and deploy it as a real REST service.",
      estimatedTime: "1–2 weeks",
      objective:
        "Build a production-style sentiment analysis microservice by fine-tuning a DistilBERT model on a domain-specific dataset (e.g., product reviews, movie reviews, or social media posts). Serve it through a FastAPI REST endpoint with batch support and confidence scores, then deploy it as a Docker container on Render or Hugging Face Inference Endpoints. This project proves you can work with the Hugging Face ecosystem end-to-end and understand transfer learning — a skill that is now core to most NLP/GenAI roles.",
      features: [
        "Dataset preparation: download from Hugging Face Hub or Kaggle, tokenise with AutoTokenizer, create DataLoader with train/val/test splits",
        "Fine-tuning loop: DistilBERT (or RoBERTa) with Hugging Face Trainer API, tracking loss, accuracy, and F1 per epoch",
        "Evaluation report saved to disk: classification report, per-class F1, confusion matrix PNG",
        "FastAPI service with /predict (single text) and /predict-batch (list, max 32) endpoints, returning label + confidence score",
        "Input validation with Pydantic models and error handling for empty or oversized inputs",
        "Containerised with Docker; deployed on Render free tier with a public URL and documented via auto-generated /docs (Swagger UI)",
      ],
      folderStructure: `nlp-sentiment-api/
├── data/
│   └── dataset_card.md         # source, licence, splits description
├── training/
│   ├── train.py                # Hugging Face Trainer fine-tuning script
│   ├── evaluate.py             # metrics + confusion matrix
│   └── config.yaml             # hyperparams (lr, epochs, batch size)
├── model/
│   └── sentiment-distilbert/   # saved via model.save_pretrained()
│       ├── config.json
│       ├── tokenizer_config.json
│       └── pytorch_model.bin
├── api/
│   ├── main.py                 # FastAPI app
│   ├── schemas.py              # Pydantic request/response models
│   └── predictor.py            # model loading + inference helper
├── Dockerfile
├── requirements.txt
├── README.md
└── .gitignore`,
      technologies: [
        "Python 3.11",
        "Hugging Face Transformers + Datasets",
        "PyTorch",
        "FastAPI + Uvicorn",
        "Pydantic v2",
        "Docker",
        "Render (deployment)",
        "Scikit-learn (evaluation metrics)",
      ],
      skills: [
        "Transfer learning and transformer fine-tuning",
        "Hugging Face Trainer API and model hub",
        "REST API design with FastAPI",
        "Pydantic data validation",
        "Docker containerisation",
        "NLP evaluation metrics (F1, confusion matrix)",
      ],
      stretchGoals: [
        "Expose a /explain endpoint that returns LIME or Integrated Gradients token-level attributions for each prediction",
        "Add request logging and a /metrics endpoint compatible with Prometheus so you can graph latency and error rates",
        "Build a minimal React or Streamlit frontend that calls the API and renders sentiment with a confidence bar chart",
      ],
      futureImprovements: [
        "Replace Docker-on-Render with a Kubernetes deployment (minikube locally, then GKE/EKS) to demonstrate orchestration",
        "Add an A/B testing harness that splits traffic between the DistilBERT model and a lighter TF-IDF + Logistic Regression baseline",
        "Fine-tune on a multilingual dataset (e.g., Hindi product reviews) to support Indic languages — high value for Indian product companies",
      ],
    },
    {
      id: "rag-document-chat",
      name: "RAG-Powered Document Chat App",
      level: "Advanced",
      blurb: "Chat with your own documents using embeddings, a vector DB, and an LLM — the canonical GenAI portfolio project.",
      estimatedTime: "2–3 weeks",
      objective:
        "Build a Retrieval-Augmented Generation (RAG) application that lets users upload PDF or text documents and ask natural-language questions answered by an LLM grounded in those documents. The system ingests documents into a vector database (ChromaDB or FAISS), retrieves the most semantically relevant chunks at query time, and feeds them as context to an LLM (OpenAI GPT-4o or a Hugging Face model) to generate accurate, citation-backed answers. Deploy as a full-stack web app with a chat UI. This is the project that immediately signals 'I understand the GenAI stack' in 2025 interviews.",
      features: [
        "Document ingestion pipeline: upload PDFs/text, chunk with RecursiveCharacterTextSplitter, embed with sentence-transformers or OpenAI embeddings, and upsert into ChromaDB with metadata",
        "Semantic retrieval: cosine similarity search returning top-k chunks with source filenames and page numbers for citation",
        "LLM answer generation: structured prompt template that injects retrieved context and instructs the model to cite sources and say 'I don't know' when context is insufficient",
        "Conversation memory: maintain multi-turn chat history using LangChain ConversationBufferMemory so follow-up questions are resolved in context",
        "Streamlit or Next.js chat UI with file upload, chat history display, and expandable 'Sources' panel showing which document chunks were used",
        "Evaluation harness: 5–10 ground-truth Q&A pairs with automated RAGAS (faithfulness, answer relevancy, context recall) scoring logged to a results JSON",
      ],
      folderStructure: `rag-document-chat/
├── ingest/
│   ├── loader.py               # PDF/text loading with PyMuPDF / Unstructured
│   ├── chunker.py              # RecursiveCharacterTextSplitter config
│   └── embedder.py             # embed + upsert to ChromaDB
├── retrieval/
│   └── retriever.py            # ChromaDB query, top-k, metadata filter
├── generation/
│   ├── prompt_templates.py     # system + human prompt strings
│   └── chain.py                # LangChain RAG chain / LCEL pipeline
├── evaluation/
│   ├── ground_truth.json       # Q&A pairs for RAGAS eval
│   └── evaluate.py             # RAGAS metrics runner
├── app/
│   ├── streamlit_app.py        # chat UI with file upload + sources panel
│   └── styles.css
├── chroma_db/                  # persisted vector store (git-ignored)
├── .env.example                # OPENAI_API_KEY, CHUNK_SIZE, TOP_K, etc.
├── requirements.txt
├── README.md
└── .gitignore`,
      technologies: [
        "Python 3.11",
        "LangChain / LangChain-Community",
        "ChromaDB (vector database)",
        "sentence-transformers (or OpenAI Embeddings API)",
        "OpenAI GPT-4o (or Mistral / Llama via Hugging Face)",
        "PyMuPDF / Unstructured (PDF parsing)",
        "Streamlit (chat UI)",
        "RAGAS (RAG evaluation framework)",
        "python-dotenv",
      ],
      skills: [
        "RAG pipeline design (ingestion, chunking, embedding, retrieval, generation)",
        "Vector database operations and similarity search",
        "Prompt engineering for grounded, citation-aware LLM responses",
        "LangChain / LCEL chain composition",
        "RAG evaluation with RAGAS metrics",
        "Multi-turn conversation memory management",
      ],
      stretchGoals: [
        "Add hybrid search (BM25 keyword + vector cosine) with Reciprocal Rank Fusion to improve retrieval on acronym-heavy technical documents",
        "Implement HyDE (Hypothetical Document Embeddings): generate a hypothetical answer first and embed it for retrieval, then compare F1 gain in the evaluation harness",
        "Build a FastAPI backend + Next.js frontend instead of Streamlit, with user auth (Supabase) so different users maintain separate document collections",
      ],
      futureImprovements: [
        "Add an automated re-ingestion webhook: watch a Google Drive folder or S3 bucket and update the vector store when new documents are added",
        "Fine-tune a small reranker model (cross-encoder) on domain-specific Q&A pairs to improve context selection beyond cosine similarity",
        "Add observability with LangSmith or Arize Phoenix to trace every retrieval + generation step in production and catch hallucinations in real time",
      ],
    },
  ],
};
