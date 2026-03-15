import Link from "next/link";
import { BlogPreviewItem } from "../home/BlogPreviewSection";
import Image from "next/image";
import { estimateReadTime, formatDate } from "@/lib/utils";

const BlogCard = ({ blog }: { blog: BlogPreviewItem }) => (
  <Link
    href={`/blog/${blog.slug}`}
    className="group flex flex-col bg-white rounded-xl border border-wire overflow-hidden shadow-apple hover:shadow-apple-hover hover:border-wire transition-all duration-200"
  >
    <div className="relative h-44 bg-cloud overflow-hidden">
      {blog.coverImage ? (
        <Image
          src={blog.coverImage}
          alt={blog.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-ash opacity-50">
            {"No cover image"}
          </span>
        </div>
      )}
    </div>

    <div className="p-4 flex flex-col gap-2 flex-1">
      {blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {blog.tags.slice(0, 2).map(({ tag }) => (
            <span
              key={tag.slug}
              className="text-xs font-medium text-ink bg-ink/10 border border-wire/20 px-2 py-0.5 rounded-md"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <h3 className="text-sm font-semibold text-ink line-clamp-2 group-hover:text-ink/80 transition-colors leading-snug">
        {blog.title}
      </h3>

      <p className="text-xs text-ash line-clamp-2 leading-relaxed flex-1">
        {blog.excerpt}
      </p>

      <div className="flex items-center gap-2 pt-2 border-t border-wire mt-1">
        <span className="text-xs text-ash">{formatDate(blog.publishedAt)}</span>
        {blog.publishedAt && (
          <>
            <span className="text-fog">·</span>
            <span className="text-xs text-ash">
              {estimateReadTime(blog.excerpt)}
            </span>
          </>
        )}
      </div>
    </div>
  </Link>
);

export default BlogCard;
