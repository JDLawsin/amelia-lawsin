import { getAllBlogTags } from "@/services/blog.service";
import CreateBlogContainer from "./_components/CreateBlogContainer";

const CreateBlogPage = async () => {
  const tags = await getAllBlogTags();

  return (
    <CreateBlogContainer
      allTags={tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      }))}
    />
  );
};

export default CreateBlogPage;
