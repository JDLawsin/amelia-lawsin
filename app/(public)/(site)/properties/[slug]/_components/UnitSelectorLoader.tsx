"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import UnitSelectorShell from "./UnitSelectorShell";
import type { Unit } from "./UnitSelector";

const UnitSelector = dynamic(() => import("./UnitSelector"), {
  ssr: false,
});

type Props = {
  units: Unit[];
  propertyTitle: string;
};

/** Defers unit selector hydration until near the viewport. */
const UnitSelectorLoader = ({ units, propertyTitle }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        },
        { rootMargin: "200px" },
      );
      observer.observe(el);
      return () => observer.disconnect();
    }

    setShouldLoad(true);
  }, []);

  return (
    <div ref={ref}>
      {shouldLoad ? (
        <UnitSelector units={units} propertyTitle={propertyTitle} />
      ) : (
        <UnitSelectorShell units={units} propertyTitle={propertyTitle} />
      )}
    </div>
  );
};

export default UnitSelectorLoader;
