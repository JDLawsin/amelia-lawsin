import Link from "next/link";
import { BlogTag } from "@/services/blog.service";
import clsx from "clsx";

type TagPillsProps = {
  tags: BlogTag[];
  activeTag?: string;
};

const pillClass = (active: boolean) =>
  clsx(
    "inline-flex h-8 items-center px-4 rounded-full text-xs font-medium border whitespace-nowrap shrink-0 transition-colors",
    active
      ? "bg-ink text-white border-ink"
      : "bg-white text-ash border-wire hover:border-ink hover:text-ink",
  );

/** Server-rendered tag filters — plain links, no client JS. */
const TagPills = ({ tags, activeTag }: TagPillsProps) => {
  const visibleTags = tags.filter((t) => t._count.blogs > 0);

  if (!visibleTags.length) return null;

  return (
    <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none">
      <span className="text-xs text-ash shrink-0">Filter:</span>

      <Link href="/blog" className={pillClass(!activeTag)}>
        All
      </Link>

      {visibleTags.map((tag) => (
        <Link
          key={tag.id}
          href={`/blog?tag=${tag.slug}`}
          className={pillClass(activeTag === tag.slug)}
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
};

export default TagPills;
