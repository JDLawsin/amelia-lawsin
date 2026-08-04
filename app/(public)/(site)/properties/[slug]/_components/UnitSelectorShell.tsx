import clsx from "clsx";
import { formatUnitPrice } from "@/lib/utils";
import { SITE_CONFIG } from "@/constants";
import type { Unit } from "./UnitSelector";

type Props = {
  units: Unit[];
  propertyTitle: string;
};

/** Static first-unit view before UnitSelector client bundle loads. */
const UnitSelectorShell = ({ units, propertyTitle }: Props) => {
  const active = units[0];
  if (!active) return null;

  const messengerUrl = `${SITE_CONFIG.messengerUrl}?text=${encodeURIComponent(
    `Hi Amelia! I'm interested in the ${active.label} unit of ${propertyTitle}.`,
  )}`;

  const priceLabel = units.length > 1 ? "Starting price" : "Price";

  return (
    <div aria-busy="true" aria-label="Loading unit selector">
      <div className="flex gap-2 mb-3 flex-wrap">
        {units.map((unit, index) => (
          <span
            key={unit.id}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-xs font-medium border",
              index === 0
                ? "bg-ink text-white border-ink"
                : "bg-white text-ash border-wire",
            )}
          >
            {unit.label}
          </span>
        ))}
      </div>

      <div className="bg-cloud rounded-xl p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 mb-4">
          <div>
            <p className="text-base font-medium text-ink">
              {formatUnitPrice(active)}
            </p>
            <p className="text-xs text-ash mt-0.5">{priceLabel}</p>
          </div>
          {active.floorArea && (
            <div>
              <p className="text-base font-medium text-ink">
                {active.floorArea}sqm
              </p>
              <p className="text-xs text-ash mt-0.5">Floor area</p>
            </div>
          )}
          {active.bedrooms != null && (
            <div>
              <p className="text-base font-medium text-ink">
                {active.bedrooms === 0 ? "Studio" : active.bedrooms}
              </p>
              <p className="text-xs text-ash mt-0.5">
                {active.bedrooms === 0 ? "Unit type" : "Bedrooms"}
              </p>
            </div>
          )}
        </div>

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

export default UnitSelectorShell;
