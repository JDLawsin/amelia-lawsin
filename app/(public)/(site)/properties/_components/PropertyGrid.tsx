import { useEffect, useRef } from "react";
import clsx from "clsx";
import { PropertyListItem } from "@/services/property.service";
import type { PropertyBrowseView } from "@/lib/property-browse";
import PropertyListRow from "./PropertyListRow";
import PropertyCard from "./PropertyCard";

type PropertyGridProps = {
  properties: PropertyListItem[];
  view: PropertyBrowseView;
  highlightedSlug?: string | null;
  onPropertySelect?: (slug: string) => void;
  onPropertyHover?: (slug: string | null) => void;
};

const EmptyState = () => (
  <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
    <div className="w-14 h-14 rounded-full bg-cloud border border-wire flex items-center justify-center mb-4">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#5A7A64"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    </div>
    <p className="text-sm font-medium text-ink mb-1">No properties found</p>
    <p className="text-xs text-ash max-w-xs">
      Try adjusting your filters or search terms to find what you&apos;re
      looking for.
    </p>
  </div>
);

const PropertyGrid = ({
  properties,
  view,
  highlightedSlug,
  onPropertySelect,
  onPropertyHover,
}: PropertyGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastHighlighted = useRef<string | null>(null);

  useEffect(() => {
    if (!highlightedSlug || highlightedSlug === lastHighlighted.current) return;
    lastHighlighted.current = highlightedSlug;

    const container = containerRef.current;
    if (!container) return;

    const el = container.querySelector(
      `[data-property-slug="${highlightedSlug}"]`,
    );
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [highlightedSlug]);

  if (!properties.length) {
    return (
      <div className="px-6">
        <div className="grid grid-cols-3">
          <EmptyState />
        </div>
      </div>
    );
  }

  if (view === "list") {
    return (
      <>
        <h2 className="sr-only scroll-mt-24">Property listings</h2>
        <div
          ref={containerRef}
          className="px-6 flex flex-col gap-2 scroll-mt-24"
        >
          {properties.map((property, i) => (
            <div
              key={property.id}
              data-property-slug={property.slug}
              className={clsx(
                highlightedSlug === property.slug &&
                  "ring-2 ring-ink ring-offset-2 rounded-xl",
              )}
              onClick={() => onPropertySelect?.(property.slug)}
              onMouseEnter={() => onPropertyHover?.(property.slug)}
              onMouseLeave={() => onPropertyHover?.(null)}
            >
              <PropertyListRow
                property={property}
                loading={i === 0 ? "eager" : undefined}
              />
            </div>
          ))}
        </div>
      </>
    );
  }

  const isPhotos = view === "photos";

  return (
    <>
      <h2 className="sr-only scroll-mt-24">Property listings</h2>
      <div
        ref={containerRef}
        className={clsx(
          "px-6 grid overflow-hidden scroll-mt-24",
          isPhotos
            ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
        )}
      >
        {properties.map((property, i) => (
          <div
            key={property.id}
            data-property-slug={property.slug}
            className={clsx(
              "bg-white h-full",
              highlightedSlug === property.slug &&
                "ring-2 ring-ink ring-offset-2 rounded-xl",
            )}
            onClick={() => onPropertySelect?.(property.slug)}
            onMouseEnter={() => onPropertyHover?.(property.slug)}
            onMouseLeave={() => onPropertyHover?.(null)}
          >
            <PropertyCard
              property={property}
              loading={i === 0 ? "eager" : undefined}
              variant={isPhotos ? "compact" : "default"}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default PropertyGrid;
