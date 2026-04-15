"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import clsx from "clsx";

type Props = {
  value: string[];
  onValueChange: (urls: string[]) => void;
  onFilesSelected?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  errors?: string[];
  hint?: string;
};

const MultiImageUpload = ({
  value = [],
  onValueChange,
  onFilesSelected,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024,
  errors,
  hint,
}: Props) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>(value);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file),
      );

      setPreviewUrls((prev) => [...prev, ...newPreviews]);
      onFilesSelected?.(acceptedFiles);

      // Optional: auto-upload logic can go here later
    },
    [onFilesSelected],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: maxFiles - value.length,
    maxSize,
  });

  const removeImage = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    onValueChange(previewUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
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
          Drag & drop images here, or click to select
        </p>
        <p className="text-xs text-fog mt-1">
          PNG, JPG, WebP up to 5MB each (max {maxFiles})
        </p>
      </div>

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Preview ${index}`}
                className="w-full aspect-square object-cover rounded-xl border border-wire"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {errors?.length && (
        <p className="text-xs text-destructive">{errors[0]}</p>
      )}
      {hint && <p className="text-xs text-fog">{hint}</p>}
    </div>
  );
};

export default MultiImageUpload;
