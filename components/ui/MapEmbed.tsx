"use client";

import { useEffect, useState } from "react";

const MAP_LOAD_TIMEOUT_MS = 15000;

type MapEmbedProps = {
  src: string;
  href: string;
  title: string;
  iframeHeight: number;
  containerClassName: string;
  fallbackLabel: string;
  /** Defer iframe load until the user opts in — avoids third-party cookies on load. */
  clickToLoad?: boolean;
};

const MapEmbed = ({
  src,
  href,
  title,
  iframeHeight,
  containerClassName,
  fallbackLabel,
  clickToLoad = false,
}: MapEmbedProps) => {
  const [activated, setActivated] = useState(!clickToLoad);
  const [loaded, setLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  // Reset load state when the map source changes.
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(false);
      setShowFallback(false);
      if (clickToLoad) {
        setActivated(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [clickToLoad, src]);

  // Fall back to the link-only preview only if the iframe genuinely fails to
  // load within the timeout window.
  useEffect(() => {
    if (!activated || loaded || showFallback) return;
    const timer = setTimeout(() => setShowFallback(true), MAP_LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [activated, loaded, showFallback, src]);

  if (clickToLoad && !activated) {
    return (
      <div
        className={`relative overflow-hidden border border-wire bg-cloud ${containerClassName}`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-10 h-10 rounded-xl bg-white border border-wire flex items-center justify-center mb-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1d1d1f"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <p className="text-sm font-medium text-ink mb-1 line-clamp-2">
            {fallbackLabel}
          </p>
          <p className="text-xs text-ash mb-4">
            Interactive map loads only when you choose to view it.
          </p>
          <button
            type="button"
            onClick={() => setActivated(true)}
            className="inline-flex items-center text-xs font-medium px-4 py-2 rounded-lg bg-ink text-white hover:bg-ink/90 transition-colors"
          >
            Load map
          </button>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 bg-white text-ink text-xs font-medium px-3 py-1.5 rounded-lg border border-wire shadow-apple-sm hover:shadow-apple transition-shadow"
        >
          Open in Maps →
        </a>
      </div>
    );
  }

  if (!loaded && showFallback) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative block bg-cloud border border-wire p-6 ${containerClassName}`}
      >
        <div className="h-full flex flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-ink mb-1 line-clamp-2">
            {fallbackLabel}
          </p>
          <p className="text-xs text-ash mb-4">Map preview unavailable</p>
          <span className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-wire shadow-apple-sm hover:shadow-apple transition-shadow">
            Open in Maps →
          </span>
        </div>
      </a>
    );
  }

  return (
    <div
      className={`relative overflow-hidden border border-wire ${containerClassName}`}
    >
      {!loaded && !showFallback && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-cloud">
          <div className="w-8 h-8 border-2 border-wire border-t-ink rounded-full animate-spin" />
          <p className="mt-3 text-xs font-medium text-ink">Loading map...</p>
        </div>
      )}
      <iframe
        src={src}
        width="100%"
        height={iframeHeight}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        onLoad={() => setLoaded(true)}
      />
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 bg-white text-ink text-xs font-medium px-3 py-1.5 rounded-lg border border-wire shadow-apple-sm hover:shadow-apple transition-shadow"
      >
        Open in Maps →
      </a>
    </div>
  );
};

export default MapEmbed;
