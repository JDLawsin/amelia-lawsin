import Link from "next/link";
import BlogCard from "../ui/BlogCard";
import { BlogPreviewItem } from "@/services/blog.service";
import { ctaSecondary } from "@/components/ui/cta";

type Props = {
  blogs: BlogPreviewItem[];
};

const BlogPreviewSection = ({ blogs }: Props) => {
  if (!blogs.length) return null;

  return (
    <section className="border-b border-wire bg-cloud px-6 py-20 md:py-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="mx-auto mb-12 max-w-2xl text-center text-3xl font-serif font-medium leading-tight tracking-[-0.025em] text-ink md:text-4xl">
          Real estate tips, guides &amp; market insights
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        <div className="flex justify-center">
          <Link href="/blog" className={ctaSecondary}>
            Read all articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
