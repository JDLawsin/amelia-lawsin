"use client";

import { BlogPreviewItem, BlogTag } from "@/services/blog.service";
import { Suspense } from "react";
import TagPills from "./TagPills";
import BlogCard from "@/components/ui/BlogCard";
import BlogLoadMore from "./BlogLoadMore";

type BlogClientProps = {
  blogs: BlogPreviewItem[];
  total: number;
  pageSize: number;
  tags: BlogTag[];
  activeTag?: string;
};

const BlogClient = ({
  blogs,
  total,
  pageSize,
  tags,
  activeTag,
}: BlogClientProps) => (
  <div>
    <Suspense>
      <TagPills tags={tags} activeTag={activeTag} />
    </Suspense>

    {/* All articles grid */}
    <div className="pt-8">
      <p className="text-xs font-medium text-fog uppercase tracking-widest mb-5">
        All articles
      </p>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-cloud border border-wire rounded-full flex items-center justify-center mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#86868b"
              strokeWidth="1.5"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p className="text-sm font-medium text-ink mb-1">No articles found</p>
          <p className="text-xs text-ash">Try a different tag filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>

    <div className="px-6">
      <Suspense>
        <BlogLoadMore
          showing={blogs.length}
          total={total}
          pageSize={pageSize}
        />
      </Suspense>
    </div>
  </div>
);

export default BlogClient;
