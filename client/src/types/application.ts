// Application tracker — schema mirrors future SQL `Application` and `ApplicationEvent` tables.

export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "oa"
  | "tech1"
  | "tech2"
  | "tech3"
  | "hr"
  | "offered"
  | "joined"
  | "rejected"
  | "withdrawn";

export const STATUS_ORDER: ApplicationStatus[] = [
  "wishlist","applied","oa","tech1","tech2","tech3","hr","offered","joined","rejected","withdrawn",
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  wishlist: "Wishlist",
  applied: "Applied",
  oa: "OA",
  tech1: "Tech 1",
  tech2: "Tech 2",
  tech3: "Tech 3",
  hr: "HR / Final",
  offered: "Offered",
  joined: "Joined",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  wishlist: "#a0a0a0",
  applied: "#b5d4ff",
  oa: "#ffe87a",
  tech1: "#ffd4b0",
  tech2: "#ffd4b0",
  tech3: "#ffd4b0",
  hr: "#d6c1ff",
  offered: "#c8ff3d",
  joined: "#b9f5c8",
  rejected: "#ff8a7a",
  withdrawn: "#555",
};

export const ACTIVE_STATUSES: ApplicationStatus[] = ["wishlist","applied","oa","tech1","tech2","tech3","hr"];
export const FINAL_STATUSES: ApplicationStatus[] = ["offered","joined","rejected","withdrawn"];

export interface ApplicationEvent {
  id: string;
  at: string;
  type: "created" | "status_changed" | "note" | "deadline_set" | "round_scheduled" | "outcome";
  from?: ApplicationStatus;
  to?: ApplicationStatus;
  text?: string;
}

export interface Application {
  id: string;
  companySlug: string;
  role: string;                     // "SDE-1", "Analyst"
  status: ApplicationStatus;
  appliedAt: string;
  nextActionAt?: string;            // ISO date — when's the next round / deadline
  nextActionLabel?: string;         // "OA on Sat", "Tech 2 scheduled"
  ctcOffered?: number;              // LPA when offered/joined
  source?: "campus" | "referral" | "linkedin" | "career-page" | "other";
  notes?: string;
  events: ApplicationEvent[];
  createdAt: string;
  updatedAt: string;
}

export function newApplication(args: { companySlug: string; role: string; source?: Application["source"] }): Application {
  const now = new Date().toISOString();
  const id = `app_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  return {
    id,
    companySlug: args.companySlug,
    role: args.role,
    status: "wishlist",
    appliedAt: now,
    source: args.source,
    notes: "",
    events: [{ id: `ev_${Date.now().toString(36)}`, at: now, type: "created" }],
    createdAt: now,
    updatedAt: now,
  };
}

export function transitionStatus(app: Application, to: ApplicationStatus, text?: string): Application {
  const now = new Date().toISOString();
  return {
    ...app,
    status: to,
    updatedAt: now,
    events: [
      ...app.events,
      { id: `ev_${Date.now().toString(36)}`, at: now, type: "status_changed", from: app.status, to, text },
    ],
  };
}
