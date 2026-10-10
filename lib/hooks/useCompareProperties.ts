"use client";

import { useEffect, useState, useTransition } from "react";
import { getCompareDataBySlugs } from "@/app/_actions/compare.actions";
import { ComparePropertyItem } from "@/services/property.service";

export const useCompareProperties = (open: boolean, slugs: string[]) => {
  const [properties, setProperties] = useState<ComparePropertyItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasFetched, setHasFetched] = useState(false);
  const slugsKey = slugs.join(",");

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const slugList = slugsKey ? slugsKey.split(",") : [];

    startTransition(async () => {
      try {
        const data = await getCompareDataBySlugs(slugList);
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
  }, [open, slugsKey]);

  return { properties, isPending, hasFetched };
};
