import { Prisma, InquiryStatus } from "@/app/generated/prisma/browser";
import { ITEMS_PER_PAGE } from "@/constants";
import { prisma } from "@/lib/prisma";

const inquiryAdminListSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  propertyTitle: true,
  propertySlug: true,
  source: true,
  status: true,
  isRead: true,
  isArchived: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.InquirySelect;

const inquiryAdminDetailSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  propertyType: true,
  propertyTitle: true,
  propertySlug: true,
  propertyPrice: true,
  propertyLocation: true,
  propertyStatus: true,
  source: true,
  message: true,
  status: true,
  isRead: true,
  isArchived: true,
  notes: true,
  respondedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.InquirySelect;

export type InquiryAdminListItem = Prisma.InquiryGetPayload<{
  select: typeof inquiryAdminListSelect;
}>;

export type InquiryAdminDetail = Prisma.InquiryGetPayload<{
  select: typeof inquiryAdminDetailSelect;
}>;

export type InquiryAdminStatusFilter =
  | "all"
  | "new"
  | "contacted"
  | "closed"
  | "archived";

export type InquiryAdminFilters = {
  q?: string;
  status?: InquiryAdminStatusFilter;
  source?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
};

const parseDate = (value: string | undefined): Date | undefined => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const buildWhere = (filters: InquiryAdminFilters): Prisma.InquiryWhereInput => {
  const where: Prisma.InquiryWhereInput = {};

  if (filters.status === "archived") {
    where.isArchived = true;
  } else {
    where.isArchived = false;

    if (filters.status && filters.status !== "all") {
      where.status = filters.status.toUpperCase() as InquiryStatus;
    }
  }

  if (filters.source && filters.source !== "all") {
    where.source = filters.source;
  }

  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { email: { contains: filters.q, mode: "insensitive" } },
      { propertyTitle: { contains: filters.q, mode: "insensitive" } },
      { message: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  const fromDate = parseDate(filters.from);
  const toDate = parseDate(filters.to);

  if (fromDate || toDate) {
    where.createdAt = {};

    if (fromDate) {
      where.createdAt.gte = new Date(
        fromDate.getFullYear(),
        fromDate.getMonth(),
        fromDate.getDate(),
      );
    }

    if (toDate) {
      const end = new Date(
        toDate.getFullYear(),
        toDate.getMonth(),
        toDate.getDate(),
      );
      end.setDate(end.getDate() + 1);
      where.createdAt.lt = end;
    }
  }

  return where;
};

export const getAdminInquiries = async (
  filters: InquiryAdminFilters = {},
): Promise<InquiryAdminListItem[]> => {
  const { page = 1, pageSize = ITEMS_PER_PAGE } = filters;

  return prisma.inquiry.findMany({
    where: buildWhere(filters),
    select: inquiryAdminListSelect,
    orderBy: [{ createdAt: "desc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
};

export const getAdminInquiriesCount = async (
  filters: InquiryAdminFilters = {},
): Promise<number> => prisma.inquiry.count({ where: buildWhere(filters) });

export const getAdminInquiryById = async (
  id: string,
): Promise<InquiryAdminDetail | null> =>
  prisma.inquiry.findUnique({
    where: { id },
    select: inquiryAdminDetailSelect,
  });

export const getUnreadInquiryCount = async (): Promise<number> =>
  prisma.inquiry.count({
    where: { isRead: false, isArchived: false },
  });
