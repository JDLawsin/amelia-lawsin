"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import PropertyListingToolbarShell from "./PropertyListingToolbarShell";

const PropertyListingToolbar = dynamic(
  () => import("./PropertyListingToolbar"),
  {
    ssr: false,
    loading: () => <PropertyListingToolbarShell />,
  },
);

type Props = {
  slug: string;
};

/** Defers listing toolbar hydration until the browser is idle. */
const PropertyListingToolbarLoader = ({ slug }: Props) => {
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
    return <PropertyListingToolbarShell />;
  }

  return <PropertyListingToolbar slug={slug} />;
};

export default PropertyListingToolbarLoader;
