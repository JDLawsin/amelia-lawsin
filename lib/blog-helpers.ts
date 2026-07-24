import {
  formatForStorage,
  normalizeForMatching,
} from "@/lib/normalization";
import { prisma } from "@/lib/prisma";
import { slugifyTagName } from "@/lib/slugify";

type BlogTagInput = {
  name: string;
  slug?: string;
};

export const findOrCreateBlogTag = async (input: BlogTagInput) => {
  const name = input.name.trim();
  const slug = input.slug?.trim() || slugifyTagName(name);

  if (!name) {
    throw new Error("Tag name is required");
  }

  const existingBySlug = await prisma.blogTag.findUnique({
    where: { slug },
  });

  if (existingBySlug) {
    return { tagId: existingBySlug.id };
  }

  const existingByName = await prisma.blogTag.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (existingByName) {
    return { tagId: existingByName.id };
  }

  return {
    tag: {
      create: {
        name: formatForStorage(name),
        slug,
      },
    },
  };
};

export const processBlogTags = async (tags: BlogTagInput[]) => {
  const uniqueTags = tags
    .filter((tag) => tag.name?.trim())
    .reduce<BlogTagInput[]>((acc, tag) => {
      const key = normalizeForMatching(tag.name);
      if (!acc.some((t) => normalizeForMatching(t.name) === key)) {
        acc.push(tag);
      }
      return acc;
    }, []);

  return Promise.all(uniqueTags.map(findOrCreateBlogTag));
};
