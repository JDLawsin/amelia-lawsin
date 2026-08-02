"use client";

import { useCallback, useSyncExternalStore } from "react";

export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined") return () => {};

      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () =>
      typeof window !== "undefined" && window.matchMedia(query).matches,
    () => false,
  );
};
