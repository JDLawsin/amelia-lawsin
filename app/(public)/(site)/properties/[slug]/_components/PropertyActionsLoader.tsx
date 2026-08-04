"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import PropertyActionsShell from "./PropertyActionsShell";

const PropertyActions = dynamic(() => import("./PropertyActions"), {
  ssr: false,
  loading: () => <PropertyActionsShell />,
});

type Props = {
  slug: string;
  size?: "sm" | "md";
};

/** Defers favorite/compare hydration until the browser is idle. */
const PropertyActionsLoader = ({ slug, size = "md" }: Props) => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const win = window as Window &
      typeof globalThis & {
        requestIdleCallback?: (
          callback: IdleRequestCallback,
          options?: IdleRequestOptions,
        ) => number;
        cancelIdleCallback?: (handle: number) => void;
      };

    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(() => setShouldLoad(true), {
        timeout: 2500,
      });
      return () => win.cancelIdleCallback?.(id);
    }

    const timer = setTimeout(() => setShouldLoad(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) {
    return <PropertyActionsShell size={size} />;
  }

  return <PropertyActions slug={slug} size={size} />;
};

export default PropertyActionsLoader;
