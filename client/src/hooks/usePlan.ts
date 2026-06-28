// Subscription plan scaffold. Today it's a local flag; when real billing
// (Stripe / Razorpay) lands, `upgrade()` becomes a checkout redirect and the
// plan is read from the server. The rest of the app already gates on `isPro`,
// so flipping to real billing is a one-place change.
import { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";

export type Plan = "free" | "pro";
const KEY = "prepnext.plan.v1";

export function usePlan() {
  const [plan, setPlan] = useLocalStorageState<Plan>(KEY, "free");
  // Placeholder for real checkout — replace with a Stripe/Razorpay redirect.
  const upgrade = useCallback(() => setPlan("pro"), [setPlan]);
  const downgrade = useCallback(() => setPlan("free"), [setPlan]);
  return { plan, isPro: plan === "pro", upgrade, downgrade };
}
