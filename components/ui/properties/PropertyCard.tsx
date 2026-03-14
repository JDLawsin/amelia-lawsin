import { cn, formatPrice, getPrimaryImage } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { STATUS_LABELS, STATUS_STYLES } from "@/constants";
import { PropertyListItem } from "@/services/property.service";

const PropertyCard = ({ property }: { property: PropertyListItem }) => {
  const imageUrl = getPrimaryImage(property.images);
  const price = formatPrice(property);
  const location = [property.barangay, property.city]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block bg-white rounded-xl border border-brand-green-muted overflow-hidden hover:shadow-md hover:border-brand-green transition-all duration-200"
    >
      <div className="relative h-52 bg-brand-green-muted overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-brand-green-light opacity-50">
              {"No photo yet"}
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {property.isFeatured && (
            <span className="text-xs font-medium px-2 py-1 rounded-md bg-brand-gold text-white">
              {"Featured"}
            </span>
          )}
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-md ml-auto",
              STATUS_STYLES[property.status],
            )}
          >
            {STATUS_LABELS[property.status]}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-brand-green line-clamp-1 group-hover:text-brand-green/80 transition-colors">
          {property.title}
        </h3>

        {location && (
          <p className="text-xs text-brand-green-light">{location}</p>
        )}

        <p className="text-base font-semibold text-brand-gold mt-1">{price}</p>

        {(property.bedrooms || property.bathrooms || property.floorArea) && (
          <div className="flex items-center gap-3 pt-1 border-t border-brand-green-muted mt-1">
            {property.bedrooms != null && (
              <span className="text-xs text-brand-green-light">
                {property.bedrooms} {"bed"}
              </span>
            )}
            {property.bathrooms != null && (
              <span className="text-xs text-brand-green-light">
                · {property.bathrooms} {"bath"}
              </span>
            )}
            {property.floorArea != null && (
              <span className="text-xs text-brand-green-light">
                {"·"} {property.floorArea}
                {"sqm"}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default PropertyCard;
