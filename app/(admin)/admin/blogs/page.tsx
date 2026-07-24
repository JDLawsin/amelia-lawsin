import PageHeader from "@/components/ui/PageHeader";
import { ITEMS_PER_PAGE } from "@/constants";
import { Suspense } from "react";
import TableSkeleton from "./_components/TableSkeleton";
import FiltersBar from "./_components/FiltersBar";
import BlogsSection from "./_components/BlogsSection";
import { BlogAdminStatusFilter } from "@/services/blog.admin.service";

type SearchParams = {
  q?: string;
  status?: string;
  page?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const BlogsPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));
  const status = params.status as BlogAdminStatusFilter | undefined;

  const filters = {
    q: params.q,
    status: status ?? "all",
    page,
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Blogs"
        actionLabel="New post"
        actionHref="/admin/blogs/new"
      />

      <div className="flex flex-col gap-4">
        <FiltersBar filters={filters} />

        <Suspense fallback={<TableSkeleton />}>
          <BlogsSection
            filters={filters}
            page={page}
            pageSize={ITEMS_PER_PAGE}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default BlogsPage;
