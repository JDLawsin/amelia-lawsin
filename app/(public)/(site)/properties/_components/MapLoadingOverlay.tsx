"use client";

import clsx from "clsx";

type MapLoadingOverlayProps = {
  variant?: "initial" | "updating";
  className?: string;
};

const MapLoadingOverlay = ({
  variant = "initial",
  className,
}: MapLoadingOverlayProps) => {
  const message =
    variant === "updating" ? "Updating results…" : "Loading map…";

  return (
    <div
      className={clsx(
        "absolute inset-0 z-10 pointer-events-none",
        variant === "updating" && "bg-white/40",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {variant === "initial" ? (
        <div className="absolute inset-0 bg-cloud">
          <div
            className="absolute inset-0 opacity-40 animate-pulse motion-reduce:animate-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-wire) 1px, transparent 1px), linear-gradient(to bottom, var(--color-wire) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-ash bg-white/90 px-3 py-1.5 rounded-full border border-wire shadow-apple-sm">
              {message}
            </p>
          </div>
        </div>
      ) : (
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <p className="text-xs text-ink bg-white px-3 py-1.5 rounded-full border border-wire shadow-apple-sm tabular-nums">
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapLoadingOverlay;
