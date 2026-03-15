"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import useUpdateQueryString from "@/hooks/useQueryString";
import { Button } from "../shadcn/button";
import { Badge } from "../shadcn/badge";
import { Input } from "../shadcn/input";

type SearchBarProps = {
  isFilterOpen: boolean;
  onFilterToggle: () => void;
  activeFilterCount: number;
};

const SearchBar = ({
  isFilterOpen,
  onFilterToggle,
  activeFilterCount,
}: SearchBarProps) => {
  const updateQueryString = useUpdateQueryString();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      updateQueryString({ q: value, page: "1" });
    } else {
      updateQueryString({}, ["q", "page"]);
    }
  };

  return (
    <div className="flex items-center gap-3 px-6 pt-5">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
        <Input
          ref={inputRef}
          defaultValue={searchParams.get("q") ?? ""}
          onChange={handleSearch}
          placeholder="Search by location, developer, or keyword..."
          className={clsx(
            "pl-9 h-11 bg-cloud",
            "border-wire text-ink",
            "placeholder:text-ash/60",
            "focus-visible:ring-bg-ink/30 focus-visible:border-wire",
            "rounded-xl text-sm",
          )}
        />
      </div>

      <Button
        variant="outline"
        onClick={onFilterToggle}
        className={clsx(
          "h-11 px-4 gap-2 rounded-xl text-sm font-medium",
          "border-wire transition-colors",
          isFilterOpen
            ? "bg-ink text-white border-wire hover:bg-ink/90 hover:text-white"
            : "text-ink hover:bg-cloud hover:text-ink",
        )}
      >
        <SlidersHorizontal className="w-4 h-4" />
        {"Filters"}
        {activeFilterCount > 0 && (
          <Badge
            className={clsx(
              "h-4 w-4 p-0 flex items-center justify-center text-[10px] rounded-full",
              isFilterOpen ? "bg-ink text-white" : "bg-ink text-white",
            )}
          >
            {activeFilterCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};

export default SearchBar;
