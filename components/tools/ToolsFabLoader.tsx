"use client";

import dynamic from "next/dynamic";

const ToolsFab = dynamic(
  () =>
    import("@/components/tools/ToolsFab").then((mod) => ({
      default: mod.ToolsFab,
    })),
  { ssr: false },
);

const ToolsFabLoader = () => <ToolsFab />;

export default ToolsFabLoader;
