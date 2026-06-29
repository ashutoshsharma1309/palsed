import type { ProjectDomain } from "./types";

export const cloudComputing: ProjectDomain = {
  id: "cloud-computing",
  title: "Cloud Computing",
  icon: "Cloud",
  accent: "blue",
  blurb: "Deploy, architect, and automate apps on AWS — the skill every backend team needs.",
  overview:
    "Cloud computing has become a baseline expectation at product and service companies, not a specialty. Knowing how to spin up infrastructure, write a serverless function, and automate deployments with code makes you dangerous across backend, DevOps, and SRE roles. AWS commands the largest market share in India's tech hiring landscape, and familiarity with its core services — S3, EC2, Lambda, API Gateway, RDS, DynamoDB, VPC, CloudFront — translates directly to day-one productivity at most product companies. The concepts (object storage, managed databases, serverless compute, CDNs, IAM) are also portable to GCP and Azure.\n\nThe best way to learn cloud is to *build and deploy real things while watching the bill*. AWS offers a generous Free Tier that covers nearly everything you'll need for portfolio projects. Working within cost constraints teaches you something no course can: how to choose the right service for the job, prefer managed over self-managed where it matters, and shut down what you're not using. Three shipped, deployed projects — a static site with a serverless backend, a REST API with CI/CD, and a multi-tier IaC setup — are worth more to a recruiter than a dozen badges.",
  skillsRequired: [
    "Linux command line basics (file system, SSH, environment variables)",
    "Python or Node.js scripting (Lambda functions are written in one of these)",
    "Git & GitHub — push/pull, branches, PRs",
    "Basic networking concepts (IP, ports, HTTP, DNS)",
    "JSON / YAML familiarity (for configs, policies, IaC templates)",
  ],
  learningOrder: [
    "AWS account setup, IAM best practices (MFA, least-privilege, avoid root), and the Free Tier limits",
    "Core storage & delivery: S3 (buckets, policies, static hosting) + CloudFront (CDN, HTTPS, cache)",
    "Serverless compute: AWS Lambda (handlers, triggers, environment variables, IAM roles)",
    "Managed databases: DynamoDB (tables, PK/SK, queries) and RDS basics (Postgres on managed infra)",
    "API Gateway: build and secure HTTP APIs, connect to Lambda, manage stages and throttling",
    "Networking fundamentals: VPC, subnets (public/private), security groups, NAT Gateway, and ALB",
    "Infrastructure as Code: Terraform (providers, resources, state, modules) to reproducibly provision AWS",
    "CI/CD pipelines: GitHub Actions deploying Lambdas & static sites; cost monitoring with AWS Budgets",
  ],
  difficulty: "Intermediate → Advanced (Beginner-accessible with Free Tier)",
  techStack: [
    "AWS S3 / CloudFront",
    "AWS Lambda / API Gateway",
    "AWS DynamoDB / RDS (PostgreSQL)",
    "AWS VPC / EC2 / ALB / Auto Scaling",
    "AWS IAM / CloudWatch / SNS",
    "Terraform (HashiCorp)",
    "Docker / Amazon ECR",
    "GitHub Actions (CI/CD)",
    "AWS CLI / SAM CLI",
    "GCP / Azure (concept parity)",
  ],
  githubResources: [
    {
      label: "Awesome AWS — curated list of AWS tools, libs, and guides",
      url: "https://github.com/donnemartin/awesome-aws",
      kind: "repo",
    },
    {
      label: "aws-samples — official AWS sample architectures and workshops",
      url: "https://github.com/aws-samples",
      kind: "repo",
    },
    {
      label: "Terraform AWS Modules — battle-tested community modules",
      url: "https://github.com/terraform-aws-modules",
      kind: "repo",
    },
    {
      label: "Cloud Resume Challenge — the original project spec",
      url: "https://github.com/cloudresumechallenge/projects",
      kind: "repo",
    },
    {
      label: "LocalStack — run AWS services locally for free during dev",
      url: "https://github.com/localstack/localstack",
      kind: "tool",
    },
  ],
  learningResources: [
    {
      label: "AWS Free Tier — official docs and service limits",
      url: "https://aws.amazon.com/free/",
      kind: "docs",
    },
    {
      label: "Cloud Resume Challenge — guided beginner project",
      url: "https://cloudresumechallenge.dev/docs/the-challenge/aws/",
      kind: "course",
    },
    {
      label: "roadmap.sh — AWS / Cloud Engineer roadmap",
      url: "https://roadmap.sh/aws",
      kind: "roadmap",
    },
    {
      label: "freeCodeCamp — AWS Certified Cloud Practitioner full course (YouTube)",
      url: "https://www.youtube.com/watch?v=SOTamWNgDKc",
      kind: "video",
    },
    {
      label: "Terraform: Getting Started — official HashiCorp tutorials",
      url: "https://developer.hashicorp.com/terraform/tutorials/aws-get-started",
      kind: "docs",
    },
  ],
  portfolioTips: [
    "Include architecture diagrams (draw.io / Excalidraw) in every README — a diagram shows system-thinking at a glance.",
    "Record a 90-second Loom walkthrough of each project: open the live URL, hit the API, show the AWS Console. Embed the link in the README.",
    "Document cost: add a 'Cost' section to the README showing how the project stays within AWS Free Tier, or the actual monthly bill (often < $1). This signals cost-awareness, which senior engineers prize.",
    "Keep Terraform code in the repo — 'infrastructure as code' is a key talking point. A reviewer can clone and reproduce your environment.",
    "Tag every AWS resource with a project name and environment (dev/prod) so costs are traceable and the console isn't a mess.",
  ],
  resumeTips: [
    "Lead with the architecture, not the tool: 'Architected a serverless REST API on AWS Lambda + API Gateway handling X requests/month within Free Tier.'",
    "Call out IaC explicitly: 'Provisioned all infrastructure via Terraform; zero manual console clicks in production.'",
    "Quantify latency or availability: 'Achieved p99 < 200 ms via CloudFront caching and Lambda cold-start optimization.'",
    "Mention CI/CD: 'Automated deployments with GitHub Actions; zero-downtime deploys to Lambda via SAM.'",
    "Add certification status if earned: 'AWS Certified Cloud Practitioner (CLF-C02)' — even the entry-level cert signals commitment to Indian placement teams.",
  ],
  interviewRelevance:
    "Cloud projects unlock multiple interview tracks simultaneously. In **system design rounds** (increasingly common at product companies for 2+ YOE), you can speak to *decisions you actually made*: why Lambda over EC2, how you handled DynamoDB's eventual consistency, how you'd add a queue between services to absorb traffic spikes. In **backend rounds**, expect questions on how IAM roles work, what a VPC is, and how you'd design an S3 lifecycle policy.\n\nFor Indian placements specifically, **AWS Cloud Practitioner (CLF-C02)** and **AWS Solutions Architect – Associate (SAA-C03)** are increasingly listed as differentiators in JD screening at companies like Infosys, TCS Digital, Wipro Elite, Juspay, and funded startups. Even without a cert, demoing deployed cloud projects puts you ahead of 90% of candidates who only know local setups. Cloud knowledge also surfaces in HR rounds at cloud-native firms: 'Tell me about something you deployed' is a common opener.",
  projects: [
    {
      id: "cloud-resume-challenge",
      name: "Cloud Resume Challenge",
      level: "Beginner",
      blurb: "Your résumé as a live website — served from S3/CloudFront with a Lambda-powered visitor counter.",
      estimatedTime: "1–2 weekends",
      objective:
        "Deploy a static personal résumé site to AWS S3 with HTTPS via CloudFront, and add a real-time visitor counter backed by a Python Lambda function and DynamoDB — all within the AWS Free Tier. This is the canonical first cloud project: it touches object storage, CDN, serverless compute, a NoSQL database, and IAM permissions, giving you a concrete story for every layer of the stack.",
      features: [
        "HTML/CSS résumé hosted as a static site on an S3 bucket with public website hosting disabled (served only through CloudFront)",
        "CloudFront distribution with a custom domain (or *.cloudfront.net) and HTTPS via ACM certificate",
        "Visitor counter displayed on the résumé page, persisted in a DynamoDB table",
        "Python Lambda function triggered by an API Gateway HTTP endpoint — increments and returns the counter",
        "IAM role for Lambda with least-privilege access (only the one DynamoDB table, no broad policies)",
        "GitHub Actions workflow that syncs the site to S3 and creates a CloudFront invalidation on every push to main",
      ],
      folderStructure: `cloud-resume/
├── frontend/
│   ├── index.html           # résumé markup
│   ├── styles/
│   │   └── resume.css
│   └── scripts/
│       └── counter.js       # fetch() call to API Gateway
├── backend/
│   ├── lambda/
│   │   ├── handler.py       # increment + get counter
│   │   └── requirements.txt # boto3 (pre-installed on Lambda)
│   └── tests/
│       └── test_handler.py  # pytest unit tests
├── infra/
│   ├── main.tf              # S3, CloudFront, DynamoDB, Lambda, API GW
│   ├── iam.tf               # Lambda execution role
│   ├── variables.tf
│   └── outputs.tf           # site URL, API endpoint
├── .github/
│   └── workflows/
│       └── deploy.yml       # lint → test → tf apply → s3 sync → CF invalidate
└── README.md                # architecture diagram + cost breakdown`,
      technologies: [
        "AWS S3 (static hosting)",
        "AWS CloudFront (CDN + HTTPS)",
        "AWS Lambda (Python 3.12)",
        "AWS API Gateway (HTTP API)",
        "AWS DynamoDB (counter table)",
        "AWS ACM (TLS certificate)",
        "AWS IAM (least-privilege role)",
        "Terraform",
        "GitHub Actions",
      ],
      skills: [
        "S3 bucket policies and static site configuration",
        "CloudFront origin access control (OAC) and cache invalidation",
        "Serverless Lambda function authoring (Python)",
        "DynamoDB single-table reads and atomic counter updates",
        "IAM role design with least privilege",
        "Infrastructure as Code with Terraform",
        "CI/CD pipeline with GitHub Actions",
      ],
      stretchGoals: [
        "Add a custom domain via Route 53 so the résumé lives at your own .com",
        "Protect the API with an API key or AWS WAF to prevent counter spam",
        "Add CloudWatch dashboard + alarm that emails you when the counter hits a milestone",
      ],
      futureImprovements: [
        "Migrate the Terraform state to S3 + DynamoDB remote backend for team-safe state locking",
        "Add end-to-end Cypress tests (or Playwright) in CI that hit the live URL and verify the counter increments",
        "Extend into a full personal site (blog, projects) using a static site generator like Hugo or Astro, still deployed the same way",
      ],
    },
    {
      id: "serverless-rest-api",
      name: "Serverless REST API with CI/CD",
      level: "Intermediate",
      blurb: "A production-grade CRUD API on Lambda + API Gateway + DynamoDB, deployed automatically on every merge.",
      estimatedTime: "1–2 weeks",
      objective:
        "Build a fully serverless REST API for a real use-case (e.g., a URL shortener, a bookmarks store, or a notes app) using API Gateway, AWS Lambda (Node.js or Python), and DynamoDB as the data layer. The API must be secured with JWT auth (via Amazon Cognito or a custom authorizer), versioned with semantic routes, and deployed end-to-end through a GitHub Actions pipeline — zero manual console clicks after initial bootstrap. This project demonstrates that you can ship a backend that scales to zero when idle (no idle EC2 cost) and to thousands of requests when needed.",
      features: [
        "CRUD endpoints: POST /items, GET /items, GET /items/{id}, PUT /items/{id}, DELETE /items/{id}",
        "JWT-based authentication via a Lambda authorizer or Amazon Cognito User Pool",
        "DynamoDB single-table design with partition key + sort key for efficient access patterns",
        "Input validation and structured error responses (RFC 7807 problem+json)",
        "Request throttling and usage plans on API Gateway to prevent abuse",
        "GitHub Actions pipeline: lint → unit tests → SAM build → SAM deploy (staging) → integration tests → promote to prod",
        "CloudWatch structured logging and a simple dashboard showing invocation count, errors, and p99 duration",
      ],
      folderStructure: `serverless-api/
├── src/
│   ├── handlers/
│   │   ├── createItem.js    # POST handler
│   │   ├── getItem.js
│   │   ├── listItems.js
│   │   ├── updateItem.js
│   │   └── deleteItem.js
│   ├── lib/
│   │   ├── dynamo.js        # DynamoDB DocumentClient wrapper
│   │   ├── auth.js          # JWT verification helper
│   │   └── response.js      # standard response builder
│   └── authorizer/
│       └── index.js         # Lambda authorizer
├── tests/
│   ├── unit/
│   │   └── handlers.test.js # Jest unit tests with mocked DynamoDB
│   └── integration/
│       └── api.test.js      # supertest-style HTTP tests against staging URL
├── infra/
│   ├── template.yaml        # AWS SAM template (API GW + Lambdas + DynamoDB)
│   └── samconfig.toml       # deploy targets: staging, prod
├── .github/
│   └── workflows/
│       └── pipeline.yml     # full CI/CD pipeline
├── docs/
│   └── architecture.png     # draw.io export
└── README.md`,
      technologies: [
        "AWS Lambda (Node.js 20.x)",
        "AWS API Gateway (REST API)",
        "AWS DynamoDB (single-table design)",
        "AWS Cognito (User Pools) or custom JWT authorizer",
        "AWS SAM CLI (build + deploy)",
        "AWS CloudWatch (logs + metrics)",
        "GitHub Actions",
        "Jest (unit + integration tests)",
      ],
      skills: [
        "Serverless architecture design and trade-off analysis",
        "DynamoDB single-table access pattern modeling",
        "Lambda authorizer implementation and JWT verification",
        "API Gateway stages, throttling, and usage plans",
        "SAM template authoring and multi-stage deployments",
        "Structured logging and CloudWatch metrics",
        "End-to-end CI/CD pipeline construction",
      ],
      stretchGoals: [
        "Add an SQS queue between the API and DynamoDB writes to absorb bursts and enable retry logic without client-side retries",
        "Implement a dead-letter queue (DLQ) on Lambda and alert via SNS when messages fail processing",
        "Generate an OpenAPI spec from the SAM template and publish interactive docs to an S3-hosted Swagger UI",
      ],
      futureImprovements: [
        "Migrate from SAM to Terraform for infrastructure so the same IaC toolchain covers all projects in the portfolio",
        "Add AWS X-Ray tracing to visualize the full request path and identify cold-start overhead",
        "Implement a canary deployment strategy (10% traffic to new Lambda version, auto-rollback on error spike) using Lambda aliases and CodeDeploy",
      ],
    },
    {
      id: "multi-tier-iac",
      name: "Multi-Tier App with Terraform, VPC, and Auto Scaling",
      level: "Advanced",
      blurb: "A production-like three-tier architecture on AWS, fully provisioned with Terraform and observable end-to-end.",
      estimatedTime: "3–4 weeks",
      objective:
        "Design and deploy a containerized three-tier web application (frontend, Node/Python API, RDS PostgreSQL) inside a custom VPC with public and private subnets, an Application Load Balancer, an Auto Scaling Group for the API tier, and an RDS instance in a private subnet — all provisioned with reusable Terraform modules and zero manual console intervention. Add CloudWatch alarms and a Grafana dashboard for observability. This project directly mirrors what a cloud/DevOps engineer does on day one at a product company and makes for exceptional system-design interview material.",
      features: [
        "Custom VPC with two public subnets (ALB, NAT Gateway) and two private subnets (EC2 ASG, RDS) across two AZs for high availability",
        "Application Load Balancer (ALB) in the public subnets, forwarding HTTPS traffic to the API Auto Scaling Group",
        "EC2 Auto Scaling Group running a Dockerised Node.js (or FastAPI) application, pulled from Amazon ECR; scale-out on CPU > 60%",
        "Amazon RDS PostgreSQL in a private subnet with automated backups, encryption at rest, and a read replica",
        "Secrets Manager for database credentials — never hardcoded; injected into containers at runtime",
        "Terraform modular layout: separate modules for VPC, ALB, ASG, RDS, and IAM; remote state in S3 + DynamoDB locking",
        "GitHub Actions pipeline: Terraform fmt/validate → plan (PR comment) → apply on merge to main → Docker build+push to ECR → rolling EC2 refresh",
        "CloudWatch alarms (CPU, ALB 5xx rate, RDS free storage) + SNS email notifications + Grafana Cloud free tier dashboard",
      ],
      folderStructure: `multi-tier-app/
├── app/
│   ├── api/
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── db/          # pg pool, migrations (node-pg-migrate)
│   │   │   └── index.js
│   │   ├── Dockerfile
│   │   └── package.json
│   └── frontend/            # optional: React SPA served via S3 + CloudFront
│       ├── src/
│       └── Dockerfile
├── infra/
│   ├── main.tf              # root module: calls child modules
│   ├── variables.tf
│   ├── outputs.tf
│   ├── backend.tf           # S3 remote state + DynamoDB lock table
│   └── modules/
│       ├── vpc/
│       │   ├── main.tf      # VPC, subnets, IGW, NAT GW, route tables
│       │   ├── variables.tf
│       │   └── outputs.tf
│       ├── alb/
│       │   ├── main.tf      # ALB, target group, listener, ACM cert
│       │   ├── variables.tf
│       │   └── outputs.tf
│       ├── asg/
│       │   ├── main.tf      # launch template, ASG, scaling policies
│       │   ├── user_data.sh # pull ECR image + start container
│       │   ├── variables.tf
│       │   └── outputs.tf
│       ├── rds/
│       │   ├── main.tf      # RDS instance, subnet group, SG, read replica
│       │   ├── variables.tf
│       │   └── outputs.tf
│       └── iam/
│           ├── main.tf      # EC2 instance profile, ECR pull policy
│           └── outputs.tf
├── .github/
│   └── workflows/
│       ├── terraform.yml    # plan on PR, apply on merge
│       └── docker.yml       # build → ECR push → trigger ASG refresh
├── monitoring/
│   └── grafana-dashboard.json  # importable Grafana dashboard definition
└── README.md                   # architecture diagram, cost estimate, runbook`,
      technologies: [
        "Terraform (modular, remote state)",
        "AWS VPC (subnets, IGW, NAT Gateway, route tables)",
        "AWS ALB (Application Load Balancer)",
        "AWS EC2 Auto Scaling Group (launch templates)",
        "Amazon ECR (container registry)",
        "Docker",
        "AWS RDS PostgreSQL (Multi-AZ optional)",
        "AWS Secrets Manager",
        "AWS CloudWatch (alarms, logs, metrics)",
        "AWS SNS (notifications)",
        "Grafana Cloud (free tier dashboards)",
        "GitHub Actions",
      ],
      skills: [
        "VPC design: public/private subnet layout, NAT, security groups",
        "Terraform module authoring and remote state management",
        "Auto Scaling policy design and rolling deployment",
        "Container image build, push, and runtime secrets injection",
        "RDS high-availability configuration and credential rotation",
        "CloudWatch alarm and SNS notification setup",
        "End-to-end IaC: zero manual steps from git push to production",
        "Cost estimation with AWS Pricing Calculator and infra teardown discipline",
      ],
      stretchGoals: [
        "Add a WAF (AWS Web Application Firewall) in front of the ALB with rate-limiting and IP reputation managed rules",
        "Replace the EC2 ASG tier with Amazon ECS Fargate so there are no EC2 instances to manage, and compare cost and operational overhead",
        "Implement blue/green deployments using the ALB listener rules: Terraform creates a green target group, shifts 10% traffic, waits for CloudWatch health check, then shifts 100%",
      ],
      futureImprovements: [
        "Add AWS Config rules and Security Hub findings to enforce compliance (e.g., ensure no publicly accessible S3 buckets, MFA on all IAM users)",
        "Implement cost allocation tags and a monthly AWS Budgets alert so spend never exceeds a set threshold — document the real monthly cost of this architecture in the README",
        "Migrate Terraform state management to Terraform Cloud (free tier) for a UI, run history, and team collaboration features",
      ],
    },
  ],
};
