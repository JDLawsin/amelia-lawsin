import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import clsx from "clsx";
import { PropertyListItem } from "@/services/property.service";
import { formatPrice } from "@/lib/utils";
import { STATUS_LABELS, STATUS_STYLES } from "@/constants";

type RelatedPropertiesProps = {
  properties: PropertyListItem[];
};

const RelatedProperties = ({ properties }: RelatedPropertiesProps) => {
  if (!properties.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {properties.map((property) => {
        const imageUrl =
          property.images.find((i: { isPrimary: boolean }) => i.isPrimary)
            ?.url ??
          property.images[0]?.url ??
          null;
        const location = [property.barangay, property.city]
          .filter(Boolean)
          .join(", ");

        return (
          <Link
            key={property.id}
            href={`/properties/${property.slug}`}
            className="group bg-white border border-wire rounded-xl overflow-hidden hover:shadow-apple hover:border-wire/60 transition-all duration-200"
          >
            <div className="relative h-24 bg-cloud overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] text-fog opacity-40">
                    No photo
                  </span>
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
              <p className="text-sm font-serif font-medium text-ink leading-snug mb-1">
                {formatPrice(property)}
              </p>
              <p className="text-xs text-ink line-clamp-1 mb-1 font-medium">
                {property.title}
              </p>
              {location && (
                <div className="flex items-center gap-1 text-[10px] text-ash">
                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                  {location}
                </div>
              )}
              {(property.bedrooms != null || property.floorArea != null) && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-wire">
                  {property.bedrooms != null && (
                    <span className="text-[10px] text-fog">
                      {property.bedrooms === 0
                        ? "Studio"
                        : `${property.bedrooms} bed`}
                    </span>
                  )}
                  {property.floorArea != null && (
                    <span className="text-[10px] text-fog">
                      · {property.floorArea}sqm
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default RelatedProperties;
