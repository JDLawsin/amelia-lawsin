"use client";

import { cn, formatPrice, getPrimaryImage } from "@/lib/utils";
import {
  PROPERTY_CARD_COMPACT_IMAGE_SIZES,
  PROPERTY_CARD_IMAGE_SIZES,
  PROPERTY_CARD_IMAGE_WIDTH,
} from "@/lib/image-layout";
import Link from "next/link";
import Image from "next/image";
import { STATUS_LABELS, STATUS_STYLES } from "@/constants";
import { PropertyListItem } from "@/services/property.service";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { CompareButton } from "@/components/tools/CompareButton";
import clsx from "clsx";

type Props = {
  property: PropertyListItem;
  className?: string;
  loading?: "eager" | "lazy";
  priority?: boolean;
  variant?: "default" | "compact";
};

const PropertyCard = ({
  property,
  className,
  loading = "lazy",
  priority = false,
  variant = "default",
}: Props) => {
  const isCompact = variant === "compact";
  const imageUrl = getPrimaryImage(property.images, {
    width: PROPERTY_CARD_IMAGE_WIDTH,
    quality: "auto",
  });
  const price = formatPrice(property);
  const location = [property.barangay, property.city]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className={clsx(
        "group relative block bg-white border border-wire overflow-hidden shadow-apple hover:shadow-apple-hover hover:border-wire transition-[box-shadow,border-color] duration-200 motion-reduce:transition-none h-full",
        isCompact ? "rounded-xl" : "rounded-2xl",
        className,
      )}
    >
      <div
        className={clsx(
          "absolute z-20 flex flex-col gap-1.5",
          isCompact ? "top-2 right-2" : "top-3 right-3",
        )}
      >
        <FavoriteButton
          slug={property.slug}
          size="sm"
          className="max-sm:w-10 max-sm:h-10 shadow-apple-sm"
        />
        <CompareButton
          slug={property.slug}
          size="sm"
          className="max-sm:w-10 max-sm:h-10 shadow-apple-sm"
        />
      </div>
      <Link href={`/properties/${property.slug}`} className="block h-full">
        <div
          className={clsx(
            "relative overflow-hidden bg-cloud",
            isCompact ? "aspect-[3/2]" : "aspect-[4/3]",
          )}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              sizes={
                isCompact
                  ? PROPERTY_CARD_COMPACT_IMAGE_SIZES
                  : PROPERTY_CARD_IMAGE_SIZES
              }
              priority={priority}
              fetchPriority={priority ? "high" : undefined}
              loading={priority ? "eager" : loading}
              className="object-cover group-hover:scale-105 transition-transform duration-300 motion-reduce:group-hover:scale-100 motion-reduce:transition-none"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs text-ash opacity-50">
                {"No photo yet"}
              </span>
            </div>
          )}

          {property.isFeatured && (
            <span
              className={clsx(
                "absolute top-2 left-2 text-xs font-medium px-2 py-1 rounded-md bg-ink text-white",
                isCompact && "text-[10px] px-1.5 py-0.5",
              )}
            >
              {"Featured"}
            </span>
          )}
          <span
            className={cn(
              "absolute bottom-2 left-2 text-xs font-medium px-2 py-1 rounded-md",
              isCompact && "text-[10px] px-1.5 py-0.5",
              STATUS_STYLES[property.status],
            )}
          >
            {STATUS_LABELS[property.status]}
          </span>
        </div>

        <div
          className={clsx(
            "flex flex-col",
            isCompact ? "p-2.5 gap-0.5" : "p-4 gap-1.5",
          )}
        >
          {isCompact ? (
            <>
              <p className="text-sm font-semibold text-ink tabular-nums">
                {price}
              </p>
              <h3 className="text-xs font-medium text-ink line-clamp-1 group-hover:text-ink/80 transition-colors">
                {property.title}
              </h3>
              {location && (
                <p className="text-[10px] text-ash line-clamp-1">{location}</p>
              )}
            </>
          ) : (
            <>
              <h3 className="text-sm font-semibold text-ink line-clamp-1 group-hover:text-ink/80 transition-colors">
                {property.title}
              </h3>
              {location && <p className="text-xs text-ash">{location}</p>}
              <p className="text-base font-semibold text-ink mt-1 tabular-nums">
                {price}
              </p>
              {(property.bedrooms ||
                property.bathrooms ||
                property.floorArea) && (
                <div className="flex items-center gap-3 pt-1 mt-1">
                  {property.bedrooms != null && (
                    <span className="text-xs text-ash">
                      {property.bedrooms} {"bed"}
                    </span>
                  )}
                  {property.bathrooms != null && (
                    <span className="text-xs text-ash">
                      · {property.bathrooms} {"bath"}
                    </span>
                  )}
                  {property.floorArea != null && (
                    <span className="text-xs text-ash">
                      {"·"} {property.floorArea}
                      {"sqm"}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
