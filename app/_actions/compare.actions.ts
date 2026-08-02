"use server";

import {
  getComparePropertiesBySlugs,
  ComparePropertyItem,
} from "@/services/property.service";

export async function getCompareDataBySlugs(
  slugs: string[],
): Promise<ComparePropertyItem[]> {
  return getComparePropertiesBySlugs(slugs);
}
