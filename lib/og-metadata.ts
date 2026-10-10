import { OG_IMAGE_SIZE } from "@/lib/og-image";
import { ogPageIdForRoute } from "@/lib/og-pages";

type OgImageMetadata = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

/**
 * Maps a public route to its OG image URL.
 * Nested routes use API handlers so dynamic segments (e.g. /properties/[slug])
 * cannot shadow file-based opengraph-image paths.
 */
export function ogImagePath(routePath: string): string {
  const page = ogPageIdForRoute(routePath);
  if (page === "home") {
    return "/opengraph-image";
  }

  return `/api/og/${page}`;
}

export function ogImageMetadata(
  routePath: string,
  alt: string,
): OgImageMetadata[] {
  return [
    {
      url: ogImagePath(routePath),
      width: OG_IMAGE_SIZE.width,
      height: OG_IMAGE_SIZE.height,
      alt,
    },
  ];
}
