import Link from "next/link";
import Image from "next/image";
import { BlogPreviewItem } from "@/services/blog.service";
import { estimateReadTime, formatDate } from "@/lib/utils";

type Props = {
  blogs: BlogPreviewItem[];
};

const FeaturedGrid = ({ blogs }: Props) => {
  if (blogs.length === 0) return null;

  const [main, ...rest] = blogs;

  return (
    <div>
      <p className="text-xs font-medium text-fog uppercase tracking-widest mb-4">
        Latest articles
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-auto md:h-70">
        <Link
          href={`/blog/${main.slug}`}
          className="group md:col-span-2 relative rounded-2xl overflow-hidden bg-cloud flex items-end min-h-50 md:min-h-0"
        >
          {main.coverImage && (
            <Image
              src={main.coverImage}
              alt={main.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

          <div className="relative z-10 p-5 w-full">
            {main.tags[0] && (
              <span className="inline-block bg-white text-ink text-[10px] font-medium px-2.5 py-1 rounded-full mb-3">
                {main.tags[0].tag.name}
              </span>
            )}
            <h2 className="text-lg font-serif font-medium text-white leading-snug mb-2 group-hover:text-white/90 transition-colors">
              {main.title}
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-white/55">
              <span>{formatDate(main.publishedAt)}</span>
              <span>·</span>
              <span>{estimateReadTime(main.excerpt)}</span>
              {main.isAiGenerated && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 inline-block" />
                    AI assisted
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>

        {rest.length > 0 && (
          <div className="flex flex-col gap-3">
            {rest.slice(0, 2).map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group relative rounded-xl overflow-hidden bg-cloud flex items-end flex-1 min-h-30"
              >
                {blog.coverImage && (
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                <div className="relative z-10 p-3 w-full">
                  {blog.tags[0] && (
                    <span className="inline-block bg-white text-ink text-[8px] font-medium px-2 py-0.5 rounded-full mb-2">
                      {blog.tags[0].tag.name}
                    </span>
                  )}
                  <h3 className="text-xs font-medium text-white leading-snug line-clamp-2 group-hover:text-white/90 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-[9px] text-white/50 mt-1">
                    {formatDate(blog.publishedAt)} ·{" "}
                    {estimateReadTime(blog.excerpt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedGrid;
