import { SITE_CONFIG } from "@/constants";

export const DEFAULT_SITE_DESCRIPTION = `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}. Browse condos, house & lot, townhouses, and pre-selling properties across ${SITE_CONFIG.location}, with guidance on Pag-IBIG, bank, and in-house financing for buyers and OFWs.`;

const clamp = (text: string, max = 160) =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;

/** Always return a non-empty meta description (Lighthouse requires ≥1 character). */
export const ensureMetaDescription = (
  value: string | null | undefined,
  fallback: string,
): string => {
  const trimmed = value?.replace(/\s+/g, " ").trim();
  if (trimmed) return clamp(trimmed);
  return clamp(fallback);
};
