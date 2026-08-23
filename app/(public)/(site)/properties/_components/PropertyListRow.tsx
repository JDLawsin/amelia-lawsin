import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { MapPin } from "lucide-react";
import { PropertyListItem } from "@/services/property.service";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { CompareButton } from "@/components/tools/CompareButton";
import { STATUS_LABELS, STATUS_STYLES } from "@/constants";
import { getPrimaryImage } from "@/lib/utils";
import { PROPERTY_CARD_IMAGE_WIDTH } from "@/lib/image-layout";

type PropertyListRowProps = {
  property: PropertyListItem;
  loading?: "eager" | "lazy";
};

const formatPrice = (property: PropertyListItem): string => {
  if (property.priceLabel) return property.priceLabel;
  if (!property.price) return "Price on request";
  if (property.status === "FOR_RENT") {
    return `₱${property.price.toLocaleString()}/mo`;
  }
  return `₱${property.price.toLocaleString()}`;
};

const PropertyListRow = ({
  property,
  loading = "lazy",
}: PropertyListRowProps) => {
  const imageUrl = getPrimaryImage(property.images, {
    width: PROPERTY_CARD_IMAGE_WIDTH,
    quality: "auto",
  });
  const price = formatPrice(property);
  const location = [property.barangay, property.city]
    .filter(Boolean)
    .join(", ");

  const hasSpecs =
    property.bedrooms != null ||
    property.bathrooms != null ||
    property.floorArea != null ||
    (property.lotArea != null && !property.floorArea);

  const financingTags = [
    property.isPagibigAccredited && "Pag-IBIG",
    property.isRentToOwn && "Rent-to-Own",
  ].filter(Boolean) as string[];

  return (
    <div
      className="group flex gap-2 bg-white rounded-xl border border-wire p-3 hover:border-wire hover:shadow-sm transition-[box-shadow,border-color] duration-200 motion-reduce:transition-none"
    >
      <Link
        href={`/properties/${property.slug}`}
        className="flex items-stretch gap-3 flex-1 min-w-0"
      >
        <div
          className="relative w-22 sm:w-28 shrink-0 self-stretch min-h-18 rounded-lg overflow-hidden bg-cloud"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              sizes="112px"
              loading={loading}
              className="object-cover group-hover:scale-105 transition-transform duration-300 motion-reduce:group-hover:scale-100 motion-reduce:transition-none"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] text-ash opacity-40">No photo</span>
            </div>
          )}
          {property.isFeatured && (
            <div className="absolute top-1 left-1">
              <span className="text-[8px] font-medium bg-ink text-white px-1.5 py-0.5 rounded uppercase tracking-wide">
                Featured
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="min-w-0">
            <p
              className="text-sm font-medium text-ink leading-snug line-clamp-2 sm:line-clamp-1 group-hover:text-ink/80 transition-colors"
            >
              {property.title}
            </p>
            <p className="text-base font-serif font-medium text-ink tabular-nums mt-0.5">
              {price}
            </p>
          </div>

          {location && (
            <div className="flex items-center gap-1 text-xs text-ash min-w-0">
              <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={clsx(
                "text-[10px] font-medium px-2 py-0.5 rounded-md whitespace-nowrap",
                STATUS_STYLES[property.status],
              )}
            >
              {STATUS_LABELS[property.status]}
            </span>
            {financingTags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap bg-ink/8 text-ink border border-wire/25"
              >
                {tag}
              </span>
            ))}
          </div>

          {hasSpecs && (
            <p className="text-xs text-ash leading-relaxed">
              {property.bedrooms != null && (
                <span>
                  {property.bedrooms === 0
                    ? "Studio"
                    : `${property.bedrooms} bed`}
                </span>
              )}
              {property.bathrooms != null && (
                <span>
                  {property.bedrooms != null ? " · " : ""}
                  {property.bathrooms} bath
                </span>
              )}
              {property.floorArea != null && (
                <span>
                  {(property.bedrooms != null || property.bathrooms != null)
                    ? " · "
                    : ""}
                  {property.floorArea} sqm
                </span>
              )}
              {property.lotArea != null && !property.floorArea && (
                <span>
                  {(property.bedrooms != null || property.bathrooms != null)
                    ? " · "
                    : ""}
                  {property.lotArea} sqm lot
                </span>
              )}
            </p>
          )}
        </div>
      </Link>
      <div className="flex flex-col items-center gap-1.5 shrink-0 self-start z-10">
        <FavoriteButton
          slug={property.slug}
          size="sm"
          className="w-11 h-11 shadow-apple-sm"
        />
        <CompareButton
          slug={property.slug}
          size="sm"
          className="w-11 h-11 shadow-apple-sm"
        />
      </div>
    </div>
  );
};

export default PropertyListRow;
