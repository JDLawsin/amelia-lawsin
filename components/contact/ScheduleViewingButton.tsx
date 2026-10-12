"use client";

import { useState } from "react";
import clsx from "clsx";
import { Dialog } from "radix-ui";
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
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
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
      </Dialog.Trigger>

      <ScheduleViewingModal
        open={open}
        source={source}
        property={property}
      />
    </Dialog.Root>
  );
};

export default ScheduleViewingButton;
