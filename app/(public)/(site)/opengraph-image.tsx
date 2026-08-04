import { createOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/og-image";
import { SITE_CONFIG } from "@/constants";

export const alt = `${SITE_CONFIG.name} — Licensed Real Estate Agent in Cebu`;
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function Image() {
  return createOgImage({
    title: "Find Your Home in Cebu",
    subtitle: `Condos, house & lot, and pre-selling properties with ${SITE_CONFIG.name}.`,
  });
}
