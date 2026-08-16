import { SITE_CONFIG } from "@/constants";
import { normalizePhoneForWhatsApp } from "@/lib/inquiry-contact";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi Amelia! I'm interested in a property and would like more information.";

export const buildPropertyWhatsAppMessage = (
  title: string,
  shareUrl: string,
): string =>
  `Hi Amelia! I'm interested in: ${title}. ${shareUrl}`;

const getWhatsAppDigits = (): string | null =>
  SITE_CONFIG.whatsappNumber ?? normalizePhoneForWhatsApp(SITE_CONFIG.phone);

export const buildWhatsAppUrl = (message: string): string | null => {
  const digits = getWhatsAppDigits();
  if (!digits) return null;

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
};

export const buildPropertyWhatsAppUrl = (
  title: string,
  shareUrl: string,
): string | null => buildWhatsAppUrl(buildPropertyWhatsAppMessage(title, shareUrl));
