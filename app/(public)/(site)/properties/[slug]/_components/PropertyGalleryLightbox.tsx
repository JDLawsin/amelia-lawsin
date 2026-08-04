"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import type { GalleryImage } from "./PropertyGalleryGrid";

type Props = {
  images: GalleryImage[];
  title: string;
  activeIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

const PropertyGalleryLightbox = ({
  images,
  title,
  activeIndex,
  onClose,
  onIndexChange,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const prev = () =>
    onIndexChange(activeIndex === 0 ? images.length - 1 : activeIndex - 1);

  const next = () =>
    onIndexChange(activeIndex === images.length - 1 ? 0 : activeIndex + 1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo gallery for ${title}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
        aria-label="Close gallery"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {activeIndex + 1} / {images.length}
      </div>

      {images.length > 1 && (
        <button
          type="button"
          onClick={prev}
          className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      )}

      <div className="relative w-full max-w-4xl max-h-[80vh] mx-16">
        <Image
          src={images[activeIndex].url}
          alt={images[activeIndex].caption ?? title}
          width={1200}
          height={800}
          className="object-contain w-full h-full max-h-[80vh]"
        />
        {images[activeIndex].caption && (
          <p className="text-white/50 text-xs text-center mt-3">
            {images[activeIndex].caption}
          </p>
        )}
      </div>

      {images.length > 1 && (
        <button
          type="button"
          onClick={next}
          className="absolute right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          aria-label="Next photo"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => onIndexChange(i)}
              className={clsx(
                "w-12 h-8 rounded overflow-hidden border-2 transition-all",
                i === activeIndex
                  ? "border-white opacity-100"
                  : "border-transparent opacity-40 hover:opacity-70",
              )}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === activeIndex ? "true" : undefined}
            >
              <Image
                src={img.url}
                alt=""
                width={48}
                height={32}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyGalleryLightbox;
