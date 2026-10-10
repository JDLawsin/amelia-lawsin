import type { PropertyFilters } from "@/services/property.service";
import { parsePropertyFilters } from "@/lib/property-filters";

export type PropertyBrowseView = "grid" | "list" | "photos" | "map";

export const normalizeBrowseView = (
  raw: string | null,
  isMobile: boolean,
): PropertyBrowseView => {
  if (raw === "map") return "map";
  if (raw === "list") return "list";
  if (raw === "photos") return "photos";
  if (raw === "grid") return isMobile ? "photos" : "grid";
  return isMobile ? "list" : "grid";
};

export const parsePropertyFiltersFromProps = (
  params: Record<string, string | number | undefined>,
  defaults?: { pageSize?: number },
): PropertyFilters => {
  return parsePropertyFilters(
    {
      get: (name) => {
        const value = params[name];
        if (value === undefined || value === "") return null;
        return String(value);
      },
    },
    defaults,
  );
};
