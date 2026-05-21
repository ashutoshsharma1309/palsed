export interface AIRoadmap {
  id: string;
  createdAt: string;
  title: string;
  description: string;
  stages: {
    level: "Beginner" | "Intermediate" | "Advanced";
    title: string;
    description: string;
    timeframe: string;
    skills: { name: string; description: string; importance: string }[];
    resources: {
      name: string;
      type: string;
      url?: string;
      description: string;
      difficulty: string;
      estimated_time: string;
      cost: string;
      prerequisites: string[];
      format: string;
    }[];
    projects: {
      name: string;
      description: string;
      difficulty: string;
      estimated_time: string;
      learning_objectives: string[];
      features: string[];
      skills_practiced: string[];
      resources: string[];
      next_steps: string[];
    }[];
    best_practices: { title: string; description: string; examples: string[] }[];
    common_pitfalls: { issue: string; solution: string }[];
  }[];
  tools: {
    name: string;
    category: string;
    description: string;
    url?: string;
    setup_guide: string;
    pros: string[];
    cons: string[];
    alternatives: string[];
  }[];
  certifications: {
    name: string;
    provider: string;
    level: string;
    description: string;
    cost: string;
    validity: string;
    url?: string;
    preparation_resources: string[];
  }[];
  career_path: {
    roles: string[];
    skills_required: string[];
    progression: string[];
    salary_range: string;
  };
}
