"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ToolsFab = dynamic(
  () =>
    import("@/components/tools/ToolsFab").then((mod) => ({
      default: mod.ToolsFab,
    })),
  { ssr: false },
);

const ToolsFabLoader = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = () => setReady(true);

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(mount, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }

    const id = globalThis.setTimeout(mount, 1500);
    return () => globalThis.clearTimeout(id);
  }, []);

  if (!ready) return null;

  return <ToolsFab />;
};

export default ToolsFabLoader;
