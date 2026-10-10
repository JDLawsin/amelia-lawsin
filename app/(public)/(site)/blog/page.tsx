import type { Metadata } from "next";
import {
  getAllBlogs,
  getAllBlogTags,
  getBlogsCount,
} from "@/services/blog.service";
import { getSiteUrl } from "@/lib/site";
import { breadcrumbListJsonLd } from "@/lib/structured-data";
import { LcpPreloadLink } from "@/lib/preload-lcp-image";
import {
  BLOG_IMAGE_HEIGHT,
  BLOG_IMAGE_WIDTH,
} from "@/lib/image-layout";
import JsonLd from "@/components/ui/JsonLd";
import FeaturedGrid from "./_components/FeaturedGrid";
import BlogCTAStrip from "./_components/BlogCTAStrip";
import BlogArticleList from "./_components/BlogArticleList";
import Link from "next/link";

const PAGE_SIZE = 6;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; q?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q?.trim();

  if (query) {
    return {
      title: `Search: ${query} | Amelia Lawsin Real Estate Blog`,
      description: `Blog articles matching “${query}” — Cebu real estate guides and tips from licensed agent Amelia Lawsin.`,
      alternates: { canonical: `/blog?q=${encodeURIComponent(query)}` },
    };
  }

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
  q?: string;
  page?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const BlogPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page ?? "1"));
  const activeQuery = params.q?.trim() || undefined;
  const filters = {
    q: activeQuery,
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
  const lcpCover =
    !params.tag && !activeQuery ? featuredBlogs[0]?.coverImage : undefined;

  const baseUrl = getSiteUrl();

  return (
    <main className="bg-white min-h-screen">
      {lcpCover && (
        <LcpPreloadLink
          src={lcpCover}
          alt={featuredBlogs[0]?.title ?? "Latest blog article"}
          width={BLOG_IMAGE_WIDTH}
          height={BLOG_IMAGE_HEIGHT}
          sizes="(max-width: 768px) 100vw, 800px"
          media="(min-width: 768px)"
        />
      )}

      <JsonLd
        data={breadcrumbListJsonLd(baseUrl, [
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ])}
      />

      <div className="bg-cloud border-b border-wire px-6 py-10">
        <div className="max-w-7xl mx-auto flex items-end justify-between">
          <div>
            <p className="text-xs font-medium text-ash uppercase tracking-widest mb-3">
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
            <Link
              href="/feed.xml"
              className="inline-flex md:hidden items-center gap-1.5 text-xs text-ash hover:text-ink transition-colors mt-4"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20 5 20 4 19 4 17.82 4 16.64 5 15.64 6.18 15.64M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
              </svg>
              Subscribe via RSS
            </Link>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-4xl font-serif font-medium text-ink">
              {totalCount}
            </p>
            <p className="text-xs text-ash mt-1">
              {totalCount === 1 ? "article" : "articles"} published
            </p>
            <Link
              href="/feed.xml"
              className="inline-flex items-center gap-1.5 text-xs text-ash hover:text-ink transition-colors mt-3"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20 5 20 4 19 4 17.82 4 16.64 5 15.64 6.18 15.64M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
              </svg>
              RSS feed
            </Link>
          </div>
        </div>
      </div>

      {!params.tag && !activeQuery && featuredBlogs.length > 0 && (
        <div className="px-6 pt-8 pb-0 max-w-7xl mx-auto">
          <FeaturedGrid blogs={featuredBlogs} />
          <div className="mt-8" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        <BlogArticleList
          blogs={blogs}
          total={totalCount}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
          tags={tags}
          activeTag={params.tag}
          activeQuery={activeQuery}
        />
      </div>

      <div className="px-6 py-12 max-w-7xl mx-auto">
        <BlogCTAStrip />
      </div>
    </main>
  );
};

export default BlogPage;
