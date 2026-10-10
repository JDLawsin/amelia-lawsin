"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { PropertyListItem } from "@/services/property.service";
import { formatPrice, getPrimaryImage } from "@/lib/utils";
import {
  PROPERTY_CARD_COMPACT_IMAGE_SIZES,
  PROPERTY_CARD_IMAGE_WIDTH,
} from "@/lib/image-layout";
import { getPropertyTypeMapMeta } from "@/lib/property-type-map";
import { getPropertyTypeIcon } from "@/lib/property-type-icons";
import { STATUS_LABELS, STATUS_STYLES } from "@/constants";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { CompareButton } from "@/components/tools/CompareButton";
import { cn } from "@/lib/utils";

type MapPropertyPreviewCardProps = {
  property: PropertyListItem;
  onClose: () => void;
};

const MapPropertyPreviewCard = ({
  property,
  onClose,
}: MapPropertyPreviewCardProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const imageUrl = getPrimaryImage(property.images, {
    width: PROPERTY_CARD_IMAGE_WIDTH,
    quality: "auto",
  });
  const location = [property.barangay, property.city].filter(Boolean).join(", ");
  const bedsBaths = [
    property.bedrooms != null ? `${property.bedrooms} bd` : null,
    property.bathrooms != null ? `${property.bathrooms} ba` : null,
    property.floorArea != null ? `${property.floorArea} sqm` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const typeMeta = getPropertyTypeMapMeta(property.type);
  const TypeIcon = getPropertyTypeIcon(property.type);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="w-full max-w-md lg:w-96 lg:max-w-none">
      <div className="bg-white border border-wire rounded-lg shadow-apple overflow-hidden">
        <div className="relative h-32 bg-cloud">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              sizes={PROPERTY_CARD_COMPACT_IMAGE_SIZES}
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-ash">
              No photo yet
            </div>
          )}
          <div className="absolute top-1.5 right-1.5 flex gap-1">
            <FavoriteButton slug={property.slug} size="sm" />
            <CompareButton slug={property.slug} size="sm" />
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute top-1.5 left-1.5 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 border border-wire text-ash hover:text-ink shadow-apple-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            aria-label="Close preview"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          {property.isFeatured && (
            <span className="absolute bottom-1.5 left-1.5 text-[9px] font-medium px-1.5 py-0.5 rounded bg-ink text-white">
              Featured
            </span>
          )}
        </div>
        <div className="p-2 flex flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-ink tabular-nums truncate">
              {formatPrice(property)}
            </p>
            <span
              className={cn(
                "shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded",
                STATUS_STYLES[property.status],
              )}
            >
              {STATUS_LABELS[property.status]}
            </span>
          </div>
          <h3 className="text-xs font-medium text-ink line-clamp-1 leading-snug">
            {property.title}
          </h3>
          <p className="flex items-center gap-1 text-[10px] text-ash min-w-0">
            <span
              className="flex shrink-0 items-center justify-center w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: typeMeta.accent }}
            >
              <TypeIcon
                className="w-2 h-2 text-white"
                strokeWidth={2.25}
                aria-hidden="true"
              />
            </span>
            <span className="truncate">{typeMeta.label}</span>
            {bedsBaths && (
              <span className="truncate text-fog">· {bedsBaths}</span>
            )}
          </p>
          {location && (
            <p className="text-[10px] text-fog truncate">{location}</p>
          )}
          <Link
            href={`/properties/${property.slug}`}
            className="text-[11px] font-medium text-ink underline-offset-2 hover:underline mt-0.5 inline-flex items-center min-h-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded"
          >
            View property
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MapPropertyPreviewCard;
