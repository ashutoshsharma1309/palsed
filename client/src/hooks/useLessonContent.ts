// Loads a lesson (and its neighbours) from the content engine for a given
// (domain, lessonId). Domains are lazily imported and cached in the registry,
// so this hook exposes a small loading state while the chunk resolves.
import { useEffect, useState } from "react";
import type { Domain } from "../content/types";
import { loadDomain, resolveLesson, type ResolvedLesson } from "../content/registry";

type State =
  | { status: "loading"; data: null }
  | { status: "ready"; data: ResolvedLesson }
  | { status: "not-found"; data: null };

export function useLessonContent(domain: Domain | undefined, lessonId: string | undefined): State {
  const [state, setState] = useState<State>({ status: "loading", data: null });

  useEffect(() => {
    let cancelled = false;
    if (!domain || !lessonId) {
      setState({ status: "not-found", data: null });
      return;
    }
    setState({ status: "loading", data: null });
    loadDomain(domain)
      .then((modules) => {
        if (cancelled) return;
        const resolved = resolveLesson(modules, lessonId);
        setState(resolved ? { status: "ready", data: resolved } : { status: "not-found", data: null });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "not-found", data: null });
      });
    return () => {
      cancelled = true;
    };
  }, [domain, lessonId]);

  return state;
}
