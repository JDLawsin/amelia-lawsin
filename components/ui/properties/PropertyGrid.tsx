import clsx from "clsx";
import PropertyCard from "./PropertyCard";
import { PropertyListItem } from "@/services/property.service";
import PropertyListRow from "./PropertyListRow";

type PropertyGridProps = {
  properties: PropertyListItem[];
  view: "grid" | "list";
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

const PropertyGrid = ({ properties, view }: PropertyGridProps) => {
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
      <div className="px-6 flex flex-col gap-2">
        {properties.map((property) => (
          <PropertyListRow key={property.id} property={property} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "px-6 grid gap-3 overflow-hidden",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {properties.map((property) => (
        <div key={property.id} className="bg-white h-full">
          <PropertyCard property={property} />
        </div>
      ))}
    </div>
  );
};

export default PropertyGrid;
