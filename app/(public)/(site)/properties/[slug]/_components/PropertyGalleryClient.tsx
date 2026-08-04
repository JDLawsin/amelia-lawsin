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
  initialIndex: number;
  initialOpen: boolean;
};

const PropertyGalleryClient = ({
  images,
  title,
  initialIndex,
  initialOpen,
}: Props) => {
  const [lightboxOpen, setLightboxOpen] = useState(initialOpen);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  if (!lightboxOpen) return null;

  return (
    <PropertyGalleryLightbox
      images={images}
      title={title}
      activeIndex={activeIndex}
      onClose={() => setLightboxOpen(false)}
      onIndexChange={setActiveIndex}
    />
  );
};

export default PropertyGalleryClient;
