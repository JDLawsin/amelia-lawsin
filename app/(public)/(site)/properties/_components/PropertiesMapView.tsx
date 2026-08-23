"use client";

import dynamic from "next/dynamic";
import { PropertyListItem } from "@/services/property.service";
import type { MapBbox } from "./PropertiesMapInner";

const MapLoadingSkeleton = () => (
  <div
    className="h-full w-full bg-cloud relative"
    role="status"
    aria-live="polite"
    aria-label="Loading map…"
  >
    <div
      className="absolute inset-0 opacity-40 animate-pulse motion-reduce:animate-none"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--color-wire) 1px, transparent 1px), linear-gradient(to bottom, var(--color-wire) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <p className="text-xs text-ash bg-white/90 px-3 py-1.5 rounded-full border border-wire shadow-apple-sm">
        Loading map…
      </p>
    </div>
  </div>
);

const PropertiesMapInner = dynamic(() => import("./PropertiesMapInner"), {
  ssr: false,
  loading: () => <MapLoadingSkeleton />,
});

type PropertiesMapViewProps = {
  properties: PropertyListItem[];
  selectedSlug: string | null;
  hoveredSlug?: string | null;
  onSelect: (slug: string) => void;
  className?: string;
  filterSignature: string;
  onBoundsChange?: (bbox: MapBbox) => void;
  boundsSearchEnabled?: boolean;
  fitBoundsKey?: string;
  viewedSlugs?: Set<string>;
  favoriteSlugs?: Set<string>;
};

const PropertiesMapView = ({
  properties,
  selectedSlug,
  hoveredSlug,
  onSelect,
  className = "h-full min-h-[280px]",
  filterSignature,
  onBoundsChange,
  boundsSearchEnabled,
  fitBoundsKey,
  viewedSlugs,
  favoriteSlugs,
}: PropertiesMapViewProps) => {
  return (
    <PropertiesMapInner
      properties={properties}
      selectedSlug={selectedSlug}
      hoveredSlug={hoveredSlug}
      onSelect={onSelect}
      className={className}
      filterSignature={filterSignature}
      onBoundsChange={onBoundsChange}
      boundsSearchEnabled={boundsSearchEnabled}
      fitBoundsKey={fitBoundsKey}
      viewedSlugs={viewedSlugs}
      favoriteSlugs={favoriteSlugs}
    />
  );
};

export default PropertiesMapView;
