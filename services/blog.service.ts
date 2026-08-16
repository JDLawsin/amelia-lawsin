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

const buildBlogWhereClause = async (
  filters: BlogFilters = {},
): Promise<Prisma.BlogWhereInput> => {
  const where: Prisma.BlogWhereInput = {
    isPublished: true,
    deletedAt: null,
  };

  const query = filters.q?.trim();
  if (query) {
    const ids = await findPublishedBlogIdsByKeyword(query);
    where.id = { in: ids };
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

const findPublishedBlogIdsByKeyword = async (
  q: string,
): Promise<string[]> => {
  const pattern = `%${q}%`;
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT b.id
    FROM blogs b
    WHERE b."isPublished" = true
      AND b."deletedAt" IS NULL
      AND (
        b.title ILIKE ${pattern}
        OR b.excerpt ILIKE ${pattern}
        OR b.content::text ILIKE ${pattern}
        OR EXISTS (
          SELECT 1
          FROM tags_on_blogs tob
          INNER JOIN blog_tags bt ON bt.id = tob."tagId"
          WHERE tob."blogId" = b.id
            AND bt.name ILIKE ${pattern}
        )
      )
  `;

  return rows.map((row) => row.id);
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
  const where = await buildBlogWhereClause(filters);

  return prisma.blog.findMany({
    where,
    select: blogPreviewSelect,
    orderBy: { publishedAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
};

export const getBlogsCount = async (
  filters: BlogFilters = {},
): Promise<number> => {
  return prisma.blog.count({
    where: await buildBlogWhereClause(filters),
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
