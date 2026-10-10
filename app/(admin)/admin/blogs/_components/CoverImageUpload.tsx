"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { MAX_SIZE, ALLOWED_TYPES } from "@/constants";
import { compressImage } from "@/lib/image/compressImage";
import clsx from "clsx";

type Props = {
  value?: File;
  onChange: (file?: File) => void;
  existingUrl?: string | null;
  error?: string;
};

const CoverImageUpload = ({ value, onChange, existingUrl, error }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const objectUrl = useMemo(() => {
    if (!value) return null;
    return URL.createObjectURL(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const previewUrl = objectUrl ?? existingUrl ?? null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsCompressing(true);
    try {
      const compressed = await compressImage(file, { preset: "blog" });
      onChange(compressed);
    } finally {
      setIsCompressing(false);
    }
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
        disabled={isCompressing}
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
            disabled={isCompressing}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isCompressing}
          className={clsx(
            "w-full rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-2 transition-colors",
            error
              ? "border-destructive bg-destructive/5"
              : "border-wire bg-cloud hover:border-ink/30",
            isCompressing && "opacity-70 cursor-wait",
          )}
        >
          {isCompressing ? (
            <Loader2 className="w-6 h-6 text-fog animate-spin" />
          ) : (
            <Upload className="w-6 h-6 text-fog" />
          )}
          <p className="text-sm text-ink font-medium">
            {isCompressing ? "Optimizing image…" : "Upload cover image"}
          </p>
          <p className="text-xs text-ash">JPEG, PNG, or WebP up to 5MB</p>
        </button>
      )}

      {error && <p className="text-[10px] text-destructive">{error}</p>}
    </div>
  );
};

export default CoverImageUpload;
