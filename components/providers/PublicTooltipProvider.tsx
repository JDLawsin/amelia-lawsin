"use client";

import { TooltipProvider } from "@/components/ui/shadcn/tooltip";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const PublicTooltipProvider = ({ children }: Props) => (
  <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
);
