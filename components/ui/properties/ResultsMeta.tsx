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
        <span className="text-xl font-serif font-medium text-brand-green">
          {total}
        </span>
        <span className="text-sm text-brand-green-light">
          {total === 1 ? "property" : "properties"} found
        </span>
        {showing < total && (
          <span className="text-xs text-brand-green-light/70">
            · showing {showing}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Select value={activeSort} onValueChange={handleSort}>
          <SelectTrigger
            className={clsx(
              "h-8 px-3 text-xs gap-2 rounded-lg",
              "border-brand-green-muted text-brand-green-light",
              "hover:border-brand-green hover:text-brand-green",
              "focus:ring-brand-green/20 w-auto",
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

        <div className="flex border border-brand-green-muted rounded-lg overflow-hidden">
          <button
            onClick={() => handleView("grid")}
            className={clsx(
              "w-8 h-8 flex items-center justify-center transition-colors",
              activeView === "grid"
                ? "bg-brand-green text-white"
                : "bg-white text-brand-green-light hover:bg-brand-green-subtle hover:text-brand-green",
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleView("list")}
            className={clsx(
              "w-8 h-8 flex items-center justify-center transition-colors border-l border-brand-green-muted",
              activeView === "list"
                ? "bg-brand-green text-white"
                : "bg-white text-brand-green-light hover:bg-brand-green-subtle hover:text-brand-green",
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
