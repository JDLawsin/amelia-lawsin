import {
  Building2,
  Home,
  Building,
  LandPlot,
  Store,
  Palmtree,
  type LucideIcon,
} from "lucide-react";
import { PropertyType } from "@/app/generated/prisma/enums";

export const PROPERTY_TYPE_ICONS: Record<PropertyType, LucideIcon> = {
  [PropertyType.CONDO]: Building2,
  [PropertyType.HOUSE_AND_LOT]: Home,
  [PropertyType.TOWNHOUSE]: Building,
  [PropertyType.LOT_ONLY]: LandPlot,
  [PropertyType.COMMERCIAL]: Store,
  [PropertyType.BEACH_VACATION]: Palmtree,
};

export const getPropertyTypeIcon = (
  type: string | null | undefined,
): LucideIcon => {
  if (type && type in PROPERTY_TYPE_ICONS) {
    return PROPERTY_TYPE_ICONS[type as PropertyType];
  }
  return Home;
};
