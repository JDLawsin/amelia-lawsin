import Link from "next/link";
import Image from "next/image";
import { BlogPreviewItem } from "@/services/blog.service";
import { estimateReadTime, formatDate } from "@/lib/utils";

type RelatedBlogsProps = {
  blogs: BlogPreviewItem[];
};

const RelatedBlogs = ({ blogs }: RelatedBlogsProps) => {
  if (!blogs.length) return null;

  return (
    <div>
      <h2 className="text-base font-serif font-medium text-ink mb-5">
        Related articles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.slug}`}
            className="group flex flex-col bg-white border border-wire rounded-xl overflow-hidden hover:shadow-apple hover:border-wire/60 transition-all duration-200"
          >
            <div className="relative h-28 bg-cloud overflow-hidden">
              {blog.coverImage ? (
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] text-fog opacity-40">
                    No cover
                  </span>
                </div>
              )}
            </div>
            <div className="p-3 flex flex-col gap-1.5 flex-1">
              {blog.tags[0] && (
                <span className="text-[10px] font-medium text-ash bg-cloud border border-wire px-2 py-0.5 rounded-full w-fit">
                  {blog.tags[0].tag.name}
                </span>
              )}
              <h3 className="text-xs font-medium text-ink leading-snug line-clamp-2 group-hover:text-ink/70 transition-colors">
                {blog.title}
              </h3>
              <div className="flex items-center gap-1.5 mt-auto pt-2">
                <span className="text-[10px] text-fog">
                  {formatDate(blog.publishedAt)}
                </span>
                <span className="text-wire text-[10px]">·</span>
                <span className="text-[10px] text-fog">
                  {estimateReadTime(blog.excerpt)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedBlogs;
