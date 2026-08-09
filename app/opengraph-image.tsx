import { createOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/og-image";
import { OG_PAGE_CONFIG } from "@/lib/og-pages";

const home = OG_PAGE_CONFIG.home;

export const alt = home.alt;
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function Image() {
  return createOgImage({
    title: home.title,
    subtitle: home.subtitle,
  });
}
