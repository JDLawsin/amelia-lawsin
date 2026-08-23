"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const ToolsFab = dynamic(
  () =>
    import("@/components/tools/ToolsFab").then((mod) => ({
      default: mod.ToolsFab,
    })),
  { ssr: false },
);

const ToolsFabLoader = () => (
  <Suspense fallback={null}>
    <ToolsFab />
  </Suspense>
);

export default ToolsFabLoader;
