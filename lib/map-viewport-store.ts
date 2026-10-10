import {
  clampToCebuMapBounds,
  CEBU_MAP_MAX_ZOOM,
  CEBU_MAP_MIN_ZOOM,
  isWithinCebuMapBounds,
} from "@/lib/cebu-map-bounds";

const STORAGE_KEY = "amelia-map-viewport";

export type MapViewportState = {
  center: [number, number];
  zoom: number;
  filterSignature: string;
};

export const getMapViewport = (
  filterSignature: string,
): MapViewportState | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MapViewportState;
    if (
      parsed.filterSignature !== filterSignature ||
      !Array.isArray(parsed.center) ||
      parsed.center.length !== 2 ||
      typeof parsed.zoom !== "number"
    ) {
      return null;
    }
    const [lat, lng] = parsed.center;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    if (!isWithinCebuMapBounds(lat, lng)) return null;
    if (
      parsed.zoom < CEBU_MAP_MIN_ZOOM ||
      parsed.zoom > CEBU_MAP_MAX_ZOOM
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const saveMapViewport = (state: MapViewportState): void => {
  if (typeof window === "undefined") return;

  const [lat, lng] = clampToCebuMapBounds(state.center[0], state.center[1]);
  const zoom = Math.min(
    CEBU_MAP_MAX_ZOOM,
    Math.max(CEBU_MAP_MIN_ZOOM, state.zoom),
  );

  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        center: [lat, lng],
        zoom,
      }),
    );
  } catch {
    // Ignore storage errors.
  }
};

export const clearMapViewport = (): void => {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
};
