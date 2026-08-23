"use client";

import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import useUpdateQueryString from "@/hooks/useQueryString";
import { PropertyStatus, PropertyType } from "@/app/generated/prisma/enums";
import { formatEnumLabel } from "@/lib/utils";
import {
  QUICK_BROWSE_CHIPS,
  SPECIAL_FILTER_CHIPS,
} from "@/lib/property-browse-chips";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import FilterChip from "./FilterChip";

const Divider = () => (
  <div className="w-px bg-cloud h-5 mx-1 shrink-0 self-center" aria-hidden="true" />
);

const ChipsRow = () => {
  const searchParams = useSearchParams();
  const updateQueryString = useUpdateQueryString();
  const isMobile = useMediaQuery("(max-width: 767px)");

  const activeStatus = searchParams.get("status");
  const activeType = searchParams.get("type");
  const activeSpecial = searchParams.get("special");

  const handleStatus = (value: string) => {
    if (value === "ALL") {
      updateQueryString({}, ["status", "page"]);
    } else if (activeStatus === value) {
      updateQueryString({}, ["status", "page"]);
    } else {
      updateQueryString({ status: value, page: "1" });
    }
  };

  const handleType = (value: string) => {
    if (activeType === value) {
      updateQueryString({}, ["type", "page"]);
    } else {
      updateQueryString({ type: value, page: "1" });
    }
  };

  const handleSpecial = (value: string) => {
    if (activeSpecial === value) {
      updateQueryString({}, ["special", "page"]);
    } else {
      updateQueryString({ special: value, page: "1" });
    }
  };

  const handleQuickChip = (chip: typeof QUICK_BROWSE_CHIPS[number]) => {
    if (chip.param === "status") {
      handleStatus(chip.value);
    } else {
      handleType(chip.value);
    }
  };

  const isQuickChipActive = (chip: typeof QUICK_BROWSE_CHIPS[number]) => {
    if (chip.param === "status") return activeStatus === chip.value;
    return activeType === chip.value;
  };

  if (isMobile) {
    return (
      <div
        className={clsx(
          "relative px-6 pt-3 pb-2",
          "overflow-x-auto scrollbar-none",
          "flex flex-nowrap items-center gap-2 snap-x snap-mandatory motion-reduce:snap-none",
          "[-webkit-mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)]",
          "motion-reduce:[-webkit-mask-image:none]",
        )}
      >
        <FilterChip
          label="All"
          active={!activeStatus && !activeType}
          onClick={() => {
            updateQueryString({}, ["status", "type", "page"]);
          }}
          className="snap-start"
        />
        {QUICK_BROWSE_CHIPS.map((chip) => (
          <FilterChip
            key={`${chip.param}-${chip.value}`}
            label={chip.label}
            active={isQuickChipActive(chip)}
            gold={chip.gold}
            onClick={() => handleQuickChip(chip)}
            className="snap-start"
          />
        ))}
        <div className="w-4 shrink-0 snap-start" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 px-6 pt-3 pb-2">
      <FilterChip
        label="All"
        active={!activeStatus}
        onClick={() => handleStatus("ALL")}
      />
      {Object.values(PropertyStatus).map((s) => (
        <FilterChip
          key={s}
          label={formatEnumLabel(s)}
          active={activeStatus === s}
          onClick={() => handleStatus(s)}
        />
      ))}

      <Divider />

      {Object.values(PropertyType).map((t) => (
        <FilterChip
          key={t}
          label={formatEnumLabel(t)}
          active={activeType === t}
          gold={t === PropertyType.BEACH_VACATION}
          onClick={() => handleType(t)}
        />
      ))}

      <Divider />

      {SPECIAL_FILTER_CHIPS.map((f) => (
        <FilterChip
          key={f.value}
          label={f.label}
          active={activeSpecial === f.value}
          gold
          onClick={() => handleSpecial(f.value)}
        />
      ))}
    </div>
  );
};

export default ChipsRow;
