"use client";

import { useActionState } from "react";
import { updateBlogAction, BlogFormState } from "@/actions/blog.action";
import { BlogAdminDetail } from "@/services/blog.admin.service";
import { mapBlogToForm } from "@/lib/mapper";
import { useFormActionEffect } from "@/hooks/useFormActionEffect";
import BlogForm from "../../../_components/BlogForm";
import PageHeader from "@/components/ui/PageHeader";

type AvailableTag = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  blog: BlogAdminDetail;
  allTags: AvailableTag[];
};

const UpdateBlogContainer = ({ blog, allTags }: Props) => {
  const [state, formAction, isPending] = useActionState<BlogFormState, FormData>(
    updateBlogAction,
    null,
  );

  useFormActionEffect(state, {
    getRedirectPath: (state) =>
      state?.slug ? `/blog/${state.slug}` : null,
  });

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Edit blog post" />

      <BlogForm
        mode="update"
        defaultValues={mapBlogToForm(blog)}
        allTags={allTags}
        formAction={formAction}
        isPending={isPending}
        existingCoverUrl={blog.coverImage}
        blogId={blog.id}
      />
    </div>
  );
};

export default UpdateBlogContainer;
