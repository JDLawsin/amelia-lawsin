"use client";

import Image from "next/image";
import clsx from "clsx";
import { Badge } from "@/components/ui/shadcn/badge";
import { TableCell, TableRow } from "@/components/ui/shadcn/table";
import { BLOG_STATUS_LABELS, BLOG_STATUS_VARIANTS } from "@/constants";
import { BlogAdminListItem } from "@/services/blog.admin.service";
import { formatDate } from "@/lib/utils";
import RowActions from "./RowActions";

const BlogRows = ({ blogs }: { blogs: BlogAdminListItem[] }) => (
  <>
    {blogs.map((blog) => {
      const isDeleted = !!blog.deletedAt;
      const status = isDeleted ? "deleted" : blog.isPublished ? "published" : "draft";

      return (
        <TableRow
          key={blog.id}
          className={clsx(
            "hover:bg-cloud/40 transition-colors border-b border-wire/50 last:border-0",
            isDeleted && "opacity-50",
          )}
        >
          <TableCell className="py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cloud rounded-lg overflow-hidden shrink-0 border border-wire">
                {blog.coverImage ? (
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[8px] text-fog">No img</span>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink line-clamp-1">
                  {blog.title}
                </p>
                {blog.tags.length > 0 && (
                  <p className="text-xs text-ash mt-0.5 line-clamp-1">
                    {blog.tags.map(({ tag }) => tag.name).join(", ")}
                  </p>
                )}
                {isDeleted && (
                  <p className="text-[10px] text-destructive mt-0.5">Deleted</p>
                )}
              </div>
            </div>
          </TableCell>

          <TableCell>
            <Badge variant={BLOG_STATUS_VARIANTS[status] ?? "outline"}>
              {BLOG_STATUS_LABELS[status]}
            </Badge>
          </TableCell>

          <TableCell>
            <span className="text-xs text-ash">
              {blog.publishedAt ? formatDate(blog.publishedAt) : "—"}
            </span>
          </TableCell>

          <TableCell>
            <RowActions blog={blog} />
          </TableCell>
        </TableRow>
      );
    })}
  </>
);

export default BlogRows;
