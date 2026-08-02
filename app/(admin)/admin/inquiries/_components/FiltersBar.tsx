"use client";

import SearchInput from "@/components/ui/SearchInput";
import {
  INQUIRY_STATUS_LABELS,
  INQUIRY_SOURCE_LABELS,
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
import { useState, useEffect, ChangeEvent } from "react";
import { InquiryAdminStatusFilter } from "@/services/inquiry.admin.service";

type Props = {
  filters: {
    q?: string;
    status?: InquiryAdminStatusFilter;
    source?: string;
    from?: string;
    to?: string;
  };
};

const FiltersBar = ({ filters }: Props) => {
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

  const updateStatus = (value: string) => {
    updateQueryString({
      status: value === "all" ? "" : value,
      page: "1",
    });
  };

  const updateSource = (value: string) => {
    updateQueryString({
      source: value === "all" ? "" : value,
      page: "1",
    });
  };

  const updateDate = (
    key: "from" | "to",
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    updateQueryString({
      [key]: event.target.value || undefined,
      page: "1",
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <SearchInput
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search by name, email, property..."
      />

      <div className="flex flex-col sm:flex-row gap-2">
        <Select
          value={filters.status ?? "all"}
          onValueChange={updateStatus}
        >
          <SelectTrigger className="h-9 w-full sm:w-36 rounded-xl bg-white">
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(INQUIRY_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.source ?? "all"} onValueChange={updateSource}>
          <SelectTrigger className="h-9 w-full sm:w-40 rounded-xl bg-white">
            <SelectValue placeholder="All sources" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(INQUIRY_SOURCE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.from ?? ""}
            onChange={(e) => updateDate("from", e)}
            className="h-9 px-3 rounded-xl border border-input bg-white text-xs text-ink focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="From date"
          />
          <span className="text-xs text-ash">to</span>
          <input
            type="date"
            value={filters.to ?? ""}
            onChange={(e) => updateDate("to", e)}
            className="h-9 px-3 rounded-xl border border-input bg-white text-xs text-ink focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="To date"
          />
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
