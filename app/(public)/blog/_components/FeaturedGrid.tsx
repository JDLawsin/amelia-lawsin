import Link from "next/link";
import Image from "next/image";
import { BlogPreviewItem } from "@/services/blog.service";
import { estimateReadTime, formatDate } from "@/lib/utils";
import {
  BLOG_CARD_IMAGE_SIZES,
  BLOG_IMAGE_HEIGHT,
  BLOG_IMAGE_WIDTH,
} from "@/lib/image-layout";

type Props = {
  blogs: BlogPreviewItem[];
};

const FeaturedGrid = ({ blogs }: Props) => {
  if (blogs.length === 0) return null;

  const [main, ...rest] = blogs;

  return (
    <div>
      <h2 className="text-xs font-medium text-ash uppercase tracking-widest mb-4">
        Latest articles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Link
          href={`/blog/${main.slug}`}
          className="group md:col-span-2 relative block overflow-hidden rounded-2xl bg-cloud aspect-video md:aspect-[2/1]"
        >
          {main.coverImage && (
            <Image
              src={main.coverImage}
              alt={main.title}
              width={BLOG_IMAGE_WIDTH}
              height={BLOG_IMAGE_HEIGHT}
              sizes="(max-width: 768px) 100vw, 800px"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 z-10 p-5 w-full">
            {main.tags[0] && (
              <span className="inline-block bg-white text-ink text-[10px] font-medium px-2.5 py-1 rounded-full mb-3">
                {main.tags[0].tag.name}
              </span>
            )}
            <h3 className="text-lg font-serif font-medium text-white leading-snug mb-2 group-hover:text-white/90 transition-colors">
              {main.title}
            </h3>
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
                className="group relative block overflow-hidden rounded-xl bg-cloud aspect-video"
              >
                {blog.coverImage && (
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    width={BLOG_IMAGE_WIDTH}
                    height={BLOG_IMAGE_HEIGHT}
                    sizes={BLOG_CARD_IMAGE_SIZES}
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-10 p-3 w-full">
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
