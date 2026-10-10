"use client";

import { useSearchParams } from "next/navigation";

type PropertiesPageHeaderProps = {
  total: number;
  hasActiveFilters: boolean;
};

const PropertiesPageHeader = ({
  total,
  hasActiveFilters,
}: PropertiesPageHeaderProps) => {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  if (view === "map") return null;

  return (
    <div className="bg-cloud border-b border-wire px-6 py-3 md:py-5">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs text-ash mb-1">
          {"Home"} <span className="mx-1 opacity-50">/</span> {"Properties"}
        </p>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-semibold text-ink leading-tight">
              {"All Properties"}
            </h1>
            <p className="text-sm text-ash mt-0.5">
              {"Explore listings across Cebu — condos, houses, lots & more"}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl md:text-2xl font-serif font-medium text-ink tabular-nums">
              {total}
            </p>
            <p className="text-xs text-ash">
              {hasActiveFilters ? "matching results" : "active listings"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPageHeader;
