import {
  Prisma,
  PropertyStatus,
  PropertyType,
} from "@/app/generated/prisma/client";
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
  isFeatured: true,
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

export type PropertyFilters = {
  q?: string;
  status?: PropertyStatus;
  type?: PropertyType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  special?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};

const buildWhereClause = (
  filters: PropertyFilters,
): Prisma.PropertyWhereInput => {
  const where: Prisma.PropertyWhereInput = {
    deletedAt: null,
    status: { notIn: ["SOLD", "RENTED"] },
  };

  if (filters.status) {
    where.status = filters.status as PropertyStatus;
  }

  if (filters.type) {
    where.type = filters.type as PropertyType;
  }

  if (filters.city) {
    where.city = { equals: filters.city, mode: "insensitive" };
  }

  if (filters.minPrice || filters.maxPrice) {
    where.price = {
      ...(filters.minPrice && { gte: filters.minPrice }),
      ...(filters.maxPrice && { lte: filters.maxPrice }),
    };
  }

  if (filters.bedrooms !== undefined) {
    where.bedrooms =
      filters.bedrooms >= 4
        ? { gte: 4 }
        : filters.bedrooms === 0
          ? 0
          : filters.bedrooms;
  }

  if (filters.special) {
    const specialMap: Record<string, Prisma.PropertyWhereInput> = {
      pagibig: { isPagibigAccredited: true },
      bank: { isBankFinancingReady: true },
      inhouse: { isInHouseFinancing: true },
      renttoown: { isRentToOwn: true },
    };
    Object.assign(where, specialMap[filters.special] ?? {});
  }

  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { city: { contains: filters.q, mode: "insensitive" } },
      { barangay: { contains: filters.q, mode: "insensitive" } },
      { developerName: { contains: filters.q, mode: "insensitive" } },
      { address: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  return where;
};

const buildOrderBy = (
  sort?: string,
): Prisma.PropertyOrderByWithRelationInput[] => {
  switch (sort) {
    case "price_asc":
      return [{ price: "asc" }, { createdAt: "desc" }];
    case "price_desc":
      return [{ price: "desc" }, { createdAt: "desc" }];
    case "featured":
      return [{ isFeatured: "desc" }, { createdAt: "desc" }];
    case "newest":
    default:
      return [{ createdAt: "desc" }];
  }
};

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

export const getAllProperties = async (
  filters: PropertyFilters = {},
): Promise<PropertyListItem[]> => {
  const { page = 1, pageSize = 9 } = filters;
  const where = buildWhereClause(filters);
  const orderBy = buildOrderBy(filters.sort);

  return prisma.property.findMany({
    where,
    select: propertyListSelect,
    orderBy,
    take: page * pageSize,
  });
};

export const getPropertiesCount = async (
  filters: PropertyFilters = {},
): Promise<number> => {
  return prisma.property.count({
    where: buildWhereClause(filters),
  });
};

export const getPropertyBySlug = async (
  slug: string,
): Promise<PropertyDetail | null> => {
  return prisma.property.findFirst({
    where: {
      slug,
      deletedAt: null,
    },
    select: propertyDetailSelect,
  });
};

export const getRelatedProperties = async (
  property: Pick<PropertyDetail, "id" | "type" | "city">,
  limit = 3,
): Promise<PropertyListItem[]> => {
  return prisma.property.findMany({
    where: {
      deletedAt: null,
      status: { notIn: ["SOLD", "RENTED"] },
      type: property.type,
      city: property.city,
      NOT: { id: property.id },
    },
    select: propertyListSelect,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
};

export async function getLatestListing(): Promise<PropertyListItem | null> {
  return prisma.property.findFirst({
    where: {
      deletedAt: null,
      status: { notIn: ["SOLD", "RENTED"] },
      images: { some: {} },
    },
    select: propertyListSelect,
    orderBy: { createdAt: "desc" },
  });
}
