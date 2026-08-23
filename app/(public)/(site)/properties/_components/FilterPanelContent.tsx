"use client";

import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import useUpdateQueryString from "@/hooks/useQueryString";
import { BEDROOM_OPTIONS, CEBU_CITIES } from "@/constants";
import { PropertyStatus, PropertyType } from "@/app/generated/prisma/enums";
import { formatEnumLabel } from "@/lib/utils";
import {
  localFilterStateFromSearchParams,
  type LocalFilterState,
} from "@/lib/property-browse-chips";
import { Button } from "@/components/ui/shadcn/button";

const PRICE_PRESETS = [
  { label: "Under ₱3M", min: undefined, max: "3000000" },
  { label: "₱3M – ₱8M", min: "3000000", max: "8000000" },
  { label: "₱8M – ₱20M", min: "8000000", max: "20000000" },
  { label: "Above ₱20M", min: "20000000", max: undefined },
];

const FilterSection = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <p className="text-[10px] font-medium text-ash uppercase tracking-wider">
      {label}
    </p>
    {children}
  </div>
);

const OptionPill = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={clsx(
      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors min-h-11 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2",
      active
        ? "bg-ink text-white border-wire"
        : "bg-white text-ash border-wire hover:bg-cloud hover:text-ink hover:border-wire",
    )}
  >
    {label}
  </button>
);

type FilterPanelContentProps = {
  onApplied?: () => void;
  previewEnabled?: boolean;
  previewTotal?: number | null;
  isPreviewLoading?: boolean;
  onLocalFiltersChange?: (filters: LocalFilterState) => void;
};

