"use client";

import { useTransition } from "react";
import Link from "next/link";
import {
  Eye,
  MailOpen,
  Mail,
  Archive,
  ArchiveRestore,
  CheckCircle,
  Trash2,
} from "lucide-react";
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
import { InquiryAdminListItem } from "@/services/inquiry.admin.service";
import {
  markInquiryAsReadAction,
  markInquiryAsRespondedAction,
  archiveInquiryAction,
  deleteInquiryAction,
} from "@/actions/inquiry.action";
import { toast } from "react-hot-toast";

const RowActions = ({ inquiry }: { inquiry: InquiryAdminListItem }) => {
  const [pending, startTransition] = useTransition();

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
    <div className="flex items-center justify-end gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={`/admin/inquiries/${inquiry.id}`}>
              <Eye className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>View</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleMarkRead}
            disabled={pending}
            className="text-fog hover:text-ink hover:bg-cloud"
          >
            {inquiry.isRead ? (
              <MailOpen className="w-3.5 h-3.5" />
            ) : (
              <Mail className="w-3.5 h-3.5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {inquiry.isRead ? "Mark as unread" : "Mark as read"}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleMarkResponded}
            disabled={pending || inquiry.status === "CONTACTED"}
            className="text-fog hover:text-emerald-600 hover:bg-emerald-50"
          >
            <CheckCircle className="w-3.5 h-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Mark as responded</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleArchive}
            disabled={pending}
            className="text-fog hover:text-amber-600 hover:bg-amber-50"
          >
            {inquiry.isArchived ? (
              <ArchiveRestore className="w-3.5 h-3.5" />
            ) : (
              <Archive className="w-3.5 h-3.5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {inquiry.isArchived ? "Unarchive" : "Archive"}
        </TooltipContent>
      </Tooltip>

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
            <AlertDialogTitle>Delete this inquiry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the inquiry from{" "}
              {inquiry.name}. It cannot be undone.
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
