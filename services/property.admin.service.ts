// lib/services/property.admin.service.ts

import { Prisma } from "@/app/generated/prisma/browser";
import { ITEMS_PER_PAGE } from "@/constants";
import { prisma } from "@/lib/prisma";

const propertyAdminListSelect = {
  id: true,
  title: true,
  slug: true,
  type: true,
  status: true,
  listingType: true,
  isFeatured: true,
  city: true,
  barangay: true,
  price: true,
  priceLabel: true,
  bedrooms: true,
  floorArea: true,
  createdAt: true,
  deletedAt: true,
  images: {
    where: { isPrimary: true },
    select: { url: true },
    take: 1,
  },
} satisfies Prisma.PropertySelect;

const propertyAdminDetailSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  type: true,
  status: true,
  listingType: true,
  isFeatured: true,
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
  monthlyRent: true,
  associationDue: true,
  floorLevel: true,
  totalFloors: true,
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
  updatedAt: true,
  deletedAt: true,
  images: {
    select: {
      id: true,
      url: true,
      publicId: true,
      isPrimary: true,
      order: true,
      caption: true,
    },
    orderBy: { order: "asc" as const },
  },
  amenities: { select: { id: true, name: true, icon: true } },
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
    },
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
} satisfies Prisma.PropertySelect;

export type PropertyAdminListItem = Prisma.PropertyGetPayload<{
  select: typeof propertyAdminListSelect;
}>;

export type PropertyAdminDetail = Prisma.PropertyGetPayload<{
  select: typeof propertyAdminDetailSelect;
}>;

export type PropertyAdminFilters = {
  q?: string;
  status?: string;
  type?: string;
  showDeleted?: boolean;
  page?: number;
  pageSize?: number;
};

const buildWhere = (f: PropertyAdminFilters): Prisma.PropertyWhereInput => {
  const where: Prisma.PropertyWhereInput = {};

  if (!f.showDeleted) where.deletedAt = null;

  if (f.q) {
    where.OR = [
      { title: { contains: f.q, mode: "insensitive" } },
      { address: { contains: f.q, mode: "insensitive" } },
      { city: { contains: f.q, mode: "insensitive" } },
      { barangay: { contains: f.q, mode: "insensitive" } },
    ];
  }

  if (f.status) where.status = f.status as any;
  if (f.type) where.type = f.type as any;

  return where;
};

export const getAdminProperties = async (
  filters: PropertyAdminFilters = {},
): Promise<PropertyAdminListItem[]> => {
  const { page = 1, pageSize = ITEMS_PER_PAGE } = filters;

  return prisma.property.findMany({
    where: buildWhere(filters),
    select: propertyAdminListSelect,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: page * pageSize,
  });
};

export const getAdminPropertiesCount = async (
  filters: PropertyAdminFilters = {},
): Promise<number> => prisma.property.count({ where: buildWhere(filters) });

export const getAdminPropertyById = async (
  id: string,
): Promise<PropertyAdminDetail | null> =>
  prisma.property.findUnique({
    where: { id },
    select: propertyAdminDetailSelect,
  });
