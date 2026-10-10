"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { PropertyListItem } from "@/services/property.service";
import { STATUS_LABELS, STATUS_STYLES } from "@/constants";
import { cn, formatPrice, getPrimaryImage } from "@/lib/utils";
import { useFavorites } from "@/providers/FavoritesProvider";
import { PROPERTY_GALLERY_THUMB_WIDTH } from "@/lib/image-layout";

type Props = {
  property: PropertyListItem;
};

export const FavoritePropertyRow = ({ property }: Props) => {
  const { removeFavorite } = useFavorites();

  const imageUrl = getPrimaryImage(property.images, {
    width: PROPERTY_GALLERY_THUMB_WIDTH,
    quality: "auto",
  });
  const price = formatPrice(property);
  const location = [property.barangay, property.city]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="group relative flex gap-3 bg-white rounded-xl border border-wire p-2.5 hover:border-wire hover:shadow-sm transition-all duration-200">
      <Link
        href={`/properties/${property.slug}`}
        className="absolute inset-0 z-0 rounded-xl"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden bg-cloud z-10">
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

      <div className="flex-1 min-w-0 flex flex-col justify-center z-10">
        <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-ink transition-colors">
          {property.title}
        </p>
        {location && (
          <p className="text-xs text-ash mt-0.5 line-clamp-1">{location}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-serif font-medium text-ink tabular-nums">
            {price}
          </span>
          <span
            className={cn(
              "text-[9px] font-medium px-1.5 py-0.5 rounded-md",
              STATUS_STYLES[property.status],
            )}
          >
            {STATUS_LABELS[property.status]}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          removeFavorite(property.slug);
        }}
        aria-label="Remove from favorites"
        className="relative z-10 self-center w-7 h-7 flex items-center justify-center rounded-full hover:bg-cloud text-ash hover:text-ink transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
