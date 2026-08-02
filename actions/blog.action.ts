"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/auth";
import { ActionResult } from "@/types";
import { BlogFormSchema } from "@/app/(admin)/admin/blogs/_schema/blog.schema";
import { FieldErrors } from "react-hook-form";
import { deleteImages, uploadCoverImage } from "@/lib/cloudinary";
import { processBlogTags } from "@/lib/blog-helpers";
import { randomUUID } from "crypto";
import { Prisma } from "@/app/generated/prisma/client";

export type BlogFormState =
  | {
      success: true;
      message: string;
      slug: string;
      isPublished: boolean;
      errors?: never;
    }
  | {
      success: false;
      message: string;
      errors?: FieldErrors;
      slug?: never;
    }
  | null;

const parseJSON = (value: FormDataEntryValue | null) => {
  if (!value || typeof value !== "string") return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
};

const tagConnectionPayload = (
  connections: Awaited<ReturnType<typeof processBlogTags>>,
) =>
  connections.map((conn) =>
    "tagId" in conn
      ? { tag: { connect: { id: conn.tagId } } }
      : { tag: conn.tag },
  );

const checkSlugConflict = async (slug: string, excludeId?: string) => {
  const existing = await prisma.blog.findUnique({
    where: { slug },
    select: { id: true },
  });

  return existing && existing.id !== excludeId;
};

export const createBlogAction = withAdminAuth(
  async (_, formData: FormData): Promise<BlogFormState> => {
    let uploadedCover: { url: string; publicId: string } | null = null;

    try {
      const coverFile = (formData.get("coverImage") as File | null) ?? undefined;
      const content = parseJSON(formData.get("content")) ?? { type: "doc", content: [] };
      const tags = parseJSON(formData.get("tags")) ?? [];

      const rawData = {
        ...Object.fromEntries(formData.entries()),
        content,
        tags,
        coverImage: coverFile && coverFile.size > 0 ? coverFile : undefined,
      };

      const result = BlogFormSchema.safeParse(rawData);

      if (!result.success) {
        const fieldErrors: FieldErrors = {};
        const flatErrors = result.error.flatten().fieldErrors;

        for (const [field, messages] of Object.entries(flatErrors)) {
          if (messages && messages.length > 0) {
            fieldErrors[field] = { type: "manual", message: messages[0] };
          }
        }

        return {
          success: false,
          errors: fieldErrors,
          message: "Validation failed. Please check the form.",
        };
      }

      const data = result.data;

      if (await checkSlugConflict(data.slug)) {
        return {
          success: false,
          message: "Slug already in use.",
          errors: {
            slug: { type: "manual", message: "Slug already in use" },
          },
        };
      }

      const blogId = randomUUID();

      if (data.coverImage) {
        uploadedCover = await uploadCoverImage(data.coverImage, blogId);
      }

      const tagConnections = await processBlogTags(data.tags);

      const publishedAt =
        data.isPublished && !data.publishedAt
          ? new Date()
          : data.publishedAt
            ? new Date(data.publishedAt)
            : null;

      const blog = await prisma.blog.create({
        data: {
          id: blogId,
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content as Prisma.InputJsonValue,
          coverImage: uploadedCover?.url ?? null,
          coverPublicId: uploadedCover?.publicId ?? null,
          isPublished: data.isPublished,
          publishedAt,
          metaTitle: data.metaTitle ?? null,
          metaDescription: data.metaDescription ?? null,
          tags: {
            create: tagConnectionPayload(tagConnections),
          },
        },
        select: { slug: true, isPublished: true },
      });

      revalidatePath("/blog");
      revalidatePath("/admin/blogs");

      return {
        success: true,
        slug: blog.slug,
        isPublished: blog.isPublished,
        message: "Blog post created successfully.",
      };
    } catch (error) {
      console.error("Create blog error:", error);

      if (uploadedCover) {
        await deleteImages([uploadedCover.publicId]);
      }

      return {
        success: false,
        message: "Failed to create blog post. Please try again.",
      };
    }
  },
);

