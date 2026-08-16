"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import LoadingStatusText from "@/components/ui/LoadingStatusText";
import type { LoadingContext } from "@/lib/loading-messages";

const contextFromPath = (pathname: string): LoadingContext => {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/properties/")) return "property-detail";
  if (pathname.startsWith("/properties")) return "properties";
  if (pathname.startsWith("/blog")) return "blog";
  return "generic";
};

const RouteLoadingScreen = () => {
  const pathname = usePathname();
  const context = useMemo(() => contextFromPath(pathname), [pathname]);

  return (
    <main
      className="min-h-[70vh] flex flex-col items-center justify-center px-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <svg
        width="56"
        height="56"
        viewBox="0 0 42 42"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="animate-brand-pulse"
      >
        <rect x="2" y="2" width="38" height="38" rx="9" fill="#1d1d1f" />
        <path
          d="M21 9 L9 35 L33 35 Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="14"
          y1="26"
          x2="28"
          y2="26"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="17" y="26" width="8" height="9" rx="1" fill="#ffffff" />
        <line
          x1="21"
          y1="26"
          x2="21"
          y2="35"
          stroke="#1d1d1f"
          strokeWidth="1"
        />
      </svg>

      <LoadingStatusText
        context={context}
        className="mt-5 text-xs text-ash tracking-wide max-w-xs"
      />
    </main>
  );
};

export default RouteLoadingScreen;
