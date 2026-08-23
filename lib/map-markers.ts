import L from "leaflet";
import { PropertyListItem } from "@/services/property.service";

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

export const createPriceMarkerIcon = (
  label: string,
  state: "default" | "hover" | "selected",
): L.DivIcon => {
  const selected = state === "selected";
  const hovered = state === "hover";
  const safeLabel = label.replace(/[<>&"']/g, (char) => {
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

  return L.divIcon({
    className: "property-map-price-marker",
    html: `<div class="property-map-price-marker__chip${selected ? " is-selected" : ""}${hovered ? " is-hovered" : ""}" role="img" aria-label="${safeLabel}"><span class="property-map-price-marker__label">${safeLabel}</span></div>`,
    iconSize: [1, 1],
    iconAnchor: [0, 0],
  });
};