export const updateBlogAction = withAdminAuth(
  async (_, formData: FormData): Promise<BlogFormState> => {
    let uploadedCover: { url: string; publicId: string } | null = null;

    try {
      const blogId = formData.get("id") as string;
      const coverFile = (formData.get("coverImage") as File | null) ?? undefined;
      const content = parseJSON(formData.get("content")) ?? { type: "doc", content: [] };
      const tags = parseJSON(formData.get("tags")) ?? [];

      if (!blogId) {
        return {
          success: false,
          message: "Blog ID is required.",
        };
      }

      const rawData = {
        ...Object.fromEntries(formData.entries()),
        content,
        tags,
        coverImage: coverFile && coverFile.size > 0 ? coverFile : undefined,
        id: undefined,
      };

      const result = BlogFormSchema.safeParse(rawData);

      if (!result.success) {
        const fieldErrors: FieldErrors = {};
        const flatErrors = result.error.flatten().fieldErrors;

        for (const [field, messages] of Object.entries(flatErrors)) {
          if (messages && messages.length > 0) {
            fieldErrors[field] = { type: "manual", message: messages[0] };
          }
        }

        return {
          success: false,
          errors: fieldErrors,
          message: "Validation failed. Please check the form.",
        };
      }

      const data = result.data;

      const existingBlog = await prisma.blog.findUnique({
        where: { id: blogId },
        select: { id: true, slug: true, coverPublicId: true, publishedAt: true },
      });

      if (!existingBlog) {
        return {
          success: false,
          message: "Blog post not found.",
        };
      }

      if (await checkSlugConflict(data.slug, blogId)) {
        return {
          success: false,
          message: "Slug already in use.",
          errors: {
            slug: { type: "manual", message: "Slug already in use" },
          },
        };
      }

      if (data.coverImage) {
        uploadedCover = await uploadCoverImage(data.coverImage, blogId);
      }

      const tagConnections = await processBlogTags(data.tags);

      const publishedAt =
        data.isPublished && !data.publishedAt
          ? new Date()
          : data.publishedAt
            ? new Date(data.publishedAt)
            : existingBlog.publishedAt;

      const oldCoverPublicId = existingBlog.coverPublicId;

      const blog = await prisma.blog.update({
        where: { id: blogId },
        data: {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content as Prisma.InputJsonValue,
          isPublished: data.isPublished,
          publishedAt,
          metaTitle: data.metaTitle ?? null,
          metaDescription: data.metaDescription ?? null,
          ...(uploadedCover && {
            coverImage: uploadedCover.url,
            coverPublicId: uploadedCover.publicId,
          }),
          tags: {
            deleteMany: {},
            create: tagConnectionPayload(tagConnections),
          },
        },
        select: { slug: true, isPublished: true },
      });

      if (uploadedCover && oldCoverPublicId) {
        await deleteImages([oldCoverPublicId]);
      }

      revalidatePath("/blog");
      revalidatePath(`/blog/${existingBlog.slug}`);
      revalidatePath(`/blog/${blog.slug}`);
      revalidatePath("/admin/blogs");

      return {
        success: true,
        slug: blog.slug,
        isPublished: blog.isPublished,
        message: "Blog post updated successfully.",
      };
    } catch (error) {
      console.error("Update blog error:", error);

      if (uploadedCover) {
        await deleteImages([uploadedCover.publicId]);
      }

      return {
        success: false,
        message: "Failed to update blog post. Please try again.",
      };
    }
  },
);

export const togglePublishBlogAction = withAdminAuth(
  async (id: string): Promise<ActionResult> => {
    if (!id) {
      return { success: false, message: "Blog ID is required." };
    }

    try {
      const blog = await prisma.blog.findUnique({
        where: { id },
        select: { isPublished: true, publishedAt: true },
      });

      if (!blog) {
        return { success: false, message: "Blog post not found." };
      }

      const nextPublished = !blog.isPublished;

      await prisma.blog.update({
        where: { id },
        data: {
          isPublished: nextPublished,
          publishedAt: nextPublished && !blog.publishedAt ? new Date() : blog.publishedAt,
        },
      });

      revalidatePath("/blog");
      revalidatePath("/admin/blogs");

      return {
        success: true,
        message: nextPublished ? "Blog post published." : "Blog post unpublished.",
      };
    } catch (error) {
      console.error("Toggle publish blog error:", error);
      return {
        success: false,
        message: "Failed to update publish status. Please try again.",
      };
    }
  },
);

export const deleteBlogAction = withAdminAuth(
  async (id: string): Promise<ActionResult> => {
    if (!id) {
      return { success: false, message: "Blog ID is required." };
    }

    try {
      const blog = await prisma.blog.findUnique({
        where: { id },
        select: { slug: true },
      });

      if (!blog) {
        return { success: false, message: "Blog post not found." };
      }

      await prisma.blog.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      revalidatePath("/blog");
      revalidatePath(`/blog/${blog.slug}`);
      revalidatePath("/admin/blogs");

      return { success: true, message: "Blog post deleted." };
    } catch (error) {
      console.error("Delete blog error:", error);
      return {
        success: false,
        message: "Failed to delete blog post. Please try again.",
      };
    }
  },
);

export const restoreBlogAction = withAdminAuth(
  async (id: string): Promise<ActionResult> => {
    if (!id) {
      return { success: false, message: "Blog ID is required." };
    }

    try {
      await prisma.blog.update({
        where: { id },
        data: { deletedAt: null },
      });

      revalidatePath("/blog");
      revalidatePath("/admin/blogs");

      return { success: true, message: "Blog post restored." };
    } catch (error) {
      console.error("Restore blog error:", error);
      return {
        success: false,
        message: "Failed to restore blog post. Please try again.",
      };
    }
  },
);
