"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import useUpdateQueryString from "@/hooks/useQueryString";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import { Badge } from "@/components/ui/shadcn/badge";

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
  const initialQ = searchParams.get("q") ?? "";

  // Controlled local value; only commit to the URL after the user stops
  // typing (debounced). Avoids a full server refetch per keystroke and uses
  // router.replace so rapid typing doesn't pollute browser history.
  const [searchValue, setSearchValue] = useState(initialQ);
  const debouncedSearch = useDebounce(searchValue, 300);

  // Keep a live ref to the query-string updater so the debounced commit
  // effect below can stay keyed only to the debounced value. The updater
  // internally reads searchParams when called, so a stale closure is safe.
  const updateQueryStringRef = useRef(updateQueryString);
  useEffect(() => {
    updateQueryStringRef.current = updateQueryString;
  });

  // Sync input with external URL changes (e.g. back/forward navigation)
  // without disturbing the debounced commit below.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchValue((current) => (current === initialQ ? current : initialQ));
    }, 0);
    return () => clearTimeout(timer);
  }, [initialQ]);

  useEffect(() => {
    if (debouncedSearch) {
      updateQueryStringRef.current(
        { q: debouncedSearch, page: "1" },
        [],
        { replace: true },
      );
    } else {
      updateQueryStringRef.current({}, ["q", "page"], { replace: true });
    }
  }, [debouncedSearch]);

  return (
    <div className="flex items-center gap-3 px-6 pt-5">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
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
              "h-4 w-4 p-0 flex items-center justify-center text-[10px] rounded-full shadow-apple-sm",
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
