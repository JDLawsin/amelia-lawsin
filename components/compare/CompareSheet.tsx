"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Check, Minus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/shadcn/sheet";
import { ComparePropertyItem } from "@/services/property.service";
import {
  STATUS_LABELS,
  STATUS_STYLES,
  TYPE_LABELS,
} from "@/constants";
import { useCompare } from "@/providers/CompareProvider";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useCompareProperties } from "@/lib/hooks/useCompareProperties";
import { cn, formatPrice, getPrimaryImage } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

const YesNo = ({ value }: { value: boolean }) =>
  value ? (
    <Check className="w-4 h-4 text-ink" aria-label="Yes" />
  ) : (
    <Minus className="w-4 h-4 text-fog" aria-label="No" />
  );

const RowLabel = ({ children }: { children: React.ReactNode }) => (
  <td className="p-3 bg-white sticky left-0 z-10 text-xs font-medium text-ash whitespace-nowrap border-b border-wire">
    {children}
  </td>
);

const RowValue = ({ children }: { children: React.ReactNode }) => (
  <td className="p-3 text-xs text-ink border-b border-wire align-top">
    {children}
  </td>
);

type RowConfig = {
  id: string;
  label: string;
  render: (property: ComparePropertyItem) => React.ReactNode;
};

const STATIC_ROW_LABELS = new Set([
  "Photo",
  "Price",
  "Status",
  "Type",
  "Location",
  "Bedrooms",
  "Bathrooms",
  "Floor area",
  "Lot area",
  "Parking",
  "Featured",
  "Pag-IBIG",
  "Bank financing",
  "In-house financing",
  "Rent-to-Own",
]);

const getCompareRows = (
  allAmenities: string[],
): RowConfig[] => [
  {
    id: "field-photo",
    label: "Photo",
    render: (property) => {
      const imageUrl = getPrimaryImage(property.images);
      return (
        <div className="relative w-full h-28 rounded-lg overflow-hidden bg-cloud">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              sizes="200px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] text-ash opacity-40">No photo</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "field-price",
    label: "Price",
    render: (property) => (
      <span className="font-serif font-medium text-base text-ink tabular-nums">
        {formatPrice(property)}
      </span>
    ),
  },
  {
    id: "field-status",
    label: "Status",
    render: (property) => (
      <span
        className={cn(
          "text-[10px] font-medium px-2 py-0.5 rounded-md",
          STATUS_STYLES[property.status],
        )}
      >
        {STATUS_LABELS[property.status]}
      </span>
    ),
  },
  {
    id: "field-type",
    label: "Type",
    render: (property) => TYPE_LABELS[property.type] ?? property.type,
  },
  {
    id: "field-location",
    label: "Location",
    render: (property) =>
      [property.barangay, property.city].filter(Boolean).join(", ") || "—",
  },
  {
    id: "field-bedrooms",
    label: "Bedrooms",
    render: (property) =>
      property.bedrooms != null
        ? property.bedrooms === 0
          ? "Studio"
          : property.bedrooms
        : "—",
  },
  {
    id: "field-bathrooms",
    label: "Bathrooms",
    render: (property) =>
      property.bathrooms != null ? property.bathrooms : "—",
  },
  {
    id: "field-floor-area",
    label: "Floor area",
    render: (property) =>
      property.floorArea != null ? `${property.floorArea} sqm` : "—",
  },
  {
    id: "field-lot-area",
    label: "Lot area",
    render: (property) =>
      property.lotArea != null ? `${property.lotArea} sqm` : "—",
  },
  {
    id: "field-parking",
    label: "Parking",
    render: (property) =>
      property.parking != null ? property.parking : "—",
  },
  {
    id: "field-featured",
    label: "Featured",
    render: (property) => <YesNo value={property.isFeatured} />,
  },
  {
    id: "field-pagibig",
    label: "Pag-IBIG",
    render: (property) => <YesNo value={property.isPagibigAccredited} />,
  },
  {
    id: "field-bank-financing",
    label: "Bank financing",
    render: (property) => <YesNo value={property.isBankFinancingReady} />,
  },
  {
    id: "field-inhouse-financing",
    label: "In-house financing",
    render: (property) => <YesNo value={property.isInHouseFinancing} />,
  },
  {
    id: "field-rent-to-own",
    label: "Rent-to-Own",
    render: (property) => <YesNo value={property.isRentToOwn} />,
  },
  ...allAmenities
    .filter((amenity) => !STATIC_ROW_LABELS.has(amenity))
    .map((amenity) => ({
      id: `amenity-${amenity}`,
      label: amenity,
      render: (property: ComparePropertyItem) => (
        <YesNo
          value={property.amenities.some((a) => a.amenity.name === amenity)}
        />
      ),
    })),
];

export const CompareSheet = ({ open, onClose }: Props) => {
  const { compareSlugs, clearCompare } = useCompare();
  const { properties, isPending, hasFetched } = useCompareProperties(
    open,
    compareSlugs,
  );
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const allAmenities = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((property) => {
      property.amenities.forEach((amenity) => set.add(amenity.amenity.name));
    });
    return Array.from(set).sort();
  }, [properties]);

  const rows = useMemo(
    () => getCompareRows(allAmenities),
    [allAmenities],
  );

  if (!open) return null;

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <SheetContent
        side={isDesktop ? "right" : "bottom"}
        showCloseButton={false}
        className="p-0 flex flex-col w-full overscroll-contain"
        style={{ maxWidth: isDesktop ? "900px" : "100%" }}
      >
        <div className="flex flex-col h-full max-h-[85vh] md:max-h-screen">
          <SheetHeader className="flex-row items-center justify-between border-b border-wire p-4 space-y-0">
            <SheetTitle className="text-base font-semibold text-ink">
              Compare Properties
            </SheetTitle>
            <SheetDescription className="sr-only">
              Side-by-side comparison of selected property features and amenities.
            </SheetDescription>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cloud text-ash hover:text-ink transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              <X className="w-4 h-4" />
            </button>
          </SheetHeader>

          <div className="flex-1 overflow-auto p-4">
            {isPending && !hasFetched ? (
              <div className="py-10 text-center text-sm text-ash">
                Loading comparison…
              </div>
            ) : properties.length < 2 ? (
              <div className="text-center py-10">
                <p className="text-sm text-ash">
                  Select at least 2 properties to compare.
                </p>
                <Link
                  href="/properties"
                  onClick={onClose}
                  className="inline-block mt-3 text-sm text-ink font-medium hover:underline"
                >
                  Browse Properties
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-3 bg-cloud font-medium text-ash sticky left-0 z-10 border-b border-wire min-w-[120px]">
                        Feature
                      </th>
                      {properties.map((property) => (
                        <th
                          key={property.slug}
                          className="p-3 min-w-[200px] text-left font-medium text-ink bg-cloud border-b border-wire align-top"
                        >
                          <Link
                            href={`/properties/${property.slug}`}
                            onClick={onClose}
                            className="hover:underline block line-clamp-2"
                          >
                            {property.title}
                          </Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-wire">
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <RowLabel>{row.label}</RowLabel>
                        {properties.map((property) => (
                          <RowValue key={`${property.slug}-${row.id}`}>
                            {row.render(property)}
                          </RowValue>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-wire flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                clearCompare();
                onClose();
              }}
              className="h-10 px-4 rounded-xl text-xs font-medium text-ash hover:text-ink hover:bg-cloud transition-colors cursor-pointer border border-wire focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              Clear All
            </button>
            <p className="text-xs text-ash tabular-nums">
              {compareSlugs.length} of 3 selected
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
