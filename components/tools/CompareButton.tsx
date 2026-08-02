"use client";

import { useEffect, useRef, useState } from "react";
import { GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompare } from "@/providers/CompareProvider";
import { IconTooltip } from "@/components/ui/IconTooltip";

type Props = {
  slug: string;
  className?: string;
  size?: "sm" | "md";
};

export const CompareButton = ({
  slug,
  className,
  size = "md",
}: Props) => {
  const { isComparing, toggleCompare, canAddMore } = useCompare();
  const comparing = isComparing(slug);
  const [showMaxMessage, setShowMaxMessage] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = toggleCompare(slug);
    if (!ok) {
      setShowMaxMessage(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowMaxMessage(false), 2000);
    }
  };

  const disabled = !comparing && !canAddMore;
  const label = comparing
    ? "Remove from compare"
    : disabled
      ? "Compare list full (max 3)"
      : "Add to compare";

  return (
    <div className={cn("relative inline-flex", className)}>
      <IconTooltip label={label}>
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          aria-pressed={comparing}
          aria-label={label}
          className={cn(
            "flex items-center justify-center rounded-full border border-wire shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ink cursor-pointer",
            size === "md" ? "w-9 h-9" : "w-8 h-8",
            comparing
              ? "bg-ink text-white"
              : "bg-white/90 backdrop-blur-sm text-ash hover:text-ink hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          <GitCompare
            className={cn(
              "transition-colors",
              size === "md" ? "w-5 h-5" : "w-4 h-4",
            )}
          />
        </button>
      </IconTooltip>
      {showMaxMessage ? (
        <span
          role="status"
          aria-live="polite"
          className="absolute -top-7 right-0 whitespace-nowrap text-[10px] font-medium bg-ink text-white px-1.5 py-0.5 rounded-md shadow-sm"
        >
          Max 3
        </span>
      ) : null}
    </div>
  );
};
