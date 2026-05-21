import { useCallback } from "react";
import { useLocalStorageState, LS_KEYS } from "./useLocalStorageState";
import { MasteryMap, updateMastery, topByMastery } from "../lib/mastery";

export function useMastery() {
  const [map, setMap] = useLocalStorageState<MasteryMap>(LS_KEYS.mastery, {});

  const record = useCallback(
    (topic: string, args: { correct: boolean; hintsUsed?: number }) => {
      setMap((prev) => updateMastery(prev, topic, args));
    },
    [setMap]
  );

  const top = useCallback((count = 3) => topByMastery(map, count), [map]);

  return { map, record, top, setMap };
}
