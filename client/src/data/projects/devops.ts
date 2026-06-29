import type { ProjectDomain } from "./types";

export const devops: ProjectDomain = {
  id: "devops",
  title: "DevOps",
  icon: "Infinity",
  accent: "neon",
  blurb: "Automate, containerise, and ship with CI/CD, Kubernetes, and IaC.",
  overview:
    "DevOps is the discipline that collapses the wall between writing code and running it reliably in production. At its core it is about **automation** — every manual step in building, testing, packaging, or deploying software becomes a pipeline stage that runs on every commit. For placement candidates, a DevOps portfolio is unusually powerful because most teams desperately need people who can set up GitHub Actions, write a Dockerfile, or deploy to Kubernetes without hand-holding.\n\nThe learning path is deliberately bottom-up: start with the Linux command line (where everything ultimately runs), move through containers and CI/CD, add Infrastructure-as-Code so your environments are reproducible, and finish with Kubernetes and observability so you understand how production-grade systems stay healthy. Even one solid project — a containerised app with a real CI/CD pipeline — is enough to stand out in campus placements at product companies such as Swiggy, Razorpay, and Atlassian India, all of which explicitly ask about DevOps practices in technical rounds.",
  skillsRequired: [
    "Comfortable with the Linux/macOS terminal (cd, ls, grep, pipes, redirection)",
    "Git basics: clone, branch, merge, push, pull requests",
    "At least one programming or scripting language (Python or Bash) for automation scripts",
    "Basic networking concepts: HTTP, ports, DNS, IP addresses",
    "Familiarity with building and running a web application locally",
  ],
  learningOrder: [
    "Linux & Bash scripting — file system, permissions, processes, cron, shell scripts",
    "Git workflows — feature branches, PR-based merges, tags, semantic versioning",
    "Docker — images, containers, Dockerfile, docker-compose for multi-service local stacks",
    "CI/CD fundamentals — GitHub Actions workflows: triggers, jobs, steps, secrets, caching",
    "Infrastructure-as-Code — Terraform basics: providers, resources, state, variables (use AWS Free Tier or LocalStack)",
    "Kubernetes core concepts — Pods, Deployments, Services, ConfigMaps, Secrets, Namespaces",
    "Helm — chart structure, values overrides, templating, packaging and releasing a chart",
    "Observability — Prometheus metrics, Grafana dashboards, alerting rules, structured logging",
  ],
  difficulty: "Intermediate → Advanced",
  techStack: [
    "Docker / Docker Compose",
    "GitHub Actions",
    "Kubernetes (minikube / kind / k3s locally; EKS/GKE in cloud)",
    "Terraform",
    "Helm",
    "Prometheus / Grafana / Alertmanager",
    "AWS Free Tier / GCP Free Tier (for cloud labs)",
  ],
  githubResources: [
    {
      label: "Kelsey Hightower — Kubernetes the Hard Way",
      url: "https://github.com/kelseyhightower/kubernetes-the-hard-way",
      kind: "repo",
    },
    {
      label: "Awesome DevOps",
      url: "https://github.com/wmariuss/awesome-devops",
      kind: "repo",
    },
    {
      label: "90 Days of DevOps (Michael Cade)",
      url: "https://github.com/MichaelCade/90DaysOfDevOps",
      kind: "repo",
    },
    {
      label: "Terraform AWS Modules",
      url: "https://github.com/terraform-aws-modules",
      kind: "repo",
    },
    {
      label: "Awesome Prometheus Alerts",
      url: "https://github.com/samber/awesome-prometheus-alerts",
      kind: "repo",
    },
  ],
  learningResources: [
    {
      label: "roadmap.sh — DevOps Roadmap",
      url: "https://roadmap.sh/devops",
      kind: "roadmap",
    },
    {
      label: "KodeKloud — free Docker & Kubernetes labs",
      url: "https://kodekloud.com/",
      kind: "course",
    },
    {
      label: "Docker Official Documentation",
      url: "https://docs.docker.com/",
      kind: "docs",
    },
    {
      label: "GitHub Actions — official docs",
      url: "https://docs.github.com/en/actions",
      kind: "docs",
    },
    {
      label: "Prometheus Getting Started",
      url: "https://prometheus.io/docs/introduction/overview/",
      kind: "docs",
    },
  ],
  portfolioTips: [
    "Always include a working CI badge (GitHub Actions status) in your README — it signals the pipeline is real and green.",
    "Record a short screen capture or GIF of a pipeline run end-to-end; embed it at the top of the README so reviewers immediately see the automation.",
    "Document architecture with a simple diagram (draw.io or Excalidraw) showing containers, services, and data flow — DevOps interviews often start with 'walk me through this'.",
    "Pin your Docker images to specific version tags in Dockerfiles (never `latest`) to show production mindset.",
    "Include a runbook section in the README: how to roll back, how to scale, how to interpret dashboard alerts.",
  ],
  resumeTips: [
    "Lead with outcomes: 'Reduced deployment time from ~45 min manual process to 8-minute automated CI/CD pipeline using GitHub Actions and Docker.'",
    "Name every tool explicitly — recruiters' ATS systems keyword-match on Docker, Kubernetes, Terraform, Prometheus, Helm, GitHub Actions.",
    "Quantify where possible: container image size reduction, pipeline execution time, uptime percentage from monitoring, number of services orchestrated.",
    "Mention the cloud provider and region: 'Deployed to AWS EKS (ap-south-1)' signals you have real cloud exposure, not just local minikube.",
    "List the IaC approach: 'Provisioned infra via Terraform; all state stored remotely in S3 with DynamoDB locking.'",
  ],
  interviewRelevance:
    "DevOps questions appear in two rounds at Indian product companies: **DSA/system-design rounds** and dedicated **infrastructure/platform rounds** at firms like Swiggy, Zepto, CRED, and Atlassian Bengaluru.\n\nExpect interviewers to ask:\n- *\"How does your CI/CD pipeline work? What happens when a test fails?\"* — walk through the GitHub Actions YAML, the failure notification, and the rollback strategy.\n- *\"Why Docker? How is it different from a VM?\"* — cover kernel namespaces, cgroups, image layering, and startup time.\n- *\"Explain Kubernetes deployments vs. pods. How does a rolling update work?\"* — cover ReplicaSet churn, readiness probes, maxSurge/maxUnavailable.\n- *\"What is Infrastructure-as-Code and why does it matter?\"* — reproducibility, drift detection, PR review for infra changes.\n- *\"How do you know if your production system is healthy?\"* — Prometheus metrics, Grafana panels, alert thresholds, SLOs.\n\nHaving shipped projects beats memorised theory every time: anchor every answer to your project's design decisions and trade-offs.",
  projects: [
    {
      id: "dockerised-fullstack-ci",
      name: "Dockerised Full-Stack App with CI Pipeline",
      level: "Beginner",
      blurb: "Containerise a full-stack app and wire up a GitHub Actions pipeline that builds and tests on every push.",
      estimatedTime: "1–2 weekends",
      objective:
        "Take an existing (or freshly written) full-stack app — a Node.js + React todo app works perfectly — write a Dockerfile for the backend and one for the frontend, compose them locally with docker-compose, and then create a GitHub Actions workflow that automatically builds both images, runs unit/lint checks, and reports pass/fail on every pull request. This is the entry point to every modern DevOps workflow and is explicitly asked about in 60-minute SDE-1 interviews.",
      features: [
        "Multi-stage Dockerfile for the backend (build stage + lean production stage)",
        "Multi-stage Dockerfile for the frontend that outputs a static build served by Nginx",
        "docker-compose.yml that wires frontend, backend, and a PostgreSQL container together with a shared network and named volumes",
        "GitHub Actions workflow triggered on push and pull_request to main — installs deps, runs linter, runs unit tests, builds Docker images",
        "Secrets management via GitHub repository secrets (no credentials in code)",
        ".dockerignore and .gitignore correctly configured to keep images lean",
      ],
      folderStructure: `dockerised-fullstack-ci/
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   └── db.ts
│   ├── Dockerfile               # multi-stage: build → runner
│   ├── .dockerignore
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   └── App.tsx
│   ├── nginx.conf               # custom nginx config for SPA routing
│   ├── Dockerfile               # multi-stage: build → nginx
│   ├── .dockerignore
│   └── package.json
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml               # build + test pipeline
└── README.md`,
      technologies: ["Docker", "Docker Compose", "GitHub Actions", "Node.js", "React", "PostgreSQL", "Nginx"],
      skills: [
        "Writing production-grade multi-stage Dockerfiles",
        "Composing multi-container applications locally",
        "Building a CI workflow from scratch with GitHub Actions",
        "Managing secrets and environment variables securely",
        "Structuring a monorepo for independent service builds",
      ],
      stretchGoals: [
        "Add Docker layer caching in the GitHub Actions workflow to cut build times by 50–70%",
        "Push the built images to GitHub Container Registry (ghcr.io) as part of the CI job",
        "Add a Hadolint step to lint Dockerfiles for best-practice violations",
      ],
      futureImprovements: [
        "Graduate to a CD step that deploys to a free-tier cloud VM (Render, Fly.io, or AWS Lightsail) on every merge to main",
        "Add an integration-test job that spins up docker-compose in CI and runs API tests against live containers",
        "Introduce semantic-release to auto-version and tag Docker images on every successful main-branch build",
      ],
    },
    {
      id: "full-cicd-iac-pipeline",
      name: "Full CI/CD Pipeline with Container Registry and IaC",
      level: "Intermediate",
      blurb: "End-to-end automated delivery: build, test, push image, provision infra with Terraform, and deploy — all triggered by a git push.",
      estimatedTime: "2–3 weeks",
      objective:
        "Extend the beginner project into a genuine delivery pipeline: on every merge to main, GitHub Actions builds a Docker image, tags it with the commit SHA, pushes it to a container registry (ghcr.io or Docker Hub), then triggers a Terraform apply to provision or update the target environment, and finally deploys the new image to a cloud VM or managed container service. This is exactly the workflow used by product teams and is the most concrete DevOps story you can tell in a placement interview.",
      features: [
        "Multi-job GitHub Actions pipeline: lint → test → build-and-push → deploy (each job depends on the previous)",
        "Docker image tagged with both the git short SHA and `latest`; pushed to GitHub Container Registry",
        "Terraform configuration that provisions the cloud target (an EC2 instance, a GCP Cloud Run service, or an AWS ECS task) — all infra defined as code",
        "Remote Terraform state stored in an S3 bucket (or GCS) with DynamoDB state locking so the pipeline is safe to run concurrently",
        "Environment promotion: a `staging` branch deploys to staging; merges to `main` deploy to production using GitHub Environments with manual approval gate",
        "Rollback: the pipeline tags the previous image SHA so a one-command rollback is possible without a new build",
        "Health-check step in the deploy job: curl the `/health` endpoint and fail the pipeline if it returns non-200",
      ],
      folderStructure: `full-cicd-iac-pipeline/
├── app/
│   ├── src/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
├── infra/
│   ├── main.tf                  # provider, backend config
│   ├── variables.tf
│   ├── outputs.tf
│   ├── modules/
│   │   ├── networking/          # VPC, subnets, security groups
│   │   └── compute/             # EC2 / ECS / Cloud Run resource
│   └── environments/
│       ├── staging.tfvars
│       └── production.tfvars
├── .github/
│   └── workflows/
│       ├── ci.yml               # lint, test, build, push image
│       └── cd.yml               # terraform plan/apply + deploy
└── README.md`,
      technologies: [
        "Docker",
        "GitHub Actions",
        "Terraform",
        "AWS (EC2 / ECS) or GCP (Cloud Run) — Free Tier",
        "GitHub Container Registry (ghcr.io)",
        "Bash (deploy scripts)",
      ],
      skills: [
        "Designing multi-stage CI/CD pipelines with job dependencies",
        "Pushing and versioning container images in a registry",
        "Writing Terraform modules for cloud infrastructure provisioning",
        "Managing remote Terraform state and locking",
        "Implementing environment promotion and manual approval gates",
        "Automated rollback strategies via image tagging",
      ],
      stretchGoals: [
        "Add a Terraform `plan` PR comment using the `terraform-github-actions` action so infrastructure changes are visible in code review",
        "Implement blue-green deployment: provision a second instance, route traffic, verify, then terminate the old one — zero-downtime releases",
        "Add a DAST (dynamic application security testing) step using OWASP ZAP in the pipeline to catch vulnerabilities before production",
      ],
      futureImprovements: [
        "Replace the EC2/VM target with a managed Kubernetes cluster and migrate the deploy step to `kubectl rollout`",
        "Add cost-estimation with Infracost to the Terraform plan step so every infra PR shows a monthly cost delta",
        "Build a Slack notification step that posts pipeline success/failure with a link to the deployed version and a one-click rollback button",
      ],
    },
    {
      id: "k8s-microservices-observability",
      name: "Microservices on Kubernetes with Helm and Monitoring",
      level: "Advanced",
      blurb: "Deploy a microservices app to Kubernetes with autoscaling, a Helm chart, Prometheus metrics, Grafana dashboards, and firing alerts.",
      estimatedTime: "4–6 weeks",
      objective:
        "Build and operate a small microservices application (an API gateway + 2–3 backend services + a database) deployed to a Kubernetes cluster (local minikube/kind for development, a managed cluster in cloud for production). Package every service as a Helm chart, configure Horizontal Pod Autoscaling, and deploy a full observability stack — Prometheus for metrics, Grafana for dashboards, and Alertmanager to fire PagerDuty/Slack alerts when services degrade. This project covers everything discussed in SDE-2 and DevOps/SRE interviews in India's top product companies.",
      features: [
        "3 microservices: an API gateway (routes requests), a user-service, and an order-service — each in its own Docker image and Kubernetes Deployment",
        "Kubernetes manifests: Deployments, Services (ClusterIP + LoadBalancer/Ingress), ConfigMaps, Secrets, Namespaces, NetworkPolicies",
        "Helm chart per service with parameterised values.yaml (image tag, replica count, resource limits, env vars) enabling one-command deploy and upgrade",
        "Horizontal Pod Autoscaler (HPA) on the API gateway: scale from 1 to 10 replicas based on CPU utilisation",
        "Prometheus Operator (kube-prometheus-stack Helm chart) scraping all services; custom `/metrics` endpoint in each service exposing request rate, latency histogram, and error rate",
        "Grafana dashboards (exported as JSON) showing per-service RED metrics (Rate, Errors, Duration) and Kubernetes node/pod resource usage",
        "Alertmanager rules: alert if error rate > 1% for 5 minutes or p99 latency > 500 ms; routes to a Slack webhook",
        "Full CI/CD pipeline (GitHub Actions) that builds images, runs tests, updates the Helm chart image tag, and runs `helm upgrade --install` against the cluster",
      ],
      folderStructure: `k8s-microservices-observability/
├── services/
│   ├── api-gateway/
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── user-service/
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── order-service/
│       ├── src/
│       ├── Dockerfile
│       └── package.json
├── helm/
│   ├── api-gateway/
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   └── templates/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       ├── hpa.yaml
│   │       └── servicemonitor.yaml  # Prometheus scrape config
│   ├── user-service/
│   │   └── ...
│   └── order-service/
│       └── ...
├── k8s/
│   ├── namespaces.yaml
│   ├── ingress.yaml
│   └── network-policies.yaml
├── monitoring/
│   ├── prometheus-values.yaml       # kube-prometheus-stack overrides
│   ├── alerts/
│   │   └── slo-alerts.yaml          # PrometheusRule CRDs
│   └── dashboards/
│       ├── services-red.json
│       └── k8s-overview.json
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd-helm.yml              # helm upgrade per changed service
└── README.md`,
      technologies: [
        "Kubernetes (minikube / kind / AWS EKS / GKE)",
        "Helm 3",
        "Docker",
        "GitHub Actions",
        "Prometheus Operator / kube-prometheus-stack",
        "Grafana",
        "Alertmanager + Slack webhook",
        "Node.js (prom-client library for custom metrics)",
        "Terraform (optional — provision the managed cluster)",
      ],
      skills: [
        "Kubernetes workload management: Deployments, ReplicaSets, rolling updates, readiness/liveness probes",
        "Helm chart authoring, templating, and release management",
        "Horizontal Pod Autoscaling based on resource metrics",
        "Instrumenting services with Prometheus client libraries",
        "Writing PromQL queries for RED method dashboards",
        "Configuring alerting rules and routing in Alertmanager",
        "End-to-end CI/CD for a multi-service Helm-based system",
        "Kubernetes NetworkPolicy for service-to-service security",
      ],
      stretchGoals: [
        "Add distributed tracing with OpenTelemetry and Jaeger so you can trace a request across all three microservices — a strong interview talking point about observability beyond metrics",
        "Implement KEDA (Kubernetes Event-Driven Autoscaling) to scale the order-service based on a message queue depth rather than CPU",
        "Write a chaos engineering scenario using LitmusChaos: kill a pod, inject network latency, and verify the alert fires and the system self-heals within the SLO",
      ],
      futureImprovements: [
        "Adopt GitOps with ArgoCD: replace imperative `helm upgrade` calls in CI with declarative sync from a Git repository — the current industry standard at Atlassian, Flipkart, and similar firms",
        "Add a service mesh (Istio or Linkerd) for mTLS between services, traffic splitting for canary releases, and automatic golden-signal metrics without code changes",
        "Build a multi-cluster setup (one cluster per region) with a global load balancer to demonstrate cross-region failover, a concept directly relevant to SRE roles at hyperscalers",
      ],
    },
  ],
};
