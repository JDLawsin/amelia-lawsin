"use client";

import { useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const useCurrentUrl = (): string => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const origin = useSyncExternalStore(
    () => () => {},
    () => (typeof window !== "undefined" ? window.location.origin : ""),
    () => "",
  );

  if (!pathname) return "";

  const search = searchParams?.toString();
  const query = search ? `?${search}` : "";

  return `${origin}${pathname}${query}`;
};
