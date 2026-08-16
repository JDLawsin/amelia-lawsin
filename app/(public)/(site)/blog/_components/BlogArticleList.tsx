import { BlogPreviewItem } from "@/services/blog.service";
import BlogCard from "@/components/ui/BlogCard";
import TagPills from "./TagPills";
import BlogPagination from "./BlogPagination";
import { blogListUrl } from "@/lib/blog-list-url";
import Link from "next/link";
import type { BlogTag } from "@/services/blog.service";

type Props = {
  blogs: BlogPreviewItem[];
  total: number;
  pageSize: number;
  currentPage: number;
  tags: BlogTag[];
  activeTag?: string;
  activeQuery?: string;
};

/** Server-rendered blog listing — search, tag filters, and pagination. */
const BlogArticleList = ({
  blogs,
  total,
  pageSize,
  currentPage,
  tags,
  activeTag,
  activeQuery,
}: Props) => (
  <div>
    <TagPills tags={tags} activeTag={activeTag} activeQuery={activeQuery} />

    <div className="pt-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xs font-medium uppercase tracking-widest text-ash text-pretty">
            {activeQuery ? "Search Results" : "All Articles"}
          </h2>
          {(activeQuery || activeTag) && (
            <p className="mt-1 text-xs text-ash tabular-nums">
              {total} {total === 1 ? "article" : "articles"}
              {activeQuery ? ` matching “${activeQuery}”` : ""}
            </p>
          )}
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {total} {total === 1 ? "article" : "articles"} found
        {activeQuery ? ` for ${activeQuery}` : ""}.
      </p>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-wire bg-cloud">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#86868b"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p className="mb-1 text-sm font-medium text-ink">No articles found</p>
          <p className="mb-4 max-w-sm text-xs leading-relaxed text-ash text-pretty">
            {activeQuery
              ? `No results for “${activeQuery}”. Try a shorter keyword, another topic tag, or clear your filters.`
              : "Try a different topic tag."}
          </p>
          {(activeQuery || activeTag) && (
            <Link
              href={blogListUrl()}
              className="text-xs font-medium text-ink underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
            >
              Clear filters
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map((blog, index) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              loading={index < 3 ? "eager" : undefined}
            />
          ))}
        </div>
      )}
    </div>

    {total > pageSize && (
      <div className="mt-8 -mx-6 px-6">
        <BlogPagination
          page={currentPage}
          pageSize={pageSize}
          total={total}
          activeTag={activeTag}
          activeQuery={activeQuery}
          label="articles"
        />
      </div>
    )}
  </div>
);

export default BlogArticleList;
