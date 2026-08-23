"use client";

import { useSearchParams } from "next/navigation";
import useUpdateQueryString from "@/hooks/useQueryString";
import { getAppliedFilters } from "@/lib/property-browse-chips";
import FilterChip from "./FilterChip";
import { Button } from "@/components/ui/shadcn/button";

const AppliedFiltersRow = () => {
  const searchParams = useSearchParams();
  const updateQueryString = useUpdateQueryString();
  const applied = getAppliedFilters(searchParams);

  if (applied.length === 0) return null;

  const handleRemove = (removeKeys: string[]) => {
    updateQueryString({}, removeKeys);
  };

  const handleClearAll = () => {
    updateQueryString(
      {},
      [
        "status",
        "type",
        "special",
        "city",
        "bedrooms",
        "minPrice",
        "maxPrice",
        "page",
      ],
    );
  };

  return (
    <div
      className="px-6 pb-2 flex items-center gap-2 overflow-x-auto scrollbar-none"
      aria-live="polite"
    >
      <div className="flex flex-nowrap items-center gap-2 min-w-0">
        {applied.map((filter) => (
          <FilterChip
            key={filter.id}
            label={filter.label}
            dismissible
            onClick={() => handleRemove(filter.removeKeys)}
          />
        ))}
      </div>
      {applied.length >= 2 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          className="shrink-0 text-xs text-ash hover:text-ink min-h-11 px-2"
        >
          Clear all
        </Button>
      )}
    </div>
  );
};

export default AppliedFiltersRow;