const FilterPanelContent = ({
  onApplied,
  previewEnabled = false,
  previewTotal = null,
  isPreviewLoading = false,
  onLocalFiltersChange,
}: FilterPanelContentProps) => {
  const searchParams = useSearchParams();
  const updateQueryString = useUpdateQueryString();

  const committed = localFilterStateFromSearchParams(searchParams);

  const [localStatus, setLocalStatus] = useState(committed.status);
  const [localType, setLocalType] = useState(committed.type);
  const [localBedrooms, setLocalBedrooms] = useState(committed.bedrooms);
  const [localCity, setLocalCity] = useState(committed.city);
  const [localMinPrice, setLocalMinPrice] = useState(committed.minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(committed.maxPrice);
  const [localSpecial, setLocalSpecial] = useState(committed.special);

  useEffect(() => {
    if (!previewEnabled || !onLocalFiltersChange) return;
    onLocalFiltersChange({
      status: localStatus,
      type: localType,
      bedrooms: localBedrooms,
      city: localCity,
      minPrice: localMinPrice,
      maxPrice: localMaxPrice,
      special: localSpecial,
    });
  }, [
    previewEnabled,
    onLocalFiltersChange,
    localStatus,
    localType,
    localBedrooms,
    localCity,
    localMinPrice,
    localMaxPrice,
    localSpecial,
  ]);

  const handlePricePreset = (min?: string, max?: string) => {
    setLocalMinPrice(min ?? "");
    setLocalMaxPrice(max ?? "");
  };

  const isPricePresetActive = (min?: string, max?: string) =>
    localMinPrice === (min ?? "") && localMaxPrice === (max ?? "");

  const handleApply = () => {
    updateQueryString(
      {
        status: localStatus || undefined,
        type: localType || undefined,
        bedrooms: localBedrooms || undefined,
        city: localCity || undefined,
        minPrice: localMinPrice || undefined,
        maxPrice: localMaxPrice || undefined,
        special: localSpecial || undefined,
        page: "1",
      },
      [
        ...(!localStatus ? ["status"] : []),
        ...(!localType ? ["type"] : []),
        ...(!localBedrooms ? ["bedrooms"] : []),
        ...(!localCity ? ["city"] : []),
        ...(!localMinPrice ? ["minPrice"] : []),
        ...(!localMaxPrice ? ["maxPrice"] : []),
        ...(!localSpecial ? ["special"] : []),
        "page",
      ],
    );
    onApplied?.();
  };

  const handleClear = () => {
    setLocalStatus("");
    setLocalType("");
    setLocalBedrooms("");
    setLocalCity("");
    setLocalMinPrice("");
    setLocalMaxPrice("");
    setLocalSpecial("");
    updateQueryString(
      {},
      [
        "status",
        "type",
        "bedrooms",
        "city",
        "minPrice",
        "maxPrice",
        "special",
        "page",
      ],
    );
    onApplied?.();
  };

  const applyLabel =
    isPreviewLoading
      ? "Loading…"
      : previewTotal != null
        ? `Show ${previewTotal} ${previewTotal === 1 ? "property" : "properties"}`
        : "Show results";

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        <FilterSection label="Listing status">
          <div className="flex flex-wrap gap-2">
            <OptionPill
              label="Any"
              active={localStatus === ""}
              onClick={() => setLocalStatus("")}
            />
            {Object.values(PropertyStatus).map((status) => (
              <OptionPill
                key={status}
                label={formatEnumLabel(status)}
                active={localStatus === status}
                onClick={() =>
                  setLocalStatus(localStatus === status ? "" : status)
                }
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection label="Property type">
          <div className="flex flex-wrap gap-2">
            <OptionPill
              label="Any"
              active={localType === ""}
              onClick={() => setLocalType("")}
            />
            {Object.values(PropertyType).map((type) => (
              <OptionPill
                key={type}
                label={formatEnumLabel(type)}
                active={localType === type}
                onClick={() =>
                  setLocalType(localType === type ? "" : type)
                }
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection label="Price range">
          <div className="flex flex-wrap gap-2">
            {PRICE_PRESETS.map((preset) => (
              <OptionPill
                key={preset.label}
                label={preset.label}
                active={isPricePresetActive(preset.min, preset.max)}
                onClick={() => handlePricePreset(preset.min, preset.max)}
              />
            ))}
          </div>
          <div className="flex gap-2 mt-1">
            <div className="flex-1 bg-white border border-wire rounded-lg px-3 py-2">
              <p className="text-[9px] text-ash">Min</p>
              <input
                name="minPrice"
                value={
                  localMinPrice
                    ? `₱${Number(localMinPrice).toLocaleString()}`
                    : ""
                }
                onChange={(e) =>
                  setLocalMinPrice(e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="₱ Min…"
                spellCheck={false}
                className="text-xs font-medium text-ink w-full bg-transparent outline-none placeholder:text-ash/50 focus-visible:ring-2 focus-visible:ring-ink rounded-sm"
              />
            </div>
            <div className="flex items-center justify-center text-ash text-xs pt-3">
              —
            </div>
            <div className="flex-1 bg-white border border-wire rounded-lg px-3 py-2">
              <p className="text-[9px] text-ash">Max</p>
              <input
                name="maxPrice"
                value={
                  localMaxPrice
                    ? `₱${Number(localMaxPrice).toLocaleString()}`
                    : ""
                }
                onChange={(e) =>
                  setLocalMaxPrice(e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="₱ Max…"
                spellCheck={false}
                className="text-xs font-medium text-ink w-full bg-transparent outline-none placeholder:text-ash/50 focus-visible:ring-2 focus-visible:ring-ink rounded-sm"
              />
            </div>
          </div>
        </FilterSection>

        <FilterSection label="Bedrooms">
          <div className="flex flex-wrap gap-2">
            <OptionPill
              label="Any"
              active={localBedrooms === ""}
              onClick={() => setLocalBedrooms("")}
            />
            {BEDROOM_OPTIONS.map((opt: { value: string; label: string }) => (
              <OptionPill
                key={opt.value}
                label={opt.label}
                active={localBedrooms === opt.value}
                onClick={() => setLocalBedrooms(opt.value)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection label="Location">
          <div className="flex flex-wrap gap-2">
            <OptionPill
              label="Any city"
              active={localCity === ""}
              onClick={() => setLocalCity("")}
            />
            {CEBU_CITIES.map((city: string) => (
              <OptionPill
                key={city}
                label={city}
                active={localCity === city}
                onClick={() => setLocalCity(localCity === city ? "" : city)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection label="Financing">
          {[
            { param: "pagibig", label: "Pag-IBIG accredited" },
            { param: "bank", label: "Bank financing" },
            { param: "inhouse", label: "In-house financing" },
            { param: "renttoown", label: "Rent-to-Own" },
          ].map((f) => {
            const isActive = localSpecial === f.param;
            return (
              <button
                key={f.param}
                type="button"
                onClick={() => setLocalSpecial(isActive ? "" : f.param)}
                className={clsx(
                  "flex items-center gap-2 text-xs py-2 text-left transition-colors min-h-11 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-sm",
                  isActive ? "text-ink font-medium" : "text-ash hover:text-ink",
                )}
              >
                <div
                  className={clsx(
                    "w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors",
                    isActive ? "bg-ink border-wire" : "border-wire bg-white",
                  )}
                >
                  {isActive && (
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </div>
                {f.label}
              </button>
            );
          })}
        </FilterSection>
      </div>

      <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-wire">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-ash hover:text-ink hover:bg-cloud text-xs min-h-11"
        >
          Clear all
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleApply}
          disabled={isPreviewLoading}
          className="bg-ink text-white hover:bg-ink/90 text-xs px-5 rounded-lg min-h-11"
        >
          {applyLabel}
        </Button>
      </div>
    </>
  );
};

export default FilterPanelContent;
