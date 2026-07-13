"use client";

import { useEffect, useState } from "react";

const MAP_LOAD_TIMEOUT_MS = 5000;

type MapEmbedProps = {
  src: string;
  href: string;
  title: string;
  iframeHeight: number;
  containerClassName: string;
  fallbackLabel: string;
};

const MapEmbed = ({
  src,
  href,
  title,
  iframeHeight,
  containerClassName,
  fallbackLabel,
}: MapEmbedProps) => {
  const [loaded, setLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const timer = setTimeout(() => setShowFallback(true), MAP_LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [loaded]);

  if (showFallback) {
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
          <p className="text-xs text-fog mb-4">Map preview unavailable</p>
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
