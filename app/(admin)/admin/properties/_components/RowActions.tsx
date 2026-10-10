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
import { PropertyAdminListItem } from "@/services/property.admin.service";
import {
  deletePropertyAction,
  restorePropertyAction,
  toggleFeaturedAction,
  togglePublishPropertyAction,
} from "@/actions/property.action";
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

const RowActions = ({ property }: { property: PropertyAdminListItem }) => {
  const [pending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const isDeleted = !!property.deletedAt;

  const handleTogglePublish = () => {
    startTransition(async () => {
      const result = await togglePublishPropertyAction(property.id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleToggleFeatured = () => {
    startTransition(async () => {
      const result = await toggleFeaturedAction(
        property.id,
        property.isFeatured,
      );

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleDelete = () =>
    startTransition(async () => {
      const result = await deletePropertyAction(property.id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });

  const handleRestore = () =>
    startTransition(async () => {
      const result = await restorePropertyAction(property.id);

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
          {isDeleted ? (
            <ActionItem
              tooltip="Bring this listing back from trash"
              onSelect={handleRestore}
              disabled={pending}
            >
              Restore
            </ActionItem>
          ) : (
            <>
              <ActionItem
                tooltip={
                  property.isPublished
                    ? "Hide this listing from the public site"
                    : "Make this listing visible publicly"
                }
                onSelect={handleTogglePublish}
                disabled={pending}
              >
                {property.isPublished ? "Unpublish" : "Publish"}
              </ActionItem>

              <ActionItem
                tooltip={
                  property.isFeatured
                    ? "Hide from featured listings"
                    : "Show in featured listings"
                }
                onSelect={handleToggleFeatured}
                disabled={pending || !property.isPublished}
              >
                {property.isFeatured
                  ? "Remove from featured"
                  : "Mark as featured"}
              </ActionItem>

              {property.isPublished && property.slug ? (
                <ActionItem tooltip="Open the public listing page" asChild>
                  <Link
                    href={`/properties/${property.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View public
                  </Link>
                </ActionItem>
              ) : null}

              {property.slug ? (
                <ActionItem tooltip="Edit property details" asChild>
                  <Link href={`/admin/properties/${property.slug}/update`}>
                    Edit
                  </Link>
                </ActionItem>
              ) : null}

              <DropdownMenuSeparator />

              <ActionItem
                tooltip="Move this listing to trash"
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
            <AlertDialogTitle>Delete this property?</AlertDialogTitle>
            <AlertDialogDescription>
              {`${property.title} will be moved to trash. You can restore it later.`}
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
