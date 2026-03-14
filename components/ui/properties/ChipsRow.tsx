"use client";

import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import useUpdateQueryString from "@/hooks/useQueryString";
import { PropertyStatus, PropertyType } from "@/app/generated/prisma/enums";
import { formatEnumLabel } from "@/lib/utils";

const SPECIAL_FILTERS = [
  { value: "pagibig", label: "Pag-IBIG" },
  { value: "renttoown", label: "Rent-to-Own" },
  { value: "inhouse", label: "In-house Financing" },
];

const Divider = () => (
  <div className="w-px bg-brand-green-muted h-5 mx-1 shrink-0 self-center" />
);

const Chip = ({
  label,
  active,
  gold,
  onClick,
}: {
  label: string;
  active: boolean;
  gold?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={clsx(
      "h-8 px-3 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors border",
      active
        ? "bg-brand-green text-white border-brand-green"
        : gold
          ? "bg-brand-gold/8 text-brand-gold border-brand-gold/40 hover:bg-brand-gold/15"
          : "bg-white text-brand-green-light border-brand-green-muted hover:bg-brand-green-subtle hover:text-brand-green",
    )}
  >
    {label}
  </button>
);

const ChipsRow = () => {
  const searchParams = useSearchParams();
  const updateQueryString = useUpdateQueryString();

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

  return (
    <div className="flex items-center gap-2 px-6 pt-3 overflow-x-auto scrollbar-none pb-1">
      <Chip
        key="ALL"
        label="All"
        active={!activeStatus}
        onClick={() => handleStatus("ALL")}
      />
      {Object.values(PropertyStatus).map((s) => (
        <Chip
          key={s}
          label={formatEnumLabel(s)}
          active={activeStatus === s}
          onClick={() => handleStatus(s)}
        />
      ))}

      <Divider />

      {Object.values(PropertyType).map((t) => (
        <Chip
          key={t}
          label={formatEnumLabel(t)}
          active={activeType === t}
          gold={t === "BEACH_VACATION"}
          onClick={() => handleType(t)}
        />
      ))}

      <Divider />

      {SPECIAL_FILTERS.map((f) => (
        <Chip
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
