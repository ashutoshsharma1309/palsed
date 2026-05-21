import { useCallback } from "react";
import { useLocalStorageState, LS_KEYS } from "./useLocalStorageState";
import {
  SRSItem,
  SRSRating,
  rate,
  upsert,
  dueCount,
  dueItems,
  newSRSItem,
} from "../lib/srs";

export function useSRS() {
  const [items, setItems] = useLocalStorageState<SRSItem[]>(LS_KEYS.srs, []);

  const add = useCallback(
    (args: Parameters<typeof newSRSItem>[0]) => {
      setItems((prev) => upsert(prev, newSRSItem(args)));
    },
    [setItems]
  );

  const review = useCallback(
    (itemId: string, kind: SRSItem["kind"], rating: SRSRating) => {
      setItems((prev) => {
        const idx = prev.findIndex((i) => i.itemId === itemId && i.kind === kind);
        if (idx === -1) return prev;
        const copy = prev.slice();
        copy[idx] = rate(copy[idx], rating);
        return copy;
      });
    },
    [setItems]
  );

  return {
    items,
    add,
    review,
    due: dueItems(items),
    dueCount: dueCount(items),
    setItems,
  };
}
