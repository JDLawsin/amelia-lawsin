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
        { rootMargin: "300px" },
      );
      observer.observe(el);
      return () => observer.disconnect();
    }

    setShouldLoad(true);
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
