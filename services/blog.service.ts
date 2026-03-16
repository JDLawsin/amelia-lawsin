import { Prisma } from "@/app/generated/prisma/browser";
import { prisma } from "@/lib/prisma";

const blogPreviewSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  publishedAt: true,
  isAiGenerated: true,
  tags: {
    select: {
      tag: {
        select: { name: true, slug: true },
      },
    },
  },
} satisfies Prisma.BlogSelect;

const blogDetailSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  coverImage: true,
  coverPublicId: true,
  isAiGenerated: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
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

export type BlogPreviewItem = Prisma.BlogGetPayload<{
  select: typeof blogPreviewSelect;
}>;

export type BlogDetail = Prisma.BlogGetPayload<{
  select: typeof blogDetailSelect;
}>;

export type BlogTag = {
  id: string;
  name: string;
  slug: string;
  _count: { blogs: number };
};

export type BlogFilters = {
  q?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
};

const buildBlogWhereClause = (
  filters: BlogFilters = {},
): Prisma.BlogWhereInput => {
  const where: Prisma.BlogWhereInput = {
    isPublished: true,
    deletedAt: null,
  };

  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { excerpt: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  if (filters.tag) {
    where.tags = {
      some: {
        tag: { slug: filters.tag },
      },
    };
  }

  return where;
};

export const getLatestBlogs = async (limit = 3): Promise<BlogPreviewItem[]> => {
  return prisma.blog.findMany({
    where: {
      isPublished: true,
      deletedAt: null,
    },
    select: blogPreviewSelect,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
};

export const getAllBlogs = async (
  filters: BlogFilters = {},
): Promise<BlogPreviewItem[]> => {
  const { page = 1, pageSize = 6 } = filters;
  const where = buildBlogWhereClause(filters);

  return prisma.blog.findMany({
    where,
    select: blogPreviewSelect,
    orderBy: { publishedAt: "desc" },
    take: page * pageSize,
  });
};

export const getBlogsCount = (filters: BlogFilters = {}): Promise<number> => {
  return prisma.blog.count({
    where: buildBlogWhereClause(filters),
  });
};

export const getAllBlogTags = (): Promise<BlogTag[]> => {
  return prisma.blogTag.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { blogs: true } },
    },
  });
};

export const getBlogBySlug = async (
  slug: string,
): Promise<BlogDetail | null> => {
  return prisma.blog.findFirst({
    where: {
      slug,
      isPublished: true,
      deletedAt: null,
    },
    select: blogDetailSelect,
  });
};

export const getRelatedBlogs = async (
  blog: Pick<BlogDetail, "id" | "tags">,
  limit = 3,
): Promise<BlogPreviewItem[]> => {
  const tagIds = blog.tags.map((t) => t.tag.id);

  return prisma.blog.findMany({
    where: {
      isPublished: true,
      deletedAt: null,
      NOT: { id: blog.id },
      tags: {
        some: { tagId: { in: tagIds } },
      },
    },
    select: blogPreviewSelect,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
};
