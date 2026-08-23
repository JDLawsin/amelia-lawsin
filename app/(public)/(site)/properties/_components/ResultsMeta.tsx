"use client";

import { LayoutGrid, List, Map, ImageIcon } from "lucide-react";
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
import type { PropertyBrowseView } from "@/lib/property-browse";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

type ResultsMetaProps = {
  total: number;
};

const ResultsMeta = ({ total }: ResultsMetaProps) => {
  const searchParams = useSearchParams();
  const updateQueryString = useUpdateQueryString();
  const isMobile = useMediaQuery("(max-width: 767px)");

  const activeSort = searchParams.get("sort") ?? "newest";
  const rawView = searchParams.get("view");
  const activeView: PropertyBrowseView =
    rawView === "map"
      ? "map"
      : rawView === "list"
        ? "list"
        : rawView === "photos"
          ? "photos"
          : rawView === "grid"
            ? isMobile
              ? "photos"
              : "grid"
            : isMobile
              ? "list"
              : "grid";

  const handleSort = (value: string) => {
    updateQueryString({ sort: value, page: "1" });
  };

  const handleView = (value: PropertyBrowseView) => {
    updateQueryString({ view: value, page: "1" });
  };

  const viewButtons: {
    value: PropertyBrowseView;
    label: string;
    icon: React.ReactNode;
    mobileOnly?: boolean;
    desktopOnly?: boolean;
  }[] = [
    {
      value: "list",
      label: "List view",
      icon: <List className="w-4 h-4" aria-hidden="true" />,
    },
    {
      value: "photos",
      label: "Photos view",
      icon: <ImageIcon className="w-4 h-4" aria-hidden="true" />,
      mobileOnly: true,
    },
    {
      value: "grid",
      label: "Grid view",
      icon: <LayoutGrid className="w-4 h-4" aria-hidden="true" />,
      desktopOnly: true,
    },
    {
      value: "map",
      label: "Map view",
      icon: <Map className="w-4 h-4" aria-hidden="true" />,
    },
  ];

  const visibleButtons = viewButtons.filter((btn) => {
    if (btn.mobileOnly && !isMobile) return false;
    if (btn.desktopOnly && isMobile) return false;
    return true;
  });

  if (activeView === "map") {
    return (
      <div className="flex items-center justify-between px-6 py-2 gap-3">
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="text-lg font-serif font-medium text-ink tabular-nums">
            {total}
          </span>
          <span className="text-sm text-ash truncate">
            {total === 1 ? "property" : "properties"}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Select value={activeSort} onValueChange={handleSort}>
            <SelectTrigger
              aria-label="Sort properties"
              className="h-11 px-3 text-xs gap-2 rounded-lg border-wire text-ash hover:border-wire hover:text-ink focus:ring-bg-ink/20 w-auto"
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

          <div
            className="flex border border-wire rounded-lg overflow-hidden"
            role="group"
            aria-label="View layout"
          >
            {visibleButtons.map((btn, index) => (
              <button
                key={btn.value}
                type="button"
                onClick={() => handleView(btn.value)}
                aria-label={btn.label}
                aria-pressed={activeView === btn.value}
                className={clsx(
                  "w-11 h-11 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2",
                  index > 0 && "border-l border-wire",
                  activeView === btn.value
                    ? "bg-ink text-white"
                    : "bg-white text-ash hover:bg-cloud hover:text-ink",
                )}
              >
                {btn.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 gap-3">
      <div className="flex items-baseline gap-1.5 min-w-0">
        <span className="text-xl font-serif font-medium text-ink tabular-nums">
          {total}
        </span>
        <span className="text-sm text-ash truncate">
          {total === 1 ? "property" : "properties"} found
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Select value={activeSort} onValueChange={handleSort}>
          <SelectTrigger
            aria-label="Sort properties"
            className={clsx(
              "h-11 px-3 text-xs gap-2 rounded-lg",
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

        <div
          className="flex border border-wire rounded-lg overflow-hidden"
          role="group"
          aria-label="View layout"
        >
          {visibleButtons.map((btn, index) => (
            <button
              key={btn.value}
              type="button"
              onClick={() => handleView(btn.value)}
              aria-label={btn.label}
              aria-pressed={activeView === btn.value}
              className={clsx(
                "w-11 h-11 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2",
                index > 0 && "border-l border-wire",
                activeView === btn.value
                  ? "bg-ink text-white"
                  : "bg-white text-ash hover:bg-cloud hover:text-ink",
              )}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsMeta;
