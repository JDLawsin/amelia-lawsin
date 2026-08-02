"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/providers/FavoritesProvider";
import { IconTooltip } from "@/components/ui/IconTooltip";

type Props = {
  slug: string;
  className?: string;
  size?: "sm" | "md";
};

export const FavoriteButton = ({
  slug,
  className,
  size = "md",
}: Props) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(slug);
  const label = favorited ? "Remove from saved" : "Save property";

  return (
    <IconTooltip label={label}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(slug);
        }}
        aria-pressed={favorited}
        aria-label={label}
        className={cn(
          "flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-wire shadow-sm transition-colors hover:bg-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ink",
          size === "md" ? "w-9 h-9" : "w-8 h-8",
          className,
        )}
      >
        <Heart
          className={cn(
            "transition-colors",
            size === "md" ? "w-5 h-5" : "w-4 h-4",
            favorited ? "fill-current text-ink" : "text-ash",
          )}
        />
      </button>
    </IconTooltip>
  );
};
