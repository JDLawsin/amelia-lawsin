"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { X, Search, Heart } from "lucide-react";
import { useFavorites } from "@/providers/FavoritesProvider";
import { getFavoritesBySlugs } from "@/app/_actions/favorites.actions";
import { PropertyListItem } from "@/services/property.service";
import { FavoritePropertyRow } from "./FavoritePropertyRow";
import { cn } from "@/lib/utils";
import {
  toolsPanelPositionClassName,
  toolsPanelSizeClassName,
} from "@/components/tools/tools-layout";

type Props = {
  open: boolean;
  onClose: () => void;
};

const BATCH_SIZE = 10;

const TABS = [
  { key: "active" as const, label: "Active" },
  { key: "unavailable" as const, label: "Unavailable" },
];

type TabKey = (typeof TABS)[number]["key"];

export const FavoritesPanel = ({ open, onClose }: Props) => {
  const { favorites, removeMissingSlugs } = useFavorites();
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasFetched, setHasFetched] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const favoritesKey = favorites.join(",");

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const slugs = favoritesKey ? favoritesKey.split(",") : [];

    startTransition(async () => {
      try {
        const data = await getFavoritesBySlugs(slugs);
        if (cancelled) return;
        setProperties(data);
        removeMissingSlugs(data.map((property) => property.slug));
      } catch (err) {
        console.error("Failed to load favorites", err);
      } finally {
        if (!cancelled) setHasFetched(true);
      }
    });

    return () => {
      cancelled = true;
      setHasFetched(false);
    };
  }, [open, favoritesKey, removeMissingSlugs]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setVisibleCount(BATCH_SIZE);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setVisibleCount(BATCH_SIZE);
  };

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return properties
      .filter((property) => favorites.includes(property.slug))
      .filter((property) => {
        const matchesTab =
          activeTab === "active"
            ? property.status !== "SOLD" && property.status !== "RENTED"
            : property.status === "SOLD" || property.status === "RENTED";
        if (!matchesTab) return false;
        if (!term) return true;
        const haystack = [property.title, property.city, property.barangay]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      });
  }, [properties, favorites, activeTab, query]);

  const visible = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );
  const hasMore = visibleCount < filtered.length;

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Saved properties"
      className={cn(
        toolsPanelPositionClassName,
        toolsPanelSizeClassName,
        "flex flex-col bg-white border border-wire rounded-2xl shadow-apple-lg overflow-hidden overscroll-contain",
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-wire bg-cloud">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-ink" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-ink">Saved Properties</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close favorites"
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white text-ash hover:text-ink transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-4 py-2 border-b border-wire">
        <label htmlFor="favorites-search" className="sr-only">
          Search saved properties
        </label>
        <div className="relative">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ash"
            aria-hidden="true"
          />
          <input
            id="favorites-search"
            type="search"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search saved properties…"
            autoComplete="off"
            className="w-full h-9 pl-8 pr-3 text-sm text-ink bg-cloud border border-wire rounded-xl placeholder:text-fog focus:outline-none focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ink/20 transition-colors"
          />
        </div>
      </div>

      <div className="flex border-b border-wire">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabChange(tab.key)}
            className={cn(
              "flex-1 py-2 text-xs font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink",
              activeTab === tab.key
                ? "text-ink border-b-2 border-ink bg-white"
                : "text-ash hover:text-ink bg-cloud/50",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {isPending && !hasFetched ? (
          <div className="py-8 text-center text-xs text-ash">
            Loading saved properties…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center px-4">
            <p className="text-xs text-ash">
              {favorites.length === 0
                ? "Save listings while you browse — they'll show up here."
                : "No properties match this tab or search."}
            </p>
            {favorites.length === 0 && (
              <Link
                href="/properties"
                onClick={onClose}
                className="inline-block mt-2 text-xs text-ink font-medium hover:underline"
              >
                Browse Properties
              </Link>
            )}
          </div>
        ) : (
          <>
            {visible.map((property) => (
              <FavoritePropertyRow key={property.slug} property={property} />
            ))}
            {hasMore && (
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + BATCH_SIZE)}
                className="w-full py-2 text-xs font-medium text-ink hover:bg-cloud rounded-xl transition-colors cursor-pointer border border-wire focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                Load More
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
