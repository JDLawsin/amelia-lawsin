import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const propertyListSelect = {
  id: true,
  title: true,
  slug: true,
  type: true,
  status: true,
  listingType: true,
  price: true,
  priceLabel: true,
  city: true,
  barangay: true,
  bedrooms: true,
  bathrooms: true,
  floorArea: true,
  lotArea: true,
  isFeatured: true,
  isPagibigAccredited: true,
  isBankFinancingReady: true,
  isInHouseFinancing: true,
  isRentToOwn: true,
  images: {
    select: { url: true, isPrimary: true },
    orderBy: { order: "asc" as const },
    take: 1,
  },
} satisfies Prisma.PropertySelect;

const propertyDetailSelect = {
  id: true,
  title: true,
  slug: true,
  type: true,
  status: true,
  listingType: true,
  description: true,
  address: true,
  city: true,
  barangay: true,
  latitude: true,
  longitude: true,
  price: true,
  priceLabel: true,
  lotArea: true,
  floorArea: true,
  bedrooms: true,
  bathrooms: true,
  parking: true,
  floorLevel: true,
  totalFloors: true,
  monthlyRent: true,
  associationDue: true,
  beachFrontage: true,
  hasDock: true,
  isTourismZoned: true,
  isAirbnbReady: true,
  isPagibigAccredited: true,
  isBankFinancingReady: true,
  isInHouseFinancing: true,
  isRentToOwn: true,
  developerName: true,
  projectPhase: true,
  expectedTurnover: true,
  createdAt: true,
  images: {
    select: {
      url: true,
      publicId: true,
      isPrimary: true,
      order: true,
      caption: true,
    },
    orderBy: { order: "asc" as const },
  },
  amenities: {
    select: { id: true, name: true, icon: true },
  },
  paymentSchemes: {
    select: {
      id: true,
      type: true,
      description: true,
      downPayment: true,
      monthlyAmount: true,
      terms: true,
      interestRate: true,
    },
  },
  landmarks: {
    select: { id: true, name: true, category: true, distance: true },
  },
  units: {
    select: {
      id: true,
      label: true,
      status: true,
      price: true,
      priceLabel: true,
      floorArea: true,
      lotArea: true,
      bedrooms: true,
      bathrooms: true,
      parking: true,
      towerOrPhase: true,
      floorPlanImage: true,
    },
    orderBy: { price: "asc" as const },
  },
} satisfies Prisma.PropertySelect;

export type PropertyListItem = Prisma.PropertyGetPayload<{
  select: typeof propertyListSelect;
}>;

export type PropertyDetail = Prisma.PropertyGetPayload<{
  select: typeof propertyDetailSelect;
}>;

export const getFeaturedProperties = async (
  limit = 3,
): Promise<PropertyListItem[]> => {
  return prisma.property.findMany({
    where: {
      isFeatured: true,
      deletedAt: null,
      status: { notIn: ["SOLD", "RENTED"] },
    },
    select: propertyListSelect,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
};

export const getActiveListingsCount = async (): Promise<number> => {
  return prisma.property.count({
    where: {
      deletedAt: null,
      status: { notIn: ["SOLD", "RENTED"] },
    },
  });
};
