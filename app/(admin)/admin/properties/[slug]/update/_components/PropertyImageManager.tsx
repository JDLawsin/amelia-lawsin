// components/ui/PropertyImageManager.tsx
"use client";

import { useState } from "react";
import { X, GripVertical, Star } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import MultiImageUpload from "@/components/ui/MultiImageUpload";
import clsx from "clsx";

type ExistingImage = {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  order: number;
};

type Props = {
  existingImages: ExistingImage[];
  newFiles: File[];
  onNewFilesChange: (files: File[]) => void;
  onDeleteExisting?: (imageId: string) => void;
  onSetPrimary?: (imageId: string) => void;
  errors?: any;
};

const PropertyImageManager = ({
  existingImages = [],
  newFiles = [],
  onNewFilesChange,
  onDeleteExisting,
  onSetPrimary,
  errors,
}: Props) => {
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const handleDeleteExisting = (imageId: string) => {
    setDeletedIds((prev) => new Set([...prev, imageId]));
    onDeleteExisting?.(imageId);
  };

  const visibleExisting = existingImages.filter(
    (img) => !deletedIds.has(img.id),
  );

  return (
    <div className="space-y-6">
      {visibleExisting.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-ink mb-3">
            Current Images ({visibleExisting.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {visibleExisting.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-xl overflow-hidden border border-wire"
              >
                <img
                  src={image.url}
                  alt=""
                  className="w-full aspect-square object-cover"
                />

                {image.isPrimary && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Primary
                  </div>
                )}

                {/* Delete Button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteExisting(image.id)}
                >
                  <X className="h-4 w-4" />
                </Button>

                {!image.isPrimary && onSetPrimary && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    onClick={() => onSetPrimary(image.id)}
                  >
                    Set as Primary
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-ink mb-3">
          Upload New Images
          {newFiles.length > 0 && ` (${newFiles.length} selected)`}
        </h3>
        <MultiImageUpload
          value={newFiles}
          onValueChange={onNewFilesChange}
          errors={errors}
          maxFiles={10}
          hint="These will be uploaded when you save the property"
        />
      </div>

      {deletedIds.size > 0 && (
        <input
          type="hidden"
          name="deletedImageIds"
          value={JSON.stringify([...deletedIds])}
        />
      )}
    </div>
  );
};

export default PropertyImageManager;
