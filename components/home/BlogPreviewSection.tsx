import Link from "next/link";
import BlogCard from "../ui/BlogCard";
import { BlogPreviewItem } from "@/services/blog.service";
import SectionLabel from "@/components/ui/SectionLabel";
import { ctaSecondary } from "@/components/ui/cta";

type Props = {
  blogs: BlogPreviewItem[];
};

const BlogPreviewSection = ({ blogs }: Props) => {
  if (!blogs.length) return null;

  return (
    <section className="py-14 px-6 bg-cloud border-b border-wire">
      <div className="max-w-7xl mx-auto">
        <SectionLabel>Latest from the blog</SectionLabel>
        <h2 className="text-2xl md:text-3xl font-serif font-medium text-ink tracking-tight leading-snug text-center mb-10">
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
