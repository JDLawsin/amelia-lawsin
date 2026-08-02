import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import { BlogAdminListItem } from "@/services/blog.admin.service";
import BlogRows from "./BlogRows";

const COLUMNS: DataTableColumn[] = [
  { key: "blog", label: "Blog", className: "w-[45%]" },
  { key: "status", label: "Status" },
  { key: "publishedAt", label: "Publish date", className: "hidden md:table-cell" },
  { key: "actions", label: "Actions", className: "text-right" },
];

type Props = {
  blogs: BlogAdminListItem[];
  total: number;
  page: number;
  pageSize: number;
};

const Blogs = ({ blogs, total, page, pageSize }: Props) => (
  <DataTable
    columns={COLUMNS}
    isEmpty={blogs.length === 0}
    page={page}
    pageSize={pageSize}
    total={total}
    paginationLabel="posts"
  >
    <BlogRows blogs={blogs} />
  </DataTable>
);

export default Blogs;
