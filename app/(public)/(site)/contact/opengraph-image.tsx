import { createOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/og-image";
import { SITE_CONFIG } from "@/constants";

export const alt = `Contact ${SITE_CONFIG.name} — Real Estate Agent in Cebu`;
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function Image() {
  return createOgImage({
    title: "Get in Touch",
    subtitle: "Free consultation via Messenger, SMS, Viber, or email.",
  });
}
