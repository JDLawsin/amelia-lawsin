"use client";

import { PropertyListItem } from "@/services/property.service";
import type { PropertyBrowseView } from "@/lib/property-browse";
import { usePropertiesInfinite } from "@/lib/hooks/usePropertiesInfinite";
import PropertyGrid from "./PropertyGrid";

type PropertyInfiniteListProps = {
  initialProperties: PropertyListItem[];
  initialTotal: number;
  pageSize: number;
  filterSignature: string;
  view: PropertyBrowseView;
  highlightedSlug?: string | null;
  onPropertySelect?: (slug: string) => void;
  onPropertyHover?: (slug: string | null) => void;
};

export const ListRowSkeleton = () => (
  <div className="flex gap-3 rounded-xl border border-wire bg-white p-3">
    <div className="w-22 shrink-0 self-stretch min-h-18 rounded-lg bg-cloud/60 animate-pulse motion-reduce:animate-none" />
    <div className="flex-1 flex flex-col gap-2 py-0.5">
      <div className="h-4 w-3/4 rounded bg-cloud/60 animate-pulse motion-reduce:animate-none" />
      <div className="h-5 w-1/3 rounded bg-cloud/60 animate-pulse motion-reduce:animate-none" />
      <div className="h-3 w-2/3 rounded bg-cloud/60 animate-pulse motion-reduce:animate-none" />
      <div className="h-5 w-20 rounded-md bg-cloud/60 animate-pulse motion-reduce:animate-none" />
    </div>
  </div>
);

const PhotoCardSkeleton = () => (
  <div className="rounded-xl border border-wire bg-white overflow-hidden">
    <div className="aspect-[3/2] bg-cloud/60 animate-pulse motion-reduce:animate-none" />
    <div className="p-2.5 flex flex-col gap-1.5">
      <div className="h-4 w-1/2 rounded bg-cloud/60 animate-pulse motion-reduce:animate-none" />
      <div className="h-3 w-full rounded bg-cloud/60 animate-pulse motion-reduce:animate-none" />
    </div>
  </div>
);

const PropertyInfiniteList = ({
  initialProperties,
  initialTotal,
  pageSize,
  filterSignature,
  view,
  highlightedSlug,
  onPropertySelect,
  onPropertyHover,
}: PropertyInfiniteListProps) => {
  const {
    properties,
    total,
    error,
    hasMore,
    isLoadingMore,
    sentinelRef,
  } = usePropertiesInfinite({
    initialProperties,
    initialTotal,
    pageSize,
    filterSignature,
  });

  const isListView = view === "list";

  return (
    <div className="flex flex-col">
      <PropertyGrid
        properties={properties}
        view={view}
        highlightedSlug={highlightedSlug}
        onPropertySelect={onPropertySelect}
        onPropertyHover={onPropertyHover}
      />

      {isLoadingMore && (
        <div
          className={
            isListView
              ? "px-6 flex flex-col gap-2 mt-2"
              : "px-6 grid grid-cols-2 gap-2 mt-2"
          }
          aria-hidden="true"
        >
          {isListView ? (
            <>
              <ListRowSkeleton />
              <ListRowSkeleton />
            </>
          ) : (
            <>
              <PhotoCardSkeleton />
              <PhotoCardSkeleton />
              <PhotoCardSkeleton />
              <PhotoCardSkeleton />
            </>
          )}
        </div>
      )}

      <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />

      <div className="px-6 py-4" aria-live="polite">
        {error && (
          <p className="text-xs text-ash text-center">
            Could not load more properties. Scroll again to retry.
          </p>
        )}
        {isLoadingMore && (
          <p className="text-xs text-ash text-center">Loading more…</p>
        )}
        {!hasMore && !isLoadingMore && total > 0 && (
          <p className="text-xs text-ash text-center">
            All {total} properties loaded.
          </p>
        )}
      </div>
    </div>
  );
};

export default PropertyInfiniteList;
