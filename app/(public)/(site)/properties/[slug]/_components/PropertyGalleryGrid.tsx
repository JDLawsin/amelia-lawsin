import Image from "next/image";
import clsx from "clsx";
import {
  PROPERTY_GALLERY_PRIMARY_SIZES,
  PROPERTY_GALLERY_PRIMARY_WIDTH,
  PROPERTY_GALLERY_THUMB_SIZES,
  PROPERTY_GALLERY_THUMB_WIDTH,
} from "@/lib/image-layout";
import { cloudinaryDeliveryUrl } from "@/lib/cloudinary-url";

export type GalleryImage = {
  url: string;
  caption?: string | null;
  isPrimary: boolean;
};

type Props = {
  images: GalleryImage[];
  title: string;
};

const PropertyGalleryGrid = ({ images, title }: Props) => {
  const primary = images.find((i) => i.isPrimary) ?? images[0];
  const rest = images.filter((i) => i !== primary).slice(0, 2);
  const hasMore = images.length > 3;

  const primarySrc = cloudinaryDeliveryUrl(primary?.url, {
    width: PROPERTY_GALLERY_PRIMARY_WIDTH,
    quality: "auto:best",
  });

  return (
    <div
      data-property-gallery
      className="relative grid grid-cols-3 grid-rows-2 gap-0.5 aspect-[16/9] px-6 max-w-7xl mx-auto w-full"
    >
      <div className="col-span-2 row-span-2 relative">
        <button
          type="button"
          data-gallery-index={0}
          className="relative w-full h-full bg-cloud rounded-l-2xl overflow-hidden cursor-pointer group text-left p-0 border-0"
          aria-label={`View photo 1 of ${images.length}`}
        >
          {primarySrc ? (
            <Image
              src={primarySrc}
              alt={title}
              fill
              sizes={PROPERTY_GALLERY_PRIMARY_SIZES}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority
              fetchPriority="high"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs text-ash">No photo</span>
            </div>
          )}
        </button>
        <div
          aria-hidden="true"
          className="absolute top-3 left-3 bg-black/40 text-white text-[10px] px-2 py-1 rounded-md pointer-events-none"
        >
          1 / {images.length}
        </div>
      </div>

      {rest.map((img, i) => (
        <button
          key={img.url}
          type="button"
          data-gallery-index={i + 1}
          className={clsx(
            "relative bg-cloud overflow-hidden cursor-pointer group text-left p-0 border-0",
            i === 0 ? "rounded-tr-2xl" : "rounded-br-2xl",
          )}
          aria-label={`View photo ${i + 2} of ${images.length}`}
        >
          <Image
            src={
              cloudinaryDeliveryUrl(img.url, {
                width: PROPERTY_GALLERY_THUMB_WIDTH,
                quality: "auto",
              }) ?? img.url
            }
            alt={`${title} photo ${i + 2}`}
            fill
            sizes={PROPERTY_GALLERY_THUMB_SIZES}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </button>
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
          type="button"
          data-gallery-index={0}
          className="absolute bottom-3 right-6 bg-white text-ink text-xs font-medium px-3 py-1.5 rounded-lg border border-wire shadow-apple-sm hover:shadow-apple transition-shadow"
        >
          View all {images.length} photos
        </button>
      )}
    </div>
  );
};

export default PropertyGalleryGrid;
