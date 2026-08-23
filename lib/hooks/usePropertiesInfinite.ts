"use client";

import useSWRInfinite from "swr/infinite";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { PropertyListItem } from "@/services/property.service";
import {
  buildPropertiesApiQuery,
  buildPropertyListFilterSignature,
  parsePropertyListFilters,
} from "@/lib/property-filters";

type PropertiesApiResponse = {
  properties: PropertyListItem[];
  total: number;
  page: number;
  pageSize: number;
};

const fetcher = async (url: string): Promise<PropertiesApiResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load properties");
  }
  return response.json();
};

type UsePropertiesInfiniteOptions = {
  initialProperties: PropertyListItem[];
  initialTotal: number;
  pageSize: number;
  filterSignature: string;
};

export const usePropertiesInfinite = ({
  initialProperties,
  initialTotal,
  pageSize,
  filterSignature,
}: UsePropertiesInfiniteOptions) => {
  const searchParams = useSearchParams();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const getKey = (
    pageIndex: number,
    previousPageData: PropertiesApiResponse | null,
  ) => {
    if (previousPageData && previousPageData.properties.length === 0) {
      return null;
    }
    if (
      previousPageData &&
      pageIndex * pageSize >= previousPageData.total
    ) {
      return null;
    }

    const page = pageIndex + 1;
    const filters = parsePropertyListFilters(searchParams, { pageSize });
    const query = buildPropertiesApiQuery({ ...filters, page, pageSize });
    return `/api/properties?${query}`;
  };

  const fallbackData = useMemo(
    () => [
      {
        properties: initialProperties,
        total: initialTotal,
        page: 1,
        pageSize,
      },
    ],
    [filterSignature, initialProperties, initialTotal, pageSize],
  );

  const { data, error, size, setSize, isValidating, isLoading } =
    useSWRInfinite<PropertiesApiResponse>(getKey, fetcher, {
      fallbackData,
      revalidateFirstPage: false,
      parallel: false,
    });

  const properties = useMemo(
    () => (data ? data.flatMap((page) => page.properties) : initialProperties),
    [data, initialProperties],
  );

  const total = data?.[0]?.total ?? initialTotal;
  const hasMore = properties.length < total;
  const isLoadingMore =
    (isValidating || isLoading) &&
    size > 0 &&
    (data === undefined || typeof data[size - 1] === "undefined");

  useEffect(() => {
    setSize(1);
  }, [filterSignature, setSize]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isValidating) {
          setSize((current) => current + 1);
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isValidating, setSize]);

  return {
    properties,
    total,
    error,
    hasMore,
    isLoadingMore,
    sentinelRef,
  };
};
