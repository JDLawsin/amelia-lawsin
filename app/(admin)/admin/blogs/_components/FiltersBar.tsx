"use client";

import SearchInput from "@/components/ui/SearchInput";
import useUpdateQueryString from "@/hooks/useQueryString";
import { useDebounce } from "@uidotdev/usehooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { BLOG_STATUS_LABELS } from "@/constants";
import { BlogAdminStatusFilter } from "@/services/blog.admin.service";
import { useState, useEffect } from "react";

type Props = {
  filters: {
    q?: string;
    status?: BlogAdminStatusFilter;
  };
};

const FiltersBar = ({ filters }: Props) => {
  const updateQueryString = useUpdateQueryString();
  const [searchValue, setSearchValue] = useState(filters.q ?? "");
  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
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
        placeholder="Search by title, excerpt, tag..."
      />

      <Select
        value={filters.status ?? "all"}
        onValueChange={(v) =>
          updateQueryString({
            status: v === "all" ? "" : v,
            page: "1",
          })
        }
      >
        <SelectTrigger className="h-9 w-full sm:w-40 rounded-xl bg-white">
          <SelectValue placeholder="All status" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(BLOG_STATUS_LABELS).map(([v, l]) => (
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
