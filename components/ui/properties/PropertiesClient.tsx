"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ChipsRow from "./ChipsRow";
import { PropertyListItem } from "@/services/property.service";
import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";
import ResultsMeta from "./ResultsMeta";
import PropertyGrid from "./PropertyGrid";
import LoadMore from "./LoadMore";

type Props = {
  properties: PropertyListItem[];
  total: number;
  pageSize: number;
};

const PropertiesClient = ({ properties, total, pageSize }: Props) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
    <div className="flex flex-col pb-10">
      <SearchBar
        isFilterOpen={isFilterOpen}
        onFilterToggle={() => setIsFilterOpen((prev) => !prev)}
        activeFilterCount={activeFilterCount}
      />
      <ChipsRow />
      <FilterPanel isOpen={isFilterOpen} totalResults={total} />
      <ResultsMeta total={total} showing={properties.length} />
      <PropertyGrid properties={properties} view={view} />
      <LoadMore showing={properties.length} total={total} pageSize={pageSize} />
    </div>
  );
};

export default PropertiesClient;
