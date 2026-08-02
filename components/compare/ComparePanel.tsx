"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, GitCompare } from "lucide-react";
import { useCompare } from "@/providers/CompareProvider";
import { useCompareProperties } from "@/lib/hooks/useCompareProperties";
import { ComparePropertyRow } from "./ComparePropertyRow";
import { cn } from "@/lib/utils";
import {
  toolsPanelPositionClassName,
  toolsPanelSizeClassName,
} from "@/components/tools/tools-layout";

type Props = {
  open: boolean;
  onClose: () => void;
  onCompareNow: () => void;
};

export const ComparePanel = ({ open, onClose, onCompareNow }: Props) => {
  const { compareSlugs, clearCompare } = useCompare();
  const { properties, isPending, hasFetched } = useCompareProperties(
    open,
    compareSlugs,
  );

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const canCompare = compareSlugs.length >= 2;

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Compare properties"
      className={cn(
        toolsPanelPositionClassName,
        toolsPanelSizeClassName,
        "flex flex-col bg-white border border-wire rounded-2xl shadow-apple-lg overflow-hidden overscroll-contain",
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-wire bg-cloud">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-ink" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-ink">Compare</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close compare"
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white text-ash hover:text-ink transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-4 py-2 border-b border-wire">
        <p className="text-xs text-ash">
          {compareSlugs.length} of 3 selected
          {compareSlugs.length >= 3 && (
            <span className="text-ink font-medium ml-1">(max)</span>
          )}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {isPending && !hasFetched ? (
          <div className="py-8 text-center text-xs text-ash">
            Loading compare list…
          </div>
        ) : properties.length === 0 ? (
          <div className="py-8 text-center px-4">
            <p className="text-xs text-ash">
              No properties selected for comparison.
            </p>
            <Link
              href="/properties"
              onClick={onClose}
              className="inline-block mt-2 text-xs text-ink font-medium hover:underline"
            >
              Browse properties
            </Link>
          </div>
        ) : (
          properties.map((property) => (
            <ComparePropertyRow key={property.slug} property={property} />
          ))
        )}
      </div>

      <div className="p-3 border-t border-wire space-y-2">
        <button
          type="button"
          onClick={onCompareNow}
          disabled={!canCompare}
          className={cn(
            "w-full h-10 rounded-xl text-sm font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ink",
            canCompare
              ? "bg-ink text-white hover:bg-ink/90"
              : "bg-cloud text-fog cursor-not-allowed",
          )}
        >
          {canCompare
            ? `Compare Now (${compareSlugs.length})`
            : "Select 2 or More to Compare"}
        </button>
        <button
          type="button"
          onClick={() => {
            clearCompare();
            onClose();
          }}
          className="w-full h-9 rounded-xl text-xs font-medium text-ash hover:text-ink hover:bg-cloud transition-colors cursor-pointer border border-wire focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};
