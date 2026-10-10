/** Geographic constraints for Cebu-focused property maps */

export const CEBU_MAP_CENTER: [number, number] = [10.3157, 123.8854];

/**
 * SW / NE corners — Cebu Province (north tip through southern coast).
 * Includes Metro Cebu, Carcar/Oslob south, and Danao/Bogo/north coast with margin.
 */
export const CEBU_MAP_MAX_BOUNDS: [[number, number], [number, number]] = [
  [9.42, 123.32],
  [11.42, 124.52],
];

/** Zoom 9 shows most of Cebu Island; still prevents panning to other regions */
export const CEBU_MAP_MIN_ZOOM = 9;
export const CEBU_MAP_DEFAULT_ZOOM = 11;
export const CEBU_MAP_MAX_ZOOM = 18;
export const CEBU_MAP_MAX_BOUNDS_VISCOSITY = 0.85;

export const isWithinCebuMapBounds = (lat: number, lng: number): boolean => {
  const [[south, west], [north, east]] = CEBU_MAP_MAX_BOUNDS;
  return lat >= south && lat <= north && lng >= west && lng <= east;
};

export const clampToCebuMapBounds = (
  lat: number,
  lng: number,
): [number, number] => {
  const [[south, west], [north, east]] = CEBU_MAP_MAX_BOUNDS;
  return [
    Math.min(north, Math.max(south, lat)),
    Math.min(east, Math.max(west, lng)),
  ];
};
