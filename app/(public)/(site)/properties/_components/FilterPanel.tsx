"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { LocalFilterState } from "@/lib/property-browse-chips";
import { emptyLocalFilterState } from "@/lib/property-browse-chips";
import { useFilterPreviewCount } from "@/lib/hooks/useFilterPreviewCount";
import FilterPanelContent from "./FilterPanelContent";

type FilterPanelProps = {
  isOpen: boolean;
};

const FilterPanel = ({ isOpen }: FilterPanelProps) => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";
  const [localFilters, setLocalFilters] = useState<LocalFilterState>(
    emptyLocalFilterState(),
  );

  const handleLocalFiltersChange = useCallback((filters: LocalFilterState) => {
    setLocalFilters(filters);
  }, []);

  const { previewTotal, isPreviewLoading } = useFilterPreviewCount({
    enabled: isOpen,
    localFilters,
    searchQuery,
  });

  if (!isOpen) return null;

  return (
    <div className="mx-6 mt-3 bg-cloud border border-wire rounded-2xl p-5 shadow-apple-lg hidden md:block">
      <FilterPanelContent
        previewEnabled={isOpen}
        previewTotal={previewTotal}
        isPreviewLoading={isPreviewLoading}
        onLocalFiltersChange={handleLocalFiltersChange}
      />
    </div>
  );
};

export default FilterPanel;
