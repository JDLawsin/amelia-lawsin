import Link from "next/link";
import type { Blog, BlogTag, TagsOnBlogs } from "@/app/generated/prisma/client";
import { Button } from "../ui/shadcn/button";
import BlogCard from "../ui/BlogCard";

export type BlogPreviewItem = Pick<
  Blog,
  "id" | "title" | "slug" | "excerpt" | "coverImage" | "publishedAt"
> & {
  tags: (TagsOnBlogs & {
    tag: Pick<BlogTag, "name" | "slug">;
  })[];
};

type Props = {
  blogs: BlogPreviewItem[];
};

const BlogPreviewSection = ({ blogs }: Props) => {
  if (!blogs.length) return null;

  return (
    <section className="py-14 px-4 bg-brand-green-subtle border-b border-brand-green-muted">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-2xl font-serif font-semibold text-brand-green">
            {"Latest from the Blog"}
          </h2>
          <div className="w-8 h-0.5 bg-brand-gold mt-2 mb-3" />
          <p className="text-sm text-brand-green-light">
            {"Real estate tips, guides & market insights"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            asChild
            variant="outline"
            className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition-colors"
          >
            <Link href="/blog">{"Read all articles"}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
