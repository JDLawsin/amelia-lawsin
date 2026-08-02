"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Heart, GitCompare, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/providers/FavoritesProvider";
import { useCompare } from "@/providers/CompareProvider";
import { BodyPortal } from "@/components/ui/BodyPortal";
import { IconTooltip } from "@/components/ui/IconTooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { toolsFabAnchorClassName } from "@/components/tools/tools-layout";

const FavoritesPanel = dynamic(
  () =>
    import("@/components/favorites/FavoritesPanel").then(
      (mod) => mod.FavoritesPanel,
    ),
  { ssr: false },
);

const ComparePanel = dynamic(
  () =>
    import("@/components/compare/ComparePanel").then((mod) => mod.ComparePanel),
  { ssr: false },
);

const CompareSheet = dynamic(
  () =>
    import("@/components/compare/CompareSheet").then((mod) => mod.CompareSheet),
  { ssr: false },
);

export const ToolsFab = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<"favorites" | "compare" | null>(
    null,
  );
  const [compareSheetOpen, setCompareSheetOpen] = useState(false);
  const { favorites } = useFavorites();
  const { compareSlugs } = useCompare();

  const totalCount = favorites.length + compareSlugs.length;

  const openTool = (tool: "favorites" | "compare") => {
    if (tool === "compare" && compareSlugs.length >= 2) {
      setActiveTool(null);
      setCompareSheetOpen(true);
      setMenuOpen(false);
      return;
    }

    setActiveTool(tool);
    setMenuOpen(false);
  };

  return (
    <BodyPortal>
      <div className={toolsFabAnchorClassName}>
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <IconTooltip label="Saved properties & compare">
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Open saved properties and compare"
                aria-expanded={menuOpen}
                className={cn(
                  "relative flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-ink text-white shadow-apple-lg hover:bg-ink/90 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink touch-manipulation",
                )}
              >
                <LayoutGrid className="w-5 h-5" aria-hidden="true" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-medium border-2 border-white tabular-nums">
                    {totalCount > 99 ? "99+" : totalCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
          </IconTooltip>
          <PopoverContent
            align="end"
            side="top"
            sideOffset={12}
            collisionPadding={16}
            className="w-56 p-2"
          >
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => openTool("favorites")}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left text-sm text-ink hover:bg-cloud transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                <Heart className="w-4 h-4 text-ink" aria-hidden="true" />
                <span className="flex-1">Saved Properties</span>
                {favorites.length > 0 && (
                  <span className="text-xs font-medium bg-ink/8 text-ink px-2 py-0.5 rounded-full tabular-nums">
                    {favorites.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => openTool("compare")}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left text-sm text-ink hover:bg-cloud transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                <GitCompare className="w-4 h-4 text-ink" aria-hidden="true" />
                <span className="flex-1">
                  {compareSlugs.length >= 2 ? "Compare Now" : "Compare"}
                </span>
                {compareSlugs.length > 0 && (
                  <span className="text-xs font-medium bg-ink/8 text-ink px-2 py-0.5 rounded-full tabular-nums">
                    {compareSlugs.length}
                  </span>
                )}
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {activeTool === "favorites" && (
        <FavoritesPanel open onClose={() => setActiveTool(null)} />
      )}
      {activeTool === "compare" && (
        <ComparePanel
          open
          onClose={() => setActiveTool(null)}
          onCompareNow={() => {
            setActiveTool(null);
            setCompareSheetOpen(true);
          }}
        />
      )}
      {compareSheetOpen && (
        <CompareSheet open onClose={() => setCompareSheetOpen(false)} />
      )}
    </BodyPortal>
  );
};
