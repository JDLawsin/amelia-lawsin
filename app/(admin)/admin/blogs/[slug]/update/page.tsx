import { notFound } from "next/navigation";
import { getAdminBlogBySlug } from "@/services/blog.admin.service";
import { getAllBlogTags } from "@/services/blog.service";
import UpdateBlogContainer from "./_components/UpdateBlogContainer";

type Props = {
  params: Promise<{ slug: string }>;
};

const UpdateBlogPage = async ({ params }: Props) => {
  const { slug } = await params;
  const [blog, tags] = await Promise.all([
    getAdminBlogBySlug(slug),
    getAllBlogTags(),
  ]);

  if (!blog) notFound();

  return (
    <UpdateBlogContainer
      blog={blog}
      allTags={tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      }))}
    />
  );
};

export default UpdateBlogPage;
