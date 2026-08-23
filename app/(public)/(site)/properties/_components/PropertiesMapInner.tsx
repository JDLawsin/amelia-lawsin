"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { PropertyListItem } from "@/services/property.service";
import {
  createPropertyMarkerIcon,
  getMapMarkerTier,
} from "@/lib/map-markers";
import {
  getMapViewport,
  saveMapViewport,
} from "@/lib/map-viewport-store";
import {
  CEBU_MAP_CENTER,
  CEBU_MAP_DEFAULT_ZOOM,
  CEBU_MAP_MAX_BOUNDS,
  CEBU_MAP_MAX_BOUNDS_VISCOSITY,
  CEBU_MAP_MAX_ZOOM,
  CEBU_MAP_MIN_ZOOM,
  clampToCebuMapBounds,
} from "@/lib/cebu-map-bounds";

export type MapBbox = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const clampZoom = (zoom: number) =>
  Math.min(CEBU_MAP_MAX_ZOOM, Math.max(CEBU_MAP_MIN_ZOOM, zoom));

const MapCebuBoundsLock = () => {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(CEBU_MAP_MAX_BOUNDS);
    map.setMaxBounds(bounds);
    map.options.maxBoundsViscosity = CEBU_MAP_MAX_BOUNDS_VISCOSITY;
    map.setMinZoom(CEBU_MAP_MIN_ZOOM);
    map.setMaxZoom(CEBU_MAP_MAX_ZOOM);
  }, [map]);

  return null;
};

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
  viewedSlugs?: Set<string>;
  favoriteSlugs?: Set<string>;
};

const useSuppressBoundsRef = () => useRef(false);

const MapZoomWatcher = ({
  onZoomChange,
}: {
  onZoomChange: (zoom: number) => void;
}) => {
  const map = useMap();

  useMapEvents({
    zoomend: () => onZoomChange(map.getZoom()),
  });

  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);

  return null;
};

const MapViewportSaver = ({
  filterSignature,
  suppressBoundsRef,
}: {
  filterSignature: string;
  suppressBoundsRef: ReturnType<typeof useSuppressBoundsRef>;
}) => {
  const map = useMap();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    const onMoveEnd = () => {
      if (suppressBoundsRef.current) return;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        const center = map.getCenter();
        const [lat, lng] = clampToCebuMapBounds(center.lat, center.lng);
        saveMapViewport({
          center: [lat, lng],
          zoom: clampZoom(map.getZoom()),
          filterSignature,
        });
      }, 300);
    };

    map.on("moveend", onMoveEnd);
    return () => {
      map.off("moveend", onMoveEnd);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [map, filterSignature, suppressBoundsRef]);

  return null;
};

