"use client";

import { useEffect, useRef, useState } from "react";
import { GitCompare, Heart, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/providers/FavoritesProvider";
import { useCompare } from "@/providers/CompareProvider";

const segmentClass = cn(
  "flex flex-1 flex-col items-center justify-center gap-1 py-3 min-h-11",
  "text-ash transition-colors touch-manipulation",
  "hover:bg-white/70 active:bg-white",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink",
);

type Props = {
  slug: string;
};

const PropertyListingToolbar = ({ slug }: Props) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isComparing, toggleCompare, canAddMore } = useCompare();
  const favorited = isFavorite(slug);
  const comparing = isComparing(slug);
  const [showMaxMessage, setShowMaxMessage] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCompare = () => {
    const ok = toggleCompare(slug);
    if (!ok) {
      setShowMaxMessage(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowMaxMessage(false), 2000);
    }
  };

  const compareDisabled = !comparing && !canAddMore;
  const saveLabel = favorited ? "Saved" : "Save";
  const compareLabel = comparing ? "Comparing" : "Compare";

  return (
    <div className="relative pb-5" data-print-hide>
      <div className="flex divide-x divide-wire overflow-hidden rounded-xl border border-wire bg-cloud/30">
        <button
          type="button"
          onClick={() => toggleFavorite(slug)}
          aria-pressed={favorited}
          aria-label={favorited ? "Remove from saved" : "Save property"}
          className={cn(
            segmentClass,
            favorited && "bg-white text-ink font-medium",
          )}
        >
          <Heart
            className={cn(
              "h-4 w-4",
              favorited && "fill-current text-ink",
            )}
            aria-hidden="true"
          />
          <span className="text-[10px] font-medium">{saveLabel}</span>
        </button>

        <button
          type="button"
          onClick={handleCompare}
          disabled={compareDisabled}
          aria-pressed={comparing}
          aria-label={
            comparing
              ? "Remove from compare"
              : compareDisabled
                ? "Compare list full (max 3)"
                : "Add to compare"
          }
          className={cn(
            segmentClass,
            comparing && "bg-ink text-white hover:bg-ink/90 active:bg-ink/90",
            compareDisabled &&
              "cursor-not-allowed opacity-50 hover:bg-transparent active:bg-transparent",
          )}
        >
          <GitCompare className="h-4 w-4" aria-hidden="true" />
          <span className="text-[10px] font-medium">{compareLabel}</span>
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          aria-label="Print fact sheet"
          className={segmentClass}
        >
          <Printer className="h-4 w-4" aria-hidden="true" />
          <span className="text-[10px] font-medium">Print</span>
        </button>
      </div>

      {showMaxMessage ? (
        <p
          role="status"
          aria-live="polite"
          className="absolute -bottom-6 left-0 right-0 text-center text-[10px] font-medium text-ash"
        >
          Compare list is full (max 3)
        </p>
      ) : null}
    </div>
  );
};

export default PropertyListingToolbar;
