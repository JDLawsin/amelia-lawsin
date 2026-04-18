"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import clsx from "clsx";
import { ALLOWED_TYPES, MAX_FILES } from "@/constants";
import { FieldError } from "react-hook-form";

type Props = {
  value: File[];
  onValueChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  errors?: FieldError;
  hint?: string;
};

const MultiImageUpload = ({
  value = [],
  onValueChange,
  maxFiles = MAX_FILES,
  errors,
  hint,
}: Props) => {
  const isArrayError = Array.isArray(errors);
  const rootError = !isArrayError ? errors?.message : null;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // 1. Prevent duplicates by comparing name and size
      const newFiles = acceptedFiles.filter((file) => {
        return !value.some(
          (existing) =>
            existing.name === file.name && existing.size === file.size,
        );
      });

      // 2. Merge existing files with new unique files
      const updatedFiles = [...value, ...newFiles];

      // 3. Update React Hook Form
      onValueChange(updatedFiles);
    },
    [value, onValueChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": ALLOWED_TYPES },
    multiple: true,
  });

  const removeImage = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onValueChange(updated);
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
          rootError && "border-destructive bg-destructive/5",
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-10 w-10 text-ash mb-4" />
        <p className="text-sm font-medium text-ink">
          Drag & drop images, or click
        </p>
        <p className="text-xs text-fog mt-1">Max {maxFiles} files, 5MB each.</p>
      </div>

      {rootError && (
        <p className="text-xs text-destructive font-semibold">{rootError}</p>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((file, index) => {
            const fileError = isArrayError ? errors[index]?.message : null;

            return (
              <div
                key={`${file.name}-${index}`}
                className="flex flex-col gap-1.5"
              >
                <div
                  className={clsx(
                    "relative group rounded-xl overflow-hidden border transition-all",
                    fileError
                      ? "border-destructive ring-1 ring-destructive"
                      : "border-wire",
                  )}
                >
                  <PreviewImage file={file} />
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

                {fileError && (
                  <p className="text-[10px] text-destructive font-bold leading-tight px-1">
                    {fileError}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {hint && !rootError && <p className="text-xs text-fog">{hint}</p>}
    </div>
  );
};

const PreviewImage = ({ file }: { file: File }) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof file === "string") {
      setUrl(file);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!url)
    return (
      <div className="w-full aspect-square bg-muted rounded-xl animate-pulse" />
    );

  return (
    <img
      src={url}
      alt="preview"
      className="w-full aspect-square object-cover rounded-xl border"
    />
  );
};

export default MultiImageUpload;
