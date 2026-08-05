"use client";

import { startTransition } from "react";
import { useForm, type Resolver, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogFormSchema, BlogFormValues, BlogTagInput } from "../_schema/blog.schema";
import { useAutoSlug } from "@/hooks/useAutoSlug";
import FormInput from "@/components/ui/FormInput";
import FormTextArea from "@/components/ui/FormTextArea";
import { Input } from "@/components/ui/shadcn/input";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import { Button } from "@/components/ui/shadcn/button";
import TipTapEditor from "./TipTapEditor";
import TagCombobox from "./TagCombobox";
import CoverImageUpload from "./CoverImageUpload";
import { Loader2 } from "lucide-react";

type AvailableTag = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  mode: "create" | "update";
  defaultValues: BlogFormValues;
  allTags: AvailableTag[];
  formAction: (formData: FormData) => void;
  isPending: boolean;
  existingCoverUrl?: string | null;
  blogId?: string;
};

const BlogForm = ({
  mode,
  defaultValues,
  allTags,
  formAction,
  isPending,
  existingCoverUrl,
  blogId,
}: Props) => {
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(BlogFormSchema) as Resolver<BlogFormValues>,
    defaultValues,
    mode: "onTouched",
  });

  const { handleSubmit, watch, setValue, control } = form;

  useAutoSlug(watch, setValue, "title", "slug");

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();

    if (data.coverImage) {
      formData.append("coverImage", data.coverImage);
    }

    if (blogId) {
      formData.append("id", blogId);
    }

    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("excerpt", data.excerpt);
    formData.append("content", JSON.stringify(data.content));
    formData.append("tags", JSON.stringify(data.tags));
    formData.append("isPublished", String(data.isPublished));

    if (data.publishedAt) {
      formData.append("publishedAt", data.publishedAt);
    }

    if (data.metaTitle) {
      formData.append("metaTitle", data.metaTitle);
    }

    if (data.metaDescription) {
      formData.append("metaDescription", data.metaDescription);
    }

    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="bg-white border border-wire rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <FormInput
                id="title"
                label="Title"
                placeholder="e.g. 10 Tips for First-Time Home Buyers"
                required
                errors={
                  fieldState.error ? [fieldState.error.message!] : undefined
                }
                {...field}
              />
            )}
          />

          <Controller
            name="slug"
            control={control}
            render={({ field, fieldState }) => (
              <FormInput
                id="slug"
                label="Slug"
                placeholder="first-time-home-buyer-tips"
                required
                errors={
                  fieldState.error ? [fieldState.error.message!] : undefined
                }
                {...field}
              />
            )}
          />
        </div>

        <Controller
          name="excerpt"
          control={control}
          render={({ field, fieldState }) => (
            <FormTextArea
              id="excerpt"
              label="Excerpt"
              placeholder="Short summary shown in listings..."
              required
              rows={3}
              errors={
                fieldState.error ? [fieldState.error.message!] : undefined
              }
              {...field}
            />
          )}
        />

        <Controller
          name="content"
          control={control}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="content"
                className="text-xs font-medium text-ink"
              >
                Content <span className="text-destructive">*</span>
              </label>
              <TipTapEditor
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            </div>
          )}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Controller
            name="coverImage"
            control={control}
            render={({ field, fieldState }) => (
              <CoverImageUpload
                value={field.value}
                onChange={field.onChange}
                existingUrl={existingCoverUrl}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="tags"
            control={control}
            render={({ field, fieldState }) => (
              <TagCombobox
                availableTags={allTags}
                value={field.value}
                onChange={(tags) => field.onChange(tags as BlogTagInput[])}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Controller
            name="isPublished"
            control={control}
            render={({ field }) => (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-wire bg-cloud/30">
                <Checkbox
                  id="isPublished"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <div>
                  <label
                    htmlFor="isPublished"
                    className="text-sm font-medium text-ink"
                  >
                    Publish post
                  </label>
                  <p className="text-xs text-ash">
                    Published posts appear on the public blog. Leave unchecked
                    to save as a draft.
                  </p>
                </div>
              </div>
            )}
          />

          <Controller
            name="publishedAt"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="publishedAt"
                  className="text-xs font-medium text-ink"
                >
                  Publish date
                </label>
                <p className="text-xs text-fog">
                  Defaults to today when published.
                </p>
                <Input
                  id="publishedAt"
                  type="date"
                  className="h-11 rounded-xl bg-white"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
                {fieldState.error?.message && (
                  <p className="text-xs text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Controller
            name="metaTitle"
            control={control}
            render={({ field, fieldState }) => (
              <FormInput
                id="metaTitle"
                label="Meta title"
                placeholder="Overrides the default page title for SEO"
                errors={
                  fieldState.error ? [fieldState.error.message!] : undefined
                }
                {...field}
                value={field.value ?? ""}
              />
            )}
          />

          <Controller
            name="metaDescription"
            control={control}
            render={({ field, fieldState }) => (
              <FormTextArea
                id="metaDescription"
                label="Meta description"
                placeholder="Short description for search engines..."
                rows={3}
                errors={
                  fieldState.error ? [fieldState.error.message!] : undefined
                }
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="h-11 px-6 bg-ink text-white rounded-xl hover:bg-ink/90"
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {mode === "create" ? "Create Post" : "Update Post"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BlogForm;
