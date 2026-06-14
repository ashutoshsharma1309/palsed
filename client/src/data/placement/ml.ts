import type { HubSection } from "./types";

// Section 5 — Machine Learning
export const ml: HubSection = {
  id: "ml",
  title: "Machine Learning",
  blurb: "From Python foundations to model building and real ML projects.",
  icon: "LineChart",
  accent: "#d6c1ff",
  topics: [
    {
      id: "ml-python",
      title: "Python for ML",
      difficulty: "Beginner",
      resources: [
        { title: "Python for Everybody", type: "video", url: "https://www.py4e.com/" },
        { title: "Kaggle Python", type: "notes", url: "https://www.kaggle.com/learn/python" },
      ],
    },
    {
      id: "ml-numpy",
      title: "NumPy",
      difficulty: "Beginner",
      resources: [
        { title: "NumPy Quickstart", type: "notes", url: "https://numpy.org/doc/stable/user/quickstart.html" },
        { title: "NumPy Cheat Sheet", type: "notes", url: "https://www.datacamp.com/cheat-sheet/numpy-cheat-sheet-data-analysis-in-python", tags: ["cheatsheet"] },
      ],
    },
    {
      id: "ml-pandas",
      title: "Pandas",
      difficulty: "Beginner",
      resources: [
        { title: "Kaggle Pandas", type: "notes", url: "https://www.kaggle.com/learn/pandas" },
        { title: "Pandas Docs", type: "notes", url: "https://pandas.pydata.org/docs/user_guide/index.html" },
      ],
    },
    {
      id: "ml-matplotlib",
      title: "Matplotlib",
      difficulty: "Beginner",
      resources: [
        { title: "Matplotlib Tutorials", type: "notes", url: "https://matplotlib.org/stable/tutorials/index.html" },
        { title: "Data Visualization (Kaggle)", type: "notes", url: "https://www.kaggle.com/learn/data-visualization" },
      ],
    },
    {
      id: "ml-data-cleaning",
      title: "Data Cleaning",
      difficulty: "Intermediate",
      resources: [
        { title: "Data Cleaning (Kaggle)", type: "notes", url: "https://www.kaggle.com/learn/data-cleaning" },
      ],
    },
    {
      id: "ml-fundamentals",
      title: "ML Fundamentals",
      difficulty: "Intermediate",
      resources: [
        { title: "AI/ML Roadmap (roadmap.sh)", type: "roadmap", url: "https://roadmap.sh/ai-data-scientist" },
        { title: "Google ML Crash Course", type: "video", url: "https://developers.google.com/machine-learning/crash-course" },
        { title: "Andrew Ng — ML Specialization", type: "video", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
      ],
    },
    {
      id: "ml-scikit",
      title: "Scikit-Learn",
      difficulty: "Intermediate",
      resources: [
        { title: "scikit-learn User Guide", type: "notes", url: "https://scikit-learn.org/stable/user_guide.html" },
        { title: "Intro to ML (Kaggle)", type: "notes", url: "https://www.kaggle.com/learn/intro-to-machine-learning" },
      ],
    },
    {
      id: "ml-model-building",
      title: "Model Building",
      difficulty: "Advanced",
      resources: [
        { title: "Intermediate ML (Kaggle)", type: "notes", url: "https://www.kaggle.com/learn/intermediate-machine-learning" },
        { title: "ML Mastery", type: "notes", url: "https://machinelearningmastery.com/start-here/" },
      ],
    },
    {
      id: "ml-projects",
      title: "ML Projects",
      difficulty: "Advanced",
      resources: [
        { title: "500 ML Projects (GitHub)", type: "repo", url: "https://github.com/ashishpatel26/500-AI-Machine-learning-Deep-learning-Computer-vision-NLP-Projects-with-code" },
        { title: "Kaggle Competitions", type: "practice", url: "https://www.kaggle.com/competitions", difficulty: "Advanced" },
      ],
    },
  ],
};
