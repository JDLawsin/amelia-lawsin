"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyListItem } from "@/services/property.service";
import PropertyCard from "@/app/(public)/(site)/properties/_components/PropertyCard";

type Props = {
  properties: PropertyListItem[];
};

const FeaturedPropertiesSnapRow = ({ properties }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = container.clientWidth * 0.82;
    container.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="sm:hidden relative">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 touch-manipulation motion-reduce:snap-none -mx-1 px-1"
        aria-label="Featured property listings"
      >
        {properties.map((property, i) => (
          <div
            key={property.id}
            className="snap-start shrink-0 w-[82vw] max-w-sm"
          >
            <PropertyCard
              property={property}
              priority={i === 0}
              className="shadow-apple-lg"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-3">
        <button
          type="button"
          onClick={() => scrollByCard("left")}
          aria-label="Scroll featured listings left"
          className="w-11 h-11 flex items-center justify-center rounded-full border border-wire bg-white text-ink hover:bg-cloud transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard("right")}
          aria-label="Scroll featured listings right"
          className="w-11 h-11 flex items-center justify-center rounded-full border border-wire bg-white text-ink hover:bg-cloud transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default FeaturedPropertiesSnapRow;
