"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  ReactNode,
} from "react";
import { createLocalStorageStore } from "@/lib/local-storage-store";

const SERVER_SNAPSHOT: string[] = [];
const MAX_COMPARE = 3;
const store = createLocalStorageStore(
  "amelia-lawsin:v1:compare",
  "amelia-lawsin:compare",
);

export type CompareContextValue = {
  compareSlugs: string[];
  compareSet: Set<string>;
  isComparing: (slug: string) => boolean;
  toggleCompare: (slug: string) => boolean;
  addCompare: (slug: string) => boolean;
  removeCompare: (slug: string) => void;
  clearCompare: () => void;
  canAddMore: boolean;
};

const CompareContext = createContext<CompareContextValue | null>(null);

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return ctx;
};

type Props = {
  children: ReactNode;
};

export const CompareProvider = ({ children }: Props) => {
  const compareSlugs = useSyncExternalStore(
    store.subscribe,
    store.read,
    () => SERVER_SNAPSHOT,
  );

  const compareSet = useMemo(() => new Set(compareSlugs), [compareSlugs]);

  const isComparing = useCallback(
    (slug: string) => compareSet.has(slug),
    [compareSet],
  );

  const canAddMore = compareSlugs.length < MAX_COMPARE;

  const addCompare = useCallback(
    (slug: string): boolean => {
      if (compareSet.has(slug)) return true;
      if (compareSlugs.length >= MAX_COMPARE) return false;
      const next = [...compareSlugs, slug];
      store.write(next);
      store.notify();
      return true;
    },
    [compareSlugs, compareSet],
  );

  const removeCompare = useCallback(
    (slug: string) => {
      const next = compareSlugs.filter((s) => s !== slug);
      store.write(next);
      store.notify();
    },
    [compareSlugs],
  );

  const toggleCompare = useCallback(
    (slug: string): boolean => {
      if (compareSet.has(slug)) {
        removeCompare(slug);
        return true;
      }
      return addCompare(slug);
    },
    [compareSet, addCompare, removeCompare],
  );

  const clearCompare = useCallback(() => {
    store.write([]);
    store.notify();
  }, []);

  const value = useMemo(
    () => ({
      compareSlugs,
      compareSet,
      isComparing,
      toggleCompare,
      addCompare,
      removeCompare,
      clearCompare,
      canAddMore,
    }),
    [
      compareSlugs,
      compareSet,
      isComparing,
      toggleCompare,
      addCompare,
      removeCompare,
      clearCompare,
      canAddMore,
    ],
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
};
