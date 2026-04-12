"use client";

import useUpdateQueryString from "@/hooks/useQueryString";
import { BlogTag } from "@/services/blog.service";
import clsx from "clsx";

type TagPillsProps = {
  tags: BlogTag[];
  activeTag?: string;
};

const TagPills = ({ tags, activeTag }: TagPillsProps) => {
  const updateQueryString = useUpdateQueryString();

  const handleTag = (slug: string | null) => {
    if (slug === null) {
      updateQueryString({}, ["tag", "page"]);
    } else {
      updateQueryString({ tag: slug, page: "1" });
    }
  };

  const visibleTags = tags.filter((t) => t._count.blogs > 0);

  if (!visibleTags.length) return null;

  return (
    <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none">
      <span className="text-xs text-fog shrink-0">Filter:</span>

      <button
        onClick={() => handleTag(null)}
        className={clsx(
          "h-8 px-4 rounded-full text-xs font-medium border whitespace-nowrap shrink-0 transition-colors",
          !activeTag
            ? "bg-ink text-white border-ink"
            : "bg-white text-ash border-wire hover:border-ink hover:text-ink",
        )}
      >
        All
      </button>

      {visibleTags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => handleTag(tag.slug)}
          className={clsx(
            "h-8 px-4 rounded-full text-xs font-medium border whitespace-nowrap shrink-0 transition-colors",
            activeTag === tag.slug
              ? "bg-ink text-white border-ink"
              : "bg-white text-ash border-wire hover:border-ink hover:text-ink",
          )}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
};

export default TagPills;
