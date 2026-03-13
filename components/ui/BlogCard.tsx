import Link from "next/link";
import { BlogPreviewItem } from "../home/BlogPreviewSection";
import Image from "next/image";
import { estimateReadTime, formatDate } from "@/lib/utils";

const BlogCard = ({ blog }: { blog: BlogPreviewItem }) => (
  <Link
    href={`/blog/${blog.slug}`}
    className="group flex flex-col bg-white rounded-xl border border-brand-green-muted overflow-hidden hover:shadow-md hover:border-brand-green transition-all duration-200"
  >
    <div className="relative h-44 bg-brand-green-muted overflow-hidden">
      {blog.coverImage ? (
        <Image
          src={blog.coverImage}
          alt={blog.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-brand-green-light opacity-50">
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
              className="text-xs font-medium text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-2 py-0.5 rounded-md"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <h3 className="text-sm font-semibold text-brand-green line-clamp-2 group-hover:text-brand-green/80 transition-colors leading-snug">
        {blog.title}
      </h3>

      <p className="text-xs text-brand-green-light line-clamp-2 leading-relaxed flex-1">
        {blog.excerpt}
      </p>

      <div className="flex items-center gap-2 pt-2 border-t border-brand-green-muted mt-1">
        <span className="text-xs text-brand-green-light">
          {formatDate(blog.publishedAt)}
        </span>
        {blog.publishedAt && (
          <>
            <span className="text-brand-green-muted">·</span>
            <span className="text-xs text-brand-green-light">
              {estimateReadTime(blog.excerpt)}
            </span>
          </>
        )}
      </div>
    </div>
  </Link>
);

export default BlogCard;
