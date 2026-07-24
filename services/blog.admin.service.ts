import { ITEMS_PER_PAGE } from "@/constants";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/browser";

const blogAdminListSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  isPublished: true,
  isAiGenerated: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  tags: {
    select: {
      tag: {
        select: { name: true, slug: true },
      },
    },
  },
} satisfies Prisma.BlogSelect;

const blogAdminDetailSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  coverImage: true,
  coverPublicId: true,
  isPublished: true,
  isAiGenerated: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  metaTitle: true,
  metaDescription: true,
  tags: {
    select: {
      tag: {
        select: { id: true, name: true, slug: true },
      },
    },
  },
} satisfies Prisma.BlogSelect;

export type BlogAdminListItem = Prisma.BlogGetPayload<{
  select: typeof blogAdminListSelect;
}>;

export type BlogAdminDetail = Prisma.BlogGetPayload<{
  select: typeof blogAdminDetailSelect;
}>;

export type BlogAdminStatusFilter = "all" | "published" | "draft" | "deleted";

export type BlogAdminFilters = {
  q?: string;
  status?: BlogAdminStatusFilter;
  page?: number;
  pageSize?: number;
};

const buildWhere = (
  filters: BlogAdminFilters,
): Prisma.BlogWhereInput => {
  const where: Prisma.BlogWhereInput = {};

  if (filters.status === "deleted") {
    where.deletedAt = { not: null };
  } else {
    where.deletedAt = null;

    if (filters.status === "published") {
      where.isPublished = true;
    } else if (filters.status === "draft") {
      where.isPublished = false;
    }
  }

  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { excerpt: { contains: filters.q, mode: "insensitive" } },
      {
        tags: {
          some: {
            tag: {
              name: { contains: filters.q, mode: "insensitive" },
            },
          },
        },
      },
    ];
  }

  return where;
};

export const getAdminBlogs = async (
  filters: BlogAdminFilters = {},
): Promise<BlogAdminListItem[]> => {
  const { page = 1, pageSize = ITEMS_PER_PAGE } = filters;

  return prisma.blog.findMany({
    where: buildWhere(filters),
    select: blogAdminListSelect,
    orderBy: [{ isPublished: "desc" }, { updatedAt: "desc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
};

export const getAdminBlogsCount = async (
  filters: BlogAdminFilters = {},
): Promise<number> =>
  prisma.blog.count({ where: buildWhere(filters) });

export const getAdminBlogBySlug = async (
  slug: string,
): Promise<BlogAdminDetail | null> =>
  prisma.blog.findUnique({
    where: { slug },
    select: blogAdminDetailSelect,
  });
