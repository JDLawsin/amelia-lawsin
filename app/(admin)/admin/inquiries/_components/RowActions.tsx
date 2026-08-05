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
import { InquiryAdminListItem } from "@/services/inquiry.admin.service";
import {
  markInquiryAsReadAction,
  markInquiryAsRespondedAction,
  archiveInquiryAction,
  deleteInquiryAction,
} from "@/actions/inquiry.action";
import { toast } from "react-hot-toast";

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

const RowActions = ({ inquiry }: { inquiry: InquiryAdminListItem }) => {
  const [pending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleMarkRead = () =>
    startTransition(async () => {
      const result = await markInquiryAsReadAction(inquiry.id, !inquiry.isRead);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });

  const handleMarkResponded = () =>
    startTransition(async () => {
      const result = await markInquiryAsRespondedAction(inquiry.id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });

  const handleArchive = () =>
    startTransition(async () => {
      const result = await archiveInquiryAction(
        inquiry.id,
        !inquiry.isArchived,
      );

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });

  const handleDelete = () =>
    startTransition(async () => {
      const result = await deleteInquiryAction(inquiry.id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });

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
          <ActionItem tooltip="Open inquiry details" asChild>
            <Link href={`/admin/inquiries/${inquiry.id}`}>View</Link>
          </ActionItem>

          <ActionItem
            tooltip={
              inquiry.isRead
                ? "Mark this inquiry as unread"
                : "Mark this inquiry as read"
            }
            onSelect={handleMarkRead}
            disabled={pending}
          >
            {inquiry.isRead ? "Mark as unread" : "Mark as read"}
          </ActionItem>

          <ActionItem
            tooltip="Mark that you've replied to this inquiry"
            onSelect={handleMarkResponded}
            disabled={pending || inquiry.status === "CONTACTED"}
          >
            Mark as responded
          </ActionItem>

          <ActionItem
            tooltip={
              inquiry.isArchived
                ? "Move back to active inquiries"
                : "Hide from the active list"
            }
            onSelect={handleArchive}
            disabled={pending}
          >
            {inquiry.isArchived ? "Unarchive" : "Archive"}
          </ActionItem>

          <DropdownMenuSeparator />

          <ActionItem
            tooltip="Permanently delete this inquiry"
            variant="destructive"
            disabled={pending}
            onSelect={() => setDeleteOpen(true)}
          >
            Delete
          </ActionItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this inquiry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the inquiry from {inquiry.name}. It
              cannot be undone.
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
