"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { ComparePropertyItem } from "@/services/property.service";
import { formatPrice, getPrimaryImage } from "@/lib/utils";
import { useCompare } from "@/providers/CompareProvider";
import { PROPERTY_GALLERY_THUMB_WIDTH } from "@/lib/image-layout";

type Props = {
  property: ComparePropertyItem;
};

export const ComparePropertyRow = ({ property }: Props) => {
  const { removeCompare } = useCompare();

  const imageUrl = getPrimaryImage(property.images, {
    width: PROPERTY_GALLERY_THUMB_WIDTH,
    quality: "auto",
  });
  const price = formatPrice(property);
  const location = [property.barangay, property.city]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="group flex gap-3 bg-white rounded-xl border border-wire p-2.5">
      <div className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden bg-cloud">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] text-ash opacity-40">No photo</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-sm font-medium text-foreground line-clamp-1">
          {property.title}
        </p>
        {location && (
          <p className="text-xs text-ash mt-0.5 line-clamp-1">{location}</p>
        )}
        <p className="text-sm font-serif font-medium text-ink mt-1 tabular-nums">
          {price}
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          removeCompare(property.slug);
        }}
        aria-label="Remove from compare"
        className="self-center w-7 h-7 flex items-center justify-center rounded-full hover:bg-cloud text-ash hover:text-ink transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
