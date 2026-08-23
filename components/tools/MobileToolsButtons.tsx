"use client";

import { Heart, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { useFavorites } from "@/providers/FavoritesProvider";
import { useCompare } from "@/providers/CompareProvider";
import {
  dispatchOpenCompare,
  dispatchOpenFavorites,
} from "@/lib/tools-events";

const MobileToolsButtons = () => {
  const { favorites } = useFavorites();
  const { compareSlugs } = useCompare();

  return (
    <div className="flex items-center gap-1 md:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="relative h-10 w-10 shrink-0"
        aria-label="Saved properties"
        onClick={dispatchOpenFavorites}
      >
        <Heart className="size-5" aria-hidden="true" />
        {favorites.length > 0 && (
          <span className="absolute top-1 right-1 min-w-[1rem] h-4 px-0.5 flex items-center justify-center rounded-full bg-ink text-white text-[9px] font-medium tabular-nums">
            {favorites.length > 9 ? "9+" : favorites.length}
          </span>
        )}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="relative h-10 w-10 shrink-0"
        aria-label="Compare properties"
        onClick={dispatchOpenCompare}
      >
        <GitCompare className="size-5" aria-hidden="true" />
        {compareSlugs.length > 0 && (
          <span className="absolute top-1 right-1 min-w-[1rem] h-4 px-0.5 flex items-center justify-center rounded-full bg-ink text-white text-[9px] font-medium tabular-nums">
            {compareSlugs.length > 9 ? "9+" : compareSlugs.length}
          </span>
        )}
      </Button>
    </div>
  );
};

export default MobileToolsButtons;
