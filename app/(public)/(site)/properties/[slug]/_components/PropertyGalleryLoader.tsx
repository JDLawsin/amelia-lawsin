"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import type { GalleryImage } from "./PropertyGalleryGrid";

type Props = {
  images: GalleryImage[];
  title: string;
};

type GalleryClientProps = Props & {
  initialIndex: number;
  initialOpen: boolean;
};

/** Loads the lightbox bundle only after the user clicks a gallery image. */
const PropertyGalleryLoader = ({ images, title }: Props) => {
  const [GalleryClient, setGalleryClient] = useState<
    ComponentType<GalleryClientProps> | null
  >(null);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest("[data-gallery-index]");
      if (!target?.closest("[data-property-gallery]")) return;

      event.preventDefault();
      const index = Number((target as HTMLElement).dataset.galleryIndex);
      if (Number.isNaN(index)) return;

      setPendingIndex(index);
    };

    document.addEventListener("click", handler, { capture: true });
    return () => document.removeEventListener("click", handler, { capture: true });
  }, []);

  useEffect(() => {
    if (pendingIndex === null || GalleryClient) return;

    import("./PropertyGalleryClient").then((mod) => {
      setGalleryClient(() => mod.default);
    });
  }, [pendingIndex, GalleryClient]);

  if (pendingIndex === null || !GalleryClient) return null;

  return (
    <GalleryClient
      images={images}
      title={title}
      initialIndex={pendingIndex}
      initialOpen
    />
  );
};

export default PropertyGalleryLoader;
