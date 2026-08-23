"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { PropertyType } from "@/app/generated/prisma/enums";
import { PropertyListItem } from "@/services/property.service";
import PropertyCard from "./PropertyCard";
import PropertyListRow from "./PropertyListRow";
import { ListRowSkeleton } from "./PropertyInfiniteList";
import MapPropertyLegend from "./MapPropertyLegend";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/shadcn/drawer";
import { getMapCoverageDescription } from "@/lib/map-coverage";

type PropertyResultsSheetProps = {
  properties: PropertyListItem[];
  total: number;
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isValidating?: boolean;
  mapTypeCounts?: Record<PropertyType, number>;
};

const SNAP_POINTS = [0.18, 0.5, 0.92] as const;
const PEEK_SNAP = SNAP_POINTS[0];
const CAROUSEL_SNAP = SNAP_POINTS[1];

const PropertyResultsSheet = ({
  properties,
  total,
  selectedSlug,
  onSelect,
  open,
  onOpenChange,
  isValidating = false,
  mapTypeCounts,
}: PropertyResultsSheetProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [snap, setSnap] = useState<number | string | null>(PEEK_SNAP);
  const lastSelectedSlug = useRef<string | null>(null);

  const snapIndex = useMemo(() => {
    const index = SNAP_POINTS.findIndex((point) => point === snap);
    return index >= 0 ? index : 0;
  }, [snap]);

  const mapReadyProperties = properties.filter(
    (p) => p.latitude != null && p.longitude != null,
  );
  const noLocationProperties = properties.filter(
    (p) => p.latitude == null || p.longitude == null,
  );

  const previewProperty =
    properties.find((p) => p.slug === selectedSlug) ??
    properties[0] ??
    null;

  const coverageDescription = getMapCoverageDescription(
    mapReadyProperties.length,
    total,
    "list-mobile",
  );

  useEffect(() => {
    if (!selectedSlug) return;
    if (selectedSlug === lastSelectedSlug.current) return;
    lastSelectedSlug.current = selectedSlug;

    setSnap(CAROUSEL_SNAP);
    onOpenChange(true);
  }, [selectedSlug, onOpenChange]);

  useEffect(() => {
    if (!selectedSlug || snapIndex < 1 || !carouselRef.current) return;
    const card = carouselRef.current.querySelector(
      `[data-property-slug="${selectedSlug}"]`,
    );
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedSlug, snapIndex]);

  useEffect(() => {
    if (!selectedSlug || snapIndex < 2 || !listRef.current) return;
    const row = listRef.current.querySelector(
      `[data-property-slug="${selectedSlug}"]`,
    );
    row?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedSlug, snapIndex]);

  const collapseToPeek = () => {
    setSnap(PEEK_SNAP);
    onOpenChange(true);
  };

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[...SNAP_POINTS]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      fadeFromIndex={1}
      modal={false}
      dismissible={false}
    >
      <DrawerContent className="overscroll-contain motion-reduce:transition-none">
        <DrawerHeader className="text-left px-4 pb-2 flex flex-row items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <DrawerTitle>
              {total} {total === 1 ? "property" : "properties"}
            </DrawerTitle>
            <DrawerDescription className="mt-1">
              {mapReadyProperties.length} on map
              {noLocationProperties.length > 0
                ? ` · ${noLocationProperties.length} without map location`
                : ""}
            </DrawerDescription>
            <p className="text-[10px] text-fog leading-snug mt-1.5">
              {coverageDescription}
            </p>
            {mapTypeCounts && (
              <div className="mt-2">
                <MapPropertyLegend
                  typeCounts={mapTypeCounts}
                  defaultOpen={false}
                />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={collapseToPeek}
            className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg text-ash hover:text-ink hover:bg-cloud transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            aria-label="Collapse sheet"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </DrawerHeader>

        {snapIndex === 0 && previewProperty && (
          <div
            className="px-4 pb-3"
            data-property-slug={previewProperty.slug}
            onClick={() => onSelect(previewProperty.slug)}
          >
            <PropertyCard property={previewProperty} variant="compact" />
          </div>
        )}

        {snapIndex === 1 && (
          <div
            ref={carouselRef}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none px-4 pb-3 touch-manipulation motion-reduce:snap-none"
            aria-label="Property previews"
          >
            {properties.slice(0, 12).map((property) => (
              <div
                key={property.id}
                className="snap-start shrink-0 w-[72vw] max-w-72"
                data-property-slug={property.slug}
                onClick={() => onSelect(property.slug)}
              >
                <PropertyCard property={property} variant="compact" />
              </div>
            ))}
          </div>
        )}

        {snapIndex === 2 && (
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col gap-2 min-h-0"
          >
            {isValidating && (
              <div className="flex flex-col gap-2" aria-hidden="true">
                <ListRowSkeleton />
                <ListRowSkeleton />
                <ListRowSkeleton />
              </div>
            )}
            {properties.map((property) => (
              <div
                key={property.id}
                data-property-slug={property.slug}
                className={
                  selectedSlug === property.slug
                    ? "ring-2 ring-ink ring-offset-2 rounded-xl"
                    : undefined
                }
                onClick={() => onSelect(property.slug)}
              >
                <PropertyListRow property={property} />
                {(property.latitude == null || property.longitude == null) && (
                  <p className="text-[10px] text-ash px-3 pb-2">
                    No map location
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default PropertyResultsSheet;
