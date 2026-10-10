"use client";

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
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
} from "@/components/ui/shadcn/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
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

type ActionItemProps = {
  tooltip: string;
  disabled?: boolean;
  variant?: "default" | "destructive";
  onSelect?: () => void;
  children: ReactNode;
  asChild?: boolean;
};

const ActionItem = ({
  tooltip,
  disabled,
  variant,
  onSelect,
  children,
  asChild,
}: ActionItemProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <DropdownMenuItem
        asChild={asChild}
        disabled={disabled}
        variant={variant}
        onSelect={onSelect}
      >
        {children}
      </DropdownMenuItem>
    </TooltipTrigger>
    <TooltipContent side="left">{tooltip}</TooltipContent>
  </Tooltip>
);

const RowActions = ({ blog }: Props) => {
  const [pending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);
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
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={pending}
            className="text-fog hover:text-ink"
          >
            <MoreVertical className="w-4 h-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="min-w-44">
          {isDeleted ? (
            <ActionItem
              tooltip="Bring this post back from trash"
              onSelect={handleRestore}
              disabled={pending}
            >
              Restore
            </ActionItem>
          ) : (
            <>
              <ActionItem
                tooltip={
                  blog.isPublished
                    ? "Hide this post from the public site"
                    : "Make this post visible publicly"
                }
                onSelect={handleTogglePublish}
                disabled={pending}
              >
                {blog.isPublished ? "Unpublish" : "Publish"}
              </ActionItem>

              {blog.isPublished ? (
                <ActionItem tooltip="Open the public blog post" asChild>
                  <Link
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View public
                  </Link>
                </ActionItem>
              ) : null}

              <ActionItem tooltip="Edit post content and details" asChild>
                <Link href={`/admin/blogs/${blog.slug}/update`}>Edit</Link>
              </ActionItem>

              <DropdownMenuSeparator />

              <ActionItem
                tooltip="Move this post to trash"
                variant="destructive"
                disabled={pending}
                onSelect={() => setDeleteOpen(true)}
              >
                Delete
              </ActionItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
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
    </div>
  );
};

export default RowActions;
