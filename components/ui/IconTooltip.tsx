"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";

type Props = {
  label: string;
  children: React.ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
};

export const IconTooltip = ({
  label,
  children,
  side = "top",
  sideOffset = 6,
}: Props) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent side={side} sideOffset={sideOffset}>
      {label}
    </TooltipContent>
  </Tooltip>
);
