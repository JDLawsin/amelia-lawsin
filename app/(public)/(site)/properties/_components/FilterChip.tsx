"use client";

import clsx from "clsx";
import { X } from "lucide-react";

type FilterChipProps = {
  label: string;
  active?: boolean;
  gold?: boolean;
  dismissible?: boolean;
  onClick: () => void;
  className?: string;
};

const FilterChip = ({
  label,
  active = false,
  gold,
  dismissible = false,
  onClick,
  className,
}: FilterChipProps) => {
  const ariaLabel = dismissible ? `Remove ${label} filter` : label;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={dismissible ? undefined : active}
      aria-label={ariaLabel}
      className={clsx(
        "inline-flex items-center gap-1.5 min-h-11 px-3 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors border shadow-apple-sm touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2",
        active
          ? "bg-ink text-white border-wire"
          : gold
            ? "bg-ink/8 text-ink border-wire/40 hover:bg-ink/15"
            : "bg-white text-ash border-wire hover:bg-cloud hover:text-ink",
        dismissible && "pr-2.5",
        className,
      )}
    >
      <span>{label}</span>
      {dismissible && (
        <X className="w-3.5 h-3.5 shrink-0 opacity-80" aria-hidden="true" />
      )}
    </button>
  );
};

export default FilterChip;
