"use client";

import { LayoutGrid, List } from "lucide-react";
import clsx from "clsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { useSearchParams } from "next/navigation";
import useUpdateQueryString from "@/hooks/useQueryString";
import { SORT_OPTIONS } from "@/constants";

type ResultsMetaProps = {
  total: number;
  showing: number;
};

const ResultsMeta = ({ total, showing }: ResultsMetaProps) => {
  const searchParams = useSearchParams();
  const updateQueryString = useUpdateQueryString();

  const activeSort = searchParams.get("sort") ?? "newest";
  const activeView = searchParams.get("view") ?? "grid";

  const handleSort = (value: string) => {
    updateQueryString({ sort: value, page: "1" });
  };

  const handleView = (value: "grid" | "list") => {
    updateQueryString({ view: value });
  };

  return (
    <div className="flex items-center justify-between px-6 py-3">
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-serif font-medium text-ink">{total}</span>
        <span className="text-sm text-ash">
          {total === 1 ? "property" : "properties"} found
        </span>
        {showing < total && (
          <span className="text-xs text-ash/70">· showing {showing}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Select value={activeSort} onValueChange={handleSort}>
          <SelectTrigger
            className={clsx(
              "h-8 px-3 text-xs gap-2 rounded-lg",
              "border-wire text-ash",
              "hover:border-wire hover:text-ink",
              "focus:ring-bg-ink/20 w-auto",
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex border border-wire rounded-lg overflow-hidden">
          <button
            onClick={() => handleView("grid")}
            className={clsx(
              "w-8 h-8 flex items-center justify-center transition-colors",
              activeView === "grid"
                ? "bg-ink text-white"
                : "bg-white text-ash hover:bg-cloud hover:text-ink",
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleView("list")}
            className={clsx(
              "w-8 h-8 flex items-center justify-center transition-colors border-l border-wire",
              activeView === "list"
                ? "bg-ink text-white"
                : "bg-white text-ash hover:bg-cloud hover:text-ink",
            )}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsMeta;
