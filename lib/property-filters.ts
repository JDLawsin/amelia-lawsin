import {
  PropertyStatus,
  PropertyType,
} from "@/app/generated/prisma/client";
import type { PropertyFilters } from "@/services/property.service";

export const DEFAULT_PROPERTIES_PAGE_SIZE = 9;

type SearchParamSource = {
  get(name: string): string | null;
};

export const parsePropertyFilters = (
  params: SearchParamSource,
  defaults?: { pageSize?: number },
): PropertyFilters => {
  const pageSize = defaults?.pageSize ?? DEFAULT_PROPERTIES_PAGE_SIZE;
  const page = Math.max(1, Number(params.get("page") ?? "1"));

  const bedroomsParam = params.get("bedrooms");
  const minPriceParam = params.get("minPrice");
  const maxPriceParam = params.get("maxPrice");
  const minLatParam = params.get("minLat");
  const maxLatParam = params.get("maxLat");
  const minLngParam = params.get("minLng");
  const maxLngParam = params.get("maxLng");

  const status = params.get("status");
  const type = params.get("type");

  const bbox =
    minLatParam &&
    maxLatParam &&
    minLngParam &&
    maxLngParam
      ? {
          minLat: Number(minLatParam),
          maxLat: Number(maxLatParam),
          minLng: Number(minLngParam),
          maxLng: Number(maxLngParam),
        }
      : undefined;

  return {
    q: params.get("q") ?? undefined,
    status: status ? (status as PropertyStatus) : undefined,
    type: type ? (type as PropertyType) : undefined,
    city: params.get("city") ?? undefined,
    minPrice: minPriceParam ? Number(minPriceParam) : undefined,
    maxPrice: maxPriceParam ? Number(maxPriceParam) : undefined,
    bedrooms:
      bedroomsParam !== null && bedroomsParam !== ""
        ? Number(bedroomsParam)
        : undefined,
    special: params.get("special") ?? undefined,
    sort: params.get("sort") ?? "newest",
    page,
    pageSize,
    bbox,
  };
};

/** Filter fields for infinite scroll — page comes from the page index, not the URL. */
export const parsePropertyListFilters = (
  params: SearchParamSource,
  defaults?: { pageSize?: number },
): Omit<PropertyFilters, "page"> => {
  const { page: _page, ...filters } = parsePropertyFilters(params, defaults);
  return filters;
};

export const buildPropertyListFilterSignature = (
  params: SearchParamSource,
): string => {
  const filters = parsePropertyListFilters(params);
  return buildPropertiesApiQuery({ ...filters, page: 1, pageSize: 1 });
};

export const buildPropertiesApiQuery = (
  filters: PropertyFilters,
): string => {
  const search = new URLSearchParams();

  if (filters.q) search.set("q", filters.q);
  if (filters.status) search.set("status", filters.status);
  if (filters.type) search.set("type", filters.type);
  if (filters.city) search.set("city", filters.city);
  if (filters.minPrice != null) search.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null) search.set("maxPrice", String(filters.maxPrice));
  if (filters.bedrooms != null) search.set("bedrooms", String(filters.bedrooms));
  if (filters.special) search.set("special", filters.special);
  if (filters.sort) search.set("sort", filters.sort);
  if (filters.page) search.set("page", String(filters.page));
  if (filters.pageSize) search.set("pageSize", String(filters.pageSize));
  if (filters.bbox) {
    search.set("minLat", String(filters.bbox.minLat));
    search.set("maxLat", String(filters.bbox.maxLat));
    search.set("minLng", String(filters.bbox.minLng));
    search.set("maxLng", String(filters.bbox.maxLng));
  }

  return search.toString();
};
