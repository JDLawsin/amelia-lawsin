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
