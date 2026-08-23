"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { PropertyListItem } from "@/services/property.service";
import { formatPrice, getPrimaryImage } from "@/lib/utils";
import { PROPERTY_CARD_COMPACT_IMAGE_SIZES, PROPERTY_CARD_IMAGE_WIDTH } from "@/lib/image-layout";

type MapPropertyPreviewCardProps = {
  property: PropertyListItem;
  onClose: () => void;
  placement?: "mobile" | "desktop";
};

const MapPropertyPreviewCard = ({
  property,
  onClose,
  placement = "mobile",
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
  ]
    .filter(Boolean)
    .join(" · ");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className={
        placement === "mobile"
          ? "absolute left-4 right-4 z-20 pointer-events-auto bottom-[calc(20vh+env(safe-area-inset-bottom,0px))]"
          : "absolute top-4 right-4 z-20 pointer-events-auto w-72 max-w-[calc(100%-2rem)]"
      }
    >
      <div className="bg-white border border-wire rounded-xl shadow-apple-lg overflow-hidden flex gap-3 p-3">
        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-cloud">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes={PROPERTY_CARD_COMPACT_IMAGE_SIZES}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-cloud" />
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-ink tabular-nums truncate">
              {formatPrice(property)}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-ash hover:text-ink hover:bg-cloud transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              aria-label="Close preview"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          {bedsBaths && (
            <p className="text-xs text-ash truncate">{bedsBaths}</p>
          )}
          {location && (
            <p className="text-xs text-fog truncate">{location}</p>
          )}
          <Link
            href={`/properties/${property.slug}`}
            className="text-xs font-medium text-ink underline-offset-2 hover:underline mt-0.5 min-h-11 inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded"
          >
            View property
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MapPropertyPreviewCard;
