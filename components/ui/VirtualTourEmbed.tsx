"use client";

import { useEffect, useState } from "react";
import type { ParsedVirtualTour } from "@/lib/virtual-tour-url";

const EMBED_LOAD_TIMEOUT_MS = 15000;

const PROVIDER_LABELS: Record<ParsedVirtualTour["provider"], string> = {
  youtube: "YouTube video",
  vimeo: "Vimeo video",
  matterport: "3D virtual tour",
};

type VirtualTourEmbedProps = {
  tour: ParsedVirtualTour;
  title: string;
  clickToLoad?: boolean;
};

const VirtualTourEmbed = ({
  tour,
  title,
  clickToLoad = true,
}: VirtualTourEmbedProps) => {
  const [activated, setActivated] = useState(!clickToLoad);
  const [loaded, setLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(false);
      setShowFallback(false);
      if (clickToLoad) {
        setActivated(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [clickToLoad, tour.embedUrl]);

  useEffect(() => {
    if (!activated || loaded || showFallback) return;
    const timer = setTimeout(() => setShowFallback(true), EMBED_LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [activated, loaded, showFallback, tour.embedUrl]);

  const providerLabel = PROVIDER_LABELS[tour.provider];
  const openLabel =
    tour.provider === "matterport" ? "Open tour" : "Open video";

  if (clickToLoad && !activated) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-wire bg-cloud aspect-video">
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
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
          <p className="text-sm font-medium text-ink mb-1 line-clamp-2">
            {title}
          </p>
          <p className="text-xs text-ash mb-4">
            {providerLabel} loads only when you choose to view it.
          </p>
          <button
            type="button"
            onClick={() => setActivated(true)}
            className="inline-flex items-center text-xs font-medium px-4 py-2 rounded-lg bg-ink text-white hover:bg-ink/90 transition-colors"
          >
            Load {tour.provider === "matterport" ? "tour" : "video"}
          </button>
        </div>
        <a
          href={tour.watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 bg-white text-ink text-xs font-medium px-3 py-1.5 rounded-lg border border-wire shadow-apple-sm hover:shadow-apple transition-shadow"
        >
          {openLabel} →
        </a>
      </div>
    );
  }

  if (!loaded && showFallback) {
    return (
      <a
        href={tour.watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video rounded-2xl border border-wire bg-cloud p-6"
      >
        <div className="h-full flex flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-ink mb-1 line-clamp-2">
            {title}
          </p>
          <p className="text-xs text-ash mb-4">Preview unavailable in-browser</p>
          <span className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-wire shadow-apple-sm hover:shadow-apple transition-shadow">
            {openLabel} →
          </span>
        </div>
      </a>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-wire aspect-video">
      {!loaded && !showFallback && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-cloud">
          <div className="w-8 h-8 border-2 border-wire border-t-ink rounded-full animate-spin motion-reduce:animate-none" />
          <p className="mt-3 text-xs font-medium text-ink">Loading preview...</p>
        </div>
      )}
      <iframe
        src={tour.embedUrl}
        title={`${providerLabel} for ${title}`}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-forms"
        onLoad={() => setLoaded(true)}
      />
      <a
        href={tour.watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 bg-white text-ink text-xs font-medium px-3 py-1.5 rounded-lg border border-wire shadow-apple-sm hover:shadow-apple transition-shadow"
      >
        {openLabel} →
      </a>
    </div>
  );
};

export default VirtualTourEmbed;
