"use client";

import { useState } from "react";
import clsx from "clsx";

type Props = {
  title: string;
  variant?: "inline" | "sidebar";
};

const ShareButtons = ({ title, variant = "inline" }: Props) => {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  const viberUrl = `viber://forward?text=${encodeURIComponent(`${title} ${currentUrl}`)}`;

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2">
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-8 px-3 flex items-center gap-1.5 rounded-full border border-wire text-xs text-ash hover:text-ink hover:border-ink transition-colors"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
          </svg>
          Share
        </a>
        <button
          onClick={copyLink}
          className={clsx(
            "h-8 px-3 flex items-center rounded-full border text-xs transition-colors",
            copied
              ? "border-ink text-ink"
              : "border-wire text-ash hover:text-ink hover:border-ink",
          )}
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    );
  }

  return (
    <div className="border border-wire rounded-xl p-4">
      <p className="text-xs font-medium text-ink mb-3">Share this article</p>
      <div className="flex flex-col gap-2">
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-cloud rounded-lg py-2 text-xs text-ash text-center hover:text-ink transition-colors"
        >
          Share on Facebook
        </a>
        <button
          onClick={copyLink}
          className={clsx(
            "w-full bg-cloud rounded-lg py-2 text-xs text-center transition-colors",
            copied ? "text-ink" : "text-ash hover:text-ink",
          )}
        >
          {copied ? "Link copied!" : "Copy link"}
        </button>
        <a
          href={viberUrl}
          className="w-full bg-cloud rounded-lg py-2 text-xs text-ash text-center hover:text-ink transition-colors"
        >
          Share on Viber
        </a>
      </div>
    </div>
  );
};

export default ShareButtons;
