import { cn, formatPrice, getPrimaryImage } from "@/lib/utils";
import {
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
};

const PropertyCard = ({
  property,
  className,
  loading = "lazy",
  priority = false,
}: Props) => {
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
        "group relative block bg-white rounded-2xl border border-wire overflow-hidden shadow-apple hover:shadow-apple-hover hover:border-wire transition-all duration-200 h-full",
        className,
      )}
    >
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
        <FavoriteButton slug={property.slug} size="sm" />
        <CompareButton slug={property.slug} size="sm" />
      </div>
      <Link href={`/properties/${property.slug}`} className="block h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-cloud">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              sizes={PROPERTY_CARD_IMAGE_SIZES}
              priority={priority}
              fetchPriority={priority ? "high" : undefined}
              loading={priority ? "eager" : loading}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs text-ash opacity-50">
                {"No photo yet"}
              </span>
            </div>
          )}

          {property.isFeatured && (
            <span className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-md bg-ink text-white">
              {"Featured"}
            </span>
          )}
          <span
            className={cn(
              "absolute bottom-3 left-3 text-xs font-medium px-2 py-1 rounded-md",
              STATUS_STYLES[property.status],
            )}
          >
            {STATUS_LABELS[property.status]}
          </span>
        </div>

        <div className="p-4 flex flex-col gap-1.5">
          <h3 className="text-sm font-semibold text-ink line-clamp-1 group-hover:text-ink/80 transition-colors">
            {property.title}
          </h3>

          {location && <p className="text-xs text-ash">{location}</p>}

          <p className="text-base font-semibold text-ink mt-1 tabular-nums">
            {price}
          </p>

          {(property.bedrooms || property.bathrooms || property.floorArea) && (
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
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
