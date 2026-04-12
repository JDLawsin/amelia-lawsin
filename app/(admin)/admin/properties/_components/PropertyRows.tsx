"use client";

import Image from "next/image";
import clsx from "clsx";
import { Badge } from "@/components/ui/shadcn/badge";
import { TableCell, TableRow } from "@/components/ui/shadcn/table";
import { STATUS_LABELS, STATUS_VARIANT, TYPE_LABELS } from "@/constants";
import { PropertyAdminListItem } from "@/services/property.admin.service";
import RowActions from "./RowActions";

const PropertyRows = ({
  properties,
}: {
  properties: PropertyAdminListItem[];
}) => (
  <>
    {properties.map((property) => {
      const imageUrl = property.images[0]?.url ?? null;
      const location = [property.barangay, property.city]
        .filter(Boolean)
        .join(", ");
      const isDeleted = !!property.deletedAt;

      return (
        <TableRow
          key={property.id}
          className={clsx(
            "hover:bg-cloud/40 transition-colors border-b border-wire/50 last:border-0",
            isDeleted && "opacity-50",
          )}
        >
          <TableCell className="py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cloud rounded-lg overflow-hidden shrink-0 border border-wire">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={property.title}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[8px] text-fog">No img</span>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink line-clamp-1">
                  {property.title}
                </p>
                {location && (
                  <p className="text-xs text-ash mt-0.5 line-clamp-1">
                    {location}
                  </p>
                )}
                {isDeleted && (
                  <p className="text-[10px] text-destructive mt-0.5">Deleted</p>
                )}
              </div>
            </div>
          </TableCell>

          <TableCell className="hidden md:table-cell">
            <span className="text-xs text-ash">
              {TYPE_LABELS[property.type] ?? property.type}
            </span>
          </TableCell>

          <TableCell>
            <Badge variant={STATUS_VARIANT[property.status] ?? "outline"}>
              {STATUS_LABELS[property.status]}
            </Badge>
          </TableCell>

          <TableCell className="hidden lg:table-cell">
            <span className="text-sm text-ink">
              {property.priceLabel ? (
                property.priceLabel
              ) : property.price ? (
                `₱${property.price.toLocaleString()}`
              ) : (
                <span className="text-fog">—</span>
              )}
            </span>
          </TableCell>

          <TableCell>
            <RowActions property={property} />
          </TableCell>
        </TableRow>
      );
    })}
  </>
);

export default PropertyRows;
