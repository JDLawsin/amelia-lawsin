import Link from "next/link";
import { BlogTag } from "@/services/blog.service";
import { blogListUrl } from "@/lib/blog-list-url";
import clsx from "clsx";

type Props = {
  activeTag?: string;
  activeQuery?: string;
  tags: BlogTag[];
};

const BlogActiveFilters = ({ activeTag, activeQuery, tags }: Props) => {
  if (!activeQuery && !activeTag) return null;

  const activeTagName = tags.find((tag) => tag.slug === activeTag)?.name;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-ash shrink-0">Active filters:</span>

      {activeQuery && (
        <Link
          href={blogListUrl({ tag: activeTag })}
          className={clsx(
            "inline-flex h-8 max-w-full items-center gap-1 rounded-full border border-wire",
            "bg-white px-3 text-xs font-medium text-ink transition-colors",
            "hover:border-ink hover:bg-cloud",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30",
          )}
        >
          <span className="truncate">
            Search: <span className="font-normal text-ash">{activeQuery}</span>
          </span>
          <span aria-hidden="true" className="text-ash">
            ×
          </span>
          <span className="sr-only">Remove search filter</span>
        </Link>
      )}

      {activeTag && activeTagName && (
        <Link
          href={blogListUrl({ q: activeQuery })}
          className={clsx(
            "inline-flex h-8 max-w-full items-center gap-1 rounded-full border border-wire",
            "bg-white px-3 text-xs font-medium text-ink transition-colors",
            "hover:border-ink hover:bg-cloud",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30",
          )}
        >
          <span className="truncate">
            Tag: <span className="font-normal text-ash">{activeTagName}</span>
          </span>
          <span aria-hidden="true" className="text-ash">
            ×
          </span>
          <span className="sr-only">Remove tag filter</span>
        </Link>
      )}

      <Link
        href="/blog"
        className={clsx(
          "text-xs font-medium text-ash underline-offset-2 transition-colors",
          "hover:text-ink hover:underline",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30",
        )}
      >
        Clear all
      </Link>
    </div>
  );
};

export default BlogActiveFilters;
