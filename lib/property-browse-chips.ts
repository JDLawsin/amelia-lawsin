import {
  PropertyStatus,
  PropertyType,
} from "@/app/generated/prisma/enums";
import { BEDROOM_OPTIONS } from "@/constants";
import { formatEnumLabel } from "@/lib/utils";

export type QuickBrowseChip = {
  param: "status" | "type";
  value: string;
  label: string;
  gold?: boolean;
};

export const QUICK_BROWSE_CHIPS: QuickBrowseChip[] = [
  { param: "status", value: PropertyStatus.FOR_SALE, label: "For Sale" },
  { param: "status", value: PropertyStatus.FOR_RENT, label: "For Rent" },
  {
    param: "status",
    value: PropertyStatus.PRE_SELLING,
    label: "Pre-selling",
  },
  { param: "type", value: PropertyType.CONDO, label: "Condo" },
  {
    param: "type",
    value: PropertyType.HOUSE_AND_LOT,
    label: "House & Lot",
  },
];

export const SPECIAL_FILTER_CHIPS = [
  { value: "pagibig", label: "Pag-IBIG" },
  { value: "renttoown", label: "Rent-to-Own" },
  { value: "inhouse", label: "In-house Financing" },
] as const;

export const SPECIAL_FILTER_LABELS: Record<string, string> = {
  pagibig: "Pag-IBIG",
  renttoown: "Rent-to-Own",
  inhouse: "In-house financing",
  bank: "Bank financing",
};

export type AppliedFilter = {
  id: string;
  label: string;
  removeKeys: string[];
};

type SearchParamSource = {
  get(name: string): string | null;
};

const formatPriceLabel = (minPrice: string | null, maxPrice: string | null) => {
  if (minPrice && maxPrice) {
    return `₱${Number(minPrice).toLocaleString()} – ₱${Number(maxPrice).toLocaleString()}`;
  }
  if (minPrice) {
    return `From ₱${Number(minPrice).toLocaleString()}`;
  }
  if (maxPrice) {
    return `Up to ₱${Number(maxPrice).toLocaleString()}`;
  }
  return null;
};

const formatBedroomLabel = (bedrooms: string) => {
  const option = BEDROOM_OPTIONS.find((opt) => opt.value === bedrooms);
  if (option) return option.label === "Studio" ? "Studio" : `${option.label} bed`;
  if (bedrooms === "0") return "Studio";
  return `${bedrooms} bed`;
};

export const getAppliedFilters = (params: SearchParamSource): AppliedFilter[] => {
  const applied: AppliedFilter[] = [];

  const status = params.get("status");
  if (status) {
    applied.push({
      id: "status",
      label: formatEnumLabel(status),
      removeKeys: ["status", "page"],
    });
  }

  const type = params.get("type");
  if (type) {
    applied.push({
      id: "type",
      label: formatEnumLabel(type),
      removeKeys: ["type", "page"],
    });
  }

  const special = params.get("special");
  if (special) {
    applied.push({
      id: "special",
      label: SPECIAL_FILTER_LABELS[special] ?? special,
      removeKeys: ["special", "page"],
    });
  }

  const city = params.get("city");
  if (city) {
    applied.push({
      id: "city",
      label: city,
      removeKeys: ["city", "page"],
    });
  }

  const bedrooms = params.get("bedrooms");
  if (bedrooms) {
    applied.push({
      id: "bedrooms",
      label: formatBedroomLabel(bedrooms),
      removeKeys: ["bedrooms", "page"],
    });
  }

  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const priceLabel = formatPriceLabel(minPrice, maxPrice);
  if (priceLabel) {
    applied.push({
      id: "price",
      label: priceLabel,
      removeKeys: ["minPrice", "maxPrice", "page"],
    });
  }

  return applied;
};

export type LocalFilterState = {
  status: string;
  type: string;
  bedrooms: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  special: string;
};

export const emptyLocalFilterState = (): LocalFilterState => ({
  status: "",
  type: "",
  bedrooms: "",
  city: "",
  minPrice: "",
  maxPrice: "",
  special: "",
});

export const localFilterStateFromSearchParams = (
  params: SearchParamSource,
): LocalFilterState => ({
  status: params.get("status") ?? "",
  type: params.get("type") ?? "",
  bedrooms: params.get("bedrooms") ?? "",
  city: params.get("city") ?? "",
  minPrice: params.get("minPrice") ?? "",
  maxPrice: params.get("maxPrice") ?? "",
  special: params.get("special") ?? "",
});
