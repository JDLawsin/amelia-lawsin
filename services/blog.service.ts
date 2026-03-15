import { Prisma } from "@/app/generated/prisma/browser";
import { prisma } from "@/lib/prisma";

const blogPreviewSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  publishedAt: true,
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

export async function getLatestBlogs(limit = 3): Promise<BlogPreviewItem[]> {
  return prisma.blog.findMany({
    where: {
      isPublished: true,
      deletedAt: null,
    },
    select: blogPreviewSelect,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}
