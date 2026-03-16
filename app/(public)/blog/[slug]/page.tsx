import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getBlogBySlug, getRelatedBlogs } from "@/services/blog.service";
import { SITE_CONFIG } from "@/constants";
import { estimateReadTime, formatDate } from "@/lib/utils";
import ShareButtons from "./_components/ShareButtons";
import TableOfContents from "./_components/TableOfContents";
import BlogContent from "./_components/BlogContent";
import RelatedBlogs from "./_components/RelatedBlogs";

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) return { title: "Article not found" };

  const title =
    blog.metaTitle ?? `${blog.title} | Amelia Lawsin Real Estate Blog`;
  const description = blog.metaDescription ?? blog.excerpt;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: blog.publishedAt?.toISOString(),
      authors: [SITE_CONFIG.name],
      images: blog.coverImage
        ? [{ url: blog.coverImage, alt: blog.title }]
        : [],
    },
  };
};

const BlogDetailPage = async ({ params }: Props) => {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  const relatedBlogs = await getRelatedBlogs(
    { id: blog.id, tags: blog.tags },
    3,
  );
  const readTime = estimateReadTime(blog.excerpt);
  const publishedDate = formatDate(blog.publishedAt);

  return (
    <main className="bg-white min-h-screen">
      <nav className="py-3 border-b border-wire flex items-center gap-2 max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-xs text-ash hover:text-ink transition-colors"
        >
          Home
        </Link>
        <span className="text-xs text-wire">/</span>
        <Link
          href="/blog"
          className="text-xs text-ash hover:text-ink transition-colors"
        >
          Blog
        </Link>
        <span className="text-xs text-wire">/</span>
        <span className="text-xs text-ink font-medium line-clamp-1">
          {blog.title}
        </span>
      </nav>

      <header className="max-w-7xl mx-auto px-6 pt-10 pb-8">
        <div className="w-full">
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {blog.tags.map(({ tag }) => (
                <Link
                  key={tag.slug}
                  href={`/blog?tag=${tag.slug}`}
                  className="h-7 px-3 flex items-center rounded-full text-xs font-medium border border-wire text-ash hover:border-ink hover:text-ink transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-serif font-medium text-ink leading-tight tracking-tight mb-4">
            {blog.title}
          </h1>

          <p className="text-base text-ash leading-relaxed mb-6">
            {blog.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-wire">
            {publishedDate && (
              <span className="text-sm text-ash">{publishedDate}</span>
            )}
            <span className="text-wire">·</span>
            <span className="text-sm text-ash">{readTime}</span>

            {blog.isAiGenerated && (
              <>
                <span className="text-wire">·</span>
                <div className="flex items-center gap-1.5 bg-cloud border border-wire rounded-md px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-fog inline-block" />
                  <span className="text-xs text-fog">AI assisted</span>
                </div>
              </>
            )}

            <div className="ml-auto">
              <ShareButtons title={blog.title} variant="inline" />
            </div>
          </div>
        </div>
      </header>

      {blog.coverImage && (
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <div className="relative w-full h-100 rounded-2xl overflow-hidden bg-cloud">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-0">
          <div className="py-2 lg:pr-12 lg:border-r lg:border-wire pb-12">
            <BlogContent content={blog.content} />

            {blog.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-wire">
                <p className="text-xs font-medium text-ink mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map(({ tag }) => (
                    <Link
                      key={tag.slug}
                      href={`/blog?tag=${tag.slug}`}
                      className="h-7 px-3 flex items-center rounded-full text-xs border border-wire text-ash hover:border-ink hover:text-ink transition-colors"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 bg-cloud rounded-2xl p-5 flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-ink flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-white">AL</span>
              </div>
              <div>
                <p className="text-sm font-medium text-ink mb-0.5">
                  {SITE_CONFIG.name}
                </p>
                <p className="text-xs text-ash mb-2">
                  Licensed Real Estate Agent · PRC Cebu
                </p>
                <p className="text-xs text-ash leading-relaxed">
                  10+ years helping buyers, OFWs, and investors find their dream
                  property in Cebu. Reach out for a free consultation.
                </p>
                <a
                  href={SITE_CONFIG.messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-ink hover:text-ash transition-colors"
                >
                  Contact Amelia →
                </a>
              </div>
            </div>
          </div>

          <div className="hidden lg:block py-2 pl-8">
            <div className="sticky top-18 flex flex-col gap-4">
              <TableOfContents content={blog.content} />

              <div className="bg-ink rounded-xl p-5">
                <p className="text-sm font-serif font-medium text-white leading-snug mb-2">
                  Looking for a property in Cebu?
                </p>
                <p className="text-xs text-white/50 mb-4 leading-relaxed">
                  Browse Amelia&apos;s listings — condos, houses, lots & more
                </p>
                <Link
                  href="/properties"
                  className="block w-full bg-white text-ink text-xs font-medium py-2.5 rounded-xl text-center hover:bg-white/90 transition-colors mb-2"
                >
                  Browse properties
                </Link>
                <a
                  href={SITE_CONFIG.messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-transparent text-white/60 text-xs font-medium py-2.5 rounded-xl text-center border border-white/20 hover:bg-white/10 transition-colors"
                >
                  Contact Amelia
                </a>
              </div>

              <ShareButtons title={blog.title} variant="sidebar" />
            </div>
          </div>
        </div>
      </div>

      {relatedBlogs.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="h-px bg-wire mb-10" />
          <RelatedBlogs blogs={relatedBlogs} />
        </div>
      )}

      <div className="bg-cloud border-t border-wire">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-base font-serif font-medium text-ink mb-1">
              Ready to find your dream property in Cebu?
            </p>
            <p className="text-sm text-ash">
              Let Amelia guide you — free consultation, no commitment required
            </p>
          </div>
          <a
            href={SITE_CONFIG.messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-ink text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-ink/90 transition-colors"
          >
            Message Amelia →
          </a>
        </div>
      </div>
    </main>
  );
};

export default BlogDetailPage;
