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
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [context]);

  useEffect(() => {
    if (!enabled || messages.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [context, enabled, intervalMs, messages.length]);

  return messages[index] ?? messages[0];
};
