"use client";

import { useEffect, useState } from "react";
import {
  LOADING_MESSAGES,
  type LoadingContext,
} from "@/lib/loading-messages";

export const useRotatingLoadingMessage = (
  context: LoadingContext,
  intervalMs = 2500,
  enabled = true,
): string => {
  const messages = LOADING_MESSAGES[context];
  const [rotation, setRotation] = useState({ context, index: 0 });
  const index = rotation.context === context ? rotation.index : 0;

  useEffect(() => {
    if (!enabled || messages.length <= 1) return;

    const timer = setInterval(() => {
      setRotation((current) => ({
        context,
        index:
          ((current.context === context ? current.index : 0) + 1) %
          messages.length,
      }));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [context, enabled, intervalMs, messages.length]);

  return messages[index] ?? messages[0];
};
