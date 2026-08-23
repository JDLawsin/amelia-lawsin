"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { PropertyListItem } from "@/services/property.service";
import {
  buildPropertiesApiQuery,
  parsePropertyListFilters,
} from "@/lib/property-filters";
import { useSearchParams } from "next/navigation";
import PropertiesMapView from "./PropertiesMapView";
import PropertyResultsSheet from "./PropertyResultsSheet";
import PropertyInfiniteList from "./PropertyInfiniteList";
import MapLoadingOverlay from "./MapLoadingOverlay";
import MapPropertyPreviewCard from "./MapPropertyPreviewCard";
import type { MapBbox } from "./PropertiesMapInner";

type PropertiesMapBrowseProps = {
  initialProperties: PropertyListItem[];
  initialTotal: number;
  pageSize: number;
  filterSignature: string;
  onTotalChange?: (total: number) => void;
};

const mapFetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to load map properties");
  return response.json() as Promise<{
    properties: PropertyListItem[];
    total: number;
  }>;
};

const PropertiesMapBrowse = ({
  initialProperties,
  initialTotal,
  pageSize,
  filterSignature,
  onTotalChange,
}: PropertiesMapBrowseProps) => {
  const searchParams = useSearchParams();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(true);
  const [mapBbox, setMapBbox] = useState<MapBbox | null>(null);
  const [fitBoundsKey, setFitBoundsKey] = useState(filterSignature);
  const lastStableTotal = useRef(initialTotal);

  const mapQuery = useMemo(() => {
    const filters = parsePropertyListFilters(searchParams, { pageSize });
    return buildPropertiesApiQuery({
      ...filters,
      page: 1,
      pageSize: 200,
      bbox: mapBbox ?? undefined,
    });
  }, [searchParams, pageSize, mapBbox]);

  const swrKey = `/api/properties?${mapQuery}&forMap=1`;

  const { data, isLoading, isValidating } = useSWR(swrKey, mapFetcher, {
    fallbackData: {
      properties: initialProperties,
      total: initialTotal,
    },
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const properties = data?.properties ?? initialProperties;
  const total = data?.total ?? initialTotal;

  if (!isValidating && total > 0) {
    lastStableTotal.current = total;
  }

  const displayTotal =
    isValidating && total === 0
      ? lastStableTotal.current
      : total;

  useEffect(() => {
    onTotalChange?.(displayTotal);
  }, [displayTotal, onTotalChange]);

  useEffect(() => {
    setMapBbox(null);
    setFitBoundsKey(filterSignature);
    setSelectedSlug(null);
    setPreviewSlug(null);
    setHoveredSlug(null);
    lastStableTotal.current = initialTotal;
  }, [filterSignature, initialTotal]);

  const listHighlightSlug =
    selectedSlug && properties.some((p) => p.slug === selectedSlug)
      ? selectedSlug
      : hoveredSlug && properties.some((p) => p.slug === hoveredSlug)
        ? hoveredSlug
        : (properties[0]?.slug ?? null);

  const previewProperty = previewSlug
    ? properties.find((p) => p.slug === previewSlug)
    : null;

  const handleSelect = useCallback((slug: string) => {
    setSelectedSlug(slug);
    setPreviewSlug(slug);
    setSheetOpen(true);
  }, []);

  const handleHover = useCallback((slug: string | null) => {
    setHoveredSlug(slug);
  }, []);

  const handleBoundsChange = useCallback((bbox: MapBbox) => {
    setMapBbox((prev) => {
      if (
        prev &&
        Math.abs(prev.minLat - bbox.minLat) < 0.0001 &&
        Math.abs(prev.maxLat - bbox.maxLat) < 0.0001 &&
        Math.abs(prev.minLng - bbox.minLng) < 0.0001 &&
        Math.abs(prev.maxLng - bbox.maxLng) < 0.0001
      ) {
        return prev;
      }
      return bbox;
    });
  }, []);

  const resetMapBounds = () => {
    setMapBbox(null);
    setFitBoundsKey(`${filterSignature}-reset-${Date.now()}`);
  };

  const showValidatingOverlay =
    isValidating && !isLoading && properties.length > 0;

  const mapProps = {
    properties,
    selectedSlug,
    filterSignature,
    onBoundsChange: handleBoundsChange,
    boundsSearchEnabled: true,
    fitBoundsKey,
    onSelect: handleSelect,
  };

  const bboxPill = mapBbox ? (
    <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2 pointer-events-auto max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:max-w-[calc(100%-2rem)]">
      <span className="text-xs text-ink bg-white border border-wire shadow-apple rounded-full px-3 py-2 min-h-11 inline-flex items-center whitespace-nowrap">
        Showing homes in this area
      </span>
      <button
        type="button"
        onClick={resetMapBounds}
        className="text-xs font-medium text-ink bg-white border border-wire shadow-apple rounded-full px-3 py-2 min-h-11 hover:bg-cloud transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
      >
        Reset map
      </button>
    </div>
  ) : null;

  return (
    <>
      {/* Desktop split — CSS breakpoint avoids hydration layout mismatch */}
      <div className="hidden lg:grid lg:grid-cols-[2fr_3fr] lg:gap-0 lg:min-h-[calc(100vh-12rem)]">
        <div className="relative h-[calc(100vh-12rem)] min-h-80 border-r border-wire lg:sticky lg:top-[10rem] lg:self-start">
          <PropertiesMapView
            {...mapProps}
            hoveredSlug={hoveredSlug}
            className="absolute inset-0 h-full w-full"
          />
          {showValidatingOverlay && (
            <MapLoadingOverlay variant="updating" />
          )}
          {bboxPill}
          {previewProperty && (
            <MapPropertyPreviewCard
              property={previewProperty}
              onClose={() => setPreviewSlug(null)}
              placement="desktop"
            />
          )}
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
          <PropertyInfiniteList
            key={filterSignature}
            initialProperties={initialProperties}
            initialTotal={initialTotal}
            pageSize={pageSize}
            filterSignature={filterSignature}
            view="list"
            highlightedSlug={listHighlightSlug}
            onPropertySelect={handleSelect}
            onPropertyHover={handleHover}
          />
        </div>
      </div>

      {/* Mobile full-bleed map + bottom sheet */}
      <div className="lg:hidden relative min-h-[calc(100dvh-var(--map-chrome,8rem))]">
        <div className="absolute inset-0 z-0">
          <PropertiesMapView
            {...mapProps}
            hoveredSlug={null}
            className="h-full min-h-[calc(100dvh-var(--map-chrome,8rem))]"
          />
          {showValidatingOverlay && (
            <MapLoadingOverlay variant="updating" />
          )}
        </div>

        {bboxPill}

        {previewProperty && (
          <MapPropertyPreviewCard
            property={previewProperty}
            onClose={() => setPreviewSlug(null)}
            placement="mobile"
          />
        )}

        <PropertyResultsSheet
          properties={properties}
          total={displayTotal}
          selectedSlug={listHighlightSlug}
          onSelect={handleSelect}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          isValidating={showValidatingOverlay}
        />
      </div>
    </>
  );
};

export default PropertiesMapBrowse;
