"use client";

import { useState } from "react";
import clsx from "clsx";
import { formatUnitPrice } from "@/lib/utils";
import { PropertyDetail } from "@/services/property.service";
import { SITE_CONFIG } from "@/constants";

export type Unit = PropertyDetail["units"][number];

type Props = {
  units: Unit[];
  propertyTitle: string;
};

const UnitSelector = ({ units, propertyTitle }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = units[activeIndex];

  const messengerUrl = `${SITE_CONFIG.messengerUrl}?text=${encodeURIComponent(
    `Hi Amelia! I'm interested in the ${active.label} unit of ${propertyTitle}.`,
  )}`;

  return (
    <div>
      <div className="flex gap-2 mb-3 flex-wrap">
        {units.map((unit, i) => (
          <button
            key={unit.id}
            onClick={() => setActiveIndex(i)}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              i === activeIndex
                ? "bg-ink text-white border-ink"
                : "bg-white text-ash border-wire hover:border-ink hover:text-ink",
            )}
          >
            {unit.label}
          </button>
        ))}
      </div>

      <div className="bg-cloud rounded-xl p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-base font-medium text-ink">
              {formatUnitPrice(active)}
            </p>
            <p className="text-[10px] text-fog mt-0.5">Starting price</p>
          </div>
          {active.floorArea && (
            <div>
              <p className="text-base font-medium text-ink">
                {active.floorArea}sqm
              </p>
              <p className="text-[10px] text-fog mt-0.5">Floor area</p>
            </div>
          )}
          {active.lotArea && (
            <div>
              <p className="text-base font-medium text-ink">
                {active.lotArea}sqm
              </p>
              <p className="text-[10px] text-fog mt-0.5">Lot area</p>
            </div>
          )}
          {active.bedrooms != null && (
            <div>
              <p className="text-base font-medium text-ink">
                {active.bedrooms === 0 ? "Studio" : active.bedrooms}
              </p>
              <p className="text-[10px] text-fog mt-0.5">
                {active.bedrooms === 0 ? "" : "Bedrooms"}
              </p>
            </div>
          )}
          {active.bathrooms != null && (
            <div>
              <p className="text-base font-medium text-ink">
                {active.bathrooms}
              </p>
              <p className="text-[10px] text-fog mt-0.5">Bathrooms</p>
            </div>
          )}
          {active.parking != null && active.parking > 0 && (
            <div>
              <p className="text-base font-medium text-ink">{active.parking}</p>
              <p className="text-[10px] text-fog mt-0.5">Parking</p>
            </div>
          )}
        </div>

        {active.towerOrPhase && (
          <p className="text-xs text-ash mb-4">
            <span className="text-fog">Phase / Tower: </span>
            {active.towerOrPhase}
          </p>
        )}

        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-ink text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors"
        >
          Inquire about {active.label} unit →
        </a>
      </div>
    </div>
  );
};

export default UnitSelector;
