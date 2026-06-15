import { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { Application, ApplicationStatus, newApplication, transitionStatus, ACTIVE_STATUSES, FINAL_STATUSES } from "../types/application";

const KEY = "prepnext.applications.v1";

export function useApplications() {
  const [apps, setApps] = useLocalStorageState<Application[]>(KEY, []);

  const add = useCallback(
    (args: Parameters<typeof newApplication>[0]) => {
      const next = newApplication(args);
      setApps((prev) => [next, ...prev]);
      return next;
    },
    [setApps]
  );

  const update = useCallback(
    (id: string, patch: Partial<Application>) => {
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a)));
    },
    [setApps]
  );

  const transition = useCallback(
    (id: string, to: ApplicationStatus, text?: string) => {
      setApps((prev) => prev.map((a) => (a.id === id ? transitionStatus(a, to, text) : a)));
    },
    [setApps]
  );

  const remove = useCallback(
    (id: string) => setApps((prev) => prev.filter((a) => a.id !== id)),
    [setApps]
  );

  const active = apps.filter((a) => ACTIVE_STATUSES.includes(a.status));
  const finished = apps.filter((a) => FINAL_STATUSES.includes(a.status));
  const offers = apps.filter((a) => a.status === "offered" || a.status === "joined");

  // upcoming events (sorted by nextActionAt)
  const upcoming = apps
    .filter((a) => a.nextActionAt && new Date(a.nextActionAt).getTime() > Date.now() - 86400000)
    .sort((a, b) => new Date(a.nextActionAt!).getTime() - new Date(b.nextActionAt!).getTime());

  return { apps, add, update, transition, remove, active, finished, offers, upcoming };
}
