import { Prisma, PropertyStatus } from "@/app/generated/prisma/browser";
import { prisma } from "@/lib/prisma";

const recentPropertySelect = {
  id: true,
  title: true,
  slug: true,
  status: true,
  type: true,
  createdAt: true,
  images: {
    where: { isPrimary: true },
    select: { url: true },
    take: 1,
  },
} satisfies Prisma.PropertySelect;

const recentInquirySelect = {
  id: true,
  name: true,
  email: true,
  propertyTitle: true,
  status: true,
  isRead: true,
  createdAt: true,
} satisfies Prisma.InquirySelect;

export type DashboardRecentProperty = Prisma.PropertyGetPayload<{
  select: typeof recentPropertySelect;
}>;

export type DashboardRecentInquiry = Prisma.InquiryGetPayload<{
  select: typeof recentInquirySelect;
}>;

export type DashboardMetrics = {
  activeListings: number;
  totalInquiries: number;
  featuredProperties: number;
  recentlySoldOrRented: number;
};

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const [
    activeListings,
    totalInquiries,
    featuredProperties,
    recentlySoldOrRented,
  ] = await Promise.all([
    prisma.property.count({
      where: {
        deletedAt: null,
        status: {
          in: [
            PropertyStatus.FOR_SALE,
            PropertyStatus.FOR_RENT,
            PropertyStatus.PRE_SELLING,
          ],
        },
      },
    }),
    prisma.inquiry.count({
      where: { isArchived: false },
    }),
    prisma.property.count({
      where: { deletedAt: null, isFeatured: true },
    }),
    prisma.property.count({
      where: {
        deletedAt: null,
        status: { in: [PropertyStatus.SOLD, PropertyStatus.RENTED] },
      },
    }),
  ]);

  return {
    activeListings,
    totalInquiries,
    featuredProperties,
    recentlySoldOrRented,
  };
};

export const getRecentInquiries = async (
  limit = 5,
): Promise<DashboardRecentInquiry[]> =>
  prisma.inquiry.findMany({
    where: { isArchived: false },
    select: recentInquirySelect,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

export const getRecentProperties = async (
  limit = 5,
): Promise<DashboardRecentProperty[]> =>
  prisma.property.findMany({
    where: { deletedAt: null },
    select: recentPropertySelect,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
