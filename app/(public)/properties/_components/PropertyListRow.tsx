// app/(public)/properties/_components/PropertyListRow.tsx

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { MapPin } from "lucide-react";
import { PropertyListItem } from "@/services/property.service";
import { STATUS_LABELS, STATUS_STYLES } from "@/constants";

type PropertyListRowProps = {
  property: PropertyListItem;
};

const formatPrice = (property: PropertyListItem): string => {
  if (property.priceLabel) return property.priceLabel;
  if (!property.price) return "Price on request";
  if (property.status === "FOR_RENT") {
    return `₱${property.price.toLocaleString()}/mo`;
  }
  return `₱${property.price.toLocaleString()}`;
};

const getPrimaryImage = (images: PropertyListItem["images"]) =>
  images.find((i) => i.isPrimary)?.url ?? images[0]?.url ?? null;

const PropertyListRow = ({ property }: PropertyListRowProps) => {
  const imageUrl = getPrimaryImage(property.images);
  const price = formatPrice(property);
  const location = [property.barangay, property.city]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group flex gap-4 bg-white rounded-xl border border-wire p-3 hover:border-wire hover:shadow-sm transition-all duration-200"
    >
      <div className="relative w-28 h-20 shrink-0 rounded-lg overflow-hidden bg-cloud">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] text-ash opacity-40">No photo</span>
          </div>
        )}
        {property.isFeatured && (
          <div className="absolute top-1.5 left-1.5">
            <span className="text-[8px] font-medium bg-ink text-white px-1.5 py-0.5 rounded uppercase tracking-wide">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-ink transition-colors">
              {property.title}
            </p>
            <span className="text-base font-serif font-medium text-ink shrink-0">
              {price}
            </span>
          </div>

          {location && (
            <div className="flex items-center gap-1 text-xs text-ash mt-0.5">
              <MapPin className="w-3 h-3 shrink-0" />
              {location}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3 text-xs text-ash">
            {property.bedrooms != null && (
              <span>
                {property.bedrooms === 0
                  ? "Studio"
                  : `${property.bedrooms} bed`}
              </span>
            )}
            {property.bathrooms != null && (
              <span>· {property.bathrooms} bath</span>
            )}
            {property.floorArea != null && (
              <span>· {property.floorArea}sqm</span>
            )}
            {property.lotArea != null && !property.floorArea && (
              <span>· {property.lotArea}sqm lot</span>
            )}
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5">
            <span
              className={clsx(
                "text-[9px] font-medium px-2 py-0.5 rounded-md",
                STATUS_STYLES[property.status],
              )}
            >
              {STATUS_LABELS[property.status]}
            </span>
            {property.isPagibigAccredited && (
              <span className="text-[9px] px-2 py-0.5 rounded-md bg-ink/8 text-ink border border-wire/25">
                Pag-IBIG
              </span>
            )}
            {property.isRentToOwn && (
              <span className="text-[9px] px-2 py-0.5 rounded-md bg-ink/8 text-ink border border-wire/25">
                Rent-to-Own
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyListRow;
