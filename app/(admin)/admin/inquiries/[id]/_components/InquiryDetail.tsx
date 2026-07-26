"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MailOpen,
  Mail,
  CheckCircle,
  Archive,
  ArchiveRestore,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/shadcn/button";
import { Badge } from "@/components/ui/shadcn/badge";
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
import { Textarea } from "@/components/ui/shadcn/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { InquiryAdminDetail } from "@/services/inquiry.admin.service";
import {
  INQUIRY_STATUS_LABELS,
  INQUIRY_STATUS_VARIANTS,
} from "@/constants";
import { formatDate } from "@/lib/utils";
import {
  markInquiryAsReadAction,
  markInquiryAsRespondedAction,
  archiveInquiryAction,
  deleteInquiryAction,
  updateInquiryNotesAction,
} from "@/actions/inquiry.action";
import { toast } from "react-hot-toast";

const MAX_NOTES_LENGTH = 5000;

type Props = {
  inquiry: InquiryAdminDetail;
};

const InquiryDetail = ({ inquiry }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [notes, setNotes] = useState(inquiry.notes ?? "");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const status = inquiry.isArchived ? "archived" : inquiry.status;

  const runAction = async (action: () => Promise<{ success: boolean; message: string }>) => {
    startTransition(async () => {
      const result = await action();

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleMarkRead = () =>
    runAction(() => markInquiryAsReadAction(inquiry.id, !inquiry.isRead));

  const handleMarkResponded = () =>
    runAction(() => markInquiryAsRespondedAction(inquiry.id));

  const handleArchive = () =>
    runAction(() => archiveInquiryAction(inquiry.id, !inquiry.isArchived));

  const handleDelete = () =>
    startTransition(async () => {
      const result = await deleteInquiryAction(inquiry.id);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/inquiries");
      } else {
        toast.error(result.message);
      }
    });

  const handleSaveNotes = () =>
    runAction(() => updateInquiryNotesAction(inquiry.id, notes));

  const handleCancelNotes = () => {
    setNotes(inquiry.notes ?? "");
    setIsEditingNotes(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="text-ash hover:text-ink">
          <Link href="/admin/inquiries">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to inquiries
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-medium text-ink">{inquiry.name}</h1>
          <Badge variant={INQUIRY_STATUS_VARIANTS[status]}>
            {INQUIRY_STATUS_LABELS[status]}
          </Badge>
          {!inquiry.isRead && (
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700">
              Unread
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkRead}
            disabled={pending}
          >
            {inquiry.isRead ? (
              <MailOpen className="w-4 h-4 mr-1.5" />
            ) : (
              <Mail className="w-4 h-4 mr-1.5" />
            )}
            {inquiry.isRead ? "Mark unread" : "Mark read"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkResponded}
            disabled={pending || inquiry.status === "CONTACTED"}
          >
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Responded
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleArchive}
            disabled={pending}
          >
            {inquiry.isArchived ? (
              <ArchiveRestore className="w-4 h-4 mr-1.5" />
            ) : (
              <Archive className="w-4 h-4 mr-1.5" />
            )}
            {inquiry.isArchived ? "Unarchive" : "Archive"}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={pending}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this inquiry?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove the inquiry from {inquiry.name}.
                  It cannot be undone.
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-ink">
                Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-ash whitespace-pre-wrap">
                {inquiry.message}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-ink">
                Notes
              </CardTitle>
              {!isEditingNotes && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingNotes(true)}
                >
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditingNotes ? (
                <div className="flex flex-col gap-3">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add private notes about this inquiry..."
                    rows={5}
                    className="resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <span
                      className={clsx(
                        "text-xs",
                        notes.length > MAX_NOTES_LENGTH
                          ? "text-destructive"
                          : "text-ash",
                      )}
                    >
                      {notes.length}/{MAX_NOTES_LENGTH}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelNotes}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveNotes}
                        disabled={
                          pending || notes.length > MAX_NOTES_LENGTH
                        }
                      >
                        Save notes
                      </Button>
                    </div>
                  </div>
                </div>
              ) : inquiry.notes ? (
                <p className="text-sm text-ash whitespace-pre-wrap">
                  {inquiry.notes}
                </p>
              ) : (
                <p className="text-sm text-ash italic">No notes yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-ink">
                Contact info
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-ash">Email</p>
                <a
                  href={`mailto:${inquiry.email}`}
                  className="text-sm text-ink hover:underline"
                >
                  {inquiry.email}
                </a>
              </div>
              {inquiry.phone && (
                <div>
                  <p className="text-xs text-ash">Phone</p>
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="text-sm text-ink hover:underline"
                  >
                    {inquiry.phone}
                  </a>
                </div>
              )}
              <div>
                <p className="text-xs text-ash">Received</p>
                <p className="text-sm text-ink">
                  {formatDate(inquiry.createdAt)}
                </p>
              </div>
              {inquiry.respondedAt && (
                <div>
                  <p className="text-xs text-ash">Responded</p>
                  <p className="text-sm text-ink">
                    {formatDate(inquiry.respondedAt)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-ink">
                Property interest
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {inquiry.propertyTitle ? (
                <>
                  <div>
                    <p className="text-xs text-ash">Title</p>
                    {inquiry.propertySlug ? (
                      <Link
                        href={`/properties/${inquiry.propertySlug}`}
                        target="_blank"
                        className="text-sm text-ink hover:underline font-medium"
                      >
                        {inquiry.propertyTitle}
                      </Link>
                    ) : (
                      <p className="text-sm text-ink font-medium">
                        {inquiry.propertyTitle}
                      </p>
                    )}
                  </div>
                  {inquiry.propertyType && (
                    <div>
                      <p className="text-xs text-ash">Type</p>
                      <p className="text-sm text-ink">
                        {inquiry.propertyType}
                      </p>
                    </div>
                  )}
                  {inquiry.propertyPrice && (
                    <div>
                      <p className="text-xs text-ash">Price</p>
                      <p className="text-sm text-ink">
                        {inquiry.propertyPrice}
                      </p>
                    </div>
                  )}
                  {inquiry.propertyLocation && (
                    <div>
                      <p className="text-xs text-ash">Location</p>
                      <p className="text-sm text-ink">
                        {inquiry.propertyLocation}
                      </p>
                    </div>
                  )}
                  {inquiry.propertyStatus && (
                    <div>
                      <p className="text-xs text-ash">Status</p>
                      <p className="text-sm text-ink">
                        {inquiry.propertyStatus}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-ash italic">
                  No property selected.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-ink">
                Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-ink">{inquiry.source}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetail;
