"use client";

import { useEffect, useState, useTransition } from "react";
import { getCompareDataBySlugs } from "@/app/_actions/compare.actions";
import { ComparePropertyItem } from "@/services/property.service";

export const useCompareProperties = (open: boolean, slugs: string[]) => {
  const [properties, setProperties] = useState<ComparePropertyItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    startTransition(async () => {
      try {
        const data = await getCompareDataBySlugs(slugs);
        if (!cancelled) setProperties(data);
      } catch (err) {
        console.error("Failed to load compare data", err);
      } finally {
        if (!cancelled) setHasFetched(true);
      }
    });

    return () => {
      cancelled = true;
      setHasFetched(false);
    };
  }, [open, slugs.join(",")]);

  return { properties, isPending, hasFetched };
};
