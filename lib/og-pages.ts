import { SITE_CONFIG } from "@/constants";

export type OgPageId = "home" | "properties" | "contact" | "about";

export const OG_PAGE_CONFIG: Record<
  OgPageId,
  { title: string; subtitle: string; alt: string }
> = {
  home: {
    title: "Licensed Real Estate Agent in Cebu",
    subtitle: SITE_CONFIG.tagline,
    alt: `${SITE_CONFIG.name} — Licensed Real Estate Agent in Cebu`,
  },
  properties: {
    title: "Browse Cebu Properties",
    subtitle: "Condos, houses, lots, and pre-selling listings across Cebu.",
    alt: `Browse Cebu properties with ${SITE_CONFIG.name}`,
  },
  contact: {
    title: "Get in Touch",
    subtitle: "Free consultation via Messenger, SMS, Viber, or email.",
    alt: `Contact ${SITE_CONFIG.name} — Real Estate Agent in Cebu`,
  },
  about: {
    title: "About Amelia Lawsin",
    subtitle: "10+ years helping buyers, OFWs, and investors in Cebu.",
    alt: `About ${SITE_CONFIG.name} — Licensed Real Estate Agent in Cebu`,
  },
};

const ROUTE_TO_PAGE: Record<string, OgPageId> = {
  "/": "home",
  "/properties": "properties",
  "/contact": "contact",
  "/about": "about",
};

export function ogPageIdForRoute(routePath: string): OgPageId {
  return ROUTE_TO_PAGE[routePath] ?? "home";
}
