"use client";

import { useActionState } from "react";
import { createBlogAction, BlogFormState } from "@/actions/blog.action";
import BlogForm from "../../_components/BlogForm";
import { useFormActionEffect } from "@/hooks/useFormActionEffect";
import { getBlogRedirectPath } from "@/lib/blog-redirect";
import PageHeader from "@/components/ui/PageHeader";

type AvailableTag = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  allTags: AvailableTag[];
};

const CreateBlogContainer = ({ allTags }: Props) => {
  const [state, formAction, isPending] = useActionState<BlogFormState, FormData>(
    createBlogAction,
    null,
  );

  useFormActionEffect(state, {
    getRedirectPath: getBlogRedirectPath,
  });

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="New blog post" />

      <BlogForm
        mode="create"
        defaultValues={{
          title: "",
          slug: "",
          excerpt: "",
          content: { type: "doc", content: [] },
          coverImage: undefined,
          tags: [],
          isPublished: false,
          publishedAt: undefined,
          metaTitle: undefined,
          metaDescription: undefined,
        }}
        allTags={allTags}
        formAction={formAction}
        isPending={isPending}
        actionSuccess={state?.success === true}
      />
    </div>
  );
};

export default CreateBlogContainer;
