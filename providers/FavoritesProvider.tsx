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

const store = createLocalStorageStore(
  "amelia-lawsin:v1:favorites",
  "amelia-lawsin:favorites",
);

export type FavoritesContextValue = {
  favorites: string[];
  favoriteSet: Set<string>;
  isFavorite: (slug: string) => boolean;
  addFavorite: (slug: string) => void;
  removeFavorite: (slug: string) => void;
  toggleFavorite: (slug: string) => void;
  removeMissingSlugs: (existingSlugs: string[]) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
};

type Props = {
  children: ReactNode;
};

export const FavoritesProvider = ({ children }: Props) => {
  const favorites = useSyncExternalStore(
    store.subscribe,
    store.read,
    () => SERVER_SNAPSHOT,
  );

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const isFavorite = useCallback(
    (slug: string) => favoriteSet.has(slug),
    [favoriteSet],
  );

  const addFavorite = useCallback(
    (slug: string) => {
      if (favoriteSet.has(slug)) return;
      const next = [...favorites, slug];
      store.write(next);
      store.notify();
    },
    [favorites, favoriteSet],
  );

  const removeFavorite = useCallback(
    (slug: string) => {
      const next = favorites.filter((s) => s !== slug);
      store.write(next);
      store.notify();
    },
    [favorites],
  );

  const toggleFavorite = useCallback(
    (slug: string) => {
      if (favoriteSet.has(slug)) {
        removeFavorite(slug);
      } else {
        addFavorite(slug);
      }
    },
    [favoriteSet, addFavorite, removeFavorite],
  );

  const removeMissingSlugs = useCallback(
    (existingSlugs: string[]) => {
      const existing = new Set(existingSlugs);
      const next = favorites.filter((s) => existing.has(s));
      if (next.length !== favorites.length) {
        store.write(next);
        store.notify();
      }
    },
    [favorites],
  );

  const value = useMemo(
    () => ({
      favorites,
      favoriteSet,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      removeMissingSlugs,
    }),
    [
      favorites,
      favoriteSet,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      removeMissingSlugs,
    ],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
