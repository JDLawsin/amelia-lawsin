"use server";

import { getPropertiesBySlugs } from "@/services/property.service";
import { PropertyListItem } from "@/services/property.service";

export async function getFavoritesBySlugs(
  slugs: string[],
): Promise<PropertyListItem[]> {
  return getPropertiesBySlugs(slugs);
}
