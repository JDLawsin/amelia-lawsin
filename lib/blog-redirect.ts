import { BlogFormState } from "@/actions/blog.action";

export const getBlogRedirectPath = (state: BlogFormState) => {
  if (!state?.success || !state.slug) return null;
  return state.isPublished
    ? `/blog/${state.slug}`
    : `/admin/blogs/${state.slug}/update`;
};
