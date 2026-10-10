"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { PropertyListItem } from "@/services/property.service";
import { formatPrice, getPrimaryImage } from "@/lib/utils";
import { STATUS_LABELS, STATUS_STYLES } from "@/constants";
import { PROPERTY_CARD_IMAGE_WIDTH } from "@/lib/image-layout";

type RelatedPropertiesProps = {
  properties: PropertyListItem[];
};

const RelatedPropertyCard = ({
  property,
  className,
}: {
  property: PropertyListItem;
  className?: string;
}) => {
  const imageUrl = getPrimaryImage(property.images, {
    width: PROPERTY_CARD_IMAGE_WIDTH,
    quality: "auto",
  });
  const location = [property.barangay, property.city]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={`/properties/${property.slug}`}
      className={clsx(
        "group bg-white border border-wire rounded-xl overflow-hidden hover:shadow-apple hover:border-wire/60 transition-all duration-200 motion-reduce:transition-none block",
        className,
      )}
    >
      <div className="relative h-24 bg-cloud overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300 motion-reduce:group-hover:scale-100 motion-reduce:transition-none"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] text-ash">No photo</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span
            className={clsx(
              "text-[9px] font-medium px-2 py-0.5 rounded-md",
              STATUS_STYLES[property.status],
            )}
          >
            {STATUS_LABELS[property.status]}
          </span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-serif font-medium text-ink leading-snug mb-1 tabular-nums">
          {formatPrice(property)}
        </p>
        <p className="text-xs text-ink line-clamp-1 mb-1 font-medium">
          {property.title}
        </p>
        {location && (
          <div className="flex items-center gap-1 text-[10px] text-ash">
            <MapPin className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
            {location}
          </div>
        )}
        {(property.bedrooms != null || property.floorArea != null) && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-wire">
            {property.bedrooms != null && (
              <span className="text-xs text-ash">
                {property.bedrooms === 0
                  ? "Studio"
                  : `${property.bedrooms} bed`}
              </span>
            )}
            {property.floorArea != null && (
              <span className="text-xs text-ash">
                · {property.floorArea}sqm
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

const RelatedProperties = ({ properties }: RelatedPropertiesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!properties.length) return null;

  const scrollByCard = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = container.clientWidth * 0.78;
    container.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div
        ref={scrollRef}
        className="sm:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none touch-manipulation motion-reduce:snap-none pb-2"
        aria-label="Related properties"
      >
        {properties.map((property) => (
          <RelatedPropertyCard
            key={property.id}
            property={property}
            className="snap-start shrink-0 w-[78vw] max-w-xs"
          />
        ))}
      </div>
      <div className="sm:hidden flex justify-center gap-2 mt-2 mb-2">
        <button
          type="button"
          onClick={() => scrollByCard("left")}
          aria-label="Scroll related properties left"
          className="w-11 h-11 flex items-center justify-center rounded-full border border-wire bg-white text-ink hover:bg-cloud transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard("right")}
          aria-label="Scroll related properties right"
          className="w-11 h-11 flex items-center justify-center rounded-full border border-wire bg-white text-ink hover:bg-cloud transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div className="hidden sm:grid sm:grid-cols-3 gap-4">
        {properties.map((property) => (
          <RelatedPropertyCard key={property.id} property={property} />
        ))}
      </div>
    </>
  );
};

export default RelatedProperties;
