import { SITE_CONFIG } from "@/constants";

/** Tailwind class: show only below md (Call, SMS, Viber — poor desktop UX). */
export const MOBILE_ONLY_CLASS = "md:hidden";

/** Strip spaces for tel/sms hrefs. */
export const phoneTelHref = `tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`;

export const CONTACT_LABELS = {
  messenger: "Message on Messenger",
  messengerShort: "Message now →",
  whatsapp: "Chat on WhatsApp",
  whatsappShort: "Chat on WhatsApp →",
  call: "Call Amelia",
  callShort: "Call now →",
  sms: "Send SMS",
  smsShort: "Send SMS →",
  viber: "Chat on Viber",
  viberShort: "Chat on Viber →",
  email: "Send email",
  emailShort: "Send email →",
} as const;

export const buildMessengerUrl = (prefilledText?: string): string => {
  if (!prefilledText) return SITE_CONFIG.messengerUrl;
  return `${SITE_CONFIG.messengerUrl}?text=${encodeURIComponent(prefilledText)}`;
};

export const buildSmsUrl = (body?: string): string => {
  const digits = SITE_CONFIG.phone.replace(/\s/g, "");
  const normalized = digits.startsWith("+") ? digits : `+${digits}`;
  if (!body) return SITE_CONFIG.smsUrl;
  return `sms:${normalized}?body=${encodeURIComponent(body)}`;
};

export const buildPropertyInterestMessage = (title: string): string =>
  `Hi Amelia! I'm interested in: ${title}. Can you send me more details?`;

export const buildViberForwardUrl = (text: string): string =>
  `viber://forward?text=${encodeURIComponent(text)}`;
