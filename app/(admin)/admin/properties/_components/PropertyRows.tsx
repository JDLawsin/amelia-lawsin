"use client";

import Image from "next/image";
import clsx from "clsx";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/shadcn/badge";
import ClickableTableRow, {
  ClickableTableCell,
  TableRowActionsCell,
} from "@/components/ui/ClickableTableRow";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";
import {
  PROPERTY_VISIBILITY_LABELS,
  PROPERTY_VISIBILITY_STYLES,
  STATUS_LABELS,
  STATUS_VARIANT,
  TYPE_LABELS,
} from "@/constants";
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
      const visibility = isDeleted
        ? "deleted"
        : property.isPublished
          ? "published"
          : "draft";

      return (
        <ClickableTableRow
          key={property.id}
          href={`/admin/properties/${property.slug}/update`}
          className={clsx(
            "hover:bg-cloud/40 transition-colors border-b border-wire/50 last:border-0",
            isDeleted && "opacity-50",
          )}
        >
          <ClickableTableCell className="py-3" primary>
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
                <div className="flex items-center gap-1.5 min-w-0">
                  <p className="text-sm font-medium text-ink line-clamp-1">
                    {property.title}
                  </p>
                  {property.isFeatured && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="shrink-0 text-amber-500"
                          aria-label="Featured listing"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Featured listing</TooltipContent>
                    </Tooltip>
                  )}
                </div>
                {location && (
                  <p className="text-xs text-ash mt-0.5 line-clamp-1">
                    {location}
                  </p>
                )}
              </div>
            </div>
          </ClickableTableCell>

          <ClickableTableCell className="hidden md:table-cell">
            <span className="text-xs text-ash">
              {TYPE_LABELS[property.type] ?? property.type}
            </span>
          </ClickableTableCell>

          <ClickableTableCell>
            <Badge className={PROPERTY_VISIBILITY_STYLES[visibility]}>
              {PROPERTY_VISIBILITY_LABELS[visibility]}
            </Badge>
          </ClickableTableCell>

          <ClickableTableCell className="hidden sm:table-cell">
            <Badge variant={STATUS_VARIANT[property.status] ?? "outline"}>
              {STATUS_LABELS[property.status]}
            </Badge>
          </ClickableTableCell>

          <ClickableTableCell className="hidden lg:table-cell">
            <span className="text-sm text-ink">
              {property.priceLabel ? (
                property.priceLabel
              ) : property.price ? (
                `₱${property.price.toLocaleString()}`
              ) : (
                <span className="text-fog">—</span>
              )}
            </span>
          </ClickableTableCell>

          <TableRowActionsCell>
            <RowActions property={property} />
          </TableRowActionsCell>
        </ClickableTableRow>
      );
    })}
  </>
);

export default PropertyRows;
