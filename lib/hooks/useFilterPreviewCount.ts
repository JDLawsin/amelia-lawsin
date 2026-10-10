"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import {
  buildPropertiesApiQuery,
  DEFAULT_PROPERTIES_PAGE_SIZE,
} from "@/lib/property-filters";
import type { LocalFilterState } from "@/lib/property-browse-chips";
import {
  PropertyStatus,
  PropertyType,
} from "@/app/generated/prisma/client";

type UseFilterPreviewCountOptions = {
  enabled: boolean;
  localFilters: LocalFilterState;
  searchQuery?: string;
};

export const useFilterPreviewCount = ({
  enabled,
  localFilters,
  searchQuery,
}: UseFilterPreviewCountOptions) => {
  const debouncedFilters = useDebounce(localFilters, 300);
  const query = buildPropertiesApiQuery({
    q: searchQuery || undefined,
    status: debouncedFilters.status
      ? (debouncedFilters.status as PropertyStatus)
      : undefined,
    type: debouncedFilters.type
      ? (debouncedFilters.type as PropertyType)
      : undefined,
    city: debouncedFilters.city || undefined,
    minPrice: debouncedFilters.minPrice
      ? Number(debouncedFilters.minPrice)
      : undefined,
    maxPrice: debouncedFilters.maxPrice
      ? Number(debouncedFilters.maxPrice)
      : undefined,
    bedrooms:
      debouncedFilters.bedrooms !== ""
        ? Number(debouncedFilters.bedrooms)
        : undefined,
    special: debouncedFilters.special || undefined,
    page: 1,
    pageSize: DEFAULT_PROPERTIES_PAGE_SIZE,
  });
  const [result, setResult] = useState<{
    query: string;
    total: number | null;
  } | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();

    fetch(`/api/properties?${query}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Preview fetch failed");
        return res.json() as Promise<{ total: number }>;
      })
      .then((data) => {
        setResult({ query, total: data.total });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setResult({ query, total: null });
      });

    return () => controller.abort();
  }, [enabled, query]);

  const hasCurrentResult = result?.query === query;

  return {
    previewTotal: enabled && hasCurrentResult ? result.total : null,
    isPreviewLoading: enabled && !hasCurrentResult,
  };
};
