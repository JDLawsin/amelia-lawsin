import {
  Building2,
  Home,
  Building,
  LandPlot,
  Store,
  Palmtree,
  type LucideIcon,
  type LucideProps,
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

export const PropertyTypeIcon = ({
  type,
  ...props
}: LucideProps & { type: string | null | undefined }) => {
  switch (type) {
    case PropertyType.CONDO:
      return <Building2 {...props} />;
    case PropertyType.HOUSE_AND_LOT:
      return <Home {...props} />;
    case PropertyType.TOWNHOUSE:
      return <Building {...props} />;
    case PropertyType.LOT_ONLY:
      return <LandPlot {...props} />;
    case PropertyType.COMMERCIAL:
      return <Store {...props} />;
    case PropertyType.BEACH_VACATION:
      return <Palmtree {...props} />;
    default:
      return <Home {...props} />;
  }
};
