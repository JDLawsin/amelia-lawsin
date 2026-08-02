"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";

const TooltipProvider = dynamic(
  () =>
    import("@/components/ui/shadcn/tooltip").then((mod) => ({
      default: mod.TooltipProvider,
    })),
  { ssr: false },
);

type Props = {
  children: ReactNode;
};

export const PublicTooltipProvider = ({ children }: Props) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = () => setReady(true);

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(mount, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }

    const id = globalThis.setTimeout(mount, 800);
    return () => globalThis.clearTimeout(id);
  }, []);

  if (!ready) return children;

  return <TooltipProvider delayDuration={300}>{children}</TooltipProvider>;
};
