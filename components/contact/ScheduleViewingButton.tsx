"use client";

import { useState } from "react";
import clsx from "clsx";
import ScheduleViewingModal, {
  type ScheduleViewingProperty,
} from "./ScheduleViewingModal";

type Props = {
  source: "Contact page" | "Property listing";
  property?: ScheduleViewingProperty;
  className?: string;
  variant?: "primary" | "secondary";
};

const ScheduleViewingButton = ({
  source,
  property,
  className,
  variant = "secondary",
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx(
          "flex items-center justify-center w-full h-11 text-sm font-medium rounded-xl transition-colors",
          variant === "primary"
            ? "bg-ink text-white hover:bg-ink/90"
            : "bg-transparent text-ash border border-wire hover:text-ink hover:border-ink",
          className,
        )}
      >
        Schedule a viewing
      </button>

      <ScheduleViewingModal
        open={open}
        onClose={() => setOpen(false)}
        source={source}
        property={property}
      />
    </>
  );
};

export default ScheduleViewingButton;
