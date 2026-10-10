"use client";

import { useActionState } from "react";
import {
  updateBlogAction,
  restoreBlogAction,
  BlogFormState,
} from "@/actions/blog.action";
import { BlogAdminDetail } from "@/services/blog.admin.service";
import { mapBlogToForm } from "@/lib/mapper";
import { useFormActionEffect } from "@/hooks/useFormActionEffect";
import { getBlogRedirectPath } from "@/lib/blog-redirect";
import BlogForm from "../../../_components/BlogForm";
import PageHeader from "@/components/ui/PageHeader";
import DeletedRestorePanel from "@/components/ui/DeletedRestorePanel";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/shadcn/badge";
import { BLOG_STATUS_LABELS, BLOG_STATUS_STYLES } from "@/constants";

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
    getRedirectPath: getBlogRedirectPath,
  });

  if (blog.deletedAt) {
    return (
      <DeletedRestorePanel
        title={blog.title}
        subtitle="Edit blog post"
        badgeLabel={BLOG_STATUS_LABELS.deleted}
        badgeClassName={BLOG_STATUS_STYLES.deleted}
        description="This post is in trash and can't be edited. Restore it to continue updating content or publishing."
        backHref="/admin/blogs?status=deleted"
        backLabel="Back to trash"
        onRestore={() => restoreBlogAction(blog.id)}
      />
    );
  }

  const visibility = blog.isPublished ? "published" : "draft";

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={
          <>
            <span className="truncate">{blog.title}</span>
            <Badge className={BLOG_STATUS_STYLES[visibility]}>
              {BLOG_STATUS_LABELS[visibility]}
            </Badge>
          </>
        }
        subtitle="Edit blog post"
        action={
          blog.isPublished ? (
            <Link
              href={`/blog/${blog.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 h-9 px-4 border border-wire bg-white text-ink text-sm font-medium rounded-xl hover:bg-cloud transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View public
            </Link>
          ) : undefined
        }
      />

      <BlogForm
        mode="update"
        defaultValues={mapBlogToForm(blog)}
        allTags={allTags}
        formAction={formAction}
        isPending={isPending}
        existingCoverUrl={blog.coverImage}
        blogId={blog.id}
        actionSuccess={state?.success === true}
      />
    </div>
  );
};

export default UpdateBlogContainer;
