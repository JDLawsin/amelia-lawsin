import { Suspense } from "react";
import type { Metadata } from "next";
import {
  getAllBlogs,
  getAllBlogTags,
  getBlogsCount,
} from "@/services/blog.service";
import FeaturedGrid from "./_components/FeaturedGrid";
import BlogCTAStrip from "./_components/BlogCTAStrip";
import BlogPageSkeleton from "./_components/BlogPageSkeleton";
import BlogClient from "./_components/BlogClient";

const PAGE_SIZE = 6;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;

  if (params.tag) {
    return {
      title: `${params.tag.replace(/-/g, " ")} Articles | Amelia Lawsin Real Estate Blog`,
      description: `Read expert articles about ${params.tag.replace(/-/g, " ")} in Cebu real estate. Tips, guides, and market insights from licensed agent Amelia Lawsin.`,
      alternates: { canonical: `/blog?tag=${params.tag}` },
    };
  }

  return {
    title: "Real Estate Blog | Cebu Property Guides & Tips | Amelia Lawsin",
    description:
      "Expert advice on buying, financing, and investing in Cebu real estate. Guides for locals, OFWs, and international buyers from licensed agent Amelia Lawsin.",
    alternates: { canonical: "/blog" },
    openGraph: {
      title: "Real Estate Blog | Cebu Property Guides & Tips",
      description:
        "Expert advice on buying, financing, and investing in Cebu real estate.",
      type: "website",
    },
  };
}

type SearchParams = {
  tag?: string;
  page?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const BlogPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page ?? "1"));
  const filters = {
    tag: params.tag,
    page: currentPage,
    pageSize: PAGE_SIZE,
  };
  const [blogs, totalCount, tags] = await Promise.all([
    getAllBlogs(filters),
    getBlogsCount(filters),
    getAllBlogTags(),
  ]);
  const featuredBlogs = blogs.slice(0, 3);

  return (
    <main className="bg-white min-h-screen">
      <div className="bg-cloud border-b border-wire px-6 py-10">
        <div className="max-w-7xl mx-auto flex items-end justify-between">
          <div>
            <p className="text-xs font-medium text-fog uppercase tracking-widest mb-3">
              Real Estate Insights
            </p>
            <h1 className="text-4xl font-serif font-medium text-ink tracking-tight leading-tight mb-3">
              Guides, tips &<br />
              market updates
            </h1>
            <p className="text-sm text-ash leading-relaxed max-w-md">
              Expert advice on buying, financing, and investing in Cebu real
              estate — for locals, OFWs, and international buyers.
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-4xl font-serif font-medium text-ink">
              {totalCount}
            </p>
            <p className="text-xs text-fog mt-1">
              {totalCount === 1 ? "article" : "articles"} published
            </p>
          </div>
        </div>
      </div>

      {!params.tag && featuredBlogs.length > 0 && (
        <div className="px-6 pt-8 pb-0 max-w-7xl mx-auto">
          <Suspense
            fallback={
              <div className="h-70 bg-cloud rounded-2xl animate-pulse" />
            }
          >
            <FeaturedGrid blogs={featuredBlogs} />
          </Suspense>
          <div className="h-px bg-wire mt-8" />
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<BlogPageSkeleton />}>
          <BlogClient
            blogs={blogs}
            total={totalCount}
            pageSize={PAGE_SIZE}
            tags={tags}
            activeTag={params.tag}
          />
        </Suspense>
      </div>

      <div className="px-6 py-12 max-w-7xl mx-auto">
        <BlogCTAStrip />
      </div>
    </main>
  );
};

export default BlogPage;
