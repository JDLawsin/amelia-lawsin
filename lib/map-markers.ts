import L from "leaflet";
import { PropertyListItem } from "@/services/property.service";
import { getPropertyTypeMapMeta } from "@/lib/property-type-map";

export type MapMarkerTier = "mini" | "full";
export type MapMarkerState = "default" | "hover" | "selected";

export const MAP_MARKER_FULL_ZOOM = 12;

export const formatMapPriceLabel = (property: PropertyListItem): string => {
  if (property.priceLabel) {
    const compact = property.priceLabel.replace(/\s+/g, " ").trim();
    return compact.length > 12 ? `${compact.slice(0, 11)}…` : compact;
  }

  if (!property.price) return "Ask";

  const price = property.price;
  const prefix = "₱";

  if (property.status === "FOR_RENT") {
    if (price >= 1_000_000) {
      const m = price / 1_000_000;
      return `${prefix}${m >= 10 ? Math.round(m) : m.toFixed(1).replace(/\.0$/, "")}M/mo`;
    }
    if (price >= 10_000) {
      return `${prefix}${Math.round(price / 1_000)}K/mo`;
    }
    return `${prefix}${price.toLocaleString()}/mo`;
  }

  if (price >= 1_000_000) {
    const m = price / 1_000_000;
    return `${prefix}${m >= 10 ? Math.round(m) : m.toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (price >= 10_000) {
    return `${prefix}${Math.round(price / 1_000)}K`;
  }
  return `${prefix}${price.toLocaleString()}`;
};

const escapeHtml = (value: string): string =>
  value.replace(/[<>&"']/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });

export const formatMapMarkerAriaLabel = (property: PropertyListItem): string => {
  const typeMeta = getPropertyTypeMapMeta(property.type);
  const priceLabel = formatMapPriceLabel(property);
  return `${typeMeta.label}, ${priceLabel}`;
};

export const getMapMarkerTier = (zoom: number): MapMarkerTier =>
  zoom < MAP_MARKER_FULL_ZOOM ? "mini" : "full";

type CreatePropertyMarkerIconOptions = {
  state: MapMarkerState;
  tier: MapMarkerTier;
  isViewed?: boolean;
  isFavorite?: boolean;
};

export const createPropertyMarkerIcon = (
  property: PropertyListItem,
  options: CreatePropertyMarkerIconOptions,
): L.DivIcon => {
  const { state, tier, isViewed = false, isFavorite = false } = options;
  const selected = state === "selected";
  const hovered = state === "hover";
  const priceLabel = formatMapPriceLabel(property);
  const typeMeta = getPropertyTypeMapMeta(property.type);
  const ariaLabel = escapeHtml(formatMapMarkerAriaLabel(property));
  const safePriceLabel = escapeHtml(priceLabel);

  const stateClasses = [
    selected ? "is-selected" : "",
    hovered ? "is-hovered" : "",
    tier === "mini" ? "is-mini" : "",
    isViewed ? "is-viewed" : "",
    isFavorite ? "is-favorite" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const iconBlock =
    tier === "full"
      ? `<span class="property-map-price-marker__icon-wrap" style="background-color: ${selected ? "rgba(255,255,255,0.2)" : typeMeta.accent}">${typeMeta.iconSvg}</span>`
      : "";

  return L.divIcon({
    className: "property-map-price-marker",
    html: `<div class="property-map-price-marker__chip ${stateClasses}" style="--type-accent: ${typeMeta.accent}" role="img" aria-label="${ariaLabel}">${iconBlock}<span class="property-map-price-marker__label">${safePriceLabel}</span></div>`,
    iconSize: [1, 1],
    iconAnchor: [0, 0],
  });
};
