"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import ContactSidebarShell, {
  type ContactSidebarProps,
} from "./ContactSidebarShell";

const ContactSidebar = dynamic(() => import("./ContactSidebar"), {
  ssr: false,
});

/** Defers sidebar hydration until near the viewport to reduce main-thread work. */
const ContactSidebarLoader = (props: ContactSidebarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(
    () =>
      typeof window !== "undefined" && !("IntersectionObserver" in window),
  );

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {shouldLoad ? (
        <ContactSidebar {...props} />
      ) : (
        <ContactSidebarShell {...props} />
      )}
    </div>
  );
};

export default ContactSidebarLoader;
