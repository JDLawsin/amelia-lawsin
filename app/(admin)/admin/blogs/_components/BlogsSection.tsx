import {
  getAdminBlogs,
  getAdminBlogsCount,
  type BlogAdminFilters,
} from "@/services/blog.admin.service";
import Blogs from "./Blogs";

type Props = {
  filters: BlogAdminFilters;
  page: number;
  pageSize: number;
};

const BlogsSection = async ({ filters, page, pageSize }: Props) => {
  const [blogs, total] = await Promise.all([
    getAdminBlogs(filters),
    getAdminBlogsCount(filters),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-ash">
        {total} post{total !== 1 ? "s" : ""} total
      </p>

      <Blogs
        blogs={blogs}
        total={total}
        page={page}
        pageSize={pageSize}
      />
    </div>
  );
};

export default BlogsSection;
