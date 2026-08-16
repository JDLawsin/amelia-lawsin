"use client";

import clsx from "clsx";
import { useRotatingLoadingMessage } from "@/hooks/useRotatingLoadingMessage";
import type { LoadingContext } from "@/lib/loading-messages";

type Props = {
  context: LoadingContext;
  className?: string;
  intervalMs?: number;
  enabled?: boolean;
};

const LoadingStatusText = ({
  context,
  className,
  intervalMs,
  enabled = true,
}: Props) => {
  const message = useRotatingLoadingMessage(context, intervalMs, enabled);

  return (
    <p
      className={clsx(
        "min-h-4 text-center transition-opacity duration-300",
        className,
      )}
    >
      {message}
    </p>
  );
};

export default LoadingStatusText;
