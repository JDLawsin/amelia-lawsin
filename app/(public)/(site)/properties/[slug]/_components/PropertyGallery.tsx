"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { GalleryImage } from "./PropertyGalleryGrid";

const PropertyGalleryLightbox = dynamic(
  () => import("./PropertyGalleryLightbox"),
  { ssr: false },
);

type Props = {
  images: GalleryImage[];
  title: string;
  children: React.ReactNode;
};

const PropertyGallery = ({ images, title, children }: Props) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest("[data-gallery-index]");
    if (!target) return;
    const index = Number((target as HTMLElement).dataset.galleryIndex);
    if (!Number.isNaN(index)) openLightbox(index);
  };

  return (
    <>
      <div onClick={handleGridClick}>{children}</div>

      {lightboxOpen && (
        <PropertyGalleryLightbox
          images={images}
          title={title}
          activeIndex={activeIndex}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setActiveIndex}
        />
      )}
    </>
  );
};

export default PropertyGallery;
