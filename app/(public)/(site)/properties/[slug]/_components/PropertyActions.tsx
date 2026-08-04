"use client";

import { CompareButton } from "@/components/tools/CompareButton";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";

type Props = {
  slug: string;
  size?: "sm" | "md";
};

const PropertyActions = ({ slug, size = "md" }: Props) => (
  <div className="flex items-center gap-2 rounded-xl border border-wire bg-cloud/50 p-1.5">
    <FavoriteButton slug={slug} size={size} />
    <CompareButton slug={slug} size={size} />
  </div>
);

export default PropertyActions;
