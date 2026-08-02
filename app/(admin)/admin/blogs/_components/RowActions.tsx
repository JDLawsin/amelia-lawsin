"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, RotateCcw, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/shadcn/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";
import { BlogAdminListItem } from "@/services/blog.admin.service";
import {
  deleteBlogAction,
  restoreBlogAction,
  togglePublishBlogAction,
} from "@/actions/blog.action";
import { toast } from "react-hot-toast";

type Props = {
  blog: BlogAdminListItem;
};

const RowActions = ({ blog }: Props) => {
  const [pending, startTransition] = useTransition();
  const isDeleted = !!blog.deletedAt;

  const handleTogglePublish = () => {
    startTransition(async () => {
      const result = await togglePublishBlogAction(blog.id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteBlogAction(blog.id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleRestore = () => {
    startTransition(async () => {
      const result = await restoreBlogAction(blog.id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {!isDeleted && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleTogglePublish}
              disabled={pending}
              className={
                blog.isPublished
                  ? "text-ink hover:text-ash hover:bg-cloud"
                  : "text-fog hover:text-ink hover:bg-cloud"
              }
            >
              {blog.isPublished ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {blog.isPublished ? "Unpublish" : "Publish"}
          </TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={`/admin/blogs/${blog.slug}/update`}>
              <Pencil className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit</TooltipContent>
      </Tooltip>

      {isDeleted ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleRestore}
              disabled={pending}
              className="text-fog hover:text-ink hover:bg-cloud"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Restore</TooltipContent>
        </Tooltip>
      ) : (
        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={pending}
                  className="text-fog hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this blog post?</AlertDialogTitle>
              <AlertDialogDescription>
                {`${blog.title} will be moved to trash. You can restore it later.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default RowActions;
