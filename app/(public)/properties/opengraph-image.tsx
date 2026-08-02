import { createOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/og-image";
import { SITE_CONFIG } from "@/constants";

export const alt = `Browse Cebu properties with ${SITE_CONFIG.name}`;
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function Image() {
  return createOgImage({
    title: "Browse Cebu Properties",
    subtitle: "Condos, houses, lots, and pre-selling listings across Cebu.",
  });
}
