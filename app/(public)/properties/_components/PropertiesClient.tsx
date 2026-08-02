"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { PropertyListItem } from "@/services/property.service";
import SearchBar from "./SearchBar";
import ChipsRow from "./ChipsRow";
import FilterPanel from "./FilterPanel";
import ResultsMeta from "./ResultsMeta";
import PropertyGrid from "./PropertyGrid";
import Pagination from "@/components/ui/Pagination";

type Props = {
  properties: PropertyListItem[];
  total: number;
  pageSize: number;
  currentPage: number;
};

const PropertiesClient = ({
  properties,
  total,
  pageSize,
  currentPage,
}: Props) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterKey, setFilterKey] = useState(0);
  const searchParams = useSearchParams();

  const view = (searchParams.get("view") ?? "grid") as "grid" | "list";

  const activeFilterCount = useMemo(() => {
    const filterKeys = [
      "status",
      "type",
      "city",
      "minPrice",
      "maxPrice",
      "bedrooms",
      "special",
    ];
    return filterKeys.filter((key) => searchParams.has(key)).length;
  }, [searchParams]);

  return (
    <div className="flex flex-col pb-10 max-w-7xl mx-auto">
      <SearchBar
        isFilterOpen={isFilterOpen}
        onFilterToggle={useCallback(() => {
          setIsFilterOpen((prev) => {
            const next = !prev;
            if (next) setFilterKey((k) => k + 1);
            return next;
          });
        }, [])}
        activeFilterCount={activeFilterCount}
      />
      <ChipsRow />
      {isFilterOpen && <FilterPanel key={filterKey} isOpen={isFilterOpen} />}
      <ResultsMeta total={total} />
      <PropertyGrid properties={properties} view={view} />
      {total > pageSize && (
        <div className="mt-6 -mx-6 px-6">
          <Pagination
            page={currentPage}
            pageSize={pageSize}
            total={total}
            label="properties"
          />
        </div>
      )}
    </div>
  );
};

export default PropertiesClient;
