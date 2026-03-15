import { PropertyListItem } from "@/services/property.service";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (property: PropertyListItem): string => {
  if (property.priceLabel) return property.priceLabel;
  if (!property.price) return "Price on request";
  if (property.status === "FOR_RENT")
    return `₱${property.price.toLocaleString()}/mo`;
  return `₱${property.price.toLocaleString()}`;
};

export const getPrimaryImage = (
  images: PropertyListItem["images"],
): string | null => {
  const primary = images.find((img) => img.isPrimary);
  return primary?.url ?? images[0]?.url ?? null;
};

export const estimateReadTime = (excerpt: string): string => {
  const words = excerpt.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

export const formatDate = (date: Date | null): string => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const createQueryString = (
  params: Record<string, string | undefined>,
  currentSearchParams?: URLSearchParams,
): string => {
  const newSearchParams = new URLSearchParams(
    currentSearchParams?.toString() ?? "",
  );

  for (const [key, value] of Object.entries(params)) {
    if (value === null) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, String(value));
    }
  }

  return newSearchParams.toString();
};

export const formatEnumLabel = (value: string): string => {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const getPropertyLabel = (property: PropertyListItem): string => {
  const parts: string[] = [];
  if (property.bedrooms === 0) parts.push("Studio");
  else if (property.bedrooms) parts.push(`${property.bedrooms}BR`);
  const typeLabel: Record<string, string> = {
    CONDO: "Condo",
    HOUSE_AND_LOT: "House & Lot",
    LOT_ONLY: "Lot",
    TOWNHOUSE: "Townhouse",
    COMMERCIAL: "Commercial",
    BEACH_VACATION: "Beach Property",
  };
  if (property.type) parts.push(typeLabel[property.type] ?? "");
  if (property.barangay) parts.push(property.barangay);
  else if (property.city) parts.push(property.city);
  return parts.filter(Boolean).join(" · ");
};
