"use client";

import { useCallback, useMemo, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Upload, X, Star, ChevronUp, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { ALLOWED_TYPES, MAX_FILES, MAX_SIZE } from "@/constants";
import { compressImage } from "@/lib/image/compressImage";

export type ImageItem = {
  id?: string;
  file?: File;
  url?: string;
  caption?: string;
  order: number;
  isPrimary: boolean;
};

type Props = {
  items: ImageItem[];
  onChange: (items: ImageItem[]) => void;
  onDeleteExisting: (id: string) => void;
  maxFiles?: number;
  maxSize?: number;
};

const ImageItemsEditor = ({
  items,
  onChange,
  onDeleteExisting,
  maxFiles = MAX_FILES,
  maxSize = MAX_SIZE,
}: Props) => {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remainingSlots = maxFiles - items.length;
      if (remainingSlots <= 0) return;

      const filesToAdd = acceptedFiles.slice(0, remainingSlots);
      const compressed = await Promise.all(
        filesToAdd.map((file) => compressImage(file)),
      );

      const newItems: ImageItem[] = compressed.map((file, index) => ({
        file,
        caption: "",
        order: items.length + index,
        isPrimary: false,
      }));

      const nextItems = [...items, ...newItems];
      ensureSinglePrimary(nextItems);
      onChange(nextItems);
    },
    [items, maxFiles, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": ALLOWED_TYPES },
    multiple: true,
    maxSize,
  });

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.order - b.order),
    [items],
  );

  const updateItem = (index: number, patch: Partial<ImageItem>) => {
    const nextItems = [...items];
    nextItems[index] = { ...nextItems[index], ...patch };

    if (patch.isPrimary) {
      ensureSinglePrimary(nextItems);
    }

    onChange(nextItems);
  };

  const removeItem = (index: number) => {
    const item = sortedItems[index];
    const nextItems = items.filter(
      (i) =>
        !(i.id === item.id && i.id !== undefined) &&
        !(i.file === item.file && i.file !== undefined),
    );

    if (item.id) {
      onDeleteExisting(item.id);
    }

    const reordered = nextItems.map((item, idx) => ({
      ...item,
      order: idx,
    }));
    ensureSinglePrimary(reordered);
    onChange(reordered);
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sortedItems.length) return;

    const reordered = [...sortedItems];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);

    const normalized = reordered.map((item, idx) => ({
      ...item,
      order: idx,
    }));
    onChange(normalized);
  };

  const setPrimary = (index: number) => {
    const target = sortedItems[index];
    const nextItems = items.map((item) => ({
      ...item,
      isPrimary:
        (item.id !== undefined && item.id === target.id) ||
        (item.file !== undefined && item.file === target.file),
    }));
    onChange(nextItems);
  };

  return (
    <div className="space-y-4">
      {items.length < maxFiles && (
        <div
          {...getRootProps()}
          className={clsx(
            "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-ink bg-ink/5"
              : "border-wire hover:border-ink/50",
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-10 w-10 text-ash mb-4" />
          <p className="text-sm font-medium text-ink">
            Drag & drop images, or click
          </p>
          <p className="text-xs text-fog mt-1">
            Max {maxFiles} files, {Math.round(maxSize / 1024 / 1024)}MB each.
          </p>
        </div>
      )}

      {sortedItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedItems.map((item, sortedIndex) => {
            const originalIndex = items.findIndex(
              (i) =>
                (i.id !== undefined && i.id === item.id) ||
                (i.file !== undefined && i.file === item.file),
            );

            return (
              <div
                key={item.id ?? item.file?.name ?? sortedIndex}
                className="relative flex flex-col gap-2 rounded-xl border border-wire bg-white p-3"
              >
                <div className="relative group aspect-square rounded-xl overflow-hidden border border-wire">
                  <ImagePreview item={item} />

                  {item.isPrimary && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Primary
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeItem(sortedIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <Input
                  value={item.caption ?? ""}
                  onChange={(e) =>
                    updateItem(originalIndex, { caption: e.target.value })
                  }
                  placeholder="Caption"
                  className="h-9 rounded-xl bg-cloud border-wire text-sm"
                />

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={sortedIndex === 0}
                      onClick={() => moveItem(sortedIndex, -1)}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={sortedIndex === sortedItems.length - 1}
                      onClick={() => moveItem(sortedIndex, 1)}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {!item.isPrimary && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setPrimary(sortedIndex)}
                      className="text-xs"
                    >
                      Set as Primary
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ensureSinglePrimary = (items: ImageItem[]) => {
  const primaryIndex = items.findIndex((item) => item.isPrimary);

  if (primaryIndex === -1 && items.length > 0) {
    items[0].isPrimary = true;
    return;
  }

  items.forEach((item, index) => {
    item.isPrimary = index === primaryIndex;
  });
};

const ImagePreview = ({ item }: { item: ImageItem }) => {
  const objectUrl = useMemo(() => {
    if (!item.file) return null;
    return URL.createObjectURL(item.file);
  }, [item.file]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const src = item.url ?? objectUrl;

  if (!src) {
    return <div className="w-full h-full bg-cloud animate-pulse" />;
  }

  return (
    <Image
      src={src}
      alt={item.caption || "Property image"}
      fill
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      className="object-cover"
    />
  );
};

export default ImageItemsEditor;
