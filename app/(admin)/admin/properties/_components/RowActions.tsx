"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, RotateCcw, Star } from "lucide-react";
import clsx from "clsx";
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
import { PropertyAdminListItem } from "@/services/property.admin.service";
import {
  deletePropertyAction,
  toggleFeaturedAction,
} from "@/actions/property.action";
import { toast } from "react-hot-toast";

const RowActions = ({ property }: { property: PropertyAdminListItem }) => {
  const [pending, startTransition] = useTransition();

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

  return (
    <div className="flex items-center justify-end gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleToggleFeatured}
            disabled={pending}
            className={clsx(
              property.isFeatured
                ? "text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                : "text-fog hover:text-amber-400 hover:bg-amber-50",
            )}
          >
            <Star
              className="w-3.5 h-3.5"
              fill={property.isFeatured ? "currentColor" : "none"}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {property.isFeatured ? "Remove from featured" : "Mark as featured"}
        </TooltipContent>
      </Tooltip>
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" asChild>
              <Link href={`/admin/properties/${property.id}`}>
                <Pencil className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
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
              <AlertDialogTitle>Delete this property?</AlertDialogTitle>
              <AlertDialogDescription>
                &ldquo;{property.title}&rdquo; will be deleted and can't be
                restored.
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
      </>
    </div>
  );
};

export default RowActions;