const FitBounds = ({
  properties,
  fitBoundsKey,
  filterSignature,
  suppressBoundsRef,
}: {
  properties: PropertyListItem[];
  fitBoundsKey: string;
  filterSignature: string;
  suppressBoundsRef: ReturnType<typeof useSuppressBoundsRef>;
}) => {
  const map = useMap();
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    if (lastKey.current === fitBoundsKey) return;
    lastKey.current = fitBoundsKey;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    suppressBoundsRef.current = true;

    const saved = getMapViewport(filterSignature);
    if (saved) {
      const [lat, lng] = clampToCebuMapBounds(
        saved.center[0],
        saved.center[1],
      );
      map.setView([lat, lng], clampZoom(saved.zoom), {
        animate: !prefersReducedMotion,
      });
      return;
    }

    const coords = properties
      .filter((p) => p.latitude != null && p.longitude != null)
      .map(
        (p) =>
          [Number(p.latitude), Number(p.longitude)] as [number, number],
      );

    if (coords.length === 0) {
      map.setView(CEBU_MAP_CENTER, CEBU_MAP_DEFAULT_ZOOM, {
        animate: !prefersReducedMotion,
      });
      return;
    }

    if (coords.length === 1) {
      map.setView(coords[0], clampZoom(14), {
        animate: !prefersReducedMotion,
      });
      return;
    }

    map.fitBounds(L.latLngBounds(coords), {
      padding: [48, 48],
      maxZoom: 14,
      animate: !prefersReducedMotion,
    });
  }, [map, properties, fitBoundsKey, filterSignature, suppressBoundsRef]);

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
    const zoom = clampZoom(Math.max(map.getZoom(), 14));

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
  mapZoom,
  viewedSlugs,
  favoriteSlugs,
}: {
  properties: PropertyListItem[];
  selectedSlug: string | null;
  hoveredSlug?: string | null;
  onSelect: (slug: string) => void;
  mapZoom: number;
  viewedSlugs: Set<string>;
  favoriteSlugs: Set<string>;
}) => {
  const map = useMap();
  const tier = getMapMarkerTier(mapZoom);

  useEffect(() => {
    const cluster = L.markerClusterGroup({
      chunkedLoading: true,
    });

    cluster.on("clusterclick", (event: L.LeafletEvent) => {
      const clusterLayer = event.layer as L.Layer & {
        getBounds: () => L.LatLngBounds;
      };
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      map.fitBounds(clusterLayer.getBounds(), {
        padding: [48, 48],
        maxZoom: Math.min(16, CEBU_MAP_MAX_ZOOM),
        animate: !prefersReducedMotion,
      });
    });

    properties.forEach((property) => {
      if (property.latitude == null || property.longitude == null) return;

      const lat = Number(property.latitude);
      const lng = Number(property.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const isSelected = selectedSlug === property.slug;
      const isHovered = hoveredSlug === property.slug && !isSelected;

      const marker = L.marker([lat, lng], {
        icon: createPropertyMarkerIcon(property, {
          state: isSelected ? "selected" : isHovered ? "hover" : "default",
          tier,
          isViewed: viewedSlugs.has(property.slug),
          isFavorite: favoriteSlugs.has(property.slug),
        }),
        zIndexOffset: isSelected ? 1000 : isHovered ? 500 : 0,
      });
      marker.on("click", () => onSelect(property.slug));
      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
    return () => {
      map.removeLayer(cluster);
    };
  }, [
    map,
    properties,
    selectedSlug,
    hoveredSlug,
    onSelect,
    tier,
    viewedSlugs,
    favoriteSlugs,
  ]);

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
  viewedSlugs = new Set(),
  favoriteSlugs = new Set(),
}: PropertiesMapInnerProps) => {
  const suppressBoundsRef = useSuppressBoundsRef();
  const [mapZoom, setMapZoom] = useState(11);

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
    <div className={`properties-map ${className ?? ""}`}>
      <MapContainer
        center={CEBU_MAP_CENTER}
        zoom={CEBU_MAP_DEFAULT_ZOOM}
        minZoom={CEBU_MAP_MIN_ZOOM}
        maxZoom={CEBU_MAP_MAX_ZOOM}
        maxBounds={CEBU_MAP_MAX_BOUNDS}
        maxBoundsViscosity={CEBU_MAP_MAX_BOUNDS_VISCOSITY}
        className="h-full w-full min-h-80 z-0"
        style={{ minHeight: "320px", height: "100%" }}
        scrollWheelZoom
        zoomControl={false}
      >
        <MapCebuBoundsLock />
        <TileLayer
          attribution={CARTO_ATTRIBUTION}
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <ZoomControl position="bottomright" />
        <MapZoomWatcher onZoomChange={setMapZoom} />
        <MapViewportSaver
          filterSignature={filterSignature}
          suppressBoundsRef={suppressBoundsRef}
        />
        <FitBounds
          properties={mapProperties}
          fitBoundsKey={boundsKey}
          filterSignature={filterSignature}
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
          mapZoom={mapZoom}
          viewedSlugs={viewedSlugs}
          favoriteSlugs={favoriteSlugs}
        />
      </MapContainer>
    </div>
  );
};

export default PropertiesMapInner;
