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
  const [previewTotal, setPreviewTotal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setPreviewTotal(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

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

    fetch(`/api/properties?${query}`)
      .then((res) => {
        if (!res.ok) throw new Error("Preview fetch failed");
        return res.json() as Promise<{ total: number }>;
      })
      .then((data) => {
        if (!cancelled) setPreviewTotal(data.total);
      })
      .catch(() => {
        if (!cancelled) setPreviewTotal(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, debouncedFilters, searchQuery]);

  return { previewTotal, isPreviewLoading: isLoading };
};
