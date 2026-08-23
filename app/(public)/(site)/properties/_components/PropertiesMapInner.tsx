"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { PropertyListItem } from "@/services/property.service";
import {
  createPriceMarkerIcon,
  formatMapPriceLabel,
} from "@/lib/map-markers";

export type MapBbox = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

const CEBU_CENTER: [number, number] = [10.3157, 123.8854];

type PropertiesMapInnerProps = {
  properties: PropertyListItem[];
  selectedSlug: string | null;
  hoveredSlug?: string | null;
  onSelect: (slug: string) => void;
  className?: string;
  filterSignature: string;
  onBoundsChange?: (bbox: MapBbox) => void;
  boundsSearchEnabled?: boolean;
  fitBoundsKey?: string;
};

const useSuppressBoundsRef = () => useRef(false);

const FitBounds = ({
  properties,
  fitBoundsKey,
  suppressBoundsRef,
}: {
  properties: PropertyListItem[];
  fitBoundsKey: string;
  suppressBoundsRef: ReturnType<typeof useSuppressBoundsRef>;
}) => {
  const map = useMap();
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    if (lastKey.current === fitBoundsKey) return;
    lastKey.current = fitBoundsKey;

    const coords = properties
      .filter((p) => p.latitude != null && p.longitude != null)
      .map(
        (p) =>
          [Number(p.latitude), Number(p.longitude)] as [number, number],
      );

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    suppressBoundsRef.current = true;

    if (coords.length === 0) {
      map.setView(CEBU_CENTER, 11, { animate: !prefersReducedMotion });
      return;
    }

    if (coords.length === 1) {
      map.setView(coords[0], 14, { animate: !prefersReducedMotion });
      return;
    }

    map.fitBounds(L.latLngBounds(coords), {
      padding: [48, 48],
      maxZoom: 14,
      animate: !prefersReducedMotion,
    });
  }, [map, properties, fitBoundsKey, suppressBoundsRef]);

  return null;
};

const FlyToSelected = ({
  properties,
  selectedSlug,
  suppressBoundsRef,
}: {
  properties: PropertyListItem[];
  selectedSlug: string | null;
  suppressBoundsRef: ReturnType<typeof useSuppressBoundsRef>;
}) => {
  const map = useMap();
  const lastSlug = useRef<string | null>(null);
  const skippedInitial = useRef(false);

  useEffect(() => {
    if (!selectedSlug) return;

    if (!skippedInitial.current) {
      skippedInitial.current = true;
      lastSlug.current = selectedSlug;
      return;
    }

    if (selectedSlug === lastSlug.current) return;
    lastSlug.current = selectedSlug;

    const property = properties.find((p) => p.slug === selectedSlug);
    if (property?.latitude == null || property.longitude == null) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const zoom = Math.max(map.getZoom(), 14);

    suppressBoundsRef.current = true;
    map.flyTo(
      [Number(property.latitude), Number(property.longitude)],
      zoom,
      prefersReducedMotion ? { duration: 0 } : { duration: 0.5 },
    );
  }, [map, properties, selectedSlug, suppressBoundsRef]);

  return null;
};

const MapBoundsWatcher = ({
  onBoundsChange,
  suppressBoundsRef,
}: {
  onBoundsChange: (bbox: MapBbox) => void;
  suppressBoundsRef: ReturnType<typeof useSuppressBoundsRef>;
}) => {
  const map = useMap();
  const userInteracted = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const lastBbox = useRef<MapBbox | null>(null);

  useMapEvents({
    dragstart: () => {
      userInteracted.current = true;
    },
    zoomstart: () => {
      if (!suppressBoundsRef.current) {
        userInteracted.current = true;
      }
    },
  });

  useEffect(() => {
    const onMoveEnd = () => {
      if (suppressBoundsRef.current) {
        suppressBoundsRef.current = false;
        return;
      }

      if (!userInteracted.current) return;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        const bounds = map.getBounds();
        const bbox: MapBbox = {
          minLat: bounds.getSouth(),
          maxLat: bounds.getNorth(),
          minLng: bounds.getWest(),
          maxLng: bounds.getEast(),
        };

        const prev = lastBbox.current;
        if (
          prev &&
          Math.abs(prev.minLat - bbox.minLat) < 0.0001 &&
          Math.abs(prev.maxLat - bbox.maxLat) < 0.0001 &&
          Math.abs(prev.minLng - bbox.minLng) < 0.0001 &&
          Math.abs(prev.maxLng - bbox.maxLng) < 0.0001
        ) {
          return;
        }

        lastBbox.current = bbox;
        onBoundsChange(bbox);
      }, 400);
    };

    map.on("moveend", onMoveEnd);
    return () => {
      map.off("moveend", onMoveEnd);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [map, onBoundsChange, suppressBoundsRef]);

  return null;
};

const ClusterMarkers = ({
  properties,
  selectedSlug,
  hoveredSlug,
  onSelect,
}: {
  properties: PropertyListItem[];
  selectedSlug: string | null;
  hoveredSlug?: string | null;
  onSelect: (slug: string) => void;
}) => {
  const map = useMap();

  useEffect(() => {
    const cluster = L.markerClusterGroup({
      chunkedLoading: true,
    });

    properties.forEach((property) => {
      if (property.latitude == null || property.longitude == null) return;

      const lat = Number(property.latitude);
      const lng = Number(property.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const isSelected = selectedSlug === property.slug;
      const isHovered = hoveredSlug === property.slug && !isSelected;
      const label = formatMapPriceLabel(property);

      const marker = L.marker([lat, lng], {
        icon: createPriceMarkerIcon(
          label,
          isSelected ? "selected" : isHovered ? "hover" : "default",
        ),
        zIndexOffset: isSelected ? 1000 : isHovered ? 500 : 0,
      });
      marker.on("click", () => onSelect(property.slug));
      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
    return () => {
      map.removeLayer(cluster);
    };
  }, [map, properties, selectedSlug, hoveredSlug, onSelect]);

  return null;
};

const PropertiesMapInner = ({
  properties,
  selectedSlug,
  hoveredSlug,
  onSelect,
  className,
  filterSignature,
  onBoundsChange,
  boundsSearchEnabled = true,
  fitBoundsKey,
}: PropertiesMapInnerProps) => {
  const suppressBoundsRef = useSuppressBoundsRef();

  const mapProperties = useMemo(
    () =>
      properties.filter(
        (p) =>
          p.latitude != null &&
          p.longitude != null &&
          Number.isFinite(Number(p.latitude)) &&
          Number.isFinite(Number(p.longitude)),
      ),
    [properties],
  );

  const boundsKey = fitBoundsKey ?? filterSignature;

  return (
    <div className={className}>
      <MapContainer
        center={CEBU_CENTER}
        zoom={11}
        className="h-full w-full min-h-80 z-0"
        style={{ minHeight: "320px", height: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds
          properties={mapProperties}
          fitBoundsKey={boundsKey}
          suppressBoundsRef={suppressBoundsRef}
        />
        <FlyToSelected
          properties={mapProperties}
          selectedSlug={selectedSlug}
          suppressBoundsRef={suppressBoundsRef}
        />
        {boundsSearchEnabled && onBoundsChange && (
          <MapBoundsWatcher
            onBoundsChange={onBoundsChange}
            suppressBoundsRef={suppressBoundsRef}
          />
        )}
        <ClusterMarkers
          properties={mapProperties}
          selectedSlug={selectedSlug}
          hoveredSlug={hoveredSlug}
          onSelect={onSelect}
        />
      </MapContainer>
    </div>
  );
};

export default PropertiesMapInner;
