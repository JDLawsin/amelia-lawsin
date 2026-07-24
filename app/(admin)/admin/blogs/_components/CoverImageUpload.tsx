"use client";

import { useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { MAX_SIZE, ALLOWED_TYPES } from "@/constants";
import clsx from "clsx";

type Props = {
  value?: File;
  onChange: (file?: File) => void;
  existingUrl?: string | null;
  error?: string;
};

const CoverImageUpload = ({ value, onChange, existingUrl, error }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl = value ? URL.createObjectURL(value) : existingUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Please upload a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_SIZE) {
      alert("Image must be 5MB or less.");
      return;
    }

    onChange(file);
  };

  const handleRemove = () => {
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-wire bg-cloud group">
          <div className="relative w-full aspect-video">
            <Image
              src={previewUrl}
              alt="Cover preview"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={clsx(
            "w-full rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-2 transition-colors",
            error
              ? "border-destructive bg-destructive/5"
              : "border-wire bg-cloud hover:border-ink/30",
          )}
        >
          <Upload className="w-6 h-6 text-fog" />
          <p className="text-sm text-ink font-medium">Upload cover image</p>
          <p className="text-xs text-ash">JPEG, PNG, or WebP up to 5MB</p>
        </button>
      )}

      {error && <p className="text-[10px] text-destructive">{error}</p>}
    </div>
  );
};

export default CoverImageUpload;
