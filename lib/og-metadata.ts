import { OG_IMAGE_SIZE } from "@/lib/og-image";

type OgImageMetadata = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

/** Maps a public route path to its generated opengraph-image URL. */
export function ogImagePath(routePath: string): string {
  if (routePath === "/") {
    return "/opengraph-image";
  }

  return `${routePath.replace(/\/$/, "")}/opengraph-image`;
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
