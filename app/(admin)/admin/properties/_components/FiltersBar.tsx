"use client";

import SearchInput from "@/components/ui/SearchInput";
import {
  PROPERTY_VISIBILITY_LABELS,
  STATUS_LABELS,
  TYPE_LABELS,
} from "@/constants";
import useUpdateQueryString from "@/hooks/useQueryString";
import { useDebounce } from "@uidotdev/usehooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { PropertyAdminVisibilityFilter } from "@/services/property.admin.service";
import { useState, useEffect } from "react";

const FiltersBar = ({
  filters,
}: {
  filters: {
    q?: string;
    status?: string;
    type?: string;
    visibility?: PropertyAdminVisibilityFilter;
  };
}) => {
  const updateQueryString = useUpdateQueryString();
  const [searchValue, setSearchValue] = useState(filters.q ?? "");
  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    const currentQ = filters.q ?? "";
    if (debouncedSearch === currentQ) return;

    updateQueryString({
      q: debouncedSearch || undefined,
      page: "1",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <SearchInput
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search by title, location..."
      />

      <Select
        value={filters.visibility ?? "all"}
        onValueChange={(v) =>
          updateQueryString({
            visibility: v === "all" ? "" : v,
            page: "1",
          })
        }
      >
        <SelectTrigger className="h-9 w-full sm:w-40 rounded-xl bg-white">
          <SelectValue placeholder="All visibility" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(PROPERTY_VISIBILITY_LABELS).map(([v, l]) => (
            <SelectItem key={v} value={v}>
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status ?? "all"}
        onValueChange={(v) =>
          updateQueryString({
            status: v === "all" ? "" : v,
            page: "1",
          })
        }
      >
        <SelectTrigger className="h-9 w-full sm:w-35 rounded-xl bg-white">
          <SelectValue placeholder="All market status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All market status</SelectItem>
          {Object.entries(STATUS_LABELS).map(([v, l]) => (
            <SelectItem key={v} value={v}>
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.type ?? "all"}
        onValueChange={(v) =>
          updateQueryString({
            type: v === "all" ? "" : v,
            page: "1",
          })
        }
      >
        <SelectTrigger className="h-9 w-full sm:w-40 rounded-xl bg-white">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {Object.entries(TYPE_LABELS).map(([v, l]) => (
            <SelectItem key={v} value={v}>
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FiltersBar;
