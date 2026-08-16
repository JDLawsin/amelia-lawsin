import Link from "next/link";
import { Suspense } from "react";
import { BlogTag } from "@/services/blog.service";
import { blogListUrl } from "@/lib/blog-list-url";
import clsx from "clsx";
import BlogSearchBar from "./BlogSearchBar";
import BlogSearchFallback from "./BlogSearchFallback";
import BlogActiveFilters from "./BlogActiveFilters";

type TagPillsProps = {
  tags: BlogTag[];
  activeTag?: string;
  activeQuery?: string;
};

const pillClass = (active: boolean) =>
  clsx(
    "inline-flex h-8 items-center px-4 rounded-full text-xs font-medium border whitespace-nowrap shrink-0 transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30",
    active
      ? "bg-ink text-white border-ink"
      : "bg-white text-ash border-wire hover:border-ink hover:text-ink",
  );

const TagPills = ({ tags, activeTag, activeQuery }: TagPillsProps) => {
  const visibleTags = tags.filter((t) => t._count.blogs > 0);

  return (
    <div className="flex flex-col gap-4 border-b border-wire py-4">
      <Suspense fallback={<BlogSearchFallback />}>
        <BlogSearchBar initialQuery={activeQuery ?? ""} />
      </Suspense>

      <BlogActiveFilters
        activeTag={activeTag}
        activeQuery={activeQuery}
        tags={tags}
      />

      {visibleTags.length > 0 && (
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs text-ash shrink-0">Topics:</span>

          <Link
            href={blogListUrl({ q: activeQuery })}
            className={pillClass(!activeTag)}
            aria-current={!activeTag ? "true" : undefined}
          >
            All
          </Link>

          {visibleTags.map((tag) => (
            <Link
              key={tag.id}
              href={blogListUrl({ tag: tag.slug, q: activeQuery })}
              className={pillClass(activeTag === tag.slug)}
              aria-current={activeTag === tag.slug ? "true" : undefined}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagPills;
