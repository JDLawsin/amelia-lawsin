import { ALLOWED_TYPES, MAX_SIZE } from "@/constants";
import { z } from "zod";

export const TipTapDocSchema = z
  .object({
    type: z.literal("doc"),
    content: z.array(z.record(z.string(), z.any())).default([]),
  })
  .passthrough();

export type TipTapDoc = z.infer<typeof TipTapDocSchema>;

export const BlogTagInputSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
  slug: z.string().min(1, "Tag slug is required"),
});

export type BlogTagInput = z.infer<typeof BlogTagInputSchema>;

export const BlogFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(500, "Excerpt must be at most 500 characters"),
  content: TipTapDocSchema,
  coverImage: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_SIZE, "Cover image must be 5MB or less")
    .refine(
      (file) => ALLOWED_TYPES.includes(file.type),
      "Cover image must be JPEG, PNG, or WebP",
    )
    .optional(),
  tags: z.array(BlogTagInputSchema).default([]),
  isPublished: z.preprocess(
    (val) => val === "true" || val === true || val === "on",
    z.boolean().default(false),
  ),
  publishedAt: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return !Number.isNaN(Date.parse(val));
    }, "Invalid publish date"),
  metaTitle: z
    .string()
    .max(200, "Meta title must be at most 200 characters")
    .optional(),
  metaDescription: z
    .string()
    .max(500, "Meta description must be at most 500 characters")
    .optional(),
});

export type BlogFormValues = z.infer<typeof BlogFormSchema>;
