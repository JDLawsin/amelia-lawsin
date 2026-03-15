"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

type GalleryImage = {
  url: string;
  caption?: string | null;
  isPrimary: boolean;
};

type Props = {
  images: GalleryImage[];
  title: string;
};

const PropertyGallery = ({ images, title }: Props) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const primary = images.find((i) => i.isPrimary) ?? images[0];
  const rest = images.filter((i) => i !== primary).slice(0, 2);
  const hasMore = images.length > 3;

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const prev = () =>
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  const next = () =>
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape") setLightboxOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-3 grid-rows-2 gap-0.5 h-85 px-6 max-w-7xl mx-auto w-full">
        <div
          className="col-span-2 row-span-2 relative bg-cloud rounded-l-2xl overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          {primary ? (
            <Image
              src={primary.url}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs text-fog">No photo</span>
            </div>
          )}
          <div className="absolute top-3 left-3 bg-black/40 text-white text-[10px] px-2 py-1 rounded-md">
            1 / {images.length}
          </div>
        </div>

        {rest.map((img, i) => (
          <div
            key={img.url}
            className={clsx(
              "relative bg-cloud overflow-hidden cursor-pointer group",
              i === 0 ? "rounded-tr-2xl" : "rounded-br-2xl",
            )}
            onClick={() => openLightbox(i + 1)}
          >
            <Image
              src={img.url}
              alt={`${title} photo ${i + 2}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}

        {rest.length === 0 && (
          <>
            <div className="relative bg-cloud rounded-tr-2xl overflow-hidden" />
            <div className="relative bg-cloud rounded-br-2xl overflow-hidden" />
          </>
        )}
        {rest.length === 1 && (
          <div className="relative bg-cloud rounded-br-2xl overflow-hidden" />
        )}

        {hasMore && (
          <button
            onClick={() => openLightbox(0)}
            className="absolute bottom-3 right-3 bg-white text-ink text-xs font-medium px-3 py-1.5 rounded-lg border border-wire shadow-apple-sm hover:shadow-apple transition-shadow"
            style={{ position: "absolute", bottom: "12px", right: "24px" }}
          >
            View all {images.length} photos
          </button>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {activeIndex + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
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
              onClick={next}
              className="absolute right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img.url}
                  onClick={() => setActiveIndex(i)}
                  className={clsx(
                    "w-12 h-8 rounded overflow-hidden border-2 transition-all",
                    i === activeIndex
                      ? "border-white opacity-100"
                      : "border-transparent opacity-40 hover:opacity-70",
                  )}
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
      )}
    </>
  );
};

export default PropertyGallery;
