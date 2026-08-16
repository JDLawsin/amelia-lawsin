"use client";

import { Printer } from "lucide-react";
import clsx from "clsx";

type Props = {
  className?: string;
  variant?: "button" | "sidebar";
};

const PropertyPrintButton = ({
  className,
  variant = "button",
}: Props) => (
  <button
    type="button"
    onClick={() => window.print()}
    aria-label="Print fact sheet"
    className={clsx(
      "inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors touch-manipulation",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2",
      variant === "sidebar"
        ? "w-full h-11 bg-cloud text-ink border border-wire rounded-xl hover:bg-wire/30"
        : "h-9 px-3 text-ash border border-wire rounded-xl bg-white hover:text-ink hover:border-ink",
      className,
    )}
  >
    <Printer className="w-4 h-4 shrink-0" aria-hidden="true" />
    Print fact sheet
  </button>
);

export default PropertyPrintButton;
