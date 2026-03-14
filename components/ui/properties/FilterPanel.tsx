"use client";

import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import useUpdateQueryString from "@/hooks/useQueryString";
import { BEDROOM_OPTIONS, CEBU_CITIES } from "@/constants";
import { Button } from "../shadcn/button";

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
    <p className="text-[10px] font-medium text-brand-green-light uppercase tracking-wider">
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
    onClick={onClick}
    className={clsx(
      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
      active
        ? "bg-brand-green text-white border-brand-green"
        : "bg-white text-brand-green-light border-brand-green-muted hover:bg-brand-green-subtle hover:text-brand-green hover:border-brand-green",
    )}
  >
    {label}
  </button>
);

type FilterPanelProps = {
  isOpen: boolean;
  totalResults: number;
};

const FilterPanel = ({ isOpen, totalResults }: FilterPanelProps) => {
  const searchParams = useSearchParams();
  const updateQueryString = useUpdateQueryString();

  const [localBedrooms, setLocalBedrooms] = useState(
    searchParams.get("bedrooms") ?? "",
  );
  const [localCity, setLocalCity] = useState(searchParams.get("city") ?? "");
  const [localMinPrice, setLocalMinPrice] = useState(
    searchParams.get("minPrice") ?? "",
  );
  const [localMaxPrice, setLocalMaxPrice] = useState(
    searchParams.get("maxPrice") ?? "",
  );

  useEffect(() => {
    setLocalBedrooms(searchParams.get("bedrooms") ?? "");
    setLocalCity(searchParams.get("city") ?? "");
    setLocalMinPrice(searchParams.get("minPrice") ?? "");
    setLocalMaxPrice(searchParams.get("maxPrice") ?? "");
  }, [searchParams]);

  const handlePricePreset = (min?: string, max?: string) => {
    setLocalMinPrice(min ?? "");
    setLocalMaxPrice(max ?? "");
  };

  const isPricePresetActive = (min?: string, max?: string) =>
    localMinPrice === (min ?? "") && localMaxPrice === (max ?? "");

  const handleApply = () => {
    updateQueryString(
      {
        bedrooms: localBedrooms || undefined,
        city: localCity || undefined,
        minPrice: localMinPrice || undefined,
        maxPrice: localMaxPrice || undefined,
        page: "1",
      },
      [
        ...(!localBedrooms ? ["bedrooms"] : []),
        ...(!localCity ? ["city"] : []),
        ...(!localMinPrice ? ["minPrice"] : []),
        ...(!localMaxPrice ? ["maxPrice"] : []),
        "page",
      ],
    );
  };

  const handleClear = () => {
    setLocalBedrooms("");
    setLocalCity("");
    setLocalMinPrice("");
    setLocalMaxPrice("");
    updateQueryString({}, ["bedrooms", "city", "minPrice", "maxPrice", "page"]);
  };

  if (!isOpen) return null;

  return (
    <div className="mx-6 mt-3 bg-brand-green-subtle border border-brand-green-muted rounded-2xl p-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
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
            <div className="flex-1 bg-white border border-brand-green-muted rounded-lg px-3 py-2">
              <p className="text-[9px] text-brand-green-light">Min</p>
              <input
                value={
                  localMinPrice
                    ? `₱${Number(localMinPrice).toLocaleString()}`
                    : ""
                }
                onChange={(e) =>
                  setLocalMinPrice(e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="₱ Min"
                className="text-xs font-medium text-brand-green w-full bg-transparent outline-none placeholder:text-brand-green-light/50"
              />
            </div>
            <div className="flex items-center justify-center text-brand-green-light text-xs pt-3">
              —
            </div>
            <div className="flex-1 bg-white border border-brand-green-muted rounded-lg px-3 py-2">
              <p className="text-[9px] text-brand-green-light">Max</p>
              <input
                value={
                  localMaxPrice
                    ? `₱${Number(localMaxPrice).toLocaleString()}`
                    : ""
                }
                onChange={(e) =>
                  setLocalMaxPrice(e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="₱ Max"
                className="text-xs font-medium text-brand-green w-full bg-transparent outline-none placeholder:text-brand-green-light/50"
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
            const isActive = searchParams.get("special") === f.param;
            return (
              <button
                key={f.param}
                onClick={() =>
                  updateQueryString(
                    {
                      special: isActive ? undefined : f.param,
                      page: "1",
                    },
                    isActive ? ["special"] : [],
                  )
                }
                className={clsx(
                  "flex items-center gap-2 text-xs py-1 text-left transition-colors",
                  isActive
                    ? "text-brand-green font-medium"
                    : "text-brand-green-light hover:text-brand-green",
                )}
              >
                <div
                  className={clsx(
                    "w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors",
                    isActive
                      ? "bg-brand-green border-brand-green"
                      : "border-brand-green-muted bg-white",
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

      <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-brand-green-muted">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-brand-green-light hover:text-brand-green hover:bg-brand-green-subtle text-xs"
        >
          {"Clear all"}
        </Button>
        <Button
          size="sm"
          onClick={handleApply}
          className="bg-brand-green text-white hover:bg-brand-green/90 text-xs px-5 rounded-lg"
        >
          {"Show"} {totalResults} {"results"}
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
