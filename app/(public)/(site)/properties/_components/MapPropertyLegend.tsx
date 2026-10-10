"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PropertyType } from "@/app/generated/prisma/enums";
import {
  PROPERTY_TYPE_MAP_META,
  PROPERTY_TYPE_MAP_ORDER,
} from "@/lib/property-type-map";
import { PROPERTY_TYPE_ICONS } from "@/lib/property-type-icons";

type MapPropertyLegendProps = {
  typeCounts: Record<PropertyType, number>;
  defaultOpen?: boolean;
  className?: string;
};

const MapPropertyLegend = ({
  typeCounts,
  defaultOpen = false,
  className,
}: MapPropertyLegendProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const mapTotal = PROPERTY_TYPE_MAP_ORDER.reduce(
    (sum, type) => sum + typeCounts[type],
    0,
  );

  return (
    <div
      className={`bg-white/95 border border-wire rounded-xl shadow-apple backdrop-blur-sm w-full ${className ?? ""}`}
      aria-label="Map legend: property types"
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <p className="text-xs font-medium text-ink min-w-0 truncate">
          Property types
          <span className="text-fog font-normal tabular-nums">
            {" "}
            ({mapTotal} on map)
          </span>
        </p>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="shrink-0 inline-flex items-center gap-1 text-[10px] font-medium text-ash hover:text-ink px-2 py-1 rounded-md hover:bg-cloud transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink min-h-8"
          aria-expanded={open}
          aria-controls="map-property-legend-panel"
        >
          {open ? "Hide" : "Show"}
          {open ? (
            <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
      {open && (
        <div id="map-property-legend-panel" className="px-3 pb-2.5">
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            {PROPERTY_TYPE_MAP_ORDER.map((type) => {
              const meta = PROPERTY_TYPE_MAP_META[type];
              const Icon = PROPERTY_TYPE_ICONS[type];
              const count = typeCounts[type];
              return (
                <li
                  key={type}
                  className="flex items-center gap-2 text-ash min-h-6 min-w-0"
                >
                  <span
                    className="flex shrink-0 items-center justify-center w-5 h-5 rounded-full"
                    style={{ backgroundColor: meta.accent }}
                  >
                    <Icon
                      className="w-3 h-3 text-white"
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-xs text-ink/80 leading-tight truncate min-w-0 flex-1">
                    {meta.label}
                  </span>
                  <span
                    className="text-[10px] tabular-nums text-fog shrink-0"
                    aria-label={`${count} on map`}
                  >
                    {count}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MapPropertyLegend;
