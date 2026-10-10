import { PropertyType } from "@/app/generated/prisma/enums";
import { TYPE_LABELS } from "@/constants";

export type PropertyTypeMapMeta = {
  label: string;
  accent: string;
  iconSvg: string;
};

const svgIcon = (paths: string) =>
  `<svg class="property-map-price-marker__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

/** Display order for map legend and consistent iteration */
export const PROPERTY_TYPE_MAP_ORDER: PropertyType[] = [
  PropertyType.CONDO,
  PropertyType.HOUSE_AND_LOT,
  PropertyType.TOWNHOUSE,
  PropertyType.LOT_ONLY,
  PropertyType.COMMERCIAL,
  PropertyType.BEACH_VACATION,
];

export const PROPERTY_TYPE_MAP_META: Record<PropertyType, PropertyTypeMapMeta> = {
  [PropertyType.CONDO]: {
    label: TYPE_LABELS.CONDO,
    accent: "#0071e3",
    iconSvg: svgIcon(
      "<path d=\"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z\"/><path d=\"M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2\"/><path d=\"M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2\"/><path d=\"M10 6h4\"/><path d=\"M10 10h4\"/><path d=\"M10 14h4\"/><path d=\"M10 18h4\"/>",
    ),
  },
  [PropertyType.HOUSE_AND_LOT]: {
    label: TYPE_LABELS.HOUSE_AND_LOT,
    accent: "#34c759",
    iconSvg: svgIcon(
      "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"/><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/>",
    ),
  },
  [PropertyType.TOWNHOUSE]: {
    label: TYPE_LABELS.TOWNHOUSE,
    accent: "#af52de",
    iconSvg: svgIcon(
      "<rect width=\"16\" height=\"20\" x=\"4\" y=\"2\" rx=\"2\" ry=\"2\"/><path d=\"M9 22v-4h6v4\"/><path d=\"M8 6h.01\"/><path d=\"M16 6h.01\"/><path d=\"M12 6h.01\"/><path d=\"M12 10h.01\"/><path d=\"M12 14h.01\"/><path d=\"M16 10h.01\"/><path d=\"M16 14h.01\"/><path d=\"M8 10h.01\"/><path d=\"M8 14h.01\"/>",
    ),
  },
  [PropertyType.LOT_ONLY]: {
    label: TYPE_LABELS.LOT_ONLY,
    accent: "#ff9500",
    iconSvg: svgIcon(
      "<path d=\"m12 8 6-3-6-3v10\"/><path d=\"m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12\"/><path d=\"m6.49 12.85 11.02 6.3\"/><path d=\"M17.51 12.85 6.5 19.15\"/>",
    ),
  },
  [PropertyType.COMMERCIAL]: {
    label: TYPE_LABELS.COMMERCIAL,
    accent: "#5856d6",
    iconSvg: svgIcon(
      "<path d=\"M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z\"/><path d=\"M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4\"/><path d=\"M13 13h4\"/><path d=\"M13 17h4\"/><path d=\"M9 13h.01\"/><path d=\"M9 17h.01\"/>",
    ),
  },
  [PropertyType.BEACH_VACATION]: {
    label: TYPE_LABELS.BEACH_VACATION,
    accent: "#32ade6",
    iconSvg: svgIcon(
      "<path d=\"M17 14c.7-1 1.37-1 2-1 1.5 0 2 1 2 2s-.5 2-2 2c-.63 0-1.3 0-2-1\"/><path d=\"M12 2v2\"/><path d=\"M6.2 6.2 5 5\"/><path d=\"M2 12h2\"/><path d=\"M20 12h2\"/><path d=\"M17.8 6.2 19 5\"/><path d=\"M15.536 8.464a5 5 0 0 0-7.072 0l-5 5a5 5 0 1 0 7.072 7.072l5-5a5 5 0 0 0 0-7.072Z\"/>",
    ),
  },
};

const DEFAULT_META: PropertyTypeMapMeta = {
  label: "Property",
  accent: "#1d1d1f",
  iconSvg: svgIcon(
    "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"/><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/>",
  ),
};

export const getPropertyTypeMapMeta = (type: string | null | undefined): PropertyTypeMapMeta => {
  if (type && type in PROPERTY_TYPE_MAP_META) {
    return PROPERTY_TYPE_MAP_META[type as PropertyType];
  }
  return DEFAULT_META;
};

export const countMapPropertyTypes = (
  properties: ReadonlyArray<{ type: string | null }>,
): Record<PropertyType, number> => {
  const counts = Object.fromEntries(
    PROPERTY_TYPE_MAP_ORDER.map((type) => [type, 0]),
  ) as Record<PropertyType, number>;

  for (const property of properties) {
    const type = property.type;
    if (type && type in counts) {
      counts[type as PropertyType] += 1;
    }
  }

  return counts;
};
