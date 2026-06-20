import { useLocalStorageState } from "./useLocalStorageState";

// Persistent student profile — drives the eligibility filter on /companies and
// any other "is this for me?" gating. Per-user (the LS key is auto-scoped by
// useLocalStorageState to the logged-in user).
export interface StudentProfile {
  cgpa: number | null;          // current CGPA on 10 scale; null = "not set"
  tenthPct: number | null;
  twelfthPct: number | null;
  branch: string | null;        // e.g. "CSE", "ECE", "ME", "EE" — broad bucket
  hasBacklogs: boolean;         // active backlogs?
  filterEnabled: boolean;       // master switch — let me see ineligible ones too
}

const DEFAULT_PROFILE: StudentProfile = {
  cgpa: null,
  tenthPct: null,
  twelfthPct: null,
  branch: null,
  hasBacklogs: false,
  filterEnabled: false,
};

const LS_KEY = "prepnext.studentProfile.v1";

export function useStudentProfile() {
  const [profile, setProfile] = useLocalStorageState<StudentProfile>(LS_KEY, DEFAULT_PROFILE);
  const update = (patch: Partial<StudentProfile>) => setProfile({ ...profile, ...patch });
  return { profile, update };
}

// Common branch buckets used across Indian engineering colleges. The Company
// schema's `allowedBranches` strings should match one of these (or contain
// "All circuit", "All branches", etc. — see isEligibleForBranch below).
export const BRANCHES = [
  "CSE",
  "IT",
  "ECE",
  "EE",
  "EEE",
  "ME",
  "Civil",
  "Chemical",
  "Biotech",
  "MCA",
  "MBA",
  "Other",
] as const;

export type Branch = (typeof BRANCHES)[number];

// Predicate: is this profile eligible for a given company?
// Conservatively allows ("yes") when info is missing; rejects only when there's
// a clear mismatch. Returns { ok, reasons } so the UI can show *why* rejected.
import type { Company } from "../data/companies";

export interface EligibilityResult {
  ok: boolean;
  reasons: string[];
}

export function checkEligibility(p: StudentProfile, c: Company): EligibilityResult {
  const reasons: string[] = [];
  const e = c.eligibility;

  if (p.cgpa != null && e.minCgpa != null && p.cgpa < e.minCgpa) {
    reasons.push(`CGPA below ${e.minCgpa} cutoff (you: ${p.cgpa})`);
  }
  if (p.tenthPct != null && e.minTenthPct != null && p.tenthPct < e.minTenthPct) {
    reasons.push(`10th below ${e.minTenthPct}% (you: ${p.tenthPct}%)`);
  }
  if (p.twelfthPct != null && e.minTwelfthPct != null && p.twelfthPct < e.minTwelfthPct) {
    reasons.push(`12th below ${e.minTwelfthPct}% (you: ${p.twelfthPct}%)`);
  }
  if (p.branch && e.allowedBranches.length > 0) {
    // Match common "open to all" wildcards explicitly.
    const isOpenToAll = e.allowedBranches.some((b) => {
      const norm = b.toLowerCase();
      return (
        norm.includes("all branches") ||
        norm.includes("all circuit") ||
        norm === "all" ||
        norm === "any"
      );
    });
    if (!isOpenToAll) {
      const matches = e.allowedBranches.some((b) =>
        b.toLowerCase().includes(p.branch!.toLowerCase())
      );
      if (!matches) {
        reasons.push(`Branch ${p.branch} not in allowed list`);
      }
    }
  }
  if (p.hasBacklogs && e.backlogPolicy === "None") {
    reasons.push("No backlogs allowed");
  }
  if (p.hasBacklogs && e.backlogPolicy === "Active-none") {
    reasons.push("No active backlogs allowed");
  }

  return { ok: reasons.length === 0, reasons };
}
