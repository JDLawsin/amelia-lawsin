"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { PropertyListItem } from "@/services/property.service";
import {
  buildPropertiesApiQuery,
  parsePropertyListFilters,
} from "@/lib/property-filters";
import { useSearchParams } from "next/navigation";
import { useFavorites } from "@/providers/FavoritesProvider";
import PropertiesMapView from "./PropertiesMapView";
import PropertyResultsSheet from "./PropertyResultsSheet";
import PropertyInfiniteList from "./PropertyInfiniteList";
import MapLoadingOverlay from "./MapLoadingOverlay";
import MapPropertyPreviewCard from "./MapPropertyPreviewCard";
import MapPropertyLegend from "./MapPropertyLegend";
import MapCoverageNotice from "./MapCoverageNotice";
import type { MapBbox } from "./PropertiesMapInner";
import { countMapPropertyTypes } from "@/lib/property-type-map";
import {
  getMapViewedSlugs,
  markMapPropertyViewed,
} from "@/lib/map-viewed-store";
import { clearMapViewport } from "@/lib/map-viewport-store";

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
  const { favoriteSet } = useFavorites();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [previewHidden, setPreviewHidden] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(true);
  const [mapBbox, setMapBbox] = useState<MapBbox | null>(null);
  const [fitBoundsKey, setFitBoundsKey] = useState(filterSignature);
  const [viewedSlugs, setViewedSlugs] = useState<Set<string>>(
    () => new Set(),
  );
  const lastStableTotal = useRef(initialTotal);

  useEffect(() => {
    setViewedSlugs(getMapViewedSlugs());
  }, []);

  const favoriteSlugSet = favoriteSet;

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
    isValidating && total === 0 ? lastStableTotal.current : total;

  useEffect(() => {
    onTotalChange?.(displayTotal);
  }, [displayTotal, onTotalChange]);

  useEffect(() => {
    setMapBbox(null);
    setFitBoundsKey(filterSignature);
    setSelectedSlug(null);
    setPreviewHidden(false);
    setHoveredSlug(null);
    lastStableTotal.current = initialTotal;
    clearMapViewport();
  }, [filterSignature, initialTotal]);

  const listHighlightSlug =
    selectedSlug && properties.some((p) => p.slug === selectedSlug)
      ? selectedSlug
      : hoveredSlug && properties.some((p) => p.slug === hoveredSlug)
        ? hoveredSlug
        : (properties[0]?.slug ?? null);

  const previewProperty = selectedSlug
    ? properties.find((p) => p.slug === selectedSlug)
    : null;

  const handleSelect = useCallback((slug: string) => {
    markMapPropertyViewed(slug);
    setViewedSlugs(getMapViewedSlugs());
    setSelectedSlug(slug);
    setPreviewHidden(false);
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
    clearMapViewport();
    setFitBoundsKey(`${filterSignature}-reset-${Date.now()}`);
  };

  const showValidatingOverlay =
    isValidating && !isLoading && properties.length > 0;

  const mapTypeCounts = useMemo(
    () => countMapPropertyTypes(properties),
    [properties],
  );

  const mapProps = {
    properties,
    selectedSlug,
    filterSignature,
    onBoundsChange: handleBoundsChange,
    boundsSearchEnabled: true,
    fitBoundsKey,
    onSelect: handleSelect,
    viewedSlugs,
    favoriteSlugs: favoriteSlugSet,
  };

  const renderMapTopBar = (context: "map-desktop" | "map-mobile") => (
    <div className="absolute top-4 left-4 right-4 z-20 flex items-start justify-between gap-3 pointer-events-none">
      <div className="pointer-events-auto min-w-0 flex-1">
        <MapCoverageNotice
          mapCount={properties.length}
          totalCount={displayTotal}
          context={context}
        />
      </div>
      {mapBbox ? (
        <button
          type="button"
          onClick={resetMapBounds}
          className="pointer-events-auto text-xs font-medium text-ink bg-white border border-wire shadow-apple rounded-full px-3 py-2 min-h-11 hover:bg-cloud transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          Reset map
        </button>
      ) : null}
    </div>
  );

  const previewCardOverlay =
    previewProperty && !previewHidden ? (
      <div
        className="absolute z-20 pointer-events-auto
          lg:bottom-4 lg:right-4 lg:left-auto
          max-lg:bottom-4 max-lg:left-4 max-lg:right-4 max-lg:pb-[env(safe-area-inset-bottom,0px)]"
      >
        <MapPropertyPreviewCard
          property={previewProperty}
          onClose={() => setPreviewHidden(true)}
        />
      </div>
    ) : null;

  const legendOverlay = (
    <div
      className="absolute bottom-4 left-4 z-20 pointer-events-auto w-72 max-w-[calc(100%-2rem)] max-lg:hidden"
    >
      <MapPropertyLegend typeCounts={mapTypeCounts} defaultOpen={false} />
    </div>
  );

  return (
    <>
      <div className="hidden lg:grid lg:grid-cols-[2fr_3fr] lg:gap-0 lg:min-h-[calc(100vh-12rem)]">
        <div className="relative isolate z-0 overflow-hidden h-[calc(100vh-12rem)] min-h-80 border-r border-wire lg:sticky lg:top-[10rem] lg:self-start">
          <PropertiesMapView
            {...mapProps}
            hoveredSlug={hoveredSlug}
            className="absolute inset-0 h-full w-full"
          />
          {showValidatingOverlay && (
            <MapLoadingOverlay variant="updating" />
          )}
          {renderMapTopBar("map-desktop")}
          {previewCardOverlay}
          {legendOverlay}
        </div>
        <div className="relative z-20 overflow-y-auto max-h-[calc(100vh-12rem)] bg-background">
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

      <div className="lg:hidden relative h-full min-h-0">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <PropertiesMapView
            {...mapProps}
            hoveredSlug={null}
            className="h-full w-full"
          />
          {showValidatingOverlay && (
            <MapLoadingOverlay variant="updating" />
          )}
          {renderMapTopBar("map-mobile")}
          {previewCardOverlay}
        </div>

        <PropertyResultsSheet
          properties={properties}
          total={displayTotal}
          selectedSlug={listHighlightSlug}
          onSelect={handleSelect}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          isValidating={showValidatingOverlay}
          mapTypeCounts={mapTypeCounts}
        />
      </div>
    </>
  );
};

export default PropertiesMapBrowse;
