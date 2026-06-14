import type { HubSection } from "./types";

// Section 6 — Artificial Intelligence
export const ai: HubSection = {
  id: "ai",
  title: "Artificial Intelligence",
  blurb: "Modern AI: LLMs, prompting, RAG, agents, and generative AI projects.",
  icon: "Sparkles",
  accent: "#ffd4b0",
  topics: [
    {
      id: "ai-fundamentals",
      title: "AI Fundamentals",
      difficulty: "Beginner",
      resources: [
        { title: "AI Roadmap (roadmap.sh)", type: "roadmap", url: "https://roadmap.sh/ai-engineer" },
        { title: "Elements of AI", type: "notes", url: "https://www.elementsofai.com/" },
      ],
    },
    {
      id: "ai-llms",
      title: "Large Language Models",
      difficulty: "Intermediate",
      resources: [
        { title: "Andrej Karpathy — Intro to LLMs", type: "video", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g" },
        { title: "Hugging Face LLM Course", type: "notes", url: "https://huggingface.co/learn/llm-course" },
      ],
    },
    {
      id: "ai-prompt-engineering",
      title: "Prompt Engineering",
      difficulty: "Beginner",
      resources: [
        { title: "Prompt Engineering Guide", type: "notes", url: "https://www.promptingguide.ai/" },
        { title: "Anthropic Prompt Engineering", type: "notes", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview" },
      ],
    },
    {
      id: "ai-rag",
      title: "RAG",
      difficulty: "Intermediate",
      resources: [
        { title: "RAG Explained (LangChain)", type: "notes", url: "https://python.langchain.com/docs/tutorials/rag/" },
        { title: "Building RAG (GitHub)", type: "repo", url: "https://github.com/langchain-ai/rag-from-scratch" },
      ],
    },
    {
      id: "ai-agents",
      title: "AI Agents",
      difficulty: "Advanced",
      resources: [
        { title: "Hugging Face Agents Course", type: "notes", url: "https://huggingface.co/learn/agents-course" },
        { title: "Building Effective Agents (Anthropic)", type: "notes", url: "https://www.anthropic.com/research/building-effective-agents" },
      ],
    },
    {
      id: "ai-vector-db",
      title: "Vector Databases",
      difficulty: "Intermediate",
      resources: [
        { title: "What is a Vector DB (Pinecone)", type: "notes", url: "https://www.pinecone.io/learn/vector-database/" },
        { title: "Chroma Docs", type: "notes", url: "https://docs.trychroma.com/" },
      ],
    },
    {
      id: "ai-fine-tuning",
      title: "Fine-Tuning",
      difficulty: "Advanced",
      resources: [
        { title: "Fine-tuning Guide (Hugging Face)", type: "notes", url: "https://huggingface.co/docs/transformers/training" },
      ],
    },
    {
      id: "ai-genai-projects",
      title: "Generative AI Projects",
      difficulty: "Advanced",
      resources: [
        { title: "GenAI for Beginners (GitHub)", type: "repo", url: "https://github.com/microsoft/generative-ai-for-beginners" },
        { title: "Build with LangChain (GitHub)", type: "repo", url: "https://github.com/langchain-ai/langchain" },
      ],
    },
  ],
};
